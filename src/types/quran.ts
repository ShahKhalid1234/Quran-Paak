export interface SurahMeta {
  surah_number: number;
  name_english: string;
  name_arabic: string;
  english_meaning: string;
  total_ayahs: number;
  revelation_type: 'Meccan' | 'Medinan' | string;
}

export interface Verse {
  SurahNumber: number;
  SurahName: string;
  SurahNameArabic: string;
  AyahNumber: number;
  VerseKey: string; // e.g. "1:1"
  MaududiTranslation: string;
  Juz?: number;
  Page?: number;
  RevelationType?: string;
  originalRowIndex?: number;
}

export interface QuranDataset {
  edition: string;
  translator: string;
  title: string;
  totalSurahs: number;
  totalVerses: number;
  surahs: SurahMeta[];
  verses: Verse[];
}

export type CertaintyLevel = 'explicit' | 'historical_consensus' | 'disputed' | 'unverified';

export interface GeoLocation {
  id: string;
  name: string;
  arabicName?: string;
  category: 'sanctuary' | 'prophet' | 'civilization' | 'nature' | 'journey';
  lat: number;
  lng: number;
  modernCountry: string;
  modernName?: string;
  certainty: CertaintyLevel;
  certaintyNote?: string;
  relevantVerses: {
    verseKey: string;
    surahNumber: number;
    ayahNumber: number;
    surahName: string;
    contextDescription: string;
  }[];
  historicalBackground: string;
  archaeologicalNotes?: string;
  sources: { title: string; url?: string; note?: string }[];
}

export interface TopicAssociation {
  id: string;
  topicId: string;
  category: 'nature' | 'animals_plants' | 'water_rain' | 'mountains' | 'ethics' | 'patience_gratitude' | 'family' | 'society_trade' | 'history' | 'science_reflection';
  topicName: string;
  verseKey: string;
  surahNumber: number;
  ayahNumber: number;
  connectionType: 'direct' | 'thematic'; // Direct textual mention vs Educational reflection
  relevanceExplanation: string;
  supportingReference?: string;
}

export interface Bookmark {
  id: string;
  verseKey: string;
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  translation: string;
  note?: string;
  collectionName?: string;
  createdAt: number;
}

export interface ExcelInspectionReport {
  fileName: string;
  fileSizeBytes: number;
  sheetNames: string[];
  activeSheetName: string;
  totalRows: number;
  detectedColumns: string[];
  columnMapping: {
    surahNumberCol: string | null;
    ayahNumberCol: string | null;
    translationCol: string | null;
    surahNameCol: string | null;
    arabicNameCol: string | null;
  };
  sampleRows: Record<string, any>[];
  validationSummary: {
    totalValidVerses: number;
    surahsFoundCount: number;
    missingValuesCount: number;
    duplicatesRemovedCount: number;
    issuesList: string[];
  };
  timestamp: string;
}

export interface AIExplanationResult {
  summary: string;
  historicalContext: string;
  realWorldConnections: string[];
  ethicsAndLessons: string[];
  classicalReferences: string[];
  scholarlyDisclaimer: string;
}
