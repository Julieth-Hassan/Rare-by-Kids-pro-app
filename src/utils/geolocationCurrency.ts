import { getCurrencyByCode, SUPPORTED_CURRENCIES } from '../data/currencies';

export interface LocationDetectionResult {
  currencyCode: string;
  countryName: string;
  flag: string;
  source: 'timezone' | 'locale' | 'ip' | 'fallback';
}

// Timezone to Currency and Country mapping
const TIMEZONE_CURRENCY_MAP: Record<string, { code: string; country: string; flag: string }> = {
  // East Africa (HQ & Region)
  'Africa/Dar_es_Salaam': { code: 'TZS', country: 'Tanzania', flag: '🇹🇿' },
  'Africa/Nairobi': { code: 'KES', country: 'Kenya', flag: '🇰🇪' },
  'Africa/Kampala': { code: 'UGX', country: 'Uganda', flag: '🇺🇬' },
  'Africa/Kigali': { code: 'RWF', country: 'Rwanda', flag: '🇷🇼' },
  'Africa/Bujumbura': { code: 'BIF', country: 'Burundi', flag: '🇧🇮' },
  
  // Other Africa
  'Africa/Johannesburg': { code: 'ZAR', country: 'South Africa', flag: '🇿🇦' },
  'Africa/Lagos': { code: 'NGN', country: 'Nigeria', flag: '🇳🇬' },
  'Africa/Accra': { code: 'GHS', country: 'Ghana', flag: '🇬🇭' },

  // United Kingdom
  'Europe/London': { code: 'GBP', country: 'United Kingdom', flag: '🇬🇧' },
  'Europe/Belfast': { code: 'GBP', country: 'United Kingdom', flag: '🇬🇧' },

  // North America
  'America/New_York': { code: 'USD', country: 'United States', flag: '🇺🇸' },
  'America/Chicago': { code: 'USD', country: 'United States', flag: '🇺🇸' },
  'America/Los_Angeles': { code: 'USD', country: 'United States', flag: '🇺🇸' },
  'America/Denver': { code: 'USD', country: 'United States', flag: '🇺🇸' },
  'America/Phoenix': { code: 'USD', country: 'United States', flag: '🇺🇸' },
  'America/Detroit': { code: 'USD', country: 'United States', flag: '🇺🇸' },
  'America/Indianapolis': { code: 'USD', country: 'United States', flag: '🇺🇸' },
  'America/Anchorage': { code: 'USD', country: 'United States', flag: '🇺🇸' },
  'America/Honolulu': { code: 'USD', country: 'United States', flag: '🇺🇸' },
  'America/Boise': { code: 'USD', country: 'United States', flag: '🇺🇸' },

  // Canada
  'America/Toronto': { code: 'CAD', country: 'Canada', flag: '🇨🇦' },
  'America/Vancouver': { code: 'CAD', country: 'Canada', flag: '🇨🇦' },
  'America/Montreal': { code: 'CAD', country: 'Canada', flag: '🇨🇦' },
  'America/Edmonton': { code: 'CAD', country: 'Canada', flag: '🇨🇦' },
  'America/Winnipeg': { code: 'CAD', country: 'Canada', flag: '🇨🇦' },
  'America/Halifax': { code: 'CAD', country: 'Canada', flag: '🇨🇦' },

  // Australia & New Zealand
  'Australia/Sydney': { code: 'AUD', country: 'Australia', flag: '🇦🇺' },
  'Australia/Melbourne': { code: 'AUD', country: 'Australia', flag: '🇦🇺' },
  'Australia/Brisbane': { code: 'AUD', country: 'Australia', flag: '🇦🇺' },
  'Australia/Perth': { code: 'AUD', country: 'Australia', flag: '🇦🇺' },
  'Australia/Adelaide': { code: 'AUD', country: 'Australia', flag: '🇦🇺' },
  'Pacific/Auckland': { code: 'NZD', country: 'New Zealand', flag: '🇳🇿' },

  // Middle East
  'Asia/Dubai': { code: 'AED', country: 'United Arab Emirates', flag: '🇦🇪' },
  'Asia/Riyadh': { code: 'SAR', country: 'Saudi Arabia', flag: '🇸🇦' },
  'Asia/Qatar': { code: 'QAR', country: 'Qatar', flag: '🇶🇦' },

  // Asia
  'Asia/Kolkata': { code: 'INR', country: 'India', flag: '🇮🇳' },
  'Asia/Calcutta': { code: 'INR', country: 'India', flag: '🇮🇳' },
  'Asia/Tokyo': { code: 'JPY', country: 'Japan', flag: '🇯🇵' },
  'Asia/Singapore': { code: 'SGD', country: 'Singapore', flag: '🇸🇬' },
  'Asia/Hong_Kong': { code: 'HKD', country: 'Hong Kong', flag: '🇭🇰' },
  'Asia/Shanghai': { code: 'CNY', country: 'China', flag: '🇨🇳' },
  'Asia/Chongqing': { code: 'CNY', country: 'China', flag: '🇨🇳' },

  // Europe (Eurozone)
  'Europe/Paris': { code: 'EUR', country: 'France', flag: '🇫🇷' },
  'Europe/Berlin': { code: 'EUR', country: 'Germany', flag: '🇩🇪' },
  'Europe/Rome': { code: 'EUR', country: 'Italy', flag: '🇮🇹' },
  'Europe/Madrid': { code: 'EUR', country: 'Spain', flag: '🇪🇸' },
  'Europe/Amsterdam': { code: 'EUR', country: 'Netherlands', flag: '🇳🇱' },
  'Europe/Brussels': { code: 'EUR', country: 'Belgium', flag: '🇧🇪' },
  'Europe/Vienna': { code: 'EUR', country: 'Austria', flag: '🇦🇹' },
  'Europe/Dublin': { code: 'EUR', country: 'Ireland', flag: '🇮🇪' },
  'Europe/Helsinki': { code: 'EUR', country: 'Finland', flag: '🇫🇮' },
  'Europe/Lisbon': { code: 'EUR', country: 'Portugal', flag: '🇵🇹' },
  'Europe/Athens': { code: 'EUR', country: 'Greece', flag: '🇬🇷' },
  'Europe/Zurich': { code: 'CHF', country: 'Switzerland', flag: '🇨🇭' },
  'Europe/Oslo': { code: 'NOK', country: 'Norway', flag: '🇳🇴' },
  'Europe/Stockholm': { code: 'SEK', country: 'Sweden', flag: '🇸🇪' },
  'Europe/Copenhagen': { code: 'DKK', country: 'Denmark', flag: '🇩🇰' },
};

// ISO 2-letter Country Code to Currency Map
const COUNTRY_CODE_MAP: Record<string, { code: string; country: string; flag: string }> = {
  TZ: { code: 'TZS', country: 'Tanzania', flag: '🇹🇿' },
  KE: { code: 'KES', country: 'Kenya', flag: '🇰🇪' },
  UG: { code: 'UGX', country: 'Uganda', flag: '🇺🇬' },
  RW: { code: 'RWF', country: 'Rwanda', flag: '🇷🇼' },
  BI: { code: 'BIF', country: 'Burundi', flag: '🇧🇮' },
  ZA: { code: 'ZAR', country: 'South Africa', flag: '🇿🇦' },
  NG: { code: 'NGN', country: 'Nigeria', flag: '🇳🇬' },
  GH: { code: 'GHS', country: 'Ghana', flag: '🇬🇭' },
  GB: { code: 'GBP', country: 'United Kingdom', flag: '🇬🇧' },
  US: { code: 'USD', country: 'United States', flag: '🇺🇸' },
  CA: { code: 'CAD', country: 'Canada', flag: '🇨🇦' },
  AU: { code: 'AUD', country: 'Australia', flag: '🇦🇺' },
  AE: { code: 'AED', country: 'United Arab Emirates', flag: '🇦🇪' },
  SA: { code: 'SAR', country: 'Saudi Arabia', flag: '🇸🇦' },
  QA: { code: 'QAR', country: 'Qatar', flag: '🇶🇦' },
  IN: { code: 'INR', country: 'India', flag: '🇮🇳' },
  JP: { code: 'JPY', country: 'Japan', flag: '🇯🇵' },
  SG: { code: 'SGD', country: 'Singapore', flag: '🇸🇬' },
  HK: { code: 'HKD', country: 'Hong Kong', flag: '🇭🇰' },
  CN: { code: 'CNY', country: 'China', flag: '🇨🇳' },
  CH: { code: 'CHF', country: 'Switzerland', flag: '🇨🇭' },
  NO: { code: 'NOK', country: 'Norway', flag: '🇳🇴' },
  SE: { code: 'SEK', country: 'Sweden', flag: '🇸🇪' },
  DK: { code: 'DKK', country: 'Denmark', flag: '🇩🇰' },
  NZ: { code: 'NZD', country: 'New Zealand', flag: '🇳🇿' },
  // Eurozone
  DE: { code: 'EUR', country: 'Germany', flag: '🇩🇪' },
  FR: { code: 'EUR', country: 'France', flag: '🇫🇷' },
  IT: { code: 'EUR', country: 'Italy', flag: '🇮🇹' },
  ES: { code: 'EUR', country: 'Spain', flag: '🇪🇸' },
  NL: { code: 'EUR', country: 'Netherlands', flag: '🇳🇱' },
  BE: { code: 'EUR', country: 'Belgium', flag: '🇧🇪' },
  AT: { code: 'EUR', country: 'Austria', flag: '🇦🇹' },
  IE: { code: 'EUR', country: 'Ireland', flag: '🇮🇪' },
  FI: { code: 'EUR', country: 'Finland', flag: '🇫🇮' },
  PT: { code: 'EUR', country: 'Portugal', flag: '🇵🇹' },
  GR: { code: 'EUR', country: 'Greece', flag: '🇬🇷' },
};

/**
 * Synchronous, instant location-to-currency detection based on browser timezone and locale.
 * Runs with zero network requests and zero latency.
 */
export function detectUserCurrencySync(): LocationDetectionResult {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_CURRENCY_MAP[tz]) {
      const match = TIMEZONE_CURRENCY_MAP[tz];
      return {
        currencyCode: match.code,
        countryName: match.country,
        flag: match.flag,
        source: 'timezone',
      };
    }

    // Check partial timezone prefix matches
    if (tz) {
      if (tz.startsWith('Africa/Dar_es_Salaam') || tz.includes('Tanzania')) {
        return { currencyCode: 'TZS', countryName: 'Tanzania', flag: '🇹🇿', source: 'timezone' };
      }
      if (tz.startsWith('Africa/Nairobi')) {
        return { currencyCode: 'KES', countryName: 'Kenya', flag: '🇰🇪', source: 'timezone' };
      }
      if (tz.startsWith('Africa/Kampala')) {
        return { currencyCode: 'UGX', countryName: 'Uganda', flag: '🇺🇬', source: 'timezone' };
      }
      if (tz.startsWith('America/')) {
        return { currencyCode: 'USD', countryName: 'United States', flag: '🇺🇸', source: 'timezone' };
      }
      if (tz.startsWith('Europe/London')) {
        return { currencyCode: 'GBP', countryName: 'United Kingdom', flag: '🇬🇧', source: 'timezone' };
      }
      if (tz.startsWith('Europe/')) {
        return { currencyCode: 'EUR', countryName: 'Europe', flag: '🇪🇺', source: 'timezone' };
      }
      if (tz.startsWith('Australia/')) {
        return { currencyCode: 'AUD', countryName: 'Australia', flag: '🇦🇺', source: 'timezone' };
      }
    }

    // Check browser locale
    const locale = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
    if (locale.includes('-tz') || locale === 'sw') {
      return { currencyCode: 'TZS', countryName: 'Tanzania', flag: '🇹🇿', source: 'locale' };
    }
    if (locale.includes('-ke')) {
      return { currencyCode: 'KES', countryName: 'Kenya', flag: '🇰🇪', source: 'locale' };
    }
    if (locale.includes('-ug')) {
      return { currencyCode: 'UGX', countryName: 'Uganda', flag: '🇺🇬', source: 'locale' };
    }
    if (locale.includes('-gb')) {
      return { currencyCode: 'GBP', countryName: 'United Kingdom', flag: '🇬🇧', source: 'locale' };
    }
    if (locale.includes('-us')) {
      return { currencyCode: 'USD', countryName: 'United States', flag: '🇺🇸', source: 'locale' };
    }
    if (locale.includes('-ca')) {
      return { currencyCode: 'CAD', countryName: 'Canada', flag: '🇨🇦', source: 'locale' };
    }
    if (locale.includes('-au')) {
      return { currencyCode: 'AUD', countryName: 'Australia', flag: '🇦🇺', source: 'locale' };
    }
  } catch (err) {
    console.warn('Sync location detection failed:', err);
  }

  // Fallback to Tanzania TZS (Store HQ)
  return {
    currencyCode: 'TZS',
    countryName: 'Tanzania (Store HQ)',
    flag: '🇹🇿',
    source: 'fallback',
  };
}

/**
 * Async check that queries a lightweight IP geo-endpoint with 1.5s timeout.
 * Updates currency seamlessly in the background if the user hasn't manually selected one.
 */
export async function detectUserCurrencyAsync(): Promise<LocationDetectionResult | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    // Try country.is (fast and clean CORS endpoint returning { country: "TZ", ip: "..." })
    const res = await fetch('https://api.country.is/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const code = data?.country?.toUpperCase();
      if (code && COUNTRY_CODE_MAP[code]) {
        const match = COUNTRY_CODE_MAP[code];
        return {
          currencyCode: match.code,
          countryName: match.country,
          flag: match.flag,
          source: 'ip',
        };
      }
    }
  } catch (e) {
    // Network or timeout failure; sync detection is already active as instant fallback
  }
  return null;
}
