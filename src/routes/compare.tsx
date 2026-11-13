import { createFileRoute, Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useRef, useState } from 'react';
import { AlertTriangle, ArrowLeft, Columns2, LoaderCircle, ScanText, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { transcribeManuscript } from '@/lib/manuscript.functions';
import { readImageFile } from '@/lib/read-image';
import { compareSource, manuscriptModels, sourceText, type ManuscriptModel } from '@/lib/manuscript-comparison';
import type { ModelReading } from '@/components/manuscript-comparison';
import { ModelReadingColumn } from '@/components/model-reading-column';

export const Route = createFileRoute('/compare')({
  // Upload workspace: keep it in the entry graph so a stale deferred chunk cannot break it.
  codeSplitGroupings: [],
  head: () => ({ meta: [
    { title: 'Մոդելների համեմատություն · Հայկական ձեռագիր' },
    { name: 'description', content: 'Վերբեռնեք ձեռագրի լուսանկար, մուտքագրեք մասնագետի վերծանումը և համեմատեք երկու AI մոդելի ընթերցումները կողք կողքի։' },
    { property: 'og:title', content: 'AI մոդելների համեմատություն հայկական ձեռագրի վրա' },
    { property: 'og:description', content: 'Երկու AI մոդելի բնագրային ընթերցումը՝ մասնագետի վերծանման հետ նիշային համեմատությամբ։' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: ComparePage,
});

const failed = 'Վերծանումը չհաջողվեց․ ստուգեք կապը կամ ընտրեք այլ պատկեր։ Ավտոմատ կրկնություն չի կատարվել։';

function ComparePage() {
  const input = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [imageError, setImageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState('');
  const [readings, setReadings] = useState<Partial<Record<ManuscriptModel, ModelReading>>>({});
  const [running, setRunning] = useState<ManuscriptModel[]>([]);
  const active = useRef(new Set<ManuscriptModel>());
  const transcribe = useServerFn(transcribeManuscript);
  const busy = running.length > 0;

  async function selectFile(file?: File) {
    if (!file || busy || loading) return;
    setReadings({});
    setImage(null);
    setName('');
    setLoading(true);
    const loaded = await readImageFile(file);
    setLoading(false);
    if ('error' in loaded) { setImageError(loaded.error); return; }
    setImageError(null);
    setImage(loaded.data);
    setName(loaded.name);
  }

  async function run(model: ManuscriptModel) {
    if (!image || active.current.has(model)) return;
    active.current.add(model);
    setRunning(r => [...r, model]);
    setReadings(r => ({ ...r, [model]: undefined }));
    try {
      const outcome = await transcribe({ data: { image, model } });
      setReadings(r => ({ ...r, [model]: outcome }));
    } catch {
      setReadings(r => ({ ...r, [model]: { result: null, error: failed } }));
    } finally {
      active.current.delete(model);
      setRunning(r => r.filter(m => m !== model));
    }
  }

  const runBoth = () => { for (const m of manuscriptModels) void run(m.id); };
  const columns = manuscriptModels.map(m => {
    const reading = readings[m.id];
    const result = reading?.result ?? null;
    const score = result?.readable ? compareSource(reference, sourceText(result)) : null;
    return { ...m, result, error: reading?.error ?? null, score };
  });
  const hasReference = reference.trim().length > 0;

  return <main className="manuscript-workspace min-h-dvh">
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 md:px-5 md:py-4">
        <Button asChild variant="ghost"><Link to="/"><ArrowLeft />Սլայդներ</Link></Button>
        <Button asChild variant="ghost"><Link to="/manuscript"><ScanText />Մեկ մոդելով վերծանում</Link></Button>
      </div>
    </header>
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-5 md:py-12">
      <h1 className="font-serif-hy text-3xl font-bold leading-tight md:text-4xl">Մոդելների համեմատություն</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">Ձեռագրի լուսանկար · Մասնագետի վերծանում · Երկու AI մոդել կողք կողքի</p>
      <div className="mt-6 flex items-start gap-3 border-l-4 border-primary bg-muted p-4 text-sm leading-relaxed">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-primary" />
        <p>Տոկոսը ցույց է տալիս միայն այս պատկերի համապատասխանությունը մուտքագրված մասնագետի տեքստին, ոչ մոդելի ընդհանուր ճշտությունը։ Մասնագետի տեքստը AI-ին չի փոխանցվում։</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="min-w-0" aria-labelledby="step-image">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="step-image" className="text-lg font-semibold"><span className="mr-2 text-primary">1</span>Ձեռագրի լուսանկար</h2>
            {image && <Button variant="ghost" size="icon" aria-label="Հեռացնել պատկերը" title="Հեռացնել պատկերը" disabled={busy || loading} onClick={() => { setImage(null); setName(''); setReadings({}); }}><Trash2 /></Button>}
          </div>
          <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Վերբեռնել ձեռագրի պատկեր" disabled={busy || loading} onChange={e => { void selectFile(e.target.files?.[0]); e.target.value = ''; }} />
          <div className="overflow-hidden rounded-md border border-border bg-muted" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); void selectFile(e.dataTransfer.files[0]); }}>
            {image ? <img src={image} alt="Վերբեռնված ձեռագրի պատկեր" className="max-h-[520px] w-full object-contain" />
              : <div className="flex min-h-56 flex-col items-center justify-center gap-4 p-6 text-center md:min-h-72">
                <Upload className="size-9 text-primary" />
                <Button variant="outline" disabled={loading} onClick={() => input.current?.click()}>{loading ? 'Պատկերը բացվում է…' : 'Ընտրել պատկեր'}</Button>
                <p className="text-sm text-muted-foreground">JPG, PNG, WebP · մինչև 5 ՄԲ</p>
              </div>}
          </div>
          {imageError && <p role="alert" className="mt-3 text-sm text-destructive">{imageError}</p>}
          {image && <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><p className="min-w-0 flex-1 break-all text-sm text-muted-foreground">{name}</p><Button variant="outline" size="sm" disabled={busy || loading} onClick={() => input.current?.click()}><Upload />Փոխել</Button></div>}
        </section>

        <section className="flex min-w-0 flex-col" aria-labelledby="step-expert">
          <h2 id="step-expert" className="mb-3 text-lg font-semibold"><span className="mr-2 text-primary">2</span><label htmlFor="expert-text">Մասնագետի վերծանում</label></h2>
          <Textarea id="expert-text" aria-describedby="expert-note" value={reference} onChange={e => setReference(e.target.value)} maxLength={6000} rows={10} placeholder="Նույն պատկերի տողերը՝ բնագրի ուղղագրությամբ…" className="min-h-56 flex-1 font-serif-hy text-base leading-relaxed" />
          <p id="expert-note" className="mt-2 text-xs leading-relaxed text-muted-foreground">Բնագրի ուղղագրությամբ, ոչ արդի փոխադրությամբ · առավելագույնը 6000 նիշ ({reference.length}/6000)։ Տոկոսը թարմանում է տեքստը փոխելիս՝ առանց նոր AI հարցման։</p>
          {reference.includes('[անընթեռնելի]') && <p role="status" className="mt-2 text-sm text-destructive">Չվերծանված հատվածներով տեքստի համար տոկոս չի հաշվարկվում։</p>}
        </section>
      </div>

      <section className="mt-8" aria-labelledby="step-run">
        <h2 id="step-run" className="sr-only">Վերծանել</h2>
        <Button size="lg" className="h-auto min-h-12 w-full whitespace-normal py-3 text-base" disabled={!image || busy || loading} onClick={runBoth}>
          {busy ? <LoaderCircle className="motion-safe:animate-spin" /> : <Columns2 />}
          {busy ? 'Մոդելները վերծանում են…' : <><span className="mr-1 font-semibold">3</span>Վերծանել երկու մոդելով</>}
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">Երկու առանձին վճարովի AI հարցում նույն պատկերով։ Պատկերը և արդյունքները չեն պահվում։</p>
      </section>

      <section className="mt-10" aria-labelledby="results-heading">
        <h2 id="results-heading" className="font-serif-hy text-2xl font-bold">Արդյունքներ</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:hidden" aria-hidden="true">
          {columns.map(c => <div key={c.id} className="rounded-md border border-border p-3">
            <p className="text-xs text-muted-foreground">{c.name}</p>
            <p className="mt-1 text-2xl font-semibold text-primary tabular-nums">{running.includes(c.id) ? '…' : c.score ? `${c.score.agreement.toFixed(1)}%` : '—'}</p>
          </div>)}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {columns.map(c => <ModelReadingColumn key={c.id} name={c.name} result={c.result} error={c.error} score={c.score} hasReference={hasReference} running={running.includes(c.id)} disabled={!image || loading || running.includes(c.id)} onRun={() => void run(c.id)} />)}
        </div>
        <p className="mt-5 max-w-4xl text-xs leading-relaxed text-muted-foreground">CER = նիշային ներդրումների, ջնջումների և փոխարինումների նվազագույն քանակ / մասնագետի բնագրի նիշերի քանակ × 100։ Համապատասխանություն = max(0, 100 − CER)։ Միայն բացատներն ու տողադարձերն են միասնականացվում (Unicode NFC)։ Կետագծով՝ անորոշ, կարմիրով՝ [անընթեռնելի]։</p>
      </section>
    </div>
  </main>;
}
