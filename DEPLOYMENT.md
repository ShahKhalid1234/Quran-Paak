# QuranVerse Explorer — Deployment & Architecture Guide

## Overview

**QuranVerse Explorer** is an interactive educational platform designed to explore Quranic verses and understand their connections to real-world geography, natural science reflection, and everyday human ethics.

The application uses the authentic English translation of the Holy Quran by **Sayyid Abul A'la Maududi** (*Tafhim al-Qur'an: The Meaning of the Quran*), imported directly from the primary Excel file:
```
/english-translation-moududi.xlsx
```

---

## 1. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Optional | Used for the server-side AI-assisted "Understand the Context" feature via `@google/genai` (model: `gemini-3.8-flash`). If absent, the application continues functioning normally using offline curated scholarship notes. |
| `APP_URL` | Optional | The base URL for canonical sharing links. |
| `PORT` | Optional | Default is `3000` for the Node / Express backend. |

---

## 2. Vercel Deployment Instructions

### Method A: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```

### Method B: Deploy via Vercel Git Integration
1. Push this repository to GitHub or GitLab.
2. In the Vercel Dashboard, click **New Project** and select the repository.
3. Configure project settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. In **Settings > Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your Google AI Studio Gemini API Key)*
5. Click **Deploy**.

---

## 3. Full-Stack Node / Docker Deployment

To run the unified Express backend with static frontend serving:
```bash
npm run build
npm start
```
The server will start on port `3000` (or `process.env.PORT`), serving both the compiled frontend and the server-side endpoint `POST /api/explain-verse`.

---

## 4. Excel Dataset Architecture & Admin Importer

1. **Primary Dataset File:**
   - File path: `/english-translation-moududi.xlsx` (3.0 MB)
   - Sheet 1: `Verses` (6,236 rows, columns: `SurahNumber`, `SurahName`, `SurahNameArabic`, `AyahNumber`, `VerseKey`, `MaududiTranslation`, `Juz`, `Page`, `RevelationType`)
   - Sheet 2: `SurahOverview` (114 rows with Surah metadata)

2. **Live Inspection & Admin Replacement:**
   - Access the **Admin Dashboard** in the navigation bar using the demo PIN: `admin123`.
   - Administrators can upload any replacement `.xlsx` or `.csv` file. The internal engine auto-detects column names, verifies Surah/Ayah numbers, purges duplicates, and produces a live validation report.
   - You can also export the active dataset back to `.xlsx` or reset to the default authentic Maududi dataset with a single click.

---

## 5. Scholarly Safeguards & Ethics

- **Verbatim Integrity:** The translated text is preserved verbatim without alteration.
- **Classification of Claims:** Geographical locations and real-world connections explicitly separate direct textual mentions from academic/commentary hypotheses and disputed traditions.
- **Non-Fatwa Notice:** All real-world and AI commentaries are strictly for educational inquiry and contemplation (*tadabbur*), not legal rulings.
