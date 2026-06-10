import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import PortalSidebar from "../components/layout/PortalSidebar";

import { useAuth } from "../context/AuthContext";

const navItems = [
  {
    to: "/helpdesk",
    label: "DASHBOARD",
    icon: "▣",
    end: true,
  },

  {
    to: "/helpdesk/createsos",
    label: "CREATE SOS",
    icon: "🚨",
  },

  {
    to: "/helpdesk/reports",
    label: "SOS REPORTS",
    icon: "📋",
  },

  {
    to: "/helpdesk/profile",
    label: "PROFILE",
    icon: "👤",
  },

  {
    to: "/helpdesk/faq",
    label: "FAQ",
    icon: "❓",
  },
];

export default function HelpDeskLayout() {

  const navigate = useNavigate();

  const { logout } = useAuth();

  const [disasterMode, setDisasterMode] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [userData, setUserData] =
    useState({
      name: "Loading...",
      role: "HELP DESK",
      avatar: "?",
    });

  useEffect(() => {

    fetch("/api/disaster-mode/status")
      .then((res) => res.json())
      .catch(() => ({ active: false }))
      .then((data) =>
        setDisasterMode(data.active)
      );

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (user) {

      setUserData({
        name:
          user.displayName ||
          "Help Desk",

        role: "HELP DESK",

        avatar:
          user.displayName?.charAt(0) ||
          "H",
      });
    }

  }, []);

  const handleLogout = async () => {

    setLoading(true);

    try {

      await logout();

      toast.success(
        "Logged out successfully."
      );

      navigate("/");

    } catch {

      toast.error(
        "Failed to logout."
      );

    } finally {

      setLoading(false);
    }
  };

  const handleDisasterToggle =
    (mode) => {

      setDisasterMode(mode);

      if (mode) {

        document.body.classList.add(
          "disaster-mode"
        );

      } else {

        document.body.classList.remove(
          "disaster-mode"
        );
      }
    };

  return (

    <div className={`
      flex min-h-screen
      transition-all duration-500

      ${
        disasterMode
          ? `
            bg-gradient-to-br
            from-black
            via-red-950/40
            to-black
          `
          : `
            bg-gradient-to-br
            from-gray-950
            via-[#071018]
            to-black
          `
      }
    `}>

      {/* SIDEBAR */}

      <PortalSidebar
        title="HELP DESK PORTAL"

        user={userData}

        navItems={[
          { items: navItems }
        ]}

        onLogout={handleLogout}

        disasterMode={disasterMode}

        onDisasterToggle={
          handleDisasterToggle
        }
        notificationRole="HELP_DESK"
      />

      {/* MAIN */}

      <main
        className="
          flex-1
          min-h-screen
          overflow-auto
        "

        style={{
          marginLeft: "260px",
        }}
      >

        {/* TOP BAR */}

        <div className="
          sticky top-0 z-30
          backdrop-blur-xl
          border-b

          px-6 py-5

          flex items-center
          justify-between
        "

        style={{
          borderColor: disasterMode
            ? "rgba(255,0,0,0.2)"
            : "rgba(0,240,255,0.1)",

          background: disasterMode
            ? "rgba(20,0,0,0.65)"
            : "rgba(7,16,24,0.7)"
        }}
        >

          <div>

            {/* <h1 className={`
              text-2xl
              font-bold
              tracking-[3px]

              ${
                disasterMode
                  ? `
                    text-red-400
                    drop-shadow-[0_0_12px_#ff0000]
                  `
                  : `
                    text-cyan-300
                    drop-shadow-[0_0_12px_#00f0ff]
                  `
              }
            `}>

              NEXORA HELP DESK

            </h1> */}

            {/* <p className={`
              text-xs
              mt-2
              tracking-widest

              ${
                disasterMode
                  ? "text-red-300/60"
                  : "text-cyan-400/50"
              }
            `}>

              EMERGENCY RESPONSE OPERATOR PANEL

            </p> */}

          </div>

          <div className={`
            px-4 py-2
            rounded-full
            border
            text-xs
            tracking-widest
            font-mono
            animate-pulse

            ${
              disasterMode
                ? `
                  border-red-500/30
                  bg-red-500/10
                  text-red-300
                `
                : `
                  border-green-500/20
                  bg-green-500/10
                  text-green-300
                `
            }
          `}>

            {
              disasterMode
                ? "🚨 DISASTER MODE"
                : "● SYSTEM ONLINE"
            }

          </div>

        </div>

        {/* ALERT */}

        {disasterMode && (

          <div className="
            mx-6 mt-6
            rounded-2xl
            border border-red-500/30
            bg-red-500/10
            p-5
            animate-pulse
            shadow-[0_0_25px_rgba(255,0,0,0.2)]
          ">

            <h2 className="
              text-red-300
              text-lg
              font-bold
              tracking-widest
            ">

              🚨 HIGH EMERGENCY TRAFFIC DETECTED

            </h2>

            <p className="
              text-red-200/70
              text-sm
              mt-2
            ">

              Priority escalation enabled across the help desk network.

            </p>

          </div>

        )}

        {/* PAGE CONTENT */}

        <div className="p-6">

          <Outlet />

        </div>

      </main>

    </div>
  );
}