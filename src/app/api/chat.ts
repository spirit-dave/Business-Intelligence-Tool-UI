import { apiFetch } from "./client";

export function askBizIntel(
  message: string,
  business_data: any
) {
  return apiFetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      message,
      business_data,
    }),
  });
}
