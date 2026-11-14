/** First letter upper-cased: data copy is stored lower-case ("executing technical vision…"). */
export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const say = (n: number, words: boolean) => (words && n < WORDS.length ? WORDS[n] : String(n));

/** Years to the nearest whole, as a person says them: 3.9 reads "four years", 1 "one year". */
export function aboutYears(years: number, words = true): string {
  const n = Math.round(years);
  if (n < 1) return 'under a year';
  return `${say(n, words)} ${n === 1 ? 'year' : 'years'}`;
}

/** "a", "a & b", "a, b & c"; "and" when an item has its own "&" ("transport & logistics, fintech and fitness"). */
export function andList(items: string[]): string {
  if (items.length < 2) return items.join('');
  const and = items.some((s) => s.includes(' & ')) ? 'and' : '&';
  return `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`;
}
