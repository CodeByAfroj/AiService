// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://aibasedpersonaldashboard.onrender.com"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // allow request
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.post("/api/ask", async (req, res) => {
  try {
    const { prompt, provider } = req.body;

    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    // Instruction prompt to guide AI
    const systemPrompt = `
You are ChatGPT, a helpful AI assistant.
Always follow these rules:

📝 Answer Style

✅ Use clear, concise bullet points for explanations

✅ Add relevant emojis to make answers engaging and easy to scan

✅ Provide at least 3 useful results, options, or insights (unless impossible)

✅ Use Markdown headings and bold text for readability

💡 Additional Guidelines

🔹 Give examples or code snippets when helpful

🔹 Suggest best practices if applicable

🔹 When explaining a process, break it into steps

🔹 Be direct but friendly (avoid long unnecessary text)

🔹 If there are common mistakes, mention them with ⚠️

🎯 Response Goals

Provide actionable answers (something the user can apply immediately)

Make information structured, easy to follow, and professional

Always ensure answers are accurate, clear, and helpful
`;

    let url, headers, body;

    switch (provider) {
      case "gemini":
        url =
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
          process.env.GEMINI_API_KEY;
        headers = { "Content-Type": "application/json" };
        body = {
          contents: [
            { parts: [{ text: systemPrompt }] },
            { parts: [{ text: prompt }] },
          ],
        };
        break;

      case "openrouter":
        url = "https://openrouter.ai/api/v1/chat/completions";
        headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        };
        body = {
          model: "openai/gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
        };
        break;

      case "huggingface":
        url = "https://api-inference.huggingface.co/models/gpt2";
        headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        };
        body = { inputs: `${systemPrompt}\n\nUser: ${prompt}` };
        break;

      default:
        return res.status(400).json({ error: "Invalid provider" });
    }

    // Call the AI API
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Normalize response
    let aiText = "";
    if (provider === "gemini") aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (provider === "openrouter") aiText = data?.choices?.[0]?.message?.content || "";
    if (provider === "huggingface") aiText = Array.isArray(data) ? data[0]?.generated_text : "";

    // Post-processing
    aiText = aiText.trim();
    aiText = "🤖 **AI says:**\n\n" + aiText; // Markdown-ready

    res.json({ text: aiText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
