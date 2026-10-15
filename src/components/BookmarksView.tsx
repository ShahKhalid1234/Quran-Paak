import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Trash2, 
  BookOpen, 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  Search,
  FileText
} from 'lucide-react';
import { Bookmark as BookmarkType, Verse } from '../types/quran';
import { getBookmarks, getVerse, toggleBookmark } from '../utils/quranData';

interface BookmarksViewProps {
  onExploreVerse: (verse: Verse) => void;
  onNavigateToReader: (surah: number, ayah: number) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  onExploreVerse,
  onNavigateToReader
}) => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const handleRemove = (b: BookmarkType) => {
    const verse = getVerse(b.surahNumber, b.ayahNumber);
    if (verse) {
      toggleBookmark(verse);
      setBookmarks(getBookmarks());
    }
  };

  const handleCopy = (b: BookmarkType) => {
    const text = `"${b.translation}" — Surah ${b.surahName} (${b.verseKey}), Maududi Translation`;
    navigator.clipboard.writeText(text);
    setCopiedKey(b.verseKey);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportText = () => {
    const lines = bookmarks.map(b => 
      `[Surah ${b.surahName} ${b.verseKey}]\n"${b.translation}"\nNote: ${b.note || 'None'}\n\n`
    ).join('----------------------------------------\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quranverse-saved-verses-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  };

  const filtered = bookmarks.filter(b => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return b.translation.toLowerCase().includes(q) ||
      b.surahName.toLowerCase().includes(q) ||
      b.verseKey.includes(q);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
            <Bookmark className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 dark:text-stone-100">
              Personal Saved Verses ({bookmarks.length})
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Verses bookmarked for continuous reflection, memorization, and study.
            </p>
          </div>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={handleExportText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Notes (.txt)</span>
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
          <Bookmark className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-700" />
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
            No Saved Verses Yet
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            While exploring the Quran Reader, World Map, or Real-World Topics, tap the bookmark icon on any verse to save it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in saved verses..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            {filtered.map((b) => {
              const verse = getVerse(b.surahNumber, b.ayahNumber);
              return (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        Surah {b.surahName} {b.verseKey}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(b)}
                        className="p-1.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700"
                        title="Copy verse"
                      >
                        {copiedKey === b.verseKey ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleRemove(b)}
                        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950 text-stone-400 hover:text-red-600"
                        title="Delete bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <blockquote className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed italic">
                    "{b.translation}"
                  </blockquote>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-400">
                      Saved {new Date(b.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      {verse && (
                        <button
                          onClick={() => onExploreVerse(verse)}
                          className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Explore Context</span>
                        </button>
                      )}
                      <button
                        onClick={() => onNavigateToReader(b.surahNumber, b.ayahNumber)}
                        className="inline-flex items-center gap-1 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 font-semibold ml-2"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Go to Reader</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
