import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartColors = {
  cyan: '#06b6d4',
  purple: '#c084fc',
  green: '#4ade80',
  orange: '#fb923c',
  red: '#f87171',
  yellow: '#facc15',
};

const darkChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#e0f8ff', font: { size: 11 } },
    },
  },
  scales: {
    x: {
      ticks: { color: '#94a3b8', font: { size: 10 } },
      grid: { color: 'rgba(6,182,212,0.06)' },
    },
    y: {
      ticks: { color: '#94a3b8', font: { size: 10 } },
      grid: { color: 'rgba(6,182,212,0.06)' },
    },
  },
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('6M');

  const reportsOverTime = {
    labels: months,
    datasets: [
      {
        label: 'Civic Reports',
        data: [42, 38, 55, 61, 48, 72],
        borderColor: chartColors.cyan,
        backgroundColor: 'rgba(6,182,212,0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'SOS Alerts',
        data: [8, 12, 6, 18, 14, 22],
        borderColor: chartColors.red,
        backgroundColor: 'rgba(248,113,113,0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const responderActivity = {
    labels: months,
    datasets: [
      {
        label: 'Tasks Completed',
        data: [28, 34, 41, 38, 52, 47],
        backgroundColor: 'rgba(6,182,212,0.6)',
        borderRadius: 6,
      },
      {
        label: 'Response Time (min)',
        data: [15, 12, 18, 10, 8, 11],
        backgroundColor: 'rgba(192,132,252,0.6)',
        borderRadius: 6,
      },
    ],
  };

  const departmentDistribution = {
    labels: ['Fire Dept', 'Police', 'Medical', 'Rescue', 'NGOs', 'Municipal'],
    datasets: [
      {
        data: [18, 24, 15, 12, 20, 11],
        backgroundColor: [
          chartColors.red,
          chartColors.cyan,
          chartColors.green,
          chartColors.orange,
          chartColors.purple,
          chartColors.yellow,
        ],
        borderWidth: 0,
      },
    ],
  };

  const kpis = [
    { label: 'AVG RESPONSE', value: '12m', sub: '↓ 3m from last month', color: chartColors.cyan, icon: '⚡' },
    { label: 'RESOLUTION RATE', value: '87%', sub: '↑ 5% improvement', color: chartColors.green, icon: '✅' },
    { label: 'ACTIVE INCIDENTS', value: '14', sub: '3 critical, 11 moderate', color: chartColors.orange, icon: '🔥' },
    { label: 'CITIZEN SATISFACTION', value: '4.2', sub: 'Out of 5.0 rating', color: chartColors.purple, icon: '⭐' },
  ];

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">ANALYTICS ENGINE</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">[ PERFORMANCE METRICS & TRENDS ]</p>
        </div>

        <div className="flex gap-2">
          {['1M', '3M', '6M', '1Y'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg border text-xs font-mono transition-all ${
                timeRange === range
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                  : 'border-[var(--border)] text-cyan-400/50 hover:text-cyan-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={kpi.label}
            className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5 transition-all hover:border-cyan-400/40 hover:scale-[1.02]"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{kpi.icon}</span>
              <span className="text-[9px] font-mono text-cyan-400/60 tracking-wider">{kpi.label}</span>
            </div>
            <h2
              className="font-data text-3xl mb-1"
              style={{ color: kpi.color, textShadow: `0 0 14px ${kpi.color}` }}
            >
              {kpi.value}
            </h2>
            <p className="text-[10px] font-mono text-cyan-400/40">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Reports Over Time */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5">
          <h2 className="text-cyan-300 font-title text-sm mb-4 tracking-wider">REPORT TRENDS</h2>
          <div className="h-72">
            <Line data={reportsOverTime} options={darkChartOptions} />
          </div>
        </div>

        {/* Responder Activity */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5">
          <h2 className="text-cyan-300 font-title text-sm mb-4 tracking-wider">RESPONDER METRICS</h2>
          <div className="h-72">
            <Bar data={responderActivity} options={darkChartOptions} />
          </div>
        </div>
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Department Distribution */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5">
          <h2 className="text-cyan-300 font-title text-sm mb-4 tracking-wider">DEPARTMENT LOAD</h2>
          <div className="h-64">
            <Doughnut
              data={departmentDistribution}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#e0f8ff', font: { size: 10 }, padding: 12 },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Top Zones */}
        <div className="lg:col-span-2 bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5">
          <h2 className="text-cyan-300 font-title text-sm mb-4 tracking-wider">TOP INCIDENT ZONES</h2>
          <div className="space-y-3">
            {[
              { zone: 'Canal Road — Sector 12', incidents: 28, severity: 'HIGH' },
              { zone: 'Industrial Zone — Block C', incidents: 22, severity: 'CRITICAL' },
              { zone: 'Main Boulevard — Phase I', incidents: 18, severity: 'MEDIUM' },
              { zone: 'Residential Area — Phase III', incidents: 14, severity: 'LOW' },
              { zone: 'Commercial Hub — Downtown', incidents: 11, severity: 'MEDIUM' },
            ].map((zone, idx) => (
              <div
                key={zone.zone}
                className="flex items-center justify-between p-4 rounded-xl border border-cyan-500/10 bg-cyan-950/5 hover:bg-cyan-900/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-cyan-400/40 font-mono text-xs w-6">#{idx + 1}</span>
                  <div>
                    <p className="text-cyan-100 font-mono text-sm">{zone.zone}</p>
                    <p className="text-cyan-400/40 text-[10px] mt-1">{zone.incidents} incidents this period</p>
                  </div>
                </div>
                <span className={`
                  px-3 py-1 rounded-full text-[10px] font-mono border
                  ${zone.severity === 'CRITICAL' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                    zone.severity === 'HIGH' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' :
                    zone.severity === 'MEDIUM' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' :
                    'text-green-400 bg-green-500/10 border-green-500/20'}
                `}>
                  {zone.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
