import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Bookmark, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  Search, 
  MapPin, 
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { Verse, SurahMeta } from '../types/quran';
import { 
  getAllSurahs, 
  getSurah, 
  getVersesBySurah, 
  toggleBookmark, 
  isBookmarked, 
  addRecentVerse 
} from '../utils/quranData';
import { CURATED_TOPIC_ASSOCIATIONS } from '../data/topics';
import { GEO_LOCATIONS } from '../data/places';

interface QuranReaderProps {
  initialSurah?: number;
  initialAyah?: number;
  onExploreVerse: (verse: Verse) => void;
  onNavigateToMapLocation?: (locationId: string) => void;
  onNavigateToTopic?: (topicId: string) => void;
}

export const QuranReader: React.FC<QuranReaderProps> = ({
  initialSurah = 1,
  initialAyah,
  onExploreVerse,
  onNavigateToMapLocation,
  onNavigateToTopic
}) => {
  const surahs = useMemo(() => getAllSurahs(), []);
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(initialSurah);
  const [verseFilterText, setVerseFilterText] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [bookmarksState, setBookmarksState] = useState<Record<string, boolean>>({});
  const verseRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const currentSurah = useMemo(() => {
    return getSurah(selectedSurahNumber) || surahs[0];
  }, [selectedSurahNumber, surahs]);

  const allSurahVerses = useMemo(() => {
    return getVersesBySurah(selectedSurahNumber);
  }, [selectedSurahNumber]);

  // Filtered verses within current Surah
  const displayedVerses = useMemo(() => {
    if (!verseFilterText.trim()) return allSurahVerses;
    const q = verseFilterText.toLowerCase();
    return allSurahVerses.filter(v => 
      v.MaududiTranslation.toLowerCase().includes(q) ||
      String(v.AyahNumber) === q ||
      v.VerseKey.includes(q)
    );
  }, [allSurahVerses, verseFilterText]);

  // Check bookmarks for all loaded verses
  useEffect(() => {
    const map: Record<string, boolean> = {};
    allSurahVerses.forEach(v => {
      map[v.VerseKey] = isBookmarked(v.VerseKey);
    });
    setBookmarksState(map);
  }, [allSurahVerses]);

  // Scroll to initial ayah if provided
  useEffect(() => {
    if (initialAyah && verseRefs.current[initialAyah]) {
      setTimeout(() => {
        verseRefs.current[initialAyah]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, [initialAyah, selectedSurahNumber]);

  // Topic associations lookup map for fast tagging
  const verseTopicsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    CURATED_TOPIC_ASSOCIATIONS.forEach(t => {
      if (!map[t.verseKey]) map[t.verseKey] = [];
      map[t.verseKey].push(t.topicName);
    });
    return map;
  }, []);

  // Geo locations lookup map
  const verseGeoMap = useMemo(() => {
    const map: Record<string, { id: string; name: string }[]> = {};
    GEO_LOCATIONS.forEach(g => {
      g.relevantVerses.forEach(rv => {
        if (!map[rv.verseKey]) map[rv.verseKey] = [];
        map[rv.verseKey].push({ id: g.id, name: g.name });
      });
    });
    return map;
  }, []);

  const handleSurahChange = (sNum: number) => {
    setSelectedSurahNumber(sNum);
    setVerseFilterText('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmark = (v: Verse) => {
    const active = toggleBookmark(v);
    setBookmarksState(prev => ({ ...prev, [v.VerseKey]: active }));
  };

  const handleCopyVerse = (v: Verse) => {
    const textToCopy = `"${v.MaududiTranslation}" — Surah ${v.SurahName} (${v.VerseKey}), Translation by Abul A'la Maududi`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedKey(v.VerseKey);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleShare = (v: Verse) => {
    if (navigator.share) {
      navigator.share({
        title: `Surah ${v.SurahName} (${v.VerseKey}) - Maududi Translation`,
        text: `"${v.MaududiTranslation}"`,
        url: window.location.href
      }).catch(() => handleCopyVerse(v));
    } else {
      handleCopyVerse(v);
    }
  };

  const prevSurah = selectedSurahNumber > 1 ? selectedSurahNumber - 1 : null;
  const nextSurah = selectedSurahNumber < surahs.length ? selectedSurahNumber + 1 : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Surah Selector & Header Toolbar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="surah-select" className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Select Surah:
            </label>
            <select
              id="surah-select"
              value={selectedSurahNumber}
              onChange={(e) => handleSurahChange(parseInt(e.target.value, 10))}
              className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {surahs.map((s) => (
                <option key={s.surah_number} value={s.surah_number}>
                  {s.surah_number}. {s.name_english} ({s.name_arabic}) — {s.total_ayahs} Ayahs
                </option>
              ))}
            </select>
          </div>

          {/* Quick Ayah / Keyword Filter within Surah */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={verseFilterText}
                onChange={(e) => setVerseFilterText(e.target.value)}
                placeholder="Filter current Surah..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none"
              />
              {verseFilterText && (
                <button
                  onClick={() => setVerseFilterText('')}
                  className="absolute right-2.5 top-2 text-stone-400 text-xs hover:text-stone-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Surah Prev / Next Jump */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                disabled={!prevSurah}
                onClick={() => prevSurah && handleSurahChange(prevSurah)}
                className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous Surah"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={!nextSurah}
                onClick={() => nextSurah && handleSurahChange(nextSurah)}
                className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next Surah"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Current Surah Title Card */}
        {currentSurah && (
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 bg-stone-50/60 dark:bg-stone-800/40 p-4 rounded-xl">
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300">
                  Surah #{currentSurah.surah_number}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                  {currentSurah.revelation_type}
                </span>
                <span className="text-xs text-stone-500">
                  {currentSurah.total_ayahs} Verses
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 dark:text-stone-100">
                {currentSurah.name_english}
                {currentSurah.english_meaning ? (
                  <span className="text-stone-500 font-normal text-base ml-2">
                    — {currentSurah.english_meaning}
                  </span>
                ) : null}
              </h2>
            </div>

            <div className="text-center sm:text-right">
              <span className="font-arabic text-3xl sm:text-4xl font-bold text-emerald-800 dark:text-emerald-300 block">
                {currentSurah.name_arabic}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bismillah Header (except for Surah 9 At-Tawbah) */}
      {selectedSurahNumber !== 9 && (
        <div className="text-center py-6 px-4 rounded-2xl bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800/60">
          <p className="font-arabic text-2xl sm:text-3xl text-emerald-900 dark:text-emerald-200 tracking-wide">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="text-xs text-stone-500 mt-2 font-medium">
            In the name of Allah, the Merciful, the Compassionate
          </p>
        </div>
      )}

      {/* Verses List */}
      <div className="space-y-4">
        {displayedVerses.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
            <p className="text-stone-500 text-sm">No verses match your filter criteria.</p>
          </div>
        ) : (
          displayedVerses.map((verse) => {
            const isSaved = !!bookmarksState[verse.VerseKey];
            const associatedTopics = verseTopicsMap[verse.VerseKey] || [];
            const associatedPlaces = verseGeoMap[verse.VerseKey] || [];

            return (
              <div
                key={verse.VerseKey}
                ref={(el) => { verseRefs.current[verse.AyahNumber] = el; }}
                id={`verse-${verse.VerseKey}`}
                className="group relative p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Verse Header Info & Toolbar */}
                <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-300/40 dark:border-emerald-800/40">
                      {verse.AyahNumber}
                    </span>
                    <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                      {verse.SurahName} {verse.VerseKey}
                    </span>
                    {verse.Juz && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500">
                        Juz {verse.Juz}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleBookmark(verse)}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isSaved
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                      }`}
                      title={isSaved ? 'Remove bookmark' : 'Bookmark verse'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleCopyVerse(verse)}
                      className="p-1.5 rounded-lg text-xs hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                      title="Copy verse reference & translation"
                    >
                      {copiedKey === verse.VerseKey ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleShare(verse)}
                      className="p-1.5 rounded-lg text-xs hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                      title="Share verse"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        addRecentVerse(verse);
                        onExploreVerse(verse);
                      }}
                      className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/80 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Explore</span>
                    </button>
                  </div>
                </div>

                {/* English Maududi Translation (Verbatim) */}
                <div className="space-y-2">
                  <p className="text-base sm:text-lg text-stone-800 dark:text-stone-100 leading-relaxed font-normal">
                    {verse.MaududiTranslation}
                  </p>
                  <p className="text-[11px] text-stone-400 italic">
                    — Translation by Abul A'la Maududi
                  </p>
                </div>

                {/* Real-World Badges (Topics & Places) */}
                {(associatedTopics.length > 0 || associatedPlaces.length > 0) && (
                  <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-stone-100 dark:border-stone-800/40">
                    {associatedTopics.map((topic, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (onNavigateToTopic) onNavigateToTopic(topic);
                          else onExploreVerse(verse);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 text-[11px] font-medium border border-stone-200 dark:border-stone-700 transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{topic}</span>
                      </button>
                    ))}

                    {associatedPlaces.map((place, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (onNavigateToMapLocation) onNavigateToMapLocation(place.id);
                          else onExploreVerse(verse);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-800 dark:text-blue-300 text-[11px] font-medium border border-blue-200 dark:border-blue-800 transition-colors"
                      >
                        <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span>Place: {place.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Surah Navigation Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
        <button
          disabled={!prevSurah}
          onClick={() => prevSurah && handleSurahChange(prevSurah)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Surah</span>
        </button>

        <span className="text-xs text-stone-400 font-medium hidden sm:inline">
          Surah {selectedSurahNumber} of {surahs.length}
        </span>

        <button
          disabled={!nextSurah}
          onClick={() => nextSurah && handleSurahChange(nextSurah)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next Surah</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
