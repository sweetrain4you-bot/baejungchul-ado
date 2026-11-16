# 배정철어도 소개 사이트

## 파일 구성
- `index.html` — 사이트 본문 (대표 소개, 걸어온 길, 나눔, 수상, 언론)
- `news.js` — **어도 소식** 목록. 평소에는 이 파일만 고치면 됩니다.
- `style.css` / `main.js` — 디자인과 동작 (손댈 필요 없음)
- `images/` — 사진을 넣을 폴더 (선택)

## 소식 업데이트 (브라우저에서)
1. https://github.com/sweetrain4you-bot/baejungchul-ado/blob/main/news.js 접속 (GitHub 로그인)
2. 오른쪽 위 연필(✏️) 아이콘 → `const NEWS = [` 바로 아래에 기존 블록 하나를 복사해 붙여넣고 날짜·제목·내용 수정
3. **Commit changes** 클릭 → 1~2분 뒤 배정철어도.kr 에 반영

```js
  {
    date: "2026.12.01",
    title: "새 소식 제목",
    body: "소식 내용 한두 문장",
    link: ""
  },
```

## 사진 넣기
- 저장소의 `images/` 폴더에 `portrait.jpg` 업로드(Add file → Upload files) 후 `index.html`의 `<img ...>` 주석을 풉니다.

## 공개 정보
- 주소: https://배정철어도.kr (GitHub Pages, 저장소 `sweetrain4you-bot/baejungchul-ado`)
- `CNAME` 파일은 도메인 연결용이니 지우지 마세요.
- DNS(후이즈): A `@` → 185.199.108.153 / .109.153 / .110.153 / .111.153, CNAME `www` → sweetrain4you-bot.github.io
