import React from 'react';
import timings from './timings.json';
import {Arrow, Box, C, Card, Chip, Mark, MONO, Node, Stamp, lerp, pop, ramp, span} from '../../src/kit.jsx';
import {makeFilm} from '../../src/shell.jsx';

export const ID = 'ch02-page-not-flow';
const T = timings.lines;
const L = T.map((l) => l.start);
const END = (i) => T[i].start + T[i].dur;
/** When the voice reaches `s` inside line i (estimated from its share of the text). */
const cue = (i, s) => {
  const txt = T[i].rows.join('');
  const k = Math.max(0, txt.indexOf(s));
  return T[i].start + (T[i].dur * k) / txt.length;
};

const icon = {
  code: <svg width="20" height="20" viewBox="0 0 20 20"><path d="M7 5 L2 10 L7 15 M13 5 L18 10 L13 15" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  list: <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 5h14 M3 10h14 M3 15h14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" /></svg>,
};

/* A small screen: role header, a few content bars and a button. */
const MiniPage = ({x, y, w = 200, h = 250, o = 1, s = 1, title, color, press = 0, children}) => (
  <Card x={x} y={y} w={w} h={h} o={o} s={s} color={color} style={{overflow: 'hidden'}}>
    <div style={{background: color, color: '#fff', fontSize: 21, fontWeight: 700, padding: '8px 14px', whiteSpace: 'nowrap'}}>{title}</div>
    <div style={{padding: '16px 16px 0'}}>
      {[0.9, 0.65, 0.8].map((k, i) => (
        <div key={i} style={{height: 14, width: `${k * 100}%`, borderRadius: 7, background: '#e6eaee', marginBottom: 14}} />
      ))}
      <div style={{marginTop: 22, background: color, color: '#fff', borderRadius: 10, padding: '9px 0', textAlign: 'center', fontSize: 19, fontWeight: 700, transform: `scale(${1 - 0.08 * press})`}}>按钮</div>
    </div>
    {children}
  </Card>
);

const Person = ({x, y, o = 1, color = C.slate}) => (
  <Box x={x} y={y} o={o}>
    <svg width="70" height="84" viewBox="0 0 70 84">
      <circle cx="35" cy="20" r="16" fill="none" stroke={color} strokeWidth="4" />
      <path d="M6 82 C6 56 18 44 35 44 C52 44 64 56 64 82" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  </Box>
);

/* ① Five ends, every page there, none fully matches the requirements. */
const ROLES = ['顾客', '陪玩', '接待', '管理员', '超级管理员'];
const ITEMS = ['页面连着真后台', '数据真的存下来', '权限有检查', '出错有处理', '能验证'];
const Scene1 = ({t}) => {
  const aOut = 1 - ramp(t, L[1] - 0.15, 0.3);
  const audit = cue(0, '逐个审');
  const verdict = cue(0, '没有一个端');
  const scan = ramp(t, audit, verdict - audit);
  const bAt = L[1];
  const cAt = cue(1, '先看审查');
  const miss = cue(2, '少一样');
  return (
    <>
      <div style={{opacity: aOut}}>
        {ROLES.map((r, i) => {
          const at = 0.1 + i * 0.22;
          const cx = 70 + i * 232;
          const checked = audit + (i + 0.6) * ((verdict - audit) / 5);
          return (
            <React.Fragment key={r}>
              <MiniPage x={cx} y={110} title={r} color={[C.teal, C.orange, C.indigo, C.rose, C.slate][i]} o={ramp(t, at)} s={pop(t, at)} press={span(t, cue(0, '按钮都能点') + i * 0.12, cue(0, '按钮都能点') + i * 0.12 + 0.25, 0.1)} />
              <Box x={cx + 160} y={98} o={ramp(t, cue(0, '页面都在') + i * 0.1, 0.2)} s={pop(t, cue(0, '页面都在') + i * 0.1)}><Mark ok size={34} /></Box>
              <Box x={cx} y={380} w={200} o={ramp(t, checked, 0.2)} s={pop(t, checked)} style={{textAlign: 'center'}}>
                <span style={{display: 'inline-block', padding: '5px 14px', borderRadius: 999, fontSize: 21, fontWeight: 700, color: '#8a5a00', background: '#ffe9a8', border: `2px solid ${C.yellowLine}`}}>部分对齐</span>
              </Box>
            </React.Fragment>
          );
        })}
        <Box x={lerp(70, 1158, scan) - 30} y={300} o={span(t, audit, verdict + 0.2, 0.2)}>
          <svg width="76" height="76" viewBox="0 0 76 76">
            <circle cx="30" cy="30" r="22" fill="rgba(255,255,255,.55)" stroke={C.ink} strokeWidth="5" />
            <path d="M47 47 L70 70" stroke={C.ink} strokeWidth="7" strokeLinecap="round" />
          </svg>
        </Box>
        <Box x={0} y={460} w={1280} o={ramp(t, verdict)} s={pop(t, verdict)} style={{textAlign: 'center', fontSize: 44, fontWeight: 800, color: C.red}}>
          完全对上需求：<span style={{fontFamily: MONO}}>0 / 5</span>
        </Box>
      </div>

      <div style={{opacity: span(t, bAt, cAt - 0.1, 0.3)}}>
        <Card x={170} y={150} w={420} h={210} color={C.green} style={{textAlign: 'center', paddingTop: 28}}>
          <div style={{fontSize: 26, color: C.sub, fontWeight: 700}}>页面</div>
          <div style={{fontSize: 74, fontWeight: 800, fontFamily: MONO, color: C.green}}>5 / 5</div>
        </Card>
        <Card x={690} y={150} w={420} h={210} color={C.red} style={{textAlign: 'center', paddingTop: 28}}>
          <div style={{fontSize: 26, color: C.sub, fontWeight: 700}}>完全对上需求</div>
          <div style={{fontSize: 74, fontWeight: 800, fontFamily: MONO, color: C.red}}>0 / 5</div>
        </Card>
        <Box x={0} y={420} w={1280} o={ramp(t, cue(1, '到底差在哪'))} s={pop(t, cue(1, '到底差在哪'))} style={{textAlign: 'center', fontSize: 52, fontWeight: 800, color: C.orange}}>到底差在哪？</Box>
      </div>

      <div style={{opacity: ramp(t, cAt)}}>
        <Box x={0} y={92} w={1280} style={{textAlign: 'center', fontSize: 36, fontWeight: 800, color: C.ink}}>
          审查标准：<span style={{color: C.teal}}>五样都成立</span>，才算对上
        </Box>
        <Card x={330} y={160} w={620} h={ITEMS.length * 72 + 24} color={t >= miss ? C.orange : C.line}>
          {ITEMS.map((it, k) => {
            const lit = cue(2, it.slice(0, 4));
            const bad = k === 2 && t >= miss;
            return (
              <div key={it} style={{position: 'absolute', left: 30 + (bad ? Math.sin(t * 60) * 5 * span(t, miss, miss + 0.35, 0.05) : 0), top: 18 + k * 72, display: 'flex', alignItems: 'center', gap: 20, fontSize: 30, fontWeight: 700, color: bad ? C.red : C.ink, opacity: lerp(0.35, 1, ramp(t, lit, 0.2))}}>
                {t >= lit ? <span style={{transform: `scale(${pop(t, bad ? miss : lit, 0.3)})`}}><Mark ok={!bad} size={40} /></span> : <span style={{width: 40, height: 40, borderRadius: 40, border: `3px solid ${C.line}`, boxSizing: 'border-box'}} />}
                <span style={{textDecoration: bad ? 'line-through' : 'none'}}>{it}</span>
              </div>
            );
          })}
        </Card>
        <Stamp x={930} y={430} t={t} at={cue(2, '部分对齐')} text="部分对齐" color={C.orange} size={34} rot={-8} />
      </div>
    </>
  );
};

/* ② The message page is written but never registered, so nobody can reach it. */
const Scene2 = ({t}) => {
  const S = timings.segments[1].start + 0.05;
  const written = cue(3, '代码写好了');
  const blocked = cue(3, '打不开');
  const listAt = L[4] + 0.2;
  const noRow = cue(4, '页面清单里');
  const nowhere = cue(4, '谁也走不到');
  return (
    <>
      <Chip x={540} y={96} t={t} at={L[3] + 0.1} until={L[4]} text="小谜题" color={C.orange} fill="#fff4e6" size={24} />
      <Node x={80} y={160} w={400} h={250} title="代码仓库" icon={icon.code} color={C.slate} o={ramp(t, S)}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <div style={{fontFamily: MONO, fontSize: 21, color: C.sub}}>pages/order</div>
          <div style={{fontFamily: MONO, fontSize: 21, color: C.sub}}>pages/user</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, border: `2.5px solid ${C.indigo}`, borderRadius: 10, padding: '8px 12px', background: '#f3f4ff', opacity: ramp(t, cue(3, '留言页') - 0.2)}}>
            <span style={{fontFamily: MONO, fontSize: 21, color: C.indigo, fontWeight: 700}}>pages/message</span>
            <span style={{fontSize: 21, fontWeight: 700, color: C.ink}}>留言页</span>
            <span style={{marginLeft: 'auto', opacity: ramp(t, written), transform: `scale(${pop(t, written)})`}}><Mark ok size={28} /></span>
          </div>
          <div style={{fontSize: 20, fontWeight: 700, color: C.green, opacity: ramp(t, written)}}>代码写好了</div>
        </div>
      </Node>

      <Box x={880} y={90} w={250} h={430} o={ramp(t, S)} style={{border: `4px solid ${C.ink}`, borderRadius: 34, background: '#fff', boxSizing: 'border-box', overflow: 'hidden'}}>
        <div style={{background: C.slate, color: '#fff', fontSize: 21, fontWeight: 700, padding: '30px 0 10px', textAlign: 'center'}}>小程序 · 管理端</div>
        <div style={{padding: '18px 18px 0'}}>
          {[0.85, 0.6, 0.75].map((k, i) => <div key={i} style={{height: 14, width: `${k * 100}%`, borderRadius: 7, background: '#e6eaee', marginBottom: 14}} />)}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center', opacity: ramp(t, blocked), transform: `scale(${pop(t, blocked)})`}}>
          <Mark size={70} style={{margin: '0 auto 10px'}} />
          <div style={{fontSize: 26, fontWeight: 800, color: C.red}}>留言页打不开</div>
        </div>
      </Box>
      <Box x={0} y={460} w={500} o={span(t, blocked + 0.3, L[4], 0.25)} s={pop(t, blocked + 0.3)} style={{textAlign: 'center', fontSize: 40, fontWeight: 800, color: C.orange}}>为什么？</Box>

      <Node x={540} y={160} w={290} h={250} title="页面清单" icon={icon.list} color={C.teal} o={ramp(t, listAt)} s={pop(t, listAt)}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {['pages/order', 'pages/user'].map((p) => <div key={p} style={{fontFamily: MONO, fontSize: 20, color: C.sub, borderBottom: `1.5px dashed ${C.line}`, paddingBottom: 6}}>{p}</div>)}
          <div style={{display: 'flex', alignItems: 'center', gap: 8, border: `2.5px dashed ${C.red}`, borderRadius: 10, padding: '7px 10px', fontSize: 20, fontWeight: 700, color: C.red, opacity: ramp(t, noRow)}}>
            <Mark size={24} />没有留言页
          </div>
        </div>
      </Node>
      <Box x={540} y={420} w={290} o={ramp(t, listAt + 0.3)} style={{textAlign: 'center', fontSize: 19, color: C.sub}}>小程序只认清单里的页面</Box>
      <Arrow x1={484} x2={536} y={300} o={ramp(t, listAt + 0.2)} />
      <Arrow x1={834} x2={876} y={300} o={ramp(t, nowhere)} color={C.red} dashed />
      <Stamp x={560} y={470} t={t} at={cue(4, '没注册')} text="没注册" size={34} rot={-6} />
      <Box x={856} y={540} o={ramp(t, nowhere)} s={pop(t, nowhere)} style={{fontSize: 24, fontWeight: 800, color: C.red, whiteSpace: 'nowrap', transformOrigin: 'left center'}}>谁也走不到</Box>
    </>
  );
};

/* ③ The super-admin pages look busy but show the wrong meaning. */
const Scene3 = ({t}) => {
  const S = timings.segments[2].start + 0.05;
  const a = span(t, S, L[6] - 0.1, 0.25);
  const rows = [
    ['普通订单', '待审批', '#ffe9a8', C.yellowLine, '#8a5a00', cue(5, '普通订单'), cue(5, '待审批')],
    ['已经付过钱的流水', '高风险提现', '#fdecec', C.red, C.red, cue(5, '已经付过钱'), cue(5, '高风险提现')],
  ];
  const fix = cue(6, '本该');
  return (
    <>
      <div style={{opacity: a}}>
        <Card x={130} y={100} w={1020} h={430} color={C.slate}>
          <div style={{background: C.slate, color: '#fff', fontSize: 23, fontWeight: 700, padding: '10px 20px', borderRadius: '12px 12px 0 0'}}>超级管理员首页</div>
          <div style={{display: 'flex', padding: '22px 60px 0', fontSize: 22, color: C.sub, fontWeight: 700}}>
            <span style={{width: 470}}>实际是</span><span>首页显示成</span>
          </div>
        </Card>
        {rows.map(([real, shown, fill, line, ink, at, at2], i) => (
          <React.Fragment key={real}>
            <Card x={190} y={220 + i * 140} w={380} h={96} o={ramp(t, at)} s={pop(t, at)} color={C.green} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px', fontSize: 28, fontWeight: 800, color: C.ink, whiteSpace: 'nowrap'}}>
              {i ? <Mark ok size={32} /> : null}{real}
            </Card>
            <Arrow x1={584} x2={680} y={268 + i * 140} o={ramp(t, at2 - 0.2)} />
            <Box x={700} y={238 + i * 140} o={ramp(t, at2)} s={pop(t, at2)} style={{display: 'flex', alignItems: 'center', gap: 16, transformOrigin: 'left center'}}>
              <span style={{padding: '10px 26px', borderRadius: 999, fontSize: 32, fontWeight: 800, color: ink, background: fill, border: `3px solid ${line}`, whiteSpace: 'nowrap'}}>{shown}</span>
              <span style={{opacity: ramp(t, at2 + 0.5)}}><Mark size={38} /></span>
            </Box>
          </React.Fragment>
        ))}
      </div>

      <div style={{opacity: ramp(t, L[6])}}>
        <Node x={130} y={110} w={450} h={400} title="高风险复核" color={C.rose}>
          <div style={{fontSize: 19, color: C.sub, marginBottom: 10}}>没有真实数据时：</div>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{display: 'flex', alignItems: 'center', gap: 12, height: 62, borderTop: `1.5px dashed ${C.line}`, fontSize: 23, color: C.ink, opacity: ramp(t, L[6] + 0.3 + n * 0.35, 0.2)}}>
              <span style={{fontFamily: MONO, color: C.sub}}>#00{n}</span>占位记录
              <span style={{marginLeft: 'auto', border: `2px solid ${C.red}`, color: C.red, borderRadius: 6, padding: '1px 10px', fontSize: 19, fontWeight: 800}}>编的</span>
            </div>
          ))}
        </Node>
        <Stamp x={240} y={460} t={t} at={cue(6, '编出来的')} text="假数据" size={32} rot={-6} />
        <Arrow x1={600} x2={690} y={310} o={ramp(t, fix - 0.2)} color={C.green} />
        <Node x={710} y={110} w={450} h={400} title="高风险复核" color={C.green} o={ramp(t, fix)} s={pop(t, fix)}>
          <div style={{fontSize: 19, color: C.sub}}>本该显示：</div>
          <div style={{marginTop: 70, textAlign: 'center'}}>
            <svg width="90" height="70" viewBox="0 0 90 70"><path d="M8 28 L22 6 H68 L82 28 V64 H8 Z M8 28 H30 L36 38 H54 L60 28 H82" fill="none" stroke={C.sub} strokeWidth="4" strokeLinejoin="round" /></svg>
            <div style={{fontSize: 34, fontWeight: 800, color: C.sub, marginTop: 10}}>暂无记录</div>
          </div>
        </Node>
      </div>
    </>
  );
};

/* ④ Back to the opening: the page exists, the flow behind it is broken. */
const Scene4 = ({t}) => {
  const S = timings.segments[3].start + 0.05;
  const a = span(t, S, L[8] - 0.1, 0.25);
  const page = cue(7, '页面是做出来了');
  const flow = cue(7, '背后的流程');
  const broken = cue(7, '没打通');
  const steps = ['数据进来', '有人处理', '去下一步'];
  const cols = [['代码能跑', true, cue(8, '代码能跑')], ['页面能看', true, cue(8, '页面能看')], ['业务意思', false, cue(8, '业务意思')]];
  const judge = cue(8, '会让用的人');
  return (
    <>
      <div style={{opacity: a}}>
        <Box x={0} y={lerp(260, 92, ramp(t, page - 0.5, 0.5))} w={1280} o={ramp(t, S)} s={lerp(1.7, 1, ramp(t, page - 0.5, 0.5))} style={{textAlign: 'center', fontSize: 30, fontWeight: 800, color: C.ink}}>
          页面 <span style={{fontFamily: MONO, color: C.green}}>5 / 5</span>
          <span style={{color: C.sub, margin: '0 18px'}}>·</span>
          完全对上 <span style={{fontFamily: MONO, color: C.red}}>0 / 5</span>
          <span style={{color: C.orange}}>　为什么？</span>
        </Box>
        <MiniPage x={90} y={190} w={220} h={270} title="页面" color={C.teal} o={ramp(t, page)} s={pop(t, page)} />
        <Box x={250} y={176} o={ramp(t, page + 0.4)} s={pop(t, page + 0.4)}><Mark ok size={40} /></Box>
        <Box x={360} y={180} w={860} h={290} o={ramp(t, flow)} style={{border: `3px dashed ${C.line}`, borderRadius: 18}} />
        <Box x={380} y={194} o={ramp(t, flow)} style={{fontSize: 20, fontWeight: 700, color: C.sub}}>页面背后的流程</Box>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <Card x={400 + i * 280} y={270} w={200} h={110} o={ramp(t, flow + 0.2 + i * 0.25)} s={pop(t, flow + 0.2 + i * 0.25)} color={C.indigo} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 27, fontWeight: 800, color: C.indigo}}>{s}</Card>
            {i < 2 ? (
              <>
                <Arrow x1={606 + i * 280} x2={674 + i * 280} y={325} o={ramp(t, flow + 0.5 + i * 0.25)} color={t >= broken ? C.red : C.sub} dashed={t >= broken} />
                <Box x={622 + i * 280} y={346} o={ramp(t, broken + i * 0.2, 0.2)} s={pop(t, broken + i * 0.2)}><Mark size={34} /></Box>
              </>
            ) : null}
          </React.Fragment>
        ))}
        <Stamp x={700} y={480} t={t} at={broken + 0.3} text="流程没打通" size={34} rot={-5} />
      </div>

      <div style={{opacity: ramp(t, L[8])}}>
        {cols.map(([name, ok, at], i) => (
          <Card key={name} x={130 + i * 360} y={110} w={300} h={170} o={ramp(t, at)} s={pop(t, at)} color={ok ? C.green : C.red} style={{textAlign: 'center', paddingTop: 26}}>
            <Mark ok={ok} size={56} style={{margin: '0 auto 14px'}} />
            <div style={{fontSize: 32, fontWeight: 800, color: ok ? C.ink : C.red}}>{name}{ok ? '' : '错了'}</div>
          </Card>
        ))}
        <Person x={330} y={360} o={ramp(t, judge)} />
        <Box x={300} y={452} w={130} o={ramp(t, judge)} style={{textAlign: 'center', fontSize: 20, fontWeight: 700, color: C.sub}}>用的人</Box>
        <Arrow x1={440} x2={560} y={402} o={ramp(t, judge + 0.3)} />
        <Card x={580} y={350} w={300} h={104} o={ramp(t, judge + 0.4)} color={C.line} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 25, fontWeight: 700, color: C.ink}}>照着页面做判断</Card>
        <Stamp x={900} y={372} t={t} at={judge + 1.0} text="判断错了" size={34} rot={-6} />
      </div>
    </>
  );
};

/* ⑤ Three questions for every piece of data on a page. */
const Scene5 = ({t}) => {
  const qs = [
    ['它从哪来？', C.teal, '它从哪来'],
    ['谁来处理？', C.indigo, '谁来处理'],
    ['处理完去哪？', C.rose, '处理完去哪'],
  ];
  const end = END(9);
  const rise = lerp(0, 46, ramp(t, end + 0.2, 0.5));
  const no = cue(9, '答不上');
  return (
    <>
      <Box x={0} y={112} w={1280} o={ramp(t, end + 0.3, 0.5)} style={{textAlign: 'center'}}>
        <div style={{fontSize: 50, fontWeight: 800, color: C.ink, letterSpacing: 2}}>{timings.title}</div>
        <div style={{width: 300 * ramp(t, end + 0.6, 0.5), height: 7, margin: '14px auto 0', borderRadius: 4, background: `linear-gradient(90deg, ${C.teal} 0 33%, ${C.indigo} 33% 66%, ${C.rose} 66%)`}} />
      </Box>
      <Box x={0} y={130 + rise} w={1280} o={ramp(t, L[9] + 0.1) * (1 - ramp(t, end + 0.1, 0.3))} style={{textAlign: 'center', fontSize: 28, fontWeight: 700, color: C.sub}}>页面上每一条数据，都问一遍</Box>
      {qs.map(([q, color, key], i) => {
        const at = cue(9, key);
        return (
          <React.Fragment key={q}>
            <Card x={130 + i * 370} y={230 + rise} w={300} h={160} o={ramp(t, at)} s={pop(t, at)} color={color} style={{textAlign: 'center', padding: '24px 12px'}}>
              <div style={{width: 44, height: 44, borderRadius: 44, margin: '0 auto 14px', background: color, color: '#fff', fontSize: 24, fontWeight: 800, lineHeight: '44px', fontFamily: MONO}}>{i + 1}</div>
              <div style={{fontSize: 34, fontWeight: 800, color: C.ink}}>{q}</div>
            </Card>
            {i < 2 ? <Arrow x1={436 + i * 370} x2={494 + i * 370} y={310 + rise} o={ramp(t, cue(9, qs[i + 1][2]))} /> : null}
          </React.Fragment>
        );
      })}
      <Box x={0} y={420 + rise} w={1280} o={ramp(t, no)} s={pop(t, no)} style={{textAlign: 'center'}}>
        <span style={{display: 'inline-flex', alignItems: 'center', gap: 10, border: `2.5px solid ${C.red}`, color: C.red, background: '#fdecec', borderRadius: 999, padding: '8px 24px', fontSize: 26, fontWeight: 800}}>
          <Mark size={30} />答不上来，就是还没打通
        </span>
      </Box>
      <Box x={0} y={642} w={1280} o={ramp(t, end + 0.9, 0.5)} style={{textAlign: 'center', fontSize: 15, color: C.sub, lineHeight: 1.7}}>
        内容出自《从 Demo 到商用》{timings.source}
      </Box>
    </>
  );
};

export const Film = makeFilm({id: ID, timings, scenes: [Scene1, Scene2, Scene3, Scene4, Scene5], dots: ['端', '开', '忙', '通', '问']});
