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

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const earnings = [62, 89, 74, 95, 110, 124, 98];

export function EarningsChart() {
  const data = {
    labels,
    datasets: [
      {
        label: 'Earnings ($)',
        data: earnings,
        borderColor: '#D97706',
        backgroundColor: (ctx: { chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } } }) => {
          const { chart } = ctx;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return 'transparent';
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(217,119,6,0.25)');
          gradient.addColorStop(1, 'rgba(217,119,6,0.01)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#D97706',
        pointBorderColor: '#0A0908',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(26,25,23,0.9)',
        borderColor: 'rgba(217,119,6,0.3)',
        borderWidth: 1,
        titleColor: '#A89880',
        bodyColor: '#F5F0E8',
        callbacks: {
          label: (ctx: { raw: unknown }) => ` $${ctx.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#5C5245', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#5C5245', font: { size: 11 }, callback: (v: unknown) => `$${v}` },
        border: { dash: [4, 4] },
      },
    },
  };

  return (
    <div className="glass-1 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-warm-white">Weekly Earnings</h3>
        <span className="font-display text-amber-500 text-lg">$652 this week</span>
      </div>
      <div className="h-[200px]">
        <Line data={data} options={options as Parameters<typeof Line>[0]['options']} />
      </div>
    </div>
  );
}
