# JKCF Renewal — Codex Project Instructions

## 1. 프로젝트 목적

이 프로젝트는 일본어 웹사이트 `https://jkcf.or.jp/`의 반응형 리뉴얼 작업이다.

사용 기술:
- HTML
- CSS
- Vanilla JavaScript

외부 프레임워크와 라이브러리는 사용하지 않는다.

## 2. 가장 중요한 작업 원칙

1. 사용자가 요청한 범위만 작업한다.
2. 다음 섹션을 미리 만들지 않는다.
3. 기존 파일을 먼저 읽은 뒤 필요한 부분만 수정한다.
4. 관계없는 파일, 섹션, 스타일, 스크립트는 수정하지 않는다.
5. 임시 문구, 임시 이미지, 임시 카드, 임시 콘텐츠를 임의로 만들지 않는다.
6. 이미지가 없으면 CSS로 비슷한 이미지를 만들지 말고 사용자에게 알린다.
7. 이미 완료된 코드 전체를 불필요하게 다시 작성하지 않는다.
8. 기존 주석 구조를 유지한다.
9. 사용자의 승인 없이 새 HTML, CSS, JavaScript 파일을 추가하지 않는다.
10. 매 작업 전 `CURRENT_TASK.md`를 반드시 읽고 그 범위만 수행한다.

## 3. 점진적 작업 방식

이 프로젝트는 아래 순서대로 천천히 완성한다.

```html
<!-- HEADER -->
<!-- VISUAL -->
<!-- SECTION 01 -->
<!-- SECTION 02 -->
<!-- SECTION 03 -->
<!-- SECTION 04 -->
<!-- SECTION 05 -->
<!-- FOOTER 01 -->
<!-- FOOTER 02 -->
```

현재 요청받지 않은 영역은 주석만 유지한다.

예:
```html
<!-- VISUAL -->
```

요청받지 않은 영역 안에 빈 `<section>`, 임시 텍스트, 임시 이미지 등을 넣지 않는다.

## 4. 페이지 구조

기본 파일:

- `index.html`
- `about.html`
- `activities.html`
- `stories.html`
- `news.html`
- `membership.html`

페이지별 CSS:

- `index.html` → `css/index.css`
- `about.html` → `css/about.css`
- `activities.html` → `css/activities.css`
- `stories.html` → `css/stories.css`
- `news.html` → `css/news.css`
- `membership.html` → `css/membership.css`

JavaScript:

- 메인페이지 → `js/index.js`
- 서브페이지 → `js/subpage.js`

CSS와 JavaScript는 위 구조를 유지한다.

## 5. 언어 정책

- 사이트 기본 언어는 일본어다.
- 한국어 번역 기능을 반드시 제공한다.
- 일본어와 한국어는 하나의 HTML 안에서 전환할 수 있도록 구현한다.
- 사용자가 승인하지 않은 번역문을 임의로 확정하지 않는다.
- 번역 전환 상태는 페이지 이동 후에도 유지될 수 있도록 설계한다.
- 파일명은 영문이어도 화면 기본 언어는 일본어다.

## 6. 폰트

아래 Google Fonts의 `Zen Kaku Gothic New`만 사용한다.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap" rel="stylesheet">
```

```css
font-family: "Zen Kaku Gothic New", sans-serif;
```

다른 폰트는 사용하지 않는다.

## 7. 디자인 기준

- PC 기준 화면 폭: 1920px
- PC 콘텐츠 이너 최대 폭: 1500px
- 모바일 디자인 기준 폭: 360px
- 태블릿과 모바일 반응형 고려
- 최대 제목 크기: 85px

주요 색상:

```css
:root {
  --color-white: #ffffff;
  --color-green: #11b1af;
  --color-blue: #0b7ac6;
  --color-text: #2b2929;
}
```

폰트 크기, 굵기, 색상, 간격, 이너 폭, 헤더 높이 등 반복되는 값은 각 CSS 상단의 `:root`에서 관리한다.

## 8. HTML 작성 기준

- 시맨틱 HTML을 사용한다.
- 링크와 버튼 역할을 구분한다.
- 실제 이동은 `<a>`, 동작 실행은 `<button>`을 사용한다.
- 이미지에는 적절한 `alt`를 작성한다.
- 모바일 메뉴와 드롭다운에는 필요한 접근성 속성을 적용한다.
- `aria-expanded`, `aria-controls`, `aria-hidden` 상태가 실제 UI 상태와 일치해야 한다.
- 키보드 탐색이 가능해야 한다.
- 모든 메인페이지 클릭 요소는 실제 서브페이지 또는 실제 앵커로 연결한다.
- 아직 존재하지 않는 페이지를 새로 만들지 말고 현재 지정된 5개 서브페이지에 임시 연결한다.

## 9. CSS 작성 기준

- 명확한 클래스명을 사용한다.
- 가능하면 BEM 형식을 사용한다.
- 지나치게 깊은 선택자를 사용하지 않는다.
- `!important`는 사용하지 않는다.
- 레이아웃은 Flexbox 또는 Grid를 사용한다.
- 고정 픽셀만 남발하지 말고 반응형을 고려한다.
- 디자인 참고 이미지의 비율, 여백, 정렬을 우선한다.
- 과도한 그림자와 애니메이션을 임의로 추가하지 않는다.
- 사용자가 제공한 디자인에 없는 장식 요소를 만들지 않는다.

## 10. JavaScript 작성 기준

- Vanilla JavaScript만 사용한다.
- `DOMContentLoaded` 이후 실행한다.
- 요소가 존재하는지 확인한 뒤 이벤트를 연결한다.
- 전역 변수 사용을 최소화한다.
- 메뉴, 언어 선택, 아코디언의 상태와 ARIA 속성을 동기화한다.
- 모바일 메뉴가 열리면 본문 스크롤을 막는다.
- Escape 키로 열린 메뉴를 닫을 수 있게 한다.
- 화면 크기 변경 시 열린 모바일 메뉴 상태를 정리한다.
- 현재 요청과 관계없는 기능은 미리 구현하지 않는다.

## 11. 이미지 규칙

현재 헤더 로고:

```text
images/logo_header_pc.png
```

반드시 이 경로의 이미지를 사용한다.

파일이 존재하지 않으면:
- 가짜 로고를 만들지 않는다.
- CSS 도형으로 대체하지 않는다.
- 사용자에게 이미지 파일이 필요하다고 알린다.

## 12. 작업 전후 절차

작업 전:

1. `AGENTS.md`를 읽는다.
2. `CURRENT_TASK.md`를 읽는다.
3. 현재 프로젝트 파일 구조를 확인한다.
4. 수정 대상 파일의 기존 코드를 읽는다.
5. 현재 요청 범위를 벗어나는 수정이 없는지 확인한다.

작업 후:

1. 수정한 파일 목록을 짧게 보고한다.
2. 각 파일에서 무엇을 수정했는지 요약한다.
3. 요청하지 않은 영역을 건드리지 않았는지 확인한다.
4. HTML, CSS, JavaScript의 기본 문법 오류를 점검한다.
5. 이미지 경로와 링크 경로를 확인한다.

## 13. 응답 방식

- 설명은 짧고 명확하게 한다.
- 실제 파일을 수정한 뒤 변경 내용을 보고한다.
- 긴 코드 전체를 채팅에 중복 출력하지 않는다.
- 불확실한 사항은 임의로 결정하지 말고 사용자에게 확인한다.
- 단, 현재 요청 범위와 제공된 정보만으로 명확히 구현 가능한 경우에는 불필요한 질문 없이 진행한다.
