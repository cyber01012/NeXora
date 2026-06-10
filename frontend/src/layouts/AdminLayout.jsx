import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import PortalSidebar from "../components/layout/PortalSidebar";

import { AuthModalCard } from "../components/auth/AuthModalCard";

import {
  DynamicUserForm,
  mapAdminRoleToEndpoint,
  stripPhoneFormatting,
} from "../components/auth/DynamicUserForm";

import { ChangePasswordForm } from "../components/auth/ChangePasswordForm";

import { authApi } from "../api/authApi";

import {
  useAuth,
  getApiErrorMessage,
} from "../context/AuthContext";



export default function AdminLayout() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const [disasterMode, setDisasterMode] = useState(false);

  const [activeModal, setActiveModal] = useState(null);

  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    name: "Loading...",
    role: "SYSTEM ADMIN",
    avatar: "?",
  });

  useEffect(() => {
    fetch("/api/disaster-mode/status")
      .then((res) => res.json())
      .catch(() => ({ active: false }))
      .then((data) => setDisasterMode(data.active));

    setUserData({
      name: "Admin",
      role: "SYSTEM ADMIN",
      avatar: "A",
    });
  }, []);

  const handleCreateUser = async (data) => {
    const endpoint = mapAdminRoleToEndpoint(
      data.category
    );

    if (!endpoint) {
      toast.error("Please select a user role.");
      return;
    }

    if (
      data.category === "responder" &&
      !data.responderTypeId
    ) {
      toast.error("Please select a responder type.");
      return;
    }

    setLoading(true);

    try {
      const response =
        await authApi.createAdminPortalUser(endpoint, {
          username: data.username.trim(),
          name: data.name.trim(),
          contactNumber: stripPhoneFormatting(
            data.contactNumber.trim()
          ),
          email: data.email.trim(),
          password: data.password,
          responderTypeId:
            data.category === "responder"
              ? data.responderTypeId
              : undefined,
        });

      toast.success(response.message);

      setActiveModal(null);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to create user."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutOthers = async () => {
    setLoading(true);

    try {
      const refreshToken =
        localStorage.getItem("refresh_token");

      const response =
        await authApi.logoutOthers(refreshToken);

      toast.success(response.message);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to logout other devices."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();

      toast.success("Logged out successfully.");

      navigate("/");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Failed to logout.")
      );

      setLoading(false);
    }
  };

  const handleDisasterToggle = (mode) => {
    setDisasterMode(mode);

    if (mode) {
      document.body.classList.add("disaster-mode");
    } else {
      document.body.classList.remove("disaster-mode");
    }
  };

  const navItems = [
    {
      items: [
        { to: "/admin", label: "DASHBOARD", icon: "▣", end: true },
        { to: "/admin/users", label: "USERS", icon: "👥" },
        { to: "/admin/reports", label: "REPORTS", icon: "📋" },
        { to: "/admin/analytics", label: "ANALYTICS", icon: "📈" },
        { to: "/admin/heatmap", label: "HEATMAP", icon: "🗺️" },
        { to: "/admin/profile", label: "PROFILE", icon: "👤" },
        { to: "/admin/faq", label: "FAQ", icon: "❓" },
      ],
    },
    {
      title: "ACCOUNT",
      items: [
        { label: "CHANGE PASSWORD", icon: "🔐", onClick: () => setActiveModal("change-password") },
        { label: "LOGOUT OTHERS", icon: "📵", onClick: () => handleLogoutOthers() },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <PortalSidebar
        title="ADMIN PORTAL"
        user={userData}
        navItems={navItems}
        onLogout={handleLogout}
        disasterMode={disasterMode}
        onDisasterToggle={handleDisasterToggle}
        notificationRole="ADMIN"
      />

      <main
        className="flex-1 min-h-screen overflow-auto relative"
        style={{ marginLeft: "260px" }}
      >
        <div className="p-6">
          {/* Page Content */}
          <Outlet />
        </div>
      </main>

      {/* Change Password Modal */}
      {activeModal === "change-password" && (
        <AuthModalCard
          title="Change Password"
          onClose={() => setActiveModal(null)}
        >
          <ChangePasswordForm
            onSuccess={() => setActiveModal(null)}
          />
        </AuthModalCard>
      )}
    </div>
  );
}