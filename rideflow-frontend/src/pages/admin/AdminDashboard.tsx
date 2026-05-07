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
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue (PKR)',
        data: [15000, 18000, 16000, 22000, 28000, 35000, 31000],
        borderColor: '#D97706',
        backgroundColor: 'rgba(217, 119, 6, 0.1)',
        tension: 0.4,
      }
    ]
  };

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
        <StatCard label="Total Revenue" value={165000} prefix="PKR " delta="+12%" />
        <StatCard label="Active Drivers" value={142} />
        <StatCard label="Rides Today" value={856} delta="+5%" />
        <StatCard label="Open Complaints" value={14} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard tier={1} className="p-6 lg:col-span-2">
          <h3 className="text-xl font-display mb-6">Revenue Overview</h3>
          <Line data={chartData} options={chartOptions} />
        </GlassCard>
        
        <GlassCard tier={1} className="p-6 lg:col-span-1 flex flex-col gap-4">
          <h3 className="text-xl font-display mb-2">Live Active Rides</h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="p-3 bg-glass-bg-light border border-glass-border rounded-radius-md text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-white">Ride #{1000 + i}</span>
                  <span className="text-amber-500 animate-pulse">In Progress</span>
                </div>
                <div className="text-text-muted">Ali K. → Sara M.</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function UsersTab() {
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
            {[1, 2, 3].map((u) => (
              <tr key={u} className="border-b border-glass-border hover:bg-white/5 transition-colors">
                <td className="p-4">#{u}</td>
                <td className="p-4 text-white">Example User {u}</td>
                <td className="p-4"><Badge variant="info">Rider</Badge></td>
                <td className="p-4"><Badge variant="success">Active</Badge></td>
                <td className="p-4 text-right"><Button variant="glass" size="sm">Edit</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

function DriversTab() {
  return (
    <GlassCard tier={1} className="p-6 h-[80vh] flex flex-col">
      <h3 className="text-xl font-display mb-6">Driver Approvals & Verification</h3>
      <div className="text-center text-text-muted mt-20">Mock Driver list...</div>
    </GlassCard>
  );
}

function PromosTab() {
  return (
    <GlassCard tier={1} className="p-6 h-[80vh] flex flex-col">
      <h3 className="text-xl font-display mb-6">Promocodes</h3>
      <div className="text-center text-text-muted mt-20">Mock Promos list...</div>
    </GlassCard>
  );
}

function ComplaintsTab() {
  return (
    <GlassCard tier={1} className="p-6 h-[80vh] flex flex-col">
      <h3 className="text-xl font-display mb-6">Complaints</h3>
      <div className="text-center text-text-muted mt-20">Mock Complaints list...</div>
    </GlassCard>
  );
}

function ReportsTab() {
  return (
    <GlassCard tier={1} className="p-6 h-[80vh] flex flex-col">
      <h3 className="text-xl font-display mb-6">System Reports</h3>
      <div className="text-center text-text-muted mt-20">Mock Reports...</div>
    </GlassCard>
  );
}
