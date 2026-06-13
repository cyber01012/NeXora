import { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import nexLogo from "../../imports/nexlogo.png";

export type AuthRegistrationCardVariant = "landing" | "modal" | "default";

type AuthRegistrationCardProps = {
  children: ReactNode;
  contentKey?: string | number;
  onClose?: () => void;
  showCloseButton?: boolean;
  variant?: AuthRegistrationCardVariant;
  className?: string;
  animateEntry?: boolean;
  animateContent?: boolean;
};

const variantStyles: Record<
  AuthRegistrationCardVariant,
  {
    outer: string;
    corner: string;
    cornerOffset: string;
    card: string;
    logo: string;
    content: string;
  }
> = {
  landing: {
    outer: "h-full w-full",
    corner: "size-[48px]",
    cornerOffset: "-inset-4",
    card: "relative h-full w-full overflow-hidden rounded-[14px]",
    logo: "w-[320px] h-[320px]",
    content: "relative z-10 h-full w-full overflow-y-auto p-[32px]",
  },
  modal: {
    outer: "w-[480px] max-h-[90vh]",
    corner: "size-[36px]",
    cornerOffset: "-inset-3",
    card: "relative w-full max-h-[90vh] overflow-hidden rounded-[14px]",
    logo: "w-[400px] h-[400px]",
    content: "relative z-10 max-h-[90vh] overflow-y-auto p-8",
  },
  default: {
    outer: "w-full max-w-md mx-auto max-h-[90vh]",
    corner: "w-12 h-12",
    cornerOffset: "-inset-4",
    card: "relative w-full max-h-[90vh] overflow-hidden rounded-xl",
    logo: "w-80 h-80",
    content: "relative z-10 max-h-[90vh] overflow-y-auto p-8",
  },
};

export function AuthRegistrationCard({
  children,
  contentKey,
  onClose,
  showCloseButton = false,
  variant = "default",
  className = "",
  animateEntry = true,
  animateContent = true,
}: AuthRegistrationCardProps) {
  const styles = variantStyles[variant];

  const cardInner = (
    <>
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-15 pointer-events-none rounded-[inherit]">
        <ImageWithFallback
          alt="Nex Logo"
          src={nexLogo}
          className={`${styles.logo} object-contain`}
          style={
            variant === "default"
              ? { mixBlendMode: "screen", filter: "brightness(1.2)" }
              : undefined
          }
        />
      </div>

      <div
        className="absolute inset-0 z-[1] pointer-events-none rounded-[inherit]"
        style={{
          backgroundImage:
            "linear-gradient(137.816deg, rgba(0, 184, 219, 0.05) 0%, rgba(0, 0, 0, 0) 50%, rgba(43, 127, 255, 0.05) 100%)",
        }}
      />

      {showCloseButton && onClose && (
        <button
          type="button"
          onClick={onClose}
          className={
            variant === "modal"
              ? "absolute top-4 right-4 z-50 flex items-center justify-center size-[32px] rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              : "absolute top-4 right-4 z-50 text-white/60 hover:text-white transition-colors"
          }
          aria-label="Close"
        >
          <svg className="size-[16px]" fill="none" viewBox="0 0 20 20">
            <path
              d="M15 5L5 15"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.6"
              strokeWidth="1.66667"
            />
            <path
              d="M5 5L15 15"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.6"
              strokeWidth="1.66667"
            />
          </svg>
        </button>
      )}

      <div className={`${styles.content} font-['Orbitron',sans-serif]`}>
        {animateContent && contentKey !== undefined ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={contentKey}
              initial={{ clipPath: "circle(0% at 50% 50%)" }}
              animate={{ clipPath: "circle(150% at 50% 50%)" }}
              exit={{ clipPath: "circle(0% at 50% 50%)" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        ) : (
          children
        )}
      </div>

      <div
        aria-hidden
        className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[inherit]"
      />
    </>
  );

  const shell = (
    <div className={`relative ${styles.outer} ${className}`}>
      <div className="absolute -inset-1 rounded-[inherit] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, #06b6d4 25%, #3b82f6 50%, #06b6d4 75%, transparent 100%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <div
          className={`absolute inset-[2px] rounded-[inherit] ${
            variant === "landing" ? "bg-[rgba(0,0,0,0.8)]" : "bg-black/80 backdrop-blur-xl"
          }`}
        />
      </div>

      <div
        className={`absolute ${styles.cornerOffset} rounded-2xl pointer-events-none`}
      >
        <div
          className={`absolute top-0 left-0 ${styles.corner} border-t-2 border-l-2 border-[rgba(0,211,243,0.5)] rounded-tl-xl`}
        />
        <div
          className={`absolute top-0 right-0 ${styles.corner} border-t-2 border-r-2 border-[rgba(0,211,243,0.5)] rounded-tr-xl`}
        />
        <div
          className={`absolute bottom-0 left-0 ${styles.corner} border-b-2 border-l-2 border-[rgba(0,211,243,0.5)] rounded-bl-xl`}
        />
        <div
          className={`absolute bottom-0 right-0 ${styles.corner} border-b-2 border-r-2 border-[rgba(0,211,243,0.5)] rounded-br-xl`}
        />
      </div>

      <div
        className={`relative backdrop-blur-2xl shadow-2xl overflow-hidden ${styles.card} ${
          variant === "landing"
            ? "bg-[rgba(0,0,0,0.5)] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
            : variant === "modal"
              ? "bg-[rgba(0,0,0,0.8)] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.5)]"
              : "bg-black/50"
        }`}
      >
        {cardInner}
      </div>
    </div>
  );

  if (!animateEntry) {
    return shell;
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.1, 1] }}
      transition={{ duration: 0.6, times: [0, 0.6, 1], ease: "easeInOut" }}
      className={variant === "landing" ? "h-full w-full" : undefined}
    >
      {shell}
    </motion.div>
  );
}
