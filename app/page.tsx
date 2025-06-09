import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import QuerySubmitButton from "@/components/query-submit/query-submit";
import { PageLoader } from "@/components/loaders/page-loader";

export default function Home() {
  return (
    <PageLoader>
      <div className="px-10 pt-10 flex flex-col items-center justify-center min-h-screen">
        <div className="mb-5 text-center">
          <h1 className="text-2xl">CareBridge</h1>
          <p>Community resource finder</p>
        </div>
        <div className="grid w-full max-w-xl gap-2">
          <Label htmlFor="query">Enter any additional information:</Label>
          <Textarea placeholder="Anything else?" id="query" />
          <QuerySubmitButton />
        </div>
      </div>
    </PageLoader>
  );
}
