import React from 'react';
import { BookOpen, MapPin, Sparkles, Bookmark, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-950/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Attribution */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-arabic text-lg font-bold">
                قرآن
              </div>
              <span className="font-bold text-lg text-stone-900 dark:text-stone-100 font-heading">
                QuranVerse Explorer
              </span>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed max-w-md">
              An interactive educational exploration platform bridging the sacred text of the Holy Quran with real-world geography, natural science reflection, and foundational ethics.
            </p>

            <div className="pt-2 text-xs text-stone-500 space-y-1">
              <p>
                <strong className="text-stone-700 dark:text-stone-300">English Translation Attribution:</strong> Translated by Sayyid Abul A'la Maududi (from <em>Tafhim al-Qur'an: The Meaning of the Quran</em>).
              </p>
              <p>
                Original dataset imported verbatim from <code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded text-[11px]">english-translation-moududi.xlsx</code>.
              </p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 font-heading">
              Exploration Portals
            </h4>
            <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reader')} className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Quran Reader (114 Surahs)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Interactive World Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('topics')} className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Real-World Topics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('bookmarks')} className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Saved Verses & Notes
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 font-heading">
              Platform & Integrity
            </h4>
            <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-2">
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin & Excel Importer</span>
                </button>
              </li>
              <li className="text-[11px] text-stone-400">
                AI Service: Gemini 3.8 Flash (Server-side)
              </li>
              <li className="text-[11px] text-stone-400">
                Maps: Leaflet & OpenStreetMap
              </li>
              <li className="text-[11px] text-stone-400">
                Deployment: Vercel & Node compatible
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Educational and research resource. Real-world connections represent thematic educational reflections (tadabbur) and do not substitute for formal scholarly fatwas.
          </p>
          <p className="shrink-0">
            © {new Date().getFullYear()} QuranVerse Explorer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
