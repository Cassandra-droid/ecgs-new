export async function fetchJobs(filters: Record<string, string> = {}) {
    const baseUrl = "http://127.0.0.1:8000/api/jobs/";
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${baseUrl}?${queryParams}`;
  
    const response = await fetch(url, { cache: "no-store" }); 
    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
  
    return response.json(); // Return JSON data
  }
  