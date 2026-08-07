export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message missing"
      });
    }

    // Check Vercel environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing in Vercel Environment Variables"
      });
    }

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      encodeURIComponent(apiKey);

    const geminiResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  "You are Ayra, a friendly AI assistant created by Asfak. " +
                  "Understand Hindi, Hinglish and English. " +
                  "Answer the user's question naturally and helpfully.\n\n" +
                  "User: " +
                  message
              }
            ]
          }
        ]
      })
    });

    const data = await geminiResponse.json();

    // Gemini returned an error
    if (!geminiResponse.ok) {
      console.error("GEMINI ERROR:", data);

      return res.status(500).json({
        error:
          "Gemini API Error: " +
          (data?.error?.message || "Unknown Gemini error")
      });
    }

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      console.error("NO ANSWER:", data);

      return res.status(500).json({
        error: "Gemini returned no answer"
      });
    }

    return res.status(200).json({
      reply: answer
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      error: "Server Error: " + error.message
    });
  }
}
