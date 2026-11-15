import React from 'react';
import timings from './timings.json';
import {Arrow, Box, C, Card, Chip, Mark, MONO, Node, Stamp, lerp, pop, ramp, span} from '../../src/kit.jsx';
import {makeFilm} from '../../src/shell.jsx';

export const ID = 'ch14-maintenance';
const L = timings.lines.map((l) => l.start);
const E = timings.lines.map((l) => l.start + l.dur);
/* a moment inside line i, as a fraction of its spoken length */
const at = (i, f) => L[i] + timings.lines[i].dur * f;

const W = '#fff';
const icon = {
  server: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="2.5" y="3" width="15" height="6" rx="1.5" fill="none" stroke={W} strokeWidth="2" /><rect x="2.5" y="11" width="15" height="6" rx="1.5" fill="none" stroke={W} strokeWidth="2" /></svg>,
  cloud: <svg width="20" height="20" viewBox="0 0 20 20"><path d="M5.5 16h9a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 5.2 9.6 3.2 3.2 0 0 0 5.5 16z" fill="none" stroke={W} strokeWidth="2" strokeLinejoin="round" /></svg>,
};
const Glyph = ({kind, color = C.ink, size = 44}) => {
  const p = {fill: 'none', stroke: color, strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round'};
  const g = {
    person: <><circle cx="22" cy="14" r="7" {...p} /><path d="M8 39c1.5-8 7-12 14-12s12.5 4 14 12" {...p} /></>,
    clock: <><circle cx="22" cy="22" r="16" {...p} /><path d="M22 12v10l7 5" {...p} /></>,
    warn: <><path d="M22 6l17 31H5z" {...p} /><path d="M22 17v10M22 32v1" {...p} /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 44 44">{g[kind]}</svg>;
};
const Who = ({x, y, label, color, o = 1, s = 1}) => (
  <Box x={x} y={y} w={110} o={o} s={s} style={{textAlign: 'center'}}>
    <div style={{width: 92, height: 92, margin: '0 auto', borderRadius: 92, border: `3px solid ${color}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Glyph kind="person" color={color} size={58} /></div>
    <div style={{fontSize: 24, fontWeight: 800, color, marginTop: 8}}>{label}</div>
  </Box>
);
const Bubble = ({x, y, w, text, color, o = 1, s = 1, tail = 'left'}) => (
  <Card x={x} y={y} w={w} o={o} s={s} color={color} style={{padding: '16px 20px', fontSize: 26, fontWeight: 700, color: C.ink, lineHeight: 1.4, borderRadius: tail === 'left' ? '4px 18px 18px 18px' : '18px 4px 18px 18px'}}>{text}</Card>
);

/* ① Same complaint, two readings. */
const Scene1 = ({t}) => (
  <>
    <Card x={490} y={100} w={300} h={110} o={ramp(t, 0.1)} s={pop(t, 0.1)} color={C.slate} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 28, fontWeight: 800, color: C.ink}}>
      <Glyph kind="warn" color={C.orange} size={46} />某个功能「不对」
    </Card>
    <Who x={60} y={250} label="甲方" color={C.orange} o={ramp(t, at(0, 0.15))} s={pop(t, at(0, 0.15))} />
    <Bubble x={190} y={262} w={330} text="这不对，在维护里改" color={C.orange} o={ramp(t, at(0, 0.3))} s={pop(t, at(0, 0.3))} />
    <Who x={1110} y={250} label="你" color={C.teal} o={ramp(t, at(0, 0.62))} s={pop(t, at(0, 0.62))} />
    <Bubble x={740} y={262} w={350} text="这是新需求，要另报价" color={C.teal} o={ramp(t, at(0, 0.7))} s={pop(t, at(0, 0.7))} tail="right" />
    <Box x={590} y={258} w={100} o={ramp(t, L[1] + 0.2)} s={pop(t, L[1] + 0.2)} style={{textAlign: 'center', fontSize: 58, fontWeight: 800, color: C.red}}>⚡</Box>
    <Chip x={448} y={410} t={t} at={at(1, 0.3)} text="交付以后最容易吵起来的事" color={C.slate} size={24} />
    <Stamp x={510} y={485} t={t} at={at(1, 0.72)} text="谁说了算？" size={36} rot={-4} />
  </>
);

/* ② Without terms, maintenance is paid standby. */
const Scene2 = ({t}) => {
  const msgs = ['在吗？', '又有个问题', '在吗？', '这个也看看', '在吗？'];
  const a2 = 1 - ramp(t, L[3] - 0.1, 0.3);
  const fee = [['检查备份', 0.3], ['看告警', 0.42], ['处理小问题', 0.52]];
  return (
    <>
      <Box x={90} y={96} w={250} h={440} o={lerp(1, 0.45, ramp(t, L[3], 0.4)) * ramp(t, timings.segments[1].start)} style={{border: `4px solid ${C.ink}`, borderRadius: 34, background: '#fff', boxSizing: 'border-box', padding: '40px 16px', overflow: 'hidden'}}>
        {msgs.map((m, i) => (
          <div key={i} style={{opacity: ramp(t, L[2] + 0.3 + i * 0.55, 0.2), transform: `scale(${pop(t, L[2] + 0.3 + i * 0.55)})`, transformOrigin: 'left center', margin: '0 0 12px', display: 'inline-block', background: '#f1f3f5', borderRadius: '4px 14px 14px 14px', padding: '8px 14px', fontSize: 21, fontWeight: 600, color: C.ink, width: 'fit-content', clear: 'both', float: 'left'}}>{m}</div>
        ))}
      </Box>
      <div style={{opacity: a2}}>
        <Box x={430} y={150} o={ramp(t, L[2] + 0.4)} s={pop(t, L[2] + 0.4)} style={{fontSize: 46, fontWeight: 800, color: C.ink, whiteSpace: 'nowrap', transformOrigin: 'left center'}}>随叫随到，没完没了</Box>
        <Box x={430} y={250} o={ramp(t, at(2, 0.55))} style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, fontWeight: 700, color: C.sub}}><Glyph kind="clock" color={C.sub} size={44} />这笔钱租的是：</Box>
        <Stamp x={450} y={330} t={t} at={at(2, 0.72)} text="你一直在线的待命状态" size={36} rot={-4} />
      </div>
      <Card x={430} y={110} w={780} h={420} o={ramp(t, L[3] + 0.1)} s={pop(t, L[3] + 0.1)} color={C.orange} style={{padding: '22px 30px'}}>
        <div style={{fontSize: 30, fontWeight: 800, color: C.orange, marginBottom: 14}}>维护费的底线：每个月要算上</div>
        {fee.map(([s, f]) => (
          <div key={s} style={{display: 'flex', alignItems: 'center', gap: 16, height: 66, borderTop: `1.5px dashed ${C.line}`, fontSize: 28, fontWeight: 700, color: C.ink, opacity: ramp(t, at(3, f))}}><Mark ok size={34} />{s}</div>
        ))}
        <div style={{display: 'flex', alignItems: 'center', gap: 16, height: 76, borderTop: `2.5px solid ${C.ink}`, fontSize: 28, fontWeight: 700, color: C.sub, opacity: ramp(t, at(3, 0.66))}}>
          <Mark size={34} /><span style={{textDecoration: t >= at(3, 0.85) ? `line-through 3px ${C.red}` : 'none'}}>只按「出事了才动手」来算</span>
        </div>
      </Card>
    </>
  );
};

/* ③ Promise a reply time and a plan time, not a fix time. */
const Scene3 = ({t}) => {
  const rows = [['多久回应', true, 0.45], ['多久给方案', true, 0.62], ['多久修好', false, 0.85]];
  return (
    <>
      <Chip x={40} y={92} t={t} at={L[4] + 0.1} text="小谜题" color={C.indigo} fill="#eef0ff" size={22} />
      <Card x={80} y={150} w={500} h={260} o={ramp(t, at(4, 0.2))} s={pop(t, at(4, 0.2))} color={C.indigo} style={{padding: '18px 26px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 26, fontWeight: 800, color: C.indigo, marginBottom: 8}}><Glyph kind="clock" color={C.indigo} size={36} />约定响应时间</div>
        {rows.map(([s, ok, f]) => (
          <div key={s} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, borderTop: `1.5px dashed ${C.line}`, fontSize: 27, fontWeight: 700, color: ok ? C.ink : C.sub, opacity: ramp(t, at(4, f))}}>
            <span style={{textDecoration: !ok && t >= at(4, 0.92) ? `line-through 3px ${C.red}` : 'none'}}>{s}</span>
            <span style={{transform: `scale(${pop(t, at(4, f) + 0.2)})`}}><Mark ok={ok} size={32} /></span>
          </div>
        ))}
      </Card>

      <Node x={660} y={150} w={230} h={150} title="你的系统" icon={icon.server} color={C.teal} o={ramp(t, L[5] + 0.1)}>
        <div style={{fontSize: 21, color: C.sub, lineHeight: 1.5}}>出问题的地方</div>
      </Node>
      <Arrow x1={898} x2={968} y={225} o={ramp(t, L[5] + 0.4)} color={C.red} dashed />
      <Node x={980} y={150} w={230} h={150} title="第三方" icon={icon.cloud} color={C.slate} o={ramp(t, L[5] + 0.3)}>
        <div style={{fontSize: 21, fontWeight: 800, color: C.red, opacity: ramp(t, at(5, 0.3))}}>根子在这里</div>
      </Node>
      <Box x={660} y={322} w={550} o={ramp(t, at(5, 0.6))} s={pop(t, at(5, 0.6))} style={{textAlign: 'center', fontSize: 27, fontWeight: 800, color: C.red}}>修好要多久，你控制不了</Box>

      {[['紧急', '不能下单、数据出错', C.red, '#fdecec', 0.3], ['一般', '某个页面显示错位', C.yellowLine, C.yellow, 0.75]].map(([lv, s, color, fill, f], i) => (
        <Card key={lv} x={80 + i * 570} y={456} w={560} h={100} o={ramp(t, at(6, f))} s={pop(t, at(6, f))} color={color} fill={fill} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px'}}>
          <span style={{background: color, color: '#fff', borderRadius: 10, padding: '6px 16px', fontSize: 26, fontWeight: 800}}>{lv}</span>
          <span style={{fontSize: 26, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap'}}>{s}</span>
        </Card>
      ))}
      <Box x={80} y={420} o={ramp(t, L[6] + 0.1)} style={{fontSize: 21, fontWeight: 700, color: C.sub}}>按严重程度分级</Box>
    </>
  );
};

/* ④ The signed acceptance checklist draws the line. */
const Scene4 = ({t}) => {
  const checks = ['店长新增一道菜，下单能选到', '订单能一步步推进到已完成', '店员账号进不了设置页'];
  const sign = ramp(t, at(7, 0.7), 0.6);
  const drop = (f) => ramp(t, at(8, f), 0.7);
  const tagA = drop(0.12);
  const tagB = drop(0.58);
  return (
    <>
      <Chip x={40} y={92} t={t} at={L[7] + 0.1} text="回到开头" color={C.rose} fill="#fdf0f3" size={22} />
      <Card x={60} y={150} w={420} h={390} o={ramp(t, at(7, 0.45))} s={pop(t, at(7, 0.45))} color={C.ink} style={{padding: '20px 24px'}}>
        <div style={{fontSize: 28, fontWeight: 800, color: C.ink, marginBottom: 10}}>验收清单</div>
        {checks.map((c, i) => (
          <div key={c} style={{display: 'flex', alignItems: 'center', gap: 10, height: 58, borderTop: `1.5px dashed ${C.line}`, fontSize: 21, color: C.ink, whiteSpace: 'nowrap', opacity: ramp(t, at(7, 0.5) + i * 0.2)}}>
            <span style={{width: 26, height: 26, border: `2.5px solid ${C.green}`, borderRadius: 5, color: C.green, fontWeight: 800, textAlign: 'center', lineHeight: '22px', fontSize: 20, flex: 'none'}}>✓</span>{c}
          </div>
        ))}
        <div style={{marginTop: 22, fontSize: 21, color: C.sub, display: 'flex', alignItems: 'flex-end', gap: 10}}>
          甲方确认人：
          <svg width="150" height="44" viewBox="0 0 150 44"><path d="M6 32c12-22 20-24 18-6s10-16 22-14-6 22 10 16 18-20 26-10 4 14 18 8 22-6 40-8" fill="none" stroke={C.indigo} strokeWidth="3" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - sign} /></svg>
        </div>
        <Box x={250} y={300} o={ramp(t, at(7, 0.85))} style={{}}><Stamp x={0} y={0} t={t} at={at(7, 0.85)} text="已签字" color={C.green} size={24} rot={-8} /></Box>
      </Card>

      <Card x={540} y={150} w={680} h={96} o={span(t, L[7] + 0.3, L[8])} s={pop(t, L[7] + 0.3)} color={C.orange} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: C.ink}}>「不对」算缺陷，还是新需求？</Card>

      {[[540, C.green, '#ebf9ef', '缺陷', '在维护里修'], [900, C.orange, '#fff4e6', '新需求', '走变更另报价']].map(([x, color, fill, title, sub], i) => (
        <Card key={title} x={x} y={340} w={320} h={200} o={ramp(t, L[8] + 0.1 + i * 0.2)} color={color} fill={fill} style={{textAlign: 'center', paddingTop: 92}}>
          <div style={{fontSize: 32, fontWeight: 800, color}}>{title}</div>
          <div style={{fontSize: 22, fontWeight: 700, color: C.ink, marginTop: 6}}>{sub}</div>
        </Card>
      ))}
      <Card x={lerp(520, 560, tagA)} y={lerp(160, 356, tagA)} w={280} h={66} o={ramp(t, at(8, 0.05))} color={C.green} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 22, fontWeight: 800, color: C.ink, whiteSpace: 'nowrap'}}><Mark ok size={26} />清单上验过的</Card>
      <Card x={lerp(900, 920, tagB)} y={lerp(160, 356, tagB)} w={280} h={66} o={ramp(t, at(8, 0.5))} color={C.orange} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 22, fontWeight: 800, color: C.ink, whiteSpace: 'nowrap'}}>清单上没有的</Card>
    </>
  );
};

/* ⑤ The six things a maintenance agreement must spell out. */
const Scene5 = ({t}) => {
  const items = [
    ['期限', '从哪天到哪天，怎么续', C.teal],
    ['管什么', '缺陷修复、到期提醒、查备份', C.green],
    ['不管什么', '新功能、改规则，走变更', C.orange],
    ['响应时间分级', '多久回应、多久给方案', C.indigo],
    ['费用', '按月还是按年，超范围怎么算', C.rose],
    ['交接', '不续约时交还账号、文档、数据', C.slate],
  ];
  const end = E[9];
  const rise = lerp(0, 40, ramp(t, end + 0.2, 0.5));
  const fr = [0.18, 0.28, 0.42, 0.62, 0.76, 0.86];
  return (
    <>
      <Box x={0} y={112} w={1280} o={ramp(t, end + 0.3, 0.5)} style={{textAlign: 'center'}}>
        <div style={{fontSize: 46, fontWeight: 800, color: C.ink, letterSpacing: 2}}>{timings.title}</div>
        <div style={{width: 300 * ramp(t, end + 0.6, 0.5), height: 7, margin: '14px auto 0', borderRadius: 4, background: `linear-gradient(90deg, ${C.teal} 0 25%, ${C.indigo} 25% 50%, ${C.rose} 50% 75%, ${C.orange} 75%)`}} />
      </Box>
      <Box x={70} y={150} o={1 - ramp(t, end + 0.1, 0.3)} style={{fontSize: 28, fontWeight: 800, color: C.ink}}>维护约定，写清这六样</Box>
      {items.map(([title, sub, color], i) => (
        <Card key={title} x={70 + (i % 3) * 390} y={215 + Math.floor(i / 3) * 135 + rise} w={360} h={112} o={ramp(t, at(9, fr[i]))} s={pop(t, at(9, fr[i]))} color={color} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px'}}>
          <div style={{width: 42, height: 42, borderRadius: 42, background: color, color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: '42px', textAlign: 'center', fontFamily: MONO, flex: 'none'}}>{i + 1}</div>
          <div>
            <div style={{fontSize: 27, fontWeight: 800, color: C.ink}}>{title}</div>
            <div style={{fontSize: 17, color: C.sub, marginTop: 4, whiteSpace: 'nowrap'}}>{sub}</div>
          </div>
        </Card>
      ))}
      <Box x={0} y={642} w={1280} o={ramp(t, end + 0.9, 0.5)} style={{textAlign: 'center', fontSize: 15, color: C.sub, lineHeight: 1.7}}>
        内容出自《从 Demo 到商用》{timings.source}
      </Box>
    </>
  );
};

export const Film = makeFilm({id: ID, timings, scenes: [Scene1, Scene2, Scene3, Scene4, Scene5], dots: ['谁', '待', '修', '单', '约']});
