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
    const x = (e.clientX / innerWidth - .5) * 10, y = (e.clientY / innerHeight - .5) * 10;
    mark.style.transform = `translateY(-50%) translate(${x}px, ${y}px)`;
  });
}

// 스크롤 등장 효과
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.section, .numbers').forEach(el => io.observe(el));
