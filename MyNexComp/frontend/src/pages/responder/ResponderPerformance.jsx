import { useEffect, useState } from 'react';
import { responderApi } from '../../services/api';
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

// Register ChartJS components
ChartJS.register(
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
);

// Stat Card Component
const StatCard = ({ label, value, color, icon, suffix = '' }) => (
  <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center transition-all duration-300 hover:border-cyan-500/50 hover:scale-[1.02] group">
    <div className="flex items-center justify-center mb-1">
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
    </div>
    <p className="font-data text-2xl mt-1" style={{ textShadow: `0 0 10px ${color}`, color }}>{value}{suffix}</p>
    <p className="font-mono text-[8px] text-cyan-400/60 mt-1 tracking-wider">{label}</p>
  </div>
);

// Department Ranking Component
const DepartmentRanking = ({ rank, percentage, rating, totalRatings }) => (
  <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
    <h3 className="font-title text-glow-primary text-sm tracking-wider mb-4 flex items-center gap-2">
      <span>🏆</span> DEPARTMENT RANKING
    </h3>
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="text-center">
        <p className="font-data text-4xl text-glow-primary animate-pulse-glow">#{rank}</p>
        <p className="font-mono text-[9px] text-cyan-400/60 mt-1">OVERALL RANK</p>
      </div>
      <div className="flex-1 min-w-[150px]">
        <div className="flex justify-between text-[10px] font-mono mb-1">
          <span className="text-cyan-300">Completion Rate</span>
          <span className="text-glow-primary">{percentage}%</span>
        </div>
        <div className="w-full bg-cyan-900/30 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="text-center">
        <div className="flex items-center gap-1">
          <p className="font-data text-2xl text-yellow-400">{rating}</p>
          <span className="text-yellow-400 text-sm">★</span>
        </div>
        <p className="font-mono text-[8px] text-cyan-400/60 mt-1">{totalRatings} ratings</p>
      </div>
    </div>
  </div>
);

// Monthly Chart Component
const MonthlyChart = ({ data }) => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: data.length === 12 ? data : [6, 9, 7, 11, 8, 13, 10, 15, 9, 12, 14, 11],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
      },
    ],
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

// Task Distribution Chart
const TaskDistributionChart = ({ tasks }) => {
  const pending = tasks.filter(t => t.status === 'PENDING' || t.status === 'PENDING_RESPONDER').length;
  const active = tasks.filter(t => ['ACCEPTED', 'IN_PROGRESS', 'WITH_WORKER'].includes(t.status)).length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const rejected = tasks.filter(t => t.status === 'REJECTED').length;

  const chartData = {
    labels: ['Pending', 'Active', 'Completed', 'Rejected'],
    datasets: [
      {
        data: [pending, active, completed, rejected],
        backgroundColor: ['#fbbf24', '#60a5fa', '#4ade80', '#ef4444'],
        borderColor: ['rgba(251,191,36,0.5)', 'rgba(96,165,250,0.5)', 'rgba(74,222,128,0.5)', 'rgba(239,68,68,0.5)'],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
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

// Response Metrics Component
const ResponseMetrics = ({ stats }) => {
  const responsePercentage = Math.min(((stats?.avgResponseTimeMinutes || 45) / 120) * 100, 100);
  const completionPercentage = Math.min(((stats?.avgCompletionTimeHours || 24) / 72) * 100, 100);

  return (
    <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
      <h3 className="font-title text-glow-primary text-sm tracking-wider mb-4 flex items-center gap-2">
        <span>⏱️</span> RESPONSE METRICS
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className="text-cyan-300 flex items-center gap-1">
              <span>📊</span> Avg Response Time
            </span>
            <span className="text-glow-primary">{stats?.avgResponseTimeMinutes || 0} minutes</span>
          </div>
          <div className="w-full bg-cyan-900/30 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-yellow-400 transition-all duration-1000 ease-out"
              style={{ width: `${responsePercentage}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className="text-cyan-300 flex items-center gap-1">
              <span>⏰</span> Avg Completion Time
            </span>
            <span className="text-glow-primary">{stats?.avgCompletionTimeHours || 0} hours</span>
          </div>
          <div className="w-full bg-cyan-900/30 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-1000 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ResponderPerformance() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rank, setRank] = useState(3);
  const [totalRatings, setTotalRatings] = useState(87);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [performanceData, tasksData, workersData] = await Promise.all([
        responderApi.performance().catch(() => ({})),
        responderApi.tasks().catch(() => []),
        responderApi.workers().catch(() => [])
      ]);
      setStats(performanceData);
      setTasks(tasksData);
      setWorkers(workersData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalTasks = stats?.totalTasks || tasks.length;
  const completedTasks = stats?.completedTasks || tasks.filter(t => t.status === 'COMPLETED').length;
  const rejectedTasks = stats?.rejectedTasks || tasks.filter(t => t.status === 'REJECTED').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const monthlyData = stats?.monthlyCompleted || [6, 9, 7, 11, 8, 13, 10, 15, 9, 12, 14, 11];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING PERFORMANCE DATA... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="font-title text-glow-primary text-2xl tracking-wider">PERFORMANCE METRICS</h1>
        <p className="font-mono text-xs text-cyan-500/60 mt-1">[ DEPARTMENT METRICS & ANALYTICS ]</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="TOTAL TASKS" value={totalTasks} color="#06b6d4" icon="📋" />
        <StatCard label="COMPLETED" value={completedTasks} color="#4ade80" icon="✅" />
        <StatCard label="REJECTED" value={rejectedTasks} color="#ef4444" icon="❌" />
        <StatCard label="RATING" value={stats?.rating?.toFixed(1) || 0} color="#fbbf24" icon="⭐" suffix="★" />
      </div>

      {/* Completion Rate Card */}
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
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] text-cyan-400/60">{completedTasks} / {totalTasks} tasks</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Department Ranking */}
        <DepartmentRanking 
          rank={rank} 
          percentage={completionRate} 
          rating={stats?.rating?.toFixed(1) || 0} 
          totalRatings={totalRatings} 
        />

        {/* Task Distribution Chart */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
          <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3 flex items-center gap-2">
            <span>📊</span> TASK DISTRIBUTION
          </h3>
          <div className="h-48">
            <TaskDistributionChart tasks={tasks} />
          </div>
        </div>
      </div>

      {/* Monthly Performance Chart */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
        <h3 className="font-title text-glow-primary text-sm tracking-wider mb-4 flex items-center gap-2">
          <span>📈</span> MONTHLY PERFORMANCE TREND
        </h3>
        <div className="h-64">
          <MonthlyChart data={monthlyData} />
        </div>
      </div>

      {/* Response Metrics */}
      <ResponseMetrics stats={stats} />

      {/* Worker Performance */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4">
        <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3 flex items-center gap-2">
          <span>👥</span> WORKER PERFORMANCE
        </h3>
        <div className="space-y-3">
          {workers.slice(0, 5).map((worker, idx) => (
            <div key={worker.id || worker.username} className="animate-slideInRight" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span className="text-cyan-300">{worker.name}</span>
                <span className="text-glow-primary">{worker.tasksCompleted || 0} tasks</span>
              </div>
              <div className="w-full bg-cyan-900/30 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500"
                  style={{ width: `${Math.min(((worker.tasksCompleted || 0) / 30) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
          {workers.length === 0 && (
            <p className="text-center text-cyan-400/40 font-mono text-xs py-4">No workers added yet</p>
          )}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4">
        <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3 flex items-center gap-2">
          <span>💡</span> PERFORMANCE INSIGHTS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-cyan-900/10 rounded-lg border border-cyan-500/20">
            <p className="font-mono text-[9px] text-cyan-400/60">STRENGTHS</p>
            <p className="font-mono text-xs text-green-400 mt-1">✓ High completion rate ({completionRate}%)</p>
            <p className="font-mono text-xs text-green-400 mt-1">✓ Good department rating ({stats?.rating?.toFixed(1) || 0}★)</p>
          </div>
          <div className="p-3 bg-cyan-900/10 rounded-lg border border-cyan-500/20">
            <p className="font-mono text-[9px] text-cyan-400/60">AREAS TO IMPROVE</p>
            <p className="font-mono text-xs text-yellow-400 mt-1">! Response time ({stats?.avgResponseTimeMinutes || 0} min)</p>
            <p className="font-mono text-xs text-yellow-400 mt-1">! Completion time ({stats?.avgCompletionTimeHours || 0} hours)</p>
          </div>
        </div>
      </div>

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 5px #06b6d4; }
          50% { text-shadow: 0 0 20px #06b6d4; }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out forwards; opacity: 0; }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
      `}</style>
    </div>
  );
}