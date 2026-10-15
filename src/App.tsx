/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { QuranReader } from './components/QuranReader';
import { WorldMap } from './components/WorldMap';
import { TopicExplorer } from './components/TopicExplorer';
import { BookmarksView } from './components/BookmarksView';
import { AdminDashboard } from './components/AdminDashboard';
import { ExploreVerseModal } from './components/ExploreVerseModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { Footer } from './components/Footer';
import { Verse } from './types/quran';
import { getBookmarks, getVerse } from './utils/quranData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quranverse_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [exploreVerseModalVerse, setExploreVerseModalVerse] = useState<Verse | null>(null);

  // Cross-component routing state
  const [readerTarget, setReaderTarget] = useState<{ surah?: number; ayah?: number }>({ surah: 1 });
  const [mapTargetLocationId, setMapTargetLocationId] = useState<string | undefined>(undefined);
  const [topicTargetId, setTopicTargetId] = useState<string | undefined>(undefined);
  const [bookmarksCount, setBookmarksCount] = useState<number>(0);

  // Sync dark mode class with DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('quranverse_dark_mode', String(darkMode));
  }, [darkMode]);

  // Keep bookmarks count synced
  useEffect(() => {
    const updateCount = () => {
      setBookmarksCount(getBookmarks().length);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, [exploreVerseModalVerse, currentTab]);

  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleNavigate = (tab: string, target?: { surah?: number; ayah?: number; topicId?: string; locationId?: string }) => {
    if (target?.surah) {
      setReaderTarget({ surah: target.surah, ayah: target.ayah });
    }
    if (target?.topicId) {
      setTopicTargetId(target.topicId);
    }
    if (target?.locationId) {
      setMapTargetLocationId(target.locationId);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVerseKeyFromMap = (verseKey: string) => {
    const parts = verseKey.split(':');
    if (parts.length === 2) {
      const s = parseInt(parts[0], 10);
      const a = parseInt(parts[1], 10);
      setReaderTarget({ surah: s, ayah: a });
      setCurrentTab('reader');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenExploreVerse = (verse: Verse) => {
    setExploreVerseModalVerse(verse);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 font-sans transition-colors selection:bg-emerald-200 dark:selection:bg-emerald-900">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => handleNavigate(tab)}
        onOpenSearch={() => setSearchModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        bookmarksCount={bookmarksCount}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <LandingPage
            onNavigate={(tab, target) => handleNavigate(tab, target)}
            onOpenSearch={() => setSearchModalOpen(true)}
            onExploreVerse={handleOpenExploreVerse}
          />
        )}

        {currentTab === 'reader' && (
          <QuranReader
            initialSurah={readerTarget.surah || 1}
            initialAyah={readerTarget.ayah}
            onExploreVerse={handleOpenExploreVerse}
            onNavigateToMapLocation={(locId) => handleNavigate('map', { locationId: locId })}
            onNavigateToTopic={(topId) => handleNavigate('topics', { topicId: topId })}
          />
        )}

        {currentTab === 'map' && (
          <WorldMap
            initialLocationId={mapTargetLocationId}
            onSelectVerseKey={handleSelectVerseKeyFromMap}
          />
        )}

        {currentTab === 'topics' && (
          <TopicExplorer
            initialTopicId={topicTargetId}
            onExploreVerse={handleOpenExploreVerse}
            onNavigateToReader={(s, a) => handleNavigate('reader', { surah: s, ayah: a })}
          />
        )}

        {currentTab === 'bookmarks' && (
          <BookmarksView
            onExploreVerse={handleOpenExploreVerse}
            onNavigateToReader={(s, a) => handleNavigate('reader', { surah: s, ayah: a })}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Explore Verse Modal / Drawer */}
      <ExploreVerseModal
        verse={exploreVerseModalVerse}
        onClose={() => setExploreVerseModalVerse(null)}
        onSelectVerse={(v) => setExploreVerseModalVerse(v)}
        onNavigateToMapLocation={(locId) => {
          setExploreVerseModalVerse(null);
          handleNavigate('map', { locationId: locId });
        }}
      />

      {/* Global Search Dialog */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectVerse={(v) => {
          setSearchModalOpen(false);
          handleOpenExploreVerse(v);
        }}
      />

      {/* Footer */}
      <Footer onNavigate={(tab) => handleNavigate(tab)} />
    </div>
  );
}
