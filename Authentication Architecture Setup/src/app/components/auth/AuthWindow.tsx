import { ReactNode } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import video3 from "../../../imports/watermarked_preview__3_.mp4";

const WINDOW_MAX_WIDTH = 680;
const WINDOW_MIN_HEIGHT = 520;

type AuthWindowProps = {
  onClose: () => void;
  children: ReactNode;
};

export function AuthWindow({ onClose, children }: AuthWindowProps) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Sign in"
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.35, ease: "easeOut", layout: { duration: 0.3, ease: "easeInOut" } }}
      className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl shadow-[0_25px_80px_-12px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
      style={{ maxWidth: WINDOW_MAX_WIDTH, minHeight: WINDOW_MIN_HEIGHT }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="size-full object-cover opacity-70"
          style={{ filter: "blur(2px) brightness(0.6)", objectPosition: "center center" }}
        >
          <source src={video3} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/45" />
        <div className="absolute top-0 right-0 h-[12%] min-h-16 w-[28%] bg-gradient-to-bl from-black/90 via-black/50 to-transparent" />
        <div className="absolute bottom-0 right-0 h-[12%] min-h-16 w-[28%] bg-gradient-to-tl from-black/90 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 h-[12%] min-h-16 w-[28%] bg-gradient-to-tr from-black/90 via-black/50 to-transparent" />
        <div className="absolute top-0 left-0 h-[12%] min-h-16 w-[28%] bg-gradient-to-br from-black/90 via-black/50 to-transparent" />
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 z-[60] flex size-9 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
        aria-label="Close"
      >
        <X className="size-5" />
      </button>

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden px-[10%] py-[8%] min-[480px]:px-10 min-[480px]:py-14">
        <div className="max-h-full w-full max-w-[448px] shrink-0 overflow-hidden">{children}</div>
      </div>
    </motion.div>
  );
}
