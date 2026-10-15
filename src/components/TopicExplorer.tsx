import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  CheckCircle, 
  Info, 
  Share2, 
  Bookmark, 
  ArrowRight,
  Sun,
  CloudRain,
  Leaf,
  Mountain,
  Scale,
  HeartHandshake,
  Users,
  Coins,
  Landmark,
  Eye
} from 'lucide-react';
import { TOPIC_CATEGORIES, CURATED_TOPIC_ASSOCIATIONS } from '../data/topics';
import { TopicAssociation, Verse } from '../types/quran';
import { getVerse, toggleBookmark, isBookmarked } from '../utils/quranData';

interface TopicExplorerProps {
  initialTopicId?: string;
  onExploreVerse: (verse: Verse) => void;
  onNavigateToReader: (surah: number, ayah: number) => void;
}

export const TopicExplorer: React.FC<TopicExplorerProps> = ({
  initialTopicId,
  onExploreVerse,
  onNavigateToReader
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialTopicId || 'water_rain');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectionFilter, setConnectionFilter] = useState<'all' | 'direct' | 'thematic'>('all');

  // Category Icon Lookup
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return Sun;
      case 'CloudRain': return CloudRain;
      case 'Leaf': return Leaf;
      case 'Mountain': return Mountain;
      case 'Scale': return Scale;
      case 'HeartHandshake': return HeartHandshake;
      case 'Users': return Users;
      case 'Coins': return Coins;
      case 'Landmark': return Landmark;
      default: return Sparkles;
    }
  };

  const currentCategory = useMemo(() => {
    return TOPIC_CATEGORIES.find(c => c.id === selectedCategoryId) || TOPIC_CATEGORIES[0];
  }, [selectedCategoryId]);

  // Filtered topics
  const displayedTopics = useMemo(() => {
    return CURATED_TOPIC_ASSOCIATIONS.filter(t => {
      // Category match
      if (t.category !== selectedCategoryId && t.topicId !== selectedCategoryId) {
        // If searching globally across all categories
        if (!searchQuery.trim()) return false;
      }

      // Connection filter
      if (connectionFilter !== 'all' && t.connectionType !== connectionFilter) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.topicName.toLowerCase().includes(q) ||
          t.relevanceExplanation.toLowerCase().includes(q) ||
          t.verseKey.includes(q);
        if (!matchesName) return false;
      }

      return true;
    });
  }, [selectedCategoryId, connectionFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 dark:text-stone-100">
              Real-World Topic Explorer
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Carefully curated themes connecting Quranic verses to natural ecology, daily ethics, human history, and science reflection.
          </p>
        </div>

        {/* Global Keyword Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics or verses..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TOPIC_CATEGORIES.map((cat) => {
          const Icon = getCategoryIcon(cat.iconName);
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategoryId(cat.id);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-emerald-500'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-stone-500'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Category Description & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
        <div>
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            {currentCategory.name}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {currentCategory.description}
          </p>
        </div>

        {/* Filter by Direct vs Thematic */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Connection:</span>
          <select
            value={connectionFilter}
            onChange={(e) => setConnectionFilter(e.target.value as any)}
            className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none"
          >
            <option value="all">All Connections</option>
            <option value="direct">Direct Textual Mentions Only</option>
            <option value="thematic">Educational Reflections Only</option>
          </select>
        </div>
      </div>

      {/* Topics & Verses Grid */}
      <div className="space-y-6">
        {displayedTopics.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
            <p className="text-stone-500 text-sm">No topics match your current filter.</p>
          </div>
        ) : (
          displayedTopics.map((item) => {
            const verse = getVerse(item.surahNumber, item.ayahNumber);
            const isDirect = item.connectionType === 'direct';

            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Header: Topic Title & Connection Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 font-heading">
                      {item.topicName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isDirect
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800/40'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/40 dark:border-amber-800/40'
                    }`}>
                      {isDirect ? 'Direct Textual Reference' : 'Educational Reflection / Tadabbur'}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      Verse {item.verseKey}
                    </span>
                  </div>
                </div>

                {/* Original Maududi Translation (Verbatim) */}
                {verse ? (
                  <div className="p-4 rounded-xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-400">
                      <span>Surah {verse.SurahName} ({verse.VerseKey})</span>
                      <span className="font-arabic text-sm text-stone-500">
                        {verse.SurahNameArabic}
                      </span>
                    </div>
                    <blockquote className="text-sm sm:text-base text-stone-800 dark:text-stone-100 leading-relaxed font-normal italic border-l-3 border-emerald-600 pl-3">
                      "{verse.MaududiTranslation}"
                    </blockquote>
                    <p className="text-[11px] text-stone-400">
                      Translation by Abul A'la Maududi
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-stone-50 rounded text-xs text-stone-500">
                    Verse {item.verseKey}
                  </div>
                )}

                {/* Why this verse is relevant */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Why This Verse Connects to the Real World
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    {item.relevanceExplanation}
                  </p>
                </div>

                {/* Supporting Reference */}
                {item.supportingReference && (
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                    <Info className="w-3.5 h-3.5 text-stone-400" />
                    <span>Reference: {item.supportingReference}</span>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  {verse && (
                    <button
                      onClick={() => onExploreVerse(verse)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Explore Context</span>
                    </button>
                  )}
                  <button
                    onClick={() => onNavigateToReader(item.surahNumber, item.ayahNumber)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Full Surah</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
