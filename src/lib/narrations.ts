// Generated portraits, voices and narration texts for the talking pictures on the slides.

import guidePortrait from '@/assets/narrator-guide.jpg';
import guideVideo from '@/assets/narrator-guide.mp4.asset.json';
import mashtotsPortrait from '@/assets/narrator-mashtots.jpg';
import mashtotsVideo from '@/assets/narrator-mashtots.mp4.asset.json';
import shirakatsiPortrait from '@/assets/narrator-shirakatsi.jpg';
import shirakatsiVideo from '@/assets/narrator-shirakatsi.mp4.asset.json';
import scribePortrait from '@/assets/narrator-scribe.jpg';
import engineerPortrait from '@/assets/narrator-engineer.jpg';
import astronomerPortrait from '@/assets/narrator-astronomer.jpg';
import chessPortrait from '@/assets/narrator-chess.jpg';
import chroniclerPortrait from '@/assets/narrator-chronicler.jpg';
import titleAudio from '@/assets/narration-title.mp3.asset.json';
import alphabetAudio from '@/assets/narration-alphabet.mp3.asset.json';
import shirakatsiAudio from '@/assets/narration-shirakatsi.mp3.asset.json';
import matenadaranAudio from '@/assets/narration-matenadaran.mp3.asset.json';
import computerAudio from '@/assets/narration-computer.mp3.asset.json';
import byurakanAudio from '@/assets/narration-byurakan.mp3.asset.json';
import chessAudio from '@/assets/narration-chess.mp3.asset.json';
import heritageAudio from '@/assets/narration-heritage.mp3.asset.json';
import pauliciansAudio from '@/assets/narration-paulicians.mp3.asset.json';
import tondrakiansAudio from '@/assets/narration-tondrakians.mp3.asset.json';
import thanksAudio from '@/assets/narration-thanks.mp3.asset.json';

export type Narrator = { name: string; role: string; portrait: string; video: string | null };

const narrators = {
  guide: { name: "Ուղեցույց-պատմաբան", role: "Մեր ճանապարհորդության ուղեկիցը", portrait: guidePortrait, video: guideVideo.url },
  mashtots: { name: "Մեսրոպ Մաշտոց", role: "Հայոց այբուբենի ստեղծող · V դար", portrait: mashtotsPortrait, video: mashtotsVideo.url },
  shirakatsi: { name: "Անանիա Շիրակացի", role: "Մաթեմատիկոս և աստղագետ · VII դար", portrait: shirakatsiPortrait, video: shirakatsiVideo.url },
  scribe: { name: "Գրիչ", role: "Միջնադարյան ձեռագրերի արտագրող", portrait: scribePortrait, video: null },
  engineer: { name: "Ինժեներ", role: "Երևանի մաթեմատիկական մեքենաների ինստիտուտ", portrait: engineerPortrait, video: null },
  astronomer: { name: "Աստղագետ", role: "Բյուրականի աստղադիտարան", portrait: astronomerPortrait, video: null },
  chess: { name: "Շախմատի մարզիչ", role: "Հայկական շախմատի դպրոց", portrait: chessPortrait, video: null },
  chronicler: { name: "Պատմիչ", role: "Միջնադարյան տարեգիր", portrait: chroniclerPortrait, video: null },
} satisfies Record<string, Narrator>;

export type Narration = { narrator: Narrator; text: string; audio: string };

export const narrations = {
  title: { narrator: narrators.guide, audio: titleAudio.url, text: "Բարև ձեզ։ Ես ձեր ուղեցույցն եմ այս ճանապարհորդության ընթացքում։ Մենք կանցնենք տասնվեց դար՝ Մեսրոպ Մաշտոցի տառերից մինչև այսօրվա նեյրոնային ցանցերը։ Կտեսնենք, որ հայ միտքը միշտ փնտրել է կարգ ու օրինաչափություն՝ թվերի, աստղերի, ձեռագրերի ու մեքենաների մեջ։ Իսկ արհեստական բանականությունը այդ երկար որոնման նոր շարունակությունն է։ Սեղմեք յուրաքանչյուր նկարի վրա, և նրա հերոսը ինքը կպատմի իր պատմությունը։" },
  alphabet: { narrator: narrators.mashtots, audio: alphabetAudio.url, text: "Ես Մեսրոպ Մաշտոցն եմ։ Չորս հարյուր հինգ թվականին, Սահակ Պարթևի և Վռամշապուհ արքայի աջակցությամբ, ես ստեղծեցի հայոց այբուբենը։ Երեսունվեց տառ, որոնցից յուրաքանչյուրը նաև թիվ էր նշանակում․ Այբը՝ մեկ, Բենը՝ երկու, իսկ Քե տառը՝ ինը հազար։ Առաջին նախադասությունը, որ գրվեց նոր տառերով, Սողոմոնի առակներից էր․ «Ճանաչել զիմաստութիւն եւ զխրատ, իմանալ զբանս հանճարոյ»։ Տառն ինձ համար գիտելիքը պահելու և փոխանցելու կոդ էր։ Այսօր մեքենաներն էլ են տեքստը թվերի վերածում, որպեսզի հասկանան այն։" },
  shirakatsi: { narrator: narrators.shirakatsi, audio: shirakatsiAudio.url, text: "Ես Անանիա Շիրակացին եմ՝ յոթերորդ դարի գիտնական Շիրակից։ Երիտասարդ տարիներին ճանապարհ ընկա գիտելիք փնտրելու և Տրապիզոնում աշակերտեցի Տյուքիկոս վարդապետին։ Վերադառնալով հայրենիք՝ դասավանդեցի մաթեմատիկա, աստղագիտություն և աշխարհագրություն։ Գրեցի թվաբանության դասագիրք և զվարճալի խնդիրների ժողովածու, որոնք աշակերտները լուծում էին քայլ առ քայլ։ Ես համոզված էի, որ Երկիրը գնդաձև է, իսկ Ծիր Կաթինը բազում աղոտ աստղերի լույսն է։ Խնդիրը մաս-մաս բաժանել և հետևողական քայլերով լուծել․ սա է ալգորիթմը, որի վրա այսօր կառուցված է արհեստական բանականությունը։" },
  matenadaran: { narrator: narrators.scribe, audio: matenadaranAudio.url, text: "Ես գրիչ եմ՝ այն հազարավոր վանականներից մեկը, որոնք դարեր շարունակ մոմի լույսի տակ ձեռագրեր էին արտագրում։ Մեկ մատյանի վրա երբեմն տարիներ էինք աշխատում, իսկ վերջում հիշատակարան էինք գրում՝ մեր անունով, տարեթվով ու մեր օրերի պատմությամբ։ Պատերազմների ու հրդեհների ժամանակ մարդիկ ձեռագրերը փրկում էին ինչպես սեփական երեխաներին։ Այսօր Երևանի Մատենադարանում պահվում է մոտ քսաներեք հազար ձեռագիր և պատառիկ։ Արհեստական բանականությունն օգնում է դրանք թվայնացնել, կարդալ հին գրչությունը և վայրկյանների ընթացքում որոնել տեքստերը։ Բայց վերջնական խոսքը միշտ մասնագետինն է։" },
  computer: { narrator: narrators.engineer, audio: computerAudio.url, text: "Ես ինժեներ եմ Երևանի մաթեմատիկական մեքենաների գիտահետազոտական ինստիտուտից։ Այն հիմնադրվեց հազար ինը հարյուր հիսունվեց թվականին, և նրա առաջին տնօրենը դարձավ ակադեմիկոս Սերգեյ Մերգելյանը։ Մեր լաբորատորիաներում ծնվեցին «Հրազդան» և «Նաիրի» համակարգիչները, որոնք աշխատում էին Խորհրդային Միության գործարաններում, գիտական կենտրոններում ու համալսարաններում։ Այն ժամանակ մեկ համակարգիչը մի ամբողջ սենյակ էր զբաղեցնում, իսկ այսօր գրպանի հեռախոսն անհամեմատ ավելի հզոր է։ Բայց հենց այդ տարիներին Հայաստանում ձևավորվեց ինժեներների մի սերունդ, որի ավանդույթը շարունակում են այսօրվա ծրագրավորողները։" },
  byurakan: { narrator: narrators.astronomer, audio: byurakanAudio.url, text: "Ես աստղագետ եմ Բյուրականի աստղադիտարանից՝ Արագածի լանջին։ Աստղադիտարանը հիմնադրեց Վիկտոր Համբարձումյանը հազար ինը հարյուր քառասունվեց թվականին։ Նա բացահայտեց աստղային ասոցիացիաները և ցույց տվեց, որ աստղերը մինչ օրս էլ ծնվում են։ Իսկ Բենիամին Մարգարյանը տարիներ շարունակ լուսանկարում էր երկինքը և կազմեց ավելի քան մեկուկես հազար գալակտիկաների ցուցակ։ Մենք այդ ամենն անում էինք ձեռքով՝ լուսանկարչական թիթեղների վրա։ Այսօր աստղադիտակները մեկ գիշերում միլիարդավոր թվեր են ստեղծում, և դրանք վերլուծում է մեքենայական ուսուցումը։" },
  chess: { narrator: narrators.chess, audio: chessAudio.url, text: "Ես շախմատի մարզիչ եմ։ Հազար ինը հարյուր վաթսուներեք թվականին Տիգրան Պետրոսյանը հաղթեց Միխայիլ Բոտվիննիկին և դարձավ աշխարհի չեմպիոն։ Նրան անվանում էին «երկաթե Տիգրան», որովհետև նա զգում էր վտանգը դեռ նախքան այն կհայտնվեր տախտակին։ Երկու հազար տասնմեկ թվականից շախմատը պարտադիր առարկա է հայկական դպրոցներում։ Տասնամյակներ շարունակ շախմատը եղել է արհեստական բանականության փորձադաշտը։ Հազար ինը հարյուր իննսունյոթին «Դիփ Բլու» համակարգիչը հաղթեց Գարրի Կասպարովին, իսկ «Ալֆազիրո» ծրագիրն ինքնուրույն սովորեց խաղալ՝ միլիոնավոր պարտիաներ խաղալով ինքն իր դեմ։" },
  heritage: { narrator: narrators.guide, audio: heritageAudio.url, text: "Արհեստական բանականությունն այսօր դառնում է պատմաբանի օգնականը։ Այն կարող է թարգմանել ու վերլուծել գրաբար տեքստեր, լուսանկարներից կառուցել խաչքարերի և եկեղեցիների եռաչափ մոդելներ, վերականգնել խունացած լուսանկարներն ու վնասված էջերը և վայրկյանների ընթացքում որոնել հազարավոր արխիվային փաստաթղթեր։ Բայց մեքենան չի հիշում պատմությունը մեր փոխարեն։ Այն միայն առաջարկում է ընթերցման տարբերակներ, իսկ ճշմարտությունը ստուգում է մարդը՝ աղբյուրների, փաստերի ու քննադատական մտքի օգնությամբ։" },
  paulicians: { narrator: narrators.chronicler, audio: pauliciansAudio.url, text: "Ես միջնադարյան պատմիչ եմ, և կպատմեմ պավլիկյանների մասին։ Այս շարժումը ծագեց Հայաստանում յոթերորդ դարում և տարածվեց Բյուզանդական կայսրությունում։ Պավլիկյանները մերժում էին եկեղեցական աստիճանակարգը, սրբապատկերների պաշտամունքը և շքեղ ծեսերը։ Իններորդ դարում նրանք Տեփրիկեում ստեղծեցին ամրացված կենտրոն և երկար տարիներ դիմադրեցին կայսրության բանակներին, մինչև որ ութ հարյուր յոթանասուներկու թվականին պարտվեցին։ Նրանց մասին գիտենք հիմնականում հակառակորդների, օրինակ՝ Պետրոս Սիցիլիացու գրվածքներից։ Ուստի պատմաբանը պետք է զգուշությամբ կարդա այդ աղբյուրները։" },
  tondrakians: { narrator: narrators.chronicler, audio: tondrakiansAudio.url, text: "Իններորդ դարում Թոնդրակ գավառում Սմբատ Զարեհավանցին հիմնեց նոր շարժում, որը կոչվեց թոնդրակյան։ Թոնդրակյանները քննադատում էին եկեղեցու հարստությունը, հողատիրությունն ու սոցիալական անարդարությունը։ Նրանք մերժում էին շատ ծեսեր և պնդում, որ հավատը պետք է լինի պարզ ու անկեղծ։ Շարժումը տևեց մոտ երկու դար՝ մինչև տասնմեկերորդ դարը։ Նրանց սեփական գրքերը գրեթե չեն պահպանվել, և մենք նրանց մասին գիտենք հիմնականում Գրիգոր Մագիստրոսի և Գրիգոր Նարեկացու՝ նրանց դեմ գրված թղթերից։ Այստեղ արհեստական բանականությունը կարող է օգնել՝ հավաքելով ուսմունքի բեկորները տարբեր տեքստերից։" },
  thanks: { narrator: narrators.guide, audio: thanksAudio.url, text: "Շնորհակալություն, որ միասին անցանք այս ճանապարհը։ Մաշտոցից մինչև Մերգելյան, Մատենադարանից մինչև նեյրոնային ցանցեր՝ հայ միտքը միշտ եղել է գիտելիքի պահապան ու նորարար։ Հիմա ձեր հերթն է՝ հարցեր տալու և քննարկելու։" },
} satisfies Record<string, Narration>;

export type NarrationId = keyof typeof narrations;

/** Splits narration into caption sentences at Armenian and Latin sentence ends. */
export function sentences(text: string) {
  return text.split(/(?<=[։:?!])\s+/u).map(s => s.trim()).filter(Boolean);
}

/** Index of the sentence being spoken, estimated from playback progress weighted by sentence length. */
export function sentenceAt(parts: string[], time: number, duration: number) {
  if (!parts.length || !(duration > 0)) return 0;
  const total = parts.reduce((n, s) => n + s.length, 0);
  const target = Math.min(1, Math.max(0, time / duration)) * total;
  let sum = 0;
  for (let k = 0; k < parts.length; k++) {
    sum += parts[k]!.length;
    if (target < sum) return k;
  }
  return parts.length - 1;
}
