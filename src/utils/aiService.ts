export const getToken = async () => {
  console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY);
  const token = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-realtime-preview-2024-12-17",
      voice: "verse",
      modalities: ["text", "audio"],
    }),
  });
  const data = await token.json();

  return data;
};

