import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Car, Tag, MessageSquare, BarChart2 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { adminAPI } from '../../lib/admin';
import { fadeSlideUp } from '../../motion/presets';
import { toast } from '../../components/ui/Toast';
import { Skeleton } from '../../components/ui/Skeleton';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'drivers', label: 'Drivers', icon: <Car size={20} /> },
    { id: 'promos', label: 'Promo Codes', icon: <Tag size={20} /> },
    { id: 'complaints', label: 'Complaints', icon: <MessageSquare size={20} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart2 size={20} /> },
  ];

  return (
    <DashboardLayout>
      <Sidebar items={navItems} activeId={activeTab} onSelect={setActiveTab} title="Admin Portal" />
      <main className="flex-1 lg:ml-64 p-4 md:p-8 pb-24 lg:pb-8 w-full max-w-[1400px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={fadeSlideUp}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full"
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'drivers' && <DriversTab />}
            {activeTab === 'promos' && <PromosTab />}
            {activeTab === 'complaints' && <ComplaintsTab />}
            {activeTab === 'reports' && <ReportsTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </DashboardLayout>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState({ revenue: 0, drivers: 0, rides: 0, complaints: 0 });
  const [activeRides, setActiveRides] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [revRes, ridesRes, userRes, complRes] = await Promise.all([
          adminAPI.revenueByCity(),
          adminAPI.activeRides(),
          adminAPI.getDrivers(),
          adminAPI.getComplaints('Open')
        ]);
        
        const rev = revRes.data.data;
        const totalRevenue = rev.reduce((acc: number, cur: any) => acc + Number(cur.NetRevenue_PKR || 0), 0);
        
        const drivers = userRes.data.data;
        const activeDriversCount = drivers.filter((d: any) => d.AvailabilityStatus === 'Online').length;
        
        setStats({
          revenue: totalRevenue,
          drivers: activeDriversCount,
          rides: ridesRes.data.data.length,
          complaints: complRes.data.data.length
        });

        setActiveRides(ridesRes.data.data);

        // Chart mapping (simplified using cities as labels instead of days for demo)
        setChartData({
          labels: rev.map((r: any) => r.City),
          datasets: [{
            label: 'Net Revenue (PKR)',
            data: rev.map((r: any) => Number(r.NetRevenue_PKR || 0)),
            borderColor: '#D97706',
            backgroundColor: 'rgba(217, 119, 6, 0.1)',
            tension: 0.4,
          }]
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchOverview();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#A89880' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#A89880' } },
    },
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={stats.revenue} prefix="PKR " />
        <StatCard label="Active Drivers" value={stats.drivers} />
        <StatCard label="Active Rides" value={stats.rides} />
        <StatCard label="Open Complaints" value={stats.complaints} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard tier={1} className="p-6 lg:col-span-2 min-h-[300px]">
          <h3 className="text-xl font-display mb-6">Revenue by City</h3>
          {chartData ? <Line data={chartData} options={chartOptions} /> : <Skeleton variant="card" height="200px" />}
        </GlassCard>
        
        <GlassCard tier={1} className="p-6 lg:col-span-1 flex flex-col gap-4 max-h-[400px]">
          <h3 className="text-xl font-display mb-2">Live Active Rides</h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3">
            {activeRides.length === 0 ? <p className="text-text-muted text-sm">No active rides at the moment.</p> : null}
            {activeRides.map(r => (
              <div key={r.RideID} className="p-3 bg-glass-bg-light border border-glass-border rounded-radius-md text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-white">Ride #{r.RideID}</span>
                  <span className="text-amber-500 animate-pulse">{r.RideStatus}</span>
                </div>
                <div className="text-text-muted">{r.RiderName} → {r.DriverName || 'Pending'}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  
  const fetchUsers = () => adminAPI.getUsers().then(r => setUsers(r.data.data)).catch(console.error);
  useEffect(() => { fetchUsers(); }, []);

  const toggleStatus = async (u: any) => {
    const newStatus = u.AccountStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await adminAPI.updateUserStatus(u.UserID, newStatus);
      toast.success(`User ${newStatus}`);
      fetchUsers();
    } catch (e) { toast.error('Failed to update status'); }
  };

  return (
    <GlassCard tier={1} className="p-6 h-[80vh] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-display">Manage Users</h3>
        <input type="text" placeholder="Search users..." className="bg-glass-bg border border-glass-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-amber-500" />
      </div>
      <div className="flex-1 overflow-auto rounded-radius-md border border-glass-border">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-glass-bg-light text-text-muted border-b border-glass-border sticky top-0">
            <tr>
              <th className="p-4 font-medium">User ID</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.UserID} className="border-b border-glass-border hover:bg-white/5 transition-colors">
                <td className="p-4">#{u.UserID}</td>
                <td className="p-4 text-white">{u.FullName}</td>
                <td className="p-4"><Badge variant="info">{u.Role}</Badge></td>
                <td className="p-4"><Badge variant={u.AccountStatus === 'Active' ? 'success' : 'error'}>{u.AccountStatus}</Badge></td>
                <td className="p-4 text-right">
                  <Button variant="glass" size="sm" onClick={() => toggleStatus(u)}>
                    {u.AccountStatus === 'Active' ? 'Suspend' : 'Activate'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

function DriversTab() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const fetchDrivers = () => adminAPI.getDrivers().then(r => setDrivers(r.data.data)).catch(console.error);
  useEffect(() => { fetchDrivers(); }, []);

  const verify = async (id: number) => {
    try {
      await adminAPI.verifyDriver(id, 'Verified');
      toast.success('Driver verified');
      fetchDrivers();
    } catch { toast.error('Failed to verify'); }
  };

  return (
    <GlassCard tier={1} className="p-6 h-[80vh] flex flex-col">
      <h3 className="text-xl font-display mb-6">Driver Approvals & Verification</h3>
      <div className="flex-1 overflow-auto rounded-radius-md border border-glass-border">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-glass-bg-light text-text-muted border-b border-glass-border sticky top-0">
            <tr>
              <th className="p-4 font-medium">Driver ID</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">License</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.DriverID} className="border-b border-glass-border hover:bg-white/5 transition-colors">
                <td className="p-4">#{d.DriverID}</td>
                <td className="p-4 text-white">{d.DriverName}</td>
                <td className="p-4">{d.LicenseNumber}</td>
                <td className="p-4"><Badge variant={d.VerificationStatus === 'Verified' ? 'success' : 'warning'}>{d.VerificationStatus}</Badge></td>
                <td className="p-4 text-right">
                  {d.VerificationStatus !== 'Verified' && (
                    <Button variant="glass" size="sm" onClick={() => verify(d.DriverID)}>Approve</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

function PromosTab() {
  const [promos, setPromos] = useState<any[]>([]);
  useEffect(() => { adminAPI.getPromoCodes().then(r => setPromos(r.data.data)).catch(console.error); }, []);

  return (
    <GlassCard tier={1} className="p-6 h-[80vh] flex flex-col">
      <h3 className="text-xl font-display mb-6">Promocodes</h3>
      <div className="flex-1 overflow-auto rounded-radius-md border border-glass-border">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-glass-bg-light text-text-muted border-b border-glass-border sticky top-0">
            <tr>
              <th className="p-4 font-medium">Code</th>
              <th className="p-4 font-medium">Discount</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Usage</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p.PromoCodeID} className="border-b border-glass-border hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-amber-500">{p.Code}</td>
                <td className="p-4">{p.DiscountPercentage}%</td>
                <td className="p-4"><Badge variant={p.Status === 'Active' ? 'success' : 'error'}>{p.Status}</Badge></td>
                <td className="p-4 text-text-muted">{p.UsageCount} / {p.UsageLimit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

function ReportsTab() {
  const [topD, setTopD] = useState<any[]>([]);
  const [leader, setLeader] = useState<any[]>([]);

  useEffect(() => {
    adminAPI.topDrivers().then(r => setTopD(r.data.data)).catch(console.error);
    adminAPI.leaderboard().then(r => setLeader(r.data.data)).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-6 h-[80vh] overflow-y-auto pr-4 custom-scrollbar">
      <GlassCard tier={1} className="p-6">
        <h3 className="text-xl font-display mb-4">Top Drivers by Earnings</h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {topD.map((d, i) => (
            <GlassCard key={i} tier={2} className="min-w-[250px] p-4 flex flex-col items-center shrink-0">
              <div className="text-3xl mb-2">🏆</div>
              <h4 className="font-medium text-white">{d.DriverName}</h4>
              <p className="text-sm text-amber-500 font-medium my-1">PKR {Number(d.TotalEarnings || 0).toLocaleString()}</p>
              <p className="text-xs text-text-muted">{d.TotalRides} Completed Rides</p>
            </GlassCard>
          ))}
        </div>
      </GlassCard>

      <GlassCard tier={1} className="p-6">
        <h3 className="text-xl font-display mb-4">City Leaderboard (Top Ratings)</h3>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-glass-bg-light text-text-muted border-b border-glass-border">
            <tr>
              <th className="p-4 font-medium">City</th>
              <th className="p-4 font-medium">Driver</th>
              <th className="p-4 font-medium">Rating</th>
              <th className="p-4 font-medium">Rides</th>
            </tr>
          </thead>
          <tbody>
            {leader.map((l, i) => (
              <tr key={i} className="border-b border-glass-border hover:bg-white/5 transition-colors">
                <td className="p-4">{l.City}</td>
                <td className="p-4 text-white">{l.DriverName}</td>
                <td className="p-4 font-medium text-amber-500">{Number(l.AvgRating).toFixed(1)} ★</td>
                <td className="p-4 text-text-muted">{l.TotalRides}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}

function ComplaintsTab() {
  const [complaints, setComplaints] = useState<any[]>([]);
  useEffect(() => { adminAPI.getComplaints().then(r => setComplaints(r.data.data)).catch(console.error); }, []);

  const resolve = async (id: number) => {
    try {
      await adminAPI.updateComplaint(id, 'Resolved');
      toast.success('Complaint resolved');
      adminAPI.getComplaints().then(r => setComplaints(r.data.data));
    } catch { toast.error('Failed'); }
  };

  return (
    <GlassCard tier={1} className="p-6 h-[80vh] flex flex-col">
      <h3 className="text-xl font-display mb-6">Complaints</h3>
      <div className="flex-1 overflow-auto rounded-radius-md border border-glass-border">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-glass-bg-light text-text-muted border-b border-glass-border sticky top-0">
            <tr>
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Filed By</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.ComplaintID} className="border-b border-glass-border hover:bg-white/5 transition-colors">
                <td className="p-4">#{c.ComplaintID}</td>
                <td className="p-4">{c.FiledBy} <span className="text-text-muted text-xs">({c.Role})</span></td>
                <td className="p-4 whitespace-normal max-w-xs">{c.Description}</td>
                <td className="p-4"><Badge variant={c.ComplaintStatus === 'Resolved' ? 'success' : c.ComplaintStatus === 'Dismissed' ? 'error' : 'warning'}>{c.ComplaintStatus}</Badge></td>
                <td className="p-4 text-right">
                  {c.ComplaintStatus === 'Open' && (
                    <Button variant="glass" size="sm" onClick={() => resolve(c.ComplaintID)}>Resolve</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

