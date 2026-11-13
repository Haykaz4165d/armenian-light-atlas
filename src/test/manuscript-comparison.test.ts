import { describe, expect, it } from 'vitest';
import { compareSource, sourceText } from '@/lib/manuscript-comparison';
import { inferenceInputSchema } from '@/lib/manuscript';

describe('Independent expert-source comparison', () => {
  it('scores identical Armenian source at 100 percent', () => {
    expect(compareSource('Հայ', 'Հայ')).toEqual({ characters: 3, edits: 0, cer: 0, agreement: 100 });
  });
  it('counts substitutions against reference length', () => {
    expect(compareSource('Հայա', 'Հայբ')).toEqual({ characters: 4, edits: 1, cer: 25, agreement: 75 });
  });
  it('counts deletions and insertions', () => {
    expect(compareSource('Հայա', 'Հայ')?.cer).toBe(25);
    expect(compareSource('Հայա', 'Հայաբ')?.cer).toBe(25);
  });
  it('normalizes whitespace but retains punctuation and case', () => {
    expect(compareSource('Հայ\n  տեքստ', 'Հայ տեքստ')?.agreement).toBe(100);
    expect(compareSource('Հայ', 'հայ')?.edits).toBe(1);
    expect(compareSource('Հայ։', 'Հայ')?.edits).toBe(1);
  });
  it('does not fabricate a score without an independently readable reference', () => {
    expect(compareSource('  ', 'Հայ')).toBeNull();
    expect(compareSource('[անընթեռնելի]', 'Հայ')).toBeNull();
  });
  it('does not drop model unreadability markers', () => {
    expect(compareSource('Հայ', '[անընթեռնելի]')?.agreement).toBe(0);
  });
  it('keeps CER above 100 but clamps agreement to zero', () => {
    expect(compareSource('ա', 'բբբ')).toEqual({ characters: 1, edits: 3, cer: 300, agreement: 0 });
  });
  it('compares historical source rather than modern rendering', () => {
    const source = sourceText({ readable: true, summary: '', lines: [{ segments: [{ text: 'զիմաստութիւն', modernText: 'իմաստությունը', status: 'read', note: '', alternatives: [] }] }], possibleErrors: [], limitations: ['Review'] });
    expect(source).toBe('զիմաստութիւն');
    expect(compareSource('զիմաստութիւն', source)?.agreement).toBe(100);
  });
  it('rejects unsupported models before inference', () => {
    expect(inferenceInputSchema.safeParse({ image: 'data:image/png;base64,iVBORw0KGgo=', model: 'invented' }).success).toBe(false);
  });
  it('defaults existing calls to Astra and permits Sol', () => {
    const image = 'data:image/png;base64,iVBORw0KGgo=';
    expect(inferenceInputSchema.parse({ image }).model).toBe('openai/gpt-6-astra');
    expect(inferenceInputSchema.parse({ image, model: 'openai/gpt-6-sol' }).model).toBe('openai/gpt-6-sol');
  });
});