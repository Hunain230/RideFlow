import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, DollarSign, User, MapPin, Settings, BarChart3, Activity, Shield, Star } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { toast } from '../../components/ui/Toast';
import { driverAPI } from '../../lib/driver';
import { fadeSlideUp } from '../../motion/presets';
import { ProfileEditModal } from '../../components/driver/ProfileEditModal';
import { VehicleForm, VehicleCard } from '../../components/driver/VehicleForm';
import { SafetyPanel } from '../../components/driver/SafetyPanel';
import { NotificationCenter } from '../../components/driver/NotificationCenter';
import { ConnectionStatus } from '../../components/driver/ConnectionStatus';
import { useWebSocket, useGeolocation } from '../../hooks/useWebSocket';
import { RatingModal } from '../../components/driver/RatingModal';

interface DriverStats {
  totalRides: number;
  completedRides: number;
  totalEarnings: number;
  averageRating: number;
  onlineHours: number;
}

interface RideRequest {
  id: number;
  customerName: string;
  pickupCity: string;
  dropoffCity: string;
  fare: number;
  vehicleType: string;
  timestamp: string;
}

export function DriverDashboard() {
  const [activeTab, setActiveTab] = useState('live');
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [vehicleFormOpen, setVehicleFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [profile, setProfile] = useState<any>({});
  
  // WebSocket integration
  const {
    isConnected,
    connectionStatus,
    goOnline: wsGoOnline,
    goOffline: wsGoOffline,
    acceptRide: wsAcceptRide,
    rejectRide: wsRejectRide,
    startRide: wsStartRide,
    completeRide: wsCompleteRide,
    reconnect
  } = useWebSocket({
    onNewRideRequest: (data) => {
      console.log('New ride request via WebSocket:', data);
      toast.info(`New ride request: ${data.customerName} in ${data.pickupCity}`, 5000);
    },
    onRideStatusUpdate: (data) => {
      console.log('Ride status update via WebSocket:', data);
    },
    onStatusUpdated: (data) => {
      console.log('Driver status update via WebSocket:', data);
    }
  });

  // Geolocation tracking
  const {
    location: currentLocation,
    getCurrentPosition
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 5000
  });

  // Driver stats (mock data for now)
  const [driverStats] = useState<DriverStats>({
    totalRides: 156,
    completedRides: 142,
    totalEarnings: 12450.75,
    averageRating: 4.8,
    onlineHours: 324
  });

  // Mock ride requests
  const [incomingRides] = useState<RideRequest[]>([
    {
      id: 1,
      customerName: 'John Doe',
      pickupCity: 'Karachi',
      dropoffCity: 'Lahore',
      fare: 850,
      vehicleType: 'Economy',
      timestamp: new Date().toISOString()
    }
  ]);

  // Mock active ride
  const [activeRide, setActiveRide] = useState<any>(null);

  const navItems = [
    { id: 'live', label: 'Live', icon: <Activity size={20} /> },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  const fetchProfile = async () => {
    try {
      const response = await driverAPI.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAcceptRide = (rideId: number) => {
    acceptRide(rideId, 5);
    setIncomingRides(prev => prev.filter(ride => ride.id !== rideId));
    setActiveRide({
      id: rideId,
      customerName: 'John Doe',
      pickupCity: 'Karachi',
      dropoffCity: 'Lahore',
      fare: 850,
      vehicleType: 'Economy',
      status: 'Accepted'
    });
    toast.success('Ride accepted successfully!');
  };

  const handleRejectRide = (rideId: number, reason: string) => {
    rejectRide(rideId, reason);
    setIncomingRides(prev => prev.filter(ride => ride.id !== rideId));
    toast.info('Ride rejected');
  };

  const handleStartRide = (rideId: number) => {
    startRide(rideId);
    setActiveRide(prev => ({ ...prev, status: 'InProgress', startTime: new Date().toISOString() }));
    toast.success('Ride started!');
  };

  const handleCompleteRide = (rideId: number) => {
    completeRide(rideId);
    setActiveRide(null);
    toast.success('Ride completed successfully!');
  };

  return (
    <DashboardLayout>
      <Sidebar items={navItems} activeId={activeTab} onSelect={setActiveTab} title="Driver Dashboard" />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8 pb-24 lg:pb-8 w-full max-w-[1200px] mx-auto">
        {/* Header with Enhanced Connection Status */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-display text-white mb-2">Driver Dashboard</h1>
            <p className="text-text-muted">Manage your rides and earnings</p>
          </div>
          <div className="flex items-center gap-4">
            <ConnectionStatus 
              isConnected={isConnected} 
              connectionStatus={connectionStatus}
              onReconnect={reconnect}
            />
            <Button variant="glass" onClick={() => setProfileEditOpen(true)}>
              <Settings size={20} className="mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-glass-bg-light/20 border border-glass-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Activity size={24} className="text-amber-500" />
              <div>
                <h3 className="text-lg font-display text-white">Total Rides</h3>
                <p className="text-2xl font-display text-white">{driverStats.totalRides}</p>
              </div>
            </div>
            <div className="text-sm text-text-muted">+12 this month</div>
          </div>
          <div className="bg-glass-bg-light/20 border border-glass-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Star size={24} className="text-success" />
              <div>
                <h3 className="text-lg font-display text-white">Completed Rides</h3>
                <p className="text-2xl font-display text-white">{driverStats.completedRides}</p>
              </div>
            </div>
            <div className="text-sm text-text-muted">+8 this month</div>
          </div>
          <div className="bg-glass-bg-light/20 border border-glass-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign size={24} className="text-amber-500" />
              <div>
                <h3 className="text-lg font-display text-white">Total Earnings</h3>
                <p className="text-2xl font-display text-white">PKR {driverStats.totalEarnings.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-sm text-text-muted">+15% this month</div>
          </div>
          <div className="bg-glass-bg-light/20 border border-glass-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Star size={24} className="text-success" />
              <div>
                <h3 className="text-lg font-display text-white">Average Rating</h3>
                <p className="text-2xl font-display text-white">★ {driverStats.averageRating.toFixed(1)}</p>
              </div>
            </div>
            <div className="text-sm text-text-muted">+0.2 this month</div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={fadeSlideUp}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full"
          >
            {activeTab === 'live' && (
              <div className="space-y-6">
                {/* Enhanced Connection Status */}
                <div className={`p-4 rounded-lg border ${isConnected ? 'bg-success/10 border-success/30' : 'bg-error/10 border-error/30'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-gray-400'}`} />
                      <div>
                        <h3 className={`text-white font-medium ${isConnected ? 'text-success' : 'text-gray-400'}`}>
                          {isConnected ? 'Connected' : 'Offline'}
                        </h3>
                        <p className="text-sm text-text-muted">
                          {isConnected 
                            ? 'Real-time connection established. All features active.'
                            : 'Connection lost. Attempting to reconnect...'}
                        </p>
                      </div>
                    </div>
                    {isConnected && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                        <span className="text-xs text-text-muted ml-2">Live updates enabled</span>
                      </div>
                    )}
                  </div>
                  {!isConnected && (
                    <Button variant="neon" size="sm" onClick={reconnect}>
                      Reconnect
                    </Button>
                  )}
                </div>

                {/* Incoming Ride Requests */}
                {incomingRides.length > 0 && !activeRide && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-display text-white mb-4">Incoming Ride Requests</h2>
                    <div className="grid gap-4">
                      {incomingRides.map((ride) => (
                        <motion.div
                          key={ride.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-glass-bg-light/20 border border-glass-border rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <Badge variant="success" className="mb-2">New Request</Badge>
                              <h3 className="text-lg font-display text-white">{ride.customerName}</h3>
                              <p className="text-sm text-text-muted">
                                {ride.pickupCity} → {ride.dropoffCity}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-text-muted mb-1">Est. Earnings</div>
                              <div className="text-2xl font-display text-amber-500">PKR {Math.round(ride.fare * 0.8)}</div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button variant="glass" className="flex-1 text-error hover:border-error" onClick={() => handleRejectRide(ride.id, 'Driver unavailable')}>
                              Decline
                            </Button>
                            <Button variant="neon" className="flex-1" onClick={() => handleAcceptRide(ride.id)}>
                              Accept
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Ride */}
                {activeRide && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-glass-bg-light/20 border border-glass-border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <Badge variant="success" className="mb-2">
                          Active Ride: {activeRide.status}
                        </Badge>
                        <h3 className="text-xl font-display text-white">{activeRide.customerName}</h3>
                      </div>
                      <Button variant="glass" size="sm" onClick={() => goOffline()}>
                        End Ride
                      </Button>
                    </div>
                      
                    <div className="flex flex-col gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-amber-500" />
                        <span className="text-white">{activeRide.pickupCity}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-success" />
                        <span className="text-white">{activeRide.dropoffCity}</span>
                      </div>
                    </div>
                      
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-text-muted">
                        <div>Fare: <span className="text-white font-medium">PKR {activeRide.fare}</span></div>
                        <div>Vehicle: <span className="text-white">{activeRide.vehicleType}</span></div>
                      </div>
                        
                      {activeRide.status === 'Accepted' && (
                        <Button variant="neon" className="w-full" onClick={() => handleStartRide(activeRide.id)}>
                          Start Ride
                        </Button>
                      )}
                      
                      {activeRide.status === 'InProgress' && (
                        <Button variant="glass" className="w-full" onClick={() => handleCompleteRide(activeRide.id)}>
                          Complete Ride
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Empty State when no rides */}
                {incomingRides.length === 0 && !activeRide && (
                  <div className="p-8 text-center bg-glass-bg-light/20 border border-glass-border rounded-lg">
                    <Activity size={48} className="text-text-muted mb-4" />
                    <h3 className="text-xl font-display text-white mb-2">No Active Rides</h3>
                    <p className="text-text-muted">
                      You're currently online and ready to receive ride requests.
                      Turn on availability to start accepting rides.
                    </p>
                    <Button variant="neon" onClick={wsGoOnline}>
                      Go Online
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'earnings' && <EarningsTab stats={driverStats} />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'profile' && (
              <ProfileTab 
                profile={profile}
                onEditProfile={() => setProfileEditOpen(true)}
                onAddVehicle={() => {
                  setEditingVehicle(null);
                  setVehicleFormOpen(true);
                }}
                onEditVehicle={(vehicle: any) => {
                  setEditingVehicle(vehicle);
                  setVehicleFormOpen(true);
                }}
                onUpdate={fetchProfile}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      <ProfileEditModal
        isOpen={profileEditOpen}
        onClose={() => setProfileEditOpen(false)}
        profile={profile}
        onUpdate={fetchProfile}
      />
      <VehicleForm
        isOpen={vehicleFormOpen}
        onClose={() => setVehicleFormOpen(false)}
        vehicle={editingVehicle}
        onUpdate={fetchProfile}
      />
    </DashboardLayout>
  );
}

// Tab Components
function EarningsTab({ stats }: { stats: DriverStats }) {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-glass-bg-light/20 border border-glass-border rounded-lg">
        <h2 className="text-2xl font-display text-white mb-6">Earnings Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-3">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Gross Earnings:</span>
                <span className="text-2xl font-display text-white">PKR {stats.totalEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Platform Commission (10%):</span>
                <span className="text-xl font-display text-amber-500">PKR {(stats.totalEarnings * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Net Earnings:</span>
                <span className="text-2xl font-display text-success">PKR {(stats.totalEarnings * 0.9).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-3">Performance Metrics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Average Rating:</span>
                <span className="text-xl font-display text-white">★ {stats.averageRating.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Completion Rate:</span>
                <span className="text-xl font-display text-white">{((stats.completedRides / stats.totalRides) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-glass-bg-light/20 border border-glass-border rounded-lg">
        <h2 className="text-2xl font-display text-white mb-6">Analytics Dashboard</h2>
        <div className="text-center text-text-muted mb-8">
          Analytics features coming soon...
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ profile, onEditProfile, onAddVehicle, onEditVehicle, onUpdate }: any) {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-glass-bg-light/20 border border-glass-border rounded-lg">
        <h2 className="text-2xl font-display text-white mb-6">Profile Settings</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
              <input
                type="text"
                value={profile.fullName || ''}
                className="w-full px-3 py-2 bg-glass-bg-light/10 border border-glass-border rounded-lg text-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Email</label>
              <input
                type="email"
                value={profile.email || ''}
                className="w-full px-3 py-2 bg-glass-bg-light/10 border border-glass-border rounded-lg text-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Phone</label>
              <input
                type="tel"
                value={profile.phoneNumber || ''}
                className="w-full px-3 py-2 bg-glass-bg-light/10 border border-glass-border rounded-lg text-white"
                readOnly
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-3">Vehicle Management</h3>
            <div className="flex gap-4">
              <Button variant="glass" onClick={onAddVehicle}>
                Add Vehicle
              </Button>
              <Button variant="glass" onClick={onEditProfile}>
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
