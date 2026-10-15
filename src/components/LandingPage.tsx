import React, { useState } from 'react';
import { 
  BookOpen, 
  MapPin, 
  Compass, 
  Sparkles, 
  Search, 
  ArrowRight, 
  Leaf, 
  Scale, 
  Landmark, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  Share2,
  Bookmark
} from 'lucide-react';
import { Verse, SurahMeta } from '../types/quran';
import { getFeaturedVerse, getRecentVerses, toggleBookmark, isBookmarked } from '../utils/quranData';

interface LandingPageProps {
  onNavigate: (tab: string, target?: { surah?: number; ayah?: number; topicId?: string }) => void;
  onOpenSearch: () => void;
  onExploreVerse: (verse: Verse) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenSearch,
  onExploreVerse
}) => {
  const [searchInput, setSearchInput] = useState('');
  const featured = getFeaturedVerse();
  const recentVerses = getRecentVerses();
  const [bookmarked, setBookmarked] = useState(isBookmarked(featured.verse.VerseKey));

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onOpenSearch();
    }
  };

  const handleBookmarkToggle = () => {
    const state = toggleBookmark(featured.verse);
    setBookmarked(state);
  };

  const quickAccessCards = [
    {
      id: 'reader',
      title: 'Quran Explorer',
      description: 'Read the complete text of all 114 Surahs with Abul A\'la Maududi\'s esteemed English translation.',
      icon: BookOpen,
      badge: '114 Surahs / 6,236 Ayahs',
      color: 'bg-emerald-900/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20'
    },
    {
      id: 'map',
      title: 'Interactive World Map',
      description: 'Explore verified geographical sanctuaries, ancient dwellings, mountain landmarks, and historical routes.',
      icon: MapPin,
      badge: 'Geographical Coordinates',
      color: 'bg-blue-900/10 text-blue-800 dark:text-blue-300 border-blue-500/20'
    },
    {
      id: 'topics',
      target: { topicId: 'water_rain' },
      title: 'Nature & Hydrology',
      description: 'Discover Quranic reflections on cloud formation, rainfall, plant life, and planetary harmony.',
      icon: Leaf,
      badge: 'Ecological Contemplation',
      color: 'bg-teal-900/10 text-teal-800 dark:text-teal-300 border-teal-500/20'
    },
    {
      id: 'topics',
      target: { topicId: 'history' },
      title: 'History & Civilizations',
      description: 'Reflect upon ancient peoples: Saba, Thamud at Al-Hijr, Babylon, and archaeological lessons.',
      icon: Landmark,
      badge: 'Historical Narratives',
      color: 'bg-amber-900/10 text-amber-800 dark:text-amber-300 border-amber-500/20'
    },
    {
      id: 'topics',
      target: { topicId: 'ethics' },
      title: 'Ethics & Everyday Life',
      description: 'Foundational guidance for justice, kindness to parents, marital peace, patience, and trade integrity.',
      icon: Scale,
      badge: 'Moral Foundations',
      color: 'bg-indigo-900/10 text-indigo-800 dark:text-indigo-300 border-indigo-500/20'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-stone-200 dark:border-stone-800/80 bg-gradient-to-b from-emerald-50/50 via-stone-50 to-stone-50 dark:from-emerald-950/30 dark:via-stone-950 dark:to-stone-950 islamic-pattern">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800 text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Dataset: Abul A'la Maududi's Authentic English Translation
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight font-heading leading-[1.15]">
            Explore the Quran. <br className="hidden sm:inline" />
            <span className="text-emerald-800 dark:text-emerald-400">Discover Its Connection to the World.</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            An interactive educational platform bridging timeless Quranic verses with real-world geography, natural phenomena, historical narratives, and everyday ethics.
          </p>

          {/* Prominent Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div 
              onClick={onOpenSearch}
              className="flex items-center gap-3 p-2.5 sm:p-3 bg-white dark:bg-stone-900 rounded-2xl shadow-xl shadow-stone-300/30 dark:shadow-stone-950/50 border border-stone-200 dark:border-stone-800 cursor-pointer hover:border-emerald-500 transition-all group"
            >
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                <Search className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-200">
                  Search across 6,236 verses, places, or subjects...
                </p>
                <p className="text-[11px] text-stone-400">
                  Keywords, Surah numbers, or references like "2:255"
                </p>
              </div>
              <span className="hidden sm:inline text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-800 text-white group-hover:bg-emerald-700 transition-colors">
                Search
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verse Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-950 text-white p-6 sm:p-10 shadow-2xl border border-emerald-800/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-400 text-emerald-950 font-semibold">
                  Featured Verse
                </span>
                <span className="text-sm font-medium text-emerald-200">
                  Surah {featured.surah.name_english} ({featured.verse.SurahNumber}:{featured.verse.AyahNumber})
                </span>
                <span className="text-xs text-emerald-300/70">
                  Theme: {featured.theme}
                </span>
              </div>

              {/* Arabic Name & Verse */}
              <div className="flex items-center justify-between">
                <h3 className="font-arabic text-2xl sm:text-3xl text-amber-200 font-bold">
                  {featured.surah.name_arabic}
                </h3>
              </div>

              {/* Translation Text verbatim */}
              <blockquote className="text-lg sm:text-xl font-medium leading-relaxed text-stone-100 italic border-l-4 border-amber-400 pl-4 py-1">
                "{featured.verse.MaududiTranslation}"
              </blockquote>

              <p className="text-xs text-emerald-300/80">
                Translation: Abul A'la Maududi (Tafhim al-Qur'an)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
              <button
                onClick={() => onExploreVerse(featured.verse)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 text-emerald-950 font-semibold hover:bg-amber-300 transition-colors shadow-lg shadow-amber-950/20 text-sm"
              >
                <Sparkles className="w-4 h-4 text-emerald-950" />
                <span>Explore This Verse</span>
              </button>
              <button
                onClick={() => onNavigate('reader', { surah: featured.verse.SurahNumber, ayah: featured.verse.AyahNumber })}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-medium transition-colors text-sm border border-emerald-700"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Full Surah</span>
              </button>
              <button
                onClick={handleBookmarkToggle}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-200 text-xs border border-emerald-800/50 transition-colors"
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{bookmarked ? 'Saved to Bookmarks' : 'Save Bookmark'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Portals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-heading">
              Explore By Domain
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Choose how you wish to engage with the Quranic text
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickAccessCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigate(card.id, card.target)}
                className="group relative p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {card.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Enter Explorer</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recently Explored Verses (if available) */}
      {recentVerses.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-heading">
              Recently Explored Verses
            </h3>
            <span className="text-xs text-stone-400">Stored locally in your session</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentVerses.slice(0, 4).map((verse) => (
              <div
                key={verse.VerseKey}
                onClick={() => onExploreVerse(verse)}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-2">
                  <span>Surah {verse.SurahName}</span>
                  <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {verse.VerseKey}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                  "{verse.MaududiTranslation}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Educational Standards & Academic Rigor */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-6 sm:p-8 bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <h3 className="font-bold text-base tracking-wide uppercase text-xs">
              Educational Charter & Scholarly Integrity
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            <div className="space-y-1.5">
              <h4 className="font-semibold text-stone-900 dark:text-stone-100">
                1. Verbatim Translation
              </h4>
              <p>
                The English translation rendered here is Abul A'la Maududi's authoritative English translation (Tafhim al-Qur'an), imported directly without algorithmic alteration or text generation.
              </p>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-semibold text-stone-900 dark:text-stone-100">
                2. Rigorous Historical & Geo Grounding
              </h4>
              <p>
                Geographical markers clearly distinguish explicit Quranic mentions from academic commentary hypotheses. Locations with uncertain archaeological consensus are transparently labeled as disputed.
              </p>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-semibold text-stone-900 dark:text-stone-100">
                3. Non-Fatwa Educational Context
              </h4>
              <p>
                Real-world and AI-assisted context cards are strictly for educational inquiry and contemplation (Tadabbur). They do not constitute formal religious rulings (fatwas).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
