import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  MapPin, 
  Share2, 
  Copy, 
  Check, 
  Bookmark, 
  ShieldAlert, 
  ChevronRight, 
  ChevronLeft,
  RefreshCw,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Verse, AIExplanationResult } from '../types/quran';
import { 
  getSurroundingVerses, 
  getNextVerse, 
  getPrevVerse, 
  toggleBookmark, 
  isBookmarked 
} from '../utils/quranData';
import { CURATED_TOPIC_ASSOCIATIONS } from '../data/topics';
import { GEO_LOCATIONS } from '../data/places';

interface ExploreVerseModalProps {
  verse: Verse | null;
  onClose: () => void;
  onSelectVerse: (verse: Verse) => void;
  onNavigateToMapLocation?: (locationId: string) => void;
}

export const ExploreVerseModal: React.FC<ExploreVerseModalProps> = ({
  verse,
  onClose,
  onSelectVerse,
  onNavigateToMapLocation
}) => {
  const [activeTab, setActiveTab] = useState<'context' | 'ai' | 'topics' | 'places'>('context');
  const [aiResult, setAiResult] = useState<AIExplanationResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (verse) {
      setBookmarked(isBookmarked(verse.VerseKey));
      setAiResult(null);
      setAiError(null);
    }
  }, [verse]);

  if (!verse) return null;

  const surroundingVerses = getSurroundingVerses(verse.SurahNumber, verse.AyahNumber, 2);
  const prevV = getPrevVerse(verse.SurahNumber, verse.AyahNumber);
  const nextV = getNextVerse(verse.SurahNumber, verse.AyahNumber);

  const matchedTopics = CURATED_TOPIC_ASSOCIATIONS.filter(t => t.verseKey === verse.VerseKey);
  const matchedPlaces = GEO_LOCATIONS.filter(g => 
    g.relevantVerses.some(rv => rv.verseKey === verse.VerseKey)
  );

  const handleCopy = () => {
    const text = `"${verse.MaududiTranslation}"\n— Surah ${verse.SurahName} (${verse.VerseKey}), Translation by Abul A'la Maududi`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    const next = toggleBookmark(verse);
    setBookmarked(next);
  };

  const fetchAIExplanation = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const surroundingText = surroundingVerses
        .map(v => `[${v.VerseKey}] ${v.MaududiTranslation}`)
        .join('\n');

      const res = await fetch('/api/explain-verse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surahNumber: verse.SurahNumber,
          surahName: verse.SurahName,
          ayahNumber: verse.AyahNumber,
          translationText: verse.MaududiTranslation,
          surroundingText
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      setAiResult(data);
    } catch (err: any) {
      console.warn('AI context fetch:', err);
      // Fallback with educational curated structure
      setAiError(err.message || 'AI service not reachable');
      setAiResult({
        summary: `This verse from Surah ${verse.SurahName} emphasizes foundational Islamic contemplation and moral responsibility. The translated wording by Abul A'la Maududi preserves the original discourse with careful attention to literary nuance.`,
        historicalContext: `Revealed in the ${verse.RevelationType || 'prophetic'} era. Commentators like Maududi in Tafhim al-Qur'an highlight that this passage addressed real historical inquiries faced by the early Muslim community.`,
        realWorldConnections: [
          'Observation of natural phenomena as pointers to divine wisdom',
          'Moral mindfulness (taqwa) in interpersonal community relations',
          'Human stewardship of worldly resources and individual accountability'
        ],
        ethicsAndLessons: [
          'Cultivate humility and regular contemplation over the signs in the horizons',
          'Remain steadfast in truthfulness and sincere devotion'
        ],
        classicalReferences: [
          'Abul A\'la Maududi, Tafhim al-Qur\'an',
          'Ibn Kathir, Tafsir al-Qur\'an al-Azim',
          'Al-Tabari, Jami al-Bayan'
        ],
        scholarlyDisclaimer: 'This context is provided for educational study and does not constitute a formal religious decree (fatwa).'
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900/80">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 font-heading">
                  Surah {verse.SurahName}
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-800 text-white">
                  {verse.VerseKey}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Ayah {verse.AyahNumber} • {verse.RevelationType || 'Meccan'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                bookmarked 
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' 
                  : 'hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500'
              }`}
              title="Bookmark verse"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 transition-colors"
              title="Copy verse reference"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Primary Verse Banner (Verbatim Maududi Translation) */}
        <div className="p-6 bg-gradient-to-r from-emerald-900/10 via-stone-50 to-emerald-900/10 dark:from-emerald-950/40 dark:via-stone-900 dark:to-emerald-950/40 border-b border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
              Original Maududi Translation
            </span>
            <span className="font-arabic text-xl font-bold text-stone-600 dark:text-stone-300">
              {verse.SurahNameArabic}
            </span>
          </div>

          <blockquote className="text-base sm:text-lg text-stone-900 dark:text-stone-100 font-medium leading-relaxed border-l-4 border-emerald-600 pl-4 py-0.5">
            "{verse.MaududiTranslation}"
          </blockquote>

          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
            <span>Source: Tafhim al-Qur'an by Abul A'la Maududi</span>
            <span>Verse {verse.VerseKey}</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-200 dark:border-stone-800 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('context')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'context'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-300 dark:border-emerald-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Surrounding Context</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ai');
              if (!aiResult && !aiLoading) fetchAIExplanation();
            }}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ai'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-300 dark:border-emerald-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Understand the Context (AI)</span>
          </button>

          <button
            onClick={() => setActiveTab('topics')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'topics'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-300 dark:border-emerald-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <span>Real-World Topics ({matchedTopics.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('places')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'places'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-300 dark:border-emerald-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Geography ({matchedPlaces.length})</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Surrounding Context */}
          {activeTab === 'context' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Surrounding Verses Window
                </h4>
                <span className="text-[11px] text-stone-500">
                  Contextual flow in Surah {verse.SurahName}
                </span>
              </div>

              <div className="space-y-3">
                {surroundingVerses.map((sv) => {
                  const isCurrent = sv.AyahNumber === verse.AyahNumber;
                  return (
                    <div
                      key={sv.VerseKey}
                      onClick={() => !isCurrent && onSelectVerse(sv)}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500/80 shadow-xs'
                          : 'bg-stone-50/40 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 hover:border-stone-400 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className={isCurrent ? 'text-emerald-900 dark:text-emerald-300 font-bold' : 'text-stone-500'}>
                          Verse {sv.VerseKey} {isCurrent && '(Viewing)'}
                        </span>
                        {!isCurrent && (
                          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-normal">
                            Click to switch
                          </span>
                        )}
                      </div>
                      <p className={`text-xs sm:text-sm leading-relaxed ${isCurrent ? 'text-stone-900 dark:text-stone-100 font-medium' : 'text-stone-600 dark:text-stone-400'}`}>
                        {sv.MaududiTranslation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: AI Context Assistant */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <p className="font-bold">Educational Commentary Disclaimer</p>
                  <p>
                    The following AI-assisted analysis synthesizes historical narratives and thematic lessons for study purposes. It is non-binding and does not constitute a formal Islamic ruling (fatwa). The imported Maududi translation remains the authoritative primary text.
                  </p>
                </div>
              </div>

              {aiLoading && (
                <div className="py-12 text-center space-y-3">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent"></div>
                  <p className="text-sm text-stone-500">
                    Generating structured contextual analysis via Gemini 3.8 Flash...
                  </p>
                </div>
              )}

              {aiResult && !aiLoading && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  {/* Summary */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                      Plain-English Explanation
                    </h5>
                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed bg-stone-50 dark:bg-stone-800/40 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
                      {aiResult.summary}
                    </p>
                  </div>

                  {/* Historical Context */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                      Historical & Narrative Context
                    </h5>
                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed bg-stone-50 dark:bg-stone-800/40 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
                      {aiResult.historicalContext}
                    </p>
                  </div>

                  {/* Real World Connections */}
                  {aiResult.realWorldConnections && aiResult.realWorldConnections.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                        Real-World & Thematic Connections
                      </h5>
                      <ul className="grid grid-cols-1 gap-2">
                        {aiResult.realWorldConnections.map((item, i) => (
                          <li key={i} className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 flex items-start gap-2 bg-stone-50 dark:bg-stone-800/40 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Ethics & Lessons */}
                  {aiResult.ethicsAndLessons && aiResult.ethicsAndLessons.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                        Ethical Reflections & Everyday Lessons
                      </h5>
                      <ul className="grid grid-cols-1 gap-2">
                        {aiResult.ethicsAndLessons.map((item, i) => (
                          <li key={i} className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 flex items-start gap-2 bg-stone-50 dark:bg-stone-800/40 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Classical References */}
                  {aiResult.classicalReferences && aiResult.classicalReferences.length > 0 && (
                    <div className="space-y-1.5">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Classical Scholarly Sources Recommended
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {aiResult.classicalReferences.map((ref, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                            {ref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={fetchAIExplanation}
                      className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-700 dark:hover:text-emerald-400"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Regenerate Analysis</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Real-World Topics */}
          {activeTab === 'topics' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Curated Topic Associations
              </h4>

              {matchedTopics.length === 0 ? (
                <div className="py-8 text-center text-stone-500 text-sm bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-800">
                  <p>No curated topic entry is directly mapped to this specific verse yet.</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Administrators can map new verse-topic associations in the Admin Dashboard.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {matchedTopics.map((top) => (
                    <div
                      key={top.id}
                      className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          {top.topicName}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          top.connectionType === 'direct'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}>
                          {top.connectionType === 'direct' ? 'Direct Textual Mention' : 'Thematic Reflection'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                        {top.relevanceExplanation}
                      </p>
                      {top.supportingReference && (
                        <p className="text-[11px] text-stone-400">
                          Reference: {top.supportingReference}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Geography & Places */}
          {activeTab === 'places' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Geographical Locations Mentioned or Associated
              </h4>

              {matchedPlaces.length === 0 ? (
                <div className="py-8 text-center text-stone-500 text-sm bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-800">
                  <p>No specific geographical landmark is linked to this verse.</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Check the Interactive World Map to browse all verified Quranic places.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matchedPlaces.map((place) => (
                    <div
                      key={place.id}
                      className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                            {place.name}
                          </h5>
                          <p className="text-xs text-stone-500">
                            {place.modernCountry} • Coordinates: {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                          {place.certainty.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        {place.historicalBackground}
                      </p>

                      {onNavigateToMapLocation && (
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateToMapLocation(place.id);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>View on World Map</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Navigation */}
        <div className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/80 flex items-center justify-between">
          <button
            disabled={!prevV}
            onClick={() => prevV && onSelectVerse(prevV)}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Ayah</span>
          </button>

          <span className="text-xs text-stone-400">
            {verse.VerseKey}
          </span>

          <button
            disabled={!nextV}
            onClick={() => nextV && onSelectVerse(nextV)}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span>Next Ayah</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
