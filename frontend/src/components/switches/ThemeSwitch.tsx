import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/contexts";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="
      flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-input px-3 
      py-2.5 text-sm font-semibold text-text-secondary transition-all hover:bg-input-hover hover:text-foreground"
    >
      {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
      {isDark ? "Dark theme" : "Light theme"}
    </button>
  );
}
