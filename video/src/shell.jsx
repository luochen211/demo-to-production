/* Shared frame for every film: scene switching, segment badge, progress dots,
   author badge, captions, voiceover and music. A film supplies its timings and
   one scene component per segment; see films/ch09-callback/Film.jsx. */
import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Box, C, FONT, pop, ramp, span} from './kit.jsx';

export const SEG_COLORS = [C.teal, C.orange, C.indigo, C.rose, C.slate, C.green];
const NUM = ['①', '②', '③', '④', '⑤', '⑥'];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

const Chrome = ({t, timings, seg, dots}) => (
  <>
    <Box x={34} y={26} s={pop(t, timings.segments[seg].start, 0.3)} style={{background: SEG_COLORS[seg], color: '#fff', borderRadius: 8, padding: '5px 14px', fontSize: 19, fontWeight: 700, transformOrigin: 'left center', whiteSpace: 'nowrap'}}>{NUM[seg]} {timings.segments[seg].name}</Box>
    <Box x={960} y={30} w={286} style={{display: 'flex', justifyContent: 'flex-end', gap: 10, fontSize: 16, color: C.sub}}>
      {dots.map((d, i) => {
        const on = i === seg || seg === dots.length - 1;
        return (
          <span key={i} style={{display: 'flex', alignItems: 'center', gap: 4, color: on ? C.ink : C.sub, fontWeight: on ? 700 : 400}}>
            <span style={{width: 13, height: 13, borderRadius: 13, boxSizing: 'border-box', background: on ? SEG_COLORS[i] : 'transparent', border: `2px solid ${on ? SEG_COLORS[i] : '#b9c1c9'}`}} />{d}
          </span>
        );
      })}
    </Box>
    <Box x={1080} y={656} w={176} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8}}>
      <Img src={staticFile('avatar.jpg')} style={{width: 44, height: 44, borderRadius: 44, objectFit: 'cover', boxShadow: '0 0 0 2px #fff, 0 1px 4px rgba(0,0,0,.18)'}} />
      <Img src={staticFile('luochen-logo.png')} style={{height: 32}} />
    </Box>
  </>
);

const Caption = ({t, timings}) => {
  const i = timings.lines.findLastIndex((l) => t >= l.start - 0.1);
  if (i < 0) return null;
  const line = timings.lines[i];
  const next = timings.lines[i + 1];
  const until = next && next.seg === line.seg ? next.start - 0.1 : line.start + line.dur + 0.45;
  return (
    <Box x={0} y={612} w={1280} o={span(t, line.start - 0.1, until, 0.12)} style={{display: 'flex', justifyContent: 'center'}}>
      <div style={{background: 'rgba(38,46,56,.92)', color: '#fff', borderRadius: 10, padding: '9px 24px', fontSize: 25, lineHeight: 1.45, textAlign: 'center', fontWeight: 500}}>
        {line.rows.map((r, k) => <div key={k}>{r}</div>)}
      </div>
    </Box>
  );
};

/* Builds the film component. dots: one short label per segment (1–2 characters). */
export const makeFilm = ({id, timings, scenes, dots}) => {
  const last = timings.lines[timings.lines.length - 1];
  const voEnd = last.start + last.dur;
  const segEnd = (i) => (i + 1 < timings.segments.length ? timings.segments[i + 1].start : timings.total);
  return () => {
    const frame = useCurrentFrame();
    const {fps, durationInFrames} = useVideoConfig();
    const t = frame / fps;
    const seg = Math.max(0, timings.segments.findLastIndex((s) => t >= s.start));
    const Scene = scenes[seg];
    const start = timings.segments[seg].start;
    const sceneO = Math.min(seg === 0 ? 1 : ramp(t, start, 0.25), seg === scenes.length - 1 ? 1 : 1 - ramp(t, segEnd(seg) - 0.2, 0.2));
    const music = (f) => 0.16 * interpolate(f, [0, 20, durationInFrames - 60, durationInFrames - 1], [0, 1, 1, 0], clamp) * interpolate(f, [voEnd * fps, voEnd * fps + 30], [1, 2.2], clamp);
    return (
      <AbsoluteFill style={{background: `linear-gradient(180deg, #ffffff 0%, ${C.bg} 100%)`, fontFamily: FONT, color: C.ink}}>
        <div style={{opacity: sceneO}}><Scene t={t} /></div>
        <Chrome t={t} timings={timings} seg={seg} dots={dots} />
        <Caption t={t} timings={timings} />
        <Audio src={staticFile(`${id}/voice.mp3`)} />
        <Audio src={staticFile(`${id}/music.mp3`)} volume={music} />
      </AbsoluteFill>
    );
  };
};

/* Root component for one film; films/<id>/index.jsx passes it to registerRoot(). */
export const filmRoot = (id, Film, timings) => () => (
  <Composition id={id} component={Film} durationInFrames={Math.round(timings.total * 30)} fps={30} width={1280} height={720} />
);
