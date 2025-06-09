import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

import { LocationResult } from "@/types";

const ResultCard = ({ result }: { result: LocationResult }) => {
  return (
    <>
      <Card className="w-full max-w-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold leading-tight">
              {result.address}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Address - Always shown */}
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <span className="text-sm text-muted-foreground leading-relaxed">
              {result.address}
            </span>
          </div>

          {/* Phone - Conditional */}
          {result.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <a
                href={`tel:${result.phone}`}
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                {result.phone}
              </a>
            </div>
          )}

          {/* Email - Conditional */}
          {result.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <a
                href={`mailto:${result.email}`}
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                {result.email}
              </a>
            </div>
          )}

          {/* Website - Conditional */}
          {result.website && (
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
              <a
                href={result.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground hover:text-primary transition-colors truncate"
              >
                {result.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ResultCard;
