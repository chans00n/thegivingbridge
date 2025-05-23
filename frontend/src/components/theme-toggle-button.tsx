"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";

export const ThemeToggleButton = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or null on the server to avoid hydration mismatch
    return <div style={{ width: "2.5rem", height: "2.5rem" }} />; // Same size as button
  }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      // theme === "system" or any unhandled case
      setTheme("light");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "light" && theme !== "system" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : resolvedTheme === "dark" && theme !== "system" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Monitor className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
};
