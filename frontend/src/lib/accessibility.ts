/**
 * Accessibility utilities for improved user experience
 * Includes color contrast helpers and ARIA utilities
 */

// WCAG contrast ratio requirements
export const CONTRAST_RATIOS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3,
  AAA_NORMAL: 7,
  AAA_LARGE: 4.5,
} as const;

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(
  hex: string,
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance of a color
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if color combination meets WCAG standards
 */
export function meetsWCAG(
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA",
  isLargeText: boolean = false,
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const required = isLargeText
    ? level === "AA"
      ? CONTRAST_RATIOS.AA_LARGE
      : CONTRAST_RATIOS.AAA_LARGE
    : level === "AA"
      ? CONTRAST_RATIOS.AA_NORMAL
      : CONTRAST_RATIOS.AAA_NORMAL;

  return ratio >= required;
}

/**
 * Generate accessible color classes based on context
 */
export const accessibleColors = {
  // High contrast text colors
  text: {
    primary: "text-neutral-900 dark:text-neutral-50",
    secondary: "text-neutral-700 dark:text-neutral-200",
    muted: "text-neutral-600 dark:text-neutral-300",
    disabled: "text-neutral-400 dark:text-neutral-500",
  },

  // Background colors with proper contrast
  background: {
    primary: "bg-white dark:bg-neutral-900",
    secondary: "bg-neutral-50 dark:bg-neutral-800",
    muted: "bg-neutral-100 dark:bg-neutral-700",
    accent: "bg-blue-50 dark:bg-blue-900/20",
  },

  // Interactive element colors
  interactive: {
    primary:
      "text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200",
    secondary:
      "text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-50",
    danger:
      "text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200",
    success:
      "text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200",
  },

  // Border colors
  border: {
    default: "border-neutral-200 dark:border-neutral-700",
    muted: "border-neutral-100 dark:border-neutral-800",
    accent: "border-blue-200 dark:border-blue-700",
  },
} as const;

/**
 * ARIA utilities for better screen reader support
 */
export const aria = {
  /**
   * Generate ARIA label for progress bars
   */
  progressLabel: (current: number, total: number, unit: string = "dollars") =>
    `${current.toLocaleString()} ${unit} raised of ${total.toLocaleString()} ${unit} goal`,

  /**
   * Generate ARIA label for percentage progress
   */
  percentageLabel: (percentage: number) =>
    `${percentage.toFixed(0)} percent complete`,

  /**
   * Generate ARIA label for donation amounts
   */
  donationLabel: (amount: number, currency: string = "USD") =>
    `Donation amount: ${amount.toLocaleString()} ${currency}`,

  /**
   * Generate ARIA label for milestone achievements
   */
  milestoneLabel: (milestone: number) =>
    `Milestone achieved: ${milestone} percent of goal reached`,
} as const;

/**
 * Focus management utilities
 */
export const focus = {
  /**
   * Trap focus within an element
   */
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener("keydown", handleTabKey);
    return () => element.removeEventListener("keydown", handleTabKey);
  },

  /**
   * Announce content to screen readers
   */
  announce: (message: string, priority: "polite" | "assertive" = "polite") => {
    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", priority);
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    announcer.textContent = message;

    document.body.appendChild(announcer);
    setTimeout(() => document.body.removeChild(announcer), 1000);
  },
} as const;

/**
 * Screen reader only utility class
 */
export const srOnly =
  "sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0";

/**
 * Skip link utility for keyboard navigation
 */
export const skipLink =
  "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:border focus:border-black focus:rounded";
