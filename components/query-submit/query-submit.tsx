"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { socket } from "@/lib/socket";
import ResultCard from "../result/result-card";
import { LocationResult } from "@/types";

export default function QuerySubmitButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [finalResult, setFinalResult] = useState("");

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

    socket.on("final_res", (data: { message: string }) => {
      console.log("Final result received:", data.message);
      setFinalResult(data.message);
      setIsLoading(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const handleSubmit = () => {
    const queryElement = document.getElementById(
      "query"
    ) as HTMLTextAreaElement | null;
    const query = queryElement?.value?.trim();

    if (!query) return;

    setResults([]);
    setFinalResult("");
    setIsLoading(true);

    socket.emit("on_submit_query", { query });
  };

  return (
    <>
      <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            Search <ArrowRight className="ml-2" />
          </>
        )}
      </Button>

      {/* Results display */}
      {results.length > 0 && (
        <div className="mt-6 space-y-2 fade-in-grow">
          <h2 className="text-lg font-medium">Progress:</h2>
          <div className="p-4 bg-gray-50 rounded-md max-h-60 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="py-1 fade-in">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      {finalResult && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md fade-in-grow">
          <h2 className="text-lg font-medium text-green-800">Final Result:</h2>
          {/* <p className="mt-2">{finalResult}</p> */}
          {JSON.parse(finalResult).addresses.map(
            (result: LocationResult, index: number) => (
              <ResultCard key={index} result={result} />
            )
          )}
        </div>
      )}
    </>
  );
}
