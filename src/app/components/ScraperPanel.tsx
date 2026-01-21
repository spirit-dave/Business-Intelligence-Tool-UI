import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Loader2, Globe, Mail, Phone } from "lucide-react";
import { scrapeBusiness } from "@/app/api/scraper";

interface BusinessData {
  business_name: string;
  description: string;
  emails: string[];
  phones: string[];
  scrape_time: number;
}

export function ScraperPanel({
  onDataScraped,
}: {
  onDataScraped: (data: BusinessData) => void;
}) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BusinessData | null>(null);

  const handleScrape = async () => {
    if (!url) return;
    setLoading(true);

    try {
      const res = await scrapeBusiness(url);
      setData(res);
      onDataScraped(res); // 🔥 CRITICAL
    } catch {
      alert("Failed to scrape website");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6 flex flex-col">
      <h2 className="mb-4">Business Scraper</h2>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="https://example.com"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <Button onClick={handleScrape} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Scrape"}
        </Button>
      </div>

      {data && (
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Globe /> {data.business_name}
          </div>
          <div>{data.description}</div>

          <div>
            <Mail /> {data.emails.join(", ") || "No emails"}
          </div>

          <div>
            <Phone /> {data.phones.join(", ") || "No phones"}
          </div>
        </div>
      )}
    </div>
  );
}
