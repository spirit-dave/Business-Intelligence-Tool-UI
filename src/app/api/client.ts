export const API_BASE_URL =
  import.meta.env.PROD
    ? "https://YOUR-BACKEND.onrender.com"
    : "http://localhost:5000";

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include", // 🔥 REQUIRED for stateful backend
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API error");
  }

  return res.json();
}
