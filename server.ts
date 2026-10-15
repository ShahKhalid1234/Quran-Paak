import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Server-side Gemini Verse Explainer Route
app.post('/api/explain-verse', async (req, res) => {
  try {
    const { surahNumber, surahName, ayahNumber, translationText, surroundingText } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'API_KEY_UNAVAILABLE',
        message: 'Gemini API key is not configured in the environment. Offline educational context is provided.'
      });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `You are an educational Islamic knowledge and Quranic studies assistant.
Provide a balanced, objective, and scholarly contextual overview for the following Quranic verse.

Reference: Surah ${surahName} (${surahNumber}:${ayahNumber})
Maududi Translation:
"${translationText}"

${surroundingText ? `Surrounding verses context:\n${surroundingText}` : ''}

Strict Guidelines:
1. Preserve the translation verbatim.
2. Provide a plain-English explanation of what this verse conveys.
3. Historical or narrative context (circumstances of revelation / Asbab al-Nuzul or prophetic era if known, state clearly if uncertain).
4. Real-world and modern educational connections (e.g., to nature, ethics, geography, human conduct, or society).
5. Safeguard: If discussing scientific or natural phenomena, frame it as linguistic contemplation (tadabbur), not as modern clinical claims. Do NOT issue legal fatwas.
6. Provide classical reference recommendations (e.g. Maududi's Tafhim al-Qur'an, Ibn Kathir, Al-Qurtubi).

Return JSON only in this exact structure:
{
  "summary": "plain English explanation",
  "historicalContext": "historical or narrative context",
  "realWorldConnections": ["connection 1", "connection 2"],
  "ethicsAndLessons": ["lesson 1", "lesson 2"],
  "classicalReferences": ["reference 1", "reference 2"],
  "scholarlyDisclaimer": "This explanation is educational and non-binding. Always verify with classical scholars."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(response.text);
  } catch (err: any) {
    console.error('Gemini explanation error:', err);
    return res.status(500).json({
      error: 'GENERATION_FAILED',
      message: err.message || 'Failed to generate explanation'
    });
  }
});

// Serve Vite build output in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`QuranVerse Explorer server listening on port ${port}`);
});
