import { db, schema } from '../../db';
import { eq, asc } from 'drizzle-orm';

export interface TravelPhotoDto {
  id: string;
  publicUrl: string;
  caption: string | null;
  altText: string | null;
}

export interface TravelDestinationDto {
  id: string;
  destination: string;
  location: string;
  altitude?: string;
  season: string;
  type: string;
  notes: string;
  highlights: string[];
  galleryId?: string;
  gallery?: {
    id: string;
    title: string;
    description: string | null;
    items: TravelPhotoDto[];
  } | null;
}

export class TravelService {
  async getDestinations(): Promise<TravelDestinationDto[]> {
    const destinations: TravelDestinationDto[] = [
      {
        id: 'travel-nepal-lumbini',
        destination: 'Nepal & Lumbini (Birthplace of Gautama Buddha)',
        location: 'Lumbini Sanskritik, Rupandehi District, Nepal',
        altitude: '490 ft (Terai Plains)',
        season: 'Winter / December',
        type: 'Trans-Himalayan & Sacred Monastic Sanctuary',
        notes:
          'Trans-Himalayan border crossing into the sacred birthplace of Siddhartha Gautama (the Buddha) in 623 BCE. Walking through the quiet monastic peace zones, paying homage at the ancient Maya Devi Temple marking the exact Nativity spot, the Ashoka Pillar with Brahmi inscriptions (erected 249 BCE), and the sacred Puskarini pond. The immense international monastic expanse and meditative silence provide profound stillness and engineering perspective.',
        highlights: [
          'Maya Devi Temple Nativity Sanctum',
          'Emperor Ashoka Pillar Inscription (249 BCE)',
          'World Peace Pagoda & Monastic Enclaves',
          'Sacred Puskarini Holy Bathing Pond',
          'India–Nepal Terai Border Crossing',
        ],
        galleryId: 'gallery-travel-nepal-lumbini',
      },
      {
        id: 'travel-kushinagar',
        destination: 'Kushinagar (The Mahaparinirvana Path)',
        location: 'Kushinagar, Uttar Pradesh, India',
        altitude: '260 ft',
        season: 'Spring / March',
        type: 'Ancient Buddhist Archaeology & Stupas',
        notes:
          'Deep pilgrimage to the hallowed site where Gautama Buddha attained Mahaparinirvana under two Sal trees in 483 BCE. The ancient terracotta ruins house the Mahaparinirvana Temple with the majestic 6.1-meter monolithic red sandstone statue of the reclining Buddha dating to the 5th century Gupta era, and the colossal Ramabhar Stupa marking the sacred cremation ground. A tranquil sanctuary in eastern Uttar Pradesh offering contemplative grounding.',
        highlights: [
          'Mahaparinirvana Temple & 5th-Century Reclining Buddha',
          'Ramabhar Stupa (Cremation Grounds)',
          'Matha Kuar Shrine & Ancient Monastic Cells',
          'Tibetan, Thai & Japanese Cultural Monasteries',
        ],
        galleryId: 'gallery-travel-kushinagar',
      },
      {
        id: 'travel-gorakhpur',
        destination: 'Gorakhpur (Ramgarh Tal, Nauka Vihar & Zoo)',
        location: 'Gorakhpur, Uttar Pradesh, India',
        altitude: '275 ft',
        season: 'Engineering Days / MMMUT',
        type: 'Wetland Promenade & Wildlife Sanctuary',
        notes:
          'Exploring the natural expanses of Gorakhpur alongside engineering studies at MMMUT. Evening strolls along the wide freshwater embankment of Ramgarh Tal at Nauka Vihar, watching sunset boat ripples and illumination reflections. Weekend wildlife conservation treks through the vast, open-air biomes of Shaheed Ashfaq Ullah Khan Zoological Park.',
        highlights: [
          'Nauka Vihar Ramgarh Tal lakefront promenade',
          'Lakeside boating and twilight reflections',
          'Shaheed Ashfaq Ullah Khan Zoological Park safari',
          'Wetland avian biodiversity & conservation habitats',
        ],
        galleryId: 'gallery-travel-gorakhpur',
      },
      {
        id: 'travel-agra',
        destination: 'Agra: The Taj Mahal & Yamuna Riverfront',
        location: 'Agra, Uttar Pradesh, India',
        altitude: '550 ft',
        season: 'Autumn / October',
        type: 'UNESCO World Heritage & Mughal Architecture',
        notes:
          'Studying the unmatched mathematical symmetry and ivory-white Makrana marble architecture of the Taj Mahal. Standing along the serene Yamuna riverfront terrace observing the light play across the central dome, minaret alignments, intricate floral Pietra Dura stone inlays, and classical Charbagh Mughal landscaping.',
        highlights: [
          'Taj Mahal central ivory marble mausoleum',
          'Yamuna riverfront reflections at sunrise',
          'Pietra Dura semi-precious stone inlay craftsmanship',
          'Charbagh geometrical garden perspective',
        ],
        galleryId: 'gallery-travel-agra',
      },
    ];

    // Hydrate galleries and photos
    const galleries = await db.select().from(schema.gallery);
    const galleryMap = new Map<string, { id: string; title: string; description: string | null; items: TravelPhotoDto[] }>();

    for (const g of galleries) {
      const items = await db
        .select({
          id: schema.mediaItem.id,
          publicUrl: schema.mediaItem.publicUrl,
          caption: schema.mediaItem.caption,
          altText: schema.mediaItem.altText,
        })
        .from(schema.galleryItem)
        .innerJoin(schema.mediaItem, eq(schema.galleryItem.mediaId, schema.mediaItem.id))
        .where(eq(schema.galleryItem.galleryId, g.id))
        .orderBy(asc(schema.galleryItem.sortOrder));

      galleryMap.set(g.id, {
        id: g.id,
        title: g.title,
        description: g.description,
        items,
      });
    }

    return destinations.map((d) => ({
      ...d,
      gallery: d.galleryId ? galleryMap.get(d.galleryId) || null : null,
    }));
  }
}

export const travelService = new TravelService();
