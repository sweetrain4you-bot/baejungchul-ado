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

// 스크롤 등장 효과
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.section, .numbers').forEach(el => io.observe(el));
