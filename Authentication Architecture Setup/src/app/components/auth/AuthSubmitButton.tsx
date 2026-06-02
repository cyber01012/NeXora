import { motion, type HTMLMotionProps } from "motion/react";
import svgPaths from "../../../imports/CreateSignInUpPages-1/svg-7ualfwmk93";

type AuthSubmitButtonProps = HTMLMotionProps<"button"> & {
  children: React.ReactNode;
  showArrow?: boolean;
  variant?: "landing" | "portal";
};

export function AuthSubmitButton({
  children,
  showArrow = true,
  variant = "portal",
  className = "",
  type = "submit",
  ...props
}: AuthSubmitButtonProps) {
  const isLanding = variant === "landing";

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={
        className ||
        (isLanding
          ? "w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 group"
          : "w-full bg-gradient-to-r from-[#00b8db] to-[#2b7fff] rounded-[10px] px-4 py-3 drop-shadow-[0px_10px_7.5px_rgba(0,184,219,0.2),0px_4px_3px_rgba(0,184,219,0.2)] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity")
      }
      {...props}
    >
      <span className={isLanding ? "" : "font-['Inter:Medium',sans-serif] font-medium text-[16px] text-white"}>
        {children}
      </span>
      {showArrow && (
        <svg className={isLanding ? "w-5 h-5 group-hover:translate-x-1 transition-transform" : "size-[20px]"} fill="none" viewBox="0 0 20 20">
          <g>
            <path d="M4.16667 10H15.8333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            <path d={svgPaths.p1ae0b780} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </g>
        </svg>
      )}
    </motion.button>
  );
}
