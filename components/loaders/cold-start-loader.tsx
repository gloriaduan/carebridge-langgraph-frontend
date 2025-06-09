"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { ColdStartLoaderProps } from "@/types";

export function ColdStartLoader({
  onComplete,
  duration = 5000,
  message = "Starting up server...",
}: ColdStartLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = 100 / (duration / 100);
        const newProgress = prev + increment;

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
          }, 200); // Small delay before hiding
          return 100;
        }

        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Getting things ready</h2>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>

        <div className="space-y-3">
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-100 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Loading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            This may take a moment on first visit
          </p>
        </div>
      </div>
    </div>
  );
}
