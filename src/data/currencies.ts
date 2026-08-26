export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Conversion rate relative to 1 USD
  flag: string;
  country: string;
  region: 'East Africa (Shop Home)' | 'International & Global';
  symbolPosition: 'prefix' | 'suffix';
  decimalPlaces: number;
  isHomeCurrency?: boolean;
  notes?: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  // --- East African Currencies (Shop Location & Region) ---
  {
    code: 'TZS',
    name: 'Tanzanian Shilling',
    symbol: 'TZS ',
    rate: 2600.0,
    flag: '🇹🇿',
    country: 'Tanzania (Store HQ)',
    region: 'East Africa (Shop Home)',
    symbolPosition: 'suffix',
    decimalPlaces: 0,
    isHomeCurrency: true,
    notes: 'Official shop location & local currency'
  },
  {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh ',
    rate: 130.0,
    flag: '🇰🇪',
    country: 'Kenya',
    region: 'East Africa (Shop Home)',
    symbolPosition: 'prefix',
    decimalPlaces: 0,
    notes: 'East Africa cross-border dispatch'
  },
  {
    code: 'UGX',
    name: 'Ugandan Shilling',
    symbol: 'USh ',
    rate: 3750.0,
    flag: '🇺🇬',
    country: 'Uganda',
    region: 'East Africa (Shop Home)',
    symbolPosition: 'prefix',
    decimalPlaces: 0,
    notes: 'East Africa cross-border dispatch'
  },
  {
    code: 'RWF',
    name: 'Rwandan Franc',
    symbol: 'FRw ',
    rate: 1350.0,
    flag: '🇷🇼',
    country: 'Rwanda',
    region: 'East Africa (Shop Home)',
    symbolPosition: 'prefix',
    decimalPlaces: 0,
    notes: 'East Africa cross-border dispatch'
  },
  {
    code: 'BIF',
    name: 'Burundian Franc',
    symbol: 'FBu ',
    rate: 2950.0,
    flag: '🇧🇮',
    country: 'Burundi',
    region: 'East Africa (Shop Home)',
    symbolPosition: 'prefix',
    decimalPlaces: 0,
    notes: 'East Africa cross-border dispatch'
  },
  {
    code: 'SSP',
    name: 'South Sudanese Pound',
    symbol: 'SSP ',
    rate: 1300.0,
    flag: '🇸🇸',
    country: 'South Sudan',
    region: 'East Africa (Shop Home)',
    symbolPosition: 'prefix',
    decimalPlaces: 0,
    notes: 'East Africa cross-border dispatch'
  },
  {
    code: 'ETB',
    name: 'Ethiopian Birr',
    symbol: 'Br ',
    rate: 125.0,
    flag: '🇪🇹',
    country: 'Ethiopia',
    region: 'East Africa (Shop Home)',
    symbolPosition: 'prefix',
    decimalPlaces: 0,
  },

  // --- Major International Currencies (For Worldwide & Diaspora Clients) ---
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rate: 1.0,
    flag: '🇺🇸',
    country: 'United States & Global',
    region: 'International & Global',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
    notes: 'Standard global benchmark'
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    rate: 0.79,
    flag: '🇬🇧',
    country: 'United Kingdom',
    region: 'International & Global',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rate: 0.92,
    flag: '🇪🇺',
    country: 'European Union',
    region: 'International & Global',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    rate: 1.38,
    flag: '🇨🇦',
    country: 'Canada',
    region: 'International & Global',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    rate: 1.53,
    flag: '🇦🇺',
    country: 'Australia',
    region: 'International & Global',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED ',
    rate: 3.67,
    flag: '🇦🇪',
    country: 'United Arab Emirates (Dubai)',
    region: 'International & Global',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    rate: 18.2,
    flag: '🇿🇦',
    country: 'South Africa',
    region: 'International & Global',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    rate: 1550.0,
    flag: '🇳🇬',
    country: 'Nigeria',
    region: 'International & Global',
    symbolPosition: 'prefix',
    decimalPlaces: 0,
  },
  {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: 'GH₵',
    rate: 15.6,
    flag: '🇬🇭',
    country: 'Ghana',
    region: 'International & Global',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF ',
    rate: 0.89,
    flag: '🇨🇭',
    country: 'Switzerland',
    region: 'International & Global',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'SEK',
    name: 'Swedish Krona',
    symbol: 'kr ',
    rate: 10.6,
    flag: '🇸🇪',
    country: 'Sweden',
    region: 'International & Global',
    symbolPosition: 'suffix',
    decimalPlaces: 0,
  },
  {
    code: 'NOK',
    name: 'Norwegian Krone',
    symbol: 'kr ',
    rate: 10.8,
    flag: '🇳🇴',
    country: 'Norway',
    region: 'International & Global',
    symbolPosition: 'suffix',
    decimalPlaces: 0,
  },
];

export function getCurrencyByCode(code?: string): CurrencyOption {
  if (!code || typeof code !== 'string') {
    return SUPPORTED_CURRENCIES[0];
  }
  const cleanCode = code.trim().toUpperCase();
  return SUPPORTED_CURRENCIES.find((c) => c.code.toUpperCase() === cleanCode) || SUPPORTED_CURRENCIES[0];
}

export function formatPrice(amountInUSD?: number, currencyCode: string = 'USD'): string {
  const validAmount = typeof amountInUSD === 'number' && !isNaN(amountInUSD) ? amountInUSD : 0;
  const currency = getCurrencyByCode(currencyCode);
  const converted = validAmount * (currency?.rate || 1);

  let formattedNumber: string;
  const decimals = currency?.decimalPlaces ?? 2;
  if (decimals === 0) {
    formattedNumber = Math.round(converted).toLocaleString('en-US');
  } else {
    formattedNumber = converted.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  const symbol = currency?.symbol ?? '$';
  if (currency?.symbolPosition === 'suffix') {
    return `${formattedNumber} ${symbol}`;
  }
  return `${symbol}${formattedNumber}`;
}
