# 네이버 그로스 코파일럿 (NAVER Growth Copilot)

> NAVER 2026 하계 인턴십 · 비즈니스 트랙
> **한 엔진, 두 사용자** — 셀러 컨설턴트(1지망)와 클립 창작자(2지망)를 같은 인사이트 엔진으로.

데이터를 **점수 → 우선순위 → 근거 있는 AI 주간 리포트**로 바꾸는 도구입니다.
대상이 **셀러**냐 **클립 주제**냐만 바뀔 뿐 엔진은 하나이며, 모드 토글로 전환합니다.
순수 코딩 데모가 아니라 **비즈니스·프로덕트 산출물**을 지향합니다.

A business-product tool with one shared engine (score → prioritize → evidence-bound AI weekly brief),
toggled between two users: **NAVER Shopping seller consultants (1st choice)** and **Clip short-form creators (2nd choice)**.

---

## 두 모드 (Two modes, one engine)

| | 셀러 모드 · 1지망 | 창작자 모드 · 2지망 |
| --- | --- | --- |
| 질문 | 누구부터 도울까 | 뭘 만들까 |
| 입력 | GMV·성장률·전환율·리뷰·ROAS | 조회·시청완료·재생산·검색유입·태그전환 |
| 우선순위 | 저성과 = 시급한 셀러 | 고성장·저포화 = 지금 기회인 주제 |
| 출력 | 주간 셀러 브리프 | 이번 주 만들 주제 3 + 훅 + 정보 태그 |

### 공고 요구사항 → 화면 매핑 (Posting → Screens)

| 공고에서 요구하는 것 | 이 프로토타입의 대응 |
| --- | --- |
| 영업관리 도구 설계 | 대시보드 + 우선순위 워크스페이스 (셀러/주제 모드) |
| 도구 벤치마킹·도메인 리서치 | 벤치마크 보드 (셀러: Shopify·Amazon·Looker / 창작자: 크리에이터 어드바이저·YT Studio·TikTok) |
| AI 툴 활용 보고 자동화 | KPI 대시보드 + **Gemini 기반 주간 브리프 생성** |
| 사용성 테스트 설계·실행 | 사용성 테스트 계획 + 성공 지표 (모드별) |
| (우대) SQL·데이터 분석 | BigQuery 표준 SQL 기회 점수 산출 쿼리 |

7개 화면: **대시보드 · 셀러/주제 · AI 리포트 · 벤치마크 · SQL 로직 · 사용성 · 플라이휠**

---

## 플라이휠 — 1지망 ↔ 2지망 연계 (Commerce × Content)

클립의 **정보 태그**(쇼핑 태그 전년比 약 +350%)와 **쇼핑 커넥트** 때문에 창작자 콘텐츠는 곧 셀러 수요로 이어집니다.

> 뜨는 클립 주제 → 정보 태그 → 네이버쇼핑 수요 신호 → 셀러 기회 → 셀러·콘텐츠 성장

플라이휠 탭은 카테고리별로 *가장 뜨는 주제*를 *같은 카테고리의 도움이 필요한 셀러*에 직접 연결하고,
실서비스 구현용 **NAVER Cloud 스택 매핑**(Media Intelligence · NCLUE · CLOVA Studio/HyperCLOVA X · AiTEMS · Data Box)을 함께 둡니다.

---

## 실행 방법 (How to run)

빌드가 필요 없는 정적 사이트입니다.

- 가장 간단한 방법: `index.html`을 브라우저로 엽니다.
- 권장 (로컬 서버):
  ```bash
  python -m http.server 5173
  # http://localhost:5173 접속
  ```

> `file://` 로 직접 열면 일부 브라우저에서 클립보드 복사가 제한될 수 있어 로컬 서버를 권장합니다.

---

## AI 리포트 설정 (Gemini)

"AI 리포트" 화면에서 실제 생성형 AI(Google Gemini)로 주간 브리프를 생성할 수 있습니다.

1. [Google AI Studio](https://aistudio.google.com/app/apikey)에서 API 키를 발급합니다.
2. 앱의 **AI 리포트 → Gemini API 키 입력란**에 붙여넣고 **저장**을 누릅니다.
3. **AI로 생성** 버튼을 누르면 선택한 대상·어조 기준으로 한국어 브리프가 생성됩니다.
4. 키가 없어도 **템플릿 기반(오프라인)** 브리프는 항상 동작합니다(폴백).

### 🔐 보안 메모 (중요)
- API 키는 **코드/저장소에 저장되지 않습니다.** 입력한 키는 브라우저 `localStorage`에만 저장되고 요청은 브라우저 → Google로 직접 전송됩니다.
- 키를 **소스 코드에 하드코딩하지 마세요.** 정적 사이트로 배포하면 누구나 볼 수 있습니다.
- 키가 노출됐다면 AI Studio에서 **즉시 재발급(rotate)** 하세요.

---

## 배포 (Deploy)

### GitHub Pages
1. Settings → Pages → Branch를 `main` / 루트(`/`)로 설정합니다.
2. 발급된 URL을 지원서에 첨부합니다.

### Vercel
1. New Project → 저장소 임포트 → 프레임워크 프리셋 **Other**(빌드 없음, 정적) → Deploy.

> 정적 사이트이므로 별도 빌드/서버가 필요 없습니다.

---

## 데이터 (Data) — 모두 합성, 실제 NAVER 데이터 아님

- `data/synthetic-sellers.csv` — 14개 셀러 합성 데이터.
- `data/synthetic-topics.csv` — 14개 클립 주제 합성 데이터.
- 앱 내 데이터(`app.js`)와 동일한 값이라 대시보드/CSV 내보내기 결과가 일치합니다.

---

## 파일 구조 (Structure)

```
naver-growth-copilot/
├── index.html              # 7개 화면 레이아웃 (모드 토글 포함)
├── styles.css              # 프리미엄·미니멀 디자인 시스템 (액센트 토큰 1개로 테마 교체)
├── app.js                  # 도메인 설정(DOMAINS.seller/creator) + 렌더 + Gemini 리포트
├── data/
│   ├── synthetic-sellers.csv
│   └── synthetic-topics.csv
├── 프로젝트-가이드.md / .pdf   # 화면·로직·KPI 해설 (PDF 동봉)
├── 데이터-가정.md / .pdf       # 지표별 숫자 가정 (면접 방어용)
├── case-study.md           # 문제 정의·유저·검증 시나리오
└── README.md
```

---

## 인터뷰 스토리 (Interview framing)

회계·감사 백그라운드의 **근거 중심 사고**(모든 추천은 지표·리스크 신호·워크플로우 관찰로 연결)와
AI 툴을 활용한 **빠른 프로토타이핑**을 결합했습니다.
모호한 비즈니스 워크플로우를 대시보드·리포트·검증 가능한 제품 가설로 바꾸는 것이 핵심 강점입니다.

> 데모 데이터는 모두 합성이며 실제 NAVER 데이터를 사용하지 않았습니다.
