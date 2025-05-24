"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
import { Sparkles, Star, Trophy, Target } from "lucide-react";

interface AnimatedProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number;
  showMilestones?: boolean;
  milestones?: number[];
  animationDuration?: string;
  celebrateGoal?: boolean;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  className,
  value = 0,
  showMilestones = false,
  milestones = [25, 50, 75, 90],
  animationDuration = "1s",
  celebrateGoal = true,
  showPercentage = false,
  size = "md",
  ...props
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [showCelebration, setShowCelebration] = React.useState(false);
  const progressRef = React.useRef<HTMLDivElement>(null);

  // Animate progress value changes
  React.useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const startTime = Date.now();
      const startValue = displayValue;
      const endValue = value;
      const duration = 1500; // 1.5 seconds

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue =
          startValue + (endValue - startValue) * easeOutCubic;

        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          // Trigger celebration if goal reached
          if (celebrateGoal && endValue >= 100 && startValue < 100) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
          }
        }
      };

      requestAnimationFrame(animate);
    }
  }, [value, displayValue, celebrateGoal]);

  const getMilestoneIcon = (milestone: number) => {
    if (milestone <= 25) return <Target className="w-3 h-3" />;
    if (milestone <= 50) return <Star className="w-3 h-3" />;
    if (milestone <= 75) return <Sparkles className="w-3 h-3" />;
    return <Trophy className="w-3 h-3" />;
  };

  const getProgressColor = () => {
    if (displayValue >= 100) return "bg-green-500 dark:bg-green-400";
    if (displayValue >= 75) return "bg-blue-500 dark:bg-blue-400";
    if (displayValue >= 50) return "bg-yellow-500 dark:bg-yellow-400";
    if (displayValue >= 25) return "bg-orange-500 dark:bg-orange-400";
    return "bg-primary";
  };

  return (
    <div className="relative w-full">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
            <div className="flex space-x-1 animate-bounce">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              <Trophy className="w-6 h-6 text-yellow-500 animate-pulse" />
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar Container */}
      <ProgressPrimitive.Root
        ref={progressRef}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-primary/20 dark:bg-primary/10",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {/* Background pulse effect when animating */}
        {isAnimating && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        )}

        {/* Main Progress Indicator */}
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-out rounded-full relative overflow-hidden",
            getProgressColor(),
          )}
          style={{
            transform: `translateX(-${100 - Math.min(displayValue, 100)}%)`,
            transitionDuration: animationDuration,
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />

          {/* Goal achievement glow */}
          {displayValue >= 100 && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/50 to-green-600/50 animate-pulse" />
          )}
        </ProgressPrimitive.Indicator>

        {/* Milestones */}
        {showMilestones && (
          <div className="absolute inset-0 flex items-center">
            {milestones.map((milestone) => (
              <div
                key={milestone}
                className="absolute flex items-center justify-center"
                style={{ left: `${milestone}%` }}
              >
                <div
                  className={cn(
                    "w-1 bg-neutral-400 dark:bg-neutral-600 transition-all duration-300",
                    size === "sm" ? "h-3" : size === "md" ? "h-4" : "h-5",
                    displayValue >= milestone && "bg-white dark:bg-neutral-200",
                  )}
                />
                {displayValue >= milestone && (
                  <div className="absolute -top-6 text-xs font-medium flex items-center space-x-1">
                    {getMilestoneIcon(milestone)}
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {milestone}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ProgressPrimitive.Root>

      {/* Percentage Display */}
      {showPercentage && (
        <div className="mt-2 text-center">
          <span
            className={cn(
              "font-medium transition-colors duration-300",
              displayValue >= 100
                ? "text-green-600 dark:text-green-400"
                : "text-neutral-700 dark:text-neutral-300",
            )}
          >
            {displayValue.toFixed(1)}%
          </span>
          {displayValue >= 100 && (
            <span className="ml-2 text-sm text-green-600 dark:text-green-400 animate-pulse">
              🎉 Goal Achieved!
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// CSS for shimmer animation (add to globals.css)
export const progressAnimationStyles = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;
