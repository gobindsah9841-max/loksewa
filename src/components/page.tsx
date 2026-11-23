import { Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { useProgress } from "@/lib/progress";

export function Page({
  title,
  back,
  children,
}: {
  title: string;
  back?: string;
  children: ReactNode;
}) {
  const theme = useProgress((s) => s.theme);
  const setTheme = useProgress((s) => s.setTheme);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="topbar sticky top-0 z-20 flex items-center gap-2 border-b border-line bg-bg/95 px-3 pb-3 backdrop-blur-sm">
        {back ? (
          <a href={back} aria-label="Back" className="grid size-11 place-items-center rounded-full text-fg">
            <Chevron />
          </a>
        ) : (
          <span className="w-2" />
        )}
        <h1 className="min-w-0 flex-1 truncate font-display text-lg leading-tight">{title}</h1>
        <button
          type="button"
          aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}
          className="grid size-11 place-items-center rounded-full text-gold"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
      </header>
      <main className="mx-auto w-full max-w-3xl px-4 pt-4 pb-16">{children}</main>
    </div>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
      <path
        d="M15 5l-7 7 7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
