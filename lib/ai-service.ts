// app/lib/aiClient.ts
export async function fetchAIResponse(question: string): Promise<string> {
  const url = 'https://chat-gpt-v2.p.rapidapi.com/generate_content';

  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': '59a89d7ab2mshd988ddf245db156p1a255cjsnc49d97442c71',
      'X-RapidAPI-Host': 'chat-gpt-v2.p.rapidapi.com',
    },
    body: JSON.stringify({ q: question }),
  };

  const response = await fetch(url, options);
  const data = await response.json();

  return data.result || 'No response received.';
}
