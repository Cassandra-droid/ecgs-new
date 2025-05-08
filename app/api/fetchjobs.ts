import { verifyTokenFromCookie } from "@/lib/auth"; // adjust the path if needed

export async function fetchJobs(filters: Record<string, string> = {}) {
  const token = await verifyTokenFromCookie();
  if (!token) {
    throw new Error("Invalid or missing token");
  }

  const baseUrl = "http://127.0.0.1:8000/api/jobs/";
  const queryParams = new URLSearchParams(filters).toString();
  const url = `${baseUrl}?${queryParams}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return response.json();
}
