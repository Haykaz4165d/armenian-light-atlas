import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from '@/components/ui/button';
import { Columns2, ScanText, Upload } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from "react";
import hero from "@/assets/hero.jpg";
import manuscript from "@/assets/manuscript.jpg";
import computer from "@/assets/computer.jpg";
import shirakatsi from "@/assets/shirakatsi.jpg";
import byurakan from "@/assets/byurakan.jpg";
import chess from "@/assets/chess.jpg";
import manuscriptPage from "@/assets/manuscript-page.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Հայոց պատմությունը և արհեստական բանականությունը" },
      { name: "description", content: "Պրեզենտացիա՝ Մաշտոցից մինչև արհեստական բանականություն. հայ գիտական մտքի ճանապարհը։" },
      { property: "og:title", content: "Հայոց պատմությունը և արհեստական բանականությունը" },
      { property: "og:description", content: "Մաշտոցից մինչև արհեստական բանականություն" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Armenian:wght@400;600&family=Noto+Serif+Armenian:wght@600;700&display=swap" },
    ],
  }),
  component: Deck,
});

// Letters with their traditional numeric values (Ա = 1 … Ք = 9000).
const alphabet: [string, number][] = [
  ["Ա", 1], ["Բ", 2], ["Գ", 3], ["Դ", 4], ["Ե", 5], ["Զ", 6], ["Է", 7], ["Ը", 8], ["Թ", 9],
  ["Ժ", 10], ["Ի", 20], ["Լ", 30], ["Խ", 40], ["Ծ", 50], ["Կ", 60], ["Հ", 70], ["Ձ", 80], ["Ղ", 90],
];

function LetterRing({ items, radius, className }: { items: [string, number | null][]; radius: number; className: string }) {
  return (
    <div className={`letter-stage ${className}`} aria-hidden="true">
      <div className="letter-ring">
        {items.map(([l, v], k) => (
          <div key={l} className="letter-glyph" style={{ transform: `rotateY(${(360 / items.length) * k}deg) translateZ(${radius}px)` }}>
            <span>{l}</span>
            {v !== null && <small>{v}</small>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageSlide({ img, kicker, title, children, extra }: { img: string; kicker: string; title: string; children: ReactNode; extra?: ReactNode }) {
  return (
    <>
      <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="slide-overlay absolute inset-0" />
      {extra}
      <div className="relative flex h-full max-w-[1000px] flex-col justify-center gap-8 px-[120px]">
        <div className="slide-kicker">{kicker}</div>
        <h2 className="slide-title">{title}</h2>
        {children}
      </div>
    </>
  );
}

const slides: ReactNode[] = [
  <>
    <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
    <div className="slide-overlay absolute inset-0" />
    <LetterRing items={alphabet.slice(0, 12).map(([l]) => [l, null])} radius={320} className="left-[1090px] top-[120px] h-[840px] w-[620px]" />
    <div className="relative flex h-full max-w-[1100px] flex-col justify-center gap-10 px-[120px]">
      <div className="slide-kicker">Պատմություն · Գիտություն · Ապագա</div>
      <h1 className="slide-title-lg">Հայոց պատմությունը և արհեստական բանականությունը</h1>
      <p className="slide-body">Մաշտոցի տառերից մինչև նեյրոնային ցանցեր․ ինչպես է հայ միտքը դարեր շարունակ կառուցել տեղեկատվության և տրամաբանության համակարգեր։</p>
      <Button asChild variant="secondary" className="deck-btn h-auto self-start whitespace-normal px-10 py-6 text-[32px] [&_svg]:size-9">
        <Link to="/manuscript"><Upload />Վերբեռնել ձեռագրի պատկեր</Link>
      </Button>
    </div>
  </>,
  <ImageSlide img={manuscript} kicker="405 թ." title="Այբուբենը՝ առաջին «կոդը»" extra={<LetterRing items={alphabet} radius={340} className="left-[1020px] top-[120px] h-[840px] w-[760px]" />}>
    <p className="slide-body">Մեսրոպ Մաշտոցը ստեղծեց 36 տառից բաղկացած հայոց այբուբենը։ Յուրաքանչյուր տառ ուներ նաև թվային արժեք․ սա տեղեկատվության կոդավորման համակարգ էր։</p>
    <p className="slide-body">Արհեստական բանականությունն այսօր նույնպես աշխատում է կոդավորված նշաններով՝ տառերը վերածելով թվերի (տոկենների)։</p>
  </ImageSlide>,
  <ImageSlide img={shirakatsi} kicker="VII դար" title="Անանիա Շիրակացի">
    <p className="slide-body">Մաթեմատիկոս, աստղագետ և աշխարհագրագետ։ Նրա թվաբանական խնդրագիրքը աշխարհի հնագույն պահպանված դասագրքերից է։</p>
    <p className="slide-body">Ալգորիթմական մտածողությունը՝ խնդիրը քայլերով լուծելը, արհեստական բանականության հիմքն է։</p>
  </ImageSlide>,
  <ImageSlide img={manuscript} kicker="Մատենադարան" title="Հիշողությունը թվային դարաշրջանում">
    <div className="flex gap-12">
      <div><div className="slide-stat">~23 000</div><p className="slide-body">ձեռագիր և պատառիկ</p></div>
    </div>
    <p className="slide-body">Արհեստական բանականությունը օգնում է թվայնացնել ձեռագրերը, ճանաչել հին գրչության տառերը (OCR) և վերականգնել վնասված էջերը։</p>
  </ImageSlide>,
  <ImageSlide img={computer} kicker="1956 թ." title="Երևանը՝ հաշվողական տեխնիկայի կենտրոն">
    <p className="slide-body">Ակադեմիկոս Սերգեյ Մերգելյանի գլխավորությամբ հիմնադրվեց Երևանի մաթեմատիկական մեքենաների գիտահետազոտական ինստիտուտը։</p>
    <p className="slide-body">Այստեղ ստեղծվեցին «Հրազդան» և «Նաիրի» համակարգիչները, որոնք օգտագործվում էին ողջ ԽՍՀՄ-ում։</p>
  </ImageSlide>,
  <ImageSlide img={byurakan} kicker="1946 թ." title="Բյուրականը և տվյալների գիտությունը">
    <p className="slide-body">Վիկտոր Համբարձումյանը հիմնադրեց Բյուրականի աստղադիտարանը։ Մարգարյանի ցուցակը համակարգեց հազարավոր գալակտիկաների դիտարկումներ։</p>
    <p className="slide-body">Այսօր նման հսկայական աստղագիտական տվյալները վերլուծվում են մեքենայական ուսուցմամբ։</p>
  </ImageSlide>,
  <ImageSlide img={chess} kicker="Տրամաբանություն" title="Շախմատը՝ AI-ի փորձադաշտ">
    <p className="slide-body">Տիգրան Պետրոսյանը 1963 թ. դարձավ աշխարհի չեմպիոն, իսկ 2011 թ.-ից շախմատը պարտադիր առարկա է հայկական դպրոցներում։</p>
    <p className="slide-body">Շախմատը տասնամյակներ շարունակ եղել է AI-ի հիմնական փորձադաշտը՝ Deep Blue-ից մինչև AlphaZero։</p>
  </ImageSlide>,
  <div className="flex h-full flex-col justify-center gap-14 px-[120px]">
    <div className="slide-kicker">Այսօր</div>
    <h2 className="slide-title">Ժամանակակից Հայաստանը և AI-ը</h2>
    <div className="grid grid-cols-3 gap-10">
      {[
        ["Կրթություն", "«Թումո» ստեղծարար տեխնոլոգիաների կենտրոնը (2011) դեռահասներին սովորեցնում է ծրագրավորում և մեքենայական ուսուցում։"],
        ["Ընկերություններ", "Հայաստանում հիմնադրված Picsart-ը AI գործիքներով ծառայում է միլիոնավոր օգտատերերի աշխարհով մեկ։"],
        ["Հայերենը AI-ում", "Հայերեն լեզվական մոդելներ, խոսքի ճանաչում և մեքենայական թարգմանություն՝ լեզվի թվային ապագայի համար։"],
      ].map(([t, d]) => (
        <div key={t} className="slide-card">
          <h3 className="slide-kicker mb-5">{t}</h3>
          <p className="slide-body">{d}</p>
        </div>
      ))}
    </div>
  </div>,
  <ImageSlide img={hero} kicker="Ժառանգության պահպանում" title="Ինչպես է AI-ը ծառայում պատմությանը">
    <ul className="slide-body flex list-none flex-col gap-5">
      <li>◆ Գրաբար տեքստերի թարգմանություն և վերլուծություն</li>
      <li>◆ Խաչքարերի և հուշարձանների 3D վերակառուցում</li>
      <li>◆ Հին լուսանկարների և ձեռագրերի վերականգնում</li>
      <li>◆ Արխիվային տվյալների արագ որոնում</li>
    </ul>
  </ImageSlide>,
  <ImageSlide img={shirakatsi} kicker="VII–IX դդ." title="Պավլիկյաններ">
    <p className="slide-body">Միջնադարյան աղանդավորական շարժում, որը ծագեց Հայաստանում և տարածվեց Բյուզանդիայում։ Նրանք մերժում էին եկեղեցական աստիճանակարգը և ծեսերը։</p>
    <p className="slide-body">IX դարում պավլիկյանները ստեղծեցին իրենց ամրացված կենտրոնը՝ Տեփրիկեն, մինչև Բյուզանդիայի կողմից պարտվելը (872 թ.)։</p>
    <p className="slide-caption opacity-80">Աղբյուրներ․ Պետրոս Սիցիլիացի (IX դ.) · Նինա Գարսոյան, «The Paulician Heresy» (1967) · Հրանտ Բարթիկյան</p>
  </ImageSlide>,
  <ImageSlide img={manuscript} kicker="IX–XI դդ." title="Թոնդրակյաններ">
    <p className="slide-body">Շարժումը հիմնադրեց Սմբատ Զարեհավանցին Թոնդրակ գավառում։ Թոնդրակյանները քննադատում էին եկեղեցու հարստությունն ու սոցիալական անարդարությունը։</p>
    <p className="slide-body">Նրանց մասին գիտենք հիմնականում հակառակորդների՝ Գրիգոր Մագիստրոսի և Գրիգոր Նարեկացու գրվածքներից։</p>
    <p className="slide-caption opacity-80">Աղբյուրներ․ Գրիգոր Մագիստրոս, «Թուղթ առ թոնդրակեցիս» · Գրիգոր Նարեկացի, «Թուղթ ընդդեմ ծխնեցոյ» · Արամ Տեր-Ղևոնդյան, «Թոնդրակյան շարժումը» (1955)</p>
  </ImageSlide>,
  <div className="flex h-full flex-col justify-center gap-14 px-[120px]">
    <div className="slide-kicker">AI մեթոդներ</div>
    <h2 className="slide-title">Տեխնոլոգիաները, որոնք բացում են անցյալը</h2>
    <div className="grid grid-cols-3 gap-10">
      {[
        ["Ձեռագիր ճանաչում (HTR)", "Նեյրոնային ցանցերը սովորում են կարդալ գրաբար ձեռագրերը՝ թվայնացնելով այն, ինչ մարդը կկարդար տարիներով։"],
        ["Լեզվական մոդելներ", "Գրաբար և միջին հայերեն տեքստերի վրա ուսուցված մոդելները կարող են թարգմանել, ամփոփել և համեմատել աղբյուրները։"],
        ["Գիտելիքի գրաֆներ", "AI-ը կապում է անձին, վայրերը և իրադարձությունները մեկ ցանցի մեջ՝ բացահայտելով պատմության թաքնված կապերը։"],
      ].map(([t, d]) => (
        <div key={t} className="slide-card">
          <h3 className="slide-kicker mb-5">{t}</h3>
          <p className="slide-body">{d}</p>
        </div>
      ))}
    </div>
  </div>,
  <div className="flex h-full flex-col justify-center gap-7 px-[120px] py-10">
    <div>
      <div className="slide-kicker">Գործնական օրինակ</div>
      <h2 className="slide-title mt-4">Ձեռագրից դեպի վերծանված տեքստ</h2>
    </div>
    <div className="grid grid-cols-[700px_1fr] gap-9">
      <figure className="slide-figure">
        <img src={manuscriptPage} alt="Գրաբար ձեռագրի էջ՝ խորանարդագրով, կարմիր վերնագրով և մակագրությամբ" loading="lazy" width={1200} height={912} className="h-[460px] w-full object-cover object-top" />
        <figcaption className="px-7 py-5">
          <div className="slide-kicker mb-2">Քայլ 01 · Նախապատրաստում</div>
          <p className="slide-note">Էջը սկանավորվում և մաքրվում է ճանաչման համար (ցուցադրական պատկեր)։</p>
        </figcaption>
      </figure>
      <div className="flex flex-col gap-4">
        <div className="slide-card-sm">
          <div className="slide-kicker mb-3">Քայլ 02 · Ձեռագիր ճանաչում</div>
          <p className="slide-grabar">«Ի տօն մեծի Վարդաւառի, ի ձեռս <span className="slide-lowconf">գրչին</span> Յակոբայ, գրիս զսա ի յիշատակ»</p>
          <p className="slide-caption mt-3">Կարմիրը՝ ցածր վստահությամբ հատվածն է։ Տողը ցուցադրական է։</p>
        </div>
        <div className="slide-card-sm">
          <div className="slide-kicker mb-3">Քայլ 03 · Լեզվական մոդել</div>
          <p className="slide-body text-[25px]">«Մեծ Վարդավառի տոնին, գրիչ Հակոբի ձեռքով, սա գրվեց հիշատակի»։</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="slide-chip">անուն՝ Հակոբ (գրիչ)</span>
            <span className="slide-chip">տոն՝ Վարդավառ</span>
            <span className="slide-chip">տեսակ՝ հիշատակարան</span>
          </div>
        </div>
        <div className="slide-card-sm" style={{ borderLeftColor: "var(--deck-red)" }}>
          <div className="slide-kicker mb-3">Քայլ 04 · Մասնագետի ստուգում</div>
          <p className="slide-body text-[25px]">«Վարդաւառի» → «Վարդավառի»․ մակրդելն ու ամսաթիվը ճշտում է պատմաբանը։</p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-6">
      {[
        ["01", "Նախապատրաստում", "Սկանավորում, մաքրում, դասավորում"],
        ["02", "Ձեռագիր ճանաչում", "Պատկերը՝ գրաբար տեքստի"],
        ["03", "Լեզվական մոդել", "Թարգմանություն, ամփոփում, բացահայտում"],
        ["04", "Մասնագետի ստուգում", "Համեմատում բնագրի հետ, ուղղում"],
      ].map(([n, t, d]) => (
        <div key={n} className="slide-card-sm">
          <div className="slide-kicker mb-2">{n}</div>
          <h3 className="slide-step mb-2">{t}</h3>
          <p className="slide-note">{d}</p>
        </div>
      ))}
    </div>
  </div>,
  <div className="flex h-full flex-col justify-center gap-12 px-[120px] py-12">
    <div>
      <div className="slide-kicker">Գործնական օրինակ</div>
      <h2 className="slide-title mt-5">Ինչ է ստացվում և ինչն է դժվար</h2>
    </div>
    <div className="grid grid-cols-2 gap-10">
      <div className="slide-card">
        <h3 className="slide-kicker mb-5">Ինչ է ստացվում</h3>
        <ul className="slide-body flex list-none flex-col gap-4">
          <li>◆ Որոնելի տեքստ հազարավոր էջերից</li>
          <li>◆ Անհայտ բառերի և անունների բացահայտում</li>
          <li>◆ Կրկնվող հատվածների հայտնաբերում</li>
        </ul>
      </div>
      <div className="slide-card" style={{ borderLeftColor: "var(--deck-red)" }}>
        <h3 className="slide-kicker mb-5">Սահմանափակումներ</h3>
        <ul className="slide-body flex list-none flex-col gap-4">
          <li>◆ Պիտակավորված գրաբար տվյալ շատ քիչ է</li>
          <li>◆ Վնասված տառերն ու մակրդելները սխալ են</li>
          <li>◆ Մոդելը կարող է կեղծ փաստ առաջացնել</li>
        </ul>
      </div>
    </div>
    <p className="slide-caption opacity-80">Ամեն արդյունք վերջում ստուգում է մասնագետը․ AI-ը միայն առաջարկում է ընթերցանության տարբերակներ։</p>
  </div>,
  <div className="flex h-full flex-col justify-center gap-14 px-[120px]">
    <div className="slide-kicker">Աղանդավորներ և AI</div>
    <h2 className="slide-title">Ինչպես կարող է AI-ը օգնել ուսումնասիրել աղանդները</h2>
    <div className="grid grid-cols-3 gap-10">
      {[["Տեքստային վերլուծություն","Հակաաղանդավորական թղթերում պահպանված ուսմունքի բեկորների հավաքում և համեմատություն։"],["Աղբյուրների կողմնակալություն","AI-ը կարող է նկատել, թե որտեղ է հեղինակը թշնամաբար տրամադրված, որպեսզի պատմաբանը ավելի օբյեկտիվ լինի։"],["Քարտեզագրում","Պավլիկյանների և թոնդրակյանների տարածման ուղիների թվային քարտեզներ։"]].map(([t,d])=>(
        <div key={t} className="slide-card"><h3 className="slide-kicker mb-5">{t}</h3><p className="slide-body">{d}</p></div>
      ))}
    </div>
  </div>,
  <div className="flex h-full flex-col justify-center gap-8 px-[120px]">
    <div className="slide-kicker">Պատմական աղբյուրներ և գրականություն</div>
    <h2 className="slide-title">Ուսումնասիրության հիմքը</h2>
    <div className="grid grid-cols-2 gap-10">
      <div className="slide-card">
        <h3 className="slide-kicker mb-5">Առաջնային աղբյուրներ</h3>
        <ul className="slide-body flex list-none flex-col gap-4">
          <li>◆ Պետրոս Սիցիլիացի — «Պատմություն պավլիկյանների մասին» (IX դ.)</li>
          <li>◆ Գրիգոր Մագիստրոս — «Թուղթ առ թոնդրակեցիս» (XI դ.)</li>
          <li>◆ Գրիգոր Նարեկացի — «Թուղթ ընդդեմ ծխնեցոյ» (X դ.)</li>
          <li>◆ Արիստակես Լաստիվերցի — «Պատմություն» (XI դ.)</li>
          <li>◆ «Ճշմարտության բանալին» — թոնդրակյան ուսմունքի ձեռագիր</li>
        </ul>
      </div>
      <div className="slide-card">
        <h3 className="slide-kicker mb-5">Ժամանակակից ուսումնասիրություններ</h3>
        <ul className="slide-body flex list-none flex-col gap-4">
          <li>◆ Նինա Գարսոյան — «The Paulician Heresy» (1967)</li>
          <li>◆ Արամ Տեր-Ղևոնդյան — «Թոնդրակյան շարժումը» (1955)</li>
          <li>◆ Հրանտ Բարթիկյան — պավլիկյանների և թոնդրակյանների աշխատություններ</li>
          <li>◆ «Հայոց պատմություն» բազմահատորյակ, ՀՀ ԳԱԱ</li>
          <li>◆ Մատենադարանի թվայնացված ձեռագրերի ֆոնդ</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-[color:var(--deck-accent)] pt-5">
      <p className="slide-caption"><span className="text-deck-accent">Լրացուցիչ թվային աղբյուր․ </span><a href="https://brainograph.ai" target="_blank" rel="noopener noreferrer" className="text-deck-ink underline underline-offset-4">brainograph.ai ↗</a> · Դիտված՝ 12.11.2026</p>
      <p className="slide-note mt-3">Գլխավոր էջի մեջբերում․ «Ճանաչել զիմաստութիւն եւ զխրատ, իմանալ զբանս հանճարոյ»։</p>
      <p className="slide-note mt-2">Հանրային էջը պատմական նյութեր չի ներկայացնում․ այս հղումը չի հիմնավորում Պավլիկյանների և Թոնդրակյանների մասին պնդումները։</p>
    </div>
  </div>,
  <div className="flex h-full flex-col justify-center gap-16 px-[120px]">
    <div className="slide-kicker">Ժամանակագրություն</div>
    <h2 className="slide-title">Գիտելիքի 1600-ամյա ճանապարհը</h2>
    <div className="grid grid-cols-5 gap-8 border-t-4 border-[color:var(--deck-accent)] pt-10">
      {[["405","Հայոց այբուբեն"],["VII դ.","Շիրակացու թվաբանություն"],["1956","Մաթեմատիկական մեքենաների ինստիտուտ"],["2011","«Թումո» կենտրոն"],["Այսօր","Հայերեն AI լուծումներ"]].map(([y,t])=>(
        <div key={y}><div className="slide-stat mb-4 text-[72px]">{y}</div><p className="slide-body">{t}</p></div>
      ))}
    </div>
  </div>,
  <div className="flex h-full flex-col justify-center gap-14 px-[120px]">
    <div className="slide-kicker">Մարտահրավերներ</div>
    <h2 className="slide-title">Ինչ է պետք անել</h2>
    <div className="grid grid-cols-2 gap-10">
      {[["Տվյալներ","Հայերեն թվային տեքստերը քիչ են․ անհրաժեշտ է թվայնացնել արխիվները։"],["Էթիկա","Պատմական փաստերը պետք է ստուգվեն մասնագետների կողմից, ոչ միայն AI-ով։"],["Կրթություն","Նոր սերնդի AI մասնագետների պատրաստում դպրոցից սկսած։"],["Համագործակցություն","Պատմաբանների, լեզվաբանների և ծրագրավորողների համատեղ աշխատանք։"]].map(([t,d])=>(
        <div key={t} className="slide-card"><h3 className="slide-kicker mb-4">{t}</h3><p className="slide-body">{d}</p></div>
      ))}
    </div>
  </div>,
  <div className="flex h-full flex-col items-start justify-center gap-10 px-[120px]">
    <div className="slide-kicker">Եզրակացություն</div>
    <h2 className="slide-title-lg max-w-[1500px]">Անցյալը՝ որպես տվյալ, ապագան՝ որպես հնարավորություն</h2>
    <p className="slide-body max-w-[1100px]">Մաշտոցից մինչև Մերգելյան, Մատենադարանից մինչև նեյրոնային ցանցեր․ հայ միտքը միշտ եղել է գիտելիքի պահապան և նորարար։</p>
  </div>,
  <>
    <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 slide-overlay" />
    <div className="relative flex h-full flex-col items-center justify-center gap-8 text-center">
      <h2 className="slide-title-lg">Շնորհակալություն</h2>
      <p className="slide-body">Հարցեր և քննարկում</p>
    </div>
  </>,
];

function Deck() {
  const [{ i, prev, dir }, setNav] = useState({ i: 0, prev: -1, dir: 1 });
  const [scale, setScale] = useState(0.2);
  const box = useRef<HTMLDivElement>(null);
  const touch = useRef(0);
  const go = (d: number) => setNav((s) => {
    const n = Math.max(0, Math.min(slides.length - 1, s.i + d));
    return n === s.i ? s : { i: n, prev: s.i, dir: d > 0 ? 1 : -1 };
  });
  // Pointer position drives a gentle 3D tilt through CSS variables, without re-rendering.
  const tilt = (x: number, y: number) => {
    const el = box.current;
    if (!el) return;
    el.style.setProperty("--tx", x.toFixed(3));
    el.style.setProperty("--ty", y.toFixed(3));
  };

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(el.clientWidth / 1920, el.clientHeight / 1080)));
    ro.observe(el);
    const key = (e: KeyboardEvent) => {
      if (["ArrowRight", " ", "PageDown"].includes(e.key)) go(1);
      if (["ArrowLeft", "PageUp"].includes(e.key)) go(-1);
    };
    window.addEventListener("keydown", key);
    return () => { ro.disconnect(); window.removeEventListener("keydown", key); };
  }, []);

  return (
    <div className="deck-root flex h-[100dvh] flex-col">
      <div className="flex flex-wrap justify-end gap-2 px-3 pt-3">
        <Button asChild variant="secondary" className="deck-btn"><Link to="/compare"><Columns2 />Համեմատել</Link></Button>
        <Button asChild variant="secondary" className="deck-btn"><Link to="/manuscript"><ScanText />Վերծանել ձեռագիր</Link></Button>
      </div>
      <div
        ref={box}
        className="relative flex-1 overflow-hidden"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          tilt(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
        }}
        onPointerLeave={() => tilt(0, 0)}
        onTouchStart={(e) => (touch.current = (e.touches[0]?.clientX ?? 0))}
        onTouchEnd={(e) => { const dx = (e.changedTouches[0]?.clientX ?? 0) - touch.current; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); }}
      >
        <div className="slide-content" style={{ transform: `scale(${scale})`, ["--d" as string]: dir }}>
          {prev >= 0 && (
            <div
              key={`out-${prev}`}
              className="slide-face slide-exit"
              aria-hidden="true"
              onAnimationEnd={(e) => { if (e.target === e.currentTarget) setNav((s) => ({ ...s, prev: -1 })); }}
            >
              {slides[prev]}
            </div>
          )}
          <div key={`in-${i}`} className={`slide-face${prev >= 0 ? " slide-enter" : ""}`}>{slides[i]}</div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 p-3 text-sm">
        <button className="deck-btn rounded-full px-4 py-2" onClick={() => go(-1)} aria-label="Նախորդ">←</button>
        <span className="text-deck-ink tabular-nums">{i + 1} / {slides.length}</span>
        <button className="deck-btn rounded-full px-4 py-2" onClick={() => go(1)} aria-label="Հաջորդ">→</button>
        <button className="deck-btn rounded-full px-4 py-2" onClick={() => document.documentElement.requestFullscreen?.()}>Ամբողջ էկրան</button>
      </div>
    </div>
  );
}
