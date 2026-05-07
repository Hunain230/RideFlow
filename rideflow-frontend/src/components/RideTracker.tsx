import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  latitude: number;
  longitude: number;
}

interface RideData {
  rideId: string;
  status: string;
  pickupLocation: Location;
  dropoffLocation: Location;
}

interface RideTrackerProps {
  rideId: string;
  userId: string;
  userType: 'rider' | 'driver';
}

export const RideTracker: React.FC<RideTrackerProps> = ({ rideId, userId, userType }) => {
  const [driverLocation, setDriverLocation] = useState<Location | null>(null);
  const [rideData, setRideData] = useState<RideData | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeTracking = async () => {
      try {
        // Start ride tracking
        const startResponse = await fetch(`/api/rides/${rideId}/start-tracking`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!startResponse.ok) {
          throw new Error('Failed to start ride tracking');
        }

        // Get initial ride data
        const trackingResponse = await fetch(`/api/rides/${rideId}/tracking`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!trackingResponse.ok) {
          throw new Error('Failed to get ride data');
        }

        const trackingData = await trackingResponse.json();
        setRideData(trackingData.ride);
        setDriverLocation(trackingData.driverLocation);

        // Initialize WebSocket connection
        const wsUrl = `ws://localhost:8080?userId=${userId}&userType=${userType}`;
        const websocket = new WebSocket(wsUrl);
        
        websocket.onopen = () => {
          console.log('WebSocket connected for ride tracking');
        };

        websocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'driver_location') {
            setDriverLocation(data.location);
          }
        };

        websocket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError('Connection error. Real-time tracking may be unavailable.');
        };

        websocket.onclose = () => {
          console.log('WebSocket connection closed');
        };

        setWs(websocket);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize tracking');
        setLoading(false);
      }
    };

    initializeTracking();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [rideId, userId, userType]);

  // Periodically update ride data
  useEffect(() => {
    const interval = setInterval(async () => {
      if (rideId) {
        try {
          const response = await fetch(`/api/rides/${rideId}/tracking`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setRideData(data.ride);
            setDriverLocation(data.driverLocation);
          }
        } catch (error) {
          console.error('Failed to update ride data:', error);
        }
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [rideId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ride tracker...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-600">
          <p className="mb-2">⚠️ {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!rideData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">No ride data available</p>
      </div>
    );
  }

  // Calculate map center
  const centerLat = driverLocation?.latitude || rideData.pickupLocation.latitude;
  const centerLng = driverLocation?.longitude || rideData.pickupLocation.longitude;

  // Calculate route polyline if driver location exists
  const routePoints: [number, number][] = driverLocation ? [
    [driverLocation.latitude, driverLocation.longitude],
    [rideData.pickupLocation.latitude, rideData.pickupLocation.longitude],
    [rideData.dropoffLocation.latitude, rideData.dropoffLocation.longitude]
  ] : [
    [rideData.pickupLocation.latitude, rideData.pickupLocation.longitude],
    [rideData.dropoffLocation.latitude, rideData.dropoffLocation.longitude]
  ];

  return (
    <div className="ride-tracker">
      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Ride Tracking</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            rideData.status === 'In Progress' ? 'bg-green-100 text-green-800' :
            rideData.status === 'Accepted' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {rideData.status}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          <p>Ride ID: {rideId}</p>
          {driverLocation && (
            <p>Driver Last Updated: {new Date().toLocaleTimeString()}</p>
          )}
        </div>
      </div>

      <div className="h-96 rounded-lg overflow-hidden shadow-lg">
        <MapContainer 
          center={[centerLat, centerLng]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {driverLocation && (
            <Marker 
              position={[driverLocation.latitude, driverLocation.longitude]}
            >
              <div>Driver Location</div>
            </Marker>
          )}
          
          <Marker 
            position={[rideData.pickupLocation.latitude, rideData.pickupLocation.longitude]}
          >
            <div>Pickup Location</div>
          </Marker>
          
          <Marker 
            position={[rideData.dropoffLocation.latitude, rideData.dropoffLocation.longitude]}
          >
            <div>Dropoff Location</div>
          </Marker>

          <Polyline 
            positions={routePoints}
          />
        </MapContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Pickup</span>
          </div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Driver</span>
          </div>
        </div>
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Dropoff</span>
          </div>
        </div>
      </div>
    </div>
  );
};
