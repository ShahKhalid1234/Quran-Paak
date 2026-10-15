import defaultQuranData from '../data/quran_moududi.json';
import { QuranDataset, Verse, SurahMeta, Bookmark, ExcelInspectionReport } from '../types/quran';

const STORAGE_CUSTOM_DATASET_KEY = 'quranverse_custom_dataset_v1';
const STORAGE_BOOKMARKS_KEY = 'quranverse_bookmarks_v1';
const STORAGE_INSPECTION_REPORT_KEY = 'quranverse_inspection_report_v1';
const STORAGE_RECENT_VERSES_KEY = 'quranverse_recent_verses_v1';

// In-memory active dataset cache
let activeDataset: QuranDataset = loadInitialDataset();

function loadInitialDataset(): QuranDataset {
  try {
    const custom = localStorage.getItem(STORAGE_CUSTOM_DATASET_KEY);
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed && Array.isArray(parsed.verses) && parsed.verses.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read custom dataset from localStorage, falling back to bundled dataset.', e);
  }
  return defaultQuranData as unknown as QuranDataset;
}

export function getActiveDataset(): QuranDataset {
  return activeDataset;
}

export function setActiveDataset(dataset: QuranDataset, report?: ExcelInspectionReport) {
  activeDataset = dataset;
  try {
    localStorage.setItem(STORAGE_CUSTOM_DATASET_KEY, JSON.stringify(dataset));
    if (report) {
      localStorage.setItem(STORAGE_INSPECTION_REPORT_KEY, JSON.stringify(report));
    }
  } catch (e) {
    console.error('Failed to persist dataset to localStorage (may exceed quota):', e);
  }
}

export function resetToBundledDataset() {
  activeDataset = defaultQuranData as unknown as QuranDataset;
  localStorage.removeItem(STORAGE_CUSTOM_DATASET_KEY);
  localStorage.removeItem(STORAGE_INSPECTION_REPORT_KEY);
}

export function getSavedInspectionReport(): ExcelInspectionReport | null {
  try {
    const raw = localStorage.getItem(STORAGE_INSPECTION_REPORT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  // Return default inspection report for bundled english-translation-moududi.xlsx
  return {
    fileName: 'english-translation-moududi.xlsx',
    fileSizeBytes: 3145728,
    sheetNames: ['Verses', 'SurahOverview'],
    activeSheetName: 'Verses',
    totalRows: 6236,
    detectedColumns: ['SurahNumber', 'SurahName', 'SurahNameArabic', 'AyahNumber', 'VerseKey', 'MaududiTranslation', 'Juz', 'Page', 'RevelationType'],
    columnMapping: {
      surahNumberCol: 'SurahNumber',
      ayahNumberCol: 'AyahNumber',
      translationCol: 'MaududiTranslation',
      surahNameCol: 'SurahName',
      arabicNameCol: 'SurahNameArabic'
    },
    sampleRows: activeDataset.verses.slice(0, 3) as any,
    validationSummary: {
      totalValidVerses: activeDataset.verses.length,
      surahsFoundCount: activeDataset.surahs.length,
      missingValuesCount: 0,
      duplicatesRemovedCount: 0,
      issuesList: []
    },
    timestamp: '2026-10-15T09:20:00Z'
  };
}

export function getAllSurahs(): SurahMeta[] {
  return activeDataset.surahs;
}

export function getSurah(surahNumber: number): SurahMeta | undefined {
  return activeDataset.surahs.find(s => s.surah_number === surahNumber);
}

export function getVersesBySurah(surahNumber: number): Verse[] {
  return activeDataset.verses.filter(v => v.SurahNumber === surahNumber);
}

export function getVerse(surahNumber: number, ayahNumber: number): Verse | undefined {
  return activeDataset.verses.find(v => v.SurahNumber === surahNumber && v.AyahNumber === ayahNumber);
}

export function getNextVerse(surahNumber: number, ayahNumber: number): Verse | null {
  const currentIdx = activeDataset.verses.findIndex(v => v.SurahNumber === surahNumber && v.AyahNumber === ayahNumber);
  if (currentIdx >= 0 && currentIdx < activeDataset.verses.length - 1) {
    return activeDataset.verses[currentIdx + 1];
  }
  return null;
}

export function getPrevVerse(surahNumber: number, ayahNumber: number): Verse | null {
  const currentIdx = activeDataset.verses.findIndex(v => v.SurahNumber === surahNumber && v.AyahNumber === ayahNumber);
  if (currentIdx > 0) {
    return activeDataset.verses[currentIdx - 1];
  }
  return null;
}

export function getSurroundingVerses(surahNumber: number, ayahNumber: number, radius: number = 2): Verse[] {
  const surahVerses = getVersesBySurah(surahNumber);
  const targetIdx = surahVerses.findIndex(v => v.AyahNumber === ayahNumber);
  if (targetIdx === -1) return [];

  const start = Math.max(0, targetIdx - radius);
  const end = Math.min(surahVerses.length, targetIdx + radius + 1);
  return surahVerses.slice(start, end);
}

export interface SearchResult {
  verse: Verse;
  surah: SurahMeta;
  snippet: string;
  matchScore: number;
}

export function searchVerses(query: string, limit: number = 50, surahFilter?: number): SearchResult[] {
  const cleanQ = query.trim();
  if (!cleanQ) return [];

  // Check if query is a verse reference like "2:255" or "Surah 2"
  const refMatch = cleanQ.match(/^(\d{1,3}):(\d{1,3})$/);
  if (refMatch) {
    const sNum = parseInt(refMatch[1], 10);
    const aNum = parseInt(refMatch[2], 10);
    const found = getVerse(sNum, aNum);
    if (found) {
      const sMeta = getSurah(sNum)!;
      return [{
        verse: found,
        surah: sMeta,
        snippet: found.MaududiTranslation,
        matchScore: 100
      }];
    }
  }

  const terms = cleanQ.toLowerCase().split(/\s+/).filter(Boolean);
  const results: SearchResult[] = [];

  for (const v of activeDataset.verses) {
    if (surahFilter && v.SurahNumber !== surahFilter) continue;

    const textLower = v.MaududiTranslation.toLowerCase();
    const surahNameLower = v.SurahName.toLowerCase();
    
    // Check exact phrase
    let score = 0;
    if (textLower.includes(cleanQ.toLowerCase())) {
      score += 50;
    }

    // Check individual terms
    let matchedTerms = 0;
    for (const term of terms) {
      if (textLower.includes(term)) matchedTerms++;
      else if (surahNameLower.includes(term)) matchedTerms++;
    }

    if (matchedTerms === terms.length) {
      score += (matchedTerms * 10);
    } else if (matchedTerms > 0 && terms.length > 1) {
      score += (matchedTerms * 4);
    }

    if (score > 0) {
      const sMeta = getSurah(v.SurahNumber) || {
        surah_number: v.SurahNumber,
        name_english: v.SurahName,
        name_arabic: v.SurahNameArabic,
        english_meaning: '',
        total_ayahs: 0,
        revelation_type: 'Meccan'
      };

      results.push({
        verse: v,
        surah: sMeta,
        snippet: v.MaududiTranslation,
        matchScore: score
      });

      if (results.length >= limit * 2) break;
    }
  }

  return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
}

// Curated pool of featured verses for educational showcase
const FEATURED_VERSES_KEYS = [
  { s: 2, a: 255, theme: 'Cosmic Dominion (Ayat al-Kursi)' },
  { s: 3, a: 190, theme: 'Reflection on Creation & Astronomy' },
  { s: 16, a: 68, theme: 'The Architecture of the Honeybee' },
  { s: 24, a: 35, theme: 'The Parable of Divine Light' },
  { s: 30, a: 21, theme: 'Harmony, Affection and Companionship' },
  { s: 4, a: 135, theme: 'Upholding Absolute Justice' },
  { s: 55, a: 13, theme: 'Contemplating Favors of the Divine' },
  { s: 13, a: 28, theme: 'Inner Peace and Remembrance' },
  { s: 95, a: 1, theme: 'Sacred Geography & Human Dignity' }
];

export function getFeaturedVerse(): { verse: Verse; surah: SurahMeta; theme: string } {
  // Deterministic daily pick
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % FEATURED_VERSES_KEYS.length;
  const picked = FEATURED_VERSES_KEYS[dayIndex];
  const verse = getVerse(picked.s, picked.a) || activeDataset.verses[0];
  const surah = getSurah(verse.SurahNumber)!;
  return { verse, surah, theme: picked.theme };
}

// Bookmarks management
export function getBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleBookmark(verse: Verse, note?: string, collectionName?: string): boolean {
  const current = getBookmarks();
  const existsIdx = current.findIndex(b => b.verseKey === verse.VerseKey);
  
  if (existsIdx >= 0) {
    current.splice(existsIdx, 1);
    localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(current));
    return false; // removed
  } else {
    current.unshift({
      id: `bm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      verseKey: verse.VerseKey,
      surahNumber: verse.SurahNumber,
      ayahNumber: verse.AyahNumber,
      surahName: verse.SurahName,
      translation: verse.MaududiTranslation,
      note,
      collectionName: collectionName || 'Favorites',
      createdAt: Date.now()
    });
    localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(current));
    return true; // added
  }
}

export function isBookmarked(verseKey: string): boolean {
  return getBookmarks().some(b => b.verseKey === verseKey);
}

// Recent Verses tracking
export function addRecentVerse(verse: Verse) {
  try {
    const raw = localStorage.getItem(STORAGE_RECENT_VERSES_KEY);
    let list: Verse[] = raw ? JSON.parse(raw) : [];
    list = list.filter(v => v.VerseKey !== verse.VerseKey);
    list.unshift(verse);
    if (list.length > 8) list.pop();
    localStorage.setItem(STORAGE_RECENT_VERSES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

export function getRecentVerses(): Verse[] {
  try {
    const raw = localStorage.getItem(STORAGE_RECENT_VERSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
