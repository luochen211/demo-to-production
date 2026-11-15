import React from 'react';
import {Easing, interpolate} from 'remotion';

export const C = {
  bg: '#fbfaf7', ink: '#1f2933', sub: '#66727f', line: '#d5dbe1', card: '#ffffff',
  teal: '#0a8f84', orange: '#d9730d', indigo: '#4f46e5', rose: '#c0264b', slate: '#334155',
  green: '#16a34a', red: '#dc2626', yellow: '#fff6d6', yellowLine: '#e2b100',
};
export const FONT = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",system-ui,sans-serif';
export const MONO = '"SF Mono",Menlo,Consolas,monospace';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
/** 0→1 between `at` and `at + d` seconds. */
export const ramp = (t, at, d = 0.35) => interpolate(t, [at, at + d], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
/** Scale that overshoots a little, for things that pop in. */
export const pop = (t, at, d = 0.4) => interpolate(t, [at, at + d], [0.6, 1], {...clamp, easing: Easing.out(Easing.back(2))});
/** Visible between two times, with short fades. */
export const span = (t, from, to, d = 0.3) => Math.min(ramp(t, from, d), 1 - ramp(t, to, d));
export const lerp = (a, b, p) => a + (b - a) * p;

export const Box = ({x, y, w, h, o = 1, s = 1, r = 0, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: o, transform: `scale(${s}) rotate(${r}deg)`, ...style}}>{children}</div>
);

export const Card = ({x, y, w, h, o = 1, s = 1, color = C.line, fill = C.card, children, style}) => (
  <Box x={x} y={y} w={w} h={h} o={o} s={s} style={{background: fill, border: `2.5px solid ${color}`, borderRadius: 16, boxShadow: '0 6px 0 rgba(31,41,51,.06)', boxSizing: 'border-box', ...style}}>{children}</Box>
);

export const Mark = ({ok, size = 30, style}) => (
  <div style={{width: size, height: size, borderRadius: size, background: ok ? C.green : C.red, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.62, fontWeight: 800, lineHeight: 1, flex: 'none', ...style}}>{ok ? '✓' : '✗'}</div>
);

export const Stamp = ({x, y, t, at, text, color = C.red, size = 30, rot = -7}) => {
  const p = ramp(t, at, 0.22);
  return (
    <Box x={x} y={y} o={p} s={lerp(1.9, 1, p)} r={rot} style={{border: `3.5px solid ${color}`, color, borderRadius: 8, padding: '4px 14px', fontSize: size, fontWeight: 800, background: 'rgba(255,255,255,.9)', whiteSpace: 'nowrap', letterSpacing: 2}}>{text}</Box>
  );
};

export const Chip = ({x, y, t, at, text, color = C.ink, fill = '#fff', size = 22, until = 1e9}) => (
  <Box x={x} y={y} o={span(t, at, until)} s={pop(t, at)} style={{border: `2px solid ${color}`, color, background: fill, borderRadius: 999, padding: '6px 16px', fontSize: size, fontWeight: 600, whiteSpace: 'nowrap', transformOrigin: 'left center'}}>{text}</Box>
);

export const Pill = ({paid, text, size = 20}) => (
  <span style={{display: 'inline-block', padding: '3px 12px', borderRadius: 999, whiteSpace: 'nowrap', fontSize: size, fontWeight: 700, color: paid ? '#fff' : '#8a5a00', background: paid ? C.green : '#ffe9a8', border: `2px solid ${paid ? C.green : C.yellowLine}`}}>{text ?? (paid ? '已支付' : '待支付')}</span>
);

export const Envelope = ({x, y, o = 1, s = 1, label, color = C.orange}) => (
  <Box x={x - 36} y={y - 25} w={72} h={50} o={o} s={s}>
    <svg width="72" height="50" viewBox="0 0 72 50">
      <rect x="2" y="2" width="68" height="46" rx="7" fill="#fff" stroke={color} strokeWidth="3" />
      <path d="M4 6 L36 29 L68 6" fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" />
    </svg>
    {label ? <div style={{position: 'absolute', top: 54, left: -64, width: 200, textAlign: 'center', fontSize: 18, fontWeight: 600, color}}>{label}</div> : null}
  </Box>
);

export const Arrow = ({x1, x2, y, o = 1, color = C.sub, dashed}) => (
  <Box x={Math.min(x1, x2)} y={y - 10} w={Math.abs(x2 - x1)} h={20} o={o}>
    <svg width={Math.abs(x2 - x1)} height="20" style={{transform: x2 < x1 ? 'scaleX(-1)' : undefined}}>
      <line x1="0" y1="10" x2={Math.abs(x2 - x1) - 6} y2="10" stroke={color} strokeWidth="3" strokeDasharray={dashed ? '8 7' : undefined} />
      <path d={`M${Math.abs(x2 - x1) - 14} 2 L${Math.abs(x2 - x1) - 2} 10 L${Math.abs(x2 - x1) - 14} 18`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Box>
);

/** A labelled party in the payment flow. */
export const Node = ({x, y, w = 200, h = 150, o = 1, s = 1, title, icon, color, children}) => (
  <Card x={x} y={y} w={w} h={h} o={o} s={s} color={color}>
    <div style={{background: color, color: '#fff', fontSize: 20, fontWeight: 700, padding: '7px 14px', borderRadius: '12px 12px 0 0', display: 'flex', gap: 8, alignItems: 'center'}}>{icon}{title}</div>
    <div style={{padding: 14}}>{children}</div>
  </Card>
);

export const Order = ({paid, flash = 0}) => (
  <div style={{border: `2px solid ${C.line}`, borderRadius: 12, padding: '10px 12px', background: flash ? `rgba(22,163,74,${0.16 * flash})` : '#fff'}}>
    <div style={{fontSize: 18, color: C.sub, fontFamily: MONO}}>订单 #1024</div>
    <div style={{fontSize: 26, fontWeight: 800, color: C.ink, margin: '2px 0 8px'}}>¥38.00</div>
    <Pill paid={paid} />
  </div>
);

export const Ledger = ({x, y, w = 280, t, rows, bad, o = 1, note}) => {
  const shown = rows.filter((at) => t >= at).length;
  return (
    <Card x={x} y={y} w={w} h={74 + rows.length * 46 + 58} o={o} color={bad && shown > 1 ? C.red : C.line}>
      <div style={{padding: '12px 16px 6px', fontSize: 20, fontWeight: 700, color: C.ink}}>营收记录</div>
      {rows.map((at, i) => (
        <div key={i} style={{margin: '0 16px', height: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1.5px dashed ${C.line}`, opacity: ramp(t, at, 0.25), fontFamily: MONO, fontSize: 21}}>
          <span style={{color: C.sub}}>#1024</span>
          <span style={{fontWeight: 700, color: bad && i > 0 ? C.red : C.ink}}>+¥38.00</span>
        </div>
      ))}
      <div style={{margin: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `2.5px solid ${C.ink}`, fontSize: 22, fontWeight: 800}}>
        <span>合计</span>
        <span style={{fontFamily: MONO, color: bad && shown > 1 ? C.red : C.ink}}>¥{(38 * shown).toFixed(2)}</span>
      </div>
      {note}
    </Card>
  );
};
