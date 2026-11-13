import { validateImageFile } from './manuscript';

export type LoadedImage = { data: string; name: string };

// Browser-only: call from event handlers. Returns an error message or the decoded image.
export async function readImageFile(file: File): Promise<LoadedImage | { error: string }> {
  const invalid = validateImageFile(file);
  if (invalid) return { error: invalid };
  try {
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => (typeof reader.result === 'string' ? resolve(reader.result) : reject());
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    await new Promise<void>((resolve, reject) => {
      const preview = new Image();
      preview.onload = () => resolve();
      preview.onerror = reject;
      preview.src = data;
    });
    return { data, name: file.name };
  } catch {
    return { error: 'Պատկերը չի բացվում․ ընտրեք այլ պատկեր։' };
  }
}
