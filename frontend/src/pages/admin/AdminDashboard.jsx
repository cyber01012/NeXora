import { useEffect, useState } from 'react';
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
  Filler
} from 'chart.js';

import {
  Line,
  Doughnut,
  Bar
} from 'react-chartjs-2';

import {
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';

import { authApi } from '../../api/authApi';

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

export default function AdminDashboard() {

  const [users, setUsers] = useState([]);

  const [disasterMode, setDisasterMode] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadDashboard();

    const interval = setInterval(
      loadDashboard,
      10000
    );

    return () => clearInterval(interval);

  }, []);

  const loadDashboard = async () => {

    try {

      const usersData =
        await authApi.getAdminUsers();

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : usersData.data || []
      );

      try {

        const disaster =
          await fetch(
            '/api/disaster-mode/status'
          );

        const disasterData =
          await disaster.json();

        setDisasterMode(
          disasterData.active
        );

      } catch {
        setDisasterMode(false);
      }

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  const activeUsers =
    users.filter(u => u.active).length;

  const responders =
    users.filter(
      u => u.userType === 'RESPONDER'
    ).length;

  const ngos =
    users.filter(
      u => u.userType === 'NGO_RESPONDER'
    ).length;

  const departments =
    [
      ...new Set(
        users.map(u => u.deptName)
      )
    ].filter(Boolean);

  const chartData = {
    labels: [
      'HelpDesk',
      'Responders',
      'NGOs',
      'Assigning Officers'
    ],

    datasets: [
      {
        label: 'Users',

        data: [

          users.filter(
            u => u.userType === 'HELPDESK'
          ).length,

          responders,

          ngos,

          users.filter(
            u =>
              u.userType ===
              'ASSIGNING_OFFICER'
          ).length
        ],

        backgroundColor: [
          '#06b6d4',
          '#4ade80',
          '#c084fc',
          '#fb923c'
        ],

        borderWidth: 0
      }
    ]
  };

  const lineData = {
    labels: [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun'
    ],

    datasets: [
      {
        label: 'System Activity',

        data: [12, 19, 8, 22, 17, 28, 24],

        borderColor: '#06b6d4',

        backgroundColor:
          'rgba(6,182,212,0.12)',

        fill: true,

        tension: 0.4
      }
    ]
  };

  const lineOptions = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        labels: {
          color: '#e0f8ff'
        }
      }
    },

    scales: {

      x: {
        ticks: {
          color: '#94a3b8'
        },

        grid: {
          color:
            'rgba(6,182,212,0.08)'
        }
      },

      y: {
        ticks: {
          color: '#94a3b8'
        },

        grid: {
          color:
            'rgba(6,182,212,0.08)'
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#e0f8ff',
          font: {
            family: 'Share Tech Mono',
            size: 10
          }
        }
      }
    }
  };

  if (loading) {

    return (

      <div className="
        flex justify-center items-center
        h-[70vh]
      ">

        <div className="
          w-10 h-10
          rounded-full
          border-2
          border-cyan-400
          border-t-transparent
          animate-spin
        " />

      </div>
    );
  }

  return (

    <div className={`
      space-y-5
      animate-fadeIn
      transition-all duration-500

      ${
        disasterMode
          ? 'text-red-100'
          : ''
      }
    `}>

      {/* DISASTER MODE */}

      {disasterMode && (

        <div className="
          bg-red-500/10
          border border-red-500/30
          rounded-2xl
          p-5
          animate-pulse
          shadow-[0_0_30px_rgba(255,0,0,0.18)]
        ">

          <div className="
            flex items-center gap-4
          ">

            <div className="text-4xl">
              🚨
            </div>

            <div>

              <h2 className="
                text-xl
                font-bold
                text-red-300
              ">
                NATIONAL DISASTER MODE ACTIVE
              </h2>

              <p className="
                text-red-200/70
                text-sm
                mt-1
              ">
                Emergency escalation mode enabled.
              </p>

            </div>

          </div>

        </div>

      )}

      {/* HEADER */}

      <div className="
        flex items-center justify-between
        flex-wrap gap-4
      ">

        <div>

          <h1 className="
            font-title
            text-3xl
            tracking-wider
            text-glow-primary
          ">

            NEXORA CENTRAL COMMAND

          </h1>

          <p className="
            text-cyan-400/60
            font-mono
            text-xs
            mt-2
          ">

            [ REAL-TIME EMERGENCY MANAGEMENT ]

          </p>

        </div>

        <div className="
          px-4 py-2
          rounded-xl
          border border-cyan-500/20
          bg-cyan-500/10
          text-cyan-200
          font-mono
          text-xs
        ">

          LIVE SYSTEM ONLINE

        </div>

      </div>

      {/* STATS */}

      <div className="
        grid
        grid-cols-2
        lg:grid-cols-4
        gap-4
      ">

        {[
          {
            title: 'TOTAL USERS',
            value: users.length,
            icon:
              <UserGroupIcon className="w-8 h-8" />,
            color: '#06b6d4'
          },

          {
            title: 'ACTIVE USERS',
            value: activeUsers,
            icon:
              <CheckCircleIcon className="w-8 h-8" />,
            color: '#4ade80'
          },

          {
            title: 'RESPONDERS',
            value: responders,
            icon:
              <ExclamationTriangleIcon className="w-8 h-8" />,
            color: '#fbbf24'
          },

          {
            title: 'DEPARTMENTS',
            value: departments.length,
            icon:
              <BuildingOffice2Icon className="w-8 h-8" />,
            color: '#c084fc'
          }

        ].map((card, idx) => (

          <div
            key={card.title}

            className="
              bg-[var(--bg2)]
              border border-[var(--border)]
              rounded-2xl
              p-5
              transition-all duration-300
              hover:border-cyan-400/40
              hover:scale-[1.02]
              animate-scaleIn
            "

            style={{
              animationDelay:
                `${idx * 0.05}s`
            }}
          >

            <div className="
              flex justify-between items-center
              mb-4
            ">

              <div
                style={{
                  color: card.color
                }}
              >
                {card.icon}
              </div>

              <span className="
                text-[10px]
                font-mono
                text-cyan-400/60
                tracking-widest
              ">
                {card.title}
              </span>

            </div>

            <h2
              className="
                text-4xl
                font-data
              "

              style={{
                color: card.color,
                textShadow:
                  `0 0 14px ${card.color}`
              }}
            >

              {card.value}

            </h2>

          </div>

        ))}

      </div>

      {/* CHARTS */}

      <div className="
        grid lg:grid-cols-2 gap-5
      ">

        {/* LINE */}

        <div className="
          bg-[var(--bg2)]
          border border-[var(--border)]
          rounded-2xl
          p-5
        ">

          <h2 className="
            text-cyan-300
            font-title
            text-sm
            mb-4
            tracking-wider
          ">

            SYSTEM ACTIVITY TREND

          </h2>

          <div className="h-72">

            <Line
              data={lineData}
              options={lineOptions}
            />

          </div>

        </div>

        {/* DOUGHNUT */}

        <div className="
          bg-[var(--bg2)]
          border border-[var(--border)]
          rounded-2xl
          p-5
        ">

          <h2 className="
            text-cyan-300
            font-title
            text-sm
            mb-4
            tracking-wider
          ">

            USER DISTRIBUTION

          </h2>

          <div className="h-72">

            <Doughnut
              data={chartData}
              options={doughnutOptions}
            />

          </div>

        </div>

      </div>

      {/* RECENT USERS */}

      <div className="
        bg-[var(--bg2)]
        border border-[var(--border)]
        rounded-2xl
        p-5
      ">

        <div className="
          flex justify-between items-center
          mb-5
        ">

          <h2 className="
            text-cyan-300
            font-title
            tracking-wider
          ">

            RECENT SYSTEM USERS

          </h2>

          <span className="
            text-cyan-400/40
            text-xs
            font-mono
          ">
            LIVE DATABASE DATA
          </span>

        </div>

        <div className="space-y-3">

          {users.slice(0, 6).map(user => (

            <div
              key={user.username}

              className="
                flex justify-between items-center
                p-4
                rounded-xl
                border border-cyan-500/10
                bg-cyan-950/5
                hover:bg-cyan-900/10
                transition-all
              "
            >

              <div>

                <p className="
                  text-cyan-100
                  font-mono
                  text-sm
                ">
                  {user.name}
                </p>

                <p className="
                  text-cyan-400/40
                  text-[10px]
                  mt-1
                ">
                  {user.userType}
                  {' • '}
                  {user.deptName || 'NO DEPT'}
                </p>

              </div>

              <div className={`
                px-3 py-1
                rounded-full
                text-[10px]
                font-mono
                border

                ${
                  user.active
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
                }
              `}>

                {user.active
                  ? 'ACTIVE'
                  : 'INACTIVE'}

              </div>

            </div>

          ))}

        </div>

      </div>

      <style>{`

        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn .5s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn .35s ease-out forwards;
          opacity: 0;
        }

      `}</style>

    </div>
  );
}