"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowRight,
  Loader2,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { socket } from "@/lib/socket";
import ResultCard from "../result/result-card";
import type { LocationResult } from "@/types";

export default function QuerySubmitButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [finalResult, setFinalResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Default Toronto coordinates
  const DEFAULT_LOCATION = { lat: 43.65212493429662, lng: -79.3804402346119 };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("update", (data: { message: string }) => {
      console.log("Update received:", data.message);
      setResults((prev) => [...prev, data.message]);
    });

    socket.on("final_res", (data: { message: string; error_msg?: string }) => {
      if (data.error_msg) {
        console.log("Error received:", data.error_msg);
        setError(data.error_msg);
        setIsLoading(false);
        return;
      }
      console.log("Final result received:", data.message);
      setFinalResult(data.message);
      setIsLoading(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  // Centralized function to submit query to socket
  const submitQueryToSocket = (userLocation: { lat: number; lng: number }) => {
    const queryElement = document.getElementById(
      "query"
    ) as HTMLTextAreaElement | null;
    const query = queryElement?.value?.trim();

    if (!query) return;

    // Reset states
    setError(null);
    setResults([]);
    setFinalResult("");
    setIsLoading(true);
    setIsDialogOpen(false);
    setLocationError(null);

    console.log("Submitting query with location:", { query, userLocation });

    // Emit the query and location to the server
    socket.emit("on_submit_query", {
      query,
      location: userLocation,
    });
  };

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by this browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(coords);
        },
        (error) => {
          let errorMessage = "Unable to retrieve your location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please enable location permissions and try again.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again.";
              break;
          }

          reject(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const checkLocationPermission = async (): Promise<boolean> => {
    if (!navigator.permissions) {
      return false; // Permissions API not supported
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      return permission.state === "granted";
    } catch (error) {
      return false; // Error checking permissions
    }
  };

  const handleSubmitWithLocationRequest = async () => {
    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const userLocation = await getCurrentLocation();
      setIsGettingLocation(false);
      submitQueryToSocket(userLocation);
    } catch (error) {
      setLocationError(error as string);
      setIsGettingLocation(false);
    }
  };

  const handleProceedWithoutLocation = () => {
    submitQueryToSocket(DEFAULT_LOCATION);
  };

  const handleRetryLocation = () => {
    setLocationError(null);
    handleSubmitWithLocationRequest();
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    // Proceed with default location when user cancels
    submitQueryToSocket(DEFAULT_LOCATION);
  };

  const handleSubmit = async () => {
    const queryElement = document.getElementById(
      "query"
    ) as HTMLTextAreaElement | null;
    const query = queryElement?.value?.trim();

    if (!query) return;

    // Check if location permission is already granted
    const hasLocationPermission = await checkLocationPermission();

    if (hasLocationPermission) {
      // Permission already granted, get location directly
      setIsGettingLocation(true);
      try {
        const userLocation = await getCurrentLocation();
        setIsGettingLocation(false);
        submitQueryToSocket(userLocation);
      } catch (error) {
        setIsGettingLocation(false);
        // If getting location fails even with permission, use default
        submitQueryToSocket(DEFAULT_LOCATION);
      }
    } else {
      // No permission, show dialog
      setIsDialogOpen(true);
    }
  };

  const handleButtonClick = () => {
    // Don't let the dialog trigger automatically
    handleSubmit();
  };

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button
          onClick={handleButtonClick}
          disabled={isLoading || isGettingLocation}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isLoading || isGettingLocation ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {isGettingLocation
                ? "Getting location..."
                : "Searching for resources..."}
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Find Resources
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location Access Request
            </AlertDialogTitle>
            <AlertDialogDescription>
              {!locationError
                ? "We'd like to access your location to provide you with the most relevant community resources nearby."
                : "Location access failed. You can try again or continue without location."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="px-6 pb-2 space-y-3">
            {!locationError ? (
              <>
                <div className="bg-fern-green/10 p-3 rounded-lg border border-fern-green/20">
                  <p className="font-medium text-fern-green-200 mb-2">
                    How we use your location:
                  </p>
                  <ul className="text-sm text-fern-green-300 space-y-1">
                    <li>• Find resources closest to you</li>
                    <li>• Calculate accurate distances</li>
                    <li>• Show relevant local services</li>
                  </ul>
                </div>

                <div className="bg-sage/10 p-3 rounded-lg border border-sage/20">
                  <p className="font-medium text-sage-200 mb-2">
                    Privacy protection:
                  </p>
                  <ul className="text-sm text-sage-300 space-y-1">
                    <li>• Location used only for this search</li>
                    <li>• Not stored permanently</li>
                    <li>• Never shared with third parties</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-destructive mb-1">
                        Location Access Failed
                      </p>
                      <p className="text-sm text-destructive/80">
                        {locationError}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  You can still search for resources, but results may be less
                  personalized to your area.
                </p>
              </div>
            )}
          </div>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Continue without location (Toronto)
            </AlertDialogCancel>

            {!locationError ? (
              <AlertDialogAction
                onClick={handleSubmitWithLocationRequest}
                disabled={isGettingLocation}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 disabled:opacity-50"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  "Allow & Find Resources"
                )}
              </AlertDialogAction>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <AlertDialogAction
                  onClick={handleRetryLocation}
                  disabled={isGettingLocation}
                  className="flex-1 sm:flex-none border-primary/20 text-white hover:bg-primary/90"
                >
                  {isGettingLocation ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    "Try Again"
                  )}
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={handleProceedWithoutLocation}
                  className="flex-1 sm:flex-none bg-muted hover:bg-muted/80 text-muted-foreground"
                >
                  Continue Without Location (Toronto)
                </AlertDialogAction>
              </div>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Progress Section */}
      {results.length > 0 && (
        <div className="mt-8 fade-in-grow">
          <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-sage/20 to-fern-green/20 px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-fern-green/10 rounded-lg border border-fern-green/20">
                  <Clock className="h-5 w-5 text-fern-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    Search Progress
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Finding the best resources for you...
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 max-h-64 overflow-y-auto">
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="flex items-start gap-3 fade-in">
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-fern-green rounded-full"></div>
                    </div>
                    <p className="text-sm text-card-foreground leading-relaxed">
                      {result}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final Results Section */}
      {finalResult && (
        <div className="mt-8">
          <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-sm border border-border">
            <div className="bg-gradient-to-r from-hunter-green/20 to-sage/20 px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-hunter-green/10 rounded-lg border border-hunter-green/20">
                  <CheckCircle className="h-5 w-5 text-hunter-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    Resources Found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Here are the community resources that match your needs
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {JSON.parse(finalResult).addresses.map(
                  (result: LocationResult, index: number) => (
                    <ResultCard key={index} result={result} />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-8 fade-in-grow">
          <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-sm border border-destructive/20 overflow-hidden">
            <div className="bg-gradient-to-r from-destructive/10 to-destructive/5 px-6 py-4 border-b border-destructive/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    Something went wrong
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We encountered an issue while searching for resources
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-destructive leading-relaxed">
                {error}
              </p>
              <Button
                onClick={() => setError(null)}
                variant="outline"
                size="sm"
                className="mt-4 border-destructive/20 text-destructive hover:bg-destructive/10"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
