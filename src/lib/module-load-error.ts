// Browsers cache rejected dynamic imports until the document is reloaded.
export function isModuleLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  return /Importing a module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module|Failed to load module script|Loading chunk .+ failed|Unable to preload CSS/i.test(message);
}