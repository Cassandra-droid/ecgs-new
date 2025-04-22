// app/api/advisor/route.ts

export async function POST() {
  const url = 'https://chat-gpt-v2.p.rapidapi.com/generate_content';

  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': '59a89d7ab2mshd988ddf245db156p1a255cjsnc49d97442c71',
      'x-rapidapi-host': 'chat-gpt-v2.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: 'What careers are suitable for someone who enjoys problem-solving and math?'
    }),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return new Response(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch advisor data', { status: 500 });
  }
}
