import { describe, expect, it } from 'vitest';
import { isModuleLoadError } from '@/lib/module-load-error';

describe('Module load recovery', () => {
  it('recognizes the reported Safari module import failure', () => {
    expect(isModuleLoadError(new TypeError('Importing a module script failed.'))).toBe(true);
  });
  it('recognizes Chromium and Firefox failed imports', () => {
    expect(isModuleLoadError(new TypeError('Failed to fetch dynamically imported module: /assets/manuscript.js'))).toBe(true);
    expect(isModuleLoadError(new TypeError('error loading dynamically imported module: /assets/manuscript.js'))).toBe(true);
  });
  it('does not reload for inference or application errors', () => {
    expect(isModuleLoadError(new Error('AI service unavailable'))).toBe(false);
    expect(isModuleLoadError(new Error('Invalid manuscript response'))).toBe(false);
    expect(isModuleLoadError(null)).toBe(false);
  });
});