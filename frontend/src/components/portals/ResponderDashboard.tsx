import { useState } from "react";
import { toast } from "sonner";
import { AuthModalCard } from "../auth/AuthModalCard";
import { DynamicUserForm, stripPhoneFormatting, type DynamicUserFormData } from "../auth/DynamicUserForm";
import { ChangePasswordForm } from "../auth/ChangePasswordForm";
import { authApi } from "../../api/authApi";
import { useAuth, getApiErrorMessage } from "../../context/AuthContext";

type ModalType = null | "create-worker" | "change-password";

export function ResponderDashboard() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const handleCreateWorker = async (data: DynamicUserFormData) => {
    setLoading(true);
    try {
      const response = await authApi.createWorker({
        usernameCreated: data.username.trim(),
        name: data.name.trim(),
        password: data.password,
        phoneNumber: data.contactNumber.trim() ? stripPhoneFormatting(data.contactNumber.trim()) : undefined,
        email: data.email.trim(),
      });
      toast.success(response.message);
      setActiveModal(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create worker."));
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-8 backdrop-blur-sm">
          <h1 className="font-['Orbitron',sans-serif] font-medium text-[32px] text-white mb-2">
            Responder Dashboard
          </h1>
          <p className="font-['Orbitron',sans-serif] text-[16px] text-[rgba(255,255,255,0.6)] mb-8">
            Manage workers and emergency responses (requires RESPONDER login)
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setActiveModal("create-worker")}
              className="bg-gradient-to-r from-[#00b8db] to-[#2b7fff] rounded-lg px-6 py-3 font-['Orbitron',sans-serif] font-medium text-white hover:opacity-90 transition-opacity"
            >
              Create Worker
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

      {activeModal === "create-worker" && (
        <AuthModalCard title="Create Worker" onClose={() => setActiveModal(null)}>
          <DynamicUserForm
            submitButtonText="Create Worker"
            loading={loading}
            onSubmit={handleCreateWorker}
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
