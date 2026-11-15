import React from 'react';
import timings from './timings.json';
import {Arrow, Box, C, Card, Chip, Mark, MONO, Stamp, lerp, pop, ramp, span} from '../../src/kit.jsx';
import {makeFilm} from '../../src/shell.jsx';

export const ID = 'ch05-same-tool';
const L = timings.lines.map((l) => l.start);
const D = timings.lines.map((l) => l.dur);
const S = timings.segments.map((s) => s.start + 0.05);

/* A model drawn as a chip; `size` is its edge in px. */
const ModelIcon = ({size, color = C.indigo}) => {
  const pins = [0.25, 0.5, 0.75];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{display: 'block'}}>
      {pins.map((p) => (
        <g key={p} stroke={color} strokeWidth="5" strokeLinecap="round">
          <line x1={p * 100} y1="2" x2={p * 100} y2="16" /><line x1={p * 100} y1="84" x2={p * 100} y2="98" />
          <line x1="2" y1={p * 100} x2="16" y2={p * 100} /><line x1="84" y1={p * 100} x2="98" y2={p * 100} />
        </g>
      ))}
      <rect x="16" y="16" width="68" height="68" rx="10" fill="#eef0ff" stroke={color} strokeWidth="5" />
      <text x="50" y="62" textAnchor="middle" fontSize="30" fontWeight="800" fill={color} fontFamily={MONO}>AI</text>
    </svg>
  );
};

/* A small browser window with a half-built page. */
const Page = ({p = 1, ok}) => (
  <div style={{width: 210, height: 150, border: `2px solid ${C.line}`, borderRadius: 10, background: '#fff', overflow: 'hidden', flex: 'none'}}>
    <div style={{height: 22, background: '#eef1f4', display: 'flex', gap: 5, alignItems: 'center', padding: '0 8px'}}>
      {['#f87171', '#fbbf24', '#34d399'].map((c) => <span key={c} style={{width: 8, height: 8, borderRadius: 8, background: c}} />)}
    </div>
    <div style={{padding: 10, display: 'flex', flexDirection: 'column', gap: 8}}>
      {[0.9, 0.6, 0.75, 0.5].map((w, i) => (
        <div key={i} style={{height: 14, borderRadius: 4, width: `${w * 100}%`, background: ok ? '#c9eed6' : '#e3e7eb', opacity: p > i / 4 ? 1 : 0.15}} />
      ))}
    </div>
  </div>
);

/* One person's desk at the event: who, a page, the minutes used and how far it got. */
const Desk = ({x, label, color, t, at, mins, stall, o, s}) => {
  const p = ramp(t, at, 1.6);
  const fill = stall ? lerp(0, 0.62, Math.min(1, p * 1.8)) : p;
  const done = !stall && p >= 1;
  const end = p >= 1;
  return (
    <Card x={x} y={150} w={460} h={270} o={o} s={s} color={color}>
      <div style={{background: color, color: '#fff', fontSize: 21, fontWeight: 700, padding: '7px 16px', borderRadius: '12px 12px 0 0'}}>{label}</div>
      <div style={{display: 'flex', gap: 20, padding: '16px 18px 10px', alignItems: 'center'}}>
        <Page p={fill} ok={done} />
        <div style={{flex: 1, textAlign: 'center'}}>
          <div style={{fontSize: 18, color: C.sub}}>用时</div>
          <div style={{fontSize: 46, fontWeight: 800, fontFamily: MONO, color: stall && end ? C.red : C.ink, whiteSpace: 'nowrap'}}>
            {Math.round(lerp(0, mins, p))}<span style={{fontSize: 22, marginLeft: 6, fontFamily: 'inherit'}}>分钟{stall && end ? '+' : ''}</span>
          </div>
          <div style={{marginTop: 8, height: 34, opacity: ramp(t, at + 1.6, 0.25), transform: `scale(${pop(t, at + 1.6)})`, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, fontSize: 22, fontWeight: 800, color: stall ? C.red : C.green}}>
            <Mark ok={!stall} size={28} />{stall ? '还没弄完' : '部署好了'}
          </div>
        </div>
      </div>
      <div style={{margin: '4px 18px', height: 12, borderRadius: 6, background: '#eef1f4', overflow: 'hidden'}}>
        <div style={{width: `${fill * 100}%`, height: '100%', background: stall && end ? C.red : C.green}} />
      </div>
    </Card>
  );
};

/* ① Same website: 5 minutes for me, still unfinished after half an hour for someone else. */
const Scene1 = ({t}) => {
  const q = ramp(t, L[1] + 0.1);
  return (
    <>
      <Box x={0} y={92} w={1280} o={ramp(t, 0.1)} style={{textAlign: 'center', fontSize: 30, fontWeight: 800, color: C.ink}}>线下活动：大家做同样的网站</Box>
      <Desk x={110} label="我" color={C.teal} t={t} at={L[0] + 3.0} mins={5} o={ramp(t, 0.3)} s={pop(t, 0.3)} />
      <Desk x={710} label="另一位参加者" color={C.orange} t={t} at={L[0] + 4.4} mins={30} stall o={ramp(t, 0.6)} s={pop(t, 0.6)} />
      <Box x={570} y={208} w={140} o={q} s={pop(t, L[1] + 0.1)} style={{textAlign: 'center', fontSize: 110, fontWeight: 800, color: C.rose, lineHeight: 1}}>?</Box>
      <Stamp x={880} y={392} t={t} at={L[1] + 1.4} text="模型不行？" size={30} rot={-6} />
      <Card x={250} y={450} w={780} h={104} o={ramp(t, L[1] + 3.0)} s={pop(t, L[1] + 3.0)} color={C.orange} fill="#fff8ef" style={{display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px'}}>
        <div style={{width: 64, height: 64, borderRadius: 64, background: C.orange, color: '#fff', fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>老板</div>
        <div>
          <div style={{fontSize: 19, color: C.sub}}>一位电商老板说</div>
          <div style={{fontSize: 34, fontWeight: 800, color: C.ink, whiteSpace: 'nowrap'}}>「豆包都比 Codex 好用」</div>
        </div>
      </Card>
    </>
  );
};

/* ② Inside one company, each job gets a model of the right size. */
const Scene2 = ({t}) => {
  const first = span(t, S[1], L[3] - 0.1, 0.25);
  const models = [['小', 110, 380], ['中', 150, 580], ['大', 200, 800]];
  const picks = [[2, 4.4], [0, 5.0], [1, 5.6]];
  const taskCard = (y, at, items, color) => (
    <Card x={80} y={y} w={430} h={118} o={ramp(t, at)} s={pop(t, at)} color={color} style={{display: 'flex', flexWrap: 'wrap', alignContent: 'center', gap: 10, padding: '0 18px'}}>
      {items.map((s, i) => (
        <span key={s} style={{opacity: ramp(t, at + 0.2 + i * 0.35, 0.2), border: `2px solid ${color}`, color, borderRadius: 999, padding: '5px 14px', fontSize: 23, fontWeight: 700, whiteSpace: 'nowrap'}}>{s}</span>
      ))}
    </Card>
  );
  const modelCard = (y, at, size, title, sub, color) => (
    <Card x={650} y={y} w={430} h={118} o={ramp(t, at)} s={pop(t, at)} color={color} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '0 20px'}}>
      <ModelIcon size={size} color={color} />
      <div>
        <div style={{fontSize: 27, fontWeight: 800, color: C.ink}}>{title}</div>
        <div style={{fontSize: 19, color: C.sub, marginTop: 2}}>{sub}</div>
      </div>
    </Card>
  );
  const unclear = L[4] + 4.2;
  return (
    <>
      <div style={{opacity: first}}>
        <Box x={0} y={96} w={1280} o={ramp(t, L[2] + 3.6)} style={{textAlign: 'center', fontSize: 32, fontWeight: 800, color: C.ink}}>同一家公司的模型</Box>
        {models.map(([name, size, cx], i) => (
          <Box key={name} x={cx - size / 2} y={440 - size} o={ramp(t, L[2] + 0.3 + i * 0.3)} s={pop(t, L[2] + 0.3 + i * 0.3)} style={{textAlign: 'center'}}>
            <ModelIcon size={size} />
          </Box>
        ))}
        {models.map(([name, , cx]) => (
          <Box key={name} x={cx - 60} y={452} w={120} o={ramp(t, L[2] + 1.0)} style={{textAlign: 'center', fontSize: 22, fontWeight: 700, color: C.indigo}}>{name}尺寸</Box>
        ))}
        {picks.map(([m, d], i) => {
          const at = L[2] + d;
          const cx = models[m][2];
          return (
            <Box key={i} x={cx - 50} y={lerp(160, 200, ramp(t, at, 0.4))} w={100} o={ramp(t, at, 0.3)} style={{textAlign: 'center', fontSize: 20, fontWeight: 700, color: '#fff', background: C.slate, borderRadius: 8, padding: '4px 0'}}>业务 {'ABC'[i]}</Box>
          );
        })}
        <Box x={0} y={512} w={1280} o={ramp(t, L[2] + 6.2)} style={{textAlign: 'center', fontSize: 24, fontWeight: 700, color: C.sub}}>按任务挑尺寸</Box>
      </div>

      <div style={{opacity: ramp(t, L[3])}}>
        <Box x={0} y={92} w={1280} s={pop(t, L[3])} style={{textAlign: 'center', fontSize: 34, fontWeight: 800, color: C.indigo}}>自家就有强的，为什么不全用最强的？</Box>
        {taskCard(186, L[3] + 2.8, ['简单', '重复', '出错代价低'], C.teal)}
        <Arrow x1={522} x2={638} y={245} o={ramp(t, L[3] + 4.4)} />
        {modelCard(186, L[3] + 4.6, 70, '小而便宜的模型', '小模型', C.teal)}
        {taskCard(330, L[4] + 0.1, ['多步推理', '要读大量代码'], C.rose)}
        <Arrow x1={522} x2={638} y={389} o={ramp(t, L[4] + 1.3)} />
        {modelCard(330, L[4] + 1.5, 96, '强的模型', '大模型', C.rose)}
        <Card x={80} y={478} w={620} h={84} o={ramp(t, L[4] + 2.8)} s={pop(t, L[4] + 2.8)} color={C.indigo} fill="#f3f4ff" style={{display: 'flex', alignItems: 'center', padding: '0 22px', fontSize: 27, fontWeight: 800, color: C.indigo, whiteSpace: 'nowrap'}}>挑之前先问：任务说清了吗？</Card>
        {[0, 1].map((i) => (
          <Box key={i} x={1110} y={206 + i * 144} o={span(t, unclear + i * 0.15, 1e9)} s={pop(t, unclear + i * 0.15)} style={{fontSize: 64, fontWeight: 800, color: C.red, lineHeight: 1}}>?</Box>
        ))}
        <Stamp x={760} y={494} t={t} at={unclear + 0.5} text="没说清，换哪个都在猜" size={26} rot={-4} />
      </div>
    </>
  );
};

/* ③ Back to the half hour: the stalls are in the tool settings, not in the model. */
const Scene3 = ({t}) => {
  const W = 680;
  const grow = ramp(t, S[2] + 0.6, 1.6);
  const blocks = [[0.08, 0.3], [0.42, 0.6], [0.7, 0.94]];
  const cardsO = span(t, L[6], L[7] - 0.05, 0.3);
  const card = (i, at, title, body) => (
    <Card x={90 + i * 380} y={300} w={340} h={210} o={ramp(t, at)} s={pop(t, at)} color={C.red} style={{padding: '14px 18px'}}>
      <div style={{fontSize: 24, fontWeight: 800, color: C.red, marginBottom: 10}}>{'①②③'[i]} {title}</div>
      {body}
    </Card>
  );
  const clicks = Math.max(0, Math.floor((t - (L[6] + 0.8)) / 0.45));
  const pile = ['旧需求', '废弃方案', '报错', '报错', '废弃方案'];
  const pileAt = L[6] + D[6] * 0.62;
  return (
    <>
      <Box x={0} y={90} w={1280} o={ramp(t, S[2])} s={pop(t, S[2])} style={{textAlign: 'center', fontSize: 32, fontWeight: 800, color: C.ink}}>回到开头那半小时</Box>
      {[['我', 5 / 30, C.green, '5 分钟'], ['另一位', grow, C.orange, '30 分钟+']].map(([who, p, color, tag], i) => (
        <React.Fragment key={who}>
          <Box x={80} y={154 + i * 62} w={120} o={ramp(t, S[2] + 0.3)} style={{textAlign: 'right', fontSize: 22, fontWeight: 700, color: C.ink}}>{who}</Box>
          <Box x={220} y={150 + i * 62} w={W * p} h={38} o={ramp(t, S[2] + 0.3)} style={{background: color, borderRadius: 8, opacity: 0.9}} />
          <Box x={230 + W * p} y={154 + i * 62} o={ramp(t, S[2] + 0.3 + i * 1.6)} style={{fontSize: 22, fontWeight: 800, fontFamily: MONO, color: i ? C.red : C.green, whiteSpace: 'nowrap'}}>{tag}</Box>
        </React.Fragment>
      ))}
      {blocks.map(([a, b], i) => (
        <Box key={i} x={220 + W * a} y={206} w={W * (b - a)} h={46} o={ramp(t, L[5] + 3.6 + i * 0.4)} s={pop(t, L[5] + 3.6 + i * 0.4)} style={{background: C.red, borderRadius: 8, color: '#fff', fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>卡住 {'①②③'[i]}</Box>
      ))}
      <Card x={420} y={300} w={440} h={170} o={span(t, L[5] + 5.0, L[6] + 0.1)} s={pop(t, L[5] + 5.0)} color={C.green} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px'}}>
        <ModelIcon size={100} />
        <div>
          <div style={{fontSize: 30, fontWeight: 800, color: C.ink}}>模型</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 26, fontWeight: 800, color: C.green, marginTop: 6}}><Mark ok size={30} />跟卡住无关</div>
        </div>
      </Card>

      <div style={{opacity: cardsO}}>
        {card(0, L[6] + 0.2, '权限', (
          <>
            <div style={{border: `2px solid ${C.line}`, borderRadius: 10, padding: '10px 12px', background: '#f8fafc'}}>
              <div style={{fontSize: 18, color: C.ink, marginBottom: 10}}>要运行这条命令吗？</div>
              <div style={{display: 'flex', gap: 10, justifyContent: 'flex-end'}}>
                <span style={{fontSize: 18, padding: '4px 12px', borderRadius: 6, border: `1.5px solid ${C.line}`, color: C.sub}}>拒绝</span>
                <span style={{fontSize: 18, padding: '4px 12px', borderRadius: 6, background: C.indigo, color: '#fff', transform: `scale(${(t - L[6]) % 0.45 < 0.12 && t > L[6] + 0.8 ? 0.9 : 1})`}}>允许</span>
              </div>
            </div>
            <div style={{fontSize: 19, color: C.sub, marginTop: 12}}>又停下来了 <b style={{color: C.red, fontFamily: MONO}}>×{Math.min(clicks, 12)}</b></div>
          </>
        ))}
        {card(1, L[6] + D[6] * 0.5, '插话', (
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            <div style={{alignSelf: 'flex-start', background: '#eef1f4', borderRadius: 12, padding: '6px 12px', fontSize: 19, color: C.ink}}>AI：继续往下写……</div>
            <div style={{alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 8, opacity: ramp(t, L[6] + D[6] * 0.5 + 0.6)}}>
              <span style={{background: C.indigo, color: '#fff', borderRadius: 12, padding: '6px 12px', fontSize: 19}}>停，方向错了</span>
              <Mark size={26} />
            </div>
            <div style={{fontSize: 19, color: C.sub}}>插不上话</div>
          </div>
        ))}
        {card(2, pileAt, '会话', (
          <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
            {pile.map((s, i) => (
              <div key={i} style={{opacity: ramp(t, pileAt + 0.3 + i * 0.3, 0.2), fontSize: 16, padding: '3px 10px', borderRadius: 6, background: s === '报错' ? '#fdecec' : '#f1f3f5', color: s === '报错' ? C.red : C.sub, fontFamily: s === '报错' ? MONO : undefined}}>{s === '报错' ? 'Error: …' : s}</div>
            ))}
          </div>
        ))}
      </div>

      <Card x={170} y={300} w={940} h={230} o={ramp(t, L[7])} s={pop(t, L[7])} color={C.orange} fill="#fff8ef" style={{display: 'flex', alignItems: 'center', gap: 28, padding: '0 34px'}}>
        <div style={{width: 84, height: 84, borderRadius: 84, background: C.orange, color: '#fff', fontSize: 26, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>老板</div>
        <div style={{flex: 1}}>
          <div style={{position: 'relative', display: 'inline-block', fontSize: 30, fontWeight: 800, color: C.sub}}>
            「豆包都比 Codex 好用」
            <div style={{position: 'absolute', left: 0, top: '52%', height: 4, background: C.red, width: `${100 * ramp(t, L[7] + D[7] * 0.45, 0.4)}%`}} />
          </div>
          <div style={{marginTop: 18, display: 'flex', gap: 36, fontSize: 28, fontWeight: 800}}>
            <span style={{display: 'flex', alignItems: 'center', gap: 10, color: C.red, opacity: ramp(t, L[7] + D[7] * 0.5)}}><Mark size={32} />工具没调好</span>
            <span style={{display: 'flex', alignItems: 'center', gap: 10, color: C.green, opacity: ramp(t, L[7] + D[7] * 0.75)}}><Mark ok size={32} />模型没问题</span>
          </div>
        </div>
      </Card>
    </>
  );
};

/* ④ The order to check, then title and source. */
const Scene4 = ({t}) => {
  const i0 = L.length - 1;
  const steps = [
    ['工具设置好没有', '权限、插话、会话', C.teal, 0.3],
    ['任务说清没有', '说清了才挑得准模型', C.indigo, D[i0] * 0.52],
    ['最后才查模型', '够不够强', C.rose, D[i0] * 0.72],
  ];
  const end = L[i0] + D[i0];
  const rise = lerp(0, 46, ramp(t, end + 0.2, 0.5));
  return (
    <>
      <Box x={0} y={112} w={1280} o={ramp(t, end + 0.3, 0.5)} style={{textAlign: 'center'}}>
        <div style={{fontSize: 50, fontWeight: 800, color: C.ink, letterSpacing: 2}}>{timings.title}</div>
        <div style={{width: 300 * ramp(t, end + 0.6, 0.5), height: 7, margin: '14px auto 0', borderRadius: 4, background: `linear-gradient(90deg, ${C.teal} 0 33%, ${C.indigo} 33% 66%, ${C.rose} 66%)`}} />
      </Box>
      <Box x={0} y={196} w={1280} o={span(t, L[i0] + 0.1, end + 0.2)} style={{textAlign: 'center', fontSize: 26, fontWeight: 700, color: C.sub}}>觉得 AI 笨，按这个顺序查</Box>
      {steps.map(([title, sub, color, at], i) => (
        <React.Fragment key={i}>
          <Card x={100 + i * 370} y={250 + rise} w={320} h={160} o={ramp(t, L[i0] + at)} s={pop(t, L[i0] + at)} color={color} style={{textAlign: 'center', padding: '22px 12px'}}>
            <div style={{width: 42, height: 42, borderRadius: 42, margin: '0 auto 10px', background: color, color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: '42px', fontFamily: MONO}}>{i + 1}</div>
            <div style={{fontSize: 30, fontWeight: 800, color: C.ink}}>{title}</div>
            <div style={{fontSize: 19, color: C.sub, marginTop: 6}}>{sub}</div>
          </Card>
          {i < 2 ? <Arrow x1={424 + i * 370} x2={466 + i * 370} y={330 + rise} o={ramp(t, L[i0] + steps[i + 1][3])} /> : null}
        </React.Fragment>
      ))}
      <Box x={0} y={642} w={1280} o={ramp(t, end + 0.9, 0.5)} style={{textAlign: 'center', fontSize: 15, color: C.sub, lineHeight: 1.7}}>
        内容出自《从 Demo 到商用》{timings.source}
      </Box>
    </>
  );
};

export const Film = makeFilm({id: ID, timings, scenes: [Scene1, Scene2, Scene3, Scene4], dots: ['差', '模', '卡', '查']});
