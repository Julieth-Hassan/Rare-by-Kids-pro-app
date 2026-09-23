import kijaniMoyoModelImg from '../assets/images/kijani_moyo_model.jpg';
import kijaniMoyoFlatlayImg from '../assets/images/kijani_moyo_flatlay.jpg';
import sunsetMoyoModelImg from '../assets/images/sunset_moyo_model.jpg';
import sunsetMoyoFlatlayImg from '../assets/images/sunset_moyo_flatlay.jpg';
import rubyMoyoModelImg from '../assets/images/ruby_moyo_model.jpg';
import rubyMoyoFlatlayImg from '../assets/images/ruby_moyo_flatlay.jpg';

export interface KayaAssetDefinition {
  id: string;
  expectedFilename: string;
  alternateFilenames?: string[];
  type: 'model' | 'flatlay';
  setName: string;
  description: string;
  fallbackImage: string;
}

export const KAYA_EXPECTED_ASSETS: KayaAssetDefinition[] = [
  // Set 1: African Kid Cocoa & Pebble Set
  {
    id: 'kaya-ak-brown-model',
    expectedFilename: 'Kaya_model.png',
    alternateFilenames: ['Kaya_model.png', 'kaya_model.png', 'Kaya_model.jpg', 'Kaya_model.jpeg'],
    type: 'model',
    setName: 'African Kid Cocoa & Pebble Set',
    description: 'On-model photoshoot in chocolate brown African Kid tee & pebble batik shorts',
    fallbackImage: sunsetMoyoModelImg,
  },
  {
    id: 'kaya-ak-brown-flatlay',
    expectedFilename: 'Kaya_flatlay.png',
    alternateFilenames: ['Kaya_flatlay.png', 'kaya_flatlay.png', 'Kaya_flatlay.jpg'],
    type: 'flatlay',
    setName: 'African Kid Cocoa & Pebble Set',
    description: 'Clothing-only boutique flatlay: Cocoa tee & espresso pebble batik shorts (hanger shot)',
    fallbackImage: sunsetMoyoFlatlayImg,
  },

  // Set 2: African Kid Ivory & Kijani Foliage Set
  {
    id: 'kaya-ak-green-model',
    expectedFilename: 'Kaya_model 2.png',
    alternateFilenames: ['Kaya_model 2.png', 'Kaya_model_2.png', 'kaya_model_2.png'],
    type: 'model',
    setName: 'African Kid Ivory & Kijani Foliage Set',
    description: 'On-model photoshoot in ivory African Kid tee & olive branch batik shorts',
    fallbackImage: kijaniMoyoModelImg,
  },
  {
    id: 'kaya-ak-green-flatlay',
    expectedFilename: 'Kaya_Flatlay 2.png',
    alternateFilenames: ['Kaya_Flatlay 2.png', 'Kaya_flatlay (2).png', 'Kaya_flatlay 2.png', 'Kaya_flatlay_2.png'],
    type: 'flatlay',
    setName: 'African Kid Ivory & Kijani Foliage Set',
    description: 'Clothing-only boutique flatlay: Ivory tee & olive foliage batik shorts',
    fallbackImage: kijaniMoyoFlatlayImg,
  },

  // Set 3: Dady's Pride Sunshine Ocher Set
  {
    id: 'kaya-dp-yellow-model',
    expectedFilename: 'Kaya_model 3.png',
    alternateFilenames: ['Kaya_model 3.png', 'Kaya_model_3.png', 'kaya_model_3.png'],
    type: 'model',
    setName: "Dady's Pride Sunshine Ocher Set",
    description: "On-model photoshoot in ivory Dady's Pride tee & mustard ocher batik shorts",
    fallbackImage: rubyMoyoModelImg,
  },
  {
    id: 'kaya-dp-yellow-flatlay',
    expectedFilename: 'Kaya_flatlay 3.png',
    alternateFilenames: ['Kaya_flatlay 3.png', 'Kaya_flatlay_3.png', 'kaya_flatlay_3.png'],
    type: 'flatlay',
    setName: "Dady's Pride Sunshine Ocher Set",
    description: "Clothing-only boutique flatlay: Dady's Pride tee & mustard brushstroke batik shorts",
    fallbackImage: rubyMoyoFlatlayImg,
  },

  // Set 4: Mama's World Olive Abstract Set
  {
    id: 'kaya-mw-olive-model',
    expectedFilename: 'Kay_model 4.png',
    alternateFilenames: ['Kay_model 4.png', 'Kaya_model 4.png', 'Kaya_model_4.png', 'kaya_model_4.png'],
    type: 'model',
    setName: "Mama's World Olive Abstract Set",
    description: "On-model photoshoot in olive green Mama's World tee & coordinated batik shorts",
    fallbackImage: kijaniMoyoModelImg,
  },
  {
    id: 'kaya-mw-olive-flatlay',
    expectedFilename: 'Kaya_flatlay 4.png',
    alternateFilenames: ['Kaya_flatlay 4.png', 'Kaya_flatlay_4.png', 'kaya_flatlay_4.png'],
    type: 'flatlay',
    setName: "Mama's World Olive Abstract Set",
    description: "Clothing-only boutique flatlay: Olive tee & abstract hand-stamped batik shorts",
    fallbackImage: kijaniMoyoFlatlayImg,
  },

  // Set 5: Mama's World Monochrome Chevron Set
  {
    id: 'kaya-mw-black-model',
    expectedFilename: 'Kaya_model 5.png',
    alternateFilenames: ['Kaya_model 5.png', 'Kaya_model_5.png', 'kaya_model_5.png'],
    type: 'model',
    setName: "Mama's World Monochrome Chevron Set",
    description: "On-model photoshoot in ivory Mama's World tee & charcoal chevron batik shorts",
    fallbackImage: sunsetMoyoModelImg,
  },
  {
    id: 'kaya-mw-black-flatlay',
    expectedFilename: 'Kaya_flatlay 5.png',
    alternateFilenames: ['Kaya_flatlay 5.png', 'Kaya_flatlay_5.png', 'kaya_flatlay_5.png'],
    type: 'flatlay',
    setName: "Mama's World Monochrome Chevron Set",
    description: "Clothing-only boutique flatlay: Ivory tee & geometric chevron batik shorts",
    fallbackImage: sunsetMoyoFlatlayImg,
  },
];

// Helper to fetch list of uploaded Kaya assets from server
export async function fetchUploadedKayaAssets(): Promise<string[]> {
  try {
    const res = await fetch('/api/kaya-assets');
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.warn('Could not fetch kaya assets list:', err);
    return [];
  }
}

// Helper to upload an asset file via browser FileReader
export async function uploadKayaAssetFile(file: File): Promise<{ success: boolean; filename: string; url?: string; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch('/api/upload-kaya-asset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            base64Data,
          }),
        });
        const data = await res.json();
        resolve(data);
      } catch (err: any) {
        resolve({ success: false, filename: file.name, error: err?.message || 'Network error' });
      }
    };
    reader.onerror = () => {
      resolve({ success: false, filename: file.name, error: 'Failed to read file' });
    };
    reader.readAsDataURL(file);
  });
}
