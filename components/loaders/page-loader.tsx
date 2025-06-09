"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ColdStartLoader } from "./cold-start-loader";
import type { PageLoaderProps } from "@/types";

export function PageLoader({
  children,
  showLoader = true,
  duration = 5000,
}: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true); // Default to true

  useEffect(() => {
    if (!showLoader) {
      setIsLoading(false);
      return;
    }

    const hasVisited = sessionStorage.getItem("has-visited");
    const lastVisitTime = localStorage.getItem("last-visit-time");
    const currentTime = Date.now();
    const interval = 5 * 60 * 1000; // 5 minutes

    if (
      lastVisitTime &&
      currentTime - Number.parseInt(lastVisitTime) < interval &&
      hasVisited
    ) {
      setIsLoading(false);
    } else {
      localStorage.setItem("last-visit-time", currentTime.toString());
      sessionStorage.setItem("has-visited", "true");
    }
  }, [showLoader]);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <ColdStartLoader
        onComplete={handleLoadComplete}
        duration={duration}
        message="Waking up the server... This won't take long!"
      />
    );
  }

  return (
    <div
      className={`transition-opacity duration-500 ${
        !isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {children}
    </div>
  );
}
