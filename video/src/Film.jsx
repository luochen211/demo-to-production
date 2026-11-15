import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import timings from './timings.json';
import {Arrow, Box, C, Card, Chip, Envelope, FONT, Ledger, Mark, MONO, Node, Order, Pill, Stamp, lerp, pop, ramp, span} from './kit.jsx';

const SEG_COLORS = [C.teal, C.orange, C.indigo, C.rose, C.slate];
const DOTS = ['页', '重', '幂', '序', '合'];
const NUM = ['①', '②', '③', '④', '⑤'];
const L = timings.lines.map((l) => l.start);
const S2 = timings.segments[1].start + 0.05;
const VO_END = timings.lines[9].start + timings.lines[9].dur;
const segEnd = (i) => (i + 1 < timings.segments.length ? timings.segments[i + 1].start : timings.total);

const icon = {
  phone: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="5" y="1.5" width="10" height="17" rx="2.5" fill="none" stroke="#fff" strokeWidth="2" /></svg>,
  bank: <svg width="20" height="20" viewBox="0 0 20 20"><path d="M2 8 L10 3 L18 8 M4 9v6 M8 9v6 M12 9v6 M16 9v6 M2 17h16" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>,
  server: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="2.5" y="3" width="15" height="6" rx="1.5" fill="none" stroke="#fff" strokeWidth="2" /><rect x="2.5" y="11" width="15" height="6" rx="1.5" fill="none" stroke="#fff" strokeWidth="2" /></svg>,
};

/* ① The success page is not proof; the callback is. */
const Scene1 = ({t}) => {
  const paid = t >= L[0] + 1.1;
  const dim = lerp(1, 0.45, ramp(t, L[2], 0.4));
  const fly = ramp(t, L[2] + 2.4, 0.9);
  const done = t >= L[2] + 4.4;
  return (
    <>
      <Box x={150} y={96} w={230} h={410} o={ramp(t, 0.05) * dim} s={pop(t, 0.05)} style={{border: `4px solid ${C.ink}`, borderRadius: 34, background: '#fff', boxSizing: 'border-box', padding: '34px 18px', textAlign: 'center'}}>
        <div style={{fontSize: 18, color: C.sub}}>Odyssey 餐厅</div>
        <div style={{fontSize: 40, fontWeight: 800, color: C.ink, margin: '14px 0 30px', fontFamily: MONO}}>¥38.00</div>
        {paid ? (
          <div style={{transform: `scale(${pop(t, L[0] + 1.1)})`}}>
            <Mark ok size={86} style={{margin: '0 auto 16px'}} />
            <div style={{fontSize: 30, fontWeight: 800, color: C.green}}>支付成功</div>
          </div>
        ) : (
          <div style={{marginTop: 70, background: C.green, color: '#fff', borderRadius: 14, padding: '12px 0', fontSize: 24, fontWeight: 700, transform: `scale(${t > L[0] + 0.75 ? 0.94 : 1})`}}>确认支付</div>
        )}
      </Box>
      <Stamp x={262} y={70} t={t} at={L[1] + 0.9} text="不算证据" size={34} />
      <Chip x={430} y={210} t={t} at={L[1] + 2.5} until={L[2]} text="页面可以被伪造" color={C.red} size={26} />
      <Chip x={430} y={290} t={t} at={L[1] + 3.6} until={L[2]} text="网络可能在半路断掉" color={C.red} size={26} />

      <Box x={470} y={104} w={760} o={ramp(t, L[2] + 0.1)} s={pop(t, L[2] + 0.1)} style={{textAlign: 'center', fontSize: 40, fontWeight: 800, color: C.teal}}>算数的是回调</Box>
      <Node x={500} y={226} title="支付平台" icon={icon.bank} color={C.orange} o={ramp(t, L[2] + 0.9)} s={pop(t, L[2] + 0.9)}>
        <div style={{fontSize: 19, color: C.sub, lineHeight: 1.5}}>微信支付<br />支付宝</div>
      </Node>
      <Node x={950} y={196} w={250} h={226} title="你的服务端" icon={icon.server} color={C.teal} o={ramp(t, L[2] + 1.5)} s={pop(t, L[2] + 1.5)}>
        <Order paid={done} flash={span(t, L[2] + 4.4, L[2] + 5.2)} />
      </Node>
      <Arrow x1={712} x2={938} y={302} o={ramp(t, L[2] + 2.0)} />
      <Envelope x={lerp(735, 915, fly)} y={302} o={span(t, L[2] + 2.2, L[2] + 4.3, 0.2)} label="「这一单付了」" />
    </>
  );
};

/* ② The same callback arrives three times and is booked three times. */
const Scene2 = ({t}) => {
  const arrive = [L[4] + 0.5, L[4] + 2.6, L[4] + 3.7];
  return (
    <>
      <Node x={110} y={216} title="支付平台" icon={icon.bank} color={C.orange} o={ramp(t, S2)}>
        <div style={{fontSize: 19, color: C.sub, lineHeight: 1.5}}>通知：<br />#1024 已付 ¥38</div>
      </Node>
      <Node x={560} y={186} w={250} h={226} title="你的服务端" icon={icon.server} color={C.teal} o={ramp(t, S2)}>
        <Order paid={t >= arrive[0] + 0.8} />
      </Node>
      <Arrow x1={322} x2={548} y={292} o={ramp(t, S2 + 0.15)} />

      <Envelope x={436} y={250 + Math.sin(t * 3) * 5} o={span(t, L[3] + 0.2, L[4] + 0.3, 0.2)} />
      <Chip x={340} y={150} t={t} at={L[3] + 0.3} until={L[4]} text="什么时候来？" color={C.orange} size={24} />
      <Chip x={380} y={340} t={t} at={L[3] + 1.2} until={L[4]} text="来几次？" color={C.orange} size={24} />

      {arrive.map((at, i) => (
        <Envelope key={i} x={lerp(345, 525, ramp(t, at, 0.8))} y={292} o={span(t, at, at + 0.95, 0.15)} />
      ))}
      <Arrow x1={548} x2={322} y={372} o={span(t, L[4] + 1.4, L[4] + 5.6) * 0.9} color={C.red} dashed />
      <Box x={348} y={382} o={span(t, L[4] + 1.5, L[4] + 5.6)} style={{fontSize: 20, fontWeight: 700, color: C.red, display: 'flex', gap: 8, alignItems: 'center', whiteSpace: 'nowrap'}}><Mark size={24} />没按要求回复成功</Box>
      <Chip x={140} y={390} t={t} at={L[4] + 2.2} text="隔一段时间重发" color={C.orange} fill="#fff4e6" size={22} />

      <Ledger x={900} y={156} t={t} bad rows={arrive.map((a) => a + 0.8)} o={ramp(t, L[4] + 0.2)} />
      <Stamp x={880} y={452} t={t} at={L[4] + 4.9} text="同一笔钱记了 3 次" size={30} rot={-5} />
    </>
  );
};

/* ③ Idempotent: only a pending order can become paid. */
const Scene3 = ({t}) => {
  const a = span(t, L[5], L[6] - 0.15);
  const go = [L[6] + 0.5, L[6] + 2.6, L[6] + 3.7];
  const row = (y, at, n) => (
    <Box x={250} y={y} w={760} o={ramp(t, at)} style={{display: 'flex', alignItems: 'center', gap: 26, fontSize: 28, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap'}}>
      <span style={{width: 110, textAlign: 'right'}}>做 {n} 次</span>
      <span style={{display: 'flex', gap: 8}}>
        {Array.from({length: 3}).map((_, i) => (
          <span key={i} style={{padding: '8px 14px', borderRadius: 10, fontSize: 20, border: `2px solid ${C.indigo}`, color: C.indigo, background: '#eef0ff', opacity: i < n ? ramp(t, at + 0.15 + i * 0.25, 0.2) : 0.12}}>改成已支付</span>
        ))}
      </span>
      <span style={{color: C.sub}}>→</span>
      <span style={{transform: `scale(${pop(t, at + 0.9)})`, opacity: ramp(t, at + 0.9)}}><Pill paid size={24} /></span>
    </Box>
  );
  return (
    <>
      <div style={{opacity: a}}>
        <Box x={0} y={96} w={1280} s={pop(t, L[5] + 0.3)} o={ramp(t, L[5] + 0.3)} style={{textAlign: 'center', fontSize: 60, fontWeight: 800, color: C.indigo, letterSpacing: 6}}>幂等</Box>
        {row(240, L[5] + 1.6, 1)}
        {row(330, L[5] + 2.7, 3)}
        <Stamp x={1010} y={282} t={t} at={L[5] + 4.2} text="结果一样" color={C.green} size={30} rot={-6} />
      </div>

      <div style={{opacity: ramp(t, L[6])}}>
        {go.map((at, i) => {
          const p = ramp(t, at, 0.7);
          return <Envelope key={i} x={lerp(100 + i * 62, 375, p)} y={lerp(280, 280, p)} o={1 - ramp(t, at + 0.7, 0.2)} />;
        })}
        <Box x={80} y={330} w={230} style={{textAlign: 'center', fontSize: 20, color: C.sub}}>同一条通知来了 3 次</Box>
        <Card x={410} y={212} w={350} h={136} color={C.indigo} fill="#f3f4ff">
          <div style={{padding: '14px 18px', fontSize: 19, color: C.sub}}>更新之前先问</div>
          <div style={{padding: '0 18px', fontSize: 26, fontWeight: 800, color: C.indigo, whiteSpace: 'nowrap'}}>订单还是「待支付」吗？</div>
        </Card>
        <Arrow x1={772} x2={888} y={280} o={ramp(t, go[0] + 0.8)} color={C.green} />
        <Box x={784} y={236} o={ramp(t, go[0] + 0.8)} style={{fontSize: 22, fontWeight: 800, color: C.green}}>是</Box>
        <Node x={900} y={150} w={250} h={226} title="你的服务端" icon={icon.server} color={C.teal}>
          <Order paid={t >= go[0] + 1.3} flash={span(t, go[0] + 1.3, go[0] + 2.1)} />
        </Node>
        <Box x={900} y={398} w={250} o={ramp(t, go[0] + 1.6)} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `2.5px solid ${C.line}`, borderRadius: 14, padding: '12px 16px', background: '#fff', boxSizing: 'border-box', fontSize: 21, fontWeight: 700}}>
          <span>营收记录</span><span style={{fontFamily: MONO}}>+¥38.00</span>
        </Box>
        <Box x={900} y={466} o={ramp(t, L[6] + 4.7)} s={pop(t, L[6] + 4.7)} style={{display: 'flex', gap: 8, alignItems: 'center', fontSize: 22, fontWeight: 800, color: C.green, transformOrigin: 'left center'}}><Mark ok size={26} />只记了 1 次</Box>

        <Box x={585} y={350} w={20} h={56} o={ramp(t, go[1] + 0.7)} style={{borderLeft: `3px dashed ${C.sub}`}} />
        <Box x={484} y={366} o={ramp(t, go[1] + 0.7)} style={{fontSize: 20, fontWeight: 700, color: C.sub}}>已经是了</Box>
        <Card x={430} y={410} w={330} h={70} o={ramp(t, go[1] + 0.8)} s={pop(t, go[1] + 0.8)} color={C.sub} fill="#f4f5f7" style={{display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', fontSize: 24, fontWeight: 700, color: C.ink}}>
          <Mark ok size={28} />直接回复成功
          <span style={{marginLeft: 'auto', fontFamily: MONO, color: C.sub}}>×{t >= go[2] + 0.8 ? 2 : 1}</span>
        </Card>
      </div>
    </>
  );
};

/* ④ Save first, reply second. */
const Scene4 = ({t}) => {
  const step = (x, y, n, text, at, ok, markAt, shake) => (
    <Card x={x + (shake ? Math.sin(t * 60) * 5 * span(t, markAt, markAt + 0.35, 0.05) : 0)} y={y} w={340} h={84} o={ramp(t, at)} s={pop(t, at)} color={t >= markAt ? (ok ? C.green : C.red) : C.line} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', fontSize: 25, fontWeight: 700, color: C.ink}}>
      <span style={{color: C.sub, fontFamily: MONO}}>{n}</span>{text}
      <span style={{marginLeft: 'auto', opacity: ramp(t, markAt, 0.15), transform: `scale(${pop(t, markAt, 0.3)})`}}><Mark ok={ok} size={32} /></span>
    </Card>
  );
  const up = lerp(0, -50, ramp(t, L[8], 0.4));
  const o1 = lerp(1, 0.5, ramp(t, L[8], 0.4));
  return (
    <>
      <div style={{opacity: o1, transform: `translateY(${up}px)`}}>
        <Chip x={90} y={150} t={t} at={L[7] + 0.2} text="正确的顺序" color={C.green} fill="#ebf9ef" size={22} />
        {step(90, 204, '1', '写进数据库', L[7] + 1.0, true, L[7] + 2.2)}
        <Arrow x1={440} x2={500} y={246} o={ramp(t, L[7] + 2.4)} />
        {step(510, 204, '2', '回复平台「成功」', L[7] + 2.6, true, L[7] + 3.6)}
      </div>

      <Chip x={90} y={326} t={t} at={L[8] + 0.2} text="顺序反了" color={C.red} fill="#fdecec" size={22} />
      {step(90, 380, '1', '回复平台「成功」', L[8] + 0.4, true, L[8] + 1.1)}
      <Arrow x1={440} x2={500} y={422} o={ramp(t, L[8] + 1.3)} />
      {step(510, 380, '2', '写进数据库', L[8] + 1.5, false, L[8] + 2.2, true)}
      <Box x={596} y={470} o={ramp(t, L[8] + 2.3)} style={{fontSize: 20, fontWeight: 700, color: C.red}}>没存进去</Box>

      <Chip x={930} y={150} t={t} at={L[8] + 2.9} text="平台不会再发" color={C.orange} fill="#fff4e6" size={22} />
      <Card x={930} y={212} w={250} h={84} o={ramp(t, L[8] + 3.9)} color={C.orange} style={{padding: '10px 16px'}}>
        <div style={{fontSize: 18, color: C.sub}}>平台账单</div>
        <div style={{fontSize: 28, fontWeight: 800, fontFamily: MONO, color: C.ink}}>¥38.00</div>
      </Card>
      <Card x={930} y={312} w={250} h={84} o={ramp(t, L[8] + 4.3)} color={C.red} style={{padding: '10px 16px'}}>
        <div style={{fontSize: 18, color: C.sub}}>系统记录</div>
        <div style={{fontSize: 28, fontWeight: 800, fontFamily: MONO, color: C.red}}>¥0.00</div>
      </Card>
      <Stamp x={912} y={420} t={t} at={L[8] + 4.9} text="系统里没有的钱" size={30} rot={-5} />
    </>
  );
};

/* ⑤ The whole handling order on one screen. */
const Scene5 = ({t}) => {
  const steps = [
    ['验签', '验不过直接拒绝', C.teal, 0.2],
    ['只改待支付', '重复的直接回复成功', C.indigo, 1.5],
    ['写库后再回复', '顺序不能反', C.rose, 3.4],
    ['定时补查', '一直没来就去平台查', C.orange, 5.2],
  ];
  const end = L[9] + timings.lines[9].dur;
  const rise = lerp(0, 46, ramp(t, end + 0.2, 0.5));
  return (
    <>
      <Box x={0} y={112} w={1280} o={ramp(t, end + 0.3, 0.5)} style={{textAlign: 'center'}}>
        <div style={{fontSize: 50, fontWeight: 800, color: C.ink, letterSpacing: 2}}>{timings.title}</div>
        <div style={{width: 300 * ramp(t, end + 0.6, 0.5), height: 7, margin: '14px auto 0', borderRadius: 4, background: `linear-gradient(90deg, ${C.teal} 0 25%, ${C.indigo} 25% 50%, ${C.rose} 50% 75%, ${C.orange} 75%)`}} />
      </Box>
      {steps.map(([title, sub, color, at], i) => (
        <React.Fragment key={i}>
          <Card x={86 + i * 286} y={250 + rise} w={250} h={150} o={ramp(t, L[9] + at)} s={pop(t, L[9] + at)} color={color} style={{textAlign: 'center', padding: '22px 12px'}}>
            <div style={{width: 40, height: 40, borderRadius: 40, margin: '0 auto 10px', background: color, color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: '40px', fontFamily: MONO}}>{i + 1}</div>
            <div style={{fontSize: 27, fontWeight: 800, color: C.ink}}>{title}</div>
            <div style={{fontSize: 17, color: C.sub, marginTop: 6}}>{sub}</div>
          </Card>
          {i < 3 ? <Arrow x1={340 + i * 286} x2={368 + i * 286} y={325 + rise} o={ramp(t, L[9] + steps[i + 1][3])} /> : null}
        </React.Fragment>
      ))}
      <Box x={0} y={642} w={1280} o={ramp(t, end + 0.9, 0.5)} style={{textAlign: 'center', fontSize: 15, color: C.sub, lineHeight: 1.7}}>
        内容出自《从 Demo 到商用》{timings.source}
      </Box>
    </>
  );
};

const SCENES = [Scene1, Scene2, Scene3, Scene4, Scene5];

const Chrome = ({t, seg}) => (
  <>
    <Box x={34} y={26} s={pop(t, timings.segments[seg].start, 0.3)} style={{background: SEG_COLORS[seg], color: '#fff', borderRadius: 8, padding: '5px 14px', fontSize: 19, fontWeight: 700, transformOrigin: 'left center', whiteSpace: 'nowrap'}}>{NUM[seg]} {timings.segments[seg].name}</Box>
    <Box x={1010} y={30} w={236} style={{display: 'flex', justifyContent: 'flex-end', gap: 10, fontSize: 16, color: C.sub}}>
      {DOTS.map((d, i) => {
        const on = i === seg || seg === DOTS.length - 1;
        return (
          <span key={i} style={{display: 'flex', alignItems: 'center', gap: 4, color: on ? C.ink : C.sub, fontWeight: on ? 700 : 400}}>
            <span style={{width: 13, height: 13, borderRadius: 13, boxSizing: 'border-box', background: on ? SEG_COLORS[i] : 'transparent', border: `2px solid ${on ? SEG_COLORS[i] : '#b9c1c9'}`}} />{d}
          </span>
        );
      })}
    </Box>
  </>
);

const Caption = ({t}) => {
  const i = timings.lines.findLastIndex((l) => t >= l.start - 0.1);
  if (i < 0) return null;
  const line = timings.lines[i];
  const next = timings.lines[i + 1];
  const until = next && next.seg === line.seg ? next.start - 0.1 : line.start + line.dur + 0.45;
  const o = span(t, line.start - 0.1, until, 0.12);
  return (
    <Box x={0} y={612} w={1280} o={o} style={{display: 'flex', justifyContent: 'center'}}>
      <div style={{background: 'rgba(38,46,56,.92)', color: '#fff', borderRadius: 10, padding: '9px 24px', fontSize: 25, lineHeight: 1.45, textAlign: 'center', fontWeight: 500}}>
        {line.rows.map((r, k) => <div key={k}>{r}</div>)}
      </div>
    </Box>
  );
};

export const Film = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const seg = timings.segments.findLastIndex((s) => t >= s.start);
  const Scene = SCENES[seg];
  const start = timings.segments[seg].start;
  const sceneO = Math.min(seg === 0 ? 1 : ramp(t, start, 0.25), seg === SCENES.length - 1 ? 1 : 1 - ramp(t, segEnd(seg) - 0.2, 0.2));
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #ffffff 0%, ${C.bg} 100%)`, fontFamily: FONT, color: C.ink}}>
      <div style={{opacity: sceneO}}><Scene t={t} /></div>
      <Chrome t={t} seg={seg} />
      <Caption t={t} />
      <Audio src={staticFile('voice.mp3')} />
      <Audio src={staticFile('music.mp3')} volume={(f) => 0.16 * interpolate(f, [0, 20, durationInFrames - 60, durationInFrames - 1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * interpolate(f, [VO_END * fps, VO_END * fps + 30], [1, 2.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
    </AbsoluteFill>
  );
};
