import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-verse-explainer',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/explain-verse' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const { surahNumber, surahName, ayahNumber, translationText, surroundingText } = JSON.parse(body || '{}');

              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                res.statusCode = 503;
                return res.end(JSON.stringify({
                  error: 'API_KEY_UNAVAILABLE',
                  message: 'Gemini API key is not configured in the environment. Offline educational context is provided.'
                }));
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

              res.statusCode = 200;
              return res.end(response.text);
            } catch (err: any) {
              console.error('Gemini explanation error:', err);
              res.statusCode = 500;
              return res.end(JSON.stringify({
                error: 'GENERATION_FAILED',
                message: err.message || 'Failed to generate explanation'
              }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
