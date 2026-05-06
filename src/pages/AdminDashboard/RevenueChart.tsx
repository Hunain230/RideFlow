import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const revenue = [48000, 55000, 62000, 58000, 71000, 82000, 78000];

export function RevenueChart() {
  const data = {
    labels: months,
    datasets: [
      {
        label: 'Revenue',
        data: revenue,
        borderColor: '#D97706',
        borderWidth: 2,
        backgroundColor: (ctx: { chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } } }) => {
          const { chart } = ctx;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return 'transparent';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, 'rgba(217,119,6,0.22)');
          g.addColorStop(1, 'rgba(217,119,6,0.01)');
          return g;
        },
        fill: true,
        tension: 0.45,
        pointBackgroundColor: '#D97706',
        pointBorderColor: '#0A0908',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(26,25,23,0.92)',
        borderColor: 'rgba(217,119,6,0.35)',
        borderWidth: 1,
        titleColor: '#A89880',
        bodyColor: '#F5F0E8',
        callbacks: {
          label: (ctx: { raw: unknown }) => ` $${Number(ctx.raw).toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: { color: '#5C5245', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: {
          color: '#5C5245',
          font: { size: 11 },
          callback: (v: unknown) => `$${(Number(v) / 1000).toFixed(0)}k`,
        },
        border: { display: false, dash: [4, 4] },
      },
    },
  };

  return (
    <div className="glass-1 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-warm-white">Revenue Overview</h3>
        <div className="flex gap-2">
          {['Today', 'Week', 'Month'].map((p) => (
            <button
              key={p}
              className="text-xs px-3 py-1.5 rounded-full glass-2 text-warm-muted hover:text-amber-400 hover:border-amber-600/30 transition-all border border-transparent"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[220px]">
        <Line data={data} options={options as Parameters<typeof Line>[0]['options']} />
      </div>
    </div>
  );
}
