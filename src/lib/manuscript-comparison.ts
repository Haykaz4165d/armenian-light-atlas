import { distance } from 'fastest-levenshtein';
import type { Transcription } from './manuscript';

export const manuscriptModels = [
  { id: 'openai/gpt-6-astra', name: 'GPT-6 Astra' },
  { id: 'openai/gpt-6-sol', name: 'GPT-6 Sol' },
] as const;
export type ManuscriptModel = typeof manuscriptModels[number]['id'];

export function sourceText(result: Transcription) {
  return result.lines.map(line => line.segments.map(segment => segment.text).join('')).join('\n');
}

export function normalizeSource(text: string) {
  return text.normalize('NFC').replace(/\s+/gu, ' ').trim();
}

// Armenian characters are in the BMP; the library counts UTF-16 code units.
// Reject other scripts' surrogate pairs rather than mislabel their unit counts.
export function compareSource(reference: string, prediction: string) {
  const expected = normalizeSource(reference);
  const actual = normalizeSource(prediction);
  if (!expected || expected.includes('[անընթեռնելի]') || expected.length > 6000 || actual.length > 12000 || /[\uD800-\uDFFF]/u.test(expected + actual)) return null;
  const edits = distance(expected, actual);
  const cer = 100 * edits / expected.length;
  return { characters: expected.length, edits, cer, agreement: Math.max(0, 100 - cer) };
}