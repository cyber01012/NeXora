import { apiRequest } from "./client";
import type {
  AuthResponse,
  PasswordResetInitResponse,
  RegistrationResponse,
  UserProfile,
} from "./types";

export const authApi = {
  login(identifier: string, password: string, deviceId?: string) {
    return apiRequest<AuthResponse>("/api/auth/login", {
      auth: false,
      body: { identifier, password, deviceId: deviceId ?? "web-browser" },
    });
  },

  registerCitizen(payload: {
    fullName: string;
    phoneNumber: string;
    address: string;
    city: string;
    email?: string;
    cnic?: string;
    password: string;
  }) {
    return apiRequest<RegistrationResponse>("/api/auth/register/citizen", {
      auth: false,
      body: payload,
    });
  },

  verifyOtp(payload: {
    source: string;
    sourceId: string;
    purpose: "EMAIL_VERIFICATION" | "PASSWORD_RESET";
    otp: string;
  }) {
    return apiRequest<{ message: string }>("/api/auth/verify-otp", {
      auth: false,
      body: payload,
    });
  },

  sendEmailVerification(payload: {
    source: string;
    sourceId: string;
    email: string;
    resend?: boolean;
  }) {
    return apiRequest<{ message: string; remainingResends: number }>("/api/auth/send-email-verification", {
      auth: false,
      body: payload,
    });
  },

  verifyEmailByToken(token: string) {
    return apiRequest<{ message: string }>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
      auth: false,
      method: "GET",
    });
  },

  getResponderTypes() {
    return apiRequest<Array<{ id: string; name: string }>>("/api/admin/responder-types", {
      method: "GET",
    });
  },

  getDepartments() {
    return apiRequest<Array<{ id: number; name: string; responderTypeCategory: string | null; responderTypeName: string | null }>>(
      "/api/admin/departments",
      { method: "GET" }
    );
  },

  resendOtp(payload: {
    source: string;
    sourceId: string;
    purpose: "EMAIL_VERIFICATION" | "PASSWORD_RESET";
    email: string;
  }) {
    return apiRequest<{ message: string; remainingResends: number }>("/api/auth/resend-otp", {
      auth: false,
      body: payload,
    });
  },

  forgotPassword(email: string) {
    return apiRequest<PasswordResetInitResponse>("/api/auth/forgot-password", {
      auth: false,
      body: { email },
    });
  },

  resetPassword(payload: {
    source: string;
    sourceId: string;
    otp: string;
    newPassword: string;
  }) {
    return apiRequest<{ message: string }>("/api/auth/reset-password", {
      auth: false,
      body: payload,
    });
  },

  changePassword(currentPassword: string, newPassword: string) {
    return apiRequest<{ message: string }>("/api/auth/change-password", {
      body: { currentPassword, newPassword },
    });
  },

  getProfile() {
    return apiRequest<UserProfile>("/api/auth/me", { method: "GET" });
  },

  logout(refreshToken?: string | null) {
    return apiRequest<{ message: string }>("/api/auth/logout", {
      body: { refreshToken: refreshToken ?? undefined },
    });
  },

  logoutOthers(refreshToken?: string | null) {
    return apiRequest<{ message: string }>("/api/auth/logout-others", {
      body: { refreshToken: refreshToken ?? undefined },
    });
  },

  createAdminPortalUser(
    role: "ngo" | "help-desk" | "assigning-officer" | "responder",
    payload: {
      username: string;
      name: string;
      contactNumber: string;
      email: string;
      password: string;
      category?: string;
      responderTypeId?: string;
    }
  ) {
    return apiRequest<RegistrationResponse>(`/api/admin/users/${role}`, {
      body: payload,
    });
  },

  createVolunteer(payload: {
    usernameCreated: string;
    name?: string;
    password: string;
    phoneNumber?: string;
    email: string;
    profilePic?: string;
  }) {
    return apiRequest<RegistrationResponse>("/api/ngo/volunteers", {
      body: payload,
    });
  },

  createWorker(payload: {
    usernameCreated: string;
    name?: string;
    password: string;
    phoneNumber?: string;
    email: string;
    profilePic?: string;
  }) {
    return apiRequest<RegistrationResponse>("/api/responder/workers", {
      body: payload,
    });
  },
};
