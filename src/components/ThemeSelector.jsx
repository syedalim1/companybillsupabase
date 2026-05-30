"use client";
import React, { useState, useEffect } from "react";

const themes = [
  { id: "default", name: "Indigo Dream", color: "bg-indigo-500" },
  { id: "emerald", name: "Emerald Forest", color: "bg-emerald-500" },
  { id: "rose", name: "Rose Quartz", color: "bg-rose-500" },
  { id: "sunset", name: "Sunset Gold", color: "bg-orange-500" },
  { id: "charcoal", name: "Sleek Slate", color: "bg-slate-500" },
];

export default function ThemeSelector() {
  const [theme, setTheme] = useState("default");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem("theme-preset") || "default";
    const savedDarkMode = localStorage.getItem("theme-dark") === "true";
    
    setTheme(savedTheme);
    setDarkMode(savedDarkMode);

    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme-preset", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem("theme-dark", String(nextDark));
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white/50  /50 backdrop-blur-md border border-slate-200/50    /50 py-2 px-4 rounded-2xl shadow-sm">
      {/* Theme Presets */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Theme
        </span>
        <div className="flex items-center gap-1.5">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-300 ${t.color} relative hover:scale-110 focus:outline-none`}
              title={t.name}
            >
              {theme === t.id && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="w-[1px] h-5 bg-slate-300 dark:bg-slate-700 hidden sm:block" />

      {/* Dark/Light Toggle */}
      <button
        onClick={toggleDarkMode}
        className="flex items-center justify-center p-2 rounded-xl bg-slate-100       text-slate-700 dark:text-slate-200 cursor-pointer transition-all duration-300 hover:rotate-12 focus:outline-none"
        aria-label="Toggle Dark Mode"
        title="Toggle Dark Mode"
      >
        {darkMode ? (
          // Sun Icon
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
            />
          </svg>
        ) : (
          // Moon Icon
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
