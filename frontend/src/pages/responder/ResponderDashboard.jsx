import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { Line, Bar, Doughnut } from 'react-chartjs-2';

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

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    PENDING_RESPONDER: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    ACCEPTED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    IN_PROGRESS: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    WITH_WORKER: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
    REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  const s = styles[status] || styles.PENDING;
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-mono border ${s}`}>
      {status === 'PENDING_RESPONDER' ? 'PENDING' : status}
    </span>
  );
};

// Task Icon Component
const TaskIcon = ({ type, priority }) => {
  const icons = {
    ELECTRICITY: { icon: '⚡', color: '#fbbf24', label: 'Electricity' },
    GAS: { icon: '🔥', color: '#f97316', label: 'Gas' },
    ROAD: { icon: '🛣️', color: '#60a5fa', label: 'Road' },
    WATER: { icon: '💧', color: '#22d3ee', label: 'Water' },
    MEDICAL: { icon: '🏥', color: '#4ade80', label: 'Medical' },
  };
  const t = icons[type] || icons.ELECTRICITY;
  const priorityColor = priority === 'HIGH' ? 'shadow-[0_0_8px_#ef4444]' : priority === 'CRITICAL' ? 'shadow-[0_0_12px_#ff2a2a] animate-pulse' : '';
  
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${priorityColor}`} style={{ background: `${t.color}15`, border: `1px solid ${t.color}30` }}>
      {t.icon}
    </div>
  );
};

export default function ResponderDashboard() {
  const [tasks, setTasks] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState(null);
  const [disasterMode, setDisasterMode] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    loadDashboardData();
    fetchDisasterMode();
  }, []);

  // Auto-scroll to show graph after dashboard loads
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        window.scrollBy({ top: 230, behavior: 'smooth' });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const fetchDisasterMode = async () => {
    try {
      const res = await fetch('/api/disaster-mode/status');
      const data = await res.json();
      setDisasterMode(data.active);
    } catch (err) {
      console.error(err);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [tasksData, workersData, statsData] = await Promise.all([
        responderApi.tasks().catch(() => []),
        responderApi.workers().catch(() => []),
        responderApi.performance().catch(() => ({}))
      ]);
      setTasks(tasksData);
      setWorkers(workersData);
      setStats(statsData);
      
      // Get department info from localStorage or fallback
      const deptName = localStorage.getItem('nexora_department_name') || 'K-Electric';
      setDepartment({ name: deptName, type: 'GOV' });
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'PENDING' || t.status === 'PENDING_RESPONDER').length;
  const activeTasks = tasks.filter(t => ['ACCEPTED', 'IN_PROGRESS', 'WITH_WORKER'].includes(t.status)).length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const rejectedTasks = tasks.filter(t => t.status === 'REJECTED').length;
  const activeWorkers = workers.filter(w => w.isActive !== false).length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'HIGH' || t.priority === 'CRITICAL').length;

  // Chart Data
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [4, 7, 5, 9, 11, 6, 8],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const taskDistributionData = {
    labels: ['Pending', 'Active', 'Completed', 'Rejected'],
    datasets: [
      {
        data: [pendingTasks, activeTasks, completedTasks, rejectedTasks],
        backgroundColor: ['#fbbf24', '#60a5fa', '#4ade80', '#ef4444'],
        borderColor: ['rgba(251,191,36,0.5)', 'rgba(96,165,250,0.5)', 'rgba(74,222,128,0.5)', 'rgba(239,68,68,0.5)'],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#e0f8ff', font: { size: 10, family: 'Share Tech Mono' } } },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1500, easing: 'easeInOutQuart' },
    plugins: {
      legend: { position: 'top', labels: { color: '#e0f8ff', font: { size: 10, family: 'Orbitron' } } },
      tooltip: { backgroundColor: '#0a1628', titleColor: '#00f0ff', bodyColor: '#e0f8ff', borderColor: '#06b6d4', borderWidth: 1 },
    },
    scales: {
      x: { ticks: { color: '#8899aa', font: { size: 10 } }, grid: { color: 'rgba(6, 182, 212, 0.1)' } },
      y: { ticks: { color: '#8899aa', font: { size: 10 } }, grid: { color: 'rgba(6, 182, 212, 0.1)' } },
    },
  };

  const handleAvailability = async () => {
    try {
      await responderApi.availability(!online);
      setOnline(!online);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING DASHBOARD... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Disaster Mode Alert */}
      {disasterMode && (
        <div className="bg-red-500/10 border-l-4 border-red-500 p-3 rounded-r-lg animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-xl animate-ping">⚠️</span>
            <div>
              <p className="font-mono text-xs text-red-400 tracking-wider">⚠️ DISASTER MODE ACTIVE</p>
              <p className="font-mono text-[10px] text-red-400/60">Priority to rescue and emergency tasks</p>
            </div>
          </div>
        </div>
      )}

      {/* Header with Department Name */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider animate-slideInRight">
            {department?.name || 'RESPONDER'} DASHBOARD
          </h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1 animate-slideInRight animation-delay-100">
            [ DEPARTMENT TASK MANAGEMENT ]
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAvailability}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 ${
              online ? 'bg-green-500/20 border border-green-500 text-green-400' : 'bg-gray-500/20 border border-gray-500 text-gray-400'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span className="font-mono text-[10px] tracking-wider">{online ? 'ONLINE' : 'OFFLINE'}</span>
          </button>
          <Link to="/responder/tasks" className="px-4 py-1.5 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-xs text-glow-primary hover:bg-cyan-500/30 transition-all duration-300 hover:scale-105">
            VIEW ALL TASKS
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {[
          { label: 'TOTAL TASKS', value: tasks.length, color: '#06b6d4', icon: '📋', change: '+12%' },
          { label: 'PENDING', value: pendingTasks, color: '#fbbf24', icon: '⏳', change: 'Urgent' },
          { label: 'ACTIVE', value: activeTasks, color: '#60a5fa', icon: '🔄', change: 'In Progress' },
          { label: 'COMPLETED', value: completedTasks, color: '#4ade80', icon: '✅', change: 'Done' },
          { label: 'HIGH PRIORITY', value: highPriorityTasks, color: '#ef4444', icon: '🔴', change: 'Critical' },
        ].map((card, idx) => (
          <div
            key={card.label}
            className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 transition-all duration-300 hover:border-cyan-500/50 hover:scale-[1.02] animate-scaleIn"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{card.icon}</span>
              <span className="text-[8px] font-mono text-cyan-400/60 tracking-wider">{card.label}</span>
            </div>
            <p className="font-data text-2xl text-glow-primary" style={{ textShadow: `0 0 10px ${card.color}` }}>
              {card.value}
            </p>
            <p className="text-[8px] font-mono text-cyan-400/40 mt-1">{card.change}</p>
          </div>
        ))}
      </div>

      {/* Workers & Performance Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Worker Status */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-title text-glow-primary text-sm tracking-wider flex items-center gap-2">
              <span>👥</span> TEAM STATUS
            </h3>
            <span className="text-[10px] font-mono text-green-400">{activeWorkers} Active</span>
          </div>
          <div className="space-y-2">
            {workers.slice(0, 4).map((worker, idx) => (
              <div key={worker.id || idx} className="flex justify-between items-center p-2 rounded-lg bg-cyan-900/10 border border-cyan-500/20 animate-slideInRight" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-mono">
                    {worker.name?.charAt(0) || 'W'}
                  </div>
                  <div>
                    <p className="font-mono text-xs text-cyan-200">{worker.name}</p>
                    <p className="font-mono text-[9px] text-cyan-400/60">{worker.role || 'Volunteer'}</p>
                  </div>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${worker.isActive !== false ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
              </div>
            ))}
            {workers.length === 0 && (
              <div className="text-center py-6 text-cyan-400/60 font-mono text-sm">No workers assigned yet</div>
            )}
            <Link to="/responder/workers" className="block text-center text-[9px] font-mono text-cyan-400/70 hover:text-cyan-400 mt-2 transition-colors">
              MANAGE TEAM →
            </Link>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
          <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3 flex items-center gap-2">
            <span>📊</span> PERFORMANCE
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 rounded-lg bg-cyan-900/10 border border-cyan-500/20">
              <span className="font-mono text-xs text-cyan-300">Completion Rate</span>
              <span className="font-data text-sm text-glow-primary">
                {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-cyan-900/10 border border-cyan-500/20">
              <span className="font-mono text-xs text-cyan-300">Avg Response Time</span>
              <span className="font-data text-sm text-glow-primary">{stats?.avgResponseTimeMinutes || 45} min</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-cyan-900/10 border border-cyan-500/20">
              <span className="font-mono text-xs text-cyan-300">Avg Completion</span>
              <span className="font-data text-sm text-glow-primary">{stats?.avgCompletionTimeHours || 24} hours</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-cyan-900/10 border border-cyan-500/20">
              <span className="font-mono text-xs text-cyan-300">Department Rating</span>
              <div className="flex items-center gap-1">
                <span className="font-data text-sm text-glow-primary">{stats?.rating || 4.7}</span>
                <span className="text-yellow-400 text-xs">★★★★★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Distribution Chart */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
          <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3 flex items-center gap-2">
            <span>📈</span> TASK DISTRIBUTION
          </h3>
          <div className="h-48">
            <Doughnut data={taskDistributionData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Weekly Trends Chart */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
        <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3 flex items-center gap-2">
          <span>📉</span> WEEKLY PERFORMANCE TREND
        </h3>
        <div className="h-56">
          <Line data={weeklyData} options={lineOptions} />
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-title text-glow-primary text-sm tracking-wider flex items-center gap-2">
            <span>📋</span> RECENT TASKS
          </h3>
          <Link to="/responder/tasks" className="text-[9px] font-mono text-cyan-400/70 hover:text-cyan-400 transition-colors">
            VIEW ALL →
          </Link>
        </div>
        <div className="space-y-2">
          {tasks.slice(0, 5).map((task, idx) => (
            <div
              key={task.id}
              className="flex justify-between items-center p-3 rounded-lg bg-cyan-900/10 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 animate-slideInRight cursor-pointer hover:bg-cyan-900/20"
              style={{ animationDelay: `${idx * 0.05}s` }}
              onClick={() => window.location.href = `/responder/tasks`}
            >
              <div className="flex items-center gap-3">
                <TaskIcon type={task.type} priority={task.priority} />
                <div>
                  <p className="font-mono text-sm text-glow-primary">{task.title}</p>
                  <p className="font-mono text-[9px] text-cyan-400/60">{task.locationAddress || 'Location not specified'}</p>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status={task.status} />
                {task.priority === 'HIGH' && (
                  <p className="font-mono text-[8px] text-red-400 mt-1 animate-pulse">HIGH PRIORITY</p>
                )}
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-cyan-400/60 font-mono text-sm">No tasks assigned yet</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { icon: '📋', label: 'TASKS', link: '/responder/tasks', color: '#06b6d4' },
          { icon: '👥', label: 'WORKERS', link: '/responder/workers', color: '#c084fc' },
          { icon: '📈', label: 'PERFORMANCE', link: '/responder/performance', color: '#4ade80' },
          { icon: '📜', label: 'FAQ', link: '/responder/faq', color: '#fbbf24' },
          { icon: '👤', label: 'PROFILE', link: '/responder/profile', color: '#60a5fa' },
        ].map((action, idx) => (
          <Link
            key={action.label}
            to={action.link}
            className="group flex items-center justify-center gap-2 p-3 rounded-lg bg-[var(--bg3)] border border-[var(--border)] hover:border-cyan-400 hover:bg-cyan-500/5 transition-all duration-300 hover:scale-105 animate-scaleIn"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
            <span className="font-mono text-xs text-cyan-300 group-hover:text-glow-primary transition-colors">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.4s ease-out forwards; opacity: 0; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; opacity: 0; }
        .animation-delay-100 { animation-delay: 0.1s; }
      `}</style>
    </div>
  );
}