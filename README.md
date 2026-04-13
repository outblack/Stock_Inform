# Stock Inform

주식 리서치 리포트와 스킬 문서를 한곳에서 보고 관리할 수 있는 로컬 웹 뷰어입니다.  
현재 저장소에는 리포트 뷰어 앱, 생성된 리포트, 스킬 사용 가이드, 그리고 Codex용 시장/주식 분석 스킬 스냅샷이 함께 들어 있습니다.

## 포함된 내용

- `reports/`: 날짜별 Markdown 리포트
- `skills/`: Codex 스킬 로컬 사본
- `stock-skills-usage-guide.md`: 스킬 사용 가이드
- `src/`, `server.js`: 리포트/스킬 문서를 보여주는 웹 앱

## 빠르게 실행하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 프론트엔드 빌드

```bash
npm run build
```

### 3. 서버 실행

```bash
npm run start
```

기본 주소는 `http://127.0.0.1:4321` 입니다.

원클릭 실행을 원하면 아래 스크립트도 사용할 수 있습니다.

```bash
./run.sh
```

## 주요 기능

- 날짜별 리포트 탐색
- 시장/종목/테마/PLS 리포트 분류 보기
- Markdown 본문 렌더링
- 로컬에 복사된 스킬 문서 열람
- 문서 검색과 일부 리포트 삭제

## 포함된 스킬 스냅샷

이 저장소에는 아래 Codex 스킬의 사본이 `skills/` 아래에 포함되어 있습니다.

- `market-regime-debate`
- `stock-research-debate`
- `theme-rotation-map`
- `pls-line-detector`

앱은 이 로컬 사본을 우선 읽도록 설정되어 있어서, Codex 홈 디렉토리가 없는 환경에서도 스킬 설명서를 열 수 있습니다.

## 자주 보는 문서

- [스킬 사용 가이드](./stock-skills-usage-guide.md)
- [오늘 작성한 시황 리포트](./reports/2026-04-13/20260413-150058-market-regime-global-plus-korea.md)

## 저장소 구조

```text
.
├── README.md
├── stock-skills-usage-guide.md
├── skills/
├── reports/
├── src/
├── server.js
├── run.sh
└── package.json
```

## 비고

- `node_modules/`와 `dist/`는 생성물이라 Git에 포함하지 않습니다.
- 리포트는 Markdown 원본 그대로 보존합니다.
