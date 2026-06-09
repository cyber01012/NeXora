import { useEffect, useState } from 'react';

import { helpDeskApi }
from '../../services/HelpDesk/helpDeskApi';

export default function HelpDeskDashboard() {

  const [stats, setStats] =
    useState(null);

  const [recentSOS, setRecentSOS] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadDashboard();

  }, []);

  const loadDashboard =
    async () => {

      try {

        const dashboard =
          await helpDeskApi.dashboard();

        const recent =
          await helpDeskApi.recentSOS();

        setStats(dashboard);

        setRecentSOS(recent);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
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
          border-2
          border-cyan-400
          border-t-transparent
          rounded-full
          animate-spin
        " />

      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div>

        <h1 className="
          text-3xl
          font-bold
          tracking-widest
          text-cyan-300
          drop-shadow-[0_0_12px_#00f0ff]
        ">

          HELP DESK DASHBOARD

        </h1>

        <p className="
          text-cyan-400/50
          mt-2
          text-sm
        ">

          Emergency command monitoring system

        </p>

      </div>

      {/* TOP CARDS */}

      <div className="
        grid
        md:grid-cols-4
        gap-5
      ">

        {[
          {
            title: 'TOTAL SOS',
            value:
              stats?.totalSOS || 0,
            color: '#06b6d4',
            icon: '🚨'
          },

          {
            title: 'PENDING',
            value:
              stats?.pendingSOS || 0,
            color: '#fbbf24',
            icon: '⏳'
          },

          {
            title: 'RESOLVED',
            value:
              stats?.resolvedSOS || 0,
            color: '#22c55e',
            icon: '✅'
          },

          {
            title: 'HIGH PRIORITY',
            value:
              stats?.highPrioritySOS || 0,
            color: '#ef4444',
            icon: '🔥'
          }

        ].map(card => (

          <div
            key={card.title}

            className="
              bg-[#071018]
              border border-cyan-500/20
              rounded-3xl
              p-6
              hover:border-cyan-400/40
              transition-all duration-300
              shadow-[0_0_20px_rgba(0,240,255,0.05)]
            "
          >

            <div className="
              flex justify-between items-center
            ">

              <div>

                <p className="
                  text-xs
                  text-cyan-400/50
                  tracking-widest
                ">
                  {card.title}
                </p>

                <h2
                  className="
                    text-5xl
                    font-bold
                    mt-4
                  "

                  style={{
                    color: card.color,
                    textShadow:
                      `0 0 12px ${card.color}`
                  }}
                >

                  {card.value}

                </h2>

              </div>

              <div className="
                text-5xl
              ">
                {card.icon}
              </div>

            </div>

          </div>

        ))}

      </div>

      {/* RECENT SOS */}

      <div className="
        bg-[#071018]
        border border-cyan-500/20
        rounded-3xl
        p-6
      ">

        <div className="
          flex justify-between items-center
          mb-5
        ">

          <h2 className="
            text-xl
            text-cyan-300
            tracking-widest
            font-bold
          ">

            RECENT SOS REPORTS

          </h2>

          <span className="
            text-xs
            text-cyan-500/40
          ">
            LIVE FEED
          </span>

        </div>

        <div className="space-y-3">

          {recentSOS.map((sos) => (

            <div
              key={sos.sosId}

              className="
                p-4
                rounded-2xl
                border border-cyan-500/10
                bg-cyan-950/5
                hover:bg-cyan-900/10
                transition-all
              "
            >

              <div className="
                flex justify-between items-center
              ">

                <div>

                  <h3 className="
                    text-cyan-100
                    font-semibold
                  ">

                    {sos.name}

                  </h3>

                  <p className="
                    text-cyan-400/50
                    text-sm
                    mt-1
                  ">

                    {sos.city}
                    {' • '}
                    {sos.area}

                  </p>

                  <p className="
                    text-cyan-300
                    text-xs
                    mt-2
                  ">

                    {sos.detail}

                  </p>

                </div>

                <div className="
                  px-3 py-1
                  rounded-full
                  bg-yellow-500/10
                  border border-yellow-500/20
                  text-yellow-400
                  text-xs
                ">

                  {sos.status}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}