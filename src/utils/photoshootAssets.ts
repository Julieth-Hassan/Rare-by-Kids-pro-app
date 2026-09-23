export interface PhotoshootAsset {
  filename: string;
  url: string;
  collection: string;
  sizeBytes: number;
  modifiedAt?: string;
  isVideo?: boolean;
}

export interface CollectionOption {
  id: string;
  name: string;
  folder: string;
  description: string;
  badgeColor: string;
}

export const SUPPORTED_COLLECTIONS: CollectionOption[] = [
  {
    id: 'all',
    name: 'All Collections',
    folder: '',
    description: 'All raw photoshoot imagery across store catalogs',
    badgeColor: 'bg-neutral-100 text-neutral-800',
  },
  {
    id: 'kaya',
    name: 'Kaya Collection (Boys Heritage & Play)',
    folder: 'kaya',
    description: 'Chocolate, ivory, olive, ocher & chevron sets (African Kid, Dady\'s Pride, Mama\'s World)',
    badgeColor: 'bg-amber-100 text-amber-900',
  },
  {
    id: 'moyo',
    name: 'Moyo Collection (Girls & Unisex Luxury)',
    folder: 'moyo',
    description: 'Artisan hand-stamped twirl dresses, sunset coral, emerald kijani & ruby sets',
    badgeColor: 'bg-rose-100 text-rose-900',
  },
  {
    id: 'accessories',
    name: 'Gentleman & Royal Accessories',
    folder: 'accessories',
    description: 'Handcrafted African batik bowties, bonnet sets, hairbands, and leather shoes',
    badgeColor: 'bg-blue-100 text-blue-900',
  },
  {
    id: 'bundles',
    name: 'Gift Bundles & Luxury Keepsakes',
    folder: 'bundles',
    description: 'Curated wooden hampers, personalized calligraphy slips, and newborn starter sets',
    badgeColor: 'bg-emerald-100 text-emerald-900',
  },
  {
    id: 'general',
    name: 'General / New Season Drops',
    folder: 'general',
    description: 'Upcoming editorial campaigns, lookbooks, and seasonal launches',
    badgeColor: 'bg-purple-100 text-purple-900',
  },
];

// Helper to fetch list of uploaded photoshoot assets from server
export async function fetchPhotoshootAssets(collection?: string): Promise<PhotoshootAsset[]> {
  try {
    const url = collection && collection !== 'all'
      ? `/api/photoshoot-assets?collection=${encodeURIComponent(collection)}`
      : '/api/photoshoot-assets';
    const res = await fetch(url);
    const data = await res.json();
    return data.assets || [];
  } catch (err) {
    console.warn('Could not fetch photoshoot assets list:', err);
    return [];
  }
}

// Helper to upload a raw photoshoot asset file (PNG/JPG) as-is into the asset directory
export async function uploadPhotoshootAssetFile(
  file: File,
  collection: string = 'general'
): Promise<{ success: boolean; filename: string; url?: string; collection?: string; isVideo?: boolean; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch('/api/upload-photoshoot-asset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            base64Data,
            collection: collection === 'all' ? 'general' : collection,
          }),
        });
        const data = await res.json();
        resolve(data);
      } catch (err: any) {
        resolve({ success: false, filename: file.name, error: err?.message || 'Network upload error' });
      }
    };
    reader.onerror = () => {
      resolve({ success: false, filename: file.name, error: 'Failed to read local file' });
    };
    reader.readAsDataURL(file);
  });
}
