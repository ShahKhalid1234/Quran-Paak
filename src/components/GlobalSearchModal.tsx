import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Sparkles, MapPin, ArrowRight, CornerDownLeft } from 'lucide-react';
import { searchVerses, SearchResult } from '../utils/quranData';
import { Verse } from '../types/quran';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVerse: (verse: Verse) => void;
  onSelectSurah?: (surahNumber: number) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectVerse,
  onSelectSurah
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      const hits = searchVerses(query, 30);
      setResults(hits);
      setIsSearching(false);
    }, 180);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const quickSearches = [
    { label: 'Ayat al-Kursi (2:255)', query: '2:255' },
    { label: 'Bee architecture (16:68)', query: '16:68' },
    { label: 'Mountains as pegs (78:6)', query: '78:6' },
    { label: 'Justice even against self', query: 'justice witnesses parents' },
    { label: 'Patience & Gratitude', query: 'patient grateful' },
    { label: 'Marib & Saba', query: 'Saba' }
  ];

  const highlightMatch = (text: string, term: string) => {
    if (!term.trim()) return text;
    const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 dark:bg-amber-900/60 text-emerald-950 dark:text-amber-100 rounded px-0.5 font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/80">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verses, keywords, or references (e.g. 2:255, rain, mountains, justice)..."
            className="w-full bg-transparent border-none text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs rounded border border-stone-200 dark:border-stone-700 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isSearching && (
            <div className="py-8 text-center text-stone-500 text-sm">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent mb-2"></div>
              <p>Searching 6,236 verses...</p>
            </div>
          )}

          {!isSearching && query && results.length === 0 && (
            <div className="py-10 text-center text-stone-500">
              <BookOpen className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-700 mb-2" />
              <p className="text-sm font-medium">No verses found matching "{query}"</p>
              <p className="text-xs text-stone-400 mt-1">Try another term, a topic name, or reference format like "2:255"</p>
            </div>
          )}

          {!query && (
            <div className="space-y-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 px-1">
                Suggested Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {quickSearches.map((item) => (
                  <button
                    key={item.query}
                    onClick={() => setQuery(item.query)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-700 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800">
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 px-1">
                  Tips
                </h4>
                <ul className="text-xs text-stone-500 dark:text-stone-400 space-y-1.5 px-1 list-disc list-inside">
                  <li>Enter <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded text-emerald-700 dark:text-emerald-400">18:10</code> to jump directly to Surah 18, Verse 10.</li>
                  <li>Search natural phenomena: "rain", "mountains", "clouds", "seas".</li>
                  <li>Search ethical themes: "justice", "patience", "parents", "charity".</li>
                </ul>
              </div>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-stone-500 px-1 flex justify-between items-center">
                <span>Found {results.length} matching verses</span>
                <span className="text-[11px] text-stone-400">Click to explore verse</span>
              </div>
              {results.map(({ verse, surah }) => (
                <div
                  key={verse.VerseKey}
                  onClick={() => {
                    onSelectVerse(verse);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
                        Surah {verse.SurahName} {verse.VerseKey}
                      </span>
                      <span className="text-xs text-stone-500 dark:text-stone-400">
                        {surah.english_meaning ? `(${surah.english_meaning})` : ''}
                      </span>
                    </div>
                    <span className="font-arabic text-sm text-stone-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                      {verse.SurahNameArabic}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 line-clamp-3 leading-relaxed">
                    {highlightMatch(verse.MaududiTranslation, query)}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400">
                    <span>Maududi Translation</span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Verse <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
