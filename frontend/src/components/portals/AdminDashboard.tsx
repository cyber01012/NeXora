import { useState } from "react";
import { toast } from "sonner";
import { AuthModalCard } from "../auth/AuthModalCard";
import { DynamicUserForm, mapAdminRoleToEndpoint, stripPhoneFormatting, type DynamicUserFormData } from "../auth/DynamicUserForm";
import { ChangePasswordForm } from "../auth/ChangePasswordForm";
import { authApi } from "../../api/authApi";
import { useAuth, getApiErrorMessage } from "../../context/AuthContext";

type ModalType = null | "create-user" | "change-password";

export function AdminDashboard() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const handleCreateUser = async (data: DynamicUserFormData) => {
    const endpoint = mapAdminRoleToEndpoint(data.category as Exclude<DynamicUserFormData["category"], "">);
    if (!endpoint) {
      toast.error("Please select a user role.");
      return;
    }

    if (data.category === "responder" && !data.responderTypeId) {
      toast.error("Please select a responder type.");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.createAdminPortalUser(endpoint, {
        username: data.username.trim(),
        name: data.name.trim(),
        contactNumber: stripPhoneFormatting(data.contactNumber.trim()),
        email: data.email.trim(),
        password: data.password,
        responderTypeId: data.category === "responder" ? data.responderTypeId : undefined,
      });
      toast.success(response.message);
      setActiveModal(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create user."));
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutOthers = async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const response = await authApi.logoutOthers(refreshToken);
      toast.success(response.message);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to logout other devices."));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to logout."));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-8 backdrop-blur-sm">
          <h1 className="font-['Orbitron',sans-serif] font-medium text-[32px] text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="font-['Orbitron',sans-serif] text-[16px] text-[rgba(255,255,255,0.6)] mb-8">
            Manage users and system settings (requires ADMIN login)
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setActiveModal("create-user")}
              className="bg-gradient-to-r from-[#00b8db] to-[#2b7fff] rounded-lg px-6 py-3 font-['Orbitron',sans-serif] font-medium text-white hover:opacity-90 transition-opacity"
            >
              Create User
            </button>
            <button
              onClick={() => setActiveModal("change-password")}
              className="bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg px-6 py-3 font-['Orbitron',sans-serif] font-medium text-white hover:bg-[rgba(255,255,255,0.15)] transition-colors"
            >
              Change Password
            </button>
            <button
              onClick={handleLogoutOthers}
              disabled={loading}
              className="bg-[rgba(255,50,50,0.1)] border border-[rgba(255,50,50,0.2)] rounded-lg px-6 py-3 font-['Orbitron',sans-serif] font-medium text-[#ff4d4d] hover:bg-[rgba(255,50,50,0.15)] transition-colors disabled:opacity-50"
            >
              {loading ? "Processing..." : "Logout Others"}
            </button>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-[rgba(255,50,50,0.2)] border border-[rgba(255,50,50,0.4)] rounded-lg px-6 py-3 font-['Orbitron',sans-serif] font-medium text-white hover:bg-[rgba(255,50,50,0.3)] transition-colors disabled:opacity-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {activeModal === "create-user" && (
        <AuthModalCard title="Create User" onClose={() => setActiveModal(null)}>
          <DynamicUserForm
            variant="admin"
            submitButtonText="Create User"
            loading={loading}
            onSubmit={handleCreateUser}
          />
        </AuthModalCard>
      )}

      {activeModal === "change-password" && (
        <AuthModalCard title="Change Password" onClose={() => setActiveModal(null)}>
          <ChangePasswordForm onSuccess={() => setActiveModal(null)} />
        </AuthModalCard>
      )}
    </div>
  );
}
