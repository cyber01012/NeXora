import { useState } from "react";
import { motion } from "motion/react";
import { Eye, Mail, Lock, ArrowRight, KeyRound, Phone, MapPin, Home, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { AuthRegistrationCard } from "./AuthRegistrationCard";
import { authApi } from "../../api/authApi";
import { getApiErrorMessage, useAuth } from "../../context/AuthContext";
import {
  CNIC_PLACEHOLDER,
  PHONE_PLACEHOLDER,
  LOGIN_IDENTIFIER_HINT,
  formatCnicInput,
  formatLoginIdentifierInput,
  formatPhoneInput,
  isCompleteCnic,
  isCompletePhone,
  normalizeLoginIdentifier,
  stripCnicFormatting,
  stripPhoneFormatting,
} from "../../utils/inputFormatters";

type AuthView = "signin" | "signup" | "email-verify-prompt" | "email-link-sent" | "forgot-1" | "forgot-2";

import type { UserProfile } from "../../api/types";

type AuthPageProps = {
  onSuccess?: (user: UserProfile) => void;
};

export default function AuthPage({ onSuccess }: AuthPageProps) {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState<{
    source: string;
    sourceId: string;
    email: string;
  } | null>(null);
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  const [passwordResetContext, setPasswordResetContext] = useState<{
    source: string;
    sourceId: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    identifier: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    cnic: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const contentKey: AuthView = pendingVerification
    ? emailLinkSent
      ? "email-link-sent"
      : "email-verify-prompt"
    : isForgotPassword
      ? forgotPasswordStep === 1
        ? "forgot-1"
        : "forgot-2"
      : activeTab;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, identifier: formatLoginIdentifierInput(e.target.value) });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, phoneNumber: formatPhoneInput(e.target.value) });
  };

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, cnic: formatCnicInput(e.target.value) });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const identifier = normalizeLoginIdentifier(formData.identifier.trim() || formData.email.trim());
      const profile = await login(identifier, formData.password);
      toast.success("Signed in successfully.");
      onSuccess?.(profile);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Sign in failed."));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCompletePhone(formData.phoneNumber)) {
      toast.error(`Enter a valid phone number (e.g. ${PHONE_PLACEHOLDER}).`);
      return;
    }

    const cnicValue = formData.cnic.trim();
    if (cnicValue && !isCompleteCnic(cnicValue)) {
      toast.error(`Enter a valid CNIC (e.g. ${CNIC_PLACEHOLDER}).`);
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.registerCitizen({
        fullName: formData.fullName.trim(),
        phoneNumber: stripPhoneFormatting(formData.phoneNumber),
        address: formData.address.trim(),
        city: formData.city.trim(),
        email: formData.email.trim() || undefined,
        cnic: cnicValue ? stripCnicFormatting(cnicValue) : undefined,
        password: formData.password,
      });

      toast.success(response.message);

      if (response.emailVerificationRequired && formData.email.trim()) {
        setEmailLinkSent(false);
        setPendingVerification({
          source: response.source,
          sourceId: response.sourceId,
          email: formData.email.trim(),
        });
      } else {
        setActiveTab("signin");
        setFormData((prev) => ({
          ...prev,
          identifier: stripPhoneFormatting(formData.phoneNumber),
          password: "",
        }));
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Registration failed."));
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationLink = async () => {
    if (!pendingVerification) return;

    setLoading(true);
    try {
      const response = await authApi.sendEmailVerification({
        source: pendingVerification.source,
        sourceId: pendingVerification.sourceId,
        email: pendingVerification.email,
      });
      toast.success(response.message);
      setEmailLinkSent(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not send verification email."));
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerificationLink = async () => {
    if (!pendingVerification) return;

    setLoading(true);
    try {
      const response = await authApi.sendEmailVerification({
        source: pendingVerification.source,
        sourceId: pendingVerification.sourceId,
        email: pendingVerification.email,
        resend: true,
      });
      toast.success(`${response.message} (${response.remainingResends} resends left)`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not resend verification email."));
    } finally {
      setLoading(false);
    }
  };

  const handleSkipEmailVerification = () => {
    const email = pendingVerification?.email ?? formData.email.trim();
    setPendingVerification(null);
    setEmailLinkSent(false);
    setFormData((prev) => ({
      ...prev,
      identifier: email || stripPhoneFormatting(prev.phoneNumber),
      otp: "",
      password: "",
    }));
    setActiveTab("signin");
    toast.success("You can verify your email anytime from your account settings.");
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authApi.forgotPassword(formData.email.trim());
      setPasswordResetContext({
        source: response.source,
        sourceId: response.sourceId,
      });
      toast.success(response.message);
      setForgotPasswordStep(2);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not send reset OTP."));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetContext) return;

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({
        source: passwordResetContext.source,
        sourceId: passwordResetContext.sourceId,
        otp: formData.otp.trim(),
        newPassword: formData.newPassword,
      });
      toast.success("Password reset successfully. Please sign in.");
      handleBackToSignIn();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Password reset failed."));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    setIsForgotPassword(false);
    setForgotPasswordStep(1);
    setPendingVerification(null);
    setEmailLinkSent(false);
    setPasswordResetContext(null);
    setFormData({ ...formData, otp: "", newPassword: "", confirmNewPassword: "" });
    setActiveTab("signin");
  };

  return (
    <AuthRegistrationCard contentKey={contentKey} animateEntry={false}>
      {contentKey === "signin" && (
        <>
          <h2 className="mb-8 text-center text-white">Welcome Back</h2>
          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                name="identifier"
                placeholder="Email, phone, or username"
                value={formData.identifier}
                onChange={handleIdentifierChange}
                required
                maxLength={64}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/40 transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>
            <p className="-mt-2 text-xs leading-relaxed text-white/45">{LOGIN_IDENTIFIER_HINT}</p>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-white placeholder-white/40 transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/60"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-white/60">
                <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/50" />
                <span>Remember me</span>
              </label>
              <button type="button" onClick={() => { setIsForgotPassword(true); setForgotPasswordStep(1); }} className="text-cyan-400 transition-colors hover:text-cyan-300">
                Forgot Password?
              </button>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-400 disabled:opacity-60"
            >
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-white/60">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setActiveTab("signup");
                }}
                className="font-medium text-cyan-400 transition-colors hover:text-cyan-300"
              >
                Sign Up
              </button>
            </p>
          </div>
        </>
      )}

      {contentKey === "signup" && (
        <>
          <h2 className="mb-8 text-center text-white">Create Account</h2>
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="relative">
              <Home className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} required className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/40 transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                type="tel"
                name="phoneNumber"
                placeholder={`Phone Number (e.g. ${PHONE_PLACEHOLDER})`}
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                inputMode="numeric"
                maxLength={12}
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/40 transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} required className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/40 transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/40 transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input type="email" name="email" placeholder="Email (optional)" value={formData.email} onChange={handleInputChange} className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/40 transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
            </div>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                name="cnic"
                placeholder={`CNIC optional (e.g. ${CNIC_PLACEHOLDER})`}
                value={formData.cnic}
                onChange={handleCnicChange}
                inputMode="numeric"
                maxLength={15}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/40 transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password (min 8 characters)" value={formData.password} onChange={handleInputChange} required minLength={8} className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-white placeholder-white/40 transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/60">
                <Eye className="h-5 w-5" />
              </button>
            </div>
            <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }} className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-400 disabled:opacity-60">
              <span>{loading ? "Creating..." : "Create Account"}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-white/60">
              Already have an account?{" "}
              <button type="button" onClick={() => { setIsForgotPassword(false); setActiveTab("signin"); }} className="font-medium text-cyan-400 transition-colors hover:text-cyan-300">
                Sign In
              </button>
            </p>
          </div>
        </>
      )}

      {contentKey === "email-verify-prompt" && pendingVerification && (
        <>
          <h2 className="mb-2 text-center text-white">Account Created</h2>
          <p className="mb-8 text-center text-sm text-white/60">
            Your account has been saved. Verify {pendingVerification.email} to unlock badge benefits, or skip for now and sign in.
          </p>
          <div className="space-y-4">
            <motion.button
              type="button"
              disabled={loading}
              onClick={handleSendVerificationLink}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-400 disabled:opacity-60"
            >
              <span>{loading ? "Sending..." : "Verify Email"}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSkipEmailVerification}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 disabled:opacity-60"
            >
              Skip for Now
            </button>
          </div>
        </>
      )}

      {contentKey === "email-link-sent" && pendingVerification && (
        <>
          <h2 className="mb-2 text-center text-white">Check Your Email</h2>
          <p className="mb-8 text-center text-sm text-white/60">
            We sent a verification link to {pendingVerification.email}. Click the link in your email to verify your account.
          </p>
          <div className="space-y-4">
            <button
              type="button"
              disabled={loading}
              onClick={handleResendVerificationLink}
              className="w-full text-sm text-cyan-400 transition-colors hover:text-cyan-300 disabled:opacity-60"
            >
              Resend Verification Email
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSkipEmailVerification}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 disabled:opacity-60"
            >
              Skip and Sign In
            </button>
          </div>
        </>
      )}

      {(contentKey === "forgot-1" || contentKey === "forgot-2") && (
        <>
          <div className="mb-6 flex justify-center gap-2">
            {[1, 2].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all ${
                  step === forgotPasswordStep ? "w-8 bg-cyan-400" : step < forgotPasswordStep ? "w-4 bg-cyan-400/50" : "w-4 bg-white/20"
                }`}
              />
            ))}
          </div>
          {contentKey === "forgot-1" && (
            <>
              <h2 className="mb-2 text-center text-white">Forgot Password</h2>
              <p className="mb-8 text-center text-sm text-white/60">Enter your email to receive an OTP</p>
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                  <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/40 transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                </div>
                <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }} className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-400 disabled:opacity-60">
                  <span>{loading ? "Sending..." : "Send OTP"}</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </form>
            </>
          )}
          {contentKey === "forgot-2" && (
            <>
              <h2 className="mb-2 text-center text-white">Reset Password</h2>
              <p className="mb-8 text-center text-sm text-white/60">
                Enter the OTP sent to your email and your new password
              </p>
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                  <input type="text" name="otp" placeholder="Enter OTP" value={formData.otp} onChange={handleInputChange} required maxLength={6} className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-center tracking-widest text-white placeholder-white/40 transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                  <input type={showPassword ? "text" : "password"} name="newPassword" placeholder="New Password" value={formData.newPassword} onChange={handleInputChange} required minLength={8} className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-white placeholder-white/40 transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/60">
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                  <input type={showPassword ? "text" : "password"} name="confirmNewPassword" placeholder="Confirm New Password" value={formData.confirmNewPassword} onChange={handleInputChange} required minLength={8} className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-white placeholder-white/40 transition-all focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                </div>
                <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }} className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-400 disabled:opacity-60">
                  <span>{loading ? "Resetting..." : "Reset Password"}</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </form>
            </>
          )}
          <div className="mt-6 text-center text-sm">
            <button type="button" onClick={handleBackToSignIn} className="font-medium text-cyan-400 transition-colors hover:text-cyan-300">
              Back to Sign In
            </button>
          </div>
        </>
      )}
    </AuthRegistrationCard>
  );
}
