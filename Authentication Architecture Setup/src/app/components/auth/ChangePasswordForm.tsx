import { AuthFormInput } from "./AuthFormInput";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { useState } from "react";
import { authApi } from "../../api/authApi";
import { getApiErrorMessage } from "../../context/AuthContext";
import { toast } from "sonner";

type ChangePasswordFormProps = {
  onSuccess?: () => void;
};

export function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword(formData.currentPassword, formData.newPassword);
      toast.success("Password updated successfully.");
      onSuccess?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthFormInput
        name="currentPassword"
        placeholder="Current Password"
        icon="lock"
        type="password"
        variant="portal"
        value={formData.currentPassword}
        onChange={handleChange}
        required
      />
      <AuthFormInput
        name="newPassword"
        placeholder="New Password"
        icon="lock"
        type="password"
        variant="portal"
        value={formData.newPassword}
        onChange={handleChange}
        required
      />
      <AuthFormInput
        name="confirmPassword"
        placeholder="Confirm Password"
        icon="lock"
        type="password"
        variant="portal"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      <AuthSubmitButton variant="portal" disabled={loading}>
        {loading ? "Updating..." : "Update Password"}
      </AuthSubmitButton>
    </form>
  );
}
