import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, User, Clock } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import { GlassCard } from '../../components/ui/GlassCard';
import { FormInput } from '../../components/ui/FormInput';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { toast } from '../../components/ui/Toast';
import { riderAPI } from '../../lib/rider';
import { fadeSlideUp } from '../../motion/presets';

export function RiderDashboard() {
  const [activeTab, setActiveTab] = useState('book');

  const navItems = [
    { id: 'book', label: 'Book a Ride', icon: <Navigation size={20} /> },
    { id: 'trips', label: 'My Trips', icon: <Clock size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <DashboardLayout>
      <Sidebar items={navItems} activeId={activeTab} onSelect={setActiveTab} title="Rider" />
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
            {activeTab === 'book' && <BookTab />}
            {activeTab === 'trips' && <TripsTab />}
            {activeTab === 'profile' && <ProfileTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </DashboardLayout>
  );
}

function BookTab() {
  const [step, setStep] = useState(1);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [pickup, setPickup] = useState<number | null>(null);
  const [dropoff, setDropoff] = useState<number | null>(null);
  const [activeRideId, setActiveRideId] = useState<number | null>(null);
  const [rideState, setRideState] = useState<any>(null);

  useEffect(() => {
    riderAPI.getLocations().then(res => {
      setLocations(res.data.data);
      if (res.data.data.length >= 2) {
        setPickup(res.data.data[0].LocationID);
        setDropoff(res.data.data[1].LocationID);
      }
    }).catch(() => {});
    
    // Check if rider already has an active ride
    riderAPI.getRideHistory().then(res => {
      const active = res.data.data.find((r: any) => ['Requested', 'Accepted', 'InProgress'].includes(r.RideStatus));
      if (active) {
        setActiveRideId(active.RideID);
        setRideState(active);
        setStep(4);
      }
    });
  }, []);

  useEffect(() => {
    let interval: any;
    if (step === 4 && activeRideId) {
      interval = setInterval(async () => {
        try {
          const res = await riderAPI.getRideDetail(activeRideId);
          setRideState(res.data.data);
          if (res.data.data.RideStatus === 'Completed' || res.data.data.RideStatus === 'Cancelled') {
            clearInterval(interval);
            setStep(5); // Completion step
          }
        } catch(e) {}
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [step, activeRideId]);

  const handleBook = async () => {
    if (!pickup || !dropoff || !selectedVehicle) return toast.error('Please complete all selections');
    setLoading(true);
    try {
      const res = await riderAPI.requestRide({
        pickupLocationID: pickup,
        dropoffLocationID: dropoff,
        vehicleType: selectedVehicle.Type
      });
      setActiveRideId(res.data.data.rideID);
      toast.success('Ride requested! Finding your driver...');
      setStep(4);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to book ride');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!activeRideId) return;
    try {
      await riderAPI.cancelRide(activeRideId);
      toast.success('Ride cancelled');
      setStep(1);
      setActiveRideId(null);
      setRideState(null);
    } catch(err) { toast.error('Cannot cancel ride at this time'); }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      {step < 4 && (
        <div className="flex items-center gap-4 mb-4">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= s ? 'bg-amber-600 text-bg-base' : 'bg-glass-bg border border-glass-border text-text-muted'}`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-px ${step > s ? 'bg-amber-600' : 'bg-glass-border'}`} />}
            </div>
          ))}
        </div>
      )}

      {step === 1 && (
        <GlassCard tier={2} className="p-6 max-w-xl">
          <h3 className="text-xl font-display mb-6">Where to?</h3>
          <div className="flex flex-col gap-4 relative">
            <div className="absolute left-[19px] top-10 bottom-10 w-px border-l-2 border-dashed border-amber-500/30" />
            <div className="flex items-center gap-4">
              <MapPin className="text-amber-500 z-10 shrink-0" size={20} />
              <select className="w-full bg-glass-bg border border-glass-border rounded-radius-md px-4 py-2 text-white outline-none" value={pickup || ''} onChange={(e) => setPickup(Number(e.target.value))}>
                {locations.map(l => <option key={l.LocationID} value={l.LocationID} className="bg-bg-surface">{l.City} - {l.LocationName}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-success z-10 shrink-0" size={20} />
              <select className="w-full bg-glass-bg border border-glass-border rounded-radius-md px-4 py-2 text-white outline-none" value={dropoff || ''} onChange={(e) => setDropoff(Number(e.target.value))}>
                {locations.map(l => <option key={l.LocationID} value={l.LocationID} className="bg-bg-surface">{l.City} - {l.LocationName}</option>)}
              </select>
            </div>
            <Button className="mt-4" onClick={() => setStep(2)}>Continue</Button>
          </div>
        </GlassCard>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-display">Select Vehicle Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Economy', 'Business', 'Bike'].map(type => {
              const isSelected = selectedVehicle?.Type === type;
              return (
                <GlassCard 
                  key={type} 
                  tier={isSelected ? 'amber' : 1}
                  className={`p-6 cursor-pointer transition-all ${isSelected ? 'scale-105' : 'hover:border-amber-500/30'}`}
                  onClick={() => setSelectedVehicle({Type: type})}
                >
                  <div className="text-4xl mb-4">{type === 'Bike' ? '🏍️' : type === 'Business' ? '💼' : '🚗'}</div>
                  <h4 className="font-medium text-lg mb-1">{type}</h4>
                </GlassCard>
              )
            })}
          </div>
          <div className="flex gap-4">
            <Button variant="glass" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)} disabled={!selectedVehicle}>Confirm Selection</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GlassCard tier={1} className="h-[400px] flex items-center justify-center bg-[#111] overflow-hidden" style={{ transform: 'perspective(800px) rotateX(4deg)' }}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="relative z-10 flex flex-col items-center gap-2">
                <MapPin className="text-amber-500" size={40} />
                <span className="bg-glass-bg backdrop-blur-md px-3 py-1 rounded-full text-sm border border-glass-border">Route Ready</span>
              </div>
            </GlassCard>
          </div>
          <div className="flex flex-col gap-4">
            <GlassCard tier={2} className="p-6">
              <h3 className="text-xl font-display mb-4">Confirm Ride</h3>
              <div className="flex justify-between mb-2 text-sm"><span className="text-text-muted">Vehicle</span><span>{selectedVehicle?.Type}</span></div>
              <hr className="border-glass-border my-4" />
              <Button className="w-full" onClick={handleBook} loading={loading}>Book Now</Button>
              <Button variant="glass" className="w-full mt-2" onClick={() => setStep(2)}>Back</Button>
            </GlassCard>
          </div>
        </div>
      )}

      {step === 4 && rideState && (
        <GlassCard tier={3} className="max-w-md mx-auto p-8 text-center mt-12 border-amber-500/50">
          {rideState.RideStatus === 'Requested' ? (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mx-auto mb-6">
                <div className="w-4 h-4 bg-amber-500 rounded-full animate-pulse-glow" />
              </div>
              <h3 className="text-2xl font-display mb-2">Finding your driver</h3>
              <p className="text-text-muted mb-8">Please wait while we connect you to a nearby driver.</p>
              <Button variant="glass" className="w-full text-error border-error/30 hover:border-error" onClick={handleCancel}>Cancel Request</Button>
            </>
          ) : (
            <>
              <Badge variant="success" className="mb-4">Ride {rideState.RideStatus}</Badge>
              <h3 className="text-2xl font-display mb-2">Driver is on the way</h3>
              <div className="bg-glass-bg-light p-4 rounded-radius-md border border-glass-border my-6">
                <p className="text-amber-500 font-medium mb-1">Fare: PKR {rideState.Fare}</p>
              </div>
              <p className="text-text-muted text-sm">Please meet your driver at the pickup location.</p>
            </>
          )}
        </GlassCard>
      )}

      {step === 5 && rideState && (
        <GlassCard tier={3} className="max-w-md mx-auto p-8 text-center mt-12 border-success">
          <h3 className="text-2xl font-display mb-2 text-success">Ride {rideState.RideStatus}!</h3>
          <p className="text-text-muted mb-6">Thank you for riding with RideFlow.</p>
          <Button className="w-full" onClick={() => { setStep(1); setRideState(null); setActiveRideId(null); }}>Book Another Ride</Button>
        </GlassCard>
      )}
    </div>
  );
}

function TripsTab() {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    riderAPI.getRideHistory().then(res => {
      setRides(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalSpent = rides.filter(r => r.RideStatus === 'Completed').reduce((sum, r) => sum + Number(r.Fare), 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Rides" value={rides.length} />
        <StatCard label="Total Spent" value={totalSpent} prefix="PKR " />
      </div>

      <div className="flex gap-2">
        {['All', 'Completed', 'Cancelled', 'InProgress'].map(f => (
          <button key={f} className="px-4 py-1.5 rounded-full text-sm font-medium bg-glass-bg border border-glass-border text-text-secondary hover:text-white hover:bg-white/5 transition-colors">
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          Array.from({length: 3}).map((_, i) => <Skeleton key={i} variant="card" height="100px" />)
        ) : rides.length === 0 ? (
          <GlassCard tier={1} className="p-8 text-center text-text-muted">No rides found.</GlassCard>
        ) : (
          rides.map(r => (
            <GlassCard key={r.RideID} tier={1} className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full bg-glass-bg-light border border-glass-border flex items-center justify-center shrink-0">
                  🚗
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">Ride #{r.RideID}</span>
                    <Badge variant={r.RideStatus === 'Completed' ? 'success' : r.RideStatus === 'Cancelled' ? 'error' : 'warning'}>{r.RideStatus}</Badge>
                  </div>
                  <p className="text-sm text-text-muted">{new Date(r.StartTime || r.ScheduledTime).toLocaleDateString()} • PKR {r.Fare}</p>
                </div>
              </div>
              <Button variant="glass" size="sm">Details</Button>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}

function ProfileTab() {
  const [profile, setProfile] = useState<any>({});
  const [promos, setPromos] = useState<any[]>([]);

  useEffect(() => {
    riderAPI.getProfile().then((r: any) => setProfile(r.data.data)).catch(console.error);
    riderAPI.getMyPromos().then((r: any) => setPromos(r.data.data)).catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <GlassCard tier={3} className="p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-amber-600 text-bg-base flex items-center justify-center text-3xl font-display mb-4 shadow-glow">
            {profile.FullName?.charAt(0) || 'R'}
          </div>
          <h2 className="text-2xl font-medium text-white mb-1">{profile.FullName}</h2>
          <p className="text-text-muted mb-4">{profile.Email}</p>
          <Badge variant="success">Active Account</Badge>
        </GlassCard>
      </div>
      <div className="lg:col-span-2 flex flex-col gap-6">
        <GlassCard tier={1} className="p-6">
          <h3 className="text-xl font-display mb-6">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Full Name" defaultValue={profile.FullName || ''} readOnly />
            <FormInput label="Email" defaultValue={profile.Email || ''} className="md:col-span-2" readOnly />
          </div>
        </GlassCard>
        
        <GlassCard tier={1} className="p-6">
          <h3 className="text-xl font-display mb-6">Promocodes</h3>
          <div className="flex flex-col gap-3">
            {promos.length === 0 ? <p className="text-text-muted">No active promos.</p> : null}
            {promos.map(p => (
              <div key={p.PromoCodeID} className="flex items-center justify-between p-3 border border-amber-500/30 bg-amber-500/5 rounded-radius-md">
                <div>
                  <div className="font-medium text-amber-500">{p.Code}</div>
                  <div className="text-xs text-text-muted">{p.DiscountPercentage}% off</div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
