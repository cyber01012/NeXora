import { useState } from "react";

import { toast } from "sonner";

import { authApi } from "../../api/authApi";

import {
  getApiErrorMessage
} from "../../context/AuthContext";

export default function AdminResetPasswordForm({

  username,

  onSuccess

}) {

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!password.trim()) {

      toast.error(
        "Password is required"
      );

      return;
    }

    if (password !== confirmPassword) {

      toast.error(
        "Passwords do not match"
      );

      return;
    }

    try {

      setLoading(true);

      const response =
        await authApi.resetUserPassword(
          username,
          password
        );

      toast.success(
        response.message
      );

      onSuccess();

    } catch (error) {

      toast.error(
        getApiErrorMessage(
          error,
          "Failed to reset password"
        )
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <div>

        <label className="text-cyan-300 text-xs font-mono">
          NEW PASSWORD
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="
            w-full mt-2
            bg-[var(--bg3)]
            border border-cyan-500/20
            rounded-xl
            p-3
            text-cyan-100
            outline-none
          "
        />

      </div>

      <div>

        <label className="text-cyan-300 text-xs font-mono">
          CONFIRM PASSWORD
        </label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          className="
            w-full mt-2
            bg-[var(--bg3)]
            border border-cyan-500/20
            rounded-xl
            p-3
            text-cyan-100
            outline-none
          "
        />

      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          py-3
          rounded-xl
          bg-purple-500/20
          border border-purple-400
          text-purple-200
        "
      >

        {loading
          ? "RESETTING..."
          : "RESET PASSWORD"}

      </button>

    </form>
  );
}