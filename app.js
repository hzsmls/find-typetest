const backgroundQuestions = [
  { key: 'status', label: '你们现在是什么关系？', options: ['恋爱中', '正在暧昧或靠近', '分开后仍有联系', '其他关系'] },
  { key: 'clarity', label: '你觉得这段关系明确吗？', options: ['很明确', '比较明确', '不太明确', '说不清'] },
  { key: 'stability', label: 'TA 的回应通常稳定吗？', options: ['很稳定', '比较稳定', '不太稳定', '很不稳定'] }
];

const questions = [
  'TA 回复变慢时，我会比较在意。', 'TA 比平时联系得少，我会容易不安。', 'TA 的态度有一点变化，我通常会注意到。', '即使知道 TA 最近很忙，联系少了我还是会在意。',
  '被 TA 拒绝时，我容易觉得 TA 可能没那么想靠近我。', 'TA 想和我拉开一点距离时，我会担心关系变淡。', '发生矛盾后，我会担心 TA 对我的感觉变了。', '一段时间见不到 TA，我会更需要 TA 的回应。',
  '关系一直不明确，会让我不太安心。', 'TA 表达得少了，我会想确认 TA 现在怎么想。', 'TA 对别人表现出明显的欣赏时，我会有些不安。', '即使矛盾已经说开，我有时还是会担心关系受到影响。',
  'TA 越想靠近，我有时越想慢一点。', '相处太频繁时，我会想多留一点自己的空间。', '就算关系很稳定，太亲近有时也会让我有压力。', '遇到困难时，我不太习惯主动依赖 TA。',
  '即使 TA 愿意帮我，我也更习惯自己处理。', '需要安慰时，我不太会主动找 TA。', '我不太习惯把自己脆弱的一面告诉 TA。', '有些比较深的感受，我不太愿意和 TA 说。',
  '即使很想 TA，我也不一定会主动表达。', '遇到关系里的问题，我有时会不太想马上面对。', '发生矛盾后，我更容易先拉开一点距离。', 'TA 很依赖我时，我有时会觉得有压力。'
];

const app = document.querySelector('#app');
const state = { view: 'home', bgIndex: 0, qIndex: 0, background: {}, answers: Array(24).fill(null), resultPage: 0 };
const scaleLabels = ['完全不符合', '不太符合', '有点符合', '比较符合', '很符合'];

function mountScreen(html) {
  const persistentLogo = app.querySelector('.brand-logo');
  app.innerHTML = html;
  const nextLogo = app.querySelector('.brand-logo');
  if (persistentLogo && nextLogo) nextLogo.replaceWith(persistentLogo);
}

function topbar(label, active = 0, total = 5, progress = null) {
  const dots = Array.from({length: Math.min(total, 7)}, (_, i) => `<i class="${i === active ? 'active' : ''}"></i>`).join('');
  return `<header class="topbar"><img class="brand-logo" src="find-logo.png?v=7" alt="find" decoding="sync" fetchpriority="high"><div><div class="micro">${label}</div><div class="dots">${dots}</div></div></header>${progress === null ? '' : `<div class="progress"><span style="width:${progress}%"></span></div>`}`;
}

function render() {
  if (state.view === 'home') return renderHome();
  if (state.view === 'background') return renderBackground();
  if (state.view === 'quiz') return renderQuiz();
  return renderResult();
}

function renderHome() {
  mountScreen(`<section class="screen">
    ${topbar('ATTACHMENT STYLE TEST', 0, 4)}
    <div class="home-editorial home-v10">
      <div class="home-copy">
        <h1 class="hero-title"><span class="small-line">测测你的</span><em class="large-line title-elegant">依恋模式</em></h1>
        <p class="lede">用 24 道题，看见你面对亲密、<br>距离与不确定时，更容易出现的关系反应。</p>
      </div>
      <div class="dimension-rings" aria-hidden="true">
        <div class="dimension-ring rose-ring">
          <svg viewBox="0 0 160 160"><defs><linearGradient id="roseTrack" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e5c1c7"/><stop offset="1" stop-color="#c78f99"/></linearGradient></defs><circle class="ring-groove" cx="80" cy="80" r="61"/><circle class="ring-progress" cx="80" cy="80" r="61" pathLength="100" stroke="url(#roseTrack)"/><g class="ring-runner"><circle cx="80" cy="19" r="8"/></g><circle class="ring-inner" cx="80" cy="80" r="46"/></svg>
          <span>依恋焦虑</span>
        </div>
        <div class="dimension-ring blue-ring">
          <svg viewBox="0 0 160 160"><defs><linearGradient id="blueTrack" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#cbd5da"/><stop offset="1" stop-color="#94a8b4"/></linearGradient></defs><circle class="ring-groove" cx="80" cy="80" r="61"/><circle class="ring-progress" cx="80" cy="80" r="61" pathLength="100" stroke="url(#blueTrack)"/><g class="ring-runner"><circle cx="80" cy="19" r="8"/></g><circle class="ring-inner" cx="80" cy="80" r="46"/></svg>
          <span>依恋回避</span>
        </div>
      </div>
    </div>
    <button class="primary-btn" id="start"><span>开始测试</span><b>›</b></button>
    <p class="meta">约 5 分钟 · 24 道题</p>
  </section>`);
  document.querySelector('#start').onclick = () => { state.view = 'background'; render(); };
}

function renderBackground() {
  const q = backgroundQuestions[state.bgIndex];
  const current = state.background[q.key];
  mountScreen(`<section class="screen">
    ${topbar(`BEFORE / 0${state.bgIndex + 1}`, state.bgIndex, 3, ((state.bgIndex + 1) / 3) * 100)}
    <div class="question-wrap">
      <h1 class="question-title small">先了解一下你和 TA 的关系</h1>
      <div class="background-card"><span class="number">0${state.bgIndex + 1} / 03</span><h2>${q.label}</h2></div>
      <div class="choice-list">${q.options.map((x, i) => `<button class="choice ${current === i ? 'selected' : ''}" data-value="${i}"><span class="radio"></span>${x}</button>`).join('')}</div>
      <div class="nav-row"><button class="nav-circle" id="prev" ${state.bgIndex === 0 ? 'disabled' : ''}>‹</button><button class="nav-circle next" id="next" ${current == null ? 'disabled' : ''}>›</button></div>
    </div>
  </section>`);
  document.querySelectorAll('.choice').forEach(btn => btn.onclick = () => { state.background[q.key] = Number(btn.dataset.value); render(); });
  document.querySelector('#prev').onclick = () => { if (state.bgIndex > 0) { state.bgIndex--; render(); } };
  document.querySelector('#next').onclick = () => { if (current == null) return; if (state.bgIndex < 2) state.bgIndex++; else state.view = 'quiz'; render(); };
}

function renderQuiz() {
  const selected = state.answers[state.qIndex];
  const progress = ((state.qIndex + 1) / questions.length) * 100;
  const parts = questions[state.qIndex].split('，');
  const longest = Math.max(...parts.map(x => x.length));
  const formattedQuestion = parts.map(x => `<span class="q-line">${x}${x === parts[parts.length - 1] ? '' : '，'}</span>`).join('');
  mountScreen(`<section class="screen">
    ${topbar(`QUESTION / ${String(state.qIndex + 1).padStart(2,'0')} · 24`, Math.floor(state.qIndex / 5), 5, progress)}
    <div class="question-wrap">
      <h1 class="question-title ${longest >= 13 ? 'compact' : ''}">${formattedQuestion}</h1>
      <div class="scale-panel">
        <div class="scale-label">${selected ? scaleLabels[selected - 1] : '这句话有多符合你和 TA 相处时的情况？'}</div>
        <div class="scale">${[1,2,3,4,5].map(v => `<button aria-label="${scaleLabels[v-1]}" data-value="${v}" class="${selected === v ? 'selected' : ''}"></button>`).join('')}</div>
        <div class="scale-ends"><span>完全不符合</span><span>很符合</span></div>
      </div>
      <div class="nav-row"><button class="nav-circle" id="prev">‹</button><button class="nav-circle next" id="next" ${selected == null ? 'disabled' : ''}>›</button></div>
    </div>
  </section>`);
  document.querySelectorAll('.scale button').forEach(btn => btn.onclick = () => { state.answers[state.qIndex] = Number(btn.dataset.value); render(); });
  document.querySelector('#prev').onclick = () => { if (state.qIndex > 0) state.qIndex--; else state.view = 'background'; render(); };
  document.querySelector('#next').onclick = () => { if (selected == null) return; if (state.qIndex < 23) state.qIndex++; else { state.view = 'result'; state.resultPage = 0; } render(); };
}

function avg(indexes) { return indexes.reduce((s, i) => s + state.answers[i], 0) / indexes.length; }
function score100(raw) { return Math.round((raw - 1) / 4 * 100); }

function calculateResult() {
  const anxietyRaw = avg([...Array(12).keys()]);
  const avoidanceRaw = avg([...Array(12).keys()].map(i => i + 12));
  const anxiety = score100(anxietyRaw), avoidance = score100(avoidanceRaw);
  const midA = anxietyRaw > 2.75 && anxietyRaw < 3.25, midV = avoidanceRaw > 2.75 && avoidanceRaw < 3.25;
  let type;
  if (anxietyRaw <= 3 && avoidanceRaw <= 3) type = 'secure';
  else if (anxietyRaw > 3 && avoidanceRaw <= 3) type = 'anxious';
  else if (anxietyRaw <= 3 && avoidanceRaw > 3) type = 'avoidant';
  else type = 'mixed';
  const mild = midA && midV;
  const anxietyThemes = [
    {key:'response', title:'TA 的回应变化', score:avg([0,1,2,3])},
    {key:'rupture', title:'拒绝或关系受损', score:avg([4,5,6,11])},
    {key:'unclear', title:'关系没有明确答案', score:avg([8,9])}
  ].sort((a,b)=>b.score-a.score);
  const avoidanceThemes = [
    {key:'space', title:'亲密与空间压力', score:avg([12,13,14,23])},
    {key:'depend', title:'不习惯依赖 TA', score:avg([15,16,17])},
    {key:'vulnerable', title:'表达脆弱并不容易', score:avg([18,19,20])},
    {key:'withdraw', title:'冲突后先拉开距离', score:avg([21,22])}
  ].sort((a,b)=>b.score-a.score);
  return { anxietyRaw, avoidanceRaw, anxiety, avoidance, type, mild, anxietyTheme:anxietyThemes[0], avoidanceTheme:avoidanceThemes[0], anxietyThemes, avoidanceThemes };
}

const typeContent = {
  secure: { name:'安全型', intro:'你比较能够靠近 TA，也能保留自己的空间。需要支持时，你也比较能够表达自己的需要。' },
  anxious: { name:'焦虑型', intro:'你很在意这段关系，也比较容易被 TA 的回应变化牵动。关系没有明确答案时，你可能会更想确认。' },
  avoidant: { name:'回避型', intro:'你并不一定不想靠近 TA，但当关系越来越亲近时，你可能更习惯保留一些距离。' },
  mixed: { name:'混乱型', intro:'TA 远的时候，你可能更想靠近和确认；TA 真正靠近以后，你又可能感到压力。' }
};

function resultPages(r) {
  const t = typeContent[r.type];
  const titlePrefix = r.mild ? '轻微偏向' : '更接近';
  const profileHeadline = r.type === 'mixed'
    ? (r.mild ? '轻微偏向<br><em>焦虑与回避并存</em>' : '焦虑与回避<br><em>都比较明显</em>')
    : `<span class="nowrap">${titlePrefix}<em>「${t.name}」</em></span>`;
  const clarity = Number(state.background.clarity ?? 2), stability = Number(state.background.stability ?? 2);
  const contextTitle = clarity >= 2 || stability >= 2 ? '这段关系本身也存在一些不确定' : '目前的关系环境相对稳定';
  const contextCopy = clarity >= 2 || stability >= 2
    ? '你的反应不能只用个人依恋倾向解释。关系是否清楚、TA 的回应是否稳定，也会影响你。'
    : '这意味着你现在的感受不完全来自外部的不确定，个人面对亲近和距离时的习惯可能更重要。';
  const primaryTheme = r.type === 'avoidant' ? r.avoidanceTheme : r.anxietyTheme;
  const triggerThemes = r.type === 'avoidant' ? r.avoidanceThemes.slice(0,3) : r.anxietyThemes;
  const triggerCopy = r.type === 'secure' ? '关系变化出现时，你通常较能先了解发生了什么，不会马上把它理解成关系变坏。' : r.type === 'avoidant' ? '当亲密、依赖或表达增加时，你更容易感觉到压力，并自然地保留一些距离。' : `当「${primaryTheme.title}」出现时，你可能会更留意关系是否发生了变化。`;
  const reaction = r.type === 'secure' ? '你通常会先了解发生了什么，再决定沟通、等待或保留一点空间。' :
    r.type === 'avoidant' ? '你可能会先自己消化，或暂时拉开一点距离，让自己重新找到节奏。' :
    r.type === 'mixed' ? '你可能一边想确认 TA 的回应，一边又在真正靠近时收回表达。' : '你可能会先观察 TA 的表达，再寻找更多确认。';
  const flow = r.type === 'avoidant' ? ['TA 想进一步靠近','你开始感到压力','暂时拉开距离','TA 更想确认'] :
    r.type === 'secure' ? ['发现关系变化','了解发生了什么','表达自己的需要','根据回应调整'] :
    r.type === 'mixed' ? ['TA 变得疏远','你想重新靠近','靠近带来压力','你又暂时退开'] : ['TA 的回应变化','你开始留意细节','更想确认 TA 的想法','你更加不安'];
  const next = r.type === 'avoidant' ? ['我是真的不想靠近，还是只是需要一点空间？','如果不必立刻回应，我愿意向 TA 表达什么？','我拒绝的是 TA，还是依赖别人带来的不自在？'] :
    r.type === 'mixed' ? ['我现在想靠近，是因为想念，还是因为 TA 正在远离？','当 TA 真正靠近时，具体是什么让我有压力？','我收回表达，是不想继续，还是害怕暴露需要？'] :
    r.type === 'secure' ? ['这份稳定是双方共同建立的吗？','关系变化时，我们是否都愿意表达和修复？','我有没有为了维持稳定而忽略自己的需要？'] : ['当 TA 回应稳定时，我对 TA 的喜欢还会一样强吗？','我需要的是 TA 本人，还是“关系没有变”的确定感？','我现在看到的是事实，还是对关系变化的担心？'];
  const contextUncertainty = Math.round(((clarity + stability) / 6) * 100);
  const needTitle = r.type === 'secure' ? '能表达，也能自己调节' : r.type === 'avoidant' ? r.avoidanceTheme.title : r.type === 'mixed' ? '想靠近，也会收回表达' : '更想从 TA 那里得到确认';
  const needCopy = r.type === 'secure' ? '需要支持时，你比较能够说出来；TA 暂时不在时，也能先安顿自己的感受。' : r.type === 'avoidant' ? '当你需要支持时，自己处理往往比主动依赖 TA 更自然。' : r.type === 'mixed' ? '你可能很需要 TA 的回应，但真正要表达脆弱时，又会犹豫或退开。' : '当关系出现变化时，你更容易观察 TA 的反应，并通过回应确认关系是否还稳定。';
  const needSteps = r.type === 'secure' ? ['需要支持','说出需要','一起处理'] : r.type === 'avoidant' ? ['需要支持','先自己处理','减少表达'] : r.type === 'mixed' ? ['想靠近确认','靠近带来压力','收回表达'] : ['感觉不安','寻找 TA 回应','等待确认'];
  return [
    `<div class="result-card profile-page"><div class="result-kicker">YOUR ATTACHMENT RESULT</div><div class="type-lockup"><small>你在这段关系里，更接近</small><h1>${t.name}</h1>${r.type === 'mixed' ? '<span>恐惧回避倾向</span>' : ''}</div><p class="type-intro">${t.intro}</p><div class="profile-dashboard profile-only"><div class="profile-orbits"><div class="score-orbit anxiety" style="--value:${r.anxiety * 3.6}deg"><span><b data-score="${r.anxiety}">0</b><small>依恋焦虑</small></span></div><div class="score-orbit avoidance" style="--value:${r.avoidance * 3.6}deg"><span><b data-score="${r.avoidance}">0</b><small>依恋回避</small></span></div></div></div><button type="button" class="soft-link dimension-link" id="openDimensions">这两个分数如何形成类型&nbsp; ↗</button></div>`,
    `<div class="result-card dimensions-page"><div class="result-kicker">ANXIETY × AVOIDANCE</div><h1 class="result-title"><span class="title-light">两个维度，组合成</span><br><em>四种依恋模式</em></h1><div class="dimension-defs"><div><i>A</i><p><strong>依恋焦虑</strong><span>越高，越容易担心关系变化，也越需要从 TA 的回应中获得确定感。</span></p></div><div><i>V</i><p><strong>依恋回避</strong><span>越高，越容易在依赖、表达脆弱或关系靠近时保留距离。</span></p></div></div><div class="full-quadrant"><span class="axis-y">依恋回避&nbsp; 低 → 高</span><span class="axis-x">依恋焦虑&nbsp; 低 → 高</span><i class="fq-v"></i><i class="fq-h"></i><div class="fq-zone avoidant"><b>回避型</b><small>低焦虑 · 高回避</small></div><div class="fq-zone mixed"><b>混乱型</b><small>高焦虑 · 高回避</small></div><div class="fq-zone secure"><b>安全型</b><small>低焦虑 · 低回避</small></div><div class="fq-zone anxious"><b>焦虑型</b><small>高焦虑 · 低回避</small></div><span class="fq-dot" style="left:${Math.max(7,Math.min(93,r.anxiety))}%;bottom:${Math.max(7,Math.min(93,r.avoidance))}%"><i></i><b>你在这里</b></span></div></div>`,
    `<div class="result-card trigger-page"><div class="result-kicker">WHAT MAKES YOU UNEASY</div><h1 class="result-title"><span class="title-light">什么最容易让你</span><br><em>${r.type === 'secure' ? '留意关系变化' : '感到不安'}</em></h1><div class="trigger-rank">${triggerThemes.map((x,i)=>{const s=Math.round((x.score-1)/4*100);return `<div class="trigger-row ${i===0?'primary':''}"><div><i>0${i+1}</i><strong>${x.title}</strong><span>${i===0?'最明显':''}</span></div><div class="trigger-track"><b style="width:${s}%"></b></div></div>`}).join('')}</div><div class="plain-explain"><strong>${r.type === 'secure' ? '你不是没有触发点' : `对你来说，「${primaryTheme.title}」最容易启动反应。`}</strong><p>${triggerCopy}</p></div></div>`,
    `<div class="result-card need-page"><div class="result-kicker">WHEN YOU NEED THEM</div><h1 class="result-title"><span class="title-light">当你需要 TA 时</span><br><em>更常出现的反应</em></h1><div class="need-sequence">${needSteps.map((x,i)=>`<div class="need-step"><i>0${i+1}</i><strong>${x}</strong>${i<2?'<span>→</span>':''}</div>`).join('')}</div><div class="need-card"><small>你的主要方式</small><h2>${needTitle}</h2><p>${needCopy}</p></div><div class="need-tags">${r.avoidanceThemes.slice(0,3).map(x=>`<span>${x.title}</span>`).join('')}</div></div>`,
    `<div class="result-card cycle-page"><div class="result-kicker">YOUR RELATIONSHIP CYCLE</div><h1 class="result-title"><span class="title-light">关系里的</span><em>${r.type === 'secure' ? '处理路径' : '惯性循环'}</em></h1><div class="cycle-visual"><svg viewBox="0 0 280 280" aria-hidden="true"><circle cx="140" cy="140" r="101"></circle><path d="M140 39 A101 101 0 0 1 241 140"></path><path d="M241 140 A101 101 0 0 1 140 241"></path><path d="M140 241 A101 101 0 0 1 39 140"></path><path d="M39 140 A101 101 0 0 1 140 39"></path></svg><div class="cycle-core"><small>${r.type === 'secure' ? '可以调整' : '反复放大'}</small><b>${r.type === 'secure' ? '修复' : '循环'}</b></div>${flow.map((x,i)=>`<div class="cycle-node n${i+1}"><i>0${i+1}</i><span>${x}</span></div>`).join('')}</div><p class="result-caption">${r.type === 'secure' ? '稳定不是没有变化，而是变化出现后仍能沟通和调整。' : '它不一定是谁的错，更像是双方的反应互相放大。'}</p></div>`,
    `<div class="result-card context-page"><div class="result-kicker">YOUR RELATIONSHIP CONTEXT</div><h1 class="result-title"><span class="title-light">你的感受，也会受到</span><br><em>现实关系影响</em></h1><div class="reality-check"><div class="reality-item"><small>01 · 这段关系说得清楚吗？</small><strong>${clarity < 2 ? '比较清楚' : '仍有模糊'}</strong><div class="reality-scale"><span class="fill" style="width:${[88,68,40,18][clarity]}%"></span></div><p>${clarity < 2 ? '双方对关系的位置大致有共识。' : '关系没有清楚答案，本身就容易让人不安。'}</p></div><div class="reality-item"><small>02 · TA 的回应稳定吗？</small><strong>${stability < 2 ? '比较稳定' : '存在波动'}</strong><div class="reality-scale blue"><span class="fill" style="width:${[88,68,40,18][stability]}%"></span></div><p>${stability < 2 ? 'TA 的回应大体可预期。' : '忽冷忽热或回应变化，会放大关系敏感。'}</p></div></div><div class="context-verdict"><span>综合来看</span><strong>${contextTitle}</strong><p>${contextCopy}</p></div></div>`,
    `<div class="result-card observe-page"><div class="result-kicker">WHAT TO NOTICE NEXT</div><h1 class="result-title"><span class="title-light">接下来，值得</span><br><em>观察什么</em></h1><div class="observe-questions">${next.map((x,i)=>`<div class="observe-question"><i>0${i+1}</i><strong>${x}</strong></div>`).join('')}</div><p class="result-caption">不急着回答。下一次相似的感受出现时，再回来看看。</p><button class="restart-link" id="restart">重新测试&nbsp; ↗</button></div>`
  ];
}

function renderResult() {
  const r = calculateResult(), pages = resultPages(r);
  mountScreen(`<section class="screen result-screen">${topbar(['RESULT / 01','MAP / 02','TRIGGER / 03','NEED / 04','CYCLE / 05','CONTEXT / 06','NEXT / 07'][state.resultPage], state.resultPage, 7)}${pages.map((p,i)=>p.replace('result-card',`result-card ${i === state.resultPage ? 'active' : ''}`)).join('')}<nav class="result-nav"><button class="mini-nav" id="resultPrev">‹</button><div class="pager">${pages.map((_,i)=>`<button data-page="${i}" class="${i===state.resultPage?'active':''}" aria-label="第 ${i+1} 页"></button>`).join('')}</div><button class="mini-nav" id="resultNext">›</button></nav></section>`);
  document.querySelector('#resultPrev').onclick = () => { state.resultPage = (state.resultPage + 6) % 7; render(); };
  document.querySelector('#resultNext').onclick = () => { state.resultPage = (state.resultPage + 1) % 7; render(); };
  document.querySelectorAll('.pager button').forEach(b => b.onclick = () => { state.resultPage = Number(b.dataset.page); render(); });
  const dimensions = document.querySelector('#openDimensions'); if (dimensions) dimensions.onclick = () => { state.resultPage = 1; render(); };
  if (state.resultPage === 0) animateScores();
  const restart = document.querySelector('#restart'); if (restart) restart.onclick = () => { Object.assign(state,{view:'home',bgIndex:0,qIndex:0,background:{},answers:Array(24).fill(null),resultPage:0}); render(); };
}

function animateScores() {
  document.querySelectorAll('[data-score]').forEach(el => {
    const target = Number(el.dataset.score), start = performance.now(), duration = 900;
    const tick = now => { const p = Math.min(1,(now-start)/duration); el.textContent = Math.round(target * (1-Math.pow(1-p,3))); if (p<1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
}

function showExplanation() {
  const sheet = document.createElement('div'); sheet.className = 'sheet'; sheet.innerHTML = `<div class="sheet-card"><h3>这两个分数怎么看？</h3><p><strong>依恋焦虑</strong>描述你有多容易担心关系变化，或需要从 TA 的回应中获得确定感。</p><p><strong>依恋回避</strong>描述当关系靠近、需要依赖或表达脆弱时，你有多倾向保留距离。</p><p>四种依恋类型，是这两个维度组合后形成的理解方式。</p><button class="soft-btn">知道了</button></div>`;
  app.appendChild(sheet); sheet.onclick = e => { if (e.target === sheet || e.target.tagName === 'BUTTON') sheet.remove(); };
}

let touchStart = null;
app.addEventListener('touchstart', e => touchStart = e.touches[0].clientX, {passive:true});
app.addEventListener('touchend', e => { if (state.view !== 'result' || touchStart == null) return; const dx = e.changedTouches[0].clientX - touchStart; if (Math.abs(dx) > 55) { state.resultPage = (state.resultPage + (dx < 0 ? 1 : 6)) % 7; render(); } touchStart = null; }, {passive:true});

render();
