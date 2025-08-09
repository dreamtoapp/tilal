// utils/slugifyArabic.ts

const ARABIC_STOP_WORDS = new Set([
  'من', 'في', 'على', 'و', 'عن', 'إلى', 'ب', 'التي', 'الذي', 'أن', 'إن', 'كان', 'كانت', 'هو', 'هي'
]);

/**
 * Remove Arabic diacritics (tashkeel)
 */
function removeDiacritics(input: string): string {
  return input.replace(/[\u064B-\u0652\u0610-\u061A\u06D6-\u06ED]/g, '');
}

/**
 * Optional stop word removal
 */
function removeStopWords(input: string): string {
  const words = input.split(/\s+/);
  const filtered = words.filter(word => !ARABIC_STOP_WORDS.has(word));
  return filtered.join(' ');
}

/**
 * Slugify Arabic (and English) string into URL-safe slug
 */
export function Slugify(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let result = text.trim();
  result = result.normalize('NFKC');
  result = removeStopWords(result);
  result = removeDiacritics(result);
  result = result.toLowerCase();
  result = result.replace(/[^0-9\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z\s]/g, '');
  result = result.replace(/\s+/g, ' ');
  result = result.replace(/\s/g, '-');
  result = result.replace(/-+/g, '-');
  result = result.replace(/^-+|-+$/g, '');
  if (result.length > 100) {
    result = result.substring(0, 100);
    const lastHyphen = result.lastIndexOf('-');
    if (lastHyphen > 50) {
      result = result.substring(0, lastHyphen);
    }
  }
  return result || 'untitled';
}
