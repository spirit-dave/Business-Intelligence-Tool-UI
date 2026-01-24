import { useState } from "react";
import { ScraperPanel } from "@/app/components/ScraperPanel";
import { AIChatPanel } from "@/app/components/AIChatPanel";
import { BarChart3 } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [businessData, setBusinessData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-white">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary">
                  <BarChart3 className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-semibold">BizIntel</span>
              </div>

              <div className="hidden sm:flex gap-1">
                {["dashboard", "scraper", "insights", "settings"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      activeTab === tab
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    {tab === "insights"
                      ? "AI Insights"
                      : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Early Access
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6">
          {/* IMPORTANT:
              - No fixed heights
              - No min-h calc
              - Let the page scroll naturally
          */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <ScraperPanel onDataScraped={setBusinessData} />
            <AIChatPanel businessData={businessData} />
          </div>
        </div>
      </main>
    </div>
  );
}
