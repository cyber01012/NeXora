import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { authApi } from "../../api/authApi";
import { getApiErrorMessage } from "../../context/AuthContext";

type VerificationState = "loading" | "success" | "error";

export default function EmailVerificationPage() {
  const [state, setState] = useState<VerificationState>("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setState("error");
      setMessage("Verification link is invalid or missing.");
      return;
    }

    authApi
      .verifyEmailByToken(token)
      .then((response) => {
        setState("success");
        setMessage(response.message);
      })
      .catch((error) => {
        setState("error");
        setMessage(getApiErrorMessage(error, "Email verification failed."));
      });
  }, []);

  const handleBackHome = () => {
    window.history.replaceState({}, "", "/");
    window.location.href = "/";
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black px-6 py-12">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-black/50 p-8 text-center backdrop-blur-2xl">
        {state === "loading" && (
          <>
            <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
            <h1 className="mb-2 text-xl text-white">Verifying Email</h1>
            <p className="text-sm text-white/60">{message}</p>
          </>
        )}

        {state === "success" && (
          <>
            <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-emerald-400" />
            <h1 className="mb-2 text-xl text-white">Your account is now verified</h1>
            <p className="mb-8 text-sm text-white/60">{message}</p>
            <motion.button
              type="button"
              onClick={handleBackHome}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-400"
            >
              <span>Back to Home Screen</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </>
        )}

        {state === "error" && (
          <>
            <XCircle className="mx-auto mb-6 h-16 w-16 text-red-400" />
            <h1 className="mb-2 text-xl text-white">Verification Failed</h1>
            <p className="mb-8 text-sm text-white/60">{message}</p>
            <motion.button
              type="button"
              onClick={handleBackHome}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white transition hover:bg-white/10"
            >
              <span>Back to Home Screen</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
