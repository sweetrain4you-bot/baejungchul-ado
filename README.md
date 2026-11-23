# 배정철어도 소개 사이트

## 파일 구성
- `index.html` — 사이트 본문 (대표 소개, 걸어온 길, 나눔, 수상, 언론)
- `news.js` — **어도 소식**(공지·소식지 「어도 이야기」). 평소에는 이 파일만 고치면 됩니다.
- `newsletters/` — 소식지 표지(jpg)와 PDF를 넣는 폴더
- `style.css` / `main.js` — 디자인과 동작 (손댈 필요 없음)
- `images/` — 사진 폴더

## 소식 업데이트 (브라우저에서)
- `news.js`의 `NEWS`(공지)나 `LETTERS`(소식지)에 하나라도 넣으면 '어도 소식' 섹션과 상단 메뉴 '소식'이 자동으로 나타나고, 섹션 번호도 자동으로 다시 매겨집니다. 둘 다 비우면 다시 숨겨집니다.
- 언론 기사는 '언론과 영상'에 넣습니다 (소식과 겹치지 않게).

1. https://github.com/sweetrain4you-bot/baejungchul-ado/blob/main/news.js 접속 (GitHub 로그인)
2. 오른쪽 위 연필(✏️) 아이콘 → 파일 안의 예시를 참고해 `const NEWS = [` 또는 `const LETTERS = [` 바로 아래에 블록을 붙여넣고 수정
3. **Commit changes** 클릭 → 1~2분 뒤 배정철어도.kr 에 반영

```js
  // 공지
  {
    date: "2026.12.01",
    title: "공지 제목",
    body: "내용 한두 문장",
    link: ""
  },

  // 소식지 (파일은 newsletters/ 폴더에 먼저 업로드)
  {
    issue: "제1호",
    date: "2026.12",
    title: "소식지 제목",
    summary: "한두 줄 요약",
    cover: "newsletters/01-cover.jpg",
    file: "newsletters/01.pdf"
  },
```

## 사진 넣기
- 저장소의 `images/` 폴더에 `portrait.jpg` 업로드(Add file → Upload files) 후 `index.html`의 `<img ...>` 주석을 풉니다.

## 공개 정보
- 주소: https://배정철어도.kr (GitHub Pages, 저장소 `sweetrain4you-bot/baejungchul-ado`)
- `CNAME` 파일은 도메인 연결용이니 지우지 마세요.
- DNS(후이즈): A `@` → 185.199.108.153 / .109.153 / .110.153 / .111.153, CNAME `www` → sweetrain4you-bot.github.io
