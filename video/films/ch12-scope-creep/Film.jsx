import React from 'react';
import timings from './timings.json';
import {Arrow, Box, C, Card, Chip, Mark, MONO, Stamp, lerp, pop, ramp, span} from '../../src/kit.jsx';
import {makeFilm} from '../../src/shell.jsx';

export const ID = 'ch12-scope-creep';
const L = timings.lines.map((l) => l.start);
const D = timings.lines.map((l) => l.dur);
/** Time when line i reaches `phrase` (estimated from its position in the text). */
const cue = (i, phrase, extra = 0) => {
  const text = timings.lines[i].rows.join('');
  const k = text.indexOf(phrase);
  return L[i] + D[i] * (Math.max(0, k) / text.length) + extra;
};
const END = (i) => L[i] + D[i];

/** A chat bubble with the speaker's name above it. */
const Bubble = ({x, y, w, who, text, t, at, mine, color = C.orange, o = 1, size = 24}) => (
  <Box x={x} y={y} w={w} o={ramp(t, at) * o} s={pop(t, at)} style={{transformOrigin: mine ? 'right top' : 'left top', textAlign: mine ? 'right' : 'left'}}>
    {who ? <div style={{fontSize: 17, color: C.sub, marginBottom: 6}}>{who}</div> : null}
    <div style={{display: 'inline-block', textAlign: 'left', background: mine ? '#e9f8ee' : '#fff', border: `2.5px solid ${mine ? C.green : color}`, borderRadius: mine ? '18px 4px 18px 18px' : '4px 18px 18px 18px', padding: '12px 18px', fontSize: size, fontWeight: 700, color: C.ink, lineHeight: 1.45}}>{text}</div>
  </Box>
);

const Q = ({x, y, t, at, size = 46, color = C.orange}) => (
  <Box x={x} y={y} o={ramp(t, at, 0.2)} s={pop(t, at)} style={{fontSize: size, fontWeight: 900, color, lineHeight: 1}}>?</Box>
);

/* ① Price and time unchanged, work doubled; nobody knows when it started. */
const Scene1 = ({t}) => {
  const grow = ramp(t, cue(0, '多了一倍'), 0.9);
  const dim = lerp(1, 0.4, ramp(t, L[1], 0.4));
  const field = (y, name, tag, at) => (
    <div style={{position: 'absolute', left: 26, right: 26, top: y, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 26, fontWeight: 700, color: C.ink, borderTop: `1.5px dashed ${C.line}`, paddingTop: 16}}>
      <span>{name}</span>
      <span style={{opacity: ramp(t, at), transform: `scale(${pop(t, at)})`, display: 'flex', alignItems: 'center', gap: 8, color: C.green}}><Mark ok size={28} />{tag}</span>
    </div>
  );
  return (
    <>
      <div style={{opacity: dim}}>
        <Card x={100} y={120} w={400} h={250} o={ramp(t, 0.05)} s={pop(t, 0.05)} color={C.slate}>
          <div style={{padding: '18px 26px', fontSize: 28, fontWeight: 800, color: C.ink}}>报价单</div>
          {field(86, '价格', '没涨', cue(0, '价格'))}
          {field(160, '工期', '没动', cue(0, '工期'))}
        </Card>
        <Box x={620} y={390} w={560} h={3} o={ramp(t, 0.4)} style={{background: C.ink}} />
        <Card x={680} y={390 - 150} w={170} h={150} o={ramp(t, 0.5)} color={C.teal} fill="#e8f6f4" />
        <Box x={640} y={400} w={250} o={ramp(t, 0.5)} style={{textAlign: 'center', fontSize: 22, color: C.sub}}>当初谈的</Box>
        <Card x={940} y={390 - 150 - 150 * grow} w={170} h={150 + 150 * grow} o={ramp(t, cue(0, '可你'))} color={grow > 0.02 ? C.orange : C.teal} fill={grow > 0.02 ? '#fff4e6' : '#e8f6f4'} />
        <Box x={900} y={400} w={250} o={ramp(t, cue(0, '可你'))} style={{textAlign: 'center', fontSize: 22, color: C.sub}}>现在要做的</Box>
        <Stamp x={1120} y={96} t={t} at={cue(0, '多了一倍', 0.6)} text="×2" size={40} rot={-8} />
      </div>

      <Box x={0} y={452} w={1280} o={ramp(t, L[1] + 0.1)} style={{textAlign: 'center', fontSize: 30, fontWeight: 800, color: C.orange}}>多出来的活，从哪一天开始的？</Box>
      <Box x={260} y={566} w={740} h={3} o={ramp(t, L[1] + 0.3)} style={{background: C.line}} />
      {[0, 1, 2, 3, 4].map((i) => (
        <React.Fragment key={i}>
          <Box x={262 + i * 180} y={558} w={18} h={18} o={ramp(t, L[1] + 0.3 + i * 0.08)} style={{borderRadius: 18, background: '#fff', border: `3px solid ${C.sub}`, boxSizing: 'border-box'}} />
          <Q x={260 + i * 180} y={508} t={t} at={L[1] + 0.9 + i * 0.25} size={40} />
        </React.Fragment>
      ))}
      <Chip x={40} y={546} t={t} at={cue(1, '你和客户')} text="你：不记得" color={C.slate} size={20} />
      <Box x={1060} y={546} o={span(t, cue(1, '客户谁'), 99)} s={pop(t, cue(1, '客户谁'))} style={{border: `2px solid ${C.slate}`, color: C.slate, background: '#fff', borderRadius: 999, padding: '6px 16px', fontSize: 20, fontWeight: 600, whiteSpace: 'nowrap', transformOrigin: 'right center'}}>客户：也不记得</Box>
    </>
  );
};

/* ② Requirements always change: the companion-booking system's month of revisions. */
const Scene2 = ({t}) => {
  const month = cue(2, '一个月');
  const pages = cue(2, '十几页');
  const pops = [0.18, 0.34, 0.5, 0.63, 0.8];
  return (
    <>
      <Box x={90} y={96} o={ramp(t, L[2] + 0.1)} s={pop(t, L[2] + 0.1)} style={{fontSize: 40, fontWeight: 800, color: C.orange, whiteSpace: 'nowrap', transformOrigin: 'left center'}}>需求一定会变</Box>
      <Chip x={380} y={104} t={t} at={cue(2, '不全怪')} text="不全怪客户" color={C.slate} size={22} />
      <Card x={90} y={190} w={720} h={300} o={ramp(t, cue(2, '陪玩'))} s={pop(t, cue(2, '陪玩'))} color={C.teal}>
        <div style={{background: C.teal, color: '#fff', fontSize: 24, fontWeight: 800, padding: '10px 20px', borderRadius: '12px 12px 0 0'}}>我做过的陪玩系统</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '26px 22px 6px', fontSize: 24, fontWeight: 700, color: C.ink, opacity: ramp(t, month)}}>
          <span style={{fontFamily: MONO}}>4 月 13 日</span>
          <span style={{flex: 1, height: 3, background: C.sub}} />
          <span style={{fontFamily: MONO}}>5 月 13 日</span>
        </div>
        <div style={{textAlign: 'center', fontSize: 20, color: C.sub, opacity: ramp(t, month)}}>一个月</div>
      </Card>
      {pops.map((f, k) => {
        const at = cue(2, '很多是') + k * 0.3;
        return (
          <Box key={k} x={110 + f * 600} y={k % 2 ? 400 : 350} o={ramp(t, at)} s={pop(t, at)} style={{padding: '5px 12px', borderRadius: 10, border: `2px solid ${C.orange}`, background: '#fff4e6', color: C.orange, fontSize: 19, fontWeight: 700, whiteSpace: 'nowrap'}}>+ 新需求</Box>
        );
      })}
      {[0, 1, 2, 3, 4].map((k) => {
        const at = pages - 0.8 + k * 0.12;
        return <Card key={k} x={880 + k * 12} y={150 + k * 12} w={250} h={300} o={ramp(t, at, 0.2)} color={C.line} style={{boxShadow: 'none'}} />;
      })}
      <Box x={928} y={210} w={250} o={ramp(t, pages - 0.3)} style={{textAlign: 'center'}}>
        <div style={{fontSize: 26, fontWeight: 800, color: C.ink}}>修改总结</div>
        <div style={{fontSize: 56, fontWeight: 900, color: C.orange, marginTop: 24}}>十几页</div>
      </Box>
      <Chip x={90} y={520} t={t} at={cue(2, '做着才')} text="很多需求，是做着才冒出来的" color={C.orange} fill="#fff4e6" size={24} />
    </>
  );
};

/* ③ "One point per yuan" sounds small; split it open and it touches seven places. */
const Scene3 = ({t}) => {
  const rows = [
    ['数据', '积分余额和流水', cue(4, '积分流水')],
    ['订单', '取消了要不要扣回', cue(4, '订单取消')],
    ['金额', '按税前还是税后算', cue(4, '按税前')],
    ['使用', '积分能不能抵钱', cue(5, '七个', 0.15)],
    ['权限', '谁能手动改积分', cue(4, '谁能手动')],
    ['测试', '加分、扣分、手动调整', cue(5, '七个', 0.3)],
    ['时间和费用', '延后几天，加多少钱', cue(5, '七个', 0.45)],
  ];
  const seven = cue(5, '七个');
  return (
    <>
      <Chip x={80} y={100} t={t} at={L[3] + 0.2} text="交付前一周" color={C.slate} size={20} />
      <Bubble x={80} y={150} w={540} who="餐厅老板" t={t} at={cue(3, '加个')} text="加个会员积分吧，消费一块钱积一分。" />
      <Chip x={90} y={290} t={t} at={cue(3, '听着很小')} until={seven} text="听着很小？" color={C.orange} fill="#fff4e6" size={24} />
      <Box x={84} y={282} o={ramp(t, seven)} s={pop(t, seven)} style={{display: 'flex', alignItems: 'baseline', gap: 10, fontSize: 28, fontWeight: 800, color: C.rose, whiteSpace: 'nowrap', transformOrigin: 'left center'}}>
        拆出 <span style={{fontSize: 52, fontFamily: MONO}}>7</span> 个要定的地方
      </Box>
      <Bubble x={80} y={372} w={540} who="老板看完表" t={t} at={cue(5, '列完')} text="先只积分，不抵钱；取消就扣回；只有店长能调。" size={22} />
      <Stamp x={330} y={514} t={t} at={cue(5, '缩范围')} text="范围缩了" color={C.green} size={28} rot={-6} />

      <Card x={800} y={230} w={300} h={110} o={span(t, cue(3, '加个'), L[4])} s={pop(t, cue(3, '加个'))} color={C.orange} fill="#fff4e6" style={{textAlign: 'center', paddingTop: 16}}>
        <div style={{fontSize: 28, fontWeight: 800, color: C.ink}}>会员积分</div>
        <div style={{fontSize: 20, color: C.sub, marginTop: 6}}>一个小功能？</div>
      </Card>
      <Card x={680} y={100} w={530} h={490} o={ramp(t, L[4])} color={C.rose}>
        <div style={{padding: '12px 20px', fontSize: 22, fontWeight: 800, color: C.rose}}>「一块钱积一分」影响到哪</div>
        {rows.map(([k, v, at], i) => (
          <div key={k} style={{display: 'flex', alignItems: 'center', gap: 14, margin: '0 20px', height: 60, borderTop: `1.5px dashed ${C.line}`, opacity: ramp(t, at, 0.25), transform: `translateX(${lerp(24, 0, ramp(t, at, 0.3))}px)`}}>
            <span style={{width: 120, fontSize: 22, fontWeight: 800, color: C.ink}}>{k}</span>
            <span style={{fontSize: 22, color: C.sub, textDecoration: i === 3 && t >= cue(5, '缩范围') ? 'line-through' : 'none'}}>{v}</span>
          </div>
        ))}
      </Card>
    </>
  );
};

/* ④ The answer: three "sure"s with no record; removals need a record too. */
const Scene4 = ({t}) => {
  const a = 1 - ramp(t, L[8] - 0.15, 0.3);
  const times = [cue(6, '客户说'), cue(6, '你回') + 0.3, cue(6, '来了三次') - 0.6];
  const metric = (y, name, value, color, at) => (
    <Box x={720} y={y} w={470} o={ramp(t, at)} s={pop(t, at)} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 26, fontWeight: 800, color: C.ink, padding: '10px 18px', border: `2.5px solid ${color}`, borderRadius: 14, background: '#fff', boxSizing: 'border-box'}}>
      <span>{name}</span><span style={{color}}>{value}</span>
    </Box>
  );
  return (
    <>
      <div style={{opacity: a}}>
        <Box x={0} y={92} w={1280} o={ramp(t, L[6] + 0.1)} style={{textAlign: 'center', fontSize: 30, fontWeight: 800, color: C.rose}}>活是怎么翻倍的？</Box>
        {times.map((at, k) => (
          <React.Fragment key={k}>
            <Bubble x={80} y={160 + k * 130} w={360} who={k === 0 ? '客户' : null} t={t} at={at} text="顺手加个功能" size={22} />
            <Bubble x={300} y={204 + k * 130} w={260} mine t={t} at={at + 0.35} text="好的" size={22} />
            <Q x={570} y={180 + k * 130} t={t} at={cue(7, '从哪次') + k * 0.2} size={44} color={C.rose} />
          </React.Fragment>
        ))}
        <Card x={720} y={160} w={470} h={128} o={ramp(t, L[7] + 0.1)} color={C.red}>
          <div style={{padding: '12px 18px', fontSize: 22, fontWeight: 800, color: C.ink}}>变更记录</div>
          <div style={{margin: '0 18px', borderTop: `1.5px dashed ${C.line}`, paddingTop: 14, fontSize: 22, color: C.sub, textAlign: 'center'}}>（一条都没有）</div>
        </Card>
        <Stamp x={1010} y={150} t={t} at={L[7] + 0.9} text="没记录" size={28} rot={8} />
        {metric(310, '范围', '×2', C.red, cue(7, '范围'))}
        {metric(384, '价格', '没动', C.sub, cue(7, '价格'))}
        {metric(458, '工期', '没动', C.sub, cue(7, '工期'))}
      </div>

      <div style={{opacity: ramp(t, L[8])}}>
        <Card x={110} y={130} w={500} h={380} color={C.slate}>
          <div style={{padding: '12px 20px', fontSize: 22, fontWeight: 800, color: C.ink}}>后台页面</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '6px 20px'}}>
            {[0, 1, 2, 3].map((k) => {
              const gone = k === 3 && t >= cue(8, '减掉') + 0.6;
              return (
                <div key={k} style={{height: 130, borderRadius: 12, border: `2.5px ${gone ? 'dashed' : 'solid'} ${gone ? C.red : C.line}`, background: gone ? '#fdf2f2' : '#f7f8fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: C.red}}>
                  {gone ? '已减掉' : <div style={{width: '70%', display: 'flex', flexDirection: 'column', gap: 10}}>{[0, 1, 2].map((j) => <div key={j} style={{height: 12, borderRadius: 6, background: '#d9dee4'}} />)}</div>}
                </div>
              );
            })}
          </div>
        </Card>
        <Box x={700} y={150} o={ramp(t, cue(8, '减掉') + 0.3)} s={pop(t, cue(8, '减掉') + 0.3)} style={{fontSize: 30, fontWeight: 800, color: C.ink, whiteSpace: 'nowrap', transformOrigin: 'left center'}}>减掉的功能，也要记一笔</Box>
        <Box x={700} y={240} o={ramp(t, cue(8, '不然验收'))} style={{fontSize: 22, color: C.sub}}>不记的话，到了验收</Box>
        <Bubble x={700} y={290} w={480} who="客户" t={t} at={cue(8, '那个页面')} text="那个页面去哪了？" size={30} color={C.rose} />
        <Q x={1050} y={330} t={t} at={cue(8, '那个页面') + 0.6} size={60} color={C.rose} />
      </div>
    </>
  );
};

/* ⑤ The five steps on one screen, then title and source. */
const Scene5 = ({t}) => {
  const steps = [
    ['记原话', '标日期和编号', C.teal, '记原话'],
    ['说清改什么', '也写清不改什么', C.orange, '说清'],
    ['估影响', '多几天，加多少钱', C.indigo, '估影响'],
    ['书面同意', '对方回复同意再开工', C.rose, '书面'],
    ['并进报价单', '范围和验收清单都更新', C.green, '最后'],
  ];
  const end = END(9);
  const rise = lerp(0, 46, ramp(t, end + 0.2, 0.5));
  const at = (p) => cue(9, p) - 0.1;
  return (
    <>
      <Box x={0} y={112} w={1280} o={ramp(t, end + 0.3, 0.5)} style={{textAlign: 'center'}}>
        <div style={{fontSize: 50, fontWeight: 800, color: C.ink, letterSpacing: 2}}>{timings.title}</div>
        <div style={{width: 300 * ramp(t, end + 0.6, 0.5), height: 7, margin: '14px auto 0', borderRadius: 4, background: `linear-gradient(90deg, ${C.teal} 0 20%, ${C.orange} 20% 40%, ${C.indigo} 40% 60%, ${C.rose} 60% 80%, ${C.green} 80%)`}} />
      </Box>
      {steps.map(([title, sub, color, p], i) => (
        <React.Fragment key={i}>
          <Card x={52 + i * 238} y={250 + rise} w={210} h={160} o={ramp(t, at(p))} s={pop(t, at(p))} color={color} style={{textAlign: 'center', padding: '22px 10px'}}>
            <div style={{width: 40, height: 40, borderRadius: 40, margin: '0 auto 10px', background: color, color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: '40px', fontFamily: MONO}}>{i + 1}</div>
            <div style={{fontSize: 26, fontWeight: 800, color: C.ink, whiteSpace: 'nowrap'}}>{title}</div>
            <div style={{fontSize: 17, color: C.sub, marginTop: 6}}>{sub}</div>
          </Card>
          {i < 4 ? <Arrow x1={264 + i * 238} x2={288 + i * 238} y={330 + rise} o={ramp(t, at(steps[i + 1][3]))} /> : null}
        </React.Fragment>
      ))}
      <Box x={0} y={470} w={1280} o={span(t, cue(9, '截图'), end + 0.2)} style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, border: `2px dashed ${C.sub}`, borderRadius: 12, padding: '8px 22px', fontSize: 24, fontWeight: 700, color: C.ink}}>截图存好</div>
      </Box>
      <Box x={0} y={642} w={1280} o={ramp(t, end + 0.9, 0.5)} style={{textAlign: 'center', fontSize: 15, color: C.sub, lineHeight: 1.7}}>
        内容出自《从 Demo 到商用》{timings.source}
      </Box>
    </>
  );
};

export const Film = makeFilm({id: ID, timings, scenes: [Scene1, Scene2, Scene3, Scene4, Scene5], dots: ['倍', '变', '分', '记', '步']});
