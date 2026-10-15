import { GeoLocation } from '../types/quran';

export const GEO_LOCATIONS: GeoLocation[] = [
  {
    id: 'makkah-bakkah',
    name: 'Bakkah & Makkah (The Sacred Sanctuary)',
    arabicName: 'بَكَّة / مَكَّة المُكَرَّمَة',
    category: 'sanctuary',
    lat: 21.4225,
    lng: 39.8262,
    modernCountry: 'Saudi Arabia',
    modernName: 'Mecca, Hejaz',
    certainty: 'explicit',
    certaintyNote: 'Explicitly named as Bakkah in Surah Al-Imran (3:96) and Makkah in Surah Al-Fath (48:24).',
    relevantVerses: [
      {
        verseKey: '3:96',
        surahNumber: 3,
        ayahNumber: 96,
        surahName: 'Aal-i-Imraan',
        contextDescription: 'Behold, the first House of Prayer established for mankind is the one at Bakkah: it is full of blessing.'
      },
      {
        verseKey: '48:24',
        surahNumber: 48,
        ayahNumber: 24,
        surahName: 'Al-Fath',
        contextDescription: 'It is He Who restrained their hands from you and your hands from them in the valley of Makkah.'
      },
      {
        verseKey: '2:125',
        surahNumber: 2,
        ayahNumber: 125,
        surahName: 'Al-Baqara',
        contextDescription: 'And remember We made the Shrine a place of assembly for men and a place of safety (Maqam Ibrahim).'
      }
    ],
    historicalBackground: 'The ancient valley where Prophet Ibrahim (Abraham) settled his wife Hajar and infant son Ismail, and subsequently rebuilt the Ka’bah. It has been a spiritual sanctuary and central hub for trade caravans (the winter and summer journeys) across the Arabian peninsula.',
    archaeologicalNotes: 'Continuous habitation verified through pre-Islamic Arabic poetry, epigraphy, and classical Greek references (such as Ptolemy’s Macoraba).',
    sources: [
      { title: 'Tafhim al-Qur\'an by Abul A\'la Maududi, Notes on 3:96 & 48:24' },
      { title: 'Encyclopaedia of Islam, Brill, "Makka"' },
      { title: 'Atlas of the Quran by Dr. Shawqi Abu Khalil' }
    ]
  },
  {
    id: 'madinah-yathrib',
    name: 'Yathrib / Al-Madinah Al-Munawwarah',
    arabicName: 'يَثْرِب / المَدِينَة المُنَوَّرَة',
    category: 'prophet',
    lat: 24.4672,
    lng: 39.6111,
    modernCountry: 'Saudi Arabia',
    modernName: 'Medina, Hejaz',
    certainty: 'explicit',
    certaintyNote: 'Explicitly referred to by its ancient name Yathrib in Surah Al-Ahzab (33:13) and as Al-Madinah in Surah At-Tawbah (9:101).',
    relevantVerses: [
      {
        verseKey: '33:13',
        surahNumber: 33,
        ayahNumber: 13,
        surahName: 'Al-Ahzaab',
        contextDescription: 'And when a party of them said: "O people of Yathrib! There is no stand possible for you, so turn back!"'
      },
      {
        verseKey: '9:101',
        surahNumber: 9,
        ayahNumber: 101,
        surahName: 'At-Tawba',
        contextDescription: 'And of the desert Arabs around you, some are hypocrites, and of the people of Al-Madinah.'
      }
    ],
    historicalBackground: 'An oasis settlement fertile in date palms, known prior to the Hijrah as Yathrib, home to the Aus and Khazraj tribes as well as Jewish communities. Following the Prophet Muhammad’s migration in 622 CE, it became the capital of the nascent Islamic state.',
    archaeologicalNotes: 'Ancient volcanic basalt plains (Harrat Rahat) and date groves documented from pre-Islamic times to modern geological surveys.',
    sources: [
      { title: 'Tafhim al-Qur\'an, Introductory notes to Surah Al-Ahzab' },
      { title: 'The Cambridge History of Islam, Vol. 1A' }
    ]
  },
  {
    id: 'mount-judi',
    name: 'Mount Judi (Resting Place of the Ark)',
    arabicName: 'جَبَل الجُودِيّ',
    category: 'nature',
    lat: 37.3667,
    lng: 42.4833,
    modernCountry: 'Turkey',
    modernName: 'Cudi Dağı, Şırnak Province',
    certainty: 'explicit',
    certaintyNote: 'Explicitly named as Al-Judi (الجُودِيّ) in Surah Hud (11:44).',
    relevantVerses: [
      {
        verseKey: '11:44',
        surahNumber: 11,
        ayahNumber: 44,
        surahName: 'Hud',
        contextDescription: 'The water abated, and the decree was accomplished; and the Ark came to rest upon Mount Al-Judi.'
      }
    ],
    historicalBackground: 'The Quran specifically states that the Ark of Nuh (Noah) came to rest upon Mount Judi. Classical Arabic and Syriac geography identify this mountain range near the Syrian and Iraqi-Turkish borders, overlooking the Tigris River basin.',
    archaeologicalNotes: 'Archaeological excavations in the Cudi region have revealed ancient Christian and early Islamic pilgrimage shrines commemorating the resting of Noah’s Ark.',
    sources: [
      { title: 'Maududi, Tafhim al-Qur\'an, Commentary on Hud 11:44' },
      { title: 'Yaqut al-Hamawi, Mu\'jam al-Buldan, entry "Al-Judiyy"' },
      { title: 'A. H. Layard, Discoveries in the Ruins of Nineveh and Babylon (1853)' }
    ]
  },
  {
    id: 'mount-sinai-tur',
    name: 'Mount Sinai / Jabal At-Tur',
    arabicName: 'طُور سِينِينَ / جَبَل مُوسَى',
    category: 'nature',
    lat: 28.5392,
    lng: 33.9750,
    modernCountry: 'Egypt',
    modernName: 'Sinai Peninsula (Jabal Musa / Mount Horeb)',
    certainty: 'explicit',
    certaintyNote: 'Explicitly named as Tur Sinin in Surah At-Tin (95:2) and At-Tur in Surah At-Tur (52:1) and Al-Baqarah (2:63).',
    relevantVerses: [
      {
        verseKey: '95:2',
        surahNumber: 95,
        ayahNumber: 2,
        surahName: 'At-Tin',
        contextDescription: 'And by Mount Sinai (Tur Sinin).'
      },
      {
        verseKey: '52:1',
        surahNumber: 52,
        ayahNumber: 1,
        surahName: 'At-Toor',
        contextDescription: 'By the Mount (At-Tur).'
      },
      {
        verseKey: '28:29',
        surahNumber: 28,
        ayahNumber: 29,
        surahName: 'Al-Qasas',
        contextDescription: 'When Moses completed the term and was travelling with his family, he perceived a fire in the direction of the Mount.'
      }
    ],
    historicalBackground: 'The holy mountain where Musa (Moses) received the divine commandments and witnessed the burning bush. Located in the rugged granite massif of southern Sinai.',
    archaeologicalNotes: 'Saint Catherine’s Monastery at the foot of Mount Sinai was established in the 6th century CE, marking centuries of pilgrim trails recorded in Nabataean, Greek, and Arabic graffiti.',
    sources: [
      { title: 'Tafhim al-Qur\'an, Commentary on Surah At-Tin & Surah At-Tur' },
      { title: 'UNESCO World Heritage site dossier for Saint Catherine Area' }
    ]
  },
  {
    id: 'al-aqsa-jerusalem',
    name: 'Al-Masjid Al-Aqsa / Bayt Al-Maqdis (Jerusalem)',
    arabicName: 'المَسْجِد الأَقْصَى / بَيْت المَقْدِس',
    category: 'sanctuary',
    lat: 31.7761,
    lng: 35.2358,
    modernCountry: 'Palestine / West Bank',
    modernName: 'Old City of Jerusalem / Al-Quds',
    certainty: 'explicit',
    certaintyNote: 'Explicitly named as Al-Masjid Al-Aqsa (the Farthest Mosque) in Surah Al-Isra (17:1).',
    relevantVerses: [
      {
        verseKey: '17:1',
        surahNumber: 17,
        ayahNumber: 1,
        surahName: 'Al-Israa',
        contextDescription: 'Glory be to Him Who took His servant for a journey by night from the Sacred Mosque to the Farthest Mosque, whose surroundings We have blessed.'
      },
      {
        verseKey: '21:71',
        surahNumber: 21,
        ayahNumber: 71,
        surahName: 'Al-Anbiyaa',
        contextDescription: 'And We delivered him (Abraham) and Lot to the land which We blessed for all nations.'
      }
    ],
    historicalBackground: 'The sanctified plateau associated with generations of prophets, including Dawud (David), Sulayman (Solomon), and Isa (Jesus). It was the first Qibla (direction of prayer) for Muslims and the destination of the miraculous Night Journey (Isra).',
    archaeologicalNotes: 'Extensive ancient monumental masonry and historical strata spanning Canaanite, Israelite, Roman, Byzantine, Umayyad, and Ottoman eras.',
    sources: [
      { title: 'Maududi, Tafhim al-Qur\'an, Commentary on Surah Al-Isra 17:1' },
      { title: 'K.A.C. Creswell, Early Muslim Architecture' }
    ]
  },
  {
    id: 'marib-dam-saba',
    name: 'The Great Dam of Marib & Kingdom of Saba (Sheba)',
    arabicName: 'سَدّ مَأْرِب / مَمْلَكَة سَبَأ',
    category: 'civilization',
    lat: 15.3970,
    lng: 45.3430,
    modernCountry: 'Yemen',
    modernName: 'Marib Governorate',
    certainty: 'explicit',
    certaintyNote: 'Explicitly mentioned as Saba (سَبَأ) and the devastating Flood of the Dam (سَيْل العَرِم) in Surah Saba (34:15-16).',
    relevantVerses: [
      {
        verseKey: '34:15',
        surahNumber: 34,
        ayahNumber: 15,
        surahName: 'Saba',
        contextDescription: 'For the people of Saba there was indeed a sign in their dwelling-place: two gardens on the right and the left.'
      },
      {
        verseKey: '34:16',
        surahNumber: 34,
        ayahNumber: 16,
        surahName: 'Saba',
        contextDescription: 'But they turned away, so We unleashed upon them the devastating flood of the dam (Sayl al-Arim).'
      },
      {
        verseKey: '27:22',
        surahNumber: 27,
        ayahNumber: 22,
        surahName: 'An-Naml',
        contextDescription: 'The hoopoe said: "I have come to you with certain news from Saba."'
      }
    ],
    historicalBackground: 'The Kingdom of Saba was celebrated for its extraordinary agricultural engineering in the dry southern Arabian highlands. The great stone and masonry dam of Wadi Dhana was built in the 8th century BCE and sustained lush oases until its catastrophic collapse in the 6th century CE.',
    archaeologicalNotes: 'UNESCO World Heritage inscription: "Landmarks of the Ancient Kingdom of Saba, Marib" (2023). Sabean inscriptions on the dam ruins detail hydraulic maintenance by Kings Dhamar Ali and Sharahbil.',
    sources: [
      { title: 'Maududi, Tafhim al-Qur\'an, Historical Appendix on Surah Saba' },
      { title: 'German Archaeological Institute (DAI) Marib Excavation Reports' },
      { title: 'UNESCO World Heritage Committee records, Ref 1686' }
    ]
  },
  {
    id: 'al-hijr-madain-salih',
    name: 'Al-Hijr / Mada\'in Salih / Hegra (Dwellings of Thamud)',
    arabicName: 'الحِجْر / مَدَائِن صَالِح',
    category: 'civilization',
    lat: 26.8016,
    lng: 37.9544,
    modernCountry: 'Saudi Arabia',
    modernName: 'AlUla, Madinah Region',
    certainty: 'explicit',
    certaintyNote: 'Explicitly named as Ashab al-Hijr (أَصْحَابُ الحِجْرِ) in Surah Al-Hijr (15:80-82).',
    relevantVerses: [
      {
        verseKey: '15:80',
        surahNumber: 15,
        ayahNumber: 80,
        surahName: 'Al-Hijr',
        contextDescription: 'And surely the dwellers of Al-Hijr also rejected the Messengers.'
      },
      {
        verseKey: '15:82',
        surahNumber: 15,
        ayahNumber: 82,
        surahName: 'Al-Hijr',
        contextDescription: 'And they used to hew out houses from the mountains, feeling secure.'
      },
      {
        verseKey: '7:74',
        surahNumber: 7,
        ayahNumber: 74,
        surahName: 'Al-A\'raaf',
        contextDescription: 'And remember when He made you successors after Aad and established you in the land: you carve palaces from plains and hew homes from mountains.'
      }
    ],
    historicalBackground: 'The ancient rock-hewn settlement associated with the Prophet Salih and the people of Thamud. The Thamudic civilization flourished along the incense route, followed centuries later by the Nabataean kingdom whose monumental carved sandstone tombs stand to this day.',
    archaeologicalNotes: 'First UNESCO World Heritage site in Saudi Arabia (Hegra Archaeological Site, 2008). Over 110 monumental rock-cut tombs with Thamudic and Lihyanite inscriptions.',
    sources: [
      { title: 'Maududi, Tafhim al-Qur\'an, Commentary on Surah Al-Hijr 15:80-84' },
      { title: 'UNESCO World Heritage List Ref 1293' },
      { title: 'Royal Commission for AlUla (RCU) Archaeology Series' }
    ]
  },
  {
    id: 'madyan-midian',
    name: 'Madyan (Land of Midian & Prophet Shu\'ayb)',
    arabicName: 'مَدْيَن / مَغَايِر شُعَيْب',
    category: 'prophet',
    lat: 28.4842,
    lng: 35.0069,
    modernCountry: 'Saudi Arabia',
    modernName: 'Al-Bad\', Tabuk Province',
    certainty: 'explicit',
    certaintyNote: 'Explicitly named as Madyan in Surah Al-A\'raf (7:85), Hud (11:84), and Al-Qasas (28:22).',
    relevantVerses: [
      {
        verseKey: '28:22',
        surahNumber: 28,
        ayahNumber: 22,
        surahName: 'Al-Qasas',
        contextDescription: 'And when he turned his face toward Madyan, he said: "It may be that my Lord will guide me to the right path."'
      },
      {
        verseKey: '28:23',
        surahNumber: 28,
        ayahNumber: 23,
        surahName: 'Al-Qasas',
        contextDescription: 'And when he arrived at the watering place of Madyan, he found there a group of people watering their flocks.'
      },
      {
        verseKey: '7:85',
        surahNumber: 7,
        ayahNumber: 85,
        surahName: 'Al-A\'raaf',
        contextDescription: 'And to Madyan We sent their brother Shu\'ayb: he said, "O my people! Serve Allah, you have no god other than Him."'
      }
    ],
    historicalBackground: 'The ancient trade crossroads east of the Gulf of Aqaba where Musa fled from Pharaoh and stayed for ten years, marrying the daughter of the righteous elder of Midian. Later known in Arabic tradition as Magha\'ir Shu\'ayb.',
    archaeologicalNotes: 'Monumental rock-cut facades and Midianite pottery dating back to the late Bronze and Iron Ages (13th-11th centuries BCE).',
    sources: [
      { title: 'Tafhim al-Qur\'an, Commentary on Surah Al-Qasas 28:22-28' },
      { title: 'P.J. Parr, "Explorations in North-West Arabia", Bulletin of the Institute of Archaeology' }
    ]
  },
  {
    id: 'babylon-babil',
    name: 'Babil (Ancient Babylon)',
    arabicName: 'بَابِل',
    category: 'civilization',
    lat: 32.5422,
    lng: 44.4210,
    modernCountry: 'Iraq',
    modernName: 'Hillah, Babil Governorate',
    certainty: 'explicit',
    certaintyNote: 'Explicitly named as Babil (بَابِل) in Surah Al-Baqarah (2:102).',
    relevantVerses: [
      {
        verseKey: '2:102',
        surahNumber: 2,
        ayahNumber: 102,
        surahName: 'Al-Baqara',
        contextDescription: 'And they followed what the devils recited against the kingdom of Solomon... and what was revealed to the two angels in Babylon, Harut and Marut.'
      }
    ],
    historicalBackground: 'The imperial capital of ancient Mesopotamia situated on the Euphrates River, renowned for its architectural wonders, ziggurats, and early legal codes.',
    archaeologicalNotes: 'Extensive excavated ruins of the Ishtar Gate, Processional Way, and Southern Palace. Inscribed as a UNESCO World Heritage site in 2019.',
    sources: [
      { title: 'Tafhim al-Qur\'an, Detailed note on Surah Al-Baqarah 2:102' },
      { title: 'UNESCO World Heritage Centre, Babylon Ref 278rev' }
    ]
  },
  {
    id: 'dead-sea-sodom',
    name: 'The Dead Sea Rift & Valley of Lut (Sodom & Gomorrah)',
    arabicName: 'البَحْر المَيِّت / دِيَار قَوْم لُوط',
    category: 'civilization',
    lat: 31.5000,
    lng: 35.5000,
    modernCountry: 'Jordan / Palestine',
    modernName: 'Jordan Rift Valley / Dead Sea',
    certainty: 'historical_consensus',
    certaintyNote: 'The geographical location along the ancient trade highway ("an established highway" - sabil muqim) matches the Jordan Rift Valley according to historical and geographic consensus.',
    relevantVerses: [
      {
        verseKey: '15:76',
        surahNumber: 15,
        ayahNumber: 76,
        surahName: 'Al-Hijr',
        contextDescription: 'And surely those cities lay on a known highway.'
      },
      {
        verseKey: '29:35',
        surahNumber: 29,
        ayahNumber: 35,
        surahName: 'Al-Ankaboot',
        contextDescription: 'And We have left thereof an evident sign for a people who understand.'
      },
      {
        verseKey: '37:137',
        surahNumber: 37,
        ayahNumber: 137,
        surahName: 'As-Saaffaat',
        contextDescription: 'And surely you pass by their ruins morning and night: will you not then use your reason?'
      }
    ],
    historicalBackground: 'The lowest land elevation on Earth, where the settlements of Prophet Lut were overturned due to moral transgression. The Quraysh merchants regularly passed by its scorched, mineral-rich terrain on their caravan route to Syria.',
    archaeologicalNotes: 'Extensive geological asphalt deposits and archaeological excavations around Bab edh-Dhra and Tall el-Hammam in the southern Jordan valley.',
    sources: [
      { title: 'Maududi, Tafhim al-Qur\'an, Notes on 15:76 and 29:35' },
      { title: 'W.F. Albright, "The Archaeological Results of an Expedition to Moab and the Dead Sea"' }
    ]
  },
  {
    id: 'ashab-al-kahf-cave',
    name: 'Cave of the Companions of the Cave (Ashab al-Kahf)',
    arabicName: 'كَهْف أَصْحَاب الكَهْف',
    category: 'prophet',
    lat: 31.9022,
    lng: 35.9756,
    modernCountry: 'Jordan / Turkey',
    modernName: 'Al-Raqim near Amman (also Ephesus in Anatolia)',
    certainty: 'disputed',
    certaintyNote: 'Identification disputed among classical commentators. The most prominent candidates are Al-Raqim near Amman, Jordan, and the Seven Sleepers Cave at Ephesus, Turkey.',
    relevantVerses: [
      {
        verseKey: '18:9',
        surahNumber: 18,
        ayahNumber: 9,
        surahName: 'Al-Kahf',
        contextDescription: 'Do you reckon that the Companions of the Cave and Al-Raqim were among Our wondrous signs?'
      },
      {
        verseKey: '18:17',
        surahNumber: 18,
        ayahNumber: 17,
        surahName: 'Al-Kahf',
        contextDescription: 'And you would see the sun when it rose, inclining away from their cave to the right, and when it set, passing away from them to the left.'
      }
    ],
    historicalBackground: 'The narrative of the faithful youths who sought refuge in a cave to escape religious persecution, falling into a miraculous deep slumber that lasted for centuries.',
    archaeologicalNotes: 'The cave at Al-Raqim near Amman contains ancient Byzantine stone sarcophagi and early Umayyad inscriptions; the cave at Ephesus was a prominent pilgrimage site in late antiquity.',
    sources: [
      { title: 'Maududi, Tafhim al-Qur\'an, Comprehensive Preface to Surah Al-Kahf' },
      { title: 'Encyclopaedia of Islam, "Ashab al-Kahf"' }
    ]
  },
  {
    id: 'iram-ahqaf',
    name: 'Iram of the Pillars / The Sand Dunes (Al-Ahqaf)',
    arabicName: 'إِرَم ذَات العِمَاد / الأَحْقَاف',
    category: 'civilization',
    lat: 18.2550,
    lng: 53.6490,
    modernCountry: 'Oman / Yemen border',
    modernName: 'Rub\' al Khali (Empty Quarter) / Shisr / Ubar',
    certainty: 'disputed',
    certaintyNote: 'Archaeological identification is disputed. Satellite mapping discovered ancient caravan ruins at Shisr, but scholars debate whether it corresponds directly to Quranic Iram.',
    relevantVerses: [
      {
        verseKey: '89:7',
        surahNumber: 89,
        ayahNumber: 7,
        surahName: 'Al-Fajr',
        contextDescription: 'With Iram, the city of towering pillars, the like of which was never created in the lands?'
      },
      {
        verseKey: '46:21',
        surahNumber: 46,
        ayahNumber: 21,
        surahName: 'Al-Ahqaf',
        contextDescription: 'And mention the brother of Aad, when he warned his people in the winding sand dunes (Al-Ahqaf).'
      }
    ],
    historicalBackground: 'The ancient capital of the people of \'Ad, endowed with towering architecture and agricultural wealth, located among the vast sand dunes of southern Arabia.',
    archaeologicalNotes: 'NASA radar imagery in the 1990s detected ancient buried trade tracks leading to the collapsed limestone sinkhole fortress at Shisr, Oman.',
    sources: [
      { title: 'Nicholas Clapp, The Road to Ubar (1998)' },
      { title: 'Tafhim al-Qur\'an, Geographical notes on Surah Al-Fajr and Al-Ahqaf' }
    ]
  },
  {
    id: 'badr-battleground',
    name: 'Badr (The First Decisive Battlefield)',
    arabicName: 'بَدْر',
    category: 'prophet',
    lat: 23.7780,
    lng: 38.7900,
    modernCountry: 'Saudi Arabia',
    modernName: 'Badr Hunayn, Madinah Province',
    certainty: 'explicit',
    certaintyNote: 'Explicitly named as Badr (بَدْر) in Surah Al-Imran (3:123).',
    relevantVerses: [
      {
        verseKey: '3:123',
        surahNumber: 3,
        ayahNumber: 123,
        surahName: 'Aal-i-Imraan',
        contextDescription: 'And Allah had already given you victory at Badr when you were helpless; so fear Allah that you may be grateful.'
      },
      {
        verseKey: '8:42',
        surahNumber: 8,
        ayahNumber: 42,
        surahName: 'Al-Anfaal',
        contextDescription: 'When you were on the near side of the valley, and they were on the far side, and the caravan was below you.'
      }
    ],
    historicalBackground: 'An ancient staging ground and market well along the Syrian trade route south-west of Medina, where the decisive confrontation of 2 AH (624 CE) took place.',
    archaeologicalNotes: 'Well-documented terrain conforming precisely to the geographical description in Surah Al-Anfal (the near slope al-\'udwah ad-dunya and far slope al-\'udwah al-quswa).',
    sources: [
      { title: 'Maududi, Tafhim al-Qur\'an, Introduction to Surah Al-Anfal' },
      { title: 'Ibn Ishaq, Sirat Rasul Allah' }
    ]
  },
  {
    id: 'nile-river-egypt',
    name: 'The River (Al-Yamm / River Nile)',
    arabicName: 'اليَمّ / نَهْر النِّيل',
    category: 'nature',
    lat: 29.9753,
    lng: 31.1376,
    modernCountry: 'Egypt',
    modernName: 'Nile Valley, Egypt',
    certainty: 'historical_consensus',
    certaintyNote: 'Referred to in the Quran as Al-Yamm (اليَمّ) and the rivers flowing beneath Pharaoh\'s palaces.',
    relevantVerses: [
      {
        verseKey: '28:7',
        surahNumber: 28,
        ayahNumber: 7,
        surahName: 'Al-Qasas',
        contextDescription: 'And We inspired the mother of Moses: "Nurse him, but when you fear for him, cast him into the river (al-Yamm)."'
      },
      {
        verseKey: '43:51',
        surahNumber: 43,
        ayahNumber: 51,
        surahName: 'Az-Zukhruf',
        contextDescription: 'And Pharaoh proclaimed among his people, saying: "O my people! Does not the kingdom of Egypt belong to me, and these rivers flowing beneath me?"'
      }
    ],
    historicalBackground: 'The lifeblood river of ancient Egyptian civilization, upon which infant Musa\'s ark was placed, and through which the seasonal agricultural economy of Egypt flourished.',
    archaeologicalNotes: 'The Nile delta and riverine irrigation networks formed the foundation of ancient dynastic Egypt.',
    sources: [
      { title: 'Tafhim al-Qur\'an, Commentary on Surah Al-Qasas 28:7' }
    ]
  }
];
