import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, DollarSign, User, MapPin } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { Toggle } from '../../components/ui/Toggle';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { toast } from '../../components/ui/Toast';
import { driverAPI } from '../../lib/driver';
import { fadeSlideUp } from '../../motion/presets';

export function DriverDashboard() {
  const [activeTab, setActiveTab] = useState('live');

  const navItems = [
    { id: 'live', label: 'Live', icon: <Radio size={20} /> },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <DashboardLayout>
      <Sidebar items={navItems} activeId={activeTab} onSelect={setActiveTab} title="Driver" />
      <main className="flex-1 lg:ml-64 p-4 md:p-8 pb-24 lg:pb-8 w-full max-w-[1200px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={fadeSlideUp}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full"
          >
            {activeTab === 'live' && <LiveTab />}
            {activeTab === 'earnings' && <EarningsTab />}
            {activeTab === 'profile' && <ProfileTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </DashboardLayout>
  );
}

function LiveTab() {
  const [isOnline, setIsOnline] = useState(false);
  const [incomingRide, setIncomingRide] = useState<any>(null);
  const [activeRide, setActiveRide] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);

  // Fetch status and active rides on mount
  useEffect(() => {
    const init = async () => {
      try {
        const [profRes, vehRes, myRidesRes] = await Promise.all([
          driverAPI.getProfile(),
          driverAPI.getVehicles(),
          driverAPI.getMyRides()
        ]);
        const prof = profRes.data.data;
        setIsOnline(prof.AvailabilityStatus === 'Online' || prof.AvailabilityStatus === 'In-Ride');
        setVehicles(vehRes.data.data);
        
        const myRides = myRidesRes.data.data;
        const active = myRides.find((r: any) => ['Accepted', 'InProgress'].includes(r.RideStatus));
        if (active) setActiveRide(active);
      } catch (err) {
        console.error('Failed to load live data', err);
      }
    };
    init();
  }, []);

  // Polling for incoming rides if online and no active ride
  useEffect(() => {
    let interval: any;
    if (isOnline && !activeRide && !incomingRide) {
      interval = setInterval(async () => {
        try {
          const res = await driverAPI.getIncomingRides();
          if (res.data.data && res.data.data.length > 0) {
            setIncomingRide(res.data.data[0]); // Just take the first available
          }
        } catch (e) {}
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isOnline, activeRide, incomingRide]);

  const toggleOnline = async (checked: boolean) => {
    try {
      await driverAPI.setAvailability(checked ? 'Online' : 'Offline');
      setIsOnline(checked);
      if (checked) toast.info("You're online. Waiting for rides...");
      else setIncomingRide(null);
    } catch (err) {
      toast.error('Failed to change status');
    }
  };

  const handleAccept = async () => {
    try {
      const v = vehicles.find(v => v.VerificationStatus === 'Verified');
      if (!v) return toast.error('You need a verified vehicle to accept rides');
      await driverAPI.acceptRide(incomingRide.RideID, v.VehicleID);
      const res = await driverAPI.getMyRides();
      setActiveRide(res.data.data.find((r: any) => r.RideID === incomingRide.RideID));
      setIncomingRide(null);
      toast.success('Ride accepted!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to accept ride');
      setIncomingRide(null); // maybe someone else took it
    }
  };

  const handleStart = async () => {
    try {
      await driverAPI.startRide(activeRide.RideID);
      setActiveRide({ ...activeRide, RideStatus: 'InProgress' });
      toast.success('Ride started');
    } catch (err) { toast.error('Failed to start'); }
  }

  const handleComplete = async () => {
    try {
      await driverAPI.completeRide(activeRide.RideID);
      setActiveRide(null);
      toast.success('Ride completed! Earnings added to wallet.');
    } catch (err) {
      toast.error('Failed to complete ride');
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <GlassCard tier={2} className="p-8 flex flex-col items-center justify-center text-center py-16">
        <div className="relative mb-8 scale-150">
          <Toggle checked={isOnline} onChange={toggleOnline} />
          {isOnline && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-success rounded-full border-2 border-bg-surface animate-pulse-glow" />
          )}
        </div>
        <h2 className="text-3xl font-display mb-2">{isOnline ? "You're Online" : "You're Offline"}</h2>
        <p className="text-text-muted">{isOnline ? 'Searching for nearby riders...' : 'Go online to start receiving ride requests'}</p>
      </GlassCard>

      <AnimatePresence>
        {incomingRide && !activeRide && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', bounce: 0.5 } }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <GlassCard tier="amber" className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Badge variant="warning" className="mb-2">New Request</Badge>
                  <h3 className="text-2xl font-display text-white">{incomingRide.RiderName}</h3>
                </div>
                <div className="text-right">
                  <div className="text-sm text-text-muted">Est. Earnings</div>
                  <div className="text-2xl font-medium text-amber-500">PKR {Math.round(incomingRide.Fare * 0.8)}</div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 mb-8">
                <div className="flex items-center gap-3"><MapPin size={16} className="text-amber-500" /> <span className="text-white">{incomingRide.PickupCity} - {incomingRide.PickupStreet}</span></div>
                <div className="flex items-center gap-3"><MapPin size={16} className="text-success" /> <span className="text-white">{incomingRide.DropoffCity}</span></div>
              </div>

              <div className="flex gap-4">
                <Button variant="glass" className="flex-1 text-error hover:border-error" onClick={() => setIncomingRide(null)}>Decline</Button>
                <Button variant="neon" className="flex-1" onClick={handleAccept}>Accept Ride</Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeRide && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassCard tier={3} className="p-6 border-amber-500/50">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <Badge variant="success" className="mb-2">Active Ride: {activeRide.RideStatus}</Badge>
                  <h3 className="text-xl font-display">{activeRide.RiderName}</h3>
                </div>
              </div>
              <div className="flex flex-col gap-3 mb-8">
                <div className="flex items-center gap-3"><MapPin size={16} className="text-amber-500" /> <span className="text-white">{activeRide.PickupCity}</span></div>
                <div className="flex items-center gap-3"><MapPin size={16} className="text-success" /> <span className="text-white">{activeRide.DropoffCity}</span></div>
              </div>
              {activeRide.RideStatus === 'Accepted' ? (
                <Button className="w-full" onClick={handleStart}>Start Ride</Button>
              ) : (
                <Button variant="neon" className="w-full" onClick={handleComplete}>Complete Ride</Button>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EarningsTab() {
  const [wallet, setWallet] = useState<any>({});
  const [earnings, setEarnings] = useState<any>({});
  const [ridesCount, setRidesCount] = useState(0);

  const fetchData = async () => {
    try {
      const [wRes, eRes, rRes] = await Promise.all([
        driverAPI.getWallet(),
        driverAPI.getEarnings(),
        driverAPI.getMyRides()
      ]);
      setWallet(wRes.data.data || {});
      setEarnings(eRes.data.data || {});
      const completed = rRes.data.data.filter((r: any) => r.RideStatus === 'Completed').length;
      setRidesCount(completed);
    } catch (e) {}
  };

  useEffect(() => { fetchData(); }, []);

  const requestPayout = async () => {
    try {
      await driverAPI.requestPayout();
      toast.success('Payout requested successfully!');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to request payout');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Wallet Balance" value={wallet.WalletBalance || 0} prefix="PKR " />
        <StatCard label="Completed Rides" value={ridesCount} />
        <StatCard label="Gross Earnings" value={earnings.TotalFare || 0} prefix="PKR " />
        <StatCard label="Net Earnings" value={earnings.NetEarnings || 0} prefix="PKR " />
      </div>

      <GlassCard tier={1} className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display">Earnings Management</h3>
          <Button size="sm" onClick={requestPayout}>Request Payout</Button>
        </div>
      </GlassCard>
    </div>
  );
}

function ProfileTab() {
  const [profile, setProfile] = useState<any>({});
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    driverAPI.getProfile().then(r => setProfile(r.data.data)).catch(console.error);
    driverAPI.getVehicles().then(r => setVehicles(r.data.data)).catch(console.error);
  }, []);

  if (!profile.DriverID) return null;

  return (
    <GlassCard tier={1} className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-glass-border">
        <div className="w-20 h-20 rounded-full bg-amber-600 flex items-center justify-center text-2xl font-display text-bg-base">
          {profile.FullName?.charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-display text-white mb-1">{profile.FullName}</h2>
          <div className="flex gap-2 mt-2">
            <Badge variant={profile.VerificationStatus === 'Verified' ? 'success' : 'warning'}>{profile.VerificationStatus}</Badge>
            <Badge variant="info">{profile.CurrentCity || 'Unknown Location'}</Badge>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Registered Vehicles</h3>
        <Button variant="glass" size="sm">Add Vehicle</Button>
      </div>
      
      <div className="flex flex-col gap-3">
        {vehicles.length === 0 ? <p className="text-text-muted text-sm">No vehicles registered.</p> : null}
        {vehicles.map(v => (
          <div key={v.VehicleID} className="p-4 border border-glass-border rounded-radius-md bg-glass-bg-light flex justify-between items-center">
            <div>
              <div className="font-medium text-white">{v.Make} {v.Model} ({v.Year})</div>
              <div className="text-sm text-text-muted">{v.LicensePlate} • {v.VehicleType}</div>
            </div>
            <Badge variant={v.VerificationStatus === 'Verified' ? 'success' : 'warning'}>{v.VerificationStatus}</Badge>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
