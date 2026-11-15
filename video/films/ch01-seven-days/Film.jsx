import React from 'react';
import timings from './timings.json';
import {Arrow, Box, C, Card, Chip, MONO, Mark, Stamp, lerp, pop, ramp, span} from '../../src/kit.jsx';
import {makeFilm} from '../../src/shell.jsx';

export const ID = 'ch01-seven-days';
const L = timings.lines.map((l) => l.start);
const D = timings.lines.map((l) => l.dur);
const S = timings.segments.map((s) => s.start + 0.05);
/** A moment inside line i, as a fraction of its spoken length. */
const at = (i, f) => L[i] + D[i] * f;

const GRAY = '#eef1f4';

/* A month on a calendar: days 1–7 are development, the rest is waiting. */
const Calendar = ({x, y, t, o = 1}) => {
  const cell = 60;
  const gap = 8;
  return (
    <Card x={x} y={y} w={508} h={416} o={o} color={C.line} style={{padding: '14px 20px'}}>
      <div style={{fontSize: 22, fontWeight: 800, color: C.ink, height: 40}}>一个月</div>
      <div style={{position: 'relative'}}>
        {Array.from({length: 31}).map((_, k) => {
          const d = k + 1;
          const dev = d <= 7;
          const fill = dev ? ramp(t, L[0] + 0.3 + k * 0.2, 0.25) : 0;
          const last = d === 31 && t >= at(0, 0.62);
          const q = !dev && d < 31 && t >= at(1, 0.5) + (d - 8) * 0.04;
          return (
            <div key={d} style={{position: 'absolute', left: (k % 7) * (cell + gap), top: Math.floor(k / 7) * (cell + gap), width: cell, height: cell, borderRadius: 10, boxSizing: 'border-box',
              background: dev ? `rgba(10,143,132,${0.12 + 0.88 * fill})` : last ? '#fff4e6' : q ? '#fdecec' : GRAY,
              border: `2px solid ${last ? C.orange : q ? '#f3b4b4' : 'transparent'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: q ? 28 : 20, fontWeight: 700,
              color: dev ? (fill > 0.5 ? '#fff' : C.teal) : last ? C.orange : q ? C.red : '#9aa5b1'}}>
              {q ? '?' : d}
              {d === 7 ? <Mark ok size={24} style={{position: 'absolute', right: -8, top: -8, opacity: ramp(t, at(0, 0.3)), transform: `scale(${pop(t, at(0, 0.3))})`}} /> : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

/* ① Seven days to build, a month before anyone uses it. */
const Scene1 = ({t}) => {
  const row = (y, from, text, color, ok = true) => (
    <Box x={680} y={y} o={ramp(t, from)} s={pop(t, from)} style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 27, fontWeight: 700, color, whiteSpace: 'nowrap', transformOrigin: 'left center'}}>
      {ok ? <Mark ok size={32} /> : null}{text}
    </Box>
  );
  return (
    <>
      <Calendar x={90} y={110} t={t} o={ramp(t, 0.05)} />
      <Box x={680} y={130} o={ramp(t, at(0, 0.3))} style={{fontSize: 30, fontWeight: 800, color: C.teal, whiteSpace: 'nowrap'}}>第 7 天：能交付</Box>
      <Box x={680} y={186} o={ramp(t, at(0, 0.62))} s={pop(t, at(0, 0.62))} style={{fontSize: 30, fontWeight: 800, color: C.orange, whiteSpace: 'nowrap', transformOrigin: 'left center'}}>一个月后：业务部门才用上</Box>
      <Box x={680} y={256} w={500} o={ramp(t, L[1])} style={{borderTop: `2px dashed ${C.line}`}} />
      {row(284, L[1] + 0.2, '代码跑通了', C.ink)}
      {row(344, at(1, 0.2), '页面能打开', C.ink)}
      {row(404, at(1, 0.35), '部署也做完了', C.ink)}
      <Stamp x={700} y={480} t={t} at={at(1, 0.6)} text="中间二十多天，卡在哪？" size={32} rot={-4} />
    </>
  );
};

/* A bar of days: development part plus everything after it. */
const DayBar = ({x, y, dev, rest, o = 1, s = 1, devLabel}) => {
  const k = 28;
  return (
    <Box x={x} y={y} o={o} s={s} style={{display: 'flex', height: 60, transformOrigin: 'left center'}}>
      <div style={{width: dev * k, background: C.teal, color: '#fff', borderRadius: '10px 0 0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden'}}>{devLabel}</div>
      <div style={{width: rest * k, background: '#dfe4ea', color: C.slate, borderRadius: '0 10px 10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 600}}>等待、审查、验收 {rest} 天</div>
      <div style={{position: 'absolute', left: 30 * k + 16, top: 14, fontSize: 26, fontWeight: 800, fontFamily: MONO, color: C.ink, whiteSpace: 'nowrap'}}>{Math.round(dev + rest)} 天</div>
    </Box>
  );
};

const icon = {
  laptop: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="3" y="3.5" width="14" height="10" rx="1.5" fill="none" stroke="#fff" strokeWidth="2" /><path d="M1 16.5h18" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>,
  eye: <svg width="20" height="20" viewBox="0 0 20 20"><path d="M1.5 10 C5 4 15 4 18.5 10 C15 16 5 16 1.5 10 Z" fill="none" stroke="#fff" strokeWidth="2" /><circle cx="10" cy="10" r="2.6" fill="#fff" /></svg>,
};

const Version = ({x, y, n, o = 1, dim = 0, q}) => (
  <Box x={x} y={y} w={150} h={56} o={o} style={{background: '#fff', border: `2.5px solid ${dim ? '#b9c1c9' : C.indigo}`, borderRadius: 12, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 22, fontWeight: 700, color: dim ? C.sub : C.indigo}}>
    版本 {n}
    {q ? <span style={{position: 'absolute', right: -14, top: -16, width: 30, height: 30, borderRadius: 30, background: C.orange, color: '#fff', fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: q}}>?</span> : null}
  </Box>
);

/* ② Faster coding barely moves the end date; extra versions queue up. */
const Scene2 = ({t}) => {
  const a = span(t, S[1], L[3] - 0.1);
  const shrink = ramp(t, at(2, 0.58), 0.7);
  const go1 = ramp(t, L[4] + 0.2, 0.8);
  const go2 = ramp(t, at(4, 0.5), 0.8);
  const q = ramp(t, at(3, 0.5)) * (1 - ramp(t, L[4], 0.2));
  return (
    <>
      <div style={{opacity: a}}>
        <Chip x={90} y={104} t={t} at={S[1]} text="假设" color={C.sub} size={22} />
        <Box x={90} y={186} o={ramp(t, L[2] + 0.2)} style={{fontSize: 26, fontWeight: 800, color: C.ink}}>原来</Box>
        <DayBar x={210} y={170} dev={7} rest={23} devLabel="开发 7 天" o={ramp(t, L[2] + 0.2)} />
        <Box x={90} y={306} o={ramp(t, at(2, 0.5))} style={{fontSize: 26, fontWeight: 800, color: C.teal}}>AI 提速</Box>
        <DayBar x={210} y={290} dev={lerp(7, 3, shrink)} rest={23} devLabel={shrink > 0.9 ? '3 天' : ''} o={ramp(t, at(2, 0.5))} />
        <Box x={210 + 26 * 28} y={276} w={4 * 28} h={88} o={ramp(t, at(2, 0.8))} style={{border: `3px dashed ${C.red}`, borderRadius: 10, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: C.red, whiteSpace: 'nowrap'}}>少 4 天</Box>
        <Stamp x={760} y={410} t={t} at={at(2, 0.82)} text="只快了 4 天" size={36} rot={-5} />
      </div>

      <div style={{opacity: ramp(t, L[3])}}>
        <Card x={90} y={150} w={250} h={300} color={C.teal}>
          <div style={{background: C.teal, color: '#fff', fontSize: 20, fontWeight: 700, padding: '7px 14px', borderRadius: '12px 12px 0 0', display: 'flex', gap: 8, alignItems: 'center'}}>{icon.laptop}你：一天 3 个</div>
        </Card>
        <Card x={930} y={150} w={270} h={300} color={C.rose}>
          <div style={{background: C.rose, color: '#fff', fontSize: 20, fontWeight: 700, padding: '7px 14px', borderRadius: '12px 12px 0 0', display: 'flex', gap: 8, alignItems: 'center'}}>{icon.eye}甲方审查</div>
          <div style={{padding: '150px 18px 0', fontSize: 22, fontWeight: 800, color: C.rose, textAlign: 'center', opacity: ramp(t, L[4] + 0.5)}}>一周审完 1 个</div>
          <div style={{display: 'flex', gap: 5, padding: '10px 18px 0', opacity: ramp(t, L[4] + 0.5)}}>
            {Array.from({length: 7}).map((_, k) => (
              <div key={k} style={{flex: 1, height: 16, borderRadius: 4, background: k < 7 * ramp(t, L[4] + 0.8, D[4]) ? C.rose : GRAY}} />
            ))}
          </div>
        </Card>
        <Arrow x1={350} x2={420} y={316} o={ramp(t, L[3] + 0.3)} />
        <Arrow x1={850} x2={920} y={316} o={ramp(t, L[3] + 0.3)} />
        <Box x={430} y={256} w={410} h={120} o={ramp(t, L[4] + 0.2)} style={{border: `2.5px dashed ${C.orange}`, borderRadius: 14, boxSizing: 'border-box'}} />
        <Box x={430} y={392} w={410} o={ramp(t, at(4, 0.55))} style={{textAlign: 'center', fontSize: 24, fontWeight: 800, color: C.orange}}>停在流程里排队</Box>

        <Version x={lerp(140, 990, go1)} y={lerp(210, 238, go1)} n={1} o={ramp(t, L[3] + 0.2)} />
        <Version x={lerp(140, 660, go2)} y={lerp(286, 288, go2)} n={2} o={ramp(t, L[3] + 0.5)} dim={t >= at(3, 0.5) ? 1 : 0} q={q} />
        <Version x={lerp(140, 470, go2)} y={lerp(362, 288, go2)} n={3} o={ramp(t, L[3] + 0.8)} dim={t >= at(3, 0.5) ? 1 : 0} q={q} />
        <Box x={360} y={470} w={560} o={span(t, at(3, 0.55), L[4])} style={{textAlign: 'center', fontSize: 28, fontWeight: 800, color: C.orange}}>多出来的两个，变不成成果？</Box>
      </div>
    </>
  );
};

const Gear = ({size = 44, color = C.sub}) => (
  <svg width={size} height={size} viewBox="0 0 44 44">
    {Array.from({length: 8}).map((_, k) => (
      <rect key={k} x="19" y="2" width="6" height="10" rx="1.5" fill={color} transform={`rotate(${k * 45} 22 22)`} />
    ))}
    <circle cx="22" cy="22" r="13" fill={color} />
    <circle cx="22" cy="22" r="5" fill="#fff" />
  </svg>
);

const STAGES = ['需求确认', '开发', '甲方审查', '业务用上'];
const SX = (k) => 110 + k * 280;

/* The delivery chain; `neck` is the (fractional) index of the bottleneck. */
const Chain = ({y, t, o = 1, neck, neckO = 1, devFast = 0}) => (
  <div style={{opacity: o}}>
    {STAGES.map((name, k) => {
      const hot = neckO > 0.5 && Math.abs(neck - k) < 0.5;
      return (
        <React.Fragment key={name}>
          <Card x={SX(k)} y={y} w={220} h={96} color={hot ? C.red : C.line} fill={hot ? '#fdecec' : '#fff'} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: hot ? C.red : C.ink}}>
            {name}
            {k === 1 && devFast ? <span style={{marginLeft: 8, opacity: devFast}}><Mark ok size={28} /></span> : null}
          </Card>
          {k < 3 ? <Arrow x1={SX(k) + 226} x2={SX(k) + 274} y={y + 48} /> : null}
        </React.Fragment>
      );
    })}
    <Box x={lerp(SX(1), SX(2), neck - 1) + 110 - 60} y={y - 62} w={120} o={neckO} style={{textAlign: 'center'}}>
      <span style={{display: 'inline-block', background: C.red, color: '#fff', borderRadius: 8, padding: '4px 14px', fontSize: 24, fontWeight: 800}}>卡点</span>
      <div style={{width: 0, height: 0, margin: '0 auto', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: `12px solid ${C.red}`}} />
    </Box>
  </div>
);

/* ③ A line moves at the speed of its slowest part. */
const Scene3 = ({t}) => {
  const a = span(t, S[2], L[6] - 0.1);
  const n = Math.round(10000 * ramp(t, L[5] + 0.4, 1.6));
  /* parts run fast, then slow down to the slowest part's pace */
  const dt = Math.max(0, t - L[5]);
  const brake = at(5, 0.5) - L[5];
  const run = 70 * Math.min(dt, brake) + 18 * Math.max(0, dt - brake);
  const partX = (k) => 90 + ((k * 125 + run) % 1125);
  return (
    <>
      <div style={{opacity: a}}>
        <Box x={0} y={112} w={1280} o={ramp(t, L[5])} style={{textAlign: 'center', fontSize: 34, fontWeight: 800, color: C.ink}}>
          Model 3：约 <span style={{fontFamily: MONO, color: C.indigo}}>{n}</span> 个独特部件
        </Box>
        <Box x={90} y={372} w={1100} h={16} o={ramp(t, L[5] + 0.2)} style={{background: C.slate, borderRadius: 8}} />
        {Array.from({length: 9}).map((_, k) => {
          const x = partX(k);
          const bad = k === 4;
          return (
            <Box key={k} x={x - 10} y={292} w={80} h={76} o={ramp(t, L[5] + 0.2 + k * 0.05) * Math.min(1, (1180 - x) / 60, (x - 80) / 30)} style={{background: '#fff', border: `2.5px solid ${bad ? C.red : C.line}`, borderRadius: 12, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Gear color={bad ? C.red : '#9aa5b1'} />
            </Box>
          );
        })}
        <Box x={partX(4) - 70} y={226} w={200} o={ramp(t, at(5, 0.45))} s={pop(t, at(5, 0.45))} style={{textAlign: 'center'}}>
          <span style={{display: 'inline-block', border: `2px solid ${C.red}`, color: C.red, background: '#fdecec', borderRadius: 999, padding: '6px 16px', fontSize: 24, fontWeight: 600, whiteSpace: 'nowrap'}}>最慢的那一个</span>
        </Box>
        <Box x={0} y={430} w={1280} o={ramp(t, at(5, 0.55))} style={{textAlign: 'center', fontSize: 30, fontWeight: 800, color: C.red}}>整条生产线，只能跟着它走</Box>
      </div>

      <div style={{opacity: ramp(t, L[6])}}>
        <Box x={0} y={104} w={1280} s={pop(t, L[6] + 0.1)} style={{textAlign: 'center', fontSize: 52, fontWeight: 800, color: C.indigo, letterSpacing: 4}}>约束理论</Box>
        <Chain y={290} t={t} neck={1} neckO={ramp(t, at(6, 0.45))} o={ramp(t, at(6, 0.25))} />
        <Box x={0} y={440} w={1280} o={ramp(t, at(6, 0.7))} style={{textAlign: 'center', fontSize: 30, fontWeight: 800, color: C.ink}}>整体多快，由<span style={{color: C.red}}>卡点</span>决定</Box>
      </div>
    </>
  );
};

/* ④ The bottleneck moved to the client's review; hand in complete material. */
const Scene4 = ({t}) => {
  const a = span(t, S[3], L[8] - 0.1);
  const move = ramp(t, at(7, 0.5), 0.8);
  const answer = ramp(t, at(7, 0.75));
  const b = span(t, L[8], L[9] - 0.1);
  const seg = (w, text, color, fill) => (
    <div style={{width: w, height: 58, background: fill, border: `2px solid ${color}`, color, borderRadius: 10, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, whiteSpace: 'nowrap'}}>{text}</div>
  );
  const bar = (y, from, items) => (
    <Box x={260} y={y} style={{display: 'flex', gap: 6}}>
      {items.map(([w, text, color, fill], k) => (
        <div key={k} style={{opacity: ramp(t, from + k * 0.35, 0.25)}}>{seg(w, text, color, fill)}</div>
      ))}
    </Box>
  );
  const audit = [130, '审查', C.rose, '#fdeef2'];
  const resend = [130, '补交', C.red, '#fdecec'];
  return (
    <>
      <div style={{opacity: a}}>
        <Box x={113} y={112} style={{display: 'flex', gap: 4}} o={ramp(t, L[7])}>
          {Array.from({length: 31}).map((_, k) => (
            <div key={k} style={{width: 30, height: 30, borderRadius: 6, background: k < 7 ? C.teal : lerp(0, 1, answer) > 0.5 ? '#f6c9d4' : GRAY, color: k < 7 ? '#fff' : C.red, fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{k >= 7 && k < 30 && answer < 0.5 ? '?' : ''}</div>
          ))}
        </Box>
        <Box x={113 + 7 * 34} y={150} w={23 * 34 - 4} o={answer} style={{textAlign: 'center', borderTop: `3px solid ${C.rose}`, paddingTop: 6, fontSize: 24, fontWeight: 800, color: C.rose}}>这二十多天：卡在甲方审查</Box>
        <Chain y={330} t={t} neck={1 + move} neckO={ramp(t, L[7] + 0.2)} devFast={ramp(t, at(7, 0.35))} />
        <Box x={SX(1)} y={440} w={220} o={ramp(t, at(7, 0.35))} style={{textAlign: 'center', fontSize: 22, fontWeight: 700, color: C.green}}>开发变快了</Box>
      </div>

      <div style={{opacity: b}}>
        <Card x={90} y={110} w={500} h={300} color={C.rose}>
          <div style={{background: C.rose, color: '#fff', fontSize: 22, fontWeight: 700, padding: '8px 16px', borderRadius: '12px 12px 0 0'}}>甲方审查</div>
          {[['流程要确认', L[8] + 0.2], ['权限和数据要检查', at(8, 0.2)]].map(([text, from]) => (
            <div key={text} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '22px 20px 0', fontSize: 27, fontWeight: 700, color: C.ink, opacity: ramp(t, from)}}>
              {text}<span style={{fontSize: 18, padding: '3px 12px', borderRadius: 999, color: '#8a5a00', background: '#ffe9a8', border: `2px solid ${C.yellowLine}`}}>检查中</span>
            </div>
          ))}
          <div style={{display: 'flex', gap: 16, margin: '34px 20px 0', opacity: ramp(t, at(8, 0.48))}}>
            {['订单', '资金'].map((w) => (
              <div key={w} style={{flex: 1, height: 70, borderRadius: 12, background: '#f4f5f7', border: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 26, fontWeight: 800, color: C.slate}}>
                <span style={{fontFamily: MONO, color: C.orange}}>{w === '资金' ? '¥' : '#'}</span>{w}
              </div>
            ))}
          </div>
        </Card>
        <Box x={700} y={170} o={ramp(t, at(8, 0.62))} s={pop(t, at(8, 0.62))} style={{transformOrigin: 'left center'}}>
          <div style={{position: 'relative', background: '#fff', border: `2.5px solid ${C.teal}`, borderRadius: 18, padding: '18px 28px', fontSize: 32, fontWeight: 800, color: C.teal, whiteSpace: 'nowrap'}}>
            「我这里跑通了」
            <div style={{position: 'absolute', left: 40, bottom: -16, width: 26, height: 26, background: '#fff', borderRight: `2.5px solid ${C.teal}`, borderBottom: `2.5px solid ${C.teal}`, transform: 'rotate(45deg)'}} />
          </div>
          <div style={{marginTop: 26, fontSize: 22, color: C.sub, fontWeight: 600}}>开发者</div>
        </Box>
        <Stamp x={890} y={330} t={t} at={at(8, 0.8)} text="不算数" size={44} rot={-8} />
      </div>

      <div style={{opacity: ramp(t, L[9])}}>
        <Box x={0} y={104} w={1280} o={ramp(t, L[9] + 0.1)} style={{textAlign: 'center', fontSize: 34, fontWeight: 800, color: C.ink}}>你能缩短的，是<span style={{color: C.rose}}>审查</span></Box>
        <Box x={90} y={252} w={160} o={ramp(t, at(9, 0.25))} style={{fontSize: 24, fontWeight: 800, color: C.red}}>反复补交</Box>
        {bar(236, at(9, 0.25), [audit, resend, audit, resend, audit])}
        <Box x={90} y={392} w={160} o={ramp(t, at(9, 0.6))} style={{fontSize: 24, fontWeight: 800, color: C.green}}>一次交齐</Box>
        {bar(376, at(9, 0.6), [[160, '材料交齐', C.green, '#ebf9ef'], audit])}
        <Stamp x={640} y={376} t={t} at={at(9, 0.82)} text="对方等得少" color={C.green} size={32} rot={-5} />
      </div>
    </>
  );
};

/* ⑤ Takeaway list, then the title. */
const Scene5 = ({t}) => {
  const end = L[10] + D[10];
  const rise = lerp(0, 46, ramp(t, end + 0.2, 0.5));
  const docs = ['测试证据', '变更说明', '风险清单', '验收文档'];
  return (
    <>
      <Box x={0} y={112} w={1280} o={ramp(t, end + 0.3, 0.5)} style={{textAlign: 'center'}}>
        <div style={{fontSize: 50, fontWeight: 800, color: C.ink, letterSpacing: 2}}>{timings.title}</div>
        <div style={{width: 300 * ramp(t, end + 0.6, 0.5), height: 7, margin: '14px auto 0', borderRadius: 4, background: `linear-gradient(90deg, ${C.teal} 0 50%, ${C.rose} 50%)`}} />
      </Box>
      <Card x={110} y={250 + rise} w={420} h={250} o={ramp(t, L[10] + 0.2)} s={pop(t, L[10] + 0.2)} color={C.teal} style={{padding: '22px 26px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 40, height: 40, borderRadius: 40, background: C.teal, color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: '40px', textAlign: 'center', fontFamily: MONO}}>1</div>
          <div style={{fontSize: 28, fontWeight: 800, color: C.ink}}>排期</div>
        </div>
        <div style={{fontSize: 34, fontWeight: 800, color: C.teal, marginTop: 26}}>按「对方用上」算</div>
        <div style={{fontSize: 20, color: C.sub, marginTop: 14}}>审查和验收的时间，一起算进去</div>
      </Card>
      <Card x={570} y={250 + rise} w={600} h={250} o={ramp(t, at(10, 0.35))} s={pop(t, at(10, 0.35))} color={C.rose} style={{padding: '22px 26px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 40, height: 40, borderRadius: 40, background: C.rose, color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: '40px', textAlign: 'center', fontFamily: MONO}}>2</div>
          <div style={{fontSize: 28, fontWeight: 800, color: C.ink}}>交付带齐</div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', marginTop: 24}}>
          {docs.map((d, k) => (
            <div key={d} style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 27, fontWeight: 700, color: C.ink, opacity: ramp(t, at(10, 0.45 + k * 0.12)), transform: `scale(${pop(t, at(10, 0.45 + k * 0.12))})`, transformOrigin: 'left center'}}>
              <Mark ok size={30} />{d}
            </div>
          ))}
        </div>
      </Card>
      <Box x={0} y={642} w={1280} o={ramp(t, end + 0.9, 0.5)} style={{textAlign: 'center', fontSize: 15, color: C.sub, lineHeight: 1.7}}>
        内容出自《从 Demo 到商用》{timings.source}
      </Box>
    </>
  );
};

export const Film = makeFilm({id: ID, timings, scenes: [Scene1, Scene2, Scene3, Scene4, Scene5], dots: ['月', '快', '卡', '审', '单']});
