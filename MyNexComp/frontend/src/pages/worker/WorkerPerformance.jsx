import { useEffect, useState } from 'react';
import { workerApi } from '../../services/api.js';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler);

const StatCard = ({ label, value, color, icon, suffix = '' }) => (
  <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center transition-all duration-300 hover:border-cyan-500/50 hover:scale-[1.02] group">
    <div className="flex items-center justify-center mb-1">
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
    </div>
    <p className="font-data text-2xl mt-1" style={{ textShadow: `0 0 10px ${color}`, color }}>{value}{suffix}</p>
    <p className="font-mono text-[8px] text-cyan-400/60 mt-1 tracking-wider">{label}</p>
  </div>
);

const ResponseMetrics = ({ stats }) => {
  const responsePercentage = Math.min(((stats?.avgResponseTimeMinutes || 0) / 120) * 100, 100);
  const completionPercentage = Math.min(((stats?.avgCompletionTimeHours || 0) / 72) * 100, 100);

  return (
    <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
      <h3 className="font-title text-glow-primary text-sm tracking-wider mb-4 flex items-center gap-2">
        <span>⏱️</span> RESPONSE METRICS
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className="text-cyan-300">Avg Response Time (submit → accept)</span>
            <span className="text-glow-primary">{stats?.avgResponseTimeMinutes || 0} minutes</span>
          </div>
          <div className="w-full bg-cyan-900/30 rounded-full h-1.5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-yellow-400 transition-all duration-1000 ease-out" style={{ width: `${responsePercentage}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className="text-cyan-300">Avg Completion Time (accept → done)</span>
            <span className="text-glow-primary">{stats?.avgCompletionTimeHours || 0} hours</span>
          </div>
          <div className="w-full bg-cyan-900/30 rounded-full h-1.5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-1000 ease-out" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskDistributionChart = ({ stats }) => {
  const chartData = {
    labels: ['Pending', 'In Progress', 'Completed', 'Rejected'],
    datasets: [{
      data: [
        stats?.pendingTasks || 0,
        stats?.inProgressTasks || 0,
        stats?.completedTasks || 0,
        stats?.rejectedTasks || 0,
      ],
      backgroundColor: ['#fbbf24', '#60a5fa', '#4ade80', '#ef4444'],
      borderColor: ['rgba(251,191,36,0.5)', 'rgba(96,165,250,0.5)', 'rgba(74,222,128,0.5)', 'rgba(239,68,68,0.5)'],
      borderWidth: 2,
      hoverOffset: 10,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: 'easeOutBounce' },
    plugins: {
      legend: { position: 'bottom', labels: { color: '#e0f8ff', font: { size: 9, family: 'Share Tech Mono' } } },
      tooltip: { backgroundColor: '#0a1628', titleColor: '#00f0ff', bodyColor: '#e0f8ff' },
    },
  };
  return <Doughnut data={chartData} options={options} />;
};

const MonthlyChart = ({ data }) => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Tasks Completed',
      data: data.length === 12 ? data : new Array(12).fill(0),
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#06b6d4',
      pointBorderColor: '#fff',
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBorderWidth: 2,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1500, easing: 'easeInOutQuart' },
    plugins: {
      legend: { position: 'top', labels: { color: '#e0f8ff', font: { size: 10, family: 'Orbitron' } } },
      tooltip: { backgroundColor: '#0a1628', titleColor: '#00f0ff', bodyColor: '#e0f8ff', borderColor: '#06b6d4', borderWidth: 1 },
    },
    scales: {
      x: { ticks: { color: '#8899aa', font: { size: 9 } }, grid: { color: 'rgba(6, 182, 212, 0.1)' } },
      y: { ticks: { color: '#8899aa', font: { size: 9 } }, grid: { color: 'rgba(6, 182, 212, 0.1)' } },
    },
  };
  return <Line data={chartData} options={options} />;
};

export default function WorkerPerformance() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workerApi.performance();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING PERFORMANCE DATA... ]</div>
      </div>
    );
  }

  const total = stats?.totalTasks || 0;
  const completed = stats?.completedTasks || 0;
  const rejected = stats?.rejectedTasks || 0;
  const pending = stats?.pendingTasks || 0;
  const inProgress = stats?.inProgressTasks || 0;
  const completionRate = stats?.completionRate || 0;
  const rating = stats?.rating || 0;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">PERFORMANCE METRICS</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">[ WORKER METRICS & ANALYTICS ]</p>
        </div>
        <button onClick={loadData} className="flex items-center gap-2 px-3 py-2 border border-cyan-500/30 rounded-lg font-mono text-xs text-cyan-400 hover:bg-cyan-500/10 transition-all">
          <ArrowPathIcon className="w-4 h-4" /> REFRESH
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl font-mono text-sm text-red-400">
          ⚠ {error} — <button onClick={loadData} className="underline">retry</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="TOTAL TASKS" value={total} color="#06b6d4" icon="📋" />
        <StatCard label="COMPLETED" value={completed} color="#4ade80" icon="✅" />
        <StatCard label="REJECTED" value={rejected} color="#ef4444" icon="❌" />
        <StatCard label="RATING" value={typeof rating === 'number' ? rating.toFixed(1) : (rating || 0)} color="#fbbf24" icon="⭐" suffix="★" />
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="PENDING ACCEPTANCE" value={pending} color="#fbbf24" icon="⏳" />
        <StatCard label="IN PROGRESS" value={inProgress} color="#60a5fa" icon="🔧" />
      </div>

      {/* Completion Rate Bar */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <p className="font-mono text-[9px] text-cyan-400/60">COMPLETION RATE</p>
            <p className="font-data text-3xl text-glow-primary">{completionRate}%</p>
          </div>
          <div className="flex-1 min-w-[150px]">
            <div className="w-full bg-cyan-900/30 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(completionRate, 100)}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] text-cyan-400/60">{completed} / {total} tasks</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Ranking */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
          <h3 className="font-title text-glow-primary text-sm tracking-wider mb-4 flex items-center gap-2">
            <span>🏆</span> MY PERFORMANCE SUMMARY
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Completion Rate', value: completionRate, max: 100, suffix: '%', color: 'from-cyan-400 to-green-400' },
              { label: 'Rating Score', value: (rating * 20), max: 100, suffix: '', color: 'from-yellow-400 to-orange-400' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-[10px] font-mono mb-1">
                  <span className="text-cyan-300">{item.label}</span>
                  <span className="text-glow-primary">{item.value.toFixed(1)}{item.suffix}</span>
                </div>
                <div className="w-full bg-cyan-900/30 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.min(item.value, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Distribution Chart */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
          <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3 flex items-center gap-2">
            <span>📊</span> TASK DISTRIBUTION
          </h3>
          <div className="h-48">
            {total > 0 ? (
              <TaskDistributionChart stats={stats} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="font-mono text-sm text-cyan-400/40">No task data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Performance Chart */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
        <h3 className="font-title text-glow-primary text-sm tracking-wider mb-4 flex items-center gap-2">
          <span>📈</span> MONTHLY PERFORMANCE TREND
        </h3>
        <div className="h-64">
          <MonthlyChart data={stats?.monthlyCompleted || []} />
        </div>
      </div>

      {/* Response Metrics */}
      <ResponseMetrics stats={stats} />

      {/* Performance Insights */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4">
        <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3 flex items-center gap-2">
          <span>💡</span> PERFORMANCE INSIGHTS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-cyan-900/10 rounded-lg border border-cyan-500/20">
            <p className="font-mono text-[9px] text-cyan-400/60">STRENGTHS</p>
            {completionRate >= 70 && <p className="font-mono text-xs text-green-400 mt-1">✓ High completion rate ({completionRate}%)</p>}
            {rating >= 3 && <p className="font-mono text-xs text-green-400 mt-1">✓ Good personal rating ({typeof rating === 'number' ? rating.toFixed(1) : rating}★)</p>}
            {completed > 0 && <p className="font-mono text-xs text-green-400 mt-1">✓ {completed} tasks successfully completed</p>}
            {completionRate < 70 && rating < 3 && completed === 0 && <p className="font-mono text-xs text-cyan-400/50 mt-1">Complete tasks to see strengths</p>}
          </div>
          <div className="p-3 bg-cyan-900/10 rounded-lg border border-cyan-500/20">
            <p className="font-mono text-[9px] text-cyan-400/60">AREAS TO IMPROVE</p>
            {pending > 0 && <p className="font-mono text-xs text-yellow-400 mt-1">! {pending} tasks pending acceptance</p>}
            {(stats?.avgResponseTimeMinutes || 0) > 60 && <p className="font-mono text-xs text-yellow-400 mt-1">! Response time: {stats.avgResponseTimeMinutes} min</p>}
            {rejected > 0 && <p className="font-mono text-xs text-red-400 mt-1">! {rejected} tasks rejected — aim to reduce</p>}
            {pending === 0 && rejected === 0 && (stats?.avgResponseTimeMinutes || 0) <= 60 && (
              <p className="font-mono text-xs text-cyan-400/50 mt-1">All good! Keep up the great work.</p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
}
