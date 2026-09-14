import { db, schema } from '../src/platform/db';
import fs from 'fs';
import path from 'path';

interface MediaSeedItem {
  id: string;
  slug: string;
  type: 'movie' | 'tv_series';
  title: string;
  releaseYear: number;
  genres: string[];
  creators: string[];
  myRating: number;
  watchStatus: string;
  tier: 'masterpiece' | 'favorite' | 'recommended';
  personalReview: string;
  searchQuery?: string;
}

export const ALL_MEDIA_ENTRIES: MediaSeedItem[] = [
  // ── MonsterVerse Franchise ──────────────────────────────────────────────
  {
    id: 'movie-godzilla-2014',
    slug: 'godzilla-2014',
    type: 'movie',
    title: 'Godzilla',
    releaseYear: 2014,
    genres: ['Action', 'Sci-Fi', 'Monster'],
    creators: ['Gareth Edwards', 'Legendary Pictures'],
    myRating: 9.1,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Gareth Edwards masterclass in scale and patience. The HALO jump sequence into San Francisco and the blue atomic breath reveal remain unforgettable.',
  },
  {
    id: 'movie-kong-skull-island',
    slug: 'kong-skull-island',
    type: 'movie',
    title: 'Kong: Skull Island',
    releaseYear: 2017,
    genres: ['Action', 'Adventure', 'Fantasy'],
    creators: ['Jordan Vogt-Roberts', 'Legendary Pictures'],
    myRating: 9.0,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Vietnam-era psychedelic rock aesthetic meets colossal monster brawls. Stellar cinematography with striking silhouette shots.',
  },
  {
    id: 'movie-godzilla-king-of-the-monsters',
    slug: 'godzilla-king-of-the-monsters',
    type: 'movie',
    title: 'Godzilla: King of the Monsters',
    releaseYear: 2019,
    genres: ['Action', 'Sci-Fi', 'Fantasy'],
    creators: ['Michael Dougherty', 'Legendary Pictures'],
    myRating: 9.2,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Mythic, biblical titan warfare. Bear McCreary orchestral score blending classic Ifukube themes with King Ghidorah and Mothra was glorious.',
  },
  {
    id: 'movie-godzilla-vs-kong',
    slug: 'godzilla-vs-kong',
    type: 'movie',
    title: 'Godzilla vs. Kong',
    releaseYear: 2021,
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    creators: ['Adam Wingard', 'Legendary Pictures'],
    myRating: 9.3,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Neon-soaked Hong Kong climax and Hollow Earth world-building. Pure unadulterated cinematic adrenaline.',
  },
  {
    id: 'movie-godzilla-x-kong-the-new-empire',
    slug: 'godzilla-x-kong-the-new-empire',
    type: 'movie',
    title: 'Godzilla x Kong: The New Empire',
    releaseYear: 2024,
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    creators: ['Adam Wingard', 'Legendary Pictures'],
    myRating: 8.9,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'High-energy Saturday morning cartoon energy blown up to IMAX scale. Kong with the B.E.A.S.T. glove and pink evolved Godzilla.',
  },

  // ── Christopher Nolan Complete Filmography ──────────────────────────────
  {
    id: 'movie-following',
    slug: 'following',
    type: 'movie',
    title: 'Following',
    releaseYear: 1998,
    genres: ['Crime', 'Mystery', 'Thriller'],
    creators: ['Christopher Nolan'],
    myRating: 8.5,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Nolan micro-budget neo-noir debut. The non-linear structure and obsessive voyeurism established his signature architectural storytelling.',
  },
  {
    id: 'movie-memento',
    slug: 'memento',
    type: 'movie',
    title: 'Memento',
    releaseYear: 2000,
    genres: ['Mystery', 'Thriller'],
    creators: ['Christopher Nolan'],
    myRating: 9.6,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'The reverse chronology structure is pure narrative genius that puts you directly inside Leonard anterograde amnesia.',
  },
  {
    id: 'movie-insomnia',
    slug: 'insomnia',
    type: 'movie',
    title: 'Insomnia',
    releaseYear: 2002,
    genres: ['Crime', 'Drama', 'Mystery'],
    creators: ['Christopher Nolan'],
    myRating: 8.8,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Atmospheric cat-and-mouse duel under the midnight Alaskan sun. Al Pacino sleep-deprived detective meets Robin Williams chilling killer.',
  },
  {
    id: 'movie-batman-begins',
    slug: 'batman-begins',
    type: 'movie',
    title: 'Batman Begins',
    releaseYear: 2005,
    genres: ['Action', 'Crime', 'Drama'],
    creators: ['Christopher Nolan'],
    myRating: 9.3,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Grounded tactical reinvention of the Dark Knight mythos. The Himalayan League of Shadows training and fear gas climax set the standard.',
  },
  {
    id: 'movie-the-prestige',
    slug: 'the-prestige',
    type: 'movie',
    title: 'The Prestige',
    releaseYear: 2006,
    genres: ['Drama', 'Mystery', 'Sci-Fi'],
    creators: ['Christopher Nolan'],
    myRating: 9.7,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'A film built like a magic trick in three acts. The obsessive rivalry between Angier and Borden with Nikola Tesla machine is immaculate cinema.',
  },
  {
    id: 'movie-the-dark-knight',
    slug: 'the-dark-knight',
    type: 'movie',
    title: 'The Dark Knight',
    releaseYear: 2008,
    genres: ['Action', 'Crime', 'Drama', 'Thriller'],
    creators: ['Christopher Nolan'],
    myRating: 9.9,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'The gold standard of modern cinema. Heath Ledger Joker delivered one of the greatest acting performances in human history.',
  },
  {
    id: 'movie-inception',
    slug: 'inception',
    type: 'movie',
    title: 'Inception',
    releaseYear: 2010,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    creators: ['Christopher Nolan'],
    myRating: 9.8,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Simultaneous multi-tier temporal dream heist. Zero-gravity hallway fight and Hans Zimmer Time transcend filmmaking.',
  },
  {
    id: 'movie-the-dark-knight-rises',
    slug: 'the-dark-knight-rises',
    type: 'movie',
    title: 'The Dark Knight Rises',
    releaseYear: 2012,
    genres: ['Action', 'Crime', 'Drama'],
    creators: ['Christopher Nolan'],
    myRating: 9.2,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Operatic finale to the trilogy. Tom Hardy Bane broke the Bat physically, and Bruce Wayne climb out of the Pit was mythic triumph.',
  },
  {
    id: 'movie-interstellar',
    slug: 'interstellar',
    type: 'movie',
    title: 'Interstellar',
    releaseYear: 2014,
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    creators: ['Christopher Nolan'],
    myRating: 9.9,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Docking scene with No Time for Caution, Gargantua black hole, and the fifth dimension tesseract. A profound testament to human ambition.',
  },
  {
    id: 'movie-dunkirk',
    slug: 'dunkirk',
    type: 'movie',
    title: 'Dunkirk',
    releaseYear: 2017,
    genres: ['Action', 'Drama', 'History', 'War'],
    creators: ['Christopher Nolan'],
    myRating: 9.4,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Pure experiential cinema. The interlocking temporal crosscuts of The Mole (one week), The Sea (one day), and The Air (one hour) are relentless.',
  },
  {
    id: 'movie-tenet',
    slug: 'tenet',
    type: 'movie',
    title: 'Tenet',
    releaseYear: 2020,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    creators: ['Christopher Nolan'],
    myRating: 9.1,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Audacious temporal pincer movement and reverse entropy combat choreography. Ludwig Göransson pulse-pounding electronic score.',
  },
  {
    id: 'movie-oppenheimer',
    slug: 'oppenheimer',
    type: 'movie',
    title: 'Oppenheimer',
    releaseYear: 2023,
    genres: ['Biography', 'Drama', 'History'],
    creators: ['Christopher Nolan'],
    myRating: 9.8,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Trinity test silence and the haunting gym stomping sequence. Cillian Murphy eyes capture the existential terror of unleashing the atomic age.',
  },

  // ── Marvel Cinematic Universe (MCU Complete 1-6) ────────────────────────
  // Phase 1
  {
    id: 'movie-iron-man',
    slug: 'iron-man',
    type: 'movie',
    title: 'Iron Man',
    releaseYear: 2008,
    genres: ['Action', 'Sci-Fi', 'Superhero'],
    creators: ['Jon Favreau', 'Marvel Studios'],
    myRating: 9.2,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'The foundation of the MCU. Robert Downey Jr. is electrifying as Tony Stark forging Mark I in the cave.',
  },
  {
    id: 'movie-the-incredible-hulk',
    slug: 'the-incredible-hulk',
    type: 'movie',
    title: 'The Incredible Hulk',
    releaseYear: 2008,
    genres: ['Action', 'Sci-Fi', 'Superhero'],
    creators: ['Louis Leterrier', 'Marvel Studios'],
    myRating: 8.4,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Edward Norton troubled Bruce Banner and the visceral Harlem street brawl against the Abomination.',
  },
  {
    id: 'movie-iron-man-2',
    slug: 'iron-man-2',
    type: 'movie',
    title: 'Iron Man 2',
    releaseYear: 2010,
    genres: ['Action', 'Sci-Fi', 'Superhero'],
    creators: ['Jon Favreau', 'Marvel Studios'],
    myRating: 8.6,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Monaco Grand Prix briefcase suit-up and the introduction of Natasha Romanoff and James Rhodes War Machine.',
  },
  {
    id: 'movie-thor',
    slug: 'thor',
    type: 'movie',
    title: 'Thor',
    releaseYear: 2011,
    genres: ['Action', 'Fantasy', 'Superhero'],
    creators: ['Kenneth Branagh', 'Marvel Studios'],
    myRating: 8.7,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Shakespearean familial drama in the golden halls of Asgard with Tom Hiddleston definitive debut as Loki.',
  },
  {
    id: 'movie-captain-america-the-first-avenger',
    slug: 'captain-america-the-first-avenger',
    type: 'movie',
    title: 'Captain America: The First Avenger',
    releaseYear: 2011,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    creators: ['Joe Johnston', 'Marvel Studios'],
    myRating: 8.9,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Vintage WWII pulp heroism. Steve Rogers throwing himself on the fake grenade showed what made him worthy.',
  },
  {
    id: 'movie-the-avengers',
    slug: 'the-avengers',
    type: 'movie',
    title: 'The Avengers',
    releaseYear: 2012,
    genres: ['Action', 'Sci-Fi', 'Superhero'],
    creators: ['Joss Whedon', 'Marvel Studios'],
    myRating: 9.3,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'The historic circular panning shot in New York as all six original Avengers assemble to Alan Silvestri score.',
  },

  // Phase 2
  {
    id: 'movie-iron-man-3',
    slug: 'iron-man-3',
    type: 'movie',
    title: 'Iron Man 3',
    releaseYear: 2013,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    creators: ['Shane Black', 'Marvel Studios'],
    myRating: 8.8,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Shane Black buddy-cop deconstruction of Tony Stark PTSD and the House Party Protocol armor swarm.',
  },
  {
    id: 'movie-thor-the-dark-world',
    slug: 'thor-the-dark-world',
    type: 'movie',
    title: 'Thor: The Dark World',
    releaseYear: 2013,
    genres: ['Action', 'Fantasy', 'Sci-Fi'],
    creators: ['Alan Taylor', 'Marvel Studios'],
    myRating: 8.2,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Loki and Thor banter escaping Asgard and the introduction of the Reality Stone Aether.',
  },
  {
    id: 'movie-captain-america-the-winter-soldier',
    slug: 'captain-america-the-winter-soldier',
    type: 'movie',
    title: 'Captain America: The Winter Soldier',
    releaseYear: 2014,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    creators: ['Anthony Russo', 'Joe Russo', 'Marvel Studios'],
    myRating: 9.7,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Peak political paranoia thriller. The elevator fight, highway knife combat, and the fall of S.H.I.E.L.D.',
  },
  {
    id: 'movie-guardians-of-the-galaxy',
    slug: 'guardians-of-the-galaxy',
    type: 'movie',
    title: 'Guardians of the Galaxy',
    releaseYear: 2014,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    creators: ['James Gunn', 'Marvel Studios'],
    myRating: 9.4,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Awesome Mix Vol. 1, cosmic heart, and a ragtag band of galactic outlaws bonding into an inseparable family.',
  },
  {
    id: 'movie-avengers-age-of-ultron',
    slug: 'avengers-age-of-ultron',
    type: 'movie',
    title: 'Avengers: Age of Ultron',
    releaseYear: 2015,
    genres: ['Action', 'Sci-Fi', 'Superhero'],
    creators: ['Joss Whedon', 'Marvel Studios'],
    myRating: 8.9,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'James Spader chilling philosophical voice for Ultron, the Hulkbuster brawl in Johannesburg, and Vision birth.',
  },
  {
    id: 'movie-ant-man',
    slug: 'ant-man',
    type: 'movie',
    title: 'Ant-Man',
    releaseYear: 2015,
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    creators: ['Peyton Reed', 'Marvel Studios'],
    myRating: 8.7,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Clever micro-scale heist comedy. Thomas the Tank Engine toy train fight in Cassie room was inspired visual humor.',
  },

  // Phase 3
  {
    id: 'movie-captain-america-civil-war',
    slug: 'captain-america-civil-war',
    type: 'movie',
    title: 'Captain America: Civil War',
    releaseYear: 2016,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    creators: ['Anthony Russo', 'Joe Russo', 'Marvel Studios'],
    myRating: 9.4,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Ideological clash between Steve and Tony with peak airport choreography and emotional Siberian climax.',
  },
  {
    id: 'movie-doctor-strange',
    slug: 'doctor-strange',
    type: 'movie',
    title: 'Doctor Strange',
    releaseYear: 2016,
    genres: ['Action', 'Fantasy', 'Sci-Fi'],
    creators: ['Scott Derrickson', 'Marvel Studios'],
    myRating: 9.0,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Mind-bending kaleidoscope mirror dimensions and the ingenious Dormammu time loop bargain.',
  },
  {
    id: 'movie-guardians-of-the-galaxy-vol-2',
    slug: 'guardians-of-the-galaxy-vol-2',
    type: 'movie',
    title: 'Guardians of the Galaxy Vol. 2',
    releaseYear: 2017,
    genres: ['Action', 'Adventure', 'Comedy'],
    creators: ['James Gunn', 'Marvel Studios'],
    myRating: 9.2,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Deep emotional exploration of toxic fathers versus found family. Yondu Ravager funeral to Father and Son broke me.',
  },
  {
    id: 'movie-spider-man-homecoming',
    slug: 'spider-man-homecoming',
    type: 'movie',
    title: 'Spider-Man: Homecoming',
    releaseYear: 2017,
    genres: ['Action', 'Adventure', 'Comedy'],
    creators: ['Jon Watts', 'Marvel Studios'],
    myRating: 9.1,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'John Hughes high school vibe meets web-slinging. Michael Keaton Vulture car talk scene was masterclass tension.',
  },
  {
    id: 'movie-thor-ragnarok',
    slug: 'thor-ragnarok',
    type: 'movie',
    title: 'Thor: Ragnarok',
    releaseYear: 2017,
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    creators: ['Taika Waititi', 'Marvel Studios'],
    myRating: 9.1,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Immigrant Song blasting on the rainbow bridge while Thor channels lightning without Mjolnir.',
  },
  {
    id: 'movie-black-panther',
    slug: 'black-panther',
    type: 'movie',
    title: 'Black Panther',
    releaseYear: 2018,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    creators: ['Ryan Coogler', 'Marvel Studios'],
    myRating: 9.3,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Wakandan afrofuturism, Ludwig Göransson talking drum score, and Michael B. Jordan Killmonger sympathetic grief.',
  },
  {
    id: 'movie-avengers-infinity-war',
    slug: 'avengers-infinity-war',
    type: 'movie',
    title: 'Avengers: Infinity War',
    releaseYear: 2018,
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    creators: ['Anthony Russo', 'Joe Russo', 'Marvel Studios'],
    myRating: 9.8,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'A masterclass in pacing. Thanos is the protagonist of this relentless cosmic heist film. The ending snap silence was unforgettable.',
  },
  {
    id: 'movie-ant-man-and-the-wasp',
    slug: 'ant-man-and-the-wasp',
    type: 'movie',
    title: 'Ant-Man and the Wasp',
    releaseYear: 2018,
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    creators: ['Peyton Reed', 'Marvel Studios'],
    myRating: 8.5,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Breezy palate cleanser after Infinity War with inventive kitchen shrinking fight and the ominous post-credits dust scene.',
  },
  {
    id: 'movie-captain-marvel',
    slug: 'captain-marvel',
    type: 'movie',
    title: 'Captain Marvel',
    releaseYear: 2019,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    creators: ['Anna Boden', 'Ryan Fleck', 'Marvel Studios'],
    myRating: 8.4,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      '90s Blockbuster nostalgia, de-aged Nick Fury, Goose the Flerken, and Carol Danvers binary cosmic awakening.',
  },
  {
    id: 'movie-avengers-endgame',
    slug: 'avengers-endgame',
    type: 'movie',
    title: 'Avengers: Endgame',
    releaseYear: 2019,
    genres: ['Action', 'Sci-Fi', 'Drama'],
    creators: ['Anthony Russo', 'Joe Russo', 'Marvel Studios'],
    myRating: 9.7,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Portals scene and Cap lifting Mjolnir. A once-in-a-generation theatrical spectacle closing 11 years of storytelling.',
  },
  {
    id: 'movie-spider-man-far-from-home',
    slug: 'spider-man-far-from-home',
    type: 'movie',
    title: 'Spider-Man: Far From Home',
    releaseYear: 2019,
    genres: ['Action', 'Adventure', 'Comedy'],
    creators: ['Jon Watts', 'Marvel Studios'],
    myRating: 9.0,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Jake Gyllenhaal Mysterio illusion sequence in Berlin is one of the most visually inventive scenes in comic book cinema.',
  },

  // Phase 4
  {
    id: 'movie-black-widow',
    slug: 'black-widow',
    type: 'movie',
    title: 'Black Widow',
    releaseYear: 2021,
    genres: ['Action', 'Adventure', 'Thriller'],
    creators: ['Cate Shortland', 'Marvel Studios'],
    myRating: 8.7,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Grounded Bourne-style espionage with Florence Pugh magnetic debut as Yelena Belova.',
  },
  {
    id: 'movie-shang-chi',
    slug: 'shang-chi-and-the-legend-of-the-ten-rings',
    type: 'movie',
    title: 'Shang-Chi and the Legend of the Ten Rings',
    releaseYear: 2021,
    genres: ['Action', 'Adventure', 'Fantasy'],
    creators: ['Destin Daniel Cretton', 'Marvel Studios'],
    myRating: 9.2,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Breathtaking wuxia and bus martial arts choreography with Tony Leung giving Wenwu profound soul.',
  },
  {
    id: 'movie-eternals',
    slug: 'eternals',
    type: 'movie',
    title: 'Eternals',
    releaseYear: 2021,
    genres: ['Action', 'Adventure', 'Drama'],
    creators: ['Chloé Zhao', 'Marvel Studios'],
    myRating: 8.6,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Chloé Zhao natural golden-hour cinematography and cosmic philosophical scale spanning 7,000 years of human history.',
  },
  {
    id: 'movie-spider-man-no-way-home',
    slug: 'spider-man-no-way-home',
    type: 'movie',
    title: 'Spider-Man: No Way Home',
    releaseYear: 2021,
    genres: ['Action', 'Adventure', 'Fantasy'],
    creators: ['Jon Watts', 'Marvel Studios'],
    myRating: 9.3,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Three generations of Peter Parkers sharing the screen. Cathartic redemption arc for Andrew Garfield and Tobey Maguire.',
  },
  {
    id: 'movie-doctor-strange-multiverse-of-madness',
    slug: 'doctor-strange-in-the-multiverse-of-madness',
    type: 'movie',
    title: 'Doctor Strange in the Multiverse of Madness',
    releaseYear: 2022,
    genres: ['Action', 'Adventure', 'Horror'],
    creators: ['Sam Raimi', 'Marvel Studios'],
    myRating: 8.8,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Full unhinged Sam Raimi horror aesthetics, musical note combat, and Elizabeth Olsen Scarlet Witch terrifying rampage.',
  },
  {
    id: 'movie-thor-love-and-thunder',
    slug: 'thor-love-and-thunder',
    type: 'movie',
    title: 'Thor: Love and Thunder',
    releaseYear: 2022,
    genres: ['Action', 'Adventure', 'Comedy'],
    creators: ['Taika Waititi', 'Marvel Studios'],
    myRating: 8.3,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Christian Bale Gorr the God Butcher in the black-and-white Shadow Realm and Guns N Roses soundtrack.',
  },
  {
    id: 'movie-black-panther-wakanda-forever',
    slug: 'black-panther-wakanda-forever',
    type: 'movie',
    title: 'Black Panther: Wakanda Forever',
    releaseYear: 2022,
    genres: ['Action', 'Adventure', 'Drama'],
    creators: ['Ryan Coogler', 'Marvel Studios'],
    myRating: 9.1,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Heartbreaking tribute to Chadwick Boseman, Tenoch Huerta charismatic Namor, and Angela Bassett powerhouse presence.',
  },

  // Phase 5
  {
    id: 'movie-ant-man-and-the-wasp-quantumania',
    slug: 'ant-man-and-the-wasp-quantumania',
    type: 'movie',
    title: 'Ant-Man and the Wasp: Quantumania',
    releaseYear: 2023,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    creators: ['Peyton Reed', 'Marvel Studios'],
    myRating: 8.4,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Psychedelic Quantum Realm creatures and Jonathan Majors menacing debut as Kang the Conqueror.',
  },
  {
    id: 'movie-guardians-of-the-galaxy-vol-3',
    slug: 'guardians-of-the-galaxy-vol-3',
    type: 'movie',
    title: 'Guardians of the Galaxy Vol. 3',
    releaseYear: 2023,
    genres: ['Action', 'Adventure', 'Comedy'],
    creators: ['James Gunn', 'Marvel Studios'],
    myRating: 9.5,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Heart-wrenching and triumphant conclusion. Rocket origin story, the hallway fight to Beastie Boys, and pure emotional resonance.',
  },
  {
    id: 'movie-the-marvels',
    slug: 'the-marvels',
    type: 'movie',
    title: 'The Marvels',
    releaseYear: 2023,
    genres: ['Action', 'Adventure', 'Fantasy'],
    creators: ['Nia DaCosta', 'Marvel Studios'],
    myRating: 8.2,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Fun quantum entanglement body-swapping combat mechanics and Iman Vellani delightful Ms. Marvel energy.',
  },
  {
    id: 'movie-deadpool-and-wolverine',
    slug: 'deadpool-and-wolverine',
    type: 'movie',
    title: 'Deadpool & Wolverine',
    releaseYear: 2024,
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    creators: ['Shawn Levy', 'Marvel Studios'],
    myRating: 9.4,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Hugh Jackman in the comic-accurate yellow spandex fighting Ryan Reynolds to Madonna Like a Prayer. Unapologetic R-rated fan service at its peak.',
  },
  {
    id: 'movie-captain-america-brave-new-world',
    slug: 'captain-america-brave-new-world',
    type: 'movie',
    title: 'Captain America: Brave New World',
    releaseYear: 2025,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    creators: ['Julius Onah', 'Marvel Studios'],
    myRating: 8.9,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Anthony Mackie stepping fully into the shield with Harrison Ford as Thaddeus Ross and Red Hulk clash.',
  },
  {
    id: 'movie-thunderbolts',
    slug: 'thunderbolts',
    type: 'movie',
    title: 'Thunderbolts*',
    releaseYear: 2025,
    genres: ['Action', 'Adventure', 'Crime'],
    creators: ['Jake Schreier', 'Marvel Studios'],
    myRating: 8.8,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Misfit anti-heroes including Yelena Belova, Bucky Barnes, and Red Guardian in gritty black-ops missions.',
  },

  // Phase 6
  {
    id: 'movie-the-fantastic-four-first-steps',
    slug: 'the-fantastic-four-first-steps',
    type: 'movie',
    title: 'The Fantastic Four: First Steps',
    releaseYear: 2025,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    creators: ['Matt Shakman', 'Marvel Studios'],
    myRating: 9.2,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Retro-futuristic 1960s aesthetic with Pedro Pascal, Vanessa Kirby, and Galactus cosmic threat.',
  },
  {
    id: 'movie-spider-man-brand-new-day',
    slug: 'spider-man-brand-new-day',
    type: 'movie',
    title: 'Spider-Man: Brand New Day',
    releaseYear: 2026,
    genres: ['Action', 'Adventure', 'Fantasy'],
    creators: ['Destin Daniel Cretton', 'Marvel Studios'],
    myRating: 9.3,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Street-level gritty Spidey in NYC rebuilding his life without Stark tech or Avengers safety net.',
  },
  {
    id: 'movie-avengers-doomsday',
    slug: 'avengers-doomsday',
    type: 'movie',
    title: 'Avengers: Doomsday',
    releaseYear: 2026,
    genres: ['Action', 'Sci-Fi', 'Drama'],
    creators: ['Anthony Russo', 'Joe Russo', 'Marvel Studios'],
    myRating: 9.6,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'The Russo Brothers return with Robert Downey Jr. transforming into Victor Von Doom in the culmination of the Multiverse Saga.',
  },

  // Sony / Marvel Adjacency
  {
    id: 'movie-morbius',
    slug: 'morbius',
    type: 'movie',
    title: 'Morbius',
    releaseYear: 2022,
    genres: ['Action', 'Horror', 'Sci-Fi'],
    creators: ['Daniel Espinosa', 'Sony Pictures'],
    myRating: 7.9,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Jared Leto living vampire transformation and smoke trail echolocation effects in the NY subway.',
  },
  {
    id: 'movie-venom',
    slug: 'venom',
    type: 'movie',
    title: 'Venom',
    releaseYear: 2018,
    genres: ['Action', 'Sci-Fi', 'Comedy'],
    creators: ['Ruben Fleischer', 'Sony Pictures'],
    myRating: 8.8,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Tom Hardy unhinged dual-performance as Eddie Brock and the lobster-eating symbiote is infectious entertainment.',
  },
  {
    id: 'movie-venom-let-there-be-carnage',
    slug: 'venom-let-there-be-carnage',
    type: 'movie',
    title: 'Venom: Let There Be Carnage',
    releaseYear: 2021,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    creators: ['Andy Serkis', 'Sony Pictures'],
    myRating: 8.6,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Woody Harrelson terrifying Cletus Kasady and the chaotic cathedral red symbiote carnage.',
  },
  {
    id: 'movie-venom-the-last-dance',
    slug: 'venom-the-last-dance',
    type: 'movie',
    title: 'Venom: The Last Dance',
    releaseYear: 2024,
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    creators: ['Kelly Marcel', 'Sony Pictures'],
    myRating: 8.7,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Emotional road-trip finale to Eddie and Venom bond featuring Knull alien hordes and the Venom-horse.',
  },
  {
    id: 'movie-spider-man-into-the-spider-verse',
    slug: 'spider-man-into-the-spider-verse',
    type: 'movie',
    title: 'Spider-Man: Into the Spider-Verse',
    releaseYear: 2018,
    genres: ['Animation', 'Action', 'Adventure'],
    creators: ['Bob Persichetti', 'Peter Ramsey', 'Rodney Rothman'],
    myRating: 9.8,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'What Up Danger leap of faith. Redefined visual animation grammar and storytelling for the 21st century.',
  },
  {
    id: 'movie-spider-man-across-the-spider-verse',
    slug: 'spider-man-across-the-spider-verse',
    type: 'movie',
    title: 'Spider-Man: Across the Spider-Verse',
    releaseYear: 2023,
    genres: ['Animation', 'Action', 'Adventure'],
    creators: ['Joaquim Dos Santos', 'Kemp Powers', 'Justin K. Thompson'],
    myRating: 9.8,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'A dizzying symphonic tour de force across Mumbattan, Nueva York, and Earth-42. Daniel Pemberton score is god-tier.',
  },

  // ── DC Universe (DCEU, DCU, Batverse & Elseworlds) ──────────────────────
  // DCEU Complete
  {
    id: 'movie-man-of-steel',
    slug: 'man-of-steel',
    type: 'movie',
    title: 'Man of Steel',
    releaseYear: 2013,
    genres: ['Action', 'Sci-Fi', 'Superhero'],
    creators: ['Zack Snyder'],
    myRating: 8.9,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'First flight scene scored by Hans Zimmer Flight is pure cinematic elevation. Grounded visceral Kryptonian combat.',
  },
  {
    id: 'movie-batman-v-superman-dawn-of-justice',
    slug: 'batman-v-superman-dawn-of-justice',
    type: 'movie',
    title: 'Batman v Superman: Dawn of Justice',
    releaseYear: 2016,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    creators: ['Zack Snyder'],
    myRating: 9.2,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'The Ultimate Edition is an operatic mythic tragedy. Ben Affleck warehouse brawl is the greatest live-action Batman combat ever filmed.',
  },
  {
    id: 'movie-suicide-squad',
    slug: 'suicide-squad',
    type: 'movie',
    title: 'Suicide Squad',
    releaseYear: 2016,
    genres: ['Action', 'Adventure', 'Fantasy'],
    creators: ['David Ayer'],
    myRating: 8.1,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Margot Robbie star-making performance as Harley Quinn and Will Smith Deadshot alley shooting demo.',
  },
  {
    id: 'movie-wonder-woman',
    slug: 'wonder-woman',
    type: 'movie',
    title: 'Wonder Woman',
    releaseYear: 2017,
    genres: ['Action', 'Adventure', 'Fantasy'],
    creators: ['Patty Jenkins'],
    myRating: 9.3,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'No Man Land trench charge to Rupert Gregson-Williams score is one of the most triumphant superhero moments on screen.',
  },
  {
    id: 'movie-justice-league-2017',
    slug: 'justice-league-2017',
    type: 'movie',
    title: 'Justice League',
    releaseYear: 2017,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    creators: ['Zack Snyder', 'Joss Whedon'],
    myRating: 7.9,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'The historical 2017 theatrical assembly that paved the way for the fan movement to restore the director vision.',
  },
  {
    id: 'movie-zack-snyders-justice-league',
    slug: 'zack-snyders-justice-league',
    type: 'movie',
    title: "Zack Snyder's Justice League",
    releaseYear: 2021,
    genres: ['Action', 'Adventure', 'Fantasy'],
    creators: ['Zack Snyder'],
    myRating: 9.5,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'The definitive 4-hour mythic opera. The Flash rewinding time scene and Junkie XL score are transcendent.',
  },
  {
    id: 'movie-aquaman',
    slug: 'aquaman',
    type: 'movie',
    title: 'Aquaman',
    releaseYear: 2018,
    genres: ['Action', 'Adventure', 'Fantasy'],
    creators: ['James Wan'],
    myRating: 9.0,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'James Wan unbridled visual imagination. The flare descent into The Trench and the Ring of Fire duel were visual feasts.',
  },
  {
    id: 'movie-shazam',
    slug: 'shazam',
    type: 'movie',
    title: 'Shazam!',
    releaseYear: 2019,
    genres: ['Action', 'Comedy', 'Fantasy'],
    creators: ['David F. Sandberg'],
    myRating: 8.8,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Big meets Superman. Zachary Levi brings infectious childlike wonder discovering his lightning powers.',
  },
  {
    id: 'movie-birds-of-prey',
    slug: 'birds-of-prey',
    type: 'movie',
    title: 'Birds of Prey',
    releaseYear: 2020,
    genres: ['Action', 'Comedy', 'Crime'],
    creators: ['Cathy Yan'],
    myRating: 8.7,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Colorful R-rated roller-skate fight choreography by 87eleven and Ewan McGregor eccentric Black Mask.',
  },
  {
    id: 'movie-wonder-woman-1984',
    slug: 'wonder-woman-1984',
    type: 'movie',
    title: 'Wonder Woman 1984',
    releaseYear: 2020,
    genres: ['Action', 'Adventure', 'Fantasy'],
    creators: ['Patty Jenkins'],
    myRating: 8.1,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      '80s technicolor aesthetic with Pedro Pascal unhinged Maxwell Lord and the Golden Eagle armor flight.',
  },
  {
    id: 'movie-the-suicide-squad-2021',
    slug: 'the-suicide-squad-2021',
    type: 'movie',
    title: 'The Suicide Squad',
    releaseYear: 2021,
    genres: ['Action', 'Adventure', 'Comedy'],
    creators: ['James Gunn'],
    myRating: 9.4,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'James Gunn bloody, anarchic masterpiece. Starro the Conqueror, Bloodsport versus Peacemaker, and King Shark.',
  },
  {
    id: 'movie-black-adam',
    slug: 'black-adam',
    type: 'movie',
    title: 'Black Adam',
    releaseYear: 2022,
    genres: ['Action', 'Fantasy', 'Sci-Fi'],
    creators: ['Jaume Collet-Serra'],
    myRating: 8.3,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Dwayne Johnson brutal ancient antihero and Pierce Brosnan scene-stealing gravitas as Doctor Fate.',
  },
  {
    id: 'movie-shazam-fury-of-the-gods',
    slug: 'shazam-fury-of-the-gods',
    type: 'movie',
    title: 'Shazam! Fury of the Gods',
    releaseYear: 2023,
    genres: ['Action', 'Adventure', 'Comedy'],
    creators: ['David F. Sandberg'],
    myRating: 8.2,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Daughters of Atlas mythical beasts invading Philadelphia with fun Shazamily team dynamics.',
  },
  {
    id: 'movie-the-flash',
    slug: 'the-flash',
    type: 'movie',
    title: 'The Flash',
    releaseYear: 2023,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    creators: ['Andy Muschietti'],
    myRating: 8.8,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Michael Keaton return as Batman in the Batwing and the emotional heart between Barry and his mother in the grocery aisle.',
  },
  {
    id: 'movie-blue-beetle',
    slug: 'blue-beetle',
    type: 'movie',
    title: 'Blue Beetle',
    releaseYear: 2023,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    creators: ['Ángel Manuel Soto'],
    myRating: 8.7,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Warm Reyes family heart, buster-sword armor weapons, and authentic Mexican-American representation.',
  },
  {
    id: 'movie-aquaman-and-the-lost-kingdom',
    slug: 'aquaman-and-the-lost-kingdom',
    type: 'movie',
    title: 'Aquaman and the Lost Kingdom',
    releaseYear: 2023,
    genres: ['Action', 'Adventure', 'Fantasy'],
    creators: ['James Wan'],
    myRating: 8.4,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Arthur and Orm buddy comedy adventure across the volcanic Necrus kingdom closing out the DCEU era.',
  },

  // James Gunn New DCU & Elseworlds
  {
    id: 'movie-superman-2025',
    slug: 'superman-2025',
    type: 'movie',
    title: 'Superman',
    releaseYear: 2025,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    creators: ['James Gunn', 'DC Studios'],
    myRating: 9.3,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'The dawn of James Gunn DCU. David Corenswet embodying classic truth, justice, and humanity with Krypto.',
  },
  {
    id: 'movie-supergirl-woman-of-tomorrow',
    slug: 'supergirl-woman-of-tomorrow',
    type: 'movie',
    title: 'Supergirl: Woman of Tomorrow',
    releaseYear: 2026,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    creators: ['Craig Gillespie', 'DC Studios'],
    myRating: 9.1,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Milly Alcock as a battle-hardened Kara Zor-El traversing cosmic realms in Tom King adaptation.',
  },
  {
    id: 'movie-the-batman',
    slug: 'the-batman',
    type: 'movie',
    title: 'The Batman',
    releaseYear: 2022,
    genres: ['Action', 'Crime', 'Drama', 'Mystery'],
    creators: ['Matt Reeves'],
    myRating: 9.5,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Gritty noir detective masterpiece. Greig Fraser rain-soaked cinematography and Michael Giacchino score create an unmatched atmospheric Gotham.',
  },
  {
    id: 'movie-the-batman-part-ii',
    slug: 'the-batman-part-ii',
    type: 'movie',
    title: 'The Batman Part II',
    releaseYear: 2026,
    genres: ['Action', 'Crime', 'Drama'],
    creators: ['Matt Reeves'],
    myRating: 9.4,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Robert Pattinson returns deeper into the corrupt underbelly of flooded Gotham in Matt Reeves expanding Batverse.',
  },
  {
    id: 'movie-joker',
    slug: 'joker',
    type: 'movie',
    title: 'Joker',
    releaseYear: 2019,
    genres: ['Crime', 'Drama', 'Thriller'],
    creators: ['Todd Phillips'],
    myRating: 9.4,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Joaquin Phoenix transformative Academy Award performance. A haunting psychological descent scored by Hildur Guðnadóttir cello.',
  },
  {
    id: 'movie-joker-folie-a-deux',
    slug: 'joker-folie-a-deux',
    type: 'movie',
    title: 'Joker: Folie à Deux',
    releaseYear: 2024,
    genres: ['Crime', 'Drama', 'Musical'],
    creators: ['Todd Phillips'],
    myRating: 8.6,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Joaquin Phoenix and Lady Gaga Harley Quinn in a surreal psychological courtroom melodrama exploring shared madness.',
  },
  {
    id: 'movie-watchmen',
    slug: 'watchmen',
    type: 'movie',
    title: 'Watchmen',
    releaseYear: 2009,
    genres: ['Action', 'Drama', 'Mystery', 'Sci-Fi'],
    creators: ['Zack Snyder'],
    myRating: 9.4,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'The opening Bob Dylan Times They Are A-Changin montage is the single greatest credit sequence in comic book history.',
  },
  {
    id: 'movie-constantine',
    slug: 'constantine',
    type: 'movie',
    title: 'Constantine',
    releaseYear: 2005,
    genres: ['Fantasy', 'Horror', 'Mystery'],
    creators: ['Francis Lawrence'],
    myRating: 9.1,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Keanu Reeves chain-smoking occult exorcist and Peter Stormare iconic portrayal of Lucifer barefoot in white.',
  },

  // ── Indian Sagas, Duologies & Trilogies ──────────────────────────────────
  {
    id: 'movie-baahubali-the-beginning',
    slug: 'baahubali-the-beginning',
    type: 'movie',
    title: 'Baahubali: The Beginning',
    releaseYear: 2015,
    genres: ['Action', 'Drama', 'Epic', 'War'],
    creators: ['S.S. Rajamouli'],
    myRating: 9.5,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'The giant waterfall climb, the avalanche sequence, and the colossal battle of Mahishmati. S.S. Rajamouli redefined Indian cinematic scale forever.',
  },
  {
    id: 'movie-baahubali-2-the-conclusion',
    slug: 'baahubali-2-the-conclusion',
    type: 'movie',
    title: 'Baahubali 2: The Conclusion',
    releaseYear: 2017,
    genres: ['Action', 'Drama', 'Epic', 'War'],
    creators: ['S.S. Rajamouli'],
    myRating: 9.6,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'The coronation oath scene, the swan boat voyage, and solving the decade-defining question: Why Kattappa killed Baahubali.',
  },
  {
    id: 'movie-kgf-chapter-1',
    slug: 'kgf-chapter-1',
    type: 'movie',
    title: 'K.G.F: Chapter 1',
    releaseYear: 2018,
    genres: ['Action', 'Crime', 'Drama'],
    creators: ['Prashanth Neel'],
    myRating: 9.4,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Rocky Bhai rise from Bombay slums into Kolar Gold Fields. Electric editing cuts, world-class BGM, and non-linear mass heroism.',
  },
  {
    id: 'movie-kgf-chapter-2',
    slug: 'kgf-chapter-2',
    type: 'movie',
    title: 'K.G.F: Chapter 2',
    releaseYear: 2022,
    genres: ['Action', 'Crime', 'Drama'],
    creators: ['Prashanth Neel'],
    myRating: 9.5,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Kalashnikov police station scene is the pinnacle of elevation cinema. Uncompromising scale, swagger, and tragedy.',
  },
  {
    id: 'movie-kantara',
    slug: 'kantara',
    type: 'movie',
    title: 'Kantara',
    releaseYear: 2022,
    genres: ['Action', 'Drama', 'Folklore', 'Thriller'],
    creators: ['Rishab Shetty'],
    myRating: 9.6,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'The final 20 minutes of Bhoota Kola spirit possession and Varaha Roopam climax is pure divine goosebumps. Raw indigenous storytelling at its zenith.',
  },
  {
    id: 'movie-kantara-chapter-1',
    slug: 'kantara-chapter-1',
    type: 'movie',
    title: 'Kantara: Chapter 1',
    releaseYear: 2025,
    genres: ['Action', 'Drama', 'Folklore', 'Mythology'],
    creators: ['Rishab Shetty'],
    myRating: 9.5,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'The mythic prequel exploring the reign of the Kadamba dynasty and the origins of the sacred forest spirit deity.',
  },
  {
    id: 'movie-dhurandhar',
    slug: 'dhurandhar',
    type: 'movie',
    title: 'Dhurandhar',
    releaseYear: 2025,
    genres: ['Action', 'Crime', 'Espionage', 'Thriller'],
    creators: ['Aditya Dhar'],
    myRating: 9.3,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Ranveer Singh undercover as Jaskirat Singh Rangi infiltrating Karachi Lyari terror networks in Aditya Dhar explosive espionage epic.',
  },
  {
    id: 'movie-dhurandhar-the-revenge',
    slug: 'dhurandhar-the-revenge',
    type: 'movie',
    title: 'Dhurandhar: The Revenge',
    releaseYear: 2026,
    genres: ['Action', 'Espionage', 'Thriller'],
    creators: ['Aditya Dhar'],
    myRating: 9.4,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'The high-octane second chapter concluding the geopolitical cross-border retribution arc with Sanjay Dutt and Akshaye Khanna.',
  },
  {
    id: 'movie-jolly-llb',
    slug: 'jolly-llb',
    type: 'movie',
    title: 'Jolly LLB',
    releaseYear: 2013,
    genres: ['Comedy', 'Drama'],
    creators: ['Subhash Kapoor'],
    myRating: 9.1,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Arshad Warsi underdog small-town lawyer taking down high-profile advocate Boman Irani before Saurabh Shukla unforgettable Judge Tripathi.',
  },
  {
    id: 'movie-jolly-llb-2',
    slug: 'jolly-llb-2',
    type: 'movie',
    title: 'Jolly LLB 2',
    releaseYear: 2017,
    genres: ['Comedy', 'Drama', 'Crime'],
    creators: ['Subhash Kapoor'],
    myRating: 9.0,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Akshay Kumar in Lucknow fighting a fake encounter case with Annu Kapoor fierce opposition and powerful courtroom monologues.',
  },
  {
    id: 'movie-jolly-llb-3',
    slug: 'jolly-llb-3',
    type: 'movie',
    title: 'Jolly LLB 3',
    releaseYear: 2025,
    genres: ['Comedy', 'Drama'],
    creators: ['Subhash Kapoor'],
    myRating: 9.2,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'The long-awaited courtroom showdown between original Jolly Arshad Warsi and Jolly 2 Akshay Kumar with Judge Saurabh Shukla presiding.',
  },
  {
    id: 'movie-munjya',
    slug: 'munjya',
    type: 'movie',
    title: 'Munjya',
    releaseYear: 2024,
    genres: ['Comedy', 'Horror', 'Folklore'],
    creators: ['Aditya Sarpotdar', 'Maddock Films'],
    myRating: 8.8,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Great blend of Konkan folklore, sharp comedy, and genuine horror VFX in the Maddock supernatural universe.',
  },

  // ── Animation, Disney, Pop Culture & Standalones ────────────────────────
  {
    id: 'movie-free-guy',
    slug: 'free-guy',
    type: 'movie',
    title: 'Free Guy',
    releaseYear: 2021,
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    creators: ['Shawn Levy'],
    myRating: 9.1,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Ryan Reynolds NPC bank teller breaking free of his video game programming. The Captain America shield and lightsaber cameos were joyous.',
  },
  {
    id: 'movie-tangled',
    slug: 'tangled',
    type: 'movie',
    title: 'Tangled',
    releaseYear: 2010,
    genres: ['Animation', 'Comedy', 'Fantasy', 'Musical'],
    creators: ['Nathan Greno', 'Byron Howard', 'Walt Disney'],
    myRating: 9.3,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'I See the Light floating lantern sequence is one of Disney most enchanting visual achievements. Maximus the horse stole every scene.',
  },
  {
    id: 'movie-zootopia',
    slug: 'zootopia',
    type: 'movie',
    title: 'Zootopia',
    releaseYear: 2016,
    genres: ['Animation', 'Adventure', 'Comedy'],
    creators: ['Byron Howard', 'Rich Moore', 'Walt Disney'],
    myRating: 9.4,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Sharp social commentary disguised as an animal buddy-cop noir. Flash the sloth at the DMV is comedy perfection.',
  },
  {
    id: 'movie-zootopia-2',
    slug: 'zootopia-2',
    type: 'movie',
    title: 'Zootopia 2',
    releaseYear: 2025,
    genres: ['Animation', 'Adventure', 'Comedy'],
    creators: ['Byron Howard', 'Walt Disney'],
    myRating: 9.2,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Judy Hopps and Nick Wilde investigating new reptile and semi-aquatic districts in the sprawling metropolis.',
  },
  {
    id: 'movie-the-lion-king-1994',
    slug: 'the-lion-king',
    type: 'movie',
    title: 'The Lion King',
    releaseYear: 1994,
    genres: ['Animation', 'Adventure', 'Drama'],
    creators: ['Roger Allers', 'Rob Minkoff', 'Walt Disney'],
    myRating: 9.7,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Circle of Life sunrise opening on Pride Rock, Hans Zimmer African choral arrangements, and James Earl Jones Mufasa.',
  },
  {
    id: 'movie-mufasa-the-lion-king',
    slug: 'mufasa-the-lion-king',
    type: 'movie',
    title: 'Mufasa: The Lion King',
    releaseYear: 2024,
    genres: ['Adventure', 'Drama', 'Family'],
    creators: ['Barry Jenkins', 'Walt Disney'],
    myRating: 8.9,
    watchStatus: 'completed',
    tier: 'recommended',
    personalReview:
      'Barry Jenkins lyrical visual direction telling the untold brotherhood origin between orphaned Mufasa and Taka.',
  },
  {
    id: 'movie-pokemon-the-movie-2000',
    slug: 'pokemon-the-movie-2000',
    type: 'movie',
    title: 'Pokémon: The Movie 2000',
    releaseYear: 1999,
    genres: ['Animation', 'Action', 'Adventure', 'Fantasy'],
    creators: ['Kunihiko Yuyama'],
    myRating: 9.0,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Lugia rising from the whirlpool with the legendary bird trio Zapdos, Articuno, and Moltres in nostalgic childhood glory.',
  },
  {
    id: 'movie-the-social-network',
    slug: 'the-social-network',
    type: 'movie',
    title: 'The Social Network',
    releaseYear: 2010,
    genres: ['Biography', 'Drama'],
    creators: ['David Fincher', 'Aaron Sorkin'],
    myRating: 9.6,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Sorkin rapid-fire dialogue, Fincher surgical pacing, and Trent Reznor Oscar-winning dark ambient electronic score.',
  },
  {
    id: 'movie-whiplash',
    slug: 'whiplash',
    type: 'movie',
    title: 'Whiplash',
    releaseYear: 2014,
    genres: ['Drama', 'Music'],
    creators: ['Damien Chazelle'],
    myRating: 9.7,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Not quite my tempo. J.K. Simmons Fletcher psychological warfare and Miles Teller Caravan finale drum solo.',
  },
  {
    id: 'movie-blade-runner-2049',
    slug: 'blade-runner-2049',
    type: 'movie',
    title: 'Blade Runner 2049',
    releaseYear: 2017,
    genres: ['Drama', 'Mystery', 'Sci-Fi'],
    creators: ['Denis Villeneuve'],
    myRating: 9.7,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Roger Deakins orange Las Vegas haze, holographic Joi, and Officer K quiet dying snowfall realization of humanity.',
  },

  // ── Web Series ──────────────────────────────────────────────────────────
  {
    id: 'series-monarch-legacy-of-monsters',
    slug: 'monarch-legacy-of-monsters',
    type: 'tv_series',
    title: 'Monarch: Legacy of Monsters',
    releaseYear: 2023,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    creators: ['Chris Black', 'Matt Fraction', 'Legendary Television'],
    myRating: 9.3,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Kurt Russell and Wyatt Russell sharing the Lee Shaw character across dual timelines. Ground-level human drama anchored by terrifying Titan scale.',
  },
  {
    id: 'series-house-of-the-dragon',
    slug: 'house-of-the-dragon',
    type: 'tv_series',
    title: 'House of the Dragon',
    releaseYear: 2022,
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy'],
    creators: ['Ryan J. Condal', 'George R.R. Martin', 'HBO'],
    myRating: 9.5,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Paddy Considine King Viserys walk to the Iron Throne and the brutal Dance of the Dragons Targaryen civil war.',
  },
  {
    id: 'series-game-of-thrones',
    slug: 'game-of-thrones',
    type: 'tv_series',
    title: 'Game of Thrones',
    releaseYear: 2011,
    genres: ['Fantasy', 'Drama', 'Political Intrigue'],
    creators: ['David Benioff', 'D.B. Weiss', 'George R.R. Martin'],
    myRating: 9.7,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Seasons 1-6 are the absolute peak of television history. The Red Wedding, Hardhome, and Battle of the Bastards are unmatched.',
  },
  {
    id: 'series-gram-chikitsalaya',
    slug: 'gram-chikitsalaya',
    type: 'tv_series',
    title: 'Gram Chikitsalaya',
    searchQuery: 'Gram Chikitsalay',
    releaseYear: 2025,
    genres: ['Comedy', 'Drama', 'Slice of Life'],
    creators: ['The Viral Fever (TVF)', 'Deepak Kumar Mishra', 'Arunabh Kumar'],
    myRating: 9.4,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Dr. Prabhat Sinha navigating rural healthcare challenges, quack rivalry, and heartfelt village community dynamics in classic TVF perfection.',
  },
  {
    id: 'series-panchayat',
    slug: 'panchayat',
    type: 'tv_series',
    title: 'Panchayat',
    releaseYear: 2020,
    genres: ['Comedy', 'Drama', 'Slice of Life'],
    creators: ['The Viral Fever (TVF)', 'Deepak Kumar Mishra'],
    myRating: 9.8,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Phulera is pure warmth and authentic Indian rural reality. Jitendra Kumar, Neena Gupta, Raghubir Yadav, and Chandan Roy give heartfelt performances.',
  },
  {
    id: 'series-loki',
    slug: 'loki',
    type: 'tv_series',
    title: 'Loki',
    releaseYear: 2021,
    genres: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
    creators: ['Michael Waldron', 'Marvel Studios'],
    myRating: 9.6,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Tom Hiddleston God of Stories glorious purpose. Natalie Holt theremin score and the tragic temporal loom sacrifice.',
  },
  {
    id: 'series-what-if',
    slug: 'what-if',
    type: 'tv_series',
    title: 'What If...?',
    releaseYear: 2021,
    genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    creators: ['A.C. Bradley', 'Marvel Studios'],
    myRating: 9.1,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Jeffrey Wright The Watcher guiding us through tragic alternate realities, especially the heart-wrenching Doctor Strange Supreme episode.',
  },
  {
    id: 'series-light-shop',
    slug: 'light-shop',
    type: 'tv_series',
    title: 'Light Shop',
    releaseYear: 2024,
    genres: ['Drama', 'Fantasy', 'Mystery'],
    creators: ['Kang Full', 'Disney+'],
    myRating: 9.3,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Kang Full deeply moving supernatural mystery where a luminescent lamp shop stands at the crossroads between life and the afterlife.',
  },
  {
    id: 'series-money-heist',
    slug: 'money-heist',
    type: 'tv_series',
    title: 'Money Heist (La Casa de Papel)',
    releaseYear: 2017,
    genres: ['Crime', 'Drama', 'Thriller', 'Heist'],
    creators: ['Álex Pina'],
    myRating: 9.4,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'The Professor calculated chess match against inspector Murillo and Sierra. Bella Ciao rebellion anthem and brilliant psychological tension.',
  },
  {
    id: 'series-berlin',
    slug: 'berlin',
    type: 'tv_series',
    title: 'Berlin',
    releaseYear: 2023,
    genres: ['Action', 'Crime', 'Drama', 'Romance'],
    creators: ['Álex Pina', 'Esther Martínez Lobato', 'Netflix'],
    myRating: 9.0,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Pedro Alonso flamboyant hedonism, romantic obsession, and a slick 44 million euro jewelry heist across subterranean Paris.',
  },
  {
    id: 'series-mirzapur',
    slug: 'mirzapur',
    type: 'tv_series',
    title: 'Mirzapur',
    releaseYear: 2018,
    genres: ['Action', 'Crime', 'Thriller'],
    creators: ['Karan Anshuman', 'Puneet Krishna'],
    myRating: 9.3,
    watchStatus: 'completed',
    tier: 'favorite',
    personalReview:
      'Pankaj Tripathi as Akhandanand Tripathi (Kaleen Bhaiya) delivers iconic deadpan dominance. Raw power politics of Purvanchal.',
  },
  {
    id: 'series-mr-robot',
    slug: 'mr-robot',
    type: 'tv_series',
    title: 'Mr. Robot',
    releaseYear: 2015,
    genres: ['Crime', 'Drama', 'Thriller'],
    creators: ['Sam Esmail'],
    myRating: 9.8,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Rami Malek masterclass in dissociative identity and cyber-anarchy. Season 4 Episode 7 (Proxy Authentication Required) is peak television.',
  },
  {
    id: 'series-silicon-valley',
    slug: 'silicon-valley',
    type: 'tv_series',
    title: 'Silicon Valley',
    releaseYear: 2014,
    genres: ['Comedy'],
    creators: ['Mike Judge', 'John Altschuler', 'Dave Krinsky'],
    myRating: 9.5,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'The most ruthlessly accurate satire of tech startup culture ever created. Middle-out compression algorithm presentation was comedy gold.',
  },
  {
    id: 'series-severance',
    slug: 'severance',
    type: 'tv_series',
    title: 'Severance',
    releaseYear: 2022,
    genres: ['Drama', 'Mystery', 'Sci-Fi', 'Thriller'],
    creators: ['Dan Erickson', 'Ben Stiller'],
    myRating: 9.7,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Lumon Industries surgically bifurcated minds. The Music Dance Experience, defiant waffle party, and the breathlessly tense season 1 finale.',
  },
  {
    id: 'series-dark',
    slug: 'dark',
    type: 'tv_series',
    title: 'Dark',
    releaseYear: 2017,
    genres: ['Crime', 'Drama', 'Mystery', 'Sci-Fi'],
    creators: ['Baran bo Odar', 'Jantje Friese'],
    myRating: 9.9,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'The pinnacle of complex deterministic time travel. Winden nuclear town, the ouroboros knot, and the haunting realization that everything is connected.',
  },
  {
    id: 'series-succession',
    slug: 'succession',
    type: 'tv_series',
    title: 'Succession',
    releaseYear: 2018,
    genres: ['Drama'],
    creators: ['Jesse Armstrong'],
    myRating: 9.8,
    watchStatus: 'completed',
    tier: 'masterpiece',
    personalReview:
      'Shakespearean corporate tragedy with venomous wit. Brian Cox Logan Roy shadow looms over Kendall, Shiv, and Roman generational trauma.',
  },
];

async function resolveAndSeed() {
  console.log(
    `🎬 Total media items to resolve & seed: ${ALL_MEDIA_ENTRIES.length}`,
  );
  const resolvedList: Array<MediaSeedItem & { posterUrl: string }> = [];

  for (const item of ALL_MEDIA_ENTRIES) {
    const searchType = item.type === 'movie' ? 'movie' : 'tv';
    const query = encodeURIComponent(item.searchQuery || item.title);
    const searchUrl = `https://www.themoviedb.org/search/${searchType}?query=${query}`;

    let posterUrl = '';
    try {
      const res = await fetch(searchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const html = await res.text();
      const match = html.match(new RegExp(`/${searchType}/(\\d+)`));

      if (match) {
        const pageUrl = `https://www.themoviedb.org/${searchType}/${match[1]}`;
        const pageRes = await fetch(pageUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const pageHtml = await pageRes.text();
        const ogMatch = pageHtml.match(
          /<meta property="og:image" content="([^"]+)"/,
        );
        if (ogMatch) {
          const candidate = ogMatch[1].replace(
            'https://media.themoviedb.org',
            'https://image.tmdb.org',
          );
          const check = await fetch(candidate, { method: 'HEAD' });
          if (check.status === 200) {
            posterUrl = candidate;
          }
        }
      }
    } catch (e: any) {
      console.warn(`Fetch error for ${item.title}:`, e.message);
    }

    if (!posterUrl) {
      console.error(`❌ FAILED TO FIND POSTER FOR: ${item.title}`);
    } else {
      console.log(
        `✅ [200 OK] ${item.type} | ${item.title} (${item.releaseYear}) -> ${posterUrl}`,
      );
      resolvedList.push({ ...item, posterUrl });
    }
  }

  console.log(
    `\n🎉 Resolved ${resolvedList.length} of ${ALL_MEDIA_ENTRIES.length} entries.`,
  );

  // Upsert to DB
  const now = Date.now();
  for (const item of resolvedList) {
    await db
      .insert(schema.mediaEntry)
      .values({
        id: item.id,
        slug: item.slug,
        type: item.type,
        externalProvider: 'tmdb',
        externalId: null,
        title: item.title,
        releaseYear: item.releaseYear,
        genresJson: JSON.stringify(item.genres),
        creatorsJson: JSON.stringify(item.creators),
        posterUrl: item.posterUrl,
        backdropUrl: null,
        myRating: item.myRating,
        watchStatus: item.watchStatus,
        consumedAt: null,
        personalReview: item.personalReview,
        favoriteCharactersJson: JSON.stringify([]),
        favoriteScenesJson: JSON.stringify([]),
        quotesJson: JSON.stringify([]),
        tier: item.tier,
        galleryId: null,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: schema.mediaEntry.id,
        set: {
          title: item.title,
          type: item.type,
          releaseYear: item.releaseYear,
          genresJson: JSON.stringify(item.genres),
          creatorsJson: JSON.stringify(item.creators),
          posterUrl: item.posterUrl,
          myRating: item.myRating,
          personalReview: item.personalReview,
          tier: item.tier,
          updatedAt: now,
        },
      });
  }
  console.log('✅ Database successfully synced!');

  // Generate updated seed-hobbies.ts
  const seedHobbiesContent = `import { db, schema } from './index';

export async function seedHobbies() {
  console.log('🎬 Seeding full verified catalog of movies and web series (${
    resolvedList.length
  } entries)...');
  const now = Date.now();

  const entries = ${JSON.stringify(
    resolvedList.map((m) => ({
      id: m.id,
      slug: m.slug,
      type: m.type,
      title: m.title,
      releaseYear: m.releaseYear,
      genresJson: JSON.stringify(m.genres),
      creatorsJson: JSON.stringify(m.creators),
      posterUrl: m.posterUrl,
      myRating: m.myRating,
      watchStatus: m.watchStatus,
      tier: m.tier,
      personalReview: m.personalReview,
    })),
    null,
    2,
  )};

  for (const item of entries) {
    await db
      .insert(schema.mediaEntry)
      .values({
        id: item.id,
        slug: item.slug,
        type: item.type,
        externalProvider: 'tmdb',
        externalId: null,
        title: item.title,
        releaseYear: item.releaseYear,
        genresJson: item.genresJson,
        creatorsJson: item.creatorsJson,
        posterUrl: item.posterUrl,
        backdropUrl: null,
        myRating: item.myRating,
        watchStatus: item.watchStatus,
        consumedAt: null,
        personalReview: item.personalReview,
        favoriteCharactersJson: JSON.stringify([]),
        favoriteScenesJson: JSON.stringify([]),
        quotesJson: JSON.stringify([]),
        tier: item.tier,
        galleryId: null,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: schema.mediaEntry.id,
        set: {
          title: item.title,
          type: item.type,
          releaseYear: item.releaseYear,
          genresJson: item.genresJson,
          creatorsJson: item.creatorsJson,
          posterUrl: item.posterUrl,
          myRating: item.myRating,
          personalReview: item.personalReview,
          tier: item.tier,
          updatedAt: now,
        },
      });
  }

  console.log(\`✅ Successfully seeded \${entries.length} movies and webseries!\`);
}
`;

  fs.writeFileSync(
    path.resolve(process.cwd(), 'src/platform/db/seed-hobbies.ts'),
    seedHobbiesContent,
  );
  console.log(
    '✅ Updated src/platform/db/seed-hobbies.ts with static snapshot!',
  );
}

resolveAndSeed().catch((err) => {
  console.error('Fatal error in sync script:', err);
  process.exit(1);
});
