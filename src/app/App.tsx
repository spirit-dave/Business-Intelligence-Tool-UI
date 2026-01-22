import { useState } from "react";
import { ScraperPanel } from "@/app/components/ScraperPanel";
import { AIChatPanel } from "@/app/components/AIChatPanel";
import { BarChart3 } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [businessData, setBusinessData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-white">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary">
                  <BarChart3 className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-semibold">BizIntel</span>
              </div>

              <div className="flex gap-1">
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
              <span className="text-sm text-muted-foreground">
                Early Access
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[calc(100vh-140px)]">
          {/* Left Panel */}
          <ScraperPanel onDataScraped={setBusinessData} />

          {/* Right Panel */}
          <AIChatPanel businessData={businessData} />
        </div>
      </main>
    </div>
  );
}

