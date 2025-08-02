import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import QuerySubmitButton from "@/components/query-submit/query-submit";
import { MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-timberwolf-900 via-timberwolf-800 to-sage-900">
      <div className="px-6 pt-12 pb-8 flex flex-col items-center justify-center min-h-screen">
        {/* Header Section */}
        <div className="mb-12 text-center max-w-2xl">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl font-bold text-brunswick-green-100">
              Care<span className="text-primary">Connect</span>
            </h1>
          </div>
          <h2 className="text-xl text-hunter-green-300 mb-4">
            Community Resource Finder
          </h2>
          <p className="text-sage-300 leading-relaxed">
            Discover local resources, support services, and community programs
            tailored to your needs. We&apos;re here to help you find the right
            assistance in your area.
          </p>
        </div>

        {/* Search Card */}
        <div className="w-full max-w-2xl">
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-fern-green/10 rounded-lg border border-fern-green/20">
                <MapPin className="h-5 w-5 text-fern-green" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">
                  Find Resources Near You
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tell us what kind of help you&apos;re looking for
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="query"
                  className="text-sm font-medium text-card-foreground mb-2 block"
                >
                  What resources are you looking for?
                </Label>
                <Textarea
                  placeholder="e.g., shelters, food banks, child care centers, etc."
                  id="query"
                  className="min-h-[100px] resize-none bg-background/50 border-border focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Be as specific as possible to get the most relevant results
                </p>
              </div>
              <QuerySubmitButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
