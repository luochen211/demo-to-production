import React from 'react';
import timings from './timings.json';
import {Arrow, Box, C, Card, Chip, Envelope, Mark, MONO, Node, Pill, Stamp, lerp, pop, ramp, span} from '../../src/kit.jsx';
import {makeFilm} from '../../src/shell.jsx';

export const ID = 'ch08-last-dish';
const L = timings.lines.map((l) => l.start);
const E = timings.lines.map((l) => l.start + l.dur);
const SEG = timings.segments.map((s) => s.start + 0.05);

const icon = {
  db: <svg width="20" height="20" viewBox="0 0 20 20"><ellipse cx="10" cy="4.5" rx="7" ry="2.5" fill="none" stroke="#fff" strokeWidth="2" /><path d="M3 4.5v11c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-11 M3 10c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" fill="none" stroke="#fff" strokeWidth="2" /></svg>,
  user: <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="6.5" r="3.5" fill="none" stroke="#fff" strokeWidth="2" /><path d="M3 18c0-3.9 3.1-6 7-6s7 2.1 7 6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>,
};

/* A customer's phone ordering the last dish. */
const Phone = ({x, y, t, name, tapAt, okAt, o = 1}) => (
  <Box x={x} y={y} w={200} h={330} o={o} style={{border: `4px solid ${C.ink}`, borderRadius: 30, background: '#fff', boxSizing: 'border-box', padding: '24px 16px', textAlign: 'center'}}>
    <div style={{fontSize: 18, color: C.sub}}>{name}</div>
    <div style={{fontSize: 30, fontWeight: 800, color: C.ink, margin: '10px 0 4px'}}>招牌菜</div>
    <div style={{fontSize: 20, color: C.sub, fontFamily: MONO}}>× 1</div>
    {t >= okAt ? (
      <div style={{marginTop: 30, transform: `scale(${pop(t, okAt)})`}}>
        <Mark ok size={66} style={{margin: '0 auto 10px'}} />
        <div style={{fontSize: 25, fontWeight: 800, color: C.green}}>下单成功</div>
      </div>
    ) : (
      <div style={{marginTop: 72, background: C.orange, color: '#fff', borderRadius: 14, padding: '12px 0', fontSize: 25, fontWeight: 700, transform: `scale(${t > tapAt && t < tapAt + 0.3 ? 0.92 : 1})`}}>下单</div>
    )}
  </Box>
);

/* The dish's remaining count. */
const Stock = ({x, y, w = 380, h = 210, n, o = 1, s = 1, sub = '今日限量 20 份'}) => (
  <Card x={x} y={y} w={w} h={h} o={o} s={s} color={n < 0 ? C.red : C.orange} style={{textAlign: 'center', padding: '16px 0'}}>
    <div style={{fontSize: 30, fontWeight: 800, color: C.ink}}>招牌菜</div>
    <div style={{fontSize: 18, color: C.sub, marginTop: 2}}>{sub}</div>
    <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 14, marginTop: 8}}>
      <span style={{fontSize: 24, color: C.sub}}>剩余</span>
      <span style={{fontSize: 74, fontWeight: 800, fontFamily: MONO, color: n < 0 ? C.red : C.ink, lineHeight: 1}}>{n}</span>
      <span style={{fontSize: 24, color: C.sub}}>份</span>
    </div>
  </Card>
);

/* One step on a request's timeline. */
const Step = ({x, y, w, t, at, text, color = C.indigo, fill = '#eef0ff', h = 64, size = 22}) => (
  <Box x={x} y={y} w={w} h={h} o={ramp(t, at)} s={pop(t, at)} style={{border: `2.5px solid ${color}`, background: fill, color, borderRadius: 12, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: size, fontWeight: 800, whiteSpace: 'nowrap'}}>{text}</Box>
);

const Who = ({x, y, text, color, o = 1, w = 130}) => (
  <Box x={x} y={y} w={w} h={64} o={o} style={{background: color, color: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 21, fontWeight: 700, whiteSpace: 'nowrap'}}>{icon.user}{text}</Box>
);

/* ① The last portion is sold twice, although the code checks first. */
const Scene1 = ({t}) => {
  const tap = L[0] + 2.2;
  const n = t >= L[1] + 0.4 ? -1 : t >= tap + 1.6 ? 0 : 1;
  const fly = ramp(t, tap, 0.9);
  const out = 1 - ramp(t, L[2], 0.3);
  const code = [['查：还剩几份？', C.indigo, 2.0], ['大于 0，才下单', C.green, 3.3], ['再扣 1 份', C.red, 4.6]];
  return (
    <>
      <Phone x={110} y={150} t={t} name="顾客 A" tapAt={tap} okAt={tap + 1.3} o={ramp(t, 0.1)} />
      <Phone x={970} y={150} t={t} name="顾客 B" tapAt={tap + 0.1} okAt={tap + 1.5} o={ramp(t, 0.3)} />
      <Stock x={450} y={110} n={n} o={ramp(t, 0.05)} s={pop(t, 0.05)} />
      <Envelope x={lerp(330, 440, fly)} y={260} o={span(t, tap, tap + 1.0, 0.15)} />
      <Envelope x={lerp(950, 840, fly)} y={260} o={span(t, tap, tap + 1.0, 0.15)} />
      <div style={{opacity: 1 - ramp(t, L[1] + 1.2, 0.25)}}><Stamp x={420} y={380} t={t} at={tap + 2.6} text="卖出了不存在的一份" color={C.orange} size={30} rot={-4} /></div>

      <div style={{opacity: out}}>
        <Card x={450} y={346} w={380} h={78} o={ramp(t, L[1] + 1.5)} s={pop(t, L[1] + 1.5)} color={C.red} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', fontSize: 25, fontWeight: 700, color: C.ink}}>
          <Mark size={34} />后厨：做不出第二份
        </Card>
        <Box x={450} y={448} w={380} o={ramp(t, L[1] + 2.9)} s={pop(t, L[1] + 2.9)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 24, fontWeight: 700, color: C.orange, border: `2px solid ${C.orange}`, borderRadius: 999, padding: '9px 0', background: '#fff4e6'}}>
          <svg width="22" height="22" viewBox="0 0 22 22"><path d="M5 2.5h4l1.5 4.5-2.5 1.5a11 11 0 0 0 5.5 5.5l1.5-2.5 4.5 1.5v4a2 2 0 0 1-2 2A16 16 0 0 1 3 4.5a2 2 0 0 1 2-2z" fill={C.orange} /></svg>
          打电话道歉 · 退款
        </Box>
      </div>

      <Card x={430} y={340} w={420} h={236} o={ramp(t, L[2] + 0.3)} s={pop(t, L[2] + 0.3)} color={C.indigo} fill="#f8f8ff">
        <div style={{padding: '12px 20px 6px', fontSize: 20, fontWeight: 700, color: C.sub}}>AI 写的第一版</div>
        {code.map(([text, color, at], i) => (
          <div key={i} style={{margin: '0 20px', height: 58, display: 'flex', alignItems: 'center', gap: 14, borderTop: `1.5px dashed ${C.line}`, opacity: ramp(t, L[2] + at, 0.25), fontSize: 25, fontWeight: 800, color}}>
            <span style={{fontFamily: MONO, color: C.sub, fontSize: 20}}>{i + 1}</span>{text}
          </div>
        ))}
      </Card>
    </>
  );
};

/* ② Tests never catch it; the race; the same bug with money. */
const Scene2 = ({t}) => {
  const a = span(t, SEG[1], L[4] - 0.1);
  const b = span(t, L[4], L[5] - 0.1);
  const c = ramp(t, L[5]);
  const runs = Array.from({length: 6}, (_, i) => L[3] + 0.4 + i * 0.45);
  const solo = [250, 470, 690, 910];
  return (
    <>
      <div style={{opacity: a}}>
        <Card x={130} y={110} w={430} h={440} color={C.teal}>
          <div style={{padding: '14px 20px 8px', fontSize: 24, fontWeight: 800, color: C.teal}}>上线前，自己点</div>
          {runs.map((at, i) => (
            <div key={i} style={{margin: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1.5px dashed ${C.line}`, opacity: ramp(t, at, 0.2), fontSize: 22, fontWeight: 700, color: C.ink}}>
              <span>下单</span><Mark ok size={28} />
            </div>
          ))}
        </Card>
        <Card x={640} y={130} w={300} h={150} o={ramp(t, L[3] + 2.4)} s={pop(t, L[3] + 2.4)} color={C.green} style={{textAlign: 'center', padding: '16px 0'}}>
          <div style={{fontSize: 22, color: C.sub}}>卖超</div>
          <div style={{fontSize: 64, fontWeight: 800, color: C.green, fontFamily: MONO, lineHeight: 1.2}}>0 次</div>
        </Card>
        <Box x={620} y={350} w={600} o={ramp(t, L[3] + 3.2)} s={pop(t, L[3] + 3.2)} style={{fontSize: 46, fontWeight: 800, color: C.orange, transformOrigin: 'left center'}}>为什么测不出来？</Box>
      </div>

      <div style={{opacity: b}}>
        <Who x={70} y={130} text="你一个人" color={C.teal} w={150} />
        {solo.map((x, i) => <Step key={i} x={x} y={130} w={150} t={t} at={L[4] + 0.2 + i * 0.3} text="下单" color={C.teal} fill="#e8f6f4" />)}
        <Box x={250} y={204} o={ramp(t, L[4] + 1.4)} style={{fontSize: 20, color: C.sub, fontWeight: 600}}>一单完了才下一单，永远碰不到一起</Box>
        <Who x={70} y={262} text="顾客 A" color={C.orange} w={150} o={ramp(t, L[4] + 2.0)} />
        <Who x={70} y={338} text="顾客 B" color={C.orange} w={150} o={ramp(t, L[4] + 2.0)} />
        <Step x={520} y={262} w={220} t={t} at={L[4] + 2.2} text="下单" color={C.orange} fill="#fff4e6" />
        <Step x={540} y={338} w={220} t={t} at={L[4] + 2.3} text="下单" color={C.orange} fill="#fff4e6" />
        <Box x={505} y={250} w={270} h={164} o={ramp(t, L[4] + 2.7)} style={{border: `3px dashed ${C.red}`, borderRadius: 14}} />
        <Box x={800} y={310} o={ramp(t, L[4] + 2.7)} style={{fontSize: 30, fontWeight: 800, color: C.red}}>同时</Box>
        <Box x={0} y={440} w={1280} o={ramp(t, L[4] + 3.5)} s={pop(t, L[4] + 3.5)} style={{textAlign: 'center'}}>
          <span style={{fontSize: 50, fontWeight: 800, color: C.indigo, letterSpacing: 6}}>竞态</span>
          <span style={{fontSize: 24, color: C.sub, marginLeft: 22}}>结果看谁快、谁慢</span>
        </Box>
      </div>

      <div style={{opacity: c}}>
        <Box x={0} y={92} w={1280} style={{textAlign: 'center', fontSize: 22, color: C.sub, fontWeight: 600}}>陪玩系统 · 提现审核</Box>
        <Card x={480} y={140} w={320} h={130} color={C.rose} style={{textAlign: 'center', padding: '18px 0'}}>
          <div style={{fontSize: 28, fontWeight: 800, color: C.ink}}>同一笔提现</div>
          <div style={{marginTop: 14}}><Pill text="待放款" /></div>
        </Card>
        {[[90, '管理员 A', 0], [990, '管理员 B', 0.12]].map(([x, name, d]) => (
          <React.Fragment key={name}>
            <Node x={x} y={300} w={200} h={150} title={name} icon={icon.user} color={C.slate} o={ramp(t, L[5] + 1.2 + d)}>
              <div style={{background: C.rose, color: '#fff', borderRadius: 12, padding: '10px 0', textAlign: 'center', fontSize: 24, fontWeight: 700, transform: `scale(${span(t, L[5] + 2.6 + d, L[5] + 2.9 + d, 0.05) ? 0.9 : 1})`}}>放款</div>
            </Node>
          </React.Fragment>
        ))}
        <Arrow x1={300} x2={560} y={375} o={ramp(t, L[5] + 2.8)} color={C.rose} />
        <Arrow x1={980} x2={720} y={375} o={ramp(t, L[5] + 2.9)} color={C.rose} />
        <Box x={560} y={290} w={160} h={170} o={ramp(t, L[5] + 2.8)} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12}}>
          {[0, 1].map((i) => (
            <div key={i} style={{opacity: ramp(t, L[5] + 3.2 + i * 0.3), transform: `scale(${pop(t, L[5] + 3.2 + i * 0.3)})`, fontSize: 24, fontWeight: 800, color: C.red, border: `2.5px solid ${C.red}`, borderRadius: 10, padding: '4px 16px', background: '#fff'}}>放款</div>
          ))}
        </Box>
        <Stamp x={480} y={492} t={t} at={L[5] + 4.2} text="可能放出去两次" size={32} rot={-4} />
      </div>
    </>
  );
};

/* ③ Slow motion: both requests check before either one deducts. */
const Scene3 = ({t}) => {
  const n = t >= L[7] + 1.7 ? -1 : t >= L[7] + 1.3 ? 0 : 1;
  const lanes = [[190, '顾客 A', 0], [320, '顾客 B', 0.25]];
  return (
    <>
      <Box x={0} y={94} w={1280} o={ramp(t, SEG[2])} s={pop(t, SEG[2])} style={{textAlign: 'center', fontSize: 34, fontWeight: 800, color: C.ink}}>明明查过了，为什么还卖出两份？</Box>
      {lanes.map(([y, name, d]) => (
        <React.Fragment key={name}>
          <Who x={60} y={y} text={name} color={C.orange} w={140} o={ramp(t, L[6] + 2.2)} />
          <Step x={220} y={y} w={230} t={t} at={L[6] + 3.0 + d} text="查：还剩 1 份" />
          <Step x={470} y={y} w={140} t={t} at={L[7] + 0.4 + d} text={<><Mark ok size={24} />能卖</>} color={C.green} fill="#ebf9ef" />
          <Step x={630} y={y} w={150} t={t} at={L[7] + 1.2 + d * 1.6} text="扣 1 份" color={C.red} fill="#fdecec" />
        </React.Fragment>
      ))}
      <Arrow x1={790} x2={880} y={290} o={ramp(t, L[7] + 1.2)} color={C.red} />
      <Stock x={890} y={180} w={330} h={210} n={n} sub="最后 1 份" o={ramp(t, L[6] + 2.2)} />
      <Stamp x={900} y={418} t={t} at={L[7] + 2.2} text="1 份卖成 2 份" size={30} rot={-5} />
      <Box x={455} y={176} w={170} h={222} o={ramp(t, L[7] + 3.4)} style={{border: `3px dashed ${C.red}`, borderRadius: 14, background: 'rgba(220,38,38,.05)'}} />
      <Box x={220} y={430} w={600} o={ramp(t, L[7] + 3.6)} s={pop(t, L[7] + 3.6)} style={{fontSize: 30, fontWeight: 800, color: C.red, textAlign: 'center'}}>「先查、再扣」是分开的两步</Box>
      <Box x={220} y={482} w={600} o={ramp(t, L[7] + 4.3)} style={{fontSize: 21, color: C.sub, textAlign: 'center'}}>中间这一下，另一个请求也查完了</Box>
    </>
  );
};

/* ④ Check and deduct in one database step, then look at rows changed. */
const Scene4 = ({t}) => {
  const m = ramp(t, L[8] + 0.1, 0.6);
  const go = [L[8] + 1.6, L[8] + 2.0];
  return (
    <>
      <Box x={lerp(470, 520, m)} y={108} o={ramp(t, SEG[3])} style={{fontSize: 30, fontWeight: 800, color: C.indigo, border: `2.5px solid ${C.indigo}`, background: '#eef0ff', borderRadius: 12, padding: '6px 20px'}}>查</Box>
      <Box x={lerp(760, 660, m)} y={108} o={ramp(t, SEG[3])} style={{fontSize: 30, fontWeight: 800, color: C.red, border: `2.5px solid ${C.red}`, background: '#fdecec', borderRadius: 12, padding: '6px 20px'}}>扣</Box>
      <Box x={614} y={110} o={ramp(t, L[8] + 0.3)} style={{fontSize: 30, fontWeight: 800, color: C.sub}}>+</Box>
      <Box x={752} y={116} o={ramp(t, L[8] + 0.7)} style={{fontSize: 26, fontWeight: 800, color: C.teal}}>= 一步</Box>

      <Node x={420} y={186} w={440} h={196} title="数据库，一步做完" icon={icon.db} color={C.teal} o={ramp(t, L[8] + 0.9)} s={pop(t, L[8] + 0.9)}>
        <div style={{fontSize: 24, fontWeight: 700, color: C.ink, lineHeight: 1.6, textAlign: 'center'}}>
          剩下的够这一单，才扣
          <div style={{opacity: ramp(t, L[8] + 1.9), fontSize: 26, color: C.teal, marginTop: 8, padding: '6px 0', borderTop: `1.5px dashed ${C.line}`}}>然后看：改到了几行？</div>
        </div>
      </Node>

      <Who x={60} y={200} text="顾客 A" color={C.orange} w={140} o={ramp(t, L[8] + 1.2)} />
      <Who x={60} y={290} text="顾客 B" color={C.orange} w={140} o={ramp(t, L[8] + 1.2)} />
      <Arrow x1={210} x2={412} y={232} o={ramp(t, L[8] + 1.4) * 0.6} />
      <Arrow x1={210} x2={412} y={322} o={ramp(t, L[8] + 1.4) * 0.6} />
      {go.map((at, i) => (
        <Envelope key={i} x={lerp(240, 400, ramp(t, at, 0.6))} y={232 + i * 90} o={span(t, at, at + 0.7, 0.15)} />
      ))}
      <Arrow x1={870} x2={920} y={232} o={ramp(t, L[8] + 2.4)} />
      <Arrow x1={870} x2={920} y={322} o={ramp(t, L[8] + 3.2)} />
      <Card x={930} y={196} w={300} h={72} o={ramp(t, L[8] + 2.4)} color={C.green} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', fontSize: 21, fontWeight: 700, whiteSpace: 'nowrap'}}>
        <span style={{fontFamily: MONO}}>改到 1 行</span><Mark ok size={26} />下单成功
      </Card>
      <Card x={930} y={286} w={300} h={72} o={ramp(t, L[8] + 3.2)} s={pop(t, L[8] + 3.2)} color={C.orange} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', fontSize: 21, fontWeight: 700, whiteSpace: 'nowrap'}}>
        <span style={{fontFamily: MONO, color: C.orange}}>改到 0 行</span>→ 已售罄
      </Card>

      <Card x={150} y={420} w={980} h={130} o={ramp(t, L[8] + 4.3)} s={pop(t, L[8] + 4.3)} color={C.rose} fill="#fff7f9" style={{padding: '12px 24px'}}>
        <div style={{fontSize: 21, fontWeight: 800, color: C.rose}}>提现也这样防</div>
        <div style={{display: 'flex', gap: 30, marginTop: 12, fontSize: 23, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap', alignItems: 'center'}}>
          <span style={{display: 'flex', alignItems: 'center', gap: 8}}>先到的放款：改到 1 行<Mark ok size={26} /></span>
          <span style={{opacity: ramp(t, L[8] + 5.0), display: 'flex', alignItems: 'center', gap: 8}}>后到的放款：<span style={{color: C.red}}>改到 0 行，放不出款</span></span>
        </div>
      </Card>
    </>
  );
};

/* ⑤ Three things to keep. */
const Scene5 = ({t}) => {
  const steps = [
    ['查和扣一步做完', '交给数据库，够这一单才扣', C.teal, 0.3],
    ['看改到几行', '0 行就回「已售罄」', C.indigo, 2.0],
    ['并发测试', '库存 1，同时 10 单，只成功 1 单', C.rose, 3.6],
  ];
  const end = E[9];
  const rise = lerp(0, 46, ramp(t, end + 0.2, 0.5));
  return (
    <>
      <Box x={0} y={112} w={1280} o={ramp(t, end + 0.3, 0.5)} style={{textAlign: 'center'}}>
        <div style={{fontSize: 50, fontWeight: 800, color: C.ink, letterSpacing: 2}}>{timings.title}</div>
        <div style={{width: 300 * ramp(t, end + 0.6, 0.5), height: 7, margin: '14px auto 0', borderRadius: 4, background: `linear-gradient(90deg, ${C.teal} 0 33%, ${C.indigo} 33% 66%, ${C.rose} 66%)`}} />
      </Box>
      {steps.map(([title, sub, color, at], i) => (
        <React.Fragment key={i}>
          <Card x={95 + i * 375} y={250 + rise} w={340} h={160} o={ramp(t, L[9] + at)} s={pop(t, L[9] + at)} color={color} style={{textAlign: 'center', padding: '22px 12px'}}>
            <div style={{width: 40, height: 40, borderRadius: 40, margin: '0 auto 10px', background: color, color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: '40px', fontFamily: MONO}}>{i + 1}</div>
            <div style={{fontSize: 29, fontWeight: 800, color: C.ink}}>{title}</div>
            <div style={{fontSize: 18, color: C.sub, marginTop: 8}}>{sub}</div>
          </Card>
          {i < 2 ? <Arrow x1={440 + i * 375} x2={466 + i * 375} y={330 + rise} o={ramp(t, L[9] + steps[i + 1][3])} /> : null}
        </React.Fragment>
      ))}
      <Box x={0} y={642} w={1280} o={ramp(t, end + 0.9, 0.5)} style={{textAlign: 'center', fontSize: 15, color: C.sub, lineHeight: 1.7}}>
        内容出自《从 Demo 到商用》{timings.source}
      </Box>
    </>
  );
};

export const Film = makeFilm({id: ID, timings, scenes: [Scene1, Scene2, Scene3, Scene4, Scene5], dots: ['卖', '测', '查', '扣', '记']});
