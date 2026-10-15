import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Search, 
  Filter, 
  ExternalLink, 
  BookOpen, 
  Info, 
  Layers, 
  List, 
  Map as MapIcon, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Compass
} from 'lucide-react';
import { GEO_LOCATIONS } from '../data/places';
import { GeoLocation, CertaintyLevel } from '../types/quran';

interface WorldMapProps {
  initialLocationId?: string;
  onSelectVerseKey?: (verseKey: string) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  initialLocationId,
  onSelectVerseKey
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCertainty, setSelectedCertainty] = useState<string>('all');
  const [activeLocation, setActiveLocation] = useState<GeoLocation | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  // Filtered locations
  const filteredLocations = useMemo(() => {
    return GEO_LOCATIONS.filter(loc => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = loc.name.toLowerCase().includes(q) ||
          loc.modernCountry.toLowerCase().includes(q) ||
          (loc.modernName && loc.modernName.toLowerCase().includes(q)) ||
          loc.historicalBackground.toLowerCase().includes(q);
        if (!matchesName) return false;
      }

      if (selectedCategory !== 'all' && loc.category !== selectedCategory) {
        return false;
      }

      if (selectedCertainty !== 'all' && loc.certainty !== selectedCertainty) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedCertainty]);

  // Initial location selection if passed
  useEffect(() => {
    if (initialLocationId) {
      const loc = GEO_LOCATIONS.find(l => l.id === initialLocationId);
      if (loc) {
        setActiveLocation(loc);
        if (leafletMapRef.current) {
          leafletMapRef.current.flyTo([loc.lat, loc.lng], 7, { duration: 1.2 });
        }
      }
    }
  }, [initialLocationId]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      // Middle East / Mediterranean initial viewport
      const map = L.map(mapContainerRef.current, {
        center: [26.0, 40.0],
        zoom: 5,
        minZoom: 3,
        maxZoom: 18,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    // Custom Icon generator based on category & certainty
    const createCustomIcon = (loc: GeoLocation, isSelected: boolean) => {
      let bgColor = '#059669'; // emerald
      if (loc.category === 'civilization') bgColor = '#d97706'; // amber
      else if (loc.category === 'nature') bgColor = '#0284c7'; // cyan/blue
      else if (loc.category === 'sanctuary') bgColor = '#047857'; // deep emerald

      const isDisputed = loc.certainty === 'disputed';
      const size = isSelected ? 38 : 30;

      const html = `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${bgColor};
          border: ${isSelected ? '3px solid #fef08a' : '2px solid #ffffff'};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          <div style="
            transform: rotate(45deg);
            color: #ffffff;
            font-size: ${isSelected ? '14px' : '11px'};
            font-weight: bold;
          ">
            ${isDisputed ? '?' : '★'}
          </div>
        </div>
      `;

      return L.divIcon({
        className: 'custom-geo-marker',
        html,
        iconSize: [size, size],
        iconAnchor: [size / 2, size]
      });
    };

    // Add markers
    filteredLocations.forEach(loc => {
      const isSelected = activeLocation?.id === loc.id;
      const marker = L.marker([loc.lat, loc.lng], {
        icon: createCustomIcon(loc, isSelected),
        title: loc.name
      }).addTo(map);

      marker.on('click', () => {
        setActiveLocation(loc);
        map.flyTo([loc.lat, loc.lng], Math.max(map.getZoom(), 7), { duration: 0.8 });
      });

      markersRef.current[loc.id] = marker;
    });

    return () => {
      // Don't destroy map on every filter change, only markers are redrawn
    };
  }, [viewMode, filteredLocations, activeLocation]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const getCertaintyBadge = (c: CertaintyLevel) => {
    switch (c) {
      case 'explicit':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Explicit Quranic Mention
          </span>
        );
      case 'historical_consensus':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <CheckCircle className="w-3 h-3 text-blue-600" />
            Historical / Geographic Consensus
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Identification Disputed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600">
            Unverified
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 dark:text-stone-100">
                Interactive Quranic World Map
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Verified geographical sanctuaries, ancient dwellings, and historical locations in the Quran.
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places or countries..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-medium focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="sanctuary">Holy Sanctuaries</option>
            <option value="prophet">Prophets & Communities</option>
            <option value="civilization">Ancient Civilizations</option>
            <option value="nature">Landforms & Mountains</option>
          </select>

          {/* Certainty Filter */}
          <select
            value={selectedCertainty}
            onChange={(e) => setSelectedCertainty(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-medium focus:outline-none"
          >
            <option value="all">All Identification Statuses</option>
            <option value="explicit">Explicitly Mentioned Only</option>
            <option value="historical_consensus">Historical Consensus</option>
            <option value="disputed">Disputed / Multiple Traditions</option>
          </select>

          {/* Map vs List View Toggle */}
          <div className="flex items-center rounded-xl bg-stone-100 dark:bg-stone-800 p-1 border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'map'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'list'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View ({filteredLocations.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map View Container */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-md h-[550px] relative bg-stone-100 dark:bg-stone-950">
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Quick Legend Overlay */}
            <div className="absolute top-3 left-3 z-20 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 shadow-md text-[11px] space-y-1">
              <span className="font-bold text-stone-700 dark:text-stone-300 block">Map Key</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>Explicit Sanctuary / Prophet</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <span>Ancient Ruins & Civilizations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                <span>Mountains & Rivers</span>
              </div>
            </div>
          </div>

          {/* Location Detail Card Sidebar */}
          <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md p-5 space-y-4 max-h-[550px] overflow-y-auto">
            {activeLocation ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-heading">
                      {activeLocation.name}
                    </h3>
                    {activeLocation.arabicName && (
                      <p className="font-arabic text-lg text-emerald-800 dark:text-emerald-300">
                        {activeLocation.arabicName}
                      </p>
                    )}
                    <p className="text-xs text-stone-500">
                      {activeLocation.modernCountry} {activeLocation.modernName ? `(${activeLocation.modernName})` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveLocation(null)}
                    className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-1">
                  {getCertaintyBadge(activeLocation.certainty)}
                  {activeLocation.certaintyNote && (
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 italic">
                      {activeLocation.certaintyNote}
                    </p>
                  )}
                </div>

                {/* Coordinates */}
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 text-xs text-stone-600 dark:text-stone-300 flex items-center justify-between">
                  <span className="font-medium">Coordinates:</span>
                  <span className="font-mono text-emerald-800 dark:text-emerald-400">
                    {activeLocation.lat.toFixed(4)}° N, {activeLocation.lng.toFixed(4)}° E
                  </span>
                </div>

                {/* Historical Narrative */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Historical Background
                  </h4>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    {activeLocation.historicalBackground}
                  </p>
                </div>

                {/* Archaeological Notes */}
                {activeLocation.archaeologicalNotes && (
                  <div className="space-y-1 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800">
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Archaeology & Epigraphy
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {activeLocation.archaeologicalNotes}
                    </p>
                  </div>
                )}

                {/* Relevant Verses (Clickable to read) */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                    Relevant Quranic Verses ({activeLocation.relevantVerses.length})
                  </h4>
                  <div className="space-y-2">
                    {activeLocation.relevantVerses.map((rv) => (
                      <div
                        key={rv.verseKey}
                        className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-emerald-800 dark:text-emerald-300">
                            Surah {rv.surahName} ({rv.verseKey})
                          </span>
                          {onSelectVerseKey && (
                            <button
                              onClick={() => onSelectVerseKey(rv.verseKey)}
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>Read in Quran</span>
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-300 italic">
                          "{rv.contextDescription}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic & Tafsir Citations */}
                {activeLocation.sources && activeLocation.sources.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-stone-200 dark:border-stone-800">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Sources & Scholarly Citations
                    </h4>
                    <ul className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1 list-disc list-inside">
                      {activeLocation.sources.map((src, i) => (
                        <li key={i}>{src.title}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center text-stone-400 space-y-3">
                <MapPin className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-700 animate-bounce" />
                <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Select a Location on the Map
                </p>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Click any marker or search for a place above to view its Quranic verses, coordinates, and historical context.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* List View Alternative */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 font-heading text-base">
                    {loc.name}
                  </h3>
                  <span className="text-xs font-mono text-stone-400 shrink-0">
                    {loc.modernCountry}
                  </span>
                </div>

                <div>
                  {getCertaintyBadge(loc.certainty)}
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3">
                  {loc.historicalBackground}
                </p>

                <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-800/60 text-[11px] text-stone-500">
                  Coordinates: {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Quran References ({loc.relevantVerses.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {loc.relevantVerses.map((rv) => (
                    <button
                      key={rv.verseKey}
                      onClick={() => onSelectVerseKey && onSelectVerseKey(rv.verseKey)}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    >
                      Surah {rv.surahName} {rv.verseKey}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
