import { db, schema } from './index';

export async function seedHobbies() {
  console.log('🎬 Seeding movies and webseries (Marvel, DC, Kantara, KGF, Munjya, Money Heist, Panchayat, Game of Thrones, Mirzapur)...');
  const now = Date.now();

  const entries = [
    // Marvel Movies
    {
      id: 'movie-iron-man',
      slug: 'iron-man',
      type: 'movie',
      title: 'Iron Man',
      releaseYear: 2008,
      genresJson: JSON.stringify(['Action', 'Sci-Fi', 'Superhero']),
      creatorsJson: JSON.stringify(['Jon Favreau', 'Marvel Studios']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
      myRating: 9.2,
      watchStatus: 'completed',
      tier: 'favorite',
      personalReview: 'The birth of the MCU. Robert Downey Jr. is electrifying as Tony Stark in his cave forging the Mark I.'
    },
    {
      id: 'movie-the-avengers',
      slug: 'the-avengers',
      type: 'movie',
      title: 'The Avengers',
      releaseYear: 2012,
      genresJson: JSON.stringify(['Action', 'Sci-Fi', 'Superhero']),
      creatorsJson: JSON.stringify(['Joss Whedon', 'Marvel Studios']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
      myRating: 9.3,
      watchStatus: 'completed',
      tier: 'masterpiece',
      personalReview: 'The circular panning shot in New York with all six original Avengers assembled is timeless cinema history.'
    },
    {
      id: 'movie-captain-america-civil-war',
      slug: 'captain-america-civil-war',
      type: 'movie',
      title: 'Captain America: Civil War',
      releaseYear: 2016,
      genresJson: JSON.stringify(['Action', 'Sci-Fi', 'Thriller']),
      creatorsJson: JSON.stringify(['Anthony Russo', 'Joe Russo', 'Marvel Studios']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/rAGKPZk67x50pPjVfP0Uq6Z21nC.jpg',
      myRating: 9.4,
      watchStatus: 'completed',
      tier: 'favorite',
      personalReview: 'Incredible ideological clash between Steve and Tony with peak airport choreography and emotional stakes.'
    },
    {
      id: 'movie-thor-ragnarok',
      slug: 'thor-ragnarok',
      type: 'movie',
      title: 'Thor: Ragnarok',
      releaseYear: 2017,
      genresJson: JSON.stringify(['Action', 'Comedy', 'Sci-Fi']),
      creatorsJson: JSON.stringify(['Taika Waititi', 'Marvel Studios']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg',
      myRating: 9.1,
      watchStatus: 'completed',
      tier: 'favorite',
      personalReview: 'Immigrant Song blasting on the rainbow bridge while Thor channels lightning without Mjolnir.'
    },
    {
      id: 'movie-avengers-infinity-war',
      slug: 'avengers-infinity-war',
      type: 'movie',
      title: 'Avengers: Infinity War',
      releaseYear: 2018,
      genresJson: JSON.stringify(['Action', 'Sci-Fi', 'Adventure']),
      creatorsJson: JSON.stringify(['Anthony Russo', 'Joe Russo', 'Marvel Studios']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
      myRating: 9.8,
      watchStatus: 'completed',
      tier: 'masterpiece',
      personalReview: 'A masterclass in pacing. Thanos is the protagonist of this relentless cosmic heist film. The ending silence was unforgettable.'
    },
    {
      id: 'movie-avengers-endgame',
      slug: 'avengers-endgame',
      type: 'movie',
      title: 'Avengers: Endgame',
      releaseYear: 2019,
      genresJson: JSON.stringify(['Action', 'Sci-Fi', 'Drama']),
      creatorsJson: JSON.stringify(['Anthony Russo', 'Joe Russo', 'Marvel Studios']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      myRating: 9.7,
      watchStatus: 'completed',
      tier: 'masterpiece',
      personalReview: 'Portals scene and Cap lifting Mjolnir. A once-in-a-generation theatrical spectacle closing 11 years of storytelling.'
    },
    {
      id: 'movie-spider-man-no-way-home',
      slug: 'spider-man-no-way-home',
      type: 'movie',
      title: 'Spider-Man: No Way Home',
      releaseYear: 2021,
      genresJson: JSON.stringify(['Action', 'Adventure', 'Fantasy']),
      creatorsJson: JSON.stringify(['Jon Watts', 'Marvel Studios', 'Sony']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
      myRating: 9.3,
      watchStatus: 'completed',
      tier: 'favorite',
      personalReview: 'Three generations of Peter Parkers sharing the screen. Cathartic redemption arc for Andrew Garfield and Toby Maguire.'
    },

    // DC Movies
    {
      id: 'movie-the-dark-knight',
      slug: 'the-dark-knight',
      type: 'movie',
      title: 'The Dark Knight',
      releaseYear: 2008,
      genresJson: JSON.stringify(['Action', 'Crime', 'Drama', 'Thriller']),
      creatorsJson: JSON.stringify(['Christopher Nolan']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      myRating: 9.9,
      watchStatus: 'completed',
      tier: 'masterpiece',
      personalReview: 'The gold standard of cinema. Heath Ledger Joker delivered one of the greatest acting performances in human history.'
    },
    {
      id: 'movie-the-batman',
      slug: 'the-batman',
      type: 'movie',
      title: 'The Batman',
      releaseYear: 2022,
      genresJson: JSON.stringify(['Action', 'Crime', 'Mystery']),
      creatorsJson: JSON.stringify(['Matt Reeves']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
      myRating: 9.3,
      watchStatus: 'completed',
      tier: 'favorite',
      personalReview: 'Gritty noir detective masterpiece. Greig Fraser cinematography and Michael Giacchino score create an unmatched atmospheric Gotham.'
    },
    {
      id: 'movie-man-of-steel',
      slug: 'man-of-steel',
      type: 'movie',
      title: 'Man of Steel',
      releaseYear: 2013,
      genresJson: JSON.stringify(['Action', 'Sci-Fi', 'Superhero']),
      creatorsJson: JSON.stringify(['Zack Snyder']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/7rIPjn5el82OKanu59J9jvdUWMC.jpg',
      myRating: 8.9,
      watchStatus: 'completed',
      tier: 'favorite',
      personalReview: 'First flight scene scored by Hans Zimmer Flight is pure cinematic elevation. Grounded visceral Kryptonian combat.'
    },
    {
      id: 'movie-zack-snyders-justice-league',
      slug: 'zack-snyders-justice-league',
      type: 'movie',
      title: "Zack Snyder's Justice League",
      releaseYear: 2021,
      genresJson: JSON.stringify(['Action', 'Adventure', 'Fantasy']),
      creatorsJson: JSON.stringify(['Zack Snyder']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/tnAuB8q5vv7Ax92je19VvVClff9.jpg',
      myRating: 9.1,
      watchStatus: 'completed',
      tier: 'favorite',
      personalReview: 'The definitive 4-hour mythic opera. The Flash rewinding time scene is unforgettable.'
    },
    {
      id: 'movie-joker',
      slug: 'joker',
      type: 'movie',
      title: 'Joker',
      releaseYear: 2019,
      genresJson: JSON.stringify(['Crime', 'Drama', 'Thriller']),
      creatorsJson: JSON.stringify(['Todd Phillips']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
      myRating: 9.4,
      watchStatus: 'completed',
      tier: 'masterpiece',
      personalReview: 'Joaquin Phoenix transformative performance. A haunting psychological descent into societal alienation.'
    },

    // Indian Blockbusters: Kantara, KGF, Munjya
    {
      id: 'movie-kantara',
      slug: 'kantara',
      type: 'movie',
      title: 'Kantara',
      releaseYear: 2022,
      genresJson: JSON.stringify(['Action', 'Drama', 'Folklore', 'Thriller']),
      creatorsJson: JSON.stringify(['Rishab Shetty']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/5j26K7Hj0B6rW4wzQe5vX91aG7b.jpg',
      myRating: 9.6,
      watchStatus: 'completed',
      tier: 'masterpiece',
      personalReview: 'The final 20 minutes of Bhoota Kola spirit possession and climax is pure divine goosebumps. Raw indigenous storytelling at its zenith.'
    },
    {
      id: 'movie-kgf-chapter-1',
      slug: 'kgf-chapter-1',
      type: 'movie',
      title: 'K.G.F: Chapter 1',
      releaseYear: 2018,
      genresJson: JSON.stringify(['Action', 'Crime', 'Drama']),
      creatorsJson: JSON.stringify(['Prashanth Neel']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/hoxrP73V1Y3W4k9kY7xJ9mK8wR6.jpg',
      myRating: 9.4,
      watchStatus: 'completed',
      tier: 'favorite',
      personalReview: 'Rocky Bhai rise from Bombay slums into Kolar Gold Fields. Electric editing cuts, world-class BGM, and non-linear mass heroism.'
    },
    {
      id: 'movie-kgf-chapter-2',
      slug: 'kgf-chapter-2',
      type: 'movie',
      title: 'K.G.F: Chapter 2',
      releaseYear: 2022,
      genresJson: JSON.stringify(['Action', 'Crime', 'Drama']),
      creatorsJson: JSON.stringify(['Prashanth Neel']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/6woSP1YkC92rX8bX3qJ0H1aV1qC.jpg',
      myRating: 9.5,
      watchStatus: 'completed',
      tier: 'masterpiece',
      personalReview: 'Kalashnikov police station scene is the pinnacle of elevation cinema. Uncompromising scale and swagger.'
    },
    {
      id: 'movie-munjya',
      slug: 'munjya',
      type: 'movie',
      title: 'Munjya',
      releaseYear: 2024,
      genresJson: JSON.stringify(['Comedy', 'Horror', 'Folklore']),
      creatorsJson: JSON.stringify(['Aditya Sarpotdar', 'Maddock Films']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/8g4gK9vW1a2b3c4d5e6f7g8h9j.jpg',
      myRating: 8.8,
      watchStatus: 'completed',
      tier: 'recommended',
      personalReview: 'Great blend of Konkan folklore, sharp comedy, and genuine horror VFX in the Maddock supernatural universe.'
    },

    // Web Series: Money Heist, Panchayat, Game of Thrones, Mirzapur
    {
      id: 'series-money-heist',
      slug: 'money-heist',
      type: 'tv_series',
      title: 'Money Heist (La Casa de Papel)',
      releaseYear: 2017,
      genresJson: JSON.stringify(['Crime', 'Drama', 'Thriller', 'Heist']),
      creatorsJson: JSON.stringify(['Álex Pina']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/reKs8y4mPwXgYsZ8n77k1oP1V1b.jpg',
      myRating: 9.4,
      watchStatus: 'completed',
      tier: 'favorite',
      personalReview: 'The Professor calculated chess match against inspector Murillo and Sierra. Bella Ciao rebellion anthem and brilliant psychological tension.'
    },
    {
      id: 'series-panchayat',
      slug: 'panchayat',
      type: 'tv_series',
      title: 'Panchayat',
      releaseYear: 2020,
      genresJson: JSON.stringify(['Comedy', 'Drama', 'Slice of Life']),
      creatorsJson: JSON.stringify(['The Viral Fever (TVF)', 'Deepak Kumar Mishra']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wvhH7.jpg',
      myRating: 9.8,
      watchStatus: 'completed',
      tier: 'masterpiece',
      personalReview: 'Phulera is pure warmth and authentic Indian rural reality. Jitendra Kumar, Neena Gupta, Raghubir Yadav, and Chandan Roy give heartfelt performances.'
    },
    {
      id: 'series-game-of-thrones',
      slug: 'game-of-thrones',
      type: 'tv_series',
      title: 'Game of Thrones',
      releaseYear: 2011,
      genresJson: JSON.stringify(['Fantasy', 'Drama', 'Political Intrigue']),
      creatorsJson: JSON.stringify(['David Benioff', 'D.B. Weiss', 'George R.R. Martin']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wvhH7.jpg',
      myRating: 9.7,
      watchStatus: 'completed',
      tier: 'masterpiece',
      personalReview: 'Seasons 1-6 are the absolute peak of television history. The Red Wedding, Hardhome, and Battle of the Bastards are unmatched.'
    },
    {
      id: 'series-mirzapur',
      slug: 'mirzapur',
      type: 'tv_series',
      title: 'Mirzapur',
      releaseYear: 2018,
      genresJson: JSON.stringify(['Action', 'Crime', 'Thriller']),
      creatorsJson: JSON.stringify(['Karan Anshuman', 'Puneet Krishna']),
      posterUrl: 'https://image.tmdb.org/t/p/w500/m5z7wQ6r2y8c3d4e5f6g7h8i9j.jpg',
      myRating: 9.3,
      watchStatus: 'completed',
      tier: 'favorite',
      personalReview: 'Pankaj Tripathi as Akhandanand Tripathi (Kaleen Bhaiya) delivers iconic deadpan dominance. Raw power politics of Purvanchal.'
    },
  ];

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

  console.log(`✅ Successfully seeded ${entries.length} movies and webseries!`);
}
