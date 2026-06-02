import svgPaths from "../../../imports/CreateSignInUpPages-1/svg-7ualfwmk93";

export type AuthFormIcon =
  | "email"
  | "lock"
  | "user"
  | "phone"
  | "home"
  | "location"
  | "card"
  | "image";

type AuthFormInputProps = {
  placeholder: string;
  icon?: AuthFormIcon;
  type?: "text" | "password" | "email";
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  maxLength?: number;
  className?: string;
  inputClassName?: string;
  variant?: "landing" | "portal";
};

const iconPaths: Record<AuthFormIcon, React.ReactNode> = {
  email: (
    <>
      <path d={svgPaths.pd919a80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
      <path d={svgPaths.p189c1170} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
    </>
  ),
  lock: (
    <>
      <path d={svgPaths.p2566d000} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
      <path d={svgPaths.p1bf79e00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
    </>
  ),
  user: (
    <>
      <path d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6904 13.4763C15.0652 12.8512 14.2174 12.5 13.3333 12.5H6.66667C5.78261 12.5 4.93477 12.8512 4.30964 13.4763C3.68452 14.1014 3.33333 14.9493 3.33333 15.8333V17.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
      <path d="M10 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 10 2.5C8.15905 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15905 9.16667 10 9.16667Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
    </>
  ),
  phone: (
    <>
      <path d="M12.5 3.33333H7.5C6.57953 3.33333 5.83333 4.07953 5.83333 5V15C5.83333 15.9205 6.57953 16.6667 7.5 16.6667H12.5C13.4205 16.6667 14.1667 15.9205 14.1667 15V5C14.1667 4.07953 13.4205 3.33333 12.5 3.33333Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
      <path d="M10 13.3333H10.0083" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
    </>
  ),
  home: (
    <>
      <path d="M2.5 7.5L10 2.5L17.5 7.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V7.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
      <path d="M7.5 17.5V10H12.5V17.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
    </>
  ),
  location: (
    <>
      <path d="M17.5 8.33333C17.5 14.1667 10 19.1667 10 19.1667C10 19.1667 2.5 14.1667 2.5 8.33333C2.5 6.34421 3.29018 4.4366 4.6967 3.03007C6.10322 1.62355 8.01088 0.833332 10 0.833332C11.9891 0.833332 13.8968 1.62355 15.3033 3.03007C16.7098 4.4366 17.5 6.34421 17.5 8.33333Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
      <path d="M10 10.8333C11.3807 10.8333 12.5 9.71405 12.5 8.33333C12.5 6.95262 11.3807 5.83333 10 5.83333C8.61929 5.83333 7.5 6.95262 7.5 8.33333C7.5 9.71405 8.61929 10.8333 10 10.8333Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
    </>
  ),
  card: (
    <>
      <path d="M17.5 3.33333H2.5C1.57953 3.33333 0.833332 4.07953 0.833332 5V15C0.833332 15.9205 1.57953 16.6667 2.5 16.6667H17.5C18.4205 16.6667 19.1667 15.9205 19.1667 15V5C19.1667 4.07953 18.4205 3.33333 17.5 3.33333Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
      <path d="M0.833332 8.33333H19.1667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
    </>
  ),
  image: (
    <>
      <path d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
      <path d="M7.08333 8.33333C7.77369 8.33333 8.33333 7.77369 8.33333 7.08333C8.33333 6.39298 7.77369 5.83333 7.08333 5.83333C6.39298 5.83333 5.83333 6.39298 5.83333 7.08333C5.83333 7.77369 6.39298 8.33333 7.08333 8.33333Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
      <path d="M17.5 12.5L13.3333 8.33333L4.16667 17.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" strokeWidth="1.66667" />
    </>
  ),
};

export function AuthFormInput({
  placeholder,
  icon,
  type = "text",
  name,
  value,
  onChange,
  required,
  maxLength,
  className = "",
  inputClassName = "",
  variant = "portal",
}: AuthFormInputProps) {
  const isLanding = variant === "landing";

  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className={`absolute top-1/2 z-10 -translate-y-1/2 ${isLanding ? "left-3 size-5" : "left-[12px] size-[20px]"}`}>
          <svg className="size-full" fill="none" viewBox="0 0 20 20">
            <g>{iconPaths[icon]}</g>
          </svg>
        </div>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        className={
          inputClassName ||
          (isLanding
            ? `w-full ${icon ? "pl-11" : "pl-4"} pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all`
            : `w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[10px] ${icon ? "pl-[45px]" : "pl-4"} pr-4 py-3 font-['Inter:Regular',sans-serif] text-[16px] text-white placeholder:text-[rgba(255,255,255,0.4)] outline-none focus:border-[rgba(0,211,243,0.5)] transition-colors`)
        }
      />
    </div>
  );
}
