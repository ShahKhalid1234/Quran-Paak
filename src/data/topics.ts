import { TopicAssociation } from '../types/quran';

export interface TopicCategoryInfo {
  id: string;
  name: string;
  description: string;
  iconName: string; // Lucide icon identifier
  color: string;
}

export const TOPIC_CATEGORIES: TopicCategoryInfo[] = [
  {
    id: 'nature',
    name: 'Nature & the Universe',
    description: 'Celestial bodies, day and night rotations, orbital balance, winds, and cosmological signs.',
    iconName: 'Sun',
    color: 'from-amber-600 to-yellow-500'
  },
  {
    id: 'water_rain',
    name: 'Water, Rain & Clouds',
    description: 'The hydrological cycle, revival of barren soils, cloud stratification, and fresh vs saltwater barriers.',
    iconName: 'CloudRain',
    color: 'from-cyan-600 to-blue-500'
  },
  {
    id: 'animals_plants',
    name: 'Flora & Fauna',
    description: 'Honeybees, ants, spiders, birds in flight, date palms, olives, pomegranates, and biodiversity.',
    iconName: 'Leaf',
    color: 'from-emerald-600 to-green-500'
  },
  {
    id: 'mountains',
    name: 'Mountains & Landscapes',
    description: 'Geological stability, mountain roots, river valleys, diverse soil strata, and earth topography.',
    iconName: 'Mountain',
    color: 'from-stone-600 to-neutral-500'
  },
  {
    id: 'ethics',
    name: 'Ethics, Justice & Character',
    description: 'Truthfulness, upholding fairness even against oneself, fulfilling covenants, overcoming arrogance, and humility.',
    iconName: 'Scale',
    color: 'from-indigo-600 to-purple-500'
  },
  {
    id: 'patience_gratitude',
    name: 'Patience & Gratitude',
    description: 'Steadfast perseverance (Sabr) through adversity, mindfulness of blessings, and contentment (Shukr).',
    iconName: 'HeartHandshake',
    color: 'from-rose-600 to-pink-500'
  },
  {
    id: 'family',
    name: 'Family & Relationships',
    description: 'Devotion to parents, marital mutual affection, child nurturing, kinship ties, and resolving conflicts.',
    iconName: 'Users',
    color: 'from-teal-600 to-emerald-500'
  },
  {
    id: 'society_trade',
    name: 'Work, Trade & Finance',
    description: 'Honest weights and measures, prohibition of usury/exploitation, mutual consent contracts, and charity.',
    iconName: 'Coins',
    color: 'from-amber-700 to-amber-500'
  },
  {
    id: 'history',
    name: 'History & Civilizations',
    description: 'Lessons from past empires, architectural arrogance, archaeological remnants, and prophetic struggles.',
    iconName: 'Landmark',
    color: 'from-yellow-700 to-stone-600'
  },
  {
    id: 'science_reflection',
    name: 'Contemplation & Creation',
    description: 'Human developmental stages (embryology reflection), sensory faculties, hearing, sight, and mental inquiry.',
    iconName: 'Sparkles',
    color: 'from-violet-600 to-indigo-500'
  }
];

export const CURATED_TOPIC_ASSOCIATIONS: TopicAssociation[] = [
  // Nature & Universe
  {
    id: 'top-1',
    topicId: 'nature',
    category: 'nature',
    topicName: 'Celestial Motion & Orbital Harmony',
    verseKey: '36:40',
    surahNumber: 36,
    ayahNumber: 40,
    connectionType: 'direct',
    relevanceExplanation: 'Describes celestial bodies navigating precise celestial pathways (falak), emphasizing cosmic order and the balance of nocturnal and diurnal cycles.',
    supportingReference: 'Maududi, Tafhim al-Qur\'an, Commentary on Ya-Sin 36:38-40'
  },
  {
    id: 'top-2',
    topicId: 'nature',
    category: 'nature',
    topicName: 'Alternation of Night and Day',
    verseKey: '3:190',
    surahNumber: 3,
    ayahNumber: 190,
    connectionType: 'direct',
    relevanceExplanation: 'Invites people of deep understanding (Ulul-Albab) to reflect on astronomical rhythms and the creation of heavens and earth.',
    supportingReference: 'Tafhim al-Qur\'an, Aal-i-Imran 3:190-191'
  },
  {
    id: 'top-3',
    topicId: 'nature',
    category: 'nature',
    topicName: 'Solar & Lunar Timekeeping',
    verseKey: '10:5',
    surahNumber: 10,
    ayahNumber: 5,
    connectionType: 'direct',
    relevanceExplanation: 'Highlights the sun as a radiant source of illumination and the moon as a measured light for calculating months and calendar years.',
    supportingReference: 'Tafsir Ibn Kathir on Surah Yunus 10:5'
  },

  // Water & Rain
  {
    id: 'top-4',
    topicId: 'water_rain',
    category: 'water_rain',
    topicName: 'The Hydrological Cycle & Cloud Condensation',
    verseKey: '24:43',
    surahNumber: 24,
    ayahNumber: 43,
    connectionType: 'direct',
    relevanceExplanation: 'Examines cloud formation: winds driving separate cloud masses, clustering them together, stacking them vertically (cumulonimbus), and yielding precipitation.',
    supportingReference: 'Maududi, Tafhim al-Qur\'an, An-Nur 24:43'
  },
  {
    id: 'top-5',
    topicId: 'water_rain',
    category: 'water_rain',
    topicName: 'Estuarine Barrier Between Two Seas',
    verseKey: '25:53',
    surahNumber: 25,
    ayahNumber: 53,
    connectionType: 'direct',
    relevanceExplanation: 'References two bodies of water—one sweet and palatable, the other salty and bitter—separated by a natural transition zone (barzakh).',
    supportingReference: 'Tafhim al-Qur\'an, Al-Furqan 25:53; classical oceanography and estuary hydrology observations'
  },
  {
    id: 'top-6',
    topicId: 'water_rain',
    category: 'water_rain',
    topicName: 'Water as the Origin of Living Systems',
    verseKey: '21:30',
    surahNumber: 21,
    ayahNumber: 30,
    connectionType: 'direct',
    relevanceExplanation: 'Declares that every living thing has been made from water, inviting humans to contemplate the universal biological necessity of moisture.',
    supportingReference: 'Maududi, Tafhim al-Qur\'an, Al-Anbiya 21:30'
  },

  // Flora & Fauna
  {
    id: 'top-7',
    topicId: 'animals_plants',
    category: 'animals_plants',
    topicName: 'The Honeybee & Architectural Geometry',
    verseKey: '16:68',
    surahNumber: 16,
    ayahNumber: 68,
    connectionType: 'direct',
    relevanceExplanation: 'Inspires reflection on how honeybees are intuitively guided to build hexagonal dwellings in mountains, trees, and human structures.',
    supportingReference: 'Tafhim al-Qur\'an, An-Nahl 16:68-69'
  },
  {
    id: 'top-8',
    topicId: 'animals_plants',
    category: 'animals_plants',
    topicName: 'Animal Communities as Ecological Nations',
    verseKey: '6:38',
    surahNumber: 6,
    ayahNumber: 38,
    connectionType: 'direct',
    relevanceExplanation: 'Stipulates that every creature walking upon earth or bird flying on two wings forms structured communities (umam) akin to human societies.',
    supportingReference: 'Maududi, Tafhim al-Qur\'an, Al-An\'am 6:38'
  },
  {
    id: 'top-9',
    topicId: 'animals_plants',
    category: 'animals_plants',
    topicName: 'Plant Photosynthesis & Chlorophyll Reflection',
    verseKey: '6:99',
    surahNumber: 6,
    ayahNumber: 99,
    connectionType: 'thematic',
    relevanceExplanation: 'Poetically observes water descending from skies producing green shoots (khadiran) from which close-packed grain, date clusters, and olive orchards emerge.',
    supportingReference: 'Tafhim al-Qur\'an on 6:99'
  },

  // Mountains & Landscapes
  {
    id: 'top-10',
    topicId: 'mountains',
    category: 'mountains',
    topicName: 'Mountains as Stabilizing Pegs',
    verseKey: '78:6',
    surahNumber: 78,
    ayahNumber: 6,
    connectionType: 'direct',
    relevanceExplanation: 'Speaks of the earth as a cradle and the mountains as pegs (awtadan), reflecting on deep crustal roots and topographic stability.',
    supportingReference: 'Maududi, Tafhim al-Qur\'an, An-Naba 78:6-7'
  },
  {
    id: 'top-11',
    topicId: 'mountains',
    category: 'mountains',
    topicName: 'Geological Strata and Mineral Diversity',
    verseKey: '35:27',
    surahNumber: 35,
    ayahNumber: 27,
    connectionType: 'direct',
    relevanceExplanation: 'Draws attention to the varied colored strata running through mountains—white, red with diverse shades, and deep raven-black.',
    supportingReference: 'Tafhim al-Qur\'an, Fatir 35:27-28'
  },

  // Ethics, Justice & Character
  {
    id: 'top-12',
    topicId: 'ethics',
    category: 'ethics',
    topicName: 'Upholding Absolute Justice Without Bias',
    verseKey: '4:135',
    surahNumber: 4,
    ayahNumber: 135,
    connectionType: 'direct',
    relevanceExplanation: 'Commands steadfast standing for justice as witnesses for Allah, even if it be against oneself, parents, or close relatives, regardless of wealth or poverty.',
    supportingReference: 'Maududi, Tafhim al-Qur\'an, An-Nisa 4:135'
  },
  {
    id: 'top-13',
    topicId: 'ethics',
    category: 'ethics',
    topicName: 'Emotional Restraint & Repelling Evil with Good',
    verseKey: '41:34',
    surahNumber: 41,
    ayahNumber: 34,
    connectionType: 'direct',
    relevanceExplanation: 'States that good and evil are never equal, urging believers to repel animosity with grace so that former adversaries become close companions.',
    supportingReference: 'Tafhim al-Qur\'an, Fussilat 41:34-35'
  },
  {
    id: 'top-14',
    topicId: 'ethics',
    category: 'ethics',
    topicName: 'Humility and Walking Softly on Earth',
    verseKey: '25:63',
    surahNumber: 25,
    ayahNumber: 63,
    connectionType: 'direct',
    relevanceExplanation: 'Describes the true servants of the Most Compassionate as those who walk upon the earth with humility and respond to hostility with words of peace.',
    supportingReference: 'Maududi, Tafhim al-Qur\'an, Al-Furqan 25:63'
  },

  // Patience & Gratitude
  {
    id: 'top-15',
    topicId: 'patience_gratitude',
    category: 'patience_gratitude',
    topicName: 'Perseverance Through Inevitable Life Trials',
    verseKey: '2:155',
    surahNumber: 2,
    ayahNumber: 155,
    connectionType: 'direct',
    relevanceExplanation: 'Highlights universal human tribulations—fear, hunger, loss of property, health, and loved ones—while offering glad tidings to those who embody patience (Sabirun).',
    supportingReference: 'Tafhim al-Qur\'an, Al-Baqarah 2:155-157'
  },
  {
    id: 'top-16',
    topicId: 'patience_gratitude',
    category: 'patience_gratitude',
    topicName: 'Multiplying Blessings Through Gratitude',
    verseKey: '14:7',
    surahNumber: 14,
    ayahNumber: 7,
    connectionType: 'direct',
    relevanceExplanation: 'The profound psychological and spiritual principle: "If you give thanks, I will surely increase your favor."',
    supportingReference: 'Tafsir Ibn Kathir and Tafhim al-Qur\'an on Ibrahim 14:7'
  },

  // Family & Relationships
  {
    id: 'top-17',
    topicId: 'family',
    category: 'family',
    topicName: 'Reverence and Care for Aging Parents',
    verseKey: '17:23',
    surahNumber: 17,
    ayahNumber: 23,
    connectionType: 'direct',
    relevanceExplanation: 'Commands kindness to mother and father, forbidding even a sigh of irritation ("uff") when they attain advanced old age, enjoining gentle speech.',
    supportingReference: 'Maududi, Tafhim al-Qur\'an, Al-Isra 17:23-24'
  },
  {
    id: 'top-18',
    topicId: 'family',
    category: 'family',
    topicName: 'Spousal Tranquility, Affection & Mercy',
    verseKey: '30:21',
    surahNumber: 30,
    ayahNumber: 21,
    connectionType: 'direct',
    relevanceExplanation: 'Affirms marital companionship as a foundational divine sign characterized by mutual peace (sukūn), love (mawaddah), and compassion (rahmah).',
    supportingReference: 'Tafhim al-Qur\'an, Ar-Rum 30:21'
  },

  // Work, Trade & Finance
  {
    id: 'top-19',
    topicId: 'society_trade',
    category: 'society_trade',
    topicName: 'Scrupulous Fairness in Weights and Scales',
    verseKey: '83:1',
    surahNumber: 83,
    ayahNumber: 1,
    connectionType: 'direct',
    relevanceExplanation: 'A strong condemnation of fraud in commerce (Al-Mutaffifin)—those who demand full measure when taking from others but reduce measure when selling.',
    supportingReference: 'Tafhim al-Qur\'an, Al-Mutaffifin 83:1-3'
  },
  {
    id: 'top-20',
    topicId: 'society_trade',
    category: 'society_trade',
    topicName: 'Mutual Consent in Economic Transactions',
    verseKey: '4:29',
    surahNumber: 4,
    ayahNumber: 29,
    connectionType: 'direct',
    relevanceExplanation: 'Establishes fundamental ethical commercial laws: prohibition of illicit misappropriation and the requirement of voluntary mutual trade.',
    supportingReference: 'Maududi, Tafhim al-Qur\'an, An-Nisa 4:29'
  },

  // Contemplation & Creation
  {
    id: 'top-21',
    topicId: 'science_reflection',
    category: 'science_reflection',
    topicName: 'Developmental Stages of Human Embryogenesis',
    verseKey: '23:14',
    surahNumber: 23,
    ayahNumber: 14,
    connectionType: 'thematic',
    relevanceExplanation: 'Outlines developmental phases using classical descriptive Arabic (nutfah, \'alaqah, mudghah). Treated educationally as textual contemplation on the marvel of human origin, not as a replacement for clinical embryology.',
    supportingReference: 'Maududi, Tafhim al-Qur\'an, Al-Mu\'minun 23:12-14'
  },
  {
    id: 'top-22',
    topicId: 'science_reflection',
    category: 'science_reflection',
    topicName: 'Sensory Organs & Faculty of Cognition',
    verseKey: '16:78',
    surahNumber: 16,
    ayahNumber: 78,
    connectionType: 'direct',
    relevanceExplanation: 'Reminds that humans emerge without knowledge, and are endowed with hearing, vision, and inner perception (af\'idah) to learn and give thanks.',
    supportingReference: 'Tafhim al-Qur\'an, An-Nahl 16:78'
  }
];
