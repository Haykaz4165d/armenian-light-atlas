import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { narrations, sentenceAt, sentences, type NarrationId } from "@/lib/narrations";

// Clickable portrait on a slide: plays the narrator's recorded voice with their talking video and live captions.
export function TalkingNarrator({ id }: { id: NarrationId }) {
  const { narrator, audio, text } = narrations[id];
  const parts = sentences(text);
  const sound = useRef<HTMLAudioElement>(null);
  const clip = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState({ t: 0, d: 0 });

  useEffect(() => () => sound.current?.pause(), []);

  useEffect(() => {
    const v = clip.current;
    if (!v) return;
    if (playing) void v.play().catch(() => {});
    else v.pause();
  }, [playing, open]);

  const start = () => {
    setOpen(true);
    const a = sound.current;
    if (!a) return;
    if (a.ended) a.currentTime = 0;
    void a.play().catch(() => setPlaying(false));
  };
  const close = () => {
    const a = sound.current;
    if (a) { a.pause(); a.currentTime = 0; }
    setOpen(false);
    setProgress({ t: 0, d: 0 });
  };
  const toggle = () => {
    const a = sound.current;
    if (!a) return;
    if (a.paused) void a.play().catch(() => {});
    else a.pause();
  };

  const line = parts[sentenceAt(parts, progress.t, progress.d)];

  return (
    <aside className="narrator" onTouchStart={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()}>
      <audio
        ref={sound}
        src={audio}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setOpen(false); setProgress({ t: 0, d: 0 }); }}
        onTimeUpdate={(e) => setProgress({ t: e.currentTarget.currentTime, d: e.currentTarget.duration })}
      />
      {open ? (
        <div className="narrator-card">
          <button type="button" className="narrator-stage" onClick={toggle} aria-label={playing ? "Դադար" : "Շարունակել"}>
            <video ref={clip} src={narrator.video} poster={narrator.portrait} muted loop playsInline preload="auto" />
            {!playing && <span className="narrator-paused"><Play /></span>}
          </button>
          <button type="button" className="narrator-close" onClick={close} aria-label="Փակել"><X /></button>
          <div className="narrator-caption">
            <div className="narrator-name">{narrator.name}</div>
            <p key={line} className="narrator-line">{line}</p>
          </div>
          <div className="narrator-progress" style={{ width: `${progress.d ? (progress.t / progress.d) * 100 : 0}%` }} />
        </div>
      ) : (
        <button type="button" className="narrator-medallion" onClick={start} aria-label={`Լսել․ ${narrator.name}`}>
          <img src={narrator.portrait} alt="" width={720} height={1280} loading="lazy" />
          <span className="narrator-play"><Play /></span>
          <span className="narrator-tag">
            <strong>{narrator.name}</strong>
            <small>{narrator.role}</small>
          </span>
        </button>
      )}
    </aside>
  );
}
