"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggleButton } from "./theme-toggle-button";

export const Header = () => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "FundRaiser";
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/images/tgb-logo-light.png");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setLogoSrc(
        resolvedTheme === "dark"
          ? "/images/tgb-logo-dark.png"
          : "/images/tgb-logo-light.png",
      );
    }
  }, [resolvedTheme, mounted]);

  return (
    <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src={logoSrc}
            alt={`${appName} logo`}
            width={160}
            height={64}
            priority
            className="h-auto"
          />
        </Link>

        {/* Right side container for nav and actions */}
        <div className="flex items-center gap-x-4 md:gap-x-6">
          {/* Action buttons for desktop */}
          <div className="hidden md:flex items-center gap-x-2 lg:gap-x-4">
            <Button variant="default" size="sm" asChild>
              <Link href="/interest-form">Join Us</Link>
            </Button>
            <ThemeToggleButton />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs p-6">
                <SheetHeader>
                  <SheetTitle className="sr-only">
                    Mobile Navigation Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-y-6 mt-4">
                  <div className="flex flex-col gap-y-4 pt-6 border-t">
                    <Button variant="default" asChild className="w-full">
                      <Link href="/interest-form">Join Us</Link>
                    </Button>
                    <div className="pt-2">
                      <ThemeToggleButton />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
