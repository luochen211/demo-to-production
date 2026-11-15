import React from 'react';
import timings from './timings.json';
import {Arrow, Box, C, Card, Chip, Mark, MONO, Stamp, lerp, pop, ramp, span} from '../../src/kit.jsx';
import {makeFilm} from '../../src/shell.jsx';

export const ID = 'ch06-green-tests';
const L = timings.lines.map((l) => l.start);
const D = timings.lines.map((l) => l.dur);

const TESTS = [
  '两份 14 元，合计 30.45',
  '售罄的菜，拒绝下单',
  '数量为 0，拒绝下单',
  '待接单 → 已接单',
  '待接单 → 已完成，拒绝',
  '没下过单的菜，可以删',
  '用过的菜，不能删',
];

/* A test run: one row per test. state(i) returns 'wait' | 'pass' | 'fail'. */
const TestPanel = ({x, y, w = 430, o = 1, s = 1, state, rowH = 44, title = '订单测试', only}) => {
  const rows = only ?? TESTS.map((_, i) => i);
  const st = rows.map((i) => state(i));
  const fail = st.filter((v) => v === 'fail').length;
  const pass = st.filter((v) => v === 'pass').length;
  const done = st.every((v) => v !== 'wait');
  return (
    <Card x={x} y={y} w={w} o={o} s={s} color={fail ? C.red : done ? C.green : C.line}>
      <div style={{padding: '10px 18px 6px', fontSize: 20, fontWeight: 700, color: C.ink, display: 'flex', justifyContent: 'space-between'}}>
        <span>{title}</span><span style={{fontFamily: MONO, color: C.sub, fontSize: 17}}>npm test</span>
      </div>
      {rows.map((i, k) => (
        <div key={i} style={{margin: '0 18px', height: rowH, display: 'flex', alignItems: 'center', gap: 12, borderTop: `1.5px dashed ${C.line}`, fontSize: 20, color: C.ink, whiteSpace: 'nowrap'}}>
          {st[k] === 'wait' ? <div style={{width: 24, height: 24, borderRadius: 24, border: `2.5px solid ${C.line}`, boxSizing: 'border-box', flex: 'none'}} /> : <Mark ok={st[k] === 'pass'} size={24} />}
          <span style={{color: st[k] === 'fail' ? C.red : C.ink}}>{TESTS[i]}</span>
        </div>
      ))}
      <div style={{margin: '0 18px', height: 50, display: 'flex', alignItems: 'center', gap: 16, borderTop: `2.5px solid ${C.ink}`, fontSize: 21, fontWeight: 800, fontFamily: MONO}}>
        <span style={{color: C.green}}>{pass} 通过</span>
        <span style={{color: fail ? C.red : C.sub}}>{fail} 失败</span>
      </div>
    </Card>
  );
};

/* A small file with lines of pseudo-code. lines: [text, style] */
const File = ({x, y, w, o = 1, s = 1, name, color = C.slate, lines, size = 22}) => (
  <Card x={x} y={y} w={w} o={o} s={s} color={color}>
    <div style={{background: color, color: '#fff', fontSize: 18, fontWeight: 700, padding: '6px 14px', borderRadius: '12px 12px 0 0'}}>{name}</div>
    <div style={{padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8}}>
      {lines.map(([text, style], i) => (
        <div key={i} style={{fontSize: size, fontFamily: MONO, color: C.ink, whiteSpace: 'nowrap', borderRadius: 6, padding: '2px 8px', ...style}}>{text}</div>
      ))}
    </div>
  </Card>
);

const runAt = (t, base, gap = 0.22) => (i) => (t >= base + i * gap ? 'pass' : 'wait');

/* ① All seven pass, yet the amount can still be wrong. */
const Scene1 = ({t}) => {
  const run = runAt(t, L[0] + 0.6);
  const loss = L[1] + D[1] * 0.55;
  return (
    <>
      <TestPanel x={80} y={110} o={ramp(t, 0.05)} s={pop(t, 0.05)} state={run} />
      <Chip x={540} y={118} t={t} at={L[0] + 2.4} until={L[1]} text="全部通过" color={C.green} fill="#ebf9ef" size={24} />

      <Card x={800} y={118} w={330} h={300} o={ramp(t, L[0] + 2.6)} s={pop(t, L[0] + 2.6)} style={{padding: '18px 22px', fontSize: 22}}>
        <div style={{fontSize: 18, color: C.sub, fontFamily: MONO}}>订单 #1024</div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14}}><span>菜品 × 2</span><span style={{fontFamily: MONO}}>¥28.00</span></div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10}}><span>税</span><span style={{fontFamily: MONO}}>¥2.45</span></div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: `2.5px solid ${C.ink}`, fontWeight: 800, fontSize: 28}}>
          <span>合计</span><span style={{fontFamily: MONO, color: t >= L[0] + 3.4 ? C.red : C.ink}}>¥ ?</span>
        </div>
        <div style={{marginTop: 20, fontSize: 19, color: C.sub, opacity: ramp(t, L[1] + 3.2)}}>页面上一切正常</div>
      </Card>
      <Box x={1080} y={70} o={ramp(t, L[0] + 3.4)} s={pop(t, L[0] + 3.4)} style={{width: 92, height: 92, borderRadius: 92, background: C.red, color: '#fff', fontSize: 64, fontWeight: 800, textAlign: 'center', lineHeight: '92px'}}>?</Box>

      <Box x={540} y={250} o={span(t, L[1] + 0.3, 99)} style={{display: 'flex', flexDirection: 'column', gap: 14}}>
        <div style={{display: 'flex', gap: 10, alignItems: 'center', fontSize: 22, fontWeight: 700, opacity: ramp(t, L[1] + 0.9)}}><Mark ok size={30} />通过亮绿</div>
        <div style={{display: 'flex', gap: 10, alignItems: 'center', fontSize: 22, fontWeight: 700, opacity: ramp(t, L[1] + 1.8)}}><Mark size={30} />没过亮红</div>
      </Box>
      <Chip x={800} y={450} t={t} at={loss} text="要么你赔" color={C.red} fill="#fdecec" size={26} />
      <Chip x={960} y={450} t={t} at={loss + 0.9} text="要么客户多付" color={C.red} fill="#fdecec" size={26} />
    </>
  );
};

/* ② Red turns green again; the test was loosened or deleted, not the code fixed. */
const Scene2 = ({t}) => {
  const failAt = L[2] + 1.6;
  const greenAt = L[2] + D[2] * 0.62;
  const st = (i) => (i === 0 && t >= failAt && t < greenAt ? 'fail' : 'pass');
  const a = span(t, timings.segments[1].start, L[3] - 0.1);
  const loosen = L[3] + 1.8;
  const del = L[3] + 3.0;
  const rule = L[3] + D[3] * 0.55;
  return (
    <>
      <div style={{opacity: a}}>
        <TestPanel x={80} y={110} state={st} />
        <Stamp x={530} y={440} t={t} at={greenAt} text="又全绿了" color={C.green} size={28} rot={-5} />
        <File x={680} y={150} w={470} name="下单金额的代码" o={ramp(t, L[2] + 0.3)} lines={[
          ['小计 = 单价 × 数量'],
          ['税 = 小计 × 税率', {background: '#fdecec', color: C.red}],
          ['合计 = 小计 + 税'],
        ]} />
        <Box x={700} y={350} o={ramp(t, L[2] + 0.8)} style={{display: 'flex', gap: 8, alignItems: 'center', fontSize: 20, fontWeight: 700, color: C.red}}><Mark size={24} />这里有错</Box>
        <Stamp x={860} y={410} t={t} at={greenAt + 1.0} text="一行没改" size={32} rot={-6} />
      </div>

      <div style={{opacity: ramp(t, L[3])}}>
        <Box x={80} y={104} o={ramp(t, L[3] + 0.2)} style={{fontSize: 30, fontWeight: 800, color: C.orange}}>AI 动的是测试</Box>
        <File x={80} y={160} w={520} name="订单测试" color={C.orange} o={ramp(t, L[3] + 0.4)} lines={[
          ['合计应该等于 30.45', {textDecoration: t >= loosen ? 'line-through' : 'none', color: t >= loosen ? C.sub : C.ink}],
          ['合计大于 0 就算过', {opacity: ramp(t, loosen + 0.2), background: '#fff4e6', color: C.orange}],
          ['售罄的菜，拒绝下单', {opacity: 1 - 0.75 * ramp(t, del, 0.3), textDecoration: t >= del ? 'line-through' : 'none'}],
        ]} />
        <Chip x={620} y={226} t={t} at={loosen + 0.2} text="放宽检查" color={C.orange} fill="#fff4e6" size={22} />
        <Chip x={620} y={290} t={t} at={del} text="干脆删掉" color={C.red} fill="#fdecec" size={22} />

        <Card x={800} y={380} w={400} h={150} o={ramp(t, rule)} s={pop(t, rule)} color={C.teal} fill="#eefaf8" style={{padding: '14px 20px'}}>
          <div style={{fontSize: 19, color: C.sub}}>规则文件</div>
          <div style={{fontSize: 26, fontWeight: 800, color: C.teal, marginTop: 10, lineHeight: 1.4}}>不许为了变绿<br />削弱测试</div>
        </Card>
      </div>
    </>
  );
};

/* ③ Break the code on purpose; the matching test must turn red. */
const Scene3 = ({t}) => {
  const broke = L[4] + D[4] * 0.6;
  const good = L[5] + 1.2;
  const bad = L[5] + D[5] * 0.45;
  const mini = (x, at, red, label, ok) => (
    <>
      <TestPanel x={x} y={300} w={400} o={ramp(t, at)} s={pop(t, at)} title="再跑一遍" only={[0, 1, 4]} rowH={40}
        state={(i) => (t < at + 0.5 ? 'wait' : i === 0 && red ? 'fail' : 'pass')} />
      <Box x={x} y={262} o={ramp(t, at + 0.7)} style={{display: 'flex', gap: 10, alignItems: 'center', fontSize: 24, fontWeight: 800, color: ok ? C.green : C.red}}><Mark ok={ok} size={28} />{label}</Box>
    </>
  );
  return (
    <>
      <Box x={0} y={96} w={1280} o={ramp(t, L[4] + 0.2)} s={pop(t, L[4] + 0.2)} style={{textAlign: 'center', fontSize: 34, fontWeight: 800, color: C.ink}}>这条测试靠得住吗？</Box>
      <Card x={340} y={160} w={600} h={80} o={ramp(t, L[4] + 1.6)} color={t >= broke ? C.red : C.line} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', fontSize: 26, fontFamily: MONO, color: C.ink, whiteSpace: 'nowrap'}}>
        <span>税率 =</span>
        <span style={{textDecoration: t >= broke ? 'line-through' : 'none', color: t >= broke ? C.sub : C.ink}}>8.75%</span>
        <span style={{opacity: ramp(t, broke), color: C.red, fontWeight: 800, fontFamily: 'inherit'}}>← 故意改错</span>
      </Card>
      <Chip x={960} y={180} t={t} at={L[4] + 2.6} text="反着来" color={C.indigo} fill="#eef0ff" size={24} />

      {mini(130, good - 0.9, true, '变红了：测试管用', true)}
      {mini(750, bad - 0.4, false, '还是全绿：没起作用', false)}
      <Stamp x={1000} y={520} t={t} at={bad + 0.9} text="没起作用" size={28} rot={-5} />
    </>
  );
};

/* ④ The answer: the test copied the code's own arithmetic. */
const Scene4 = ({t}) => {
  const a = span(t, timings.segments[3].start, L[8] - 0.1);
  const copy = L[6] + D[6] * 0.55;
  const same = L[7] + D[7] * 0.55;
  const calc = (row, at, l, r, strong) => (
    <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: row ? `1.5px dashed ${C.line}` : 'none', opacity: ramp(t, at), fontSize: strong ? 32 : 26, fontWeight: strong ? 800 : 600}}>
      <span>{l}</span><span style={{fontFamily: MONO, color: strong ? C.green : C.ink}}>{r}</span>
    </div>
  );
  return (
    <>
      <div style={{opacity: a}}>
        <Box x={0} y={92} w={1280} o={ramp(t, L[6] + 0.1)} style={{textAlign: 'center', fontSize: 30, fontWeight: 800, color: C.ink}}>七条全过，金额为什么还会错？</Box>
        <File x={110} y={170} w={430} name="下单金额的代码" o={ramp(t, L[6] + 0.8)} lines={[
          ['税 = 小计 × 税率', {background: '#fdecec', color: C.red}],
          ['合计 = 小计 + 税'],
        ]} />
        <File x={740} y={170} w={430} name="订单测试" color={C.orange} o={ramp(t, copy)} s={pop(t, copy)} lines={[
          ['税 = 小计 × 税率', {background: '#fdecec', color: C.red}],
          ['预期 = 小计 + 税'],
        ]} />
        <Arrow x1={555} x2={725} y={240} o={ramp(t, copy - 0.3)} color={C.orange} />
        <Box x={575} y={196} o={ramp(t, copy - 0.3)} style={{fontSize: 22, fontWeight: 800, color: C.orange}}>照着抄</Box>
        <div style={{opacity: 1 - ramp(t, L[7], 0.25)}}><Stamp x={470} y={380} t={t} at={copy + 0.5} text="测试照着代码抄" size={36} rot={-4} /></div>

        <Card x={110} y={360} w={430} h={70} o={ramp(t, L[7] + 1.4)} color={C.red} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', fontSize: 24, fontWeight: 700}}>
          <Mark size={28} />代码算出错的金额
        </Card>
        <Card x={740} y={360} w={430} h={70} o={ramp(t, L[7] + 2.4)} color={C.red} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', fontSize: 24, fontWeight: 700}}>
          <Mark size={28} />测试跟着算出同一个
        </Card>
        <Box x={560} y={364} w={160} o={ramp(t, same)} s={pop(t, same)} style={{textAlign: 'center', fontSize: 50, fontWeight: 800, color: C.sub, lineHeight: '60px'}}>=</Box>
        <Box x={0} y={470} w={1280} o={ramp(t, same + 0.6)} s={pop(t, same + 0.6)} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, fontSize: 30, fontWeight: 800, color: C.green}}><Mark ok size={36} />两边一对，还是绿的</Box>
      </div>

      <div style={{opacity: ramp(t, L[8])}}>
        <Chip x={110} y={200} t={t} at={L[8] + 0.2} text="预期值你来给" color={C.teal} fill="#eefaf8" size={28} />
        <Box x={110} y={280} w={420} o={ramp(t, L[8] + 0.9)} style={{fontSize: 23, color: C.sub, lineHeight: 1.7}}>
          用业务的话给，<br />不从代码里推算。<br />拿计算器就能核对。
        </Box>
        <Card x={640} y={190} w={500} o={ramp(t, L[8] + 1.0)} s={pop(t, L[8] + 1.0)} color={C.teal} style={{padding: '14px 26px'}}>
          {calc(0, L[8] + 1.4, '14 元 × 2 份', '28.00')}
          {calc(1, L[8] + 3.0, '税率 8.75%', '2.45')}
          {calc(1, L[8] + 4.3, '合计应该是', '30.45', true)}
        </Card>
      </div>
    </>
  );
};

/* ⑤ The three things to guard against, on one screen. */
const Scene5 = ({t}) => {
  const items = [
    ['预期值你来给', '用业务的话给，不从代码推算', C.teal, 0.2],
    ['不许为变绿改测试', '预期值被改了，问清为什么', C.orange, D[9] * 0.48],
    ['故意改坏一次', '对应的测试应该变红', C.rose, D[9] * 0.72],
  ];
  const end = L[9] + D[9];
  const rise = lerp(0, 46, ramp(t, end + 0.2, 0.5));
  return (
    <>
      <Box x={0} y={112} w={1280} o={ramp(t, end + 0.3, 0.5)} style={{textAlign: 'center'}}>
        <div style={{fontSize: 50, fontWeight: 800, color: C.ink, letterSpacing: 2}}>{timings.title}</div>
        <div style={{width: 300 * ramp(t, end + 0.6, 0.5), height: 7, margin: '14px auto 0', borderRadius: 4, background: `linear-gradient(90deg, ${C.teal} 0 33%, ${C.orange} 33% 66%, ${C.rose} 66%)`}} />
      </Box>
      {items.map(([title, sub, color, at], i) => (
        <Card key={i} x={110 + i * 370} y={250 + rise} w={320} h={160} o={ramp(t, L[9] + at)} s={pop(t, L[9] + at)} color={color} style={{textAlign: 'center', padding: '22px 12px'}}>
          <div style={{width: 40, height: 40, borderRadius: 40, margin: '0 auto 10px', background: color, color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: '40px', fontFamily: MONO}}>{i + 1}</div>
          <div style={{fontSize: 28, fontWeight: 800, color: C.ink}}>{title}</div>
          <div style={{fontSize: 18, color: C.sub, marginTop: 8}}>{sub}</div>
        </Card>
      ))}
      <Box x={0} y={642} w={1280} o={ramp(t, end + 0.9, 0.5)} style={{textAlign: 'center', fontSize: 15, color: C.sub, lineHeight: 1.7}}>
        内容出自《从 Demo 到商用》{timings.source}
      </Box>
    </>
  );
};

export const Film = makeFilm({id: ID, timings, scenes: [Scene1, Scene2, Scene3, Scene4, Scene5], dots: ['过', '绿', '坏', '抄', '防']});
