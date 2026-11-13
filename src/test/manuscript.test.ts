import { describe, expect, it } from 'vitest';
import { imageInputSchema, transcriptionSchema, validateImageFile } from '@/lib/manuscript';

describe('Manuscript image validation', () => {
  it('accepts a supported image', () => expect(validateImageFile({ size: 100, type: 'image/png' })).toBeNull());
  it('rejects non-images', () => expect(validateImageFile({ size: 100, type: 'application/pdf' })).not.toBeNull());
  it('rejects oversized images', () => expect(validateImageFile({ size: 5 * 1024 * 1024 + 1, type: 'image/png' })).not.toBeNull());
  it('rejects external image URLs', () => expect(imageInputSchema.safeParse({ image: 'https://example.com/image.png' }).success).toBe(false));
  it('rejects fake image content', () => expect(imageInputSchema.safeParse({ image: 'data:image/png;base64,aGVsbG8=' }).success).toBe(false));
});

describe('Preliminary transcription safeguards', () => {
  const base = { readable: true, summary: '', possibleErrors: [], limitations: ['Expert review required'], lines: [{ segments: [{ text: 'զիմաստութիւն', modernText: 'իմաստությունը', status: 'uncertain', note: 'Damaged letter', alternatives: ['Հայր'] }] }] };
  it('preserves uncertainty and alternatives', () => {
    const result = transcriptionSchema.parse(base);
    expect(result.lines[0]?.segments[0]?.status).toBe('uncertain');
    expect(result.lines[0]?.segments[0]?.alternatives).toEqual(['Հայր']);
  });
  it('requires a note on uncertain readings', () => expect(transcriptionSchema.safeParse({ ...base, lines: [{ segments: [{ text: 'Հայ', modernText: 'Հայ', status: 'uncertain', note: '', alternatives: [] }] }] }).success).toBe(false));
  it('never allows guessed text as an unreadable span', () => expect(transcriptionSchema.safeParse({ ...base, lines: [{ segments: [{ text: 'Հայ', modernText: '[անընթեռնելի]', status: 'unreadable', note: 'Damaged letter', alternatives: [] }] }] }).success).toBe(false));
  it('preserves contemporary Armenian alongside the source', () => {
    const segment = transcriptionSchema.parse(base).lines[0]?.segments[0];
    expect(segment?.modernText).toBe('իմաստությունը');
    expect(segment?.text).toBe('զիմաստութիւն');
    expect(segment?.status).toBe('uncertain');
  });
  it('requires a contemporary Armenian rendering', () => {
    expect(transcriptionSchema.safeParse({ ...base, lines: [{ segments: [{ text: 'Հայ', status: 'read', note: '', alternatives: [] }] }] }).success).toBe(false);
  });
  it('rejects invented contemporary text for unreadable source', () => {
    expect(transcriptionSchema.safeParse({ ...base, lines: [{ segments: [{ text: '[անընթեռնելի]', modernText: 'իմաստությունը', status: 'unreadable', note: 'Damaged letter', alternatives: [] }] }] }).success).toBe(false);
  });
  it('requires limitations', () => expect(transcriptionSchema.safeParse({ ...base, limitations: [] }).success).toBe(false));
});