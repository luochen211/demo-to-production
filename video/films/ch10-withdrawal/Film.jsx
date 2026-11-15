import React from 'react';
import timings from './timings.json';
import {Arrow, Box, C, Card, Chip, Mark, MONO, Node, Stamp, lerp, pop, ramp, span} from '../../src/kit.jsx';
import {makeFilm} from '../../src/shell.jsx';

export const ID = 'ch10-withdrawal';
const L = timings.lines.map((l) => l.start);
const D = timings.lines.map((l) => l.dur);
/** Rough time the second caption row of line i starts being spoken. */
const R2 = (i) => {
  const [a, b] = timings.lines[i].rows;
  return L[i] + (D[i] * a.length) / (a.length + b.length);
};
const seg = (i) => timings.segments[i].start + 0.05;

const ST = {
  待审核: ['#8a5a00', '#ffe9a8', C.yellowLine],
  挂起: ['#fff', C.slate, C.slate],
  转复核: ['#fff', C.orange, C.orange],
  已通过: ['#fff', C.indigo, C.indigo],
  已放款: ['#fff', C.green, C.green],
};
const Status = ({s, size = 20}) => {
  const [fg, bg, bd] = ST[s];
  return <span style={{display: 'inline-block', padding: '3px 12px', borderRadius: 999, whiteSpace: 'nowrap', fontSize: size, fontWeight: 700, color: fg, background: bg, border: `2px solid ${bd}`}}>{s}</span>;
};

const W = '#fff';
const icon = {
  person: <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="6.5" r="3.6" fill="none" stroke={W} strokeWidth="2" /><path d="M3 18c0-4 3.2-6.4 7-6.4s7 2.4 7 6.4" fill="none" stroke={W} strokeWidth="2" strokeLinecap="round" /></svg>,
  sync: <svg width="20" height="20" viewBox="0 0 20 20"><path d="M16 7a6.5 6.5 0 0 0-11.5-1.5M4 13a6.5 6.5 0 0 0 11.5 1.5" fill="none" stroke={W} strokeWidth="2" strokeLinecap="round" /><path d="M4 2v4h4M16 18v-4h-4" fill="none" stroke={W} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  web: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="2" y="3" width="16" height="14" rx="2" fill="none" stroke={W} strokeWidth="2" /><path d="M2 7.5h16" stroke={W} strokeWidth="2" /></svg>,
  phone: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="5" y="1.5" width="10" height="17" rx="2.5" fill="none" stroke={W} strokeWidth="2" /></svg>,
  money: <svg width="20" height="20" viewBox="0 0 20 20"><path d="M5 3l5 6 5-6M4 10h12M4 14h12M10 9v9" fill="none" stroke={W} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
};
const Lock = ({size = 26, color = C.sub}) => (
  <svg width={size} height={size} viewBox="0 0 20 20"><rect x="3.5" y="9" width="13" height="9" rx="2" fill={color} /><path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" fill="none" stroke={color} strokeWidth="2.2" /></svg>
);

/** A straight arrow at any angle. */
const Diag = ({x1, y1, x2, y2, o = 1, color = C.sub, dashed}) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = (da) => `${x2 - 14 * Math.cos(a + da)},${y2 - 14 * Math.sin(a + da)}`;
  return (
    <svg width="1280" height="720" style={{position: 'absolute', left: 0, top: 0, opacity: o, overflow: 'visible'}}>
      <line x1={x1} y1={y1} x2={x2 - 4 * Math.cos(a)} y2={y2 - 4 * Math.sin(a)} stroke={color} strokeWidth="3" strokeDasharray={dashed ? '8 7' : undefined} />
      <polyline points={`${h(0.5)} ${x2},${y2} ${h(-0.5)}`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** A withdrawal application. */
const App = ({x, y, w = 300, o = 1, s = 1, no = 'A', status, income, struck, color = C.line, fill, big, tag}) => (
  <Card x={x} y={y} w={w} o={o} s={s} color={color} fill={fill} style={{padding: '14px 18px'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, fontWeight: 800, color: C.ink, whiteSpace: 'nowrap'}}>
      提现申请 <span style={{fontFamily: MONO, color: C.sub, fontWeight: 600}}>#{no}</span>
      {big ? <span style={{marginLeft: 'auto', fontSize: 16, color: C.orange, border: `2px solid ${C.orange}`, borderRadius: 6, padding: '0 6px'}}>大额</span> : null}
      {tag}
    </div>
    {income ? (
      <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, color: C.sub, margin: '10px 0 2px', whiteSpace: 'nowrap'}}>
        关联收入
        {struck ? <span style={{fontWeight: 700, color: C.sub, textDecoration: 'line-through'}}>{struck}</span> : null}
        <span style={{fontWeight: 800, fontSize: 22, color: struck ? C.red : C.ink}}>{income}</span>
      </div>
    ) : null}
    <div style={{marginTop: 10}}><Status s={status} /></div>
  </Card>
);

/* ① A large withdrawal skips the second review and still gets paid. */
const Scene1 = ({t}) => {
  const steps = ['提交申请', '审核', '复核', '放款'];
  const X = [70, 370, 670, 970];
  const skipAt = R2(0) + 0.2;
  const move1 = ramp(t, L[0] + 1.4, 0.6);
  const skip = ramp(t, skipAt, 1.0);
  const cardX = skip > 0 ? lerp(370, 970, skip) : lerp(70, 370, move1);
  const cardY = 340 + Math.sin(Math.PI * skip) * 70;
  const paid = t >= skipAt + 1.1;
  const grey = ramp(t, skipAt + 0.3, 0.3);
  const guard = ramp(t, L[1] + 0.3);
  return (
    <>
      <Box x={0} y={96} w={1280} o={ramp(t, 0.1)} style={{textAlign: 'center', fontSize: 34, fontWeight: 800, color: C.ink}}>
        大额提现，要过<span style={{color: C.orange}}>两道审核</span>
      </Box>
      {steps.map((name, i) => {
        const isReview = i === 2;
        const glow = isReview ? guard : 0;
        return (
          <React.Fragment key={name}>
            <Card x={X[i]} y={200} w={220} h={92} o={ramp(t, 0.2 + i * 0.25)} s={pop(t, 0.2 + i * 0.25)} color={isReview ? (glow ? C.orange : C.line) : i === 3 ? C.green : C.line} fill={isReview && grey && !glow ? '#f1f2f4' : C.card} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: glow ? `0 0 0 ${8 * glow}px rgba(217,115,13,.18)` : undefined}}>
              <div style={{fontSize: 27, fontWeight: 800, color: isReview && grey ? lerp(0, 1, glow) > 0.5 ? C.orange : C.sub : C.ink}}>{name}</div>
              {i === 1 || i === 2 ? <div style={{fontSize: 16, color: C.sub}}>第 {i} 道</div> : null}
            </Card>
            {i < 3 ? <Arrow x1={X[i] + 226} x2={X[i + 1] - 6} y={246} o={ramp(t, 0.4 + i * 0.25)} /> : null}
          </React.Fragment>
        );
      })}
      {/* the jump over the second review */}
      <Box x={460} y={130} w={640} h={80} o={ramp(t, skipAt, 0.4)}>
        <svg width="640" height="80">
          <path d="M20 72 Q320 -30 620 72" fill="none" stroke={C.red} strokeWidth="4" strokeDasharray="12 9" strokeDashoffset={-t * 30} />
          <path d="M604 56 L620 72 L598 76" fill="none" stroke={C.red} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Box>
      <Box x={676} y={300} w={208} o={grey * (1 - guard)} style={{textAlign: 'center', fontSize: 22, fontWeight: 800, color: C.red}}>没经过</Box>

      <App x={cardX} y={cardY} w={220} o={ramp(t, L[0] + 0.5)} s={pop(t, L[0] + 0.5)} big status={paid ? '已放款' : '转复核'} color={paid ? C.green : C.orange} />
      <Stamp x={950} y={490} t={t} at={skipAt + 1.4} text="钱放出去了" size={30} />

      {/* what the second review is there to stop */}
      <Box x={640} y={340} w={280} o={guard} style={{display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center'}}>
        <div style={{fontSize: 21, fontWeight: 700, color: C.orange}}>复核本来要拦住</div>
        {['金额大的', '有风险的'].map((x, k) => (
          <div key={x} style={{opacity: ramp(t, L[1] + 0.9 + k * 0.6), transform: `scale(${pop(t, L[1] + 0.9 + k * 0.6)})`, border: `2.5px solid ${C.orange}`, background: '#fff4e6', color: C.orange, borderRadius: 999, padding: '6px 22px', fontSize: 24, fontWeight: 800}}>{x}</div>
        ))}
      </Box>
      <Box x={737} y={128} o={ramp(t, R2(1) - 0.2)} s={pop(t, R2(1) - 0.2)} style={{fontSize: 64, fontWeight: 900, color: C.red}}>?</Box>
      <Chip x={70} y={500} t={t} at={R2(1)} text="答案先放着" color={C.sub} size={22} />
      <Chip x={250} y={500} t={t} at={R2(1) + 1.3} text="还有第二件怪事 →" color={C.indigo} fill="#f3f4ff" size={22} />
    </>
  );
};

/* ② A finished application gets overwritten by the next income sync. */
const Scene2 = ({t}) => {
  const S = seg(1);
  const hit = R2(2) + 1.5;
  const overwritten = t >= hit && t < L[4];
  const move = ramp(t, L[4] + 0.2, 0.6);
  const phaseA = 1 - ramp(t, L[3] - 0.1, 0.3);
  const phaseB = span(t, L[3], L[4] - 0.1);
  const phaseC = ramp(t, L[4] + 0.3);
  return (
    <>
      <App
        x={lerp(780, 110, move)} y={lerp(160, 210, move)} w={360}
        o={ramp(t, S)} s={pop(t, S)} no="A"
        status={t >= L[2] + 0.5 ? '已放款' : '已通过'}
        income={overwritten ? '收入 B' : '收入 A'} struck={overwritten ? '收入 A' : null}
        color={overwritten ? C.red : move > 0.5 ? C.sub : C.line}
        fill={move > 0.5 ? '#f4f5f7' : C.card}
        tag={<span style={{marginLeft: 'auto', opacity: ramp(t, L[4] + 0.8)}}><Lock /></span>}
      />

      {/* A: the sync writes new income into it */}
      <div style={{opacity: phaseA}}>
        <Node x={110} y={180} w={280} h={130} title="同步收入" icon={icon.sync} color={C.slate} o={ramp(t, R2(2) - 0.2)} s={pop(t, R2(2) - 0.2)}>
          <div style={{fontSize: 20, color: C.sub, lineHeight: 1.5}}>又来了一笔新收入：<b style={{color: C.ink}}>收入 B</b></div>
        </Node>
        <Arrow x1={402} x2={768} y={245} o={ramp(t, R2(2) + 0.3)} color={C.red} />
        <Box x={lerp(420, 700, ramp(t, R2(2) + 0.5, 0.9))} y={196} o={span(t, R2(2) + 0.5, hit, 0.15)} style={{background: '#fdecec', border: `2px solid ${C.red}`, color: C.red, borderRadius: 8, padding: '3px 10px', fontSize: 19, fontWeight: 700, whiteSpace: 'nowrap'}}>收入 B</Box>
        <Stamp x={840} y={400} t={t} at={hit + 0.2} text="被盖掉了" size={32} />
      </div>

      {/* B: money left with A, record now says B */}
      <div style={{opacity: phaseB}}>
        <Card x={110} y={150} w={360} h={96} color={C.green} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', opacity: ramp(t, L[3] + 0.2), whiteSpace: 'nowrap'}}>
          <Mark ok size={30} />
          <div><div style={{fontSize: 18, color: C.sub}}>已经放出去的钱</div><div style={{fontSize: 25, fontWeight: 800}}>按旧的 收入 A 放的</div></div>
        </Card>
        <Box x={260} y={256} o={ramp(t, L[3] + 1.2)} style={{fontSize: 34, fontWeight: 900, color: C.red}}>≠</Box>
        <Card x={110} y={306} w={360} h={96} color={C.red} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', opacity: ramp(t, L[3] + 1.4), whiteSpace: 'nowrap'}}>
          <Mark size={30} />
          <div><div style={{fontSize: 18, color: C.sub}}>申请上现在记的</div><div style={{fontSize: 25, fontWeight: 800, color: C.red}}>新的 收入 B</div></div>
        </Card>
        <Box x={110} y={440} w={1060} o={ramp(t, R2(3))} s={pop(t, R2(3))} style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 800, color: C.ink, transformOrigin: 'left center'}}>
          <span style={{background: C.red, color: '#fff', borderRadius: 8, padding: '4px 12px', fontSize: 22}}>毛病</span>
          已经结束的申请，同步收入时还被拿来复用
        </Box>
      </div>

      {/* C: leave finished ones alone, open a new one */}
      <div style={{opacity: phaseC}}>
        <Chip x={110} y={110} t={t} at={L[4] + 0.3} text="反直觉的改法" color={C.orange} fill="#fff4e6" size={22} />
        <Box x={110} y={392} w={360} o={ramp(t, L[4] + 1.0)} style={{textAlign: 'center', fontSize: 22, fontWeight: 800, color: C.sub}}>结束的申请，不再动</Box>
        <Node x={560} y={210} w={240} h={120} title="同步收入" icon={icon.sync} color={C.slate} o={ramp(t, R2(4) - 0.3)}>
          <div style={{fontSize: 20, color: C.sub}}>新收入：<b style={{color: C.ink}}>收入 B</b></div>
        </Node>
        <Arrow x1={810} x2={880} y={270} o={ramp(t, R2(4))} color={C.green} />
        <App x={890} y={186} w={300} no="B" income="收入 B" status="待审核" color={C.green} o={ramp(t, R2(4) + 0.3)} s={pop(t, R2(4) + 0.3)} />
        <Box x={890} y={366} w={300} o={ramp(t, R2(4) + 0.8)} style={{textAlign: 'center', fontSize: 22, fontWeight: 800, color: C.green}}>另开一张新申请</Box>
      </div>
    </>
  );
};

/* ③ Two admins press pay at once; only one update can go through. */
const Scene3 = ({t}) => {
  const S = seg(2);
  const click = L[5] + 1.0;
  const res = R2(5) - 1.0;
  const cond = R2(5) + 0.2;
  const admin = (y, name, ok) => (
    <>
      <Node x={80} y={y} w={230} h={130} title={name} icon={icon.person} color={C.indigo} o={ramp(t, S)}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <span style={{background: C.green, color: '#fff', borderRadius: 10, padding: '6px 18px', fontSize: 22, fontWeight: 800, transform: `scale(${span(t, click, click + 0.25, 0.08) ? 0.9 : 1})`}}>放款</span>
          <span style={{opacity: ramp(t, res + (ok ? 0 : 0.6), 0.2), transform: `scale(${pop(t, res + (ok ? 0 : 0.6), 0.3)})`}}><Mark ok={ok} size={34} /></span>
        </div>
      </Node>
      <Diag x1={320} y1={y + 65} x2={472} y2={ok ? 270 : 310} o={ramp(t, click + 0.1)} color={t >= res + (ok ? 0 : 0.6) ? (ok ? C.green : C.red) : C.sub} dashed={!ok && t >= res + 0.6} />
    </>
  );
  return (
    <>
      {admin(150, '管理员 甲', true)}
      {admin(370, '管理员 乙', false)}
      <Box x={70} y={86} o={span(t, click - 0.3, click + 0.8)} style={{fontSize: 22, fontWeight: 800, color: C.indigo}}>同一时刻点下去</Box>
      <App x={480} y={236} w={300} no="A" status={t >= res ? '已放款' : '已通过'} color={t >= res ? C.green : C.indigo} o={ramp(t, S + 0.2)} s={pop(t, S + 0.2)} />
      <Stamp x={498} y={420} t={t} at={res + 0.8} text="只成功一个" color={C.indigo} size={30} rot={-5} />

      <Card x={860} y={170} w={360} h={250} color={C.teal} fill="#f0faf8" o={ramp(t, cond)} s={pop(t, cond)} style={{padding: '18px 20px'}}>
        <div style={{fontSize: 21, color: C.sub, marginBottom: 14}}>改之前先核对</div>
        {['状态还是「已通过」', '更新时间没有变'].map((x, k) => (
          <div key={x} style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 25, fontWeight: 800, color: C.ink, margin: '0 0 14px', opacity: ramp(t, cond + 0.6 + k * 0.9)}}>
            <Mark ok size={28} />{x}
          </div>
        ))}
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 23, fontWeight: 800, color: C.red, opacity: ramp(t, cond + 2.6)}}>
          <Mark size={28} />对不上，就不改
        </div>
      </Card>
      <Arrow x1={858} x2={792} y={300} o={ramp(t, cond + 0.3)} color={C.teal} />
    </>
  );
};

/* ④ The answer: nobody asked which step the application had reached. */
const Scene4 = ({t}) => {
  const S = seg(3);
  const a = span(t, S, L[7] - 0.15);
  const b = span(t, L[7], L[8] - 0.15);
  const c = ramp(t, L[8]);
  const X = [150, 410, 670, 930];
  const rows = [
    ['普通审核', ['待审核', '挂起']],
    ['复核', ['转复核']],
    ['放款', ['已通过']],
  ];
  const test = R2(7) + 1.6;
  const entry = (y, title, ic, ok, at) => (
    <>
      <Node x={80} y={y} w={250} h={110} title={title} icon={ic} color={C.slate} o={ramp(t, at)} s={pop(t, at)}>
        <div style={{fontSize: 19, color: C.sub}}>点「放款」</div>
      </Node>
      <Arrow x1={340} x2={440} y={y + 55} o={ramp(t, at + 0.3)} />
      <Card x={450} y={y + 10} w={300} h={90} o={ramp(t, at + 0.5)} color={t >= R2(8) + (ok ? 0.6 : 1.6) ? (ok ? C.green : C.red) : C.line} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', fontSize: 23, fontWeight: 800, whiteSpace: 'nowrap'}}>
        <div>
          <div style={{fontSize: 16, color: C.sub, fontWeight: 600}}>AI 单独写的一份</div>
          状态检查{t >= R2(8) + (ok ? 0.6 : 1.6) ? (ok ? '（改了）' : '（忘了改）') : ''}
        </div>
        <span style={{marginLeft: 'auto', opacity: ramp(t, R2(8) + (ok ? 0.6 : 1.6))}}><Mark ok={ok} size={30} /></span>
      </Card>
      <Arrow x1={760} x2={900} y={y + 55} o={ramp(t, at + 0.7)} color={ok ? C.sub : t >= R2(8) + 1.6 ? C.red : C.sub} dashed={!ok && t >= R2(8) + 1.6} />
    </>
  );
  return (
    <>
      {/* A: back to the opening puzzle */}
      <div style={{opacity: a}}>
        {['提交申请', '审核', '复核', '放款'].map((n, i) => (
          <React.Fragment key={n}>
            <Card x={X[i]} y={104} w={200} h={64} color={i === 2 ? C.line : i === 3 ? C.green : C.line} fill={i === 2 ? '#f1f2f4' : C.card} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 23, fontWeight: 800, color: i === 2 ? C.sub : C.ink}}>{n}</Card>
            {i < 3 ? <Arrow x1={X[i] + 204} x2={X[i + 1] - 4} y={136} /> : null}
          </React.Fragment>
        ))}
        <Box x={520} y={168} w={520} h={70}>
          <svg width="520" height="70"><path d="M0 4 Q260 110 520 4" fill="none" stroke={C.red} strokeWidth="4" strokeDasharray="12 9" /></svg>
        </Box>
        <Box x={757} y={180} o={1 - ramp(t, R2(6) - 0.3)} style={{fontSize: 52, fontWeight: 900, color: C.red}}>?</Box>

        <Card x={110} y={270} w={430} h={92} o={ramp(t, R2(6))} s={pop(t, R2(6))} color={C.orange} style={{padding: '12px 18px'}}>
          <div style={{fontSize: 18, color: C.orange, fontWeight: 700}}>怪事 1</div>
          <div style={{fontSize: 24, fontWeight: 800}}>没经过复核，就放了款</div>
        </Card>
        <Card x={110} y={390} w={430} h={92} o={ramp(t, R2(6) + 0.5)} s={pop(t, R2(6) + 0.5)} color={C.orange} style={{padding: '12px 18px'}}>
          <div style={{fontSize: 18, color: C.orange, fontWeight: 700}}>怪事 2</div>
          <div style={{fontSize: 24, fontWeight: 800}}>放了款的申请，又被盖掉</div>
        </Card>
        <Arrow x1={552} x2={680} y={316} o={ramp(t, R2(6) + 1.0)} color={C.red} />
        <Arrow x1={552} x2={680} y={436} o={ramp(t, R2(6) + 1.0)} color={C.red} />
        <Card x={690} y={300} w={490} h={150} o={ramp(t, R2(6) + 1.3)} s={pop(t, R2(6) + 1.3)} color={C.red} fill="#fdecec" style={{padding: '20px 24px'}}>
          <div style={{fontSize: 21, color: C.red, fontWeight: 700}}>同一个病根</div>
          <div style={{fontSize: 32, fontWeight: 900, color: C.ink, marginTop: 8, whiteSpace: 'nowrap'}}>没看申请走到了哪一步</div>
        </Card>
      </div>

      {/* B: each action accepts one state */}
      <div style={{opacity: b}}>
        <Box x={0} y={96} w={1280} o={ramp(t, L[7] + 0.1)} style={{textAlign: 'center', fontSize: 34, fontWeight: 800, color: C.ink}}>
          权限 = 看<span style={{color: C.indigo}}>「谁」</span> + 看<span style={{color: C.rose}}>「在什么状态」</span>
        </Box>
        {rows.map(([act, states], i) => {
          const at = R2(7) - 0.6 + i * 0.7;
          const hot = i > 0;
          return (
            <Box key={act} x={250} y={180 + i * 82} w={780} o={ramp(t, at)} style={{display: 'flex', alignItems: 'center', gap: 22, fontSize: 27, fontWeight: 800, color: hot ? C.ink : C.sub, whiteSpace: 'nowrap'}}>
              <span style={{width: 150, textAlign: 'right'}}>{act}</span>
              <span style={{fontSize: 22, color: C.sub}}>只处理</span>
              <span style={{display: 'flex', gap: 10}}>{states.map((s) => <Status key={s} s={s} size={hot ? 24 : 20} />)}</span>
            </Box>
          );
        })}
        <Card x={250} y={440} w={780} h={90} o={ramp(t, test)} s={pop(t, test)} color={C.red} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', fontSize: 24, fontWeight: 800, whiteSpace: 'nowrap'}}>
          开头那张申请 <Status s="转复核" /> 去点「放款」
          <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, color: C.red, opacity: ramp(t, test + 0.7)}}><Mark size={32} />拒绝</span>
        </Card>
      </div>

      {/* C: two entrances, two copies of the check */}
      <div style={{opacity: c}}>
        <Box x={80} y={96} o={ramp(t, L[8] + 0.2)} style={{fontSize: 28, fontWeight: 800, color: C.ink}}>最容易漏的：<span style={{color: C.rose}}>入口</span></Box>
        {entry(160, '超管网页', icon.web, true, L[8] + 0.9)}
        {entry(330, '管理员小程序', icon.phone, false, L[8] + 1.5)}
        <Node x={910} y={170} w={240} h={270} title="放款" icon={icon.money} color={C.green} o={ramp(t, L[8] + 1.2)}>
          <div style={{fontSize: 20, color: C.sub}}>钱从这里出去</div>
        </Node>
        <Stamp x={470} y={482} t={t} at={R2(8) + 2.4} text="漏洞在没改的那一处" size={28} rot={-4} />
      </div>
    </>
  );
};

/* ⑤ Screenshot list. */
const Scene5 = ({t}) => {
  const i = timings.lines.length - 1;
  const r2 = R2(i);
  const steps = [
    ['只认一种状态', '每个动作只处理对应状态', C.teal, L[i] + 0.4],
    ['带条件去改', '核对状态和更新时间', C.indigo, L[i] + (r2 - L[i]) * 0.75],
    ['结束的不复用', '新收入另开新申请', C.rose, r2 + 0.1],
    ['入口共用检查', '网页、小程序同一套', C.orange, r2 + (L[i] + D[i] - r2) * 0.5],
  ];
  const end = L[i] + D[i];
  const rise = lerp(0, 46, ramp(t, end + 0.2, 0.5));
  return (
    <>
      <Box x={0} y={112} w={1280} o={ramp(t, end + 0.3, 0.5)} style={{textAlign: 'center'}}>
        <div style={{fontSize: 50, fontWeight: 800, color: C.ink, letterSpacing: 2}}>{timings.title}</div>
        <div style={{width: 300 * ramp(t, end + 0.6, 0.5), height: 7, margin: '14px auto 0', borderRadius: 4, background: `linear-gradient(90deg, ${C.teal} 0 25%, ${C.indigo} 25% 50%, ${C.rose} 50% 75%, ${C.orange} 75%)`}} />
      </Box>
      {steps.map(([title, sub, color, at], k) => (
        <React.Fragment key={k}>
          <Card x={86 + k * 286} y={250 + rise} w={250} h={150} o={ramp(t, at)} s={pop(t, at)} color={color} style={{textAlign: 'center', padding: '22px 12px'}}>
            <div style={{width: 40, height: 40, borderRadius: 40, margin: '0 auto 10px', background: color, color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: '40px', fontFamily: MONO}}>{k + 1}</div>
            <div style={{fontSize: 27, fontWeight: 800, color: C.ink}}>{title}</div>
            <div style={{fontSize: 17, color: C.sub, marginTop: 6}}>{sub}</div>
          </Card>
          {k < 3 ? <Arrow x1={340 + k * 286} x2={368 + k * 286} y={325 + rise} o={ramp(t, steps[k + 1][3])} /> : null}
        </React.Fragment>
      ))}
      <Box x={0} y={642} w={1280} o={ramp(t, end + 0.9, 0.5)} style={{textAlign: 'center', fontSize: 15, color: C.sub, lineHeight: 1.7}}>
        内容出自《从 Demo 到商用》{timings.source}
      </Box>
    </>
  );
};

export const Film = makeFilm({id: ID, timings, scenes: [Scene1, Scene2, Scene3, Scene4, Scene5], dots: ['跳', '盖', '同', '态', '单']});
