import { Play, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { compareSource, manuscriptModels, sourceText, type ManuscriptModel } from '@/lib/manuscript-comparison';
import type { Transcription } from '@/lib/manuscript';

export type ModelReading = { result: Transcription | null; error: string | null };

export function ManuscriptComparison({ readings, busyModel, disabled, runModel }: {
  readings: Partial<Record<ManuscriptModel, ModelReading>>;
  busyModel: ManuscriptModel | null;
  disabled: boolean;
  runModel: (model: ManuscriptModel) => void;
}) {
  const [reference, setReference] = useState('');
  return <section className="mt-12 border-t border-border pt-8" aria-labelledby="comparison-heading">
    <h2 id="comparison-heading" className="font-serif-hy text-2xl font-bold">Համեմատություն մասնագետի վերծանման հետ</h2>
    <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">Տոկոսը այս պատկերի բնագրային ընթերցման համապատասխանությունն է մուտքագրված մասնագետի տեքստին, ոչ մոդելի ընդհանուր ճշտությունը կամ վստահությունը։ Հայերեն ձեռագրերի համար հաստատված համեմատական տոկոսներ այստեղ չկան։</p>
    <div className="mt-6">
      <label htmlFor="expert-source" className="font-semibold">Մասնագետի բնագրային վերծանում</label>
      <p id="expert-source-note" className="mb-3 mt-2 text-sm leading-relaxed text-muted-foreground">Նույն պատկերի նույն տողերը՝ բնագրի ուղղագրությամբ, ոչ ժամանակակից փոխադրությամբ։ Առավելագույնը՝ 40 տող / 6000 նիշ։ Բաց թողնված տողերը կամ տարբեր ուղղագրությունը փոխում են ցուցանիշը։</p>
      <Textarea id="expert-source" aria-describedby="expert-source-note" value={reference} onChange={event => setReference(event.target.value)} maxLength={6000} rows={6} className="font-serif-hy leading-relaxed" />
      {reference.includes('[անընթեռնելի]') && <p role="status" className="mt-2 text-sm text-destructive">Չվերծանված հատվածներով մասնագետի տեքստի համար տոկոս չի հաշվարկվում։</p>}
    </div>
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      {manuscriptModels.map(model => {
        const reading = readings[model.id];
        const source = reading?.result ? sourceText(reading.result) : null;
        const score = source !== null && reading?.result?.readable ? compareSource(reference, source) : null;
        const running = busyModel === model.id;
        return <article key={model.id} className="min-w-0 rounded-md border border-border p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold">{model.name}</h3>
            <Button variant="outline" disabled={disabled} onClick={() => runModel(model.id)}>{running ? <LoaderCircle className="motion-safe:animate-spin" /> : <Play />}{running ? 'Վերծանվում է…' : reading?.result ? 'Կրկին վերծանել' : 'Վերծանել'}</Button>
          </div>
          <div aria-live="polite" className="mt-5">
            <p className="text-3xl font-semibold text-primary">{score ? `${score.agreement.toFixed(1)}%` : '—'}</p>
            <p className="mt-1 text-sm text-muted-foreground">Նիշային համապատասխանություն մասնագետի բնագրին</p>
            {score ? <p className="mt-3 text-sm leading-relaxed">CER՝ {score.cer.toFixed(1)}% · {score.edits} նիշային խմբագրում / {score.characters} բնագրային նիշ</p> : <p className="mt-3 text-sm text-muted-foreground">{reading?.error ? 'Վերծանումը չի ավարտվել։' : !source ? 'Դեռ մոդելի արդյունք չկա։' : !reading?.result?.readable ? 'Պատկերից ընթեռնելի տեքստ չի ստացվել։' : 'Պահանջվում է համեմատելի մասնագետի բնագիր։'}</p>}
            {reading?.error && <p role="alert" className="mt-3 break-words text-sm text-destructive">{reading.error}</p>}
            {source !== null && <details className="mt-4 border-t border-border pt-3"><summary className="cursor-pointer font-semibold">Մոդելի բնագրային ընթերցում</summary><p className="mt-3 whitespace-pre-wrap break-words font-serif-hy leading-loose">{source || '[անընթեռնելի]'}</p></details>}
          </div>
        </article>;
      })}
    </div>
    <p className="mt-5 max-w-4xl text-xs leading-relaxed text-muted-foreground">CER = նիշային ներդրումների, ջնջումների և փոխարինումների նվազագույն քանակ / մասնագետի բնագրի նիշերի քանակ × 100։ Համապատասխանություն = max(0, 100 − CER)։ Միայն բացատներն ու տողադարձերն են միասնականացվում (Unicode NFC)․ կետադրությունն ու մեծատառերը հաշվվում են։ [անընթեռնելի] նշումները մոդելի տեքստում չեն հեռացվում։ Սա իմաստային կամ արդի հայերեն փոխադրության գնահատում չէ։</p>
    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Յուրաքանչյուր «Վերծանել» առանձին վճարովի AI հարցում է նույն պատկերով։ Մասնագետի տեքստը AI-ին չի փոխանցվում։ Brainograph-ի մոդելի համեմատությունը հասանելի չէ՝ միացումը հաստատված չէ։</p>
  </section>;
}