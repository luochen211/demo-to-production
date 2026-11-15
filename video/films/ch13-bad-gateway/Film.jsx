import React from 'react';
import timings from './timings.json';
import {Arrow, Box, C, Card, Chip, Mark, MONO, Node, Stamp, lerp, pop, ramp, span} from '../../src/kit.jsx';
import {makeFilm} from '../../src/shell.jsx';

export const ID = 'ch13-bad-gateway';
const L = timings.lines.map((l) => l.start);
const D = timings.lines.map((l) => l.dur);
/** A moment inside line i, as a fraction of how long the line is spoken. */
const at = (i, f) => L[i] + D[i] * f;

const icon = {
  user: <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="6.5" r="3.6" fill="none" stroke="#fff" strokeWidth="2" /><path d="M3 18c0-4 3.2-6.5 7-6.5s7 2.5 7 6.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>,
  door: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="4" y="2" width="12" height="16" rx="1.5" fill="none" stroke="#fff" strokeWidth="2" /><circle cx="12.5" cy="10.5" r="1.3" fill="#fff" /></svg>,
  server: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="2.5" y="3" width="15" height="6" rx="1.5" fill="none" stroke="#fff" strokeWidth="2" /><rect x="2.5" y="11" width="15" height="6" rx="1.5" fill="none" stroke="#fff" strokeWidth="2" /></svg>,
  laptop: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="9" rx="1.2" fill="none" stroke="#fff" strokeWidth="2" /><path d="M1.5 16h17" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>,
  book: <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 4h5.5a2 2 0 0 1 2 2v11a2 2 0 0 0-2-2H3z M17 4h-5.5a2 2 0 0 0-2 2v11a2 2 0 0 1 2-2H17z" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" /></svg>,
};

const Browser = ({x, y, w, h, o, s, children}) => (
  <Card x={x} y={y} w={w} h={h} o={o} s={s} color={C.slate} style={{overflow: 'hidden'}}>
    <div style={{height: 40, background: '#eef1f4', borderBottom: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px'}}>
      {['#f87171', '#fbbf24', '#4ade80'].map((c) => <span key={c} style={{width: 12, height: 12, borderRadius: 12, background: c}} />)}
      <span style={{marginLeft: 12, flex: 1, background: '#fff', borderRadius: 8, padding: '3px 12px', fontSize: 17, color: C.sub}}>https://后台域名/</span>
    </div>
    {children}
  </Card>
);

const Frame = ({x, y, w, h, o = 1, label, color = C.sub}) => (
  <Box x={x} y={y} w={w} h={h} o={o} style={{border: `2.5px dashed ${color}`, borderRadius: 18, boxSizing: 'border-box'}}>
    <div style={{position: 'absolute', top: -16, left: 22, background: '#fdfcfa', padding: '0 10px', fontSize: 20, fontWeight: 700, color, display: 'flex', alignItems: 'center', gap: 6}}>{label}</div>
  </Box>
);

const Tag = ({x, y, o = 1, s = 1, color = C.ink, size = 22, children, style}) => (
  <Box x={x} y={y} o={o} s={s} style={{fontSize: size, fontWeight: 700, color, whiteSpace: 'nowrap', ...style}}>{children}</Box>
);

/* ① Outside gets 502, the app on the server answers 200. */
const Scene1 = ({t}) => {
  const a = 1 - ramp(t, L[1] - 0.1, 0.3);
  const b = ramp(t, L[1]);
  const q = 1 + 0.08 * Math.sin(t * 6);
  return (
    <>
      <div style={{opacity: a}}>
        <Tag x={90} y={92} o={ramp(t, 0.1)} color={C.sub}>从外面打开后台</Tag>
        <Browser x={90} y={130} w={500} h={330} o={ramp(t, 0.1)} s={pop(t, 0.1)}>
          <div style={{textAlign: 'center', paddingTop: 50, opacity: ramp(t, at(0, 0.25))}}>
            <div style={{fontSize: 96, fontWeight: 800, color: C.red, fontFamily: MONO, transform: `scale(${pop(t, at(0, 0.25))})`}}>502</div>
            <div style={{fontSize: 30, fontWeight: 700, color: C.ink, marginTop: 4}}>Bad Gateway</div>
          </div>
        </Browser>
        <Tag x={690} y={92} o={ramp(t, at(0, 0.48))} color={C.sub}>在服务器上直接问应用</Tag>
        <Card x={690} y={130} w={500} h={330} o={ramp(t, at(0, 0.48))} s={pop(t, at(0, 0.48))} color={C.slate} fill="#1f2933" style={{padding: '26px 22px', fontFamily: MONO, fontSize: 18, color: '#d5dbe1', lineHeight: 1.7}}>
          <div style={{opacity: ramp(t, at(0, 0.55))}}><span style={{color: '#7dd3c8'}}>$</span> curl -i http://127.0.0.1:3000<br />&nbsp;&nbsp;/api/health</div>
          <div style={{opacity: ramp(t, at(0, 0.82)), marginTop: 18, color: '#4ade80', fontSize: 26, fontWeight: 700}}>HTTP/1.1 200 OK</div>
          <div style={{opacity: ramp(t, at(0, 0.88)), marginTop: 26, display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'inherit', fontSize: 24, color: '#fff'}}><Mark ok size={34} />应用好好的</div>
        </Card>
      </div>

      <div style={{opacity: b}}>
        <Box x={0} y={96} w={1280} o={ramp(t, L[1] + 0.2)} s={pop(t, L[1] + 0.2)} style={{textAlign: 'center', fontSize: 34, fontWeight: 800, color: C.ink}}>
          <span style={{color: C.red, fontFamily: MONO}}>502</span> = 门口的转发程序，找不到应用
        </Box>
        <Node x={60} y={250} w={190} h={140} title="用户" icon={icon.user} color={C.slate}>
          <div style={{fontSize: 19, color: C.sub, lineHeight: 1.5}}>打开后台域名</div>
        </Node>
        <Arrow x1={256} x2={372} y={320} />
        <Frame x={340} y={196} w={880} h={290} label="服务器" />
        <Node x={380} y={230} w={290} h={190} title="转发程序" icon={icon.door} color={C.orange} o={ramp(t, L[1] + 0.3)} s={pop(t, L[1] + 0.3)}>
          <div style={{fontSize: 19, color: C.sub, lineHeight: 1.5}}>也叫反向代理<br />守在门口，请求先到它，<br />再转给后面的应用</div>
        </Node>
        <Arrow x1={680} x2={880} y={320} color={C.red} dashed o={ramp(t, at(1, 0.4))} />
        <Mark size={40} style={{position: 'absolute', left: 760, top: 300, opacity: ramp(t, at(1, 0.45)), transform: `scale(${pop(t, at(1, 0.45))})`}} />
        <Node x={890} y={230} w={290} h={190} title="应用" icon={icon.server} color={C.teal} o={ramp(t, L[1] + 0.6)} s={pop(t, L[1] + 0.6)}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, color: C.green}}><Mark ok size={30} />健康检查 200</div>
          <div style={{fontSize: 19, color: C.sub, marginTop: 10}}>数据库、缓存都正常</div>
        </Node>
        <Box x={740} y={200} o={ramp(t, at(1, 0.62))} style={{fontSize: 80, fontWeight: 800, color: C.orange, transform: `scale(${q * pop(t, at(1, 0.62))})`}}>?</Box>
        <Chip x={560} y={520} t={t} at={at(1, 0.62)} text="应用明明好好的，它为什么找不到？" color={C.orange} fill="#fff4e6" size={26} />
      </div>
    </>
  );
};

/* ② The old address on my laptop: a distraction, not the cause. */
const Scene2 = ({t}) => {
  const cache = ramp(t, at(3, 0.42));
  const q = 1 - ramp(t, L[3] - 0.1);
  return (
    <>
      <Node x={90} y={110} w={480} h={220} title="我的电脑查域名" icon={icon.laptop} color={C.slate} o={ramp(t, L[2] + 0.1)} s={pop(t, L[2] + 0.1)}>
        <div style={{opacity: lerp(1, 0.45, cache)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 700}}>
            后台域名 <span style={{color: C.sub}}>→</span>
            <span style={{padding: '3px 14px', borderRadius: 10, background: '#fff4e6', border: `2px solid ${C.orange}`, color: C.orange, opacity: ramp(t, at(2, 0.22)), textDecoration: cache > 0.5 ? 'line-through' : 'none'}}>旧地址</span>
          </div>
          <div style={{marginTop: 18, fontSize: 22, fontWeight: 700, color: C.red, opacity: ramp(t, at(2, 0.48))}}>≠ 文档里记的服务器地址</div>
        </div>
        <div style={{marginTop: 12, fontSize: 21, fontWeight: 800, color: C.indigo, opacity: cache}}>缓存：电脑里存着、没更新的旧记录</div>
      </Node>

      <div style={{opacity: q}}>
        <Stamp x={180} y={392} t={t} at={at(2, 0.72)} text="破案了？" color={C.orange} size={40} rot={-6} />
        <Card x={560} y={392} w={360} h={84} o={ramp(t, at(2, 0.86))} s={pop(t, at(2, 0.86))} color={C.red} fill="#fdecec" style={{display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', fontSize: 26, fontWeight: 800, color: C.red}}>
          <span style={{fontSize: 30}}>✋</span>先别急着改解析
        </Card>
      </div>

      <Node x={700} y={110} w={480} h={220} title="域名的最终记录（权威 DNS）" icon={icon.book} color={C.teal} o={ramp(t, L[3] + 0.1)} s={pop(t, L[3] + 0.1)}>
        <div style={{fontSize: 19, color: C.sub}}>不受你电脑上缓存的影响</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 700, marginTop: 16, opacity: ramp(t, at(3, 0.22))}}>
          后台域名 <span style={{color: C.sub}}>→</span> 正确的服务器 <Mark ok size={30} />
        </div>
      </Node>

      <Chip x={90} y={372} t={t} at={at(3, 0.55)} text="要是顺手改了" color={C.sub} size={22} />
      {[['改解析', 0.62], ['等它生效', 0.72], ['502 照样在', 0.84]].map(([text, f], i) => (
        <React.Fragment key={text}>
          <Card x={90 + i * 380} y={430} w={300} h={84} o={ramp(t, at(3, f))} s={pop(t, at(3, f))} color={i === 2 ? C.red : C.line} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 26, fontWeight: 700, color: i === 2 ? C.red : C.ink}}>
            {i === 2 ? <Mark size={30} /> : null}{text}
          </Card>
          {i < 2 ? <Arrow x1={398 + i * 380} x2={462 + i * 380} y={472} o={ramp(t, at(3, [0.72, 0.84][i]))} /> : null}
        </React.Fragment>
      ))}
      <Stamp x={470} y={364} t={t} at={at(3, 0.9)} text="白改一次" size={30} rot={-5} />
    </>
  );
};

/* ③ Park the second problem; line up the three pieces of evidence. */
const Scene3 = ({t}) => {
  const a = 1 - ramp(t, L[5] - 0.1, 0.3);
  const move = ramp(t, at(4, 0.45), 0.7);
  const ev = [
    ['本机请求应用', '200', true, 0.24],
    ['从外面访问域名', '502', false, 0.38],
    ['域名指向', '正确', true, 0.5],
  ];
  const pill = (x, w, text, color, f) => (
    <Card x={x} y={380} w={w} h={80} o={ramp(t, at(5, f))} color={color} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color}}>{text}</Card>
  );
  return (
    <>
      <div style={{opacity: a}}>
        <Frame x={80} y={130} w={500} h={330} label="这次故障" color={C.orange} />
        <Card x={110} y={170} w={440} h={90} o={ramp(t, L[4])} color={C.orange} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', fontSize: 26, fontWeight: 700}}>
          <span style={{fontFamily: MONO, color: C.red, fontWeight: 800}}>502</span>后台打不开
        </Card>
        <Frame x={700} y={130} w={500} h={330} o={ramp(t, at(4, 0.4))} label="另记一项，单独查" color={C.slate} />
        <Card x={lerp(110, 730, move)} y={lerp(290, 170, move)} w={440} h={90} o={ramp(t, at(4, 0.08))} s={pop(t, at(4, 0.08))} color={C.slate} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', fontSize: 26, fontWeight: 700}}>
          <Mark size={30} />远程登录服务器失败
        </Card>
        <Stamp x={770} y={300} t={t} at={at(4, 0.62)} text="先不碰" color={C.slate} size={34} rot={-5} />
        <Box x={110} y={300} w={440} o={ramp(t, at(4, 0.8))} style={{fontSize: 21, color: C.sub, lineHeight: 1.6}}>混在一起查，<br />排查会拐进另一条岔路</Box>
      </div>

      <div style={{opacity: ramp(t, L[5])}}>
        {ev.map(([label, val, ok, f], i) => (
          <Card key={i} x={90 + i * 380} y={110} w={340} h={150} o={ramp(t, L[5] + 0.1 + i * 0.15)} s={pop(t, L[5] + 0.1 + i * 0.15)} color={t >= at(5, f) ? (ok ? C.green : C.red) : C.line} style={{textAlign: 'center', padding: '18px 12px'}}>
            <div style={{fontSize: 21, color: C.sub}}>{i + 1}. {label}</div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 14, opacity: ramp(t, at(5, f)), transform: `scale(${pop(t, at(5, f))})`, fontSize: 40, fontWeight: 800, color: ok ? C.green : C.red, fontFamily: /\d/.test(val) ? MONO : undefined}}>
              <Mark ok={ok} size={36} />{val}
            </div>
          </Card>
        ))}
        {pill(110, 220, '用户', C.slate, 0.62)}
        <Arrow x1={336} x2={524} y={420} o={ramp(t, at(5, 0.66))} color={C.green} />
        {pill(530, 220, '转发程序', C.orange, 0.62)}
        <Arrow x1={756} x2={944} y={420} o={ramp(t, at(5, 0.66))} color={C.red} dashed />
        {pill(950, 220, '应用', C.teal, 0.62)}
        <Box x={764} y={366} w={172} h={108} o={ramp(t, at(5, 0.8))} s={pop(t, at(5, 0.8))} style={{border: `4px solid ${C.red}`, borderRadius: 18, boxSizing: 'border-box'}} />
        <Tag x={740} y={490} o={ramp(t, at(5, 0.8))} color={C.red} size={26} style={{width: 220, textAlign: 'center'}}>只剩这一段</Tag>
      </div>
    </>
  );
};

/* ④ The proxy knocks on 127.0.0.1 and finds its own room. */
const Scene4 = ({t}) => {
  const fixed = ramp(t, at(8, 0.25));
  const loop = span(t, at(7, 0.55), L[8] + 0.1);
  const draw = ramp(t, at(7, 0.55), 0.8);
  const straight = ramp(t, at(8, 0.55), 0.6);
  return (
    <>
      <Box x={0} y={92} w={1280} o={span(t, L[6], L[7])} s={pop(t, L[6])} style={{textAlign: 'center', fontSize: 34, fontWeight: 800, color: C.orange}}>回到开头：转发程序为什么找不到应用？</Box>
      <Box x={0} y={92} w={1280} o={span(t, L[7] + 0.1, L[8])} style={{textAlign: 'center', fontSize: 34, fontWeight: 800, color: C.ink}}>容器里的 <span style={{fontFamily: MONO, color: C.red}}>127.0.0.1</span>，指的是容器自己</Box>
      <Box x={0} y={92} w={1280} o={ramp(t, L[8] + 0.1)} style={{textAlign: 'center', fontSize: 34, fontWeight: 800, color: C.green}}>改两处，就通了</Box>

      <Frame x={50} y={160} w={1180} h={420} label="服务器" />
      <Box x={90} y={200} w={470} h={340} o={ramp(t, L[6] + 0.3)} style={{border: `3px solid ${C.orange}`, borderRadius: 16, background: '#fffaf3', boxSizing: 'border-box'}}>
        <div style={{position: 'absolute', top: 12, left: 18, fontSize: 21, fontWeight: 700, color: C.orange}}>Docker 容器</div>
        <div style={{position: 'absolute', top: 10, right: 14, opacity: ramp(t, at(7, 0.3)), transform: `scale(${pop(t, at(7, 0.3))})`, transformOrigin: 'right center', border: `2px solid ${C.orange}`, borderRadius: 999, padding: '2px 12px', fontSize: 19, fontWeight: 700, color: C.orange, background: '#fff'}}>隔开的小房间</div>
      </Box>
      <Node x={130} y={270} w={230} h={130} title="转发程序" icon={icon.door} color={C.orange} o={ramp(t, L[6] + 0.3)}>
        <div style={{fontSize: 18, color: C.sub, lineHeight: 1.5, fontFamily: MONO, opacity: lerp(1, 0, fixed)}}>去找<br />127.0.0.1:3000</div>
        <div style={{position: 'absolute', top: 54, left: 14, fontSize: 18, color: C.green, lineHeight: 1.5, fontWeight: 700, opacity: fixed}}>去找<br />服务器内网地址:3000</div>
      </Node>

      {/* the request loops back into the proxy's own room */}
      <Box x={90} y={200} w={470} h={340} o={loop}>
        <svg width="470" height="340">
          <path d="M272 140 C 430 140, 440 300, 250 300 C 120 300, 70 260, 110 205" fill="none" stroke={C.red} strokeWidth="4" strokeDasharray="620" strokeDashoffset={620 * (1 - draw)} strokeLinecap="round" />
          <path d="M100 222 L110 203 L126 216" fill="none" stroke={C.red} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity={draw > 0.95 ? 1 : 0} />
        </svg>
      </Box>
      <Box x={290} y={430} o={loop * ramp(t, at(7, 0.85))} style={{fontSize: 22, fontWeight: 800, color: C.red, whiteSpace: 'nowrap'}}>敲的是自己的门</Box>

      <Node x={880} y={250} w={300} h={170} title="应用" icon={icon.server} color={C.teal} o={ramp(t, L[6] + 0.3)}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, color: C.green}}><Mark ok size={28} />在 3000 端口</div>
      </Node>
      <Card x={850} y={438} w={360} h={110} o={ramp(t, at(6, 0.52)) * (1 - fixed)} s={pop(t, at(6, 0.52))} color={C.red} fill="#fdecec" style={{padding: '12px 18px'}}>
        <div style={{fontSize: 22, fontWeight: 800, color: C.red}}>只听 <span style={{fontFamily: MONO}}>127.0.0.1</span></div>
        <div style={{fontSize: 19, color: C.ink, marginTop: 6}}>只收服务器本机发来的请求</div>
      </Card>
      <Card x={850} y={438} w={360} h={110} o={fixed} color={C.green} fill="#ebf9ef" style={{padding: '12px 18px'}}>
        <div style={{fontSize: 22, fontWeight: 800, color: C.green}}>改成 <span style={{fontFamily: MONO}}>0.0.0.0</span></div>
        <div style={{fontSize: 19, color: C.ink, marginTop: 6}}>收服务器网络上的请求</div>
      </Card>

      <Arrow x1={566} x2={866} y={335} o={straight} color={C.green} />
      <Box x={600} y={290} o={straight} style={{fontSize: 19, fontWeight: 700, color: C.green, whiteSpace: 'nowrap'}}>服务器内网地址:3000</Box>
      <Stamp x={660} y={360} t={t} at={at(8, 0.88)} text="通了" color={C.green} size={38} rot={-6} />
    </>
  );
};

/* ⑤ Three habits on one screen. */
const Scene5 = ({t}) => {
  const n = L.length - 1;
  const steps = [
    ['每一层单独验证', '本机、域名、转发，各验一遍', C.teal, 0.12],
    ['第一眼的异常', '先查是不是干扰项', C.orange, 0.38],
    ['同时冒出的问题', '分开记，分开查', C.indigo, 0.66],
  ];
  const end = L[n] + D[n];
  const rise = lerp(0, 46, ramp(t, end + 0.2, 0.5));
  return (
    <>
      <Box x={0} y={112} w={1280} o={ramp(t, end + 0.3, 0.5)} style={{textAlign: 'center'}}>
        <div style={{fontSize: 50, fontWeight: 800, color: C.ink, letterSpacing: 2}}>{timings.title}</div>
        <div style={{width: 300 * ramp(t, end + 0.6, 0.5), height: 7, margin: '14px auto 0', borderRadius: 4, background: `linear-gradient(90deg, ${C.teal} 0 33%, ${C.orange} 33% 66%, ${C.indigo} 66%)`}} />
      </Box>
      {steps.map(([title, sub, color, f], i) => (
        <React.Fragment key={i}>
          <Card x={95 + i * 380} y={250 + rise} w={330} h={160} o={ramp(t, at(n, f))} s={pop(t, at(n, f))} color={color} style={{textAlign: 'center', padding: '22px 12px'}}>
            <div style={{width: 40, height: 40, borderRadius: 40, margin: '0 auto 10px', background: color, color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: '40px', fontFamily: MONO}}>{i + 1}</div>
            <div style={{fontSize: 29, fontWeight: 800, color: C.ink}}>{title}</div>
            <div style={{fontSize: 19, color: C.sub, marginTop: 6}}>{sub}</div>
          </Card>
        </React.Fragment>
      ))}
      <Box x={0} y={642} w={1280} o={ramp(t, end + 0.9, 0.5)} style={{textAlign: 'center', fontSize: 15, color: C.sub, lineHeight: 1.7}}>
        内容出自《从 Demo 到商用》{timings.source}
      </Box>
    </>
  );
};

export const Film = makeFilm({id: ID, timings, scenes: [Scene1, Scene2, Scene3, Scene4, Scene5], dots: ['进', '址', '证', '门', '记']});
