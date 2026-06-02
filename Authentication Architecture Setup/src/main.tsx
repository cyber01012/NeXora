
import { createRoot } from "react-dom/client";
import { useState } from "react";
import App from "./app/App.tsx";
import "./styles/index.css";
import { AuthProvider } from "./app/context/AuthContext.tsx";
import { Toaster } from "sonner";
import EmailVerificationPage from "./app/components/auth/EmailVerificationPage.tsx";

const isVerifyEmailRoute = window.location.pathname === "/verify-email";

createRoot(document.getElementById("root")!).render(
  isVerifyEmailRoute ? (
    <>
      <EmailVerificationPage />
      <Toaster richColors position="top-center" />
    </>
  ) : (
    <AuthProvider>
      <App />
      <Toaster richColors position="top-center" />
    </AuthProvider>
  )
);
