import { createFileRoute, Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Upload, ScanText, LoaderCircle, Trash2, AlertTriangle, Maximize, Minimize, Columns2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { transcribeManuscript } from '@/lib/manuscript.functions';
import { validateImageFile, type Transcription } from '@/lib/manuscript';
import { ManuscriptComparison, type ModelReading } from '@/components/manuscript-comparison';
import type { ManuscriptModel } from '@/lib/manuscript-comparison';

export const Route = createFileRoute('/manuscript')({
  // Keep this small upload workspace in the entry graph so opening it does not
  // depend on a second, potentially stale route-module URL after an update.
  codeSplitGroupings: [],
  head: () => ({ meta: [
    { title: 'Հայկական ձեռագրի նախնական վերծանում · Պատմություն և AI' },
    { name: 'description', content: 'Հայկական ձեռագրի նախնական ընթերցում՝ ժամանակակից հայերենով, բնագրի և անորոշ հատվածների պահպանմամբ։' },
    { property: 'og:title', content: 'Հայկական ձեռագրի նախնական վերծանում' },
    { property: 'og:description', content: 'Ձեռագրի պատկերն ու ժամանակակից հայերեն ընթերցումը՝ անորոշ հատվածների նշումով։' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: ManuscriptPage,
});

function ManuscriptPage() {
  const input = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [result, setResult] = useState<Transcription | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(false);
  const [readings, setReadings] = useState<Partial<Record<ManuscriptModel, ModelReading>>>({});
  const [busyModel, setBusyModel] = useState<ManuscriptModel | null>(null);
  const requestActive = useRef(false);
  const transcribe = useServerFn(transcribeManuscript);
  const [fullPage, setFullPage] = useState(false);

  useEffect(() => {
    const syncFullscreen = () => setFullPage(Boolean(document.fullscreenElement));
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setFullPage(false); };
    document.addEventListener('fullscreenchange', syncFullscreen);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreen);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  async function toggleFullPage() {
    if (fullPage) {
      if (document.fullscreenElement) {
        try { await document.exitFullscreen(); } catch { return; }
      }
      setFullPage(false);
      return;
    }
    if (document.documentElement.requestFullscreen) {
      try { await document.documentElement.requestFullscreen(); setFullPage(true); return; } catch { /* Use an expanded page when browser fullscreen is unavailable. */ }
    }
    setFullPage(true);
  }

  async function selectFile(file?: File) {
    if (!file || busy || reading) return;
    setResult(null);
    setReadings({});
    setImage(null);
    setName('');
    const invalid = validateImageFile(file);
    setError(invalid);
    if (invalid) return;
    setReading(true);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject();
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await new Promise<void>((resolve, reject) => {
        const preview = new Image();
        preview.onload = () => resolve();
        preview.onerror = reject;
        preview.src = data;
      });
      setImage(data);
      setName(file.name);
    } catch { setError('Պատկերը չի բացվում․ ընտրեք այլ պատկեր։'); }
    finally { setReading(false); }
  }

  async function analyze(model: ManuscriptModel = 'openai/gpt-6-astra') {
    if (!image || requestActive.current || reading) return;
    requestActive.current = true;
    setBusy(true);
    setBusyModel(model);
    if (model === 'openai/gpt-6-astra') { setError(null); setResult(null); }
    setReadings(previous => ({ ...previous, [model]: undefined }));
    try {
      const outcome = await transcribe({ data: { image, model } });
      setReadings(previous => ({ ...previous, [model]: outcome }));
      if (model === 'openai/gpt-6-astra') { setResult(outcome.result); setError(outcome.error); }
    } catch {
      const message = 'Վերծանումը չհաջողվեց․ ստուգեք կապը կամ ընտրեք այլ պատկեր։ Ավտոմատ կրկնություն չի կատարվել։';
      setReadings(previous => ({ ...previous, [model]: { result: null, error: message } }));
      if (model === 'openai/gpt-6-astra') setError(message);
    }
    finally { setBusy(false); setBusyModel(null); requestActive.current = false; }
  }

  return <main className={`manuscript-workspace min-h-dvh bg-background text-foreground ${fullPage ? 'fixed inset-0 z-50 overflow-y-auto' : ''}`}>
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Button asChild variant="ghost"><Link to="/"><ArrowLeft />Սլայդներ</Link></Button>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost"><Link to="/compare"><Columns2 />Համեմատել մոդելները</Link></Button>
          <Button variant="outline" size="icon" aria-label={fullPage ? 'Փակել ամբողջ էկրանը' : 'Ամբողջ էկրան'} title={fullPage ? 'Փակել ամբողջ էկրանը' : 'Ամբողջ էկրան'} aria-pressed={fullPage} onClick={() => void toggleFullPage()}>{fullPage ? <Minimize /> : <Maximize />}</Button>
        </div>
      </div>
    </header>
    <div className="mx-auto max-w-7xl px-5 py-8 md:py-12">
      <h1 className="font-serif-hy text-3xl font-bold leading-tight md:text-4xl">Հայկական ձեռագրի վերծանում</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">Ժամանակակից հայերեն · Բնագրի ընթերցում · Անորոշ հատվածներ</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <Button asChild variant="link" className="h-auto px-0"><a href="https://brainograph.ai" target="_blank" rel="noopener noreferrer">Brainograph.ai ↗</a></Button>
        <span>Հղում · Մոդելի միացումը հաստատված չէ</span>
      </div>
      <div className="mt-6 flex items-start gap-3 border-l-4 border-primary bg-muted p-4 text-sm leading-relaxed">
        <AlertTriangle className="mt-1 size-5 shrink-0 text-primary" />
        <p>Սա նախնական AI ընթերցում է, ոչ հաստատված պատմական աղբյուր։ Մոդելը կարող է սխալվել կամ հորինել տեքստ։ Յուրաքանչյուր տող համեմատեք բնագրի հետ։</p>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="min-w-0" aria-labelledby="image-heading">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="image-heading" className="text-lg font-semibold">Ձեռագրի պատկեր</h2>
            {image && <Button variant="ghost" size="icon" aria-label="Հեռացնել պատկերը" title="Հեռացնել պատկերը" disabled={busy || reading} onClick={() => { setImage(null); setName(''); setResult(null); setError(null); setReadings({}); }}><Trash2 /></Button>}
          </div>
          <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Վերբեռնել ձեռագրի պատկեր" disabled={busy || reading} onChange={e => { void selectFile(e.target.files?.[0]); e.target.value = ''; }} />
          <div className="overflow-hidden rounded-md border border-border bg-muted" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); void selectFile(e.dataTransfer.files[0]); }}>
            {image ? <img src={image} alt="Վերբեռնված հայկական ձեռագրի պատկեր" className="max-h-[650px] w-full object-contain" /> : <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-6 text-center md:min-h-96">
              <Upload className="size-9 text-primary" />
              <Button variant="outline" disabled={busy || reading} onClick={() => input.current?.click()}>{reading ? 'Պատկերը բացվում է…' : 'Ընտրել պատկեր'}</Button>
              <p className="text-sm text-muted-foreground">JPG, PNG, WebP · մինչև 5 ՄԲ</p>
            </div>}
          </div>
          {image && <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><p className="min-w-0 flex-1 break-all text-sm text-muted-foreground">{name}</p><Button variant="outline" disabled={busy || reading} onClick={() => input.current?.click()}><Upload />Փոխել</Button></div>}
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Վերծանման պահին պատկերը փոխանցվում է AI Gateway-ին։ Հավելվածում պատկերը և արդյունքը չեն պահվում․ էջը փակելիս դրանք կկորչեն։ AI օգտագործումը կարող է ծախսել հավելվածի AI հաշվեկշիռը։</p>
          <Button className="mt-5 h-auto min-h-11 w-full whitespace-normal py-3" disabled={!image || busy || reading} onClick={() => void analyze()}>{busy ? <LoaderCircle className="motion-safe:animate-spin" /> : <ScanText />}{busy ? 'Վերծանվում է…' : 'Ստանալ նախնական վերծանում'}</Button>
        </section>
        <section className="min-w-0" aria-labelledby="result-heading" aria-busy={busy}>
          <h2 id="result-heading" className="mb-4 text-lg font-semibold">Տեքստը՝ ժամանակակից հայերենով</h2>
          <div aria-live="polite" className="min-h-64">
            {error && <p role="alert" className="mb-5 border-l-4 border-destructive bg-muted p-4 leading-relaxed">{error}</p>}
            {busy && <div className="flex items-center gap-3 border-y border-border py-8 text-muted-foreground"><LoaderCircle className="size-5 motion-safe:animate-spin" />Պատկերի ընթերցումն ընթացքի մեջ է…</div>}
            {!result && !busy && <div className="border-y border-border py-10 text-muted-foreground">{image ? 'Պատկերը պատրաստ է վերծանման։' : 'Դեռ պատկեր ընտրված չէ։'}</div>}
            {result && <>
              <p className="mb-5 leading-relaxed text-muted-foreground">{result.summary}</p>
              {!result.readable && <p className="mb-5 font-semibold text-destructive">Հուսալի ընթերցում հնարավոր չէ այս պատկերից։</p>}
              <p className="mb-4 text-sm text-muted-foreground">Նախնական փոխադրություն արդի արևելահայերենով, ոչ բառացի բնագիր։</p>
              <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs"><span>Նախնական ընթերցում</span><span className="text-primary">Կետագծով՝ անորոշ</span><span className="text-destructive">[անընթեռնելի]՝ չվերծանված</span></div>
              <div className="border-y border-border py-5 font-serif-hy text-lg leading-loose">
                {result.lines.map((line, i) => <p key={i} className="break-words"><span className="mr-3 font-sans text-xs text-muted-foreground">{i + 1}.</span>{line.segments.map((segment, j) => <span key={j} className={segment.status === 'uncertain' ? 'border-b-2 border-dotted border-primary text-primary' : segment.status === 'unreadable' ? 'text-destructive' : ''} title={segment.note || undefined}>{segment.modernText}</span>)}</p>)}
              </div>
              <details className="mt-5 border-b border-border pb-5">
                <summary className="cursor-pointer font-semibold">Բնագրի նախնական ընթերցում</summary>
                <div className="mt-4 font-serif-hy text-lg leading-loose">{result.lines.map((line, i) => <p key={i} className="break-words"><span className="mr-3 text-xs text-muted-foreground">{i + 1}.</span>{line.segments.map((s, j) => <span key={j} className={s.status === 'uncertain' ? 'border-b-2 border-dotted border-primary text-primary' : s.status === 'unreadable' ? 'text-destructive' : ''} title={s.note || undefined}>{s.text}</span>)}</p>)}</div>
              </details>
              {result.lines.some(l => l.segments.some(s => s.status !== 'read')) && <div className="mt-6"><h3 className="font-semibold">Անորոշ հատվածներ</h3><ol className="mt-3 space-y-4">{result.lines.flatMap((line, i) => line.segments.filter(s => s.status !== 'read').map((s, j) => <li key={`${i}-${j}`} className="border-l-2 border-primary pl-4 text-sm leading-relaxed"><p className="font-semibold">Տող {i + 1} · {s.text}</p><p className="text-muted-foreground">{s.note}</p>{s.alternatives.length > 0 && <p className="mt-1">Հնարավոր տարբերակներ (չհաստատված)՝ {s.alternatives.join(' / ')}</p>}</li>))}</ol></div>}
              <h3 className="mt-6 font-semibold">Հնարավոր սխալներ</h3>
              {result.possibleErrors.length ? <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">{result.possibleErrors.map((e, i) => <li key={i}>{e}</li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">Մոդելը հատուկ սխալ չի նշել․ սա չի հաստատում ընթերցման ճշտությունը։</p>}
              <h3 className="mt-6 font-semibold">Սահմանափակումներ</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">{result.limitations.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </>}
          </div>
        </section>
      </div>
      <ManuscriptComparison key={image ?? 'empty'} readings={readings} busyModel={busyModel} disabled={!image || busy || reading} runModel={model => void analyze(model)} />
    </div>
  </main>;
}