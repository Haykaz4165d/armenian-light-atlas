import { z } from 'zod';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
export function validateImageFile(file: { size: number; type: string }) {
  if (!imageTypes.includes(file.type)) return 'Ընտրեք JPG, PNG կամ WebP պատկեր։';
  if (file.size === 0 || file.size > MAX_IMAGE_BYTES) return 'Պատկերը պետք է լինի մինչև 5 ՄԲ և ոչ դատարկ։';
  return null;
}

export const imageInputSchema = z.object({
  image: z.string().max(Math.ceil(MAX_IMAGE_BYTES / 3) * 4 + 100),
}).superRefine(({ image }, ctx) => {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(image);
  if (!match?.[1] || !match[2]) {
    ctx.addIssue({ code: 'custom', message: 'Անվավեր պատկեր։' });
    return;
  }
  try {
    const bytes = atob(match[2]);
    const error = validateImageFile({ type: match[1], size: bytes.length });
    const validHeader = match[1] === 'image/jpeg' ? bytes.startsWith('\xff\xd8\xff')
      : match[1] === 'image/png' ? bytes.startsWith('\x89PNG\r\n\x1a\n')
      : bytes.startsWith('RIFF') && bytes.slice(8, 12) === 'WEBP';
    if (error || !validHeader) ctx.addIssue({ code: 'custom', message: error ?? 'Պատկերի ձևաչափը չի համապատասխանում բովանդակությանը։' });
  } catch { ctx.addIssue({ code: 'custom', message: 'Անվավեր պատկեր։' }); }
});

export const inferenceInputSchema = z.object({
  image: z.string(),
  model: z.enum(['openai/gpt-6-astra', 'openai/gpt-6-sol']).default('openai/gpt-6-astra'),
}).superRefine(({ image }, ctx) => {
  const parsed = imageInputSchema.safeParse({ image });
  if (!parsed.success) for (const issue of parsed.error.issues) ctx.addIssue(issue);
});

export const transcriptionSchema = z.object({
  readable: z.boolean(),
  summary: z.string().max(1600),
  lines: z.array(z.object({
    segments: z.array(z.object({
      text: z.string().min(1).max(1000),
      modernText: z.string().min(1).max(1500),
      status: z.enum(['read', 'uncertain', 'unreadable']),
      note: z.string().max(1200),
      alternatives: z.array(z.string().max(300)).max(4),
    })).min(1).max(80),
  })).max(40),
  possibleErrors: z.array(z.string().max(1200)).max(12),
  limitations: z.array(z.string().max(1200)).min(1).max(12),
}).superRefine((result, ctx) => {
  if (result.readable && !result.lines.length) ctx.addIssue({ code: 'custom', message: 'Ընթեռնելի պատկերի տեքստը բացակայում է։' });
  for (const line of result.lines) for (const segment of line.segments) {
    if (segment.status !== 'read' && !segment.note.trim()) ctx.addIssue({ code: 'custom', message: 'Անորոշ հատվածը պետք է ունենա բացատրություն։' });
    if (segment.status === 'unreadable' && segment.text !== '[անընթեռնելի]') ctx.addIssue({ code: 'custom', message: 'Անընթեռնելի հատվածը չի կարող ներկայացվել որպես վերծանում։' });
    if (segment.status === 'unreadable' && segment.modernText !== '[անընթեռնելի]') ctx.addIssue({ code: 'custom', message: 'Անընթեռնելի հատվածը չի կարող լրացվել ժամանակակից հայերենով։' });
  }
});
export type Transcription = z.infer<typeof transcriptionSchema>;
