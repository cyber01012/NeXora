import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "../ui/utils";

export type SearchableSelectOption = {
  value: string;
  label: string;
};

type AuthSearchableSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: SearchableSelectOption[];
  loading?: boolean;
  emptyMessage?: string;
  required?: boolean;
  searchPlaceholder?: string;
};

const triggerClassName =
  "flex h-auto min-h-[52px] w-full items-center justify-between rounded-[10px] border border-slate-200 dark:border-cyan-400/25 bg-[linear-gradient(135deg,rgba(0,0,0,0.02),rgba(0,0,0,0.04))] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))] px-4 py-3 font-['Orbitron',sans-serif] text-[16px] leading-normal text-slate-900 dark:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none transition-all duration-200 hover:border-cyan-500/50 dark:hover:border-cyan-300/45 hover:bg-[linear-gradient(135deg,rgba(0,0,0,0.04),rgba(0,0,0,0.06))] dark:hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.11),rgba(255,255,255,0.05))] focus-visible:border-cyan-500 dark:focus-visible:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-500/25 dark:focus-visible:ring-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-60";

export function AuthSearchableSelect({
  value,
  onValueChange,
  placeholder,
  options,
  loading = false,
  emptyMessage = "No options available.",
  required,
  searchPlaceholder = "Search...",
}: AuthSearchableSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(
    () => options.find((option) => option.value === value)?.label,
    [options, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={placeholder}
          aria-required={required}
          disabled={loading}
          className={triggerClassName}
        >
          <span className={cn("truncate text-left", !selectedLabel ? "text-slate-500 dark:text-white/65" : "text-slate-900 dark:text-white")}>
            {loading ? "Loading..." : selectedLabel ?? placeholder}
          </span>
          {loading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin text-cyan-600 dark:text-cyan-200" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-600 dark:text-cyan-200 opacity-90" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="z-[9999] w-[var(--radix-popover-trigger-width)] border border-slate-200 dark:border-cyan-300/30 bg-white dark:bg-[linear-gradient(180deg,rgba(10,18,30,0.98),rgba(4,9,16,0.98))] p-0 text-slate-900 dark:text-white shadow-lg dark:shadow-[0_16px_44px_rgba(0,0,0,0.65)]"
      >
        <Command className="bg-transparent text-slate-900 dark:text-white">
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-11 border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/50"
          />
          <CommandList className="max-h-56">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500 dark:text-white/60">
                <Loader2 className="h-4 w-4 animate-spin text-cyan-600 dark:text-cyan-300" />
                Loading options...
              </div>
            ) : (
              <>
                <CommandEmpty className="py-6 text-center text-sm text-slate-500 dark:text-white/55">{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={`${option.label} ${option.value}`}
                      onSelect={() => {
                        onValueChange(option.value);
                        setOpen(false);
                      }}
                      className="cursor-pointer text-slate-700 dark:text-white/95 aria-selected:bg-cyan-50 dark:aria-selected:bg-cyan-400/20 aria-selected:text-cyan-900 dark:aria-selected:text-white"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-cyan-600 dark:text-cyan-300",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
