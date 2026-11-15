import React from 'react';
import timings from './timings.json';
import {Arrow, Box, C, Card, Chip, Mark, MONO, Node, Stamp, lerp, pop, ramp, span} from '../../src/kit.jsx';
import {makeFilm} from '../../src/shell.jsx';

export const ID = 'ch07-day-one';
const L = timings.lines.map((l) => l.start);
const D = timings.lines.map((l) => l.dur);
const S = timings.segments.map((s) => s.start + 0.05);

const icon = {
  laptop: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="3.5" y="3.5" width="13" height="9" rx="1.5" fill="none" stroke="#fff" strokeWidth="2" /><path d="M1.5 16h17" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>,
  user: <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="6.5" r="3.5" fill="none" stroke="#fff" strokeWidth="2" /><path d="M3 18c0-4 3-6 7-6s7 2 7 6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>,
  page: <svg width="20" height="20" viewBox="0 0 20 20"><path d="M5 2h7l4 4v12H5z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" /></svg>,
};

/* A list of order rows, filled with data or left empty. */
const Rows = ({t, at = 0, n = 4, empty}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
    {Array.from({length: n}).map((_, i) => (
      <div key={i} style={{height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', boxSizing: 'border-box', border: `2px ${empty ? 'dashed' : 'solid'} ${C.line}`, background: empty ? '#fafbfc' : '#fff', opacity: empty ? 1 : ramp(t, at + i * 0.15, 0.25)}}>
        {empty ? null : (
          <>
            <span style={{width: 12, height: 12, borderRadius: 12, background: C.green, flex: 'none'}} />
            <span style={{fontSize: 17, fontWeight: 600, color: C.ink}}>订单</span>
            <span style={{flex: 1, height: 8, borderRadius: 4, background: '#e3e8ed'}} />
          </>
        )}
      </div>
    ))}
  </div>
);

const Spinner = ({t, size = 40, color = C.orange}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{transform: `rotate(${t * 400}deg)`, flex: 'none'}}>
    <circle cx="20" cy="20" r="15" fill="none" stroke="#eceff2" strokeWidth="5" />
    <path d="M20 5 A15 15 0 0 1 35 20" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
  </svg>
);

const Person = ({color = C.slate, size = 46}) => (
  <svg width={size} height={size} viewBox="0 0 44 44">
    <circle cx="22" cy="13" r="9" fill={color} />
    <path d="M5 43 C5 27 39 27 39 43 Z" fill={color} />
  </svg>
);

const Status = ({ok, text, o = 1, s = 1}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, fontSize: 23, fontWeight: 800, color: ok ? C.green : C.red, opacity: o, transform: `scale(${s})`, transformOrigin: 'left center'}}>
    <Mark ok={ok} size={30} />{text}
  </div>
);

/* ① Works on your computer; the customer sees no data. */
const Scene1 = ({t}) => {
  const ship = ramp(t, L[0] + 1.5, 0.9);
  return (
    <>
      <Node x={90} y={110} w={420} h={300} title="你的电脑" icon={icon.laptop} color={C.teal} o={ramp(t, 0.05)} s={pop(t, 0.05)}>
        <Rows t={t} at={0.3} />
        <Status ok text="一切正常" o={ramp(t, 1.0)} />
      </Node>

      <Arrow x1={525} x2={755} y={262} o={ramp(t, L[0] + 1.4)} />
      <Box x={530} y={206} w={220} o={ramp(t, L[0] + 1.4)} style={{textAlign: 'center', fontSize: 22, fontWeight: 700, color: C.sub}}>部署上线</Box>
      <Box x={lerp(540, 700, ship)} y={244} o={span(t, L[0] + 1.5, L[0] + 2.4, 0.15)} style={{fontFamily: MONO, fontSize: 18, fontWeight: 800, color: '#fff', background: C.slate, borderRadius: 8, padding: '4px 10px'}}>{'</>'}</Box>

      <Node x={770} y={110} w={420} h={300} title="客户打开" icon={icon.user} color={C.orange} o={ramp(t, L[0] + 2.3)} s={pop(t, L[0] + 2.3)}>
        <div style={{position: 'relative'}}>
          <Rows empty />
          <div style={{position: 'absolute', left: 0, right: 0, top: 58, display: 'flex', justifyContent: 'center'}}><Spinner t={t} size={48} /></div>
        </div>
        <Status text="数据一条也出不来" o={ramp(t, L[0] + 3.4)} s={pop(t, L[0] + 3.4)} />
      </Node>

      <Chip x={548} y={296} t={t} at={L[1] + 0.2} text="同一份代码" color={C.indigo} fill="#eef0ff" size={22} />
      <Box x={0} y={448} w={1280} o={ramp(t, L[1] + 2.0)} style={{textAlign: 'center', fontSize: 22, color: C.sub, fontWeight: 600}}>答案藏在一个数字里</Box>
      <Box x={0} y={480} w={1280} o={ramp(t, L[1] + 2.6)} s={pop(t, L[1] + 2.6)} style={{textAlign: 'center', fontFamily: MONO, fontSize: 84, fontWeight: 800, color: C.orange, letterSpacing: 8, lineHeight: 1}}>
        8787<span style={{color: C.rose, opacity: 0.5 + 0.5 * Math.sin(t * 6)}}>?</span>
      </Box>
    </>
  );
};

/* ② 15 people, 3 hours, a mini program each. Is it live? */
const Scene2 = ({t}) => {
  const out = 1 - ramp(t, L[4] - 0.1, 0.35);
  const step = ['编译', '预览', '上传', '提交审核', '发布'];
  const reached = t >= L[4] + D[4] * 0.62;
  const clock = ramp(t, L[2] + 2.0, 1.6);
  return (
    <>
      <div style={{opacity: out}}>
        <Chip x={90} y={96} t={t} at={S[1]} text="线下聚会，带大家动手" color={C.orange} fill="#fff4e6" size={22} />
        {Array.from({length: 15}).map((_, i) => {
          const col = i % 5;
          const row = Math.floor(i / 5);
          const at = L[2] + 0.4 + i * 0.07;
          return (
            <Box key={i} x={110 + col * 108} y={170 + row * 112} w={96} o={ramp(t, at, 0.2)} s={pop(t, at)} style={{textAlign: 'center'}}>
              <Person size={70} />
            </Box>
          );
        })}
        <Box x={100} y={520} w={540} o={ramp(t, L[2] + 0.8)} style={{textAlign: 'center', fontSize: 30, fontWeight: 800, color: C.slate, fontFamily: MONO}}>15 <span style={{fontFamily: 'inherit', fontSize: 24}}>人</span></Box>

        <Card x={720} y={150} w={460} h={210} o={ramp(t, L[2] + 1.6)} s={pop(t, L[2] + 1.6)} color={C.orange} style={{padding: '22px 28px'}}>
          <div style={{fontSize: 20, color: C.sub}}>从零开始</div>
          <div style={{fontSize: 64, fontWeight: 800, color: C.orange, fontFamily: MONO, lineHeight: 1.2}}>{(clock * 3).toFixed(1)}<span style={{fontSize: 34, fontFamily: 'inherit'}}> 小时</span></div>
          <div style={{height: 12, borderRadius: 6, background: '#f1e4d6', marginTop: 12}}>
            <div style={{width: `${clock * 100}%`, height: 12, borderRadius: 6, background: C.orange}} />
          </div>
        </Card>
        <Box x={720} y={376} w={460} o={ramp(t, L[2] + 3.6)} s={pop(t, L[2] + 3.6)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 23, fontWeight: 700, color: C.green}}>
          <span style={{width: 30, height: 40, borderRadius: 7, border: `3px solid ${C.green}`, background: '#ebf9ef', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Mark ok size={18} /></span>
          带电脑的人，都做出了小程序
        </Box>

        <Chip x={730} y={436} t={t} at={L[3] + 0.5} text="有人当场提交了备案申请" color={C.indigo} fill="#eef0ff" size={22} />
        <Box x={720} y={500} w={460} o={ramp(t, L[3] + 1.7)} s={pop(t, L[3] + 1.7)} style={{textAlign: 'center', fontSize: 46, fontWeight: 800, color: C.rose}}>算上线了吗？</Box>
      </div>

      <div style={{opacity: ramp(t, L[4])}}>
        <Chip x={90} y={110} t={t} at={L[4] + 0.1} text="还差得远" color={C.rose} fill="#fdecef" size={24} />
        {step.map((name, i) => {
          const at = L[4] + 1.0 + i * 0.5;
          const done = i < 2;
          const color = reached ? (done ? C.green : C.line) : C.slate;
          return (
            <React.Fragment key={name}>
              <Card x={70 + i * 232} y={232} w={196} h={100} o={ramp(t, at) * (reached && !done ? 0.55 : 1)} s={pop(t, at)} color={color} fill={reached && done ? '#ebf9ef' : '#fff'} style={{textAlign: 'center', paddingTop: 14, borderStyle: reached && !done ? 'dashed' : 'solid'}}>
                <div style={{fontSize: 18, color: C.sub, fontFamily: MONO}}>{i + 1}</div>
                <div style={{fontSize: 28, fontWeight: 800, color: C.ink}}>{name}</div>
              </Card>
              {i < 4 ? <Arrow x1={268 + i * 232} x2={300 + i * 232} y={282} o={ramp(t, at + 0.3)} /> : null}
            </React.Fragment>
          );
        })}
        <Box x={70 + 232 + 98 - 15} y={340} w={30} h={50} o={ramp(t, L[4] + D[4] * 0.62)} style={{display: 'flex', justifyContent: 'center'}}>
          <svg width="30" height="50"><path d="M15 48 V6 M5 16 L15 4 L25 16" fill="none" stroke={C.green} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Box>
        <Box x={180} y={400} w={440} o={ramp(t, L[4] + D[4] * 0.62)} s={pop(t, L[4] + D[4] * 0.62)} style={{textAlign: 'center', fontSize: 24, fontWeight: 800, color: C.green}}>开发者工具里能跑：只到这里</Box>
        <Stamp x={800} y={392} t={t} at={L[4] + D[4] - 1.2} text="离上线还有三步" size={30} rot={-5} />
      </div>
    </>
  );
};

/* ③ Online-only problems; the earlier, the cheaper. */
const Scene3 = ({t}) => {
  const out = 1 - ramp(t, L[6] - 0.1, 0.35);
  const hurdles = [['域名', 0.8], ['HTTPS', 1.4], ['数据库连接', 2.1]];
  const q = (x, y, at, color) => (
    <Box x={x} y={y} o={ramp(t, at, 0.2)} s={pop(t, at)} style={{width: 34, height: 34, borderRadius: 34, background: color, color: '#fff', fontSize: 22, fontWeight: 800, textAlign: 'center', lineHeight: '34px'}}>?</Box>
  );
  return (
    <>
      <div style={{opacity: out}}>
        <Node x={70} y={160} w={300} h={244} title="你的电脑" icon={icon.laptop} color={C.teal} o={ramp(t, S[2])}>
          <Rows t={t} at={S[2]} n={3} />
          <Status ok text="一个都不会出现" o={ramp(t, L[5] + D[5] * 0.62)} s={pop(t, L[5] + D[5] * 0.62)} />
        </Node>
        <Box x={400} y={276} w={760} h={4} o={ramp(t, L[5] + 0.2)} style={{borderTop: `4px dashed ${C.line}`}} />
        <Box x={400} y={130} w={760} o={ramp(t, L[5] + 0.2)} style={{textAlign: 'center', fontSize: 24, fontWeight: 700, color: C.sub}}>上线还会冒出这些问题</Box>
        {hurdles.map(([name, f], i) => {
          const at = L[5] + f;
          return (
            <Card key={name} x={420 + i * 220} y={218} w={190} h={116} o={ramp(t, at)} s={pop(t, at)} color={C.orange} fill="#fff8ef" style={{textAlign: 'center', paddingTop: 14}}>
              <svg width="38" height="34" viewBox="0 0 38 34"><path d="M19 3 L36 31 H2 Z" fill={C.orange} stroke={C.orange} strokeWidth="3" strokeLinejoin="round" /><path d="M19 12v9" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" /><circle cx="19" cy="26" r="2" fill="#fff" /></svg>
              <div style={{fontSize: 26, fontWeight: 800, color: C.ink, marginTop: 4}}>{name}</div>
            </Card>
          );
        })}
        <Box x={1080} y={250} o={ramp(t, L[5] + 0.3)} style={{fontSize: 22, fontWeight: 800, color: '#fff', background: C.orange, borderRadius: 999, padding: '8px 18px'}}>线上</Box>
      </div>

      <div style={{opacity: ramp(t, L[6])}}>
        <Box x={0} y={92} w={1280} o={ramp(t, L[6] + 0.3)} style={{textAlign: 'center', fontSize: 36, fontWeight: 800, color: C.ink}}>第一天就上线</Box>
        <Stamp x={470} y={148} t={t} at={L[6] + 1.6} text="越早暴露越便宜" color={C.green} size={30} rot={-4} />
        <Node x={130} y={232} w={480} h={290} title="第一天：一个页面" icon={icon.page} color={C.teal} o={ramp(t, L[6] + D[6] * 0.5)} s={pop(t, L[6] + D[6] * 0.5)}>
          <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 18, marginLeft: 22}}>
            <div style={{width: 74, height: 96, border: `3px solid ${C.teal}`, borderRadius: 8, background: '#effaf8'}} />
            <svg width="40" height="20"><path d="M2 10h30 M24 3l9 7-9 7" fill="none" stroke={C.sub} strokeWidth="3" strokeLinecap="round" /></svg>
          </div>
          <div style={{marginTop: 22, fontSize: 23, fontWeight: 800, color: C.teal, textAlign: 'center'}}>出错的原因就那么几个</div>
        </Node>
        {[0, 1, 2].map((i) => q(310 + i * 60, 318, L[6] + D[6] * 0.68 + i * 0.15, C.teal))}

        <Node x={680} y={232} w={480} h={290} title="功能全做完再上线" icon={icon.page} color={C.sub} o={ramp(t, L[6] + 1.6) * 0.8}>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, width: 170, marginTop: 6, marginLeft: 10}}>
            {Array.from({length: 8}).map((_, i) => <div key={i} style={{width: 34, height: 44, border: `2.5px solid ${C.sub}`, borderRadius: 6, background: '#f4f5f7'}} />)}
          </div>
          <div style={{marginTop: 30, fontSize: 23, fontWeight: 800, color: C.red, textAlign: 'center'}}>所有问题一起冒出来</div>
        </Node>
        {Array.from({length: 10}).map((_, i) => q(900 + (i % 5) * 50 + (Math.floor(i / 5) % 2) * 22, 300 + Math.floor(i / 5) * 56, L[6] + 2.0 + i * 0.08, C.red))}
      </div>
    </>
  );
};

/* ④ The reveal: the frontend falls back to localhost:8787. */
const Scene4 = ({t}) => {
  const filled = t >= L[8] + 2.4;
  const missing = t >= L[8] + 0.1 && !filled;
  const flow = (left, right, at, ok, rightO = 1) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 24}}>
      <div style={{padding: '12px 18px', borderRadius: 12, border: `2.5px solid ${C.indigo}`, background: '#eef0ff', fontSize: 22, fontWeight: 800, color: C.indigo, whiteSpace: 'nowrap'}}>{left}</div>
      <svg width="74" height="20" style={{opacity: ramp(t, at)}}><path d="M2 10h62 M56 3l9 7-9 7" fill="none" stroke={ok ? C.green : C.red} strokeWidth="3" strokeLinecap="round" strokeDasharray={ok ? undefined : '7 6'} /></svg>
      <div style={{opacity: rightO, padding: '12px 14px', borderRadius: 12, border: `2.5px ${ok ? 'solid' : 'dashed'} ${ok ? C.teal : C.red}`, background: ok ? '#effaf8' : '#fff', fontSize: 21, fontWeight: 800, color: ok ? C.teal : C.red, whiteSpace: 'nowrap', textAlign: 'center', minWidth: 170}}>
        {right}
      </div>
    </div>
  );
  return (
    <>
      <Chip x={90} y={96} t={t} at={L[7] + 0.1} text="回到开头" color={C.rose} fill="#fdecef" size={22} />
      <Card x={300} y={110} w={680} h={150} o={ramp(t, L[7] + D[7] * 0.5)} s={pop(t, L[7] + D[7] * 0.5)} color={C.indigo} style={{padding: '16px 26px'}}>
        <div style={{fontSize: 20, color: C.sub}}>前端的一个变量：告诉它后端在哪</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 14, fontFamily: MONO, fontSize: 32, fontWeight: 800, color: C.ink}}>
          后端地址 =
          <span style={{minWidth: 300, padding: '4px 14px', borderRadius: 10, border: `3px ${filled ? 'solid' : 'dashed'} ${filled ? C.orange : missing ? C.red : C.line}`, background: filled ? '#fff4e6' : missing ? `rgba(220,38,38,${0.08 + 0.08 * Math.sin(t * 8)})` : '#fff', color: C.orange, transform: `scale(${filled ? pop(t, L[8] + 2.4) : 1})`}}>
            {filled ? 'localhost:8787' : missing ? <span style={{color: C.red, fontFamily: 'inherit', fontSize: 26}}>漏配了</span> : <span style={{color: C.sub}}>?</span>}
          </span>
        </div>
      </Card>
      <Box x={990} y={180} w={240} o={ramp(t, L[8] + 2.8)} s={pop(t, L[8] + 2.8)} style={{fontSize: 21, fontWeight: 800, color: C.orange, lineHeight: 1.4, transformOrigin: 'left center'}}>默认值<br />= 本机</Box>

      <Box x={0} y={330} w={1280} o={span(t, L[7] + 0.3, L[8] + D[8] * 0.45)} style={{display: 'flex', justifyContent: 'center', gap: 40, fontSize: 26, fontWeight: 800}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '16px 26px', borderRadius: 14, border: `2.5px solid ${C.teal}`, background: '#fff', color: C.teal}}><Mark ok size={32} />你的电脑：一切正常</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '16px 26px', borderRadius: 14, border: `2.5px solid ${C.orange}`, background: '#fff', color: C.red}}><Mark size={32} />客户打开：拿不到数据</div>
      </Box>
      <Box x={0} y={430} w={1280} o={span(t, L[7] + 1.0, L[8] + D[8] * 0.45)} style={{textAlign: 'center', fontFamily: MONO, fontSize: 40, fontWeight: 800, color: C.orange}}>8787 ?</Box>

      <Node x={70} y={300} w={540} h={210} title="你的电脑" icon={icon.laptop} color={C.teal} o={ramp(t, L[8] + D[8] * 0.5)} s={pop(t, L[8] + D[8] * 0.5)}>
        {flow('前端', <span>后端 <span style={{fontFamily: MONO}}>:8787</span></span>, L[8] + D[8] * 0.6, true)}
        <Status ok text="正好跑在这儿，一切正常" o={ramp(t, L[8] + D[8] * 0.78)} />
      </Node>

      <Node x={670} y={300} w={540} h={210} title="客户的电脑" icon={icon.user} color={C.orange} o={ramp(t, L[9] + 0.2)} s={pop(t, L[9] + 0.2)}>
        {flow('浏览器', <span><span style={{fontFamily: MONO}}>:8787</span> 空的</span>, L[9] + 1.6, false, ramp(t, L[9] + 2.0))}
        <Status text="什么都没有" o={ramp(t, L[9] + D[9] * 0.5)} s={pop(t, L[9] + D[9] * 0.5)} />
      </Node>
      <Stamp x={760} y={528} t={t} at={L[9] + D[9] * 0.72} text="不部署，就发现不了" size={28} rot={-3} />
    </>
  );
};

/* ⑤ The minimum version for day one. */
const Scene5 = ({t}) => {
  const items = [
    ['一个页面', '功能少没关系', C.teal, 0.2],
    ['一条走得通的路径', '先把路铺通', C.indigo, D[10] * 0.42],
    ['连上真实的数据库', '问题越早暴露越便宜', C.rose, D[10] * 0.62],
  ];
  const end = L[10] + D[10];
  const rise = lerp(0, 46, ramp(t, end + 0.2, 0.5));
  return (
    <>
      <Box x={0} y={112} w={1280} o={ramp(t, end + 0.3, 0.5)} style={{textAlign: 'center'}}>
        <div style={{fontSize: 50, fontWeight: 800, color: C.ink, letterSpacing: 2}}>{timings.title}</div>
        <div style={{width: 300 * ramp(t, end + 0.6, 0.5), height: 7, margin: '14px auto 0', borderRadius: 4, background: `linear-gradient(90deg, ${C.teal} 0 33%, ${C.indigo} 33% 66%, ${C.rose} 66%)`}} />
      </Box>
      <Box x={0} y={140} w={1280} o={span(t, L[10] + 0.1, end + 0.2)} style={{textAlign: 'center', fontSize: 34, fontWeight: 800, color: C.ink}}>第一天上线的最小版本</Box>
      {items.map(([title, sub, color, at], i) => (
        <Card key={i} x={90 + i * 380} y={250 + rise} w={340} h={160} o={ramp(t, L[10] + at)} s={pop(t, L[10] + at)} color={color} style={{textAlign: 'center', padding: '22px 12px'}}>
          <div style={{width: 40, height: 40, borderRadius: 40, margin: '0 auto 10px', background: color, color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: '40px', fontFamily: MONO}}>{i + 1}</div>
          <div style={{fontSize: 29, fontWeight: 800, color: C.ink}}>{title}</div>
          <div style={{fontSize: 18, color: C.sub, marginTop: 6}}>{sub}</div>
        </Card>
      ))}
      <Box x={0} y={642} w={1280} o={ramp(t, end + 0.9, 0.5)} style={{textAlign: 'center', fontSize: 15, color: C.sub, lineHeight: 1.7}}>
        内容出自《从 Demo 到商用》{timings.source}
      </Box>
    </>
  );
};

export const Film = makeFilm({id: ID, timings, scenes: [Scene1, Scene2, Scene3, Scene4, Scene5], dots: ['空', '步', '早', '错', '三']});
