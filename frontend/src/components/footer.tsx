"use client"; // Or remove if no client-side logic is needed, but good for consistency

import Link from "next/link";

export const Footer = () => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "FundRaiser";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground border-t">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
        <p className="text-sm">
          © {currentYear} {appName}. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/privacy" className="text-sm hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm hover:text-primary">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
};
