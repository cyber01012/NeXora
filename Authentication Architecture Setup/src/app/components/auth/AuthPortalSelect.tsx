import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type PortalSelectOption = {
  value: string;
  label: string;
};

type AuthPortalSelectProps = {
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: PortalSelectOption[];
  required?: boolean;
  dropUp?: boolean;
};

export function AuthPortalSelect({
  name,
  value,
  onValueChange,
  placeholder,
  options,
  required,
  dropUp = false,
}: AuthPortalSelectProps) {
  return (
    <Select name={name} value={value || undefined} onValueChange={onValueChange} required={required}>
      <SelectTrigger
        aria-label={placeholder}
        className="h-auto min-h-[52px] w-full rounded-[10px] border border-slate-200 dark:border-cyan-400/25 bg-[linear-gradient(135deg,rgba(0,0,0,0.02),rgba(0,0,0,0.04))] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))] px-4 py-3 font-['Inter:Regular',sans-serif] text-[16px] leading-normal text-slate-900 dark:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none transition-all duration-200 hover:border-cyan-500/50 dark:hover:border-cyan-300/45 hover:bg-[linear-gradient(135deg,rgba(0,0,0,0.04),rgba(0,0,0,0.06))] dark:hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.11),rgba(255,255,255,0.05))] focus-visible:border-cyan-500 dark:focus-visible:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-500/25 dark:focus-visible:ring-cyan-300/40 data-[size=default]:h-auto data-[size=default]:min-h-[52px] data-[placeholder]:text-slate-500 dark:data-[placeholder]:text-white/65 *:data-[slot=select-value]:font-medium *:data-[slot=select-value]:text-slate-900 dark:*:data-[slot=select-value]:text-white [&>svg]:text-slate-600 dark:[&>svg]:text-cyan-200 [&>svg]:opacity-90 [&>svg]:transition-transform [&[data-state=open]>svg]:rotate-180"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        side={dropUp ? "top" : "bottom"}
        position="popper"
        sideOffset={8}
        className="z-[9999] max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-cyan-300/30 bg-white dark:bg-[linear-gradient(180deg,rgba(10,18,30,0.98),rgba(4,9,16,0.98))] text-slate-900 dark:text-white shadow-lg dark:shadow-[0_16px_44px_rgba(0,0,0,0.65),0_0_0_1px_rgba(34,211,238,0.15)] backdrop-blur-xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-cyan-300/35 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-cyan-200/55"
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="cursor-pointer rounded-md px-3 py-2 text-[15px] font-medium text-slate-700 dark:text-white/95 transition-colors focus:bg-cyan-100/50 dark:focus:bg-cyan-400/20 focus:text-cyan-900 dark:focus:text-white data-[state=checked]:bg-cyan-50 dark:data-[state=checked]:bg-cyan-400/25 data-[state=checked]:text-cyan-900 dark:data-[state=checked]:text-cyan-100"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
