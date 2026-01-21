import { apiFetch } from "./client";

export function scrapeBusiness(url: string) {
  return apiFetch("/api/scrape", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}
