import { LoaderCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Transcription } from '@/lib/manuscript';
import type { compareSource } from '@/lib/manuscript-comparison';

type Score = ReturnType<typeof compareSource>;

const segmentClass = (status: string) =>
  status === 'uncertain' ? 'border-b-2 border-dotted border-primary text-primary'
    : status === 'unreadable' ? 'text-destructive' : '';

function Lines({ result, field }: { result: Transcription; field: 'text' | 'modernText' }) {
  if (!result.lines.length) return <p className="text-muted-foreground">[անընթեռնելի]</p>;
  return <div className="font-serif-hy text-base leading-loose md:text-lg">
    {result.lines.map((line, i) => <p key={i} className="break-words">
      <span className="mr-2 font-sans text-xs text-muted-foreground tabular-nums">{i + 1}.</span>
      {line.segments.map((s, j) => <span key={j} className={segmentClass(s.status)} title={s.note || undefined}>{s[field]}</span>)}
    </p>)}
  </div>;
}

export function ModelReadingColumn({ name, result, error, score, hasReference, running, disabled, onRun }: {
  name: string;
  result: Transcription | null;
  error: string | null;
  score: Score;
  hasReference: boolean;
  running: boolean;
  disabled: boolean;
  onRun: () => void;
}) {
  const uncertain = result?.lines.flatMap((line, i) => line.segments.filter(s => s.status !== 'read').map(s => ({ line: i + 1, s }))) ?? [];
  return <article className="flex min-w-0 flex-col rounded-md border border-border bg-muted/40" aria-busy={running}>
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
      <h3 className="text-lg font-semibold">{name}</h3>
      <Button variant="outline" size="sm" disabled={disabled} onClick={onRun}>
        {running ? <LoaderCircle className="motion-safe:animate-spin" /> : <Play />}
        {running ? 'Վերծանվում է…' : result ? 'Կրկին' : 'Վերծանել'}
      </Button>
    </header>
    <div aria-live="polite" className="flex-1 p-4">
      {running && <div className="flex items-center gap-3 py-8 text-muted-foreground"><LoaderCircle className="size-5 motion-safe:animate-spin" />Պատկերի ընթերցումն ընթացքի մեջ է…</div>}
      {!running && error && <p role="alert" className="border-l-4 border-destructive bg-muted p-3 text-sm leading-relaxed">{error}</p>}
      {!running && !error && !result && <p className="py-8 text-muted-foreground">Դեռ արդյունք չկա։</p>}
      {!running && result && <>
        <div className="border-b border-border pb-4">
          <p className="text-4xl font-semibold text-primary tabular-nums">{score ? `${score.agreement.toFixed(1)}%` : '—'}</p>
          <p className="mt-1 text-sm text-muted-foreground">Համապատասխանություն մասնագետի բնագրին</p>
          <p className="mt-2 text-sm">{score ? `CER՝ ${score.cer.toFixed(1)}% · ${score.edits} խմբագրում / ${score.characters} նիշ`
            : !result.readable ? 'Պատկերից ընթեռնելի տեքստ չի ստացվել։'
            : hasReference ? 'Մասնագետի տեքստը համեմատելի չէ (օր.՝ [անընթեռնելի] նշումներ)։'
            : 'Մուտքագրեք մասնագետի վերծանումը՝ տոկոսը տեսնելու համար։'}</p>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
        <h4 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Բնագրի ընթերցում</h4>
        <div className="mt-2"><Lines result={result} field="text" /></div>
        <details className="mt-5 border-t border-border pt-3">
          <summary className="cursor-pointer font-semibold">Արդի արևելահայերեն</summary>
          <div className="mt-3"><Lines result={result} field="modernText" /></div>
        </details>
        {uncertain.length > 0 && <details className="mt-3 border-t border-border pt-3">
          <summary className="cursor-pointer font-semibold">Անորոշ հատվածներ ({uncertain.length})</summary>
          <ol className="mt-3 space-y-3">{uncertain.map(({ line, s }, k) => <li key={k} className="border-l-2 border-primary pl-3 text-sm leading-relaxed">
            <p className="font-semibold">Տող {line} · {s.text}</p>
            <p className="text-muted-foreground">{s.note}</p>
            {s.alternatives.length > 0 && <p className="mt-1">Հնարավոր տարբերակներ (չհաստատված)՝ {s.alternatives.join(' / ')}</p>}
          </li>)}</ol>
        </details>}
        {result.possibleErrors.length > 0 && <details className="mt-3 border-t border-border pt-3">
          <summary className="cursor-pointer font-semibold">Հնարավոր սխալներ</summary>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">{result.possibleErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </details>}
      </>}
    </div>
  </article>;
}
