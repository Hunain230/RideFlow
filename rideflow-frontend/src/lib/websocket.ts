// lib/websocket.ts
// WebSocket client for real-time ride updates

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private pingInterval: number | null = null;

  constructor() {
    this.setupMessageHandlers();
  }

  private setupMessageHandlers() {
    // Default message handlers
    this.messageHandlers.set('ride_update', (data) => {
      console.log('Ride update received:', data);
    });

    this.messageHandlers.set('notification', (data) => {
      console.log('Notification received:', data);
    });

    this.messageHandlers.set('driver_location', (data) => {
      console.log('Driver location update:', data);
    });

    this.messageHandlers.set('connected', (data) => {
      console.log('WebSocket connected:', data.message);
    });

    this.messageHandlers.set('pong', () => {
      console.log('WebSocket pong received');
    });
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      const token = useAuthStore.getState().token;
      if (!token) {
        reject(new Error('No authentication token available'));
        return;
      }

      this.isConnecting = true;

      // Construct WebSocket URL with token
      const wsUrl = `ws://localhost:5000?token=${token}`;
      
      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startPingInterval();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (err) {
            console.error('Failed to parse WebSocket message:', err);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnecting = false;
          this.stopPingInterval();
          
          // Attempt to reconnect if not a normal closure
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

      } catch (err) {
        this.isConnecting = false;
        reject(err);
      }
    });
  }

  private handleMessage(data: any) {
    const handler = this.messageHandlers.get(data.type);
    if (handler) {
      handler(data);
    } else {
      console.log('Unhandled WebSocket message:', data);
    }
  }

  private scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(err => {
        console.error('Reconnection failed:', err);
      });
    }, delay);
  }

  private startPingInterval() {
    this.pingInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, 30000); // Ping every 30 seconds
  }

  private stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  subscribeToRide(rideID: number) {
    this.send({ type: 'subscribe_ride', rideID });
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected, message not sent:', data);
    }
  }

  disconnect() {
    this.stopPingInterval();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Register custom message handler
  onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
  }

  // Remove message handler
  offMessage(type: string) {
    this.messageHandlers.delete(type);
  }
}

// Create singleton instance
export const wsClient = new WebSocketClient();

// React hook for WebSocket
export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleMessage = (data: any) => setLastMessage(data);

    wsClient.onMessage('connected', handleConnect);
    wsClient.onMessage('ride_update', handleMessage);
    wsClient.onMessage('notification', handleMessage);
    wsClient.onMessage('driver_location', handleMessage);

    // Connect if not already connected
    if (!wsClient.isConnected()) {
      wsClient.connect().catch(err => {
        console.error('Failed to connect WebSocket:', err);
      });
    }

    return () => {
      wsClient.offMessage('connected');
      wsClient.offMessage('ride_update');
      wsClient.offMessage('notification');
      wsClient.offMessage('driver_location');
    };
  }, []);

  return {
    isConnected,
    lastMessage,
    subscribeToRide: wsClient.subscribeToRide.bind(wsClient),
    send: wsClient.send.bind(wsClient),
    disconnect: wsClient.disconnect.bind(wsClient)
  };
}
