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
    if (!url.trim()) return;

    setLoading(true);
    try {
      const res = await scrapeBusiness(url.trim());
      setData(res);
      onDataScraped(res); // 🔥 critical – keep this
    } catch {
      alert("Failed to scrape website");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[300px] bg-white rounded-lg border border-border p-4">
      <h2 className="mb-4">Business Scraper</h2>

      {/* ✅ FORM FIX */}
      <form
        className="flex gap-2 mb-6"
        onSubmit={e => {
          e.preventDefault(); // stop page reload
          handleScrape();
        }}
      >
        <Input
          placeholder="https://example.com"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Scrape"}
        </Button>
      </form>

      {data && (
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>{data.business_name}</span>
          </div>

          <div>{data.description}</div>

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{data.emails.join(", ") || "No emails"}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{data.phones.join(", ") || "No phones"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
