import * as XLSX from 'xlsx';
import { Verse, SurahMeta, ExcelInspectionReport } from '../types/quran';

export function normalizeHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function detectColumnMapping(headers: string[]) {
  const normMap = new Map<string, string>();
  headers.forEach(h => normMap.set(normalizeHeader(h), h));

  const findBest = (candidates: string[]): string | null => {
    for (const c of candidates) {
      if (normMap.has(c)) return normMap.get(c)!;
    }
    // Partial substring match
    for (const [norm, orig] of normMap.entries()) {
      for (const c of candidates) {
        if (norm.includes(c) || c.includes(norm)) return orig;
      }
    }
    return null;
  };

  const surahNumberCol = findBest(['surahnumber', 'surahno', 'surah', 'chapter', 'sura', 'chapternumber', 'surahid']);
  const ayahNumberCol = findBest(['ayahnumber', 'ayahno', 'ayah', 'verse', 'verseno', 'ayat', 'verseid']);
  const translationCol = findBest(['maududitranslation', 'translation', 'translatedtext', 'text', 'english', 'meaning', 'verseenglish']);
  const surahNameCol = findBest(['surahname', 'nameenglish', 'surahnameen', 'name', 'chaptername', 'surah']);
  const arabicNameCol = findBest(['surahnamearabic', 'namearabic', 'arabicname', 'arabic']);

  return {
    surahNumberCol,
    ayahNumberCol,
    translationCol,
    surahNameCol,
    arabicNameCol
  };
}

export function inspectAndParseExcelFile(
  fileBuffer: ArrayBuffer,
  fileName: string = 'english-translation-moududi.xlsx',
  preferredSheet?: string
): { verses: Verse[]; report: ExcelInspectionReport } {
  const wb = XLSX.read(fileBuffer, { type: 'array' });
  const sheetNames = wb.SheetNames;
  
  if (sheetNames.length === 0) {
    throw new Error('The workbook contains no sheets.');
  }

  // Determine active sheet: prioritize preferredSheet, or one named "Verses", "Translation", "Quran", or the first sheet
  let activeSheetName = sheetNames[0];
  if (preferredSheet && sheetNames.includes(preferredSheet)) {
    activeSheetName = preferredSheet;
  } else {
    const candidate = sheetNames.find(s => /verse|translation|quran|moududi/i.test(s));
    if (candidate) activeSheetName = candidate;
  }

  const worksheet = wb.Sheets[activeSheetName];
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  
  if (rawRows.length === 0) {
    throw new Error(`Sheet "${activeSheetName}" is empty.`);
  }

  const detectedColumns = Object.keys(rawRows[0] || {});
  const columnMapping = detectColumnMapping(detectedColumns);

  const sampleRows = rawRows.slice(0, 5);

  const verses: Verse[] = [];
  const seenKeys = new Set<string>();
  const surahsFound = new Set<number>();
  let duplicatesRemovedCount = 0;
  let missingValuesCount = 0;
  const issuesList: string[] = [];

  rawRows.forEach((row, idx) => {
    // Extract Surah number
    let surahNum = 0;
    if (columnMapping.surahNumberCol && row[columnMapping.surahNumberCol] !== undefined) {
      surahNum = parseInt(String(row[columnMapping.surahNumberCol]).trim(), 10);
    }

    // Extract Ayah number
    let ayahNum = 0;
    if (columnMapping.ayahNumberCol && row[columnMapping.ayahNumberCol] !== undefined) {
      ayahNum = parseInt(String(row[columnMapping.ayahNumberCol]).trim(), 10);
    }

    // Fallback if verse key like "1:1" exists in a column
    if ((!surahNum || !ayahNum) && row['VerseKey']) {
      const parts = String(row['VerseKey']).split(':');
      if (parts.length === 2) {
        surahNum = parseInt(parts[0], 10);
        ayahNum = parseInt(parts[1], 10);
      }
    }

    // Extract Translation text
    let text = '';
    if (columnMapping.translationCol && row[columnMapping.translationCol] !== undefined) {
      text = String(row[columnMapping.translationCol]).trim();
    } else {
      // Look for any string column that looks like long text
      for (const col of detectedColumns) {
        const val = String(row[col] || '');
        if (val.length > text.length && !Number(val)) {
          text = val.trim();
        }
      }
    }

    // Check validity
    if (!surahNum || isNaN(surahNum) || !ayahNum || isNaN(ayahNum) || !text) {
      missingValuesCount++;
      if (issuesList.length < 10) {
        issuesList.push(`Row ${idx + 2}: Missing required fields (Surah: ${surahNum || 'N/A'}, Ayah: ${ayahNum || 'N/A'}, Text: ${text ? 'Present' : 'Empty'})`);
      }
      return;
    }

    const verseKey = `${surahNum}:${ayahNum}`;
    if (seenKeys.has(verseKey)) {
      duplicatesRemovedCount++;
      return;
    }
    seenKeys.add(verseKey);
    surahsFound.add(surahNum);

    const surahName = columnMapping.surahNameCol ? String(row[columnMapping.surahNameCol] || '').trim() : `Surah ${surahNum}`;
    const arabicName = columnMapping.arabicNameCol ? String(row[columnMapping.arabicNameCol] || '').trim() : '';

    verses.push({
      SurahNumber: surahNum,
      SurahName: surahName || `Surah ${surahNum}`,
      SurahNameArabic: arabicName,
      AyahNumber: ayahNum,
      VerseKey: verseKey,
      MaududiTranslation: text,
      Juz: row['Juz'] ? parseInt(String(row['Juz']), 10) : undefined,
      Page: row['Page'] ? parseInt(String(row['Page']), 10) : undefined,
      RevelationType: row['RevelationType'] ? String(row['RevelationType']) : undefined,
      originalRowIndex: idx + 2
    });
  });

  // Sort verses by Surah number, then Ayah number
  verses.sort((a, b) => {
    if (a.SurahNumber !== b.SurahNumber) return a.SurahNumber - b.SurahNumber;
    return a.AyahNumber - b.AyahNumber;
  });

  const report: ExcelInspectionReport = {
    fileName,
    fileSizeBytes: fileBuffer.byteLength,
    sheetNames,
    activeSheetName,
    totalRows: rawRows.length,
    detectedColumns,
    columnMapping,
    sampleRows,
    validationSummary: {
      totalValidVerses: verses.length,
      surahsFoundCount: surahsFound.size,
      missingValuesCount,
      duplicatesRemovedCount,
      issuesList
    },
    timestamp: new Date().toISOString()
  };

  return { verses, report };
}

export function exportDatasetToExcel(verses: Verse[], surahs: SurahMeta[], filename: string = 'quranverse-explorer-export.xlsx') {
  const wb = XLSX.utils.book_new();
  const wsVerses = XLSX.utils.json_to_sheet(verses.map(v => ({
    SurahNumber: v.SurahNumber,
    SurahName: v.SurahName,
    SurahNameArabic: v.SurahNameArabic,
    AyahNumber: v.AyahNumber,
    VerseKey: v.VerseKey,
    MaududiTranslation: v.MaududiTranslation,
    Juz: v.Juz || '',
    Page: v.Page || '',
    RevelationType: v.RevelationType || ''
  })));

  const wsSurahs = XLSX.utils.json_to_sheet(surahs);
  XLSX.utils.book_append_sheet(wb, wsVerses, 'Verses');
  XLSX.utils.book_append_sheet(wb, wsSurahs, 'SurahOverview');
  XLSX.writeFile(wb, filename);
}
