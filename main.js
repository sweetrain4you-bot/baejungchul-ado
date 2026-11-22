// 모바일 메뉴
const btn = document.querySelector('.menu-btn');
const links = document.querySelector('.links');
btn.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
});
links.addEventListener('click', e => {
  if (e.target.tagName === 'A') { links.classList.remove('open'); btn.setAttribute('aria-expanded', false); }
});

// 소식 렌더링 (news.js 의 NEWS 목록을 사용)
(function renderNews() {
  const list = document.getElementById('news-list');
  const more = document.getElementById('news-more');
  const items = (typeof NEWS !== 'undefined' ? NEWS : []);
  const SHOW = 3;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  if (!items.length) { list.innerHTML = '<p class="empty">곧 새로운 소식을 전해 드리겠습니다.</p>'; return; }

  list.innerHTML = items.map((n, i) => `
    <article class="news-item${i >= SHOW ? ' is-hidden' : ''}">
      <time>${esc(n.date)}</time>
      <div>
        <h3>${esc(n.title)}</h3>
        <p>${esc(n.body)}</p>
        ${n.link ? `<a href="${esc(n.link)}" target="_blank" rel="noopener">자세히 보기 →</a>` : ''}
      </div>
    </article>`).join('');

  if (items.length > SHOW) {
    more.hidden = false;
    more.addEventListener('click', () => {
      list.querySelectorAll('.is-hidden').forEach(el => el.classList.remove('is-hidden'));
      more.hidden = true;
    });
  }
})();

// 유튜브 영상: 누를 때만 플레이어를 불러옵니다 (가볍고 광고·추천이 먼저 뜨지 않음)
document.querySelectorAll('.video-card').forEach(card => {
  card.addEventListener('click', () => {
    const box = document.createElement('div');
    box.className = 'video-card playing';
    let f;
    if (card.dataset.src) { // 사이트에 직접 올린 영상
      f = document.createElement('video');
      f.src = card.dataset.src;
      f.controls = true; f.autoplay = true; f.playsInline = true;
    } else { // 유튜브 영상
      f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${card.dataset.id}?autoplay=1&rel=0`;
      f.title = card.querySelector('.title').textContent;
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
    }
    box.append(f, card.querySelector('.meta'), card.querySelector('.title'));
    card.replaceWith(box);
  });
});

// 첫 화면 魚島: 마우스를 따라 아주 살짝 움직임 (마우스가 있는 기기에서만)
const mark = document.querySelector('.hero-mark');
if (mark && matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  document.querySelector('.hero').addEventListener('mousemove', e => {
    if (innerWidth <= 600) return;
    const x = (e.clientX / innerWidth - .5) * 10, y = (e.clientY / innerHeight - .5) * 10;
    mark.style.transform = `translateY(-50%) translate(${x}px, ${y}px)`;
  });
}

// 스크롤 등장 효과
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.section, .numbers').forEach(el => io.observe(el));

// 문의 양식 (Google Apps Script → 지메일, 코드는 apps-script/Code.gs)
(function ask() {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbwRif0xncbAKOpn8yT_stpajyr68xOf3BQqYl9eVW89HXnj2vadFQPb6SZLtSupvVxisw/exec'; // 배포한 Apps Script 웹 앱 주소 (…/exec)
  const form = document.getElementById('ask');
  const open = document.getElementById('ask-open');
  if (!form || !open) return;
  const $ = s => form.querySelector(s);
  const resv = $('.ask-resv'), consent = $('.ask-consent'), msg = $('.ask-msg'), send = $('.ask-send');
  const opt = [...form.querySelectorAll('.ask-who .opt')];

  open.addEventListener('click', () => {
    form.hidden = !form.hidden;
    open.setAttribute('aria-expanded', !form.hidden);
    if (!form.hidden) $('textarea').focus();
  });

  const isResv = () => form.kind.value === '예약 문의';
  const update = () => {
    resv.hidden = !isResv();
    opt.forEach(o => o.textContent = isResv() ? '(필수)' : '(선택)');
    consent.hidden = !(isResv() || form.name.value.trim() || form.phone.value.trim());
  };
  form.addEventListener('input', e => { e.target.classList.remove('invalid'); update(); });
  form.addEventListener('change', update);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    const need = [form.message];
    if (isResv()) need.push(form.name, form.phone);
    const bad = need.filter(el => !el.value.trim());
    if (bad.length) { bad.forEach(el => el.classList.add('invalid')); bad[0].focus(); msg.textContent = isResv() ? '예약 문의는 이름과 연락처가 필요합니다.' : '내용을 적어 주세요.'; return; }
    if (!consent.hidden && !form.consent.checked) { msg.textContent = '개인정보 수집·이용에 동의해 주세요.'; form.consent.focus(); return; }
    if (form.botcheck.checked) return;

    send.disabled = true; msg.textContent = '보내는 중…';
    try {
      // text/plain으로 보내야 브라우저 사전 확인(CORS) 없이 Apps Script에 바로 전달됩니다
      const res = await fetch(ENDPOINT, { method: 'POST', body: JSON.stringify({
        kind: form.kind.value, date: form.date.value, time: form.time.value, people: form.people.value,
        name: form.name.value.trim(), phone: form.phone.value.trim(), message: form.message.value.trim(),
        consent: !consent.hidden && form.consent.checked, botcheck: false
      }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      form.reset(); update();
      msg.textContent = '잘 받았습니다. 감사합니다.';
    } catch (err) {
      msg.textContent = '보내지 못했습니다. 잠시 후 다시 시도하시거나 전화로 연락 주세요.';
    } finally { send.disabled = false; }
  });
})();

// 스크롤 패럴럭스 (글자만, 아주 살짝)
(function parallax() {
  if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  const hero = document.querySelector('.hero');
  const heroText = document.querySelector('.hero-inner');
  const items = [];
  const add = (sel, speed) => document.querySelectorAll(sel).forEach(el => items.push({ el, speed, y: 0 }));
  add('.section-head', 0.07);
  add('.about-text .big', 0.06);
  add('.craft-type .yr', 0.08);
  let ticking = false;
  function frame() {
    ticking = false;
    const vh = innerHeight, sy = scrollY, k = innerWidth <= 600 ? 0.6 : 1;
    if (sy < hero.offsetHeight) {
      heroText.style.translate = `0 ${sy * 0.28 * k}px`;
      mark.style.translate = `0 ${sy * 0.12 * k}px`;
    }
    items.forEach(it => {
      const r = it.el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const d = (r.top + r.height / 2 - it.y) - vh / 2;
      it.y = Math.max(-40, Math.min(40, d * it.speed * k));
      it.el.style.translate = `0 ${it.y.toFixed(1)}px`;
    });
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  frame();
})();

// 스크롤 타이포 애니메이션: 제목은 글자씩, 큰 문장은 줄씩 올라옴
(function typo() {
  const lines = el => {
    el.innerHTML = el.innerHTML.split(/<br[^>]*>/i)
      .map((s, i) => `<span class="ln"><span class="ln-i" style="--i:${i}">${s.trim()}</span></span>`).join('');
    el.classList.add('typo');
  };
  const chars = el => {
    const t = el.textContent.trim();
    el.setAttribute('aria-label', t);
    el.innerHTML = [...t].map((c, i) => `<span class="ch" aria-hidden="true" style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
    el.classList.add('typo');
  };
  document.querySelectorAll('.hero h1, .about-text .big').forEach(lines);
  document.querySelectorAll('.section-head h2, .craft-type .yr').forEach(chars);

  const hero = document.querySelector('.hero h1');
  requestAnimationFrame(() => setTimeout(() => hero.classList.add('on'), 150));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  }), { threshold: 0.4 });
  document.querySelectorAll('.typo').forEach(el => el !== hero && io.observe(el));
})();

// 첫 화면 아래 숫자: 보이면 0부터 힘있게 올라감
(function countUp() {
  const box = document.querySelector('.numbers');
  if (!box) return;
  const nums = [...box.querySelectorAll('strong')].map(s => {
    const node = s.firstChild, raw = node.textContent.trim();
    const dec = (raw.split('.')[1] || '').length, to = parseFloat(raw.replace(/,/g, ''));
    const fmt = n => dec ? n.toFixed(dec) : Math.round(n).toLocaleString('en-US');
    node.textContent = fmt(0);
    return { node, to, fmt };
  });
  const run = () => nums.forEach((n, i) => {
    const start = performance.now() + i * 140, dur = 1800;
    const step = now => {
      const t = Math.min(1, Math.max(0, (now - start) / dur));
      n.node.textContent = n.fmt(n.to * (1 - Math.pow(1 - t, 4)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.5 });
  io.observe(box);
})();
