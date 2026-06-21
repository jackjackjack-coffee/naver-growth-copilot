// 네이버 그로스 코파일럿 — "한 엔진, 두 사용자"
// 1지망: 네이버쇼핑 셀러 컨설팅 영업관리 도구 / 2지망: 클립 창작자 콘텐츠 인사이트 리포트
// 같은 파이프라인(수집→점수화→우선순위→근거→AI 브리프→검증)을 모드 토글로 두 도메인에 재사용합니다.
// 데이터는 모두 합성(synthetic)이며 실제 NAVER 데이터가 아닙니다.

// ─────────────────────────────────────────────────────────────
// 1) 데이터셋
// ─────────────────────────────────────────────────────────────
const sellers = [
  { id: "DAB", name: "데일리에이블", category: "fashion", gmv: 1840, growth: 14.2, health: 76, conversion: 3.8, review: 4.7, adRoas: 4.2, risk: "Low", action: "재구매 SKU 대상 검색광고 확대", stage: "액션 수락" },
  { id: "BBL", name: "블룸랩", category: "beauty", gmv: 1210, growth: -4.8, health: 43, conversion: 2.1, review: 4.1, adRoas: 1.8, risk: "Action", action: "상세페이지 표현 정비 및 할인 누수 차단", stage: "브리프 발송" },
  { id: "KFT", name: "케이핏기어", category: "sports", gmv: 920, growth: 21.4, health: 68, conversion: 3.2, review: 4.5, adRoas: 3.1, risk: "Watch", action: "고트래픽 액세서리 번들 구성", stage: "컨설팅 대기" },
  { id: "HOM", name: "홈온", category: "living", gmv: 760, growth: 7.6, health: 59, conversion: 2.7, review: 4.4, adRoas: 2.7, risk: "Watch", action: "배송 약속 노출 개선", stage: "데이터 검토" },
  { id: "FRM", name: "프레시마켓", category: "grocery", gmv: 1460, growth: 3.1, health: 52, conversion: 2.4, review: 3.9, adRoas: 2.2, risk: "Action", action: "신선식품 콜드체인 리뷰 이슈 대응", stage: "브리프 발송" },
  { id: "MIO", name: "미오클로젯", category: "fashion", gmv: 630, growth: -2.9, health: 47, conversion: 2.0, review: 4.2, adRoas: 1.9, risk: "Action", action: "대표 이미지·사이즈 가이드 리뉴얼", stage: "데이터 검토" },
  { id: "PUR", name: "퓨어서울", category: "beauty", gmv: 1550, growth: 17.1, health: 82, conversion: 4.1, review: 4.8, adRoas: 4.8, risk: "Low", action: "멤버십 쿠폰 테스트 확대", stage: "액션 수락" },
  { id: "LIV", name: "리빙노트", category: "living", gmv: 510, growth: 10.4, health: 71, conversion: 3.0, review: 4.6, adRoas: 3.4, risk: "Low", action: "시즌 기획전 페이지 신설", stage: "컨설팅 대기" },
  { id: "RUN", name: "런베이스", category: "sports", gmv: 430, growth: -6.1, health: 39, conversion: 1.7, review: 4.0, adRoas: 1.4, risk: "Action", action: "저ROAS 캠페인 클러스터 중단", stage: "브리프 발송" },
  { id: "PAN", name: "팬트리나인", category: "grocery", gmv: 690, growth: 8.9, health: 63, conversion: 2.9, review: 4.3, adRoas: 3.0, risk: "Watch", action: "정기배송 재구매 넛지 테스트", stage: "컨설팅 대기" },
  { id: "MOM", name: "모먼트뷰티", category: "beauty", gmv: 880, growth: 5.2, health: 57, conversion: 2.6, review: 4.3, adRoas: 2.5, risk: "Watch", action: "신규 리뷰 적립 캠페인 강화", stage: "데이터 검토" },
  { id: "URB", name: "어반핏", category: "sports", gmv: 1120, growth: 12.7, health: 70, conversion: 3.3, review: 4.4, adRoas: 3.6, risk: "Low", action: "장바구니 이탈 리타게팅 설정", stage: "액션 수락" },
  { id: "GRN", name: "그린상회", category: "grocery", gmv: 540, growth: -1.4, health: 45, conversion: 2.2, review: 4.0, adRoas: 2.0, risk: "Action", action: "묶음배송 임계금액 안내 개선", stage: "브리프 발송" },
  { id: "COZ", name: "코지홈", category: "living", gmv: 980, growth: 9.3, health: 66, conversion: 2.9, review: 4.5, adRoas: 3.2, risk: "Watch", action: "베스트셀러 연관 추천 강화", stage: "컨설팅 대기" }
];

// 클립 창작자 도메인 — 셀러 배열과 대칭 구조(같은 엔진이 그대로 돌도록).
// views: 주간 조회수(천) · growth: 성장 속도(최근4주 vs 작년동기, %) · saturation: 포화도(0-100, 높을수록 늦음)
// opportunity: 기회 점수(0-100, 높을수록 좋음) · completion: 시청완료율(%) · remake: 재생산 지수 · searchIn: 검색 유입 지수
// tagConv: 상품태그 전환(%, 커머스 연결 신호) · risk: Hot(기회)/Watch(주의)/Late(늦음)
const topics = [
  { id: "GRW", name: "겟레디위드미 5분 루틴", category: "beauty", views: 182, growth: 38.4, saturation: 34, opportunity: 84, completion: 61, remake: 72, searchIn: 64, tagConv: 5.2, risk: "Hot", action: "아침 5분 루틴 + 핵심템 1개 클로즈업 훅", stage: "제작 대기" },
  { id: "PSC", name: "퍼스널컬러 진단 브이로그", category: "beauty", views: 141, growth: 33.1, saturation: 41, opportunity: 78, completion: 58, remake: 66, searchIn: 71, tagConv: 6.1, risk: "Hot", action: "톤 비교 전후 컷 + 추천 제품 정보 태그", stage: "아이디어 후보" },
  { id: "ING", name: "성분 분석 리뷰", category: "beauty", views: 98, growth: 12.6, saturation: 58, opportunity: 54, completion: 49, remake: 38, searchIn: 55, tagConv: 4.4, risk: "Watch", action: "논란 성분 1개를 30초로 정리하는 포맷", stage: "데이터 검토" },
  { id: "KJN", name: "키작녀 코디", category: "fashion", views: 167, growth: 29.7, saturation: 39, opportunity: 80, completion: 57, remake: 69, searchIn: 62, tagConv: 5.8, risk: "Hot", action: "키 작은 체형 비율 보정 3코디 + 룩별 태그", stage: "제작 대기" },
  { id: "HAU", name: "하울 언박싱", category: "fashion", views: 120, growth: 4.2, saturation: 77, opportunity: 36, completion: 44, remake: 51, searchIn: 40, tagConv: 4.0, risk: "Late", action: "이미 포화 — 가격대 특화 하울로 차별화 필요", stage: "데이터 검토" },
  { id: "OOT", name: "데일리 OOTD", category: "fashion", views: 105, growth: 2.1, saturation: 81, opportunity: 31, completion: 41, remake: 47, searchIn: 36, tagConv: 3.6, risk: "Late", action: "범용 OOTD는 늦음 — 직업/상황 특화로 좁히기", stage: "데이터 검토" },
  { id: "HMT", name: "홈트 2분 챌린지", category: "sports", views: 159, growth: 31.5, saturation: 37, opportunity: 79, completion: 63, remake: 74, searchIn: 58, tagConv: 4.7, risk: "Hot", action: "2분 따라하기 + 매트/밴드 정보 태그", stage: "제작 대기" },
  { id: "RUN", name: "러닝 기록 브이로그", category: "sports", views: 88, growth: 14.8, saturation: 52, opportunity: 56, completion: 53, remake: 41, searchIn: 49, tagConv: 3.9, risk: "Watch", action: "주간 기록 챌린지 시리즈로 재방문 유도", stage: "아이디어 후보" },
  { id: "JZS", name: "자취방 정리수납", category: "living", views: 173, growth: 35.9, saturation: 33, opportunity: 83, completion: 64, remake: 77, searchIn: 66, tagConv: 6.4, risk: "Hot", action: "1평 공간 비포애프터 + 수납템 정보 태그", stage: "제작 대기" },
  { id: "PLT", name: "플랜테리어", category: "living", views: 92, growth: 16.2, saturation: 55, opportunity: 55, completion: 50, remake: 43, searchIn: 52, tagConv: 4.6, risk: "Watch", action: "초보용 안 죽는 식물 3종 포맷", stage: "데이터 검토" },
  { id: "JBG", name: "1인 가구 장보기", category: "grocery", views: 156, growth: 30.2, saturation: 38, opportunity: 81, completion: 60, remake: 70, searchIn: 61, tagConv: 6.7, risk: "Hot", action: "3만원 일주일 장보기 + 품목 정보 태그", stage: "제작 대기" },
  { id: "MPR", name: "밀프렙 일주일", category: "grocery", views: 134, growth: 27.4, saturation: 43, opportunity: 76, completion: 59, remake: 63, searchIn: 57, tagConv: 5.9, risk: "Hot", action: "도시락 5개 + 용기/재료 정보 태그", stage: "아이디어 후보" },
  { id: "CVS", name: "편의점 신상 먹방", category: "grocery", views: 112, growth: 3.4, saturation: 79, opportunity: 33, completion: 42, remake: 49, searchIn: 38, tagConv: 3.4, risk: "Late", action: "포화 — 특정 편의점/카테고리로 좁혀야 함", stage: "데이터 검토" },
  { id: "RMT", name: "집들이 룸투어", category: "living", views: 101, growth: 18.6, saturation: 49, opportunity: 58, completion: 52, remake: 45, searchIn: 47, tagConv: 5.1, risk: "Watch", action: "예산별 룸투어로 시리즈화 + 가구 태그", stage: "아이디어 후보" }
];

const categoryLabels = { beauty: "뷰티", fashion: "패션", sports: "스포츠", living: "리빙", grocery: "식품" };
const categoryLabel = (key) => categoryLabels[key] || key;

// ─────────────────────────────────────────────────────────────
// 2) SQL · 벤치마크 · 가설 · 테스트 · 가중치 (도메인별)
// ─────────────────────────────────────────────────────────────
const sellerSql = `-- 셀러 성장 기회 점수 산출 (BigQuery 표준 SQL)
-- 가중치: 성장 갭 35% · 전환율 20% · 리뷰 15% · 광고 효율 15% · 컨설팅 준비도 15%
WITH seller_week AS (
  SELECT
    seller_id,
    category,
    SUM(gmv_krw) AS gmv_krw,
    SAFE_DIVIDE(SUM(orders), SUM(sessions)) AS conversion_rate,
    AVG(review_score) AS review_score,
    SAFE_DIVIDE(SUM(ad_revenue_krw), SUM(ad_spend_krw)) AS roas,
    LAG(SUM(gmv_krw), 4) OVER (
      PARTITION BY seller_id ORDER BY week_start
    ) AS gmv_4w_prior
  FROM merchant_metrics
  WHERE week_start >= DATE_SUB(CURRENT_DATE(), INTERVAL 8 WEEK)
  GROUP BY seller_id, category, week_start
),
scored AS (
  SELECT
    seller_id,
    category,
    gmv_krw,
    SAFE_DIVIDE(gmv_krw - gmv_4w_prior, gmv_4w_prior) AS growth_rate,
    conversion_rate,
    review_score,
    roas,
    0.35 * (1 - PERCENT_RANK() OVER (ORDER BY gmv_krw))
    + 0.20 * (1 - PERCENT_RANK() OVER (ORDER BY conversion_rate))
    + 0.15 * (1 - PERCENT_RANK() OVER (ORDER BY review_score))
    + 0.15 * (1 - PERCENT_RANK() OVER (ORDER BY roas))
    + 0.15 * CASE WHEN gmv_krw > 500000000 THEN 1 ELSE 0.6 END
      AS opportunity_score
  FROM seller_week
)
SELECT *
FROM scored
ORDER BY opportunity_score DESC
LIMIT 50;`;

const topicSql = `-- 클립 주제 기회 점수 산출 (BigQuery 표준 SQL)
-- 가중치: 성장 속도 35% · (낮은)포화도 25% · 검색 유입 15% · 재생산 15% · 상품태그 전환 10%
-- 핵심: 단순 조회수 1위가 아니라 "지금 들어가면 기회"인 주제를 위로 올린다.
WITH topic_week AS (
  SELECT
    topic_id,
    category,
    SUM(views) AS views,
    SAFE_DIVIDE(SUM(complete_views), SUM(views)) AS completion_rate,
    SUM(remakes) AS remakes,
    SUM(search_inflow) AS search_inflow,
    SAFE_DIVIDE(SUM(tag_clicks_to_buy), NULLIF(SUM(tag_impressions), 0)) AS tag_conv,
    LAG(SUM(views), 52) OVER (
      PARTITION BY topic_id ORDER BY week_start
    ) AS views_yoy
  FROM clip_topic_metrics
  WHERE week_start >= DATE_SUB(CURRENT_DATE(), INTERVAL 4 WEEK)
  GROUP BY topic_id, category, week_start
),
scored AS (
  SELECT
    topic_id,
    category,
    views,
    SAFE_DIVIDE(views - views_yoy, views_yoy) AS growth_rate,
    completion_rate,
    tag_conv,
    0.35 * PERCENT_RANK() OVER (ORDER BY SAFE_DIVIDE(views - views_yoy, views_yoy))
    + 0.25 * (1 - PERCENT_RANK() OVER (ORDER BY saturation_index)) -- 포화도 낮을수록 가점
    + 0.15 * PERCENT_RANK() OVER (ORDER BY search_inflow)
    + 0.15 * PERCENT_RANK() OVER (ORDER BY remakes)
    + 0.10 * PERCENT_RANK() OVER (ORDER BY tag_conv)              -- 커머스 연결 신호
      AS opportunity_score
  FROM topic_week
)
SELECT *
FROM scored
ORDER BY opportunity_score DESC   -- 기회가 큰 주제부터: 이번 주 만들 것
LIMIT 50;`;

const sellerBenchmarks = [
  { name: "Shopify Magic", note: "콘텐츠 작성 보조는 빠르지만, 컨설턴트용 내부 영업 우선순위 라우팅은 약함." },
  { name: "Amazon Seller Central", note: "셀러 지표·광고 컨트롤은 강력하나 추천이 모듈별로 파편화되는 경향." },
  { name: "Klaviyo CDP", note: "세그먼트·라이프사이클 트리거는 우수하나 마켓플레이스 현장 컨설팅에는 덜 적합." },
  { name: "HubSpot Sales Hub", note: "파이프라인 워크플로우·담당자 관리가 명확하나 이커머스 SKU 근거는 별도 모델링 필요." },
  { name: "Looker Studio", note: "유연한 리포팅 레이어지만 워크플로우 추가 없이는 AI 액션 작성이 부족." },
  { name: "Tableau Pulse", note: "자연어 지표 설명은 유용하나 셀러 플레이북에는 여전히 도메인 맥락이 필요." }
];

const creatorBenchmarks = [
  { name: "크리에이터 어드바이저 (네이버)", note: "내 콘텐츠 성과 분석은 주지만 '다음에 뭘 만들지' 전망은 주지 않음 — 백미러." },
  { name: "YouTube Studio Analytics", note: "노출·시청 지속 데이터는 풍부하나 주제 추천을 바로 쓸 초안으로 내보내지 않음." },
  { name: "TikTok Creative Center", note: "트렌드 키워드는 보여주나 내 카테고리·포화도 맥락의 우선순위는 약함." },
  { name: "VLA / 빅풋9 등 분석툴", note: "랭킹·조회수 중심이라 '지금 들어가면 기회 vs 이미 늦음'을 갈라주지 못함." },
  { name: "Google Trends", note: "검색 추세는 보지만 숏폼 포맷·재생산·상품태그 전환과 연결되지 않음." },
  { name: "Sprout/Later 류", note: "발행 일정 관리에 강하나 콘텐츠 아이디어를 데이터 근거로 제안하지 않음." }
];

const sellerHypotheses = [
  ["H1", "컨설턴트는 원시 지표보다 우선순위가 매겨진 케이스를 더 필요로 한다."],
  ["H2", "AI 브리프는 수정 가능하고 근거가 연결되며 셀러 성숙도별로 구분되어야 한다."],
  ["H3", "도입 초기에는 완전 자동화보다 다음 추천 액션의 품질이 더 중요하다."]
];

const creatorHypotheses = [
  ["H1", "창작자는 트렌드 랭킹보다 '내 카테고리에서 지금 들어가면 기회인 주제'를 더 필요로 한다."],
  ["H2", "좋은 리포트는 조회수 순위가 아니라 성장 속도와 포화도를 같이 봐야 한다."],
  ["H3", "추천 주제는 바로 쓸 수 있는 훅·정보 태그 초안까지 줘야 제작으로 이어진다."]
];

const sellerTests = [
  { task: "긴급 셀러 상위 3곳 찾기", method: "셀러 컨설턴트 대상 시간 측정 과제", success: "90초 이내" },
  { task: "AI 브리프 신뢰", method: "근거 연결 검토 및 신뢰도 평가", success: "4.2 / 5 이상" },
  { task: "셀러 대상 문구 수정", method: "싱크어라우드 리라이트 세션", success: "수정 2회 이내" },
  { task: "주간 콜 우선순위 정하기", method: "기존 스프레드시트 vs 프로토타입 비교", success: "기획 30% 단축" },
  { task: "근본 원인 설명", method: "지표 이해도 퀴즈", success: "근거 정확도 80%" },
  { task: "현장 피드백 기록", method: "액션 후 로깅 트라이얼", success: "완료율 90%" }
];

const creatorTests = [
  { task: "이번 주 만들 주제 3개 고르기", method: "창작자 대상 시간 측정 과제", success: "90초 이내" },
  { task: "추천 근거 신뢰", method: "'왜 떴는지' 근거 검토 및 신뢰도 평가", success: "4.2 / 5 이상" },
  { task: "추천 훅을 실제로 채택", method: "싱크어라우드 기획 세션", success: "수락률 60% 이상" },
  { task: "리포트 보고 실제 제작", method: "1주 후 게시 여부 추적", success: "추천 주제 제작률 40%+" },
  { task: "기획 시간 단축", method: "기존 방식 vs 리포트 비교", success: "기획 30% 단축" },
  { task: "상품 태그 연결", method: "추천에 맞는 정보 태그 부착 시도", success: "태그 부착률 50%+" }
];

const sellerWeights = [["성장 갭", "35%"], ["전환율 하락", "20%"], ["리뷰 리스크", "15%"], ["광고 효율", "15%"], ["컨설팅 준비도", "15%"]];
const creatorWeights = [["성장 속도", "35%"], ["낮은 포화도", "25%"], ["검색 유입", "15%"], ["재생산", "15%"], ["상품태그 전환", "10%"]];

const sellerWorkflow = [
  "매출·트래픽·리뷰·프로모션 테이블을 결합합니다.",
  "성장 갭, 마진 품질, 현장 시급도로 셀러를 점수화합니다.",
  "지표 변화 근거와 함께 핵심 원인을 요약합니다.",
  "매니저용 브리프와 셀러 대상 코칭 노트를 생성합니다.",
  "수락된 액션을 기록해 사용성 테스트와 반복 개선에 활용합니다."
];

const creatorWorkflow = [
  "조회·시청완료·재생산·검색 유입 신호를 카테고리별로 결합합니다.",
  "성장 속도와 포화도로 주제를 점수화해 '기회 vs 늦음'을 가릅니다.",
  "왜 떴는지 근거와 함께 핵심 신호를 요약합니다.",
  "추천 주제 3개 + 바로 쓸 훅 + 정보 태그 초안을 생성합니다.",
  "수락된 추천을 기록해 다음 리포트 품질을 키웁니다."
];

// ─────────────────────────────────────────────────────────────
// 3) 도메인 설정 — 같은 렌더 함수가 이 설정만 바꿔 끼웁니다.
// ─────────────────────────────────────────────────────────────
const fmtGmv = (v) => `${(v / 100).toFixed(1)}억`;
const fmtViews = (v) => (v >= 10 ? `${(v / 10).toFixed(1)}만회` : `${v}천회`);

const DOMAINS = {
  seller: {
    mode: "seller",
    items: sellers,
    riskLabels: { Low: "안정", Watch: "주의", Action: "조치" },
    riskColorOf: (r) => (r === "Low" ? "var(--naver)" : r === "Watch" ? "var(--amber)" : "var(--red)"),
    primary: (it) => it.gmv,
    formatPrimary: fmtGmv,
    scatterX: (it) => it.health,                 // 컨설팅 준비도
    scatterY: (it) => (it.growth + 8) / 32,       // -8~24% → 0~1
    bubbleSize: (it) => 34 + Math.min(it.gmv / 45, 48),
    priorityCompare: (a, b) => (a.health - b.health) || (b.gmv - a.gmv), // 가장 도움 필요한 셀러 먼저
    funnelStages: ["데이터 검토", "브리프 발송", "컨설팅 대기", "액션 수락"],
    sql: sellerSql,
    benchmarks: sellerBenchmarks,
    hypotheses: sellerHypotheses,
    tests: sellerTests,
    weights: sellerWeights,
    workflow: sellerWorkflow,
    toneOptions: { executive: "임원 보고용", field: "현장 컨설턴트용", seller: "셀러 대상" },
    metrics: [["브리프 작성 시간", "5분 이내"], ["액션 수락률", "60% 이상"], ["근거 신뢰도", "평균 4.2 / 5"], ["재사용", "주 3회 세션"]],
    labels: {
      brandTitle: "셀러 그로스 코파일럿", brandSub: "네이버쇼핑 셀러 컨설팅 영업관리 도구",
      navItems: "셀러", topEyebrow: "영업관리 도구",
      sidebarNote: "AI 보고 자동화, 대시보드, 이커머스 리서치, 현장 검증, 데이터 로직을 하나의 검토 가능한 산출물로 묶었습니다.",
      scatterTitle: "셀러 기회 맵", scatterAxis: "가로축 = 컨설팅 준비도 · 세로축 = 최근 성장률 · 크기 = GMV",
      categoryBars: "카테고리별 GMV", funnelTitle: "셀러 컨설팅 퍼널",
      itemTableTitle: "컨설팅 후보 셀러", itemHead: ["셀러", "카테고리", "GMV", "성장률", "리스크", "상세"],
      reportTitle: "주간 셀러 브리프", reportItemLabel: "셀러",
      benchmarkTitle: "영업관리 도구 비교", sqlTitle: "셀러 기회 점수 산출 쿼리",
      sqlExplain: "각 셀러의 최근 8주 지표(매출·전환·리뷰·광고 효율)를 모아 <b>하나의 '기회 점수'</b>로 압축하고, <b>먼저 챙길 셀러 순서</b>로 정렬합니다. 지표가 낮은 셀러일수록 점수가 높아져요 — 개선 여지가 가장 크기 때문입니다.",
      viewTitles: { dashboard: "셀러 컨설팅 대시보드", sellers: "셀러 우선순위 워크스페이스", report: "AI 셀러 리포트 생성기", research: "벤치마크 리서치 보드", sql: "데이터 로직 · SQL 스코어링", testing: "사용성 테스트 계획", flywheel: "커머스-콘텐츠 플라이휠" }
    },
    kpis(list) {
      const totalGmv = list.reduce((s, x) => s + x.gmv, 0);
      const actionCount = list.filter((x) => x.risk === "Action").length;
      return [
        ["관리 GMV", fmtGmv(totalGmv), "+8.4% 4주 누적 추세"],
        ["평균 전환율", `${avg(list, "conversion").toFixed(1)}%`, "카테고리 정규화"],
        ["AI 브리프 대기", `${actionCount}개 셀러`, "최우선 셀러 자동 노출"],
        ["컨설팅 헬스", `${Math.round(avg(list, "health"))}/100`, "셀러 준비도 종합 점수"]
      ];
    },
    detail(it) {
      return [
        ["카테고리", categoryLabel(it.category)], ["GMV", fmtGmv(it.gmv)],
        ["성장률", `${it.growth.toFixed(1)}%`], ["전환율", `${it.conversion.toFixed(1)}%`],
        ["리뷰 점수", it.review.toFixed(1)], ["광고 ROAS", `${it.adRoas.toFixed(1)}x`]
      ];
    },
    profileEyebrow: "Seller Profile",
    csvHeader: ["셀러", "카테고리", "GMV_백만원", "성장률_%", "헬스", "전환율_%", "리뷰", "광고ROAS", "리스크", "추천액션"],
    csvRow(it, d) { return [it.name, categoryLabel(it.category), it.gmv, it.growth, it.health, it.conversion, it.review, it.adRoas, d.riskLabels[it.risk], it.action]; },
    csvFile: "seller-growth-copilot-export.csv",
    template(it, tone) {
      const rootCause = it.conversion < 2.5
        ? "전환율이 카테고리 목표를 밑돌아 유입이 주문으로 충분히 이어지지 않고 있다"
        : it.adRoas < 2.5 ? "광고 효율이 낮아 캠페인 클러스터 정리가 필요하다"
          : "성장세가 양호해 확장 플레이를 테스트할 여력이 있다";
      const voice = { executive: "의사결정 포커스: 다음 컨설팅 콜은 측정 가능한 단일 개입에 집중합니다.", field: "현장 컨설턴트 포커스: 지표 변화를 먼저 제시한 뒤 셀러 측 제약을 확인하고 개선안을 제안합니다.", seller: "셀러 대상 포커스: 지지하는 어조로 이번 주에 테스트할 수 있는 변화를 제시합니다." }[tone];
      return `### ${it.name} 주간 셀러 브리프

**상황.** ${it.name}은(는) GMV ${fmtGmv(it.gmv)} 규모를 운영하며 최근 성장률 ${it.growth.toFixed(1)}%, 헬스 점수 ${it.health}/100을 기록하고 있습니다.

**진단.** 핵심 이슈는 ${rootCause}는 점입니다. 리뷰 점수는 ${it.review.toFixed(1)}/5, 광고 ROAS는 ${it.adRoas.toFixed(1)}x입니다.

**추천 액션.** ${it.action}.

**검증 지표.** 액션 수락 후 2주간 전환율·ROAS·리뷰 테마 변화를 추적합니다.

**어조 가드레일.** ${voice}`;
    },
    prompt(it, tone) {
      const toneKo = this.toneOptions[tone] || "임원 보고용";
      return `당신은 네이버쇼핑 셀러 컨설팅을 지원하는 비즈니스 애널리스트입니다.
아래 셀러 데이터를 바탕으로 한국어 주간 셀러 브리프를 작성하세요.

작성 규칙:
- 어조: ${toneKo}
- 형식: 마크다운. 첫 줄은 '### 제목', 이어서 **상황**, **진단**, **추천 액션**, **검증 지표**, **어조 가드레일** 5개 굵은 글씨 항목.
- 각 항목은 2~3문장 이내로 간결하게, 반드시 근거가 되는 지표를 인용할 것.
- 과장 없이 실무 컨설턴트가 바로 쓸 수 있는 톤으로.

셀러 데이터:
- 셀러명: ${it.name}
- 카테고리: ${categoryLabel(it.category)}
- GMV(백만원): ${it.gmv}
- 최근 성장률: ${it.growth}%
- 헬스 점수: ${it.health}/100
- 전환율: ${it.conversion}%
- 리뷰 점수: ${it.review}/5
- 광고 ROAS: ${it.adRoas}x
- 리스크 등급: ${this.riskLabels[it.risk]}
- 제안 액션 후보: ${it.action}`;
    }
  },

  creator: {
    mode: "creator",
    items: topics,
    riskLabels: { Hot: "기회", Watch: "주의", Late: "늦음" },
    riskColorOf: (r) => (r === "Hot" ? "var(--naver)" : r === "Watch" ? "var(--amber)" : "var(--red)"),
    primary: (it) => it.views,
    formatPrimary: fmtViews,
    scatterX: (it) => 100 - it.saturation,        // 포화도 낮을수록 오른쪽(기회)
    scatterY: (it) => Math.max(0, Math.min(1, it.growth / 45)), // 0~45% → 0~1
    bubbleSize: (it) => 34 + Math.min(it.views / 4, 48),
    priorityCompare: (a, b) => (b.opportunity - a.opportunity) || (b.growth - a.growth), // 기회 큰 주제 먼저
    funnelStages: ["데이터 검토", "아이디어 후보", "제작 대기", "게시 완료"],
    sql: topicSql,
    benchmarks: creatorBenchmarks,
    hypotheses: creatorHypotheses,
    tests: creatorTests,
    weights: creatorWeights,
    workflow: creatorWorkflow,
    toneOptions: { executive: "창작자 대상", field: "채널 매니저용", seller: "임원 보고용" },
    metrics: [["리포트 확인 시간", "5분 이내"], ["추천 수락률", "60% 이상"], ["추천 주제 제작률", "40% 이상"], ["기획 시간", "30% 단축"]],
    labels: {
      brandTitle: "클립 인사이트 코파일럿", brandSub: "클립 창작자 콘텐츠 인사이트 리포트 자동화",
      navItems: "주제", topEyebrow: "콘텐츠 인사이트 도구",
      sidebarNote: "트렌드 신호 분석, 주제 기회 맵, '이번 주 만들 것' 리포트 자동화, 창작자 검증, 데이터 로직을 하나의 산출물로 묶었습니다.",
      scatterTitle: "주제 기회 맵", scatterAxis: "가로축 = 낮은 포화도(오른쪽일수록 기회) · 세로축 = 성장 속도 · 크기 = 조회수",
      categoryBars: "카테고리별 조회수", funnelTitle: "콘텐츠 제작 파이프라인",
      itemTableTitle: "추천 후보 주제 / 포맷", itemHead: ["주제 / 포맷", "카테고리", "조회수", "성장속도", "상태", "상세"],
      reportTitle: "주간 창작자 브리프", reportItemLabel: "주제",
      benchmarkTitle: "창작자 분석 도구 비교", sqlTitle: "주제 기회 점수 산출 쿼리",
      sqlExplain: "각 주제의 최근 신호(조회수·시청완료·재생산·검색 유입·상품태그 전환)를 모아 <b>하나의 '기회 점수'</b>로 압축합니다. 단순 조회수 1위가 아니라 <b>성장 속도는 빠른데 아직 포화되지 않은 주제</b>일수록 점수가 높아져요 — 지금 들어가면 기회이기 때문입니다.",
      viewTitles: { dashboard: "클립 트렌드 인사이트 대시보드", sellers: "주제 우선순위 워크스페이스", report: "AI 창작자 리포트 생성기", research: "분석 도구 벤치마크 보드", sql: "데이터 로직 · SQL 스코어링", testing: "창작자 사용성 테스트 계획", flywheel: "커머스-콘텐츠 플라이휠" }
    },
    kpis(list) {
      const totalViews = list.reduce((s, x) => s + x.views, 0);
      const hotCount = list.filter((x) => x.risk === "Hot").length;
      return [
        ["주간 총 조회수", fmtViews(totalViews), "합성 데모 데이터"],
        ["평균 시청완료율", `${Math.round(avg(list, "completion"))}%`, "포맷 매력도 신호"],
        ["이번 주 추천 주제", `${hotCount}개`, "기회 점수 70+ 자동 노출"],
        ["기회 점수 평균", `${Math.round(avg(list, "opportunity"))}/100`, "성장×포화 종합"]
      ];
    },
    detail(it) {
      return [
        ["카테고리", categoryLabel(it.category)], ["주간 조회수", fmtViews(it.views)],
        ["성장 속도", `${it.growth.toFixed(1)}%`], ["시청완료율", `${it.completion}%`],
        ["검색 유입", `${it.searchIn}`], ["상품태그 전환", `${it.tagConv.toFixed(1)}%`]
      ];
    },
    profileEyebrow: "Topic Profile",
    csvHeader: ["주제", "카테고리", "조회수_천", "성장속도_%", "기회점수", "시청완료_%", "검색유입", "상품태그전환_%", "상태", "추천"],
    csvRow(it, d) { return [it.name, categoryLabel(it.category), it.views, it.growth, it.opportunity, it.completion, it.searchIn, it.tagConv, d.riskLabels[it.risk], it.action]; },
    csvFile: "clip-insight-copilot-export.csv",
    template(it, tone) {
      const why = it.completion >= 58
        ? "시청완료율이 높아 포맷 자체가 끝까지 보게 만든다"
        : it.searchIn >= 55 ? "검색 유입이 늘어 의도를 가진 시청자가 흘러들어오고 있다"
          : "재생산 지수가 높아 따라 만들기 좋은 포맷이다";
      const standing = it.risk === "Hot"
        ? "성장 속도는 빠른데 아직 포화되지 않아 지금 들어가면 기회입니다"
        : it.risk === "Watch" ? "성장 중이나 포화가 진행 중이라 차별화 각도가 필요합니다"
          : "이미 포화되어 일반 포맷으로는 늦었고 좁은 니치로 비틀어야 합니다";
      const voice = { executive: "창작자 대상 포커스: 바로 촬영할 수 있게 격려하는 어조로 제안합니다.", field: "채널 매니저 포커스: 카테고리 전략 관점에서 우선순위와 근거를 정리합니다.", seller: "임원 보고 포커스: 창작자 리텐션·커머스 연결 관점의 한 줄 시사점을 더합니다." }[tone];
      return `### ${it.name} 주간 창작자 브리프

**이번 주 기회.** '${it.name}'은(는) 성장 속도 ${it.growth.toFixed(1)}%, 기회 점수 ${it.opportunity}/100입니다. ${standing}.

**왜 떴나.** ${why}는 점입니다. 시청완료율 ${it.completion}%, 검색 유입 지수 ${it.searchIn}, 재생산 지수 ${it.remake}.

**바로 쓸 훅.** ${it.action}.

**커머스 연결.** 상품태그 전환 ${it.tagConv.toFixed(1)}% — 정보 태그를 붙이면 쇼핑 커넥트로 이어질 여지가 있습니다.

**어조 가드레일.** ${voice}`;
    },
    prompt(it, tone) {
      const toneKo = this.toneOptions[tone] || "창작자 대상";
      return `당신은 네이버 클립 창작자를 지원하는 콘텐츠 인사이트 애널리스트입니다.
아래 주제 데이터를 바탕으로 한국어 주간 창작자 브리프를 작성하세요.

작성 규칙:
- 어조: ${toneKo}
- 형식: 마크다운. 첫 줄은 '### 제목', 이어서 **이번 주 기회**, **왜 떴나**, **바로 쓸 훅**, **커머스 연결**, **어조 가드레일** 5개 굵은 글씨 항목.
- 각 항목은 2~3문장 이내로 간결하게, 반드시 근거가 되는 신호(성장 속도·포화도·시청완료·검색 유입·상품태그 전환)를 인용할 것.
- 단순 조회수 순위가 아니라 '지금 들어가면 기회인가'를 판단해 줄 것.

주제 데이터:
- 주제/포맷: ${it.name}
- 카테고리: ${categoryLabel(it.category)}
- 주간 조회수(천): ${it.views}
- 성장 속도: ${it.growth}%
- 포화도: ${it.saturation}/100
- 기회 점수: ${it.opportunity}/100
- 시청완료율: ${it.completion}%
- 재생산 지수: ${it.remake}
- 검색 유입 지수: ${it.searchIn}
- 상품태그 전환: ${it.tagConv}%
- 상태: ${this.riskLabels[it.risk]}
- 추천 훅 후보: ${it.action}`;
    }
  }
};

// NCP 스택 매핑 (플라이휠 화면)
const ncpMapping = [
  ["Media Intelligence", "영상 멀티모달 분석(객체·행동·대사) → '왜 떴나' 신호 추출", "2지망"],
  ["NCLUE", "쇼핑 인텐트·사용자 프로파일링 → 이 주제 시청자의 구매 의향", "1·2지망"],
  ["CLOVA Studio (HyperCLOVA X)", "Skill·RAG·튜닝으로 근거 연결된 브리프 자동 생성", "1·2지망"],
  ["AiTEMS", "추천 엔진 → 창작자·셀러별 맞춤 우선순위", "1·2지망"],
  ["Data Box", "고객 데이터 + 네이버 데이터 연동 분석 환경", "1·2지망"]
];

// ─────────────────────────────────────────────────────────────
// 4) 상태 + 공통 유틸
// ─────────────────────────────────────────────────────────────
const AI = { model: "gemini-2.0-flash", keyStore: "naver-copilot-gemini-key" };

const state = { mode: "seller", segment: "all", selectedId: sellers[1].id, view: "dashboard" };
let currentReportMarkdown = "";

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const avg = (list, key) => (list.length ? list.reduce((s, x) => s + x[key], 0) / list.length : 0);
const domain = () => DOMAINS[state.mode];

function filteredItems() {
  const d = domain();
  const query = ($("#sellerSearch")?.value || "").toLowerCase();
  return d.items.filter((it) => {
    const segMatch = state.segment === "all" || it.category === state.segment;
    const hay = `${it.name} ${categoryLabel(it.category)} ${it.category}`.toLowerCase();
    return segMatch && hay.includes(query);
  });
}

function selectedItem() {
  const d = domain();
  return d.items.find((x) => x.id === state.selectedId) || filteredItems()[0] || d.items[0];
}

// ─────────────────────────────────────────────────────────────
// 5) 렌더 (도메인 설정만 바꿔 끼우는 단일 엔진)
// ─────────────────────────────────────────────────────────────
function renderKpis() {
  $("#kpiGrid").innerHTML = domain().kpis(filteredItems()).map(([label, value, note]) => `
    <article class="kpi"><p>${label}</p><strong>${value}</strong><span>${note}</span></article>
  `).join("");
}

function renderScatter() {
  const d = domain();
  $("#scatterPlot").innerHTML = filteredItems().map((it) => {
    const x = 8 + (d.scatterX(it) / 100) * 84;
    const y = 12 + d.scatterY(it) * 76;
    const size = d.bubbleSize(it);
    return `<button class="bubble" style="left:${x}%; bottom:${y}%; --size:${size}px; background:${d.riskColorOf(it.risk)}" data-id="${it.id}" title="${it.name}">${it.id}</button>`;
  }).join("");
  $$(".bubble").forEach((b) => b.addEventListener("click", () => {
    state.selectedId = b.dataset.id;
    setView("sellers");
    renderItemRows(); renderItemDetail(); renderReportControls(); renderReport();
    focusDetail();
  }));
}

function renderActions() {
  const d = domain();
  const ranked = [...filteredItems()].sort(d.priorityCompare).slice(0, 4);
  $("#actionList").innerHTML = ranked.map((it) => `
    <article class="action-card"><b>${it.name}</b><p>${it.action}</p></article>
  `).join("");
}

function renderCategoryBars() {
  const d = domain();
  const totals = filteredItems().reduce((acc, it) => {
    acc[it.category] = (acc[it.category] || 0) + d.primary(it);
    return acc;
  }, {});
  const max = Math.max(...Object.values(totals), 1);
  $("#categoryBars").innerHTML = Object.entries(totals).sort((a, b) => b[1] - a[1]).map(([cat, val]) => `
    <div class="bar-row">
      <span>${categoryLabel(cat)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${(val / max) * 100}%"></div></div>
      <span>${d.formatPrimary(val)}</span>
    </div>
  `).join("");
}

function renderFunnel() {
  const d = domain();
  $("#funnel").innerHTML = d.funnelStages.map((stage) => {
    const count = filteredItems().filter((it) => it.stage === stage).length;
    return `<div class="funnel-step"><b>${count}</b><span>${stage}</span></div>`;
  }).join("");
}

function renderItemRows() {
  const d = domain();
  $("#sellerRows").innerHTML = filteredItems().map((it) => `
    <tr class="${it.id === state.selectedId ? "selected" : ""}">
      <td><b>${it.name}</b></td>
      <td>${categoryLabel(it.category)}</td>
      <td>${d.formatPrimary(d.primary(it))}</td>
      <td>${it.growth.toFixed(1)}%</td>
      <td style="color:${d.riskColorOf(it.risk)}"><b>${d.riskLabels[it.risk]}</b></td>
      <td><button class="mini-btn" data-id="${it.id}" type="button">상세</button></td>
    </tr>
  `).join("");
  $$("#sellerRows .mini-btn").forEach((btn) => btn.addEventListener("click", () => {
    state.selectedId = btn.dataset.id;
    renderItemRows(); renderItemDetail(); renderReportControls(); renderReport();
    focusDetail();
  }));
}

// 상세 패널로 시선 이동 — 화면 밖이면 스크롤해서 보여주고, 항상 살짝 강조해 '열렸다'는 신호를 줌.
function focusDetail() {
  const el = $("#sellerDetail");
  if (!el) return;
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const visible = r.top >= 0 && r.top < vh * 0.8;
  if (!visible) {
    try { el.scrollIntoView({ behavior: "smooth", block: "center" }); }
    catch (_) { el.scrollIntoView(); }
  }
  el.classList.remove("flash");
  void el.offsetWidth; // 리플로우로 애니메이션 재시작
  el.classList.add("flash");
}

function renderItemDetail() {
  const d = domain();
  const it = selectedItem();
  const rows = d.detail(it).map(([k, v]) => `<div class="detail-stat"><span>${k}</span><b>${v}</b></div>`).join("");
  $("#sellerDetail").innerHTML = `
    <p class="eyebrow">${d.profileEyebrow}</p>
    <h4>${it.name}</h4>
    <p>${it.action}</p>
    ${rows}
    <div class="detail-stat"><span>상태</span><b style="color:${d.riskColorOf(it.risk)}">${d.riskLabels[it.risk]}</b></div>
  `;
}

function inlineMd(t) { return t.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"); }
function mdToHtml(md) {
  return md.trim().split(/\n{2,}/).map((block) => {
    const h = block.match(/^#{1,4}\s+(.*)$/);
    if (h) return `<h4>${inlineMd(h[1])}</h4>`;
    return `<p>${inlineMd(block).replace(/\n/g, "<br>")}</p>`;
  }).join("");
}

function renderReportControls() {
  $("#reportSeller").innerHTML = domain().items.map((it) => `
    <option value="${it.id}" ${it.id === state.selectedId ? "selected" : ""}>${it.name}</option>
  `).join("");
}

function setReportSource(text, kind) {
  const el = $("#reportSource");
  if (!el) return;
  el.textContent = text;
  el.dataset.kind = kind || "template";
}

function renderReport() {
  const d = domain();
  const it = selectedItem();
  const tone = $("#reportTone")?.value || "executive";
  currentReportMarkdown = d.template(it, tone);
  $("#reportPreview").innerHTML = mdToHtml(currentReportMarkdown);
  setReportSource("템플릿 기반 (오프라인) · 대상/어조 변경 시 자동 갱신", "template");
}

// ---- Gemini ----
function getApiKey() { return localStorage.getItem(AI.keyStore) || ""; }

function refreshKeyStatus(message, stateName) {
  const el = $("#keyStatus");
  if (!el) return;
  if (message) { el.textContent = message; el.dataset.state = stateName || "warn"; return; }
  const has = !!getApiKey();
  el.textContent = has ? "키 저장됨 ✓" : "키 없음 · AI 생성 시 필요";
  el.dataset.state = has ? "ok" : "none";
}

async function generateWithGemini(it, tone) {
  const key = getApiKey();
  if (!key) throw new Error("NO_KEY");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${AI.model}:generateContent?key=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: domain().prompt(it, tone) }] }], generationConfig: { temperature: 0.6 } })
  });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try { const e = await res.json(); detail = e?.error?.message || detail; } catch (_) { /* ignore */ }
    throw new Error(detail);
  }
  const data = await res.json();
  const text = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("").trim();
  if (!text) throw new Error("빈 응답을 받았습니다.");
  return text;
}

async function handleGenerateAi() {
  const btn = $("#generateAiBtn");
  if (!getApiKey()) {
    refreshKeyStatus("먼저 Gemini API 키를 입력하고 저장하세요", "warn");
    $("#geminiKey")?.focus();
    return;
  }
  const it = selectedItem();
  const tone = $("#reportTone")?.value || "executive";
  const labelSpan = btn.querySelector("span");
  const originalLabel = labelSpan ? labelSpan.textContent : "";
  btn.disabled = true;
  if (labelSpan) labelSpan.textContent = "생성 중…";
  setReportSource("✨ Gemini 생성 중…", "loading");
  try {
    const text = await generateWithGemini(it, tone);
    currentReportMarkdown = text;
    $("#reportPreview").innerHTML = mdToHtml(text);
    setReportSource(`✨ Gemini로 생성됨 · ${AI.model}`, "ai");
  } catch (err) {
    const msg = err.message === "NO_KEY" ? "API 키가 필요합니다." : err.message;
    setReportSource(`⚠ 생성 실패: ${msg} · 템플릿으로 대체합니다.`, "error");
    renderReport();
  } finally {
    btn.disabled = false;
    if (labelSpan) labelSpan.textContent = originalLabel;
  }
}

function renderBenchmark() {
  $("#benchmarkGrid").innerHTML = domain().benchmarks.map((b) => `
    <article class="benchmark-card"><b>${b.name}</b><p>${b.note}</p></article>
  `).join("");
}

function renderHypotheses() {
  $("#hypothesisList").innerHTML = domain().hypotheses.map(([tag, text]) => `<p><b>${tag}</b> ${text}</p>`).join("");
}

function renderTesting() {
  $("#testGrid").innerHTML = domain().tests.map((t) => `
    <article class="test-card"><b>${t.task}</b><p>${t.method}</p><p><b>목표:</b> ${t.success}</p></article>
  `).join("");
}

function renderWeights() {
  $("#weightList").innerHTML = domain().weights.map(([k, v]) => `<p><span>${k}</span><b>${v}</b></p>`).join("");
}

function renderMetrics() {
  $("#metricStack").innerHTML = domain().metrics.map(([k, v]) => `<p><b>${k}</b><span>${v}</span></p>`).join("");
}

function renderWorkflow() {
  $("#workflowList").innerHTML = domain().workflow.map((step) => `<li>${step}</li>`).join("");
}

// ---- 플라이휠 (1지망 ↔ 2지망 연결) ----
const flywheelStages = [
  ["radio", "뜨는 클립 주제", "창작자가 데이터로 다음에 만들 주제를 고름"],
  ["tag", "정보 태그 부착", "쇼핑·플레이스 태그로 콘텐츠를 상품에 연결"],
  ["trending-up", "네이버쇼핑 수요 신호", "태그 클릭·전환이 카테고리 수요로 집계"],
  ["store", "셀러 기회 도출", "그 카테고리 셀러에게 '지금 밀 상품' 신호"],
  ["sparkles", "셀러·콘텐츠 성장", "성장한 셀러가 더 좋은 상품·협업으로 환류"]
];

function renderFlywheel() {
  $("#flywheelFlow").innerHTML = flywheelStages.map(([icon, title, desc], i) => `
    <div class="flow-step">
      <div class="flow-icon"><i data-lucide="${icon}"></i></div>
      <b>${title}</b><span>${desc}</span>
    </div>
    ${i < flywheelStages.length - 1 ? '<div class="flow-arrow"><i data-lucide="chevron-right"></i></div>' : ''}
  `).join("");

  // 카테고리별: 가장 뜨는 클립 주제 → 같은 카테고리 셀러 기회로 연결
  const cats = ["beauty", "fashion", "living", "grocery", "sports"];
  $("#flywheelLinks").innerHTML = cats.map((cat) => {
    const topTopic = [...topics].filter((t) => t.category === cat).sort((a, b) => b.opportunity - a.opportunity)[0];
    if (!topTopic) return "";
    const catSellers = sellers.filter((s) => s.category === cat).sort((a, b) => a.health - b.health).slice(0, 2);
    const sellerTxt = catSellers.map((s) => `${s.name}(${DOMAINS.seller.riskLabels[s.risk]})`).join(", ") || "—";
    return `
      <div class="link-row">
        <span class="cat-chip">${categoryLabel(cat)}</span>
        <div class="link-topic"><b>${topTopic.name}</b><span>성장 ${topTopic.growth.toFixed(0)}% · 태그전환 ${topTopic.tagConv.toFixed(1)}%</span></div>
        <i data-lucide="arrow-right" class="link-arrow"></i>
        <div class="link-seller"><b>${sellerTxt}</b><span>이 수요를 받을 셀러 우선순위</span></div>
      </div>`;
  }).join("");

  $("#engineMap").innerHTML = [
    ["수집", "셀러 성과 테이블", "주제 신호(조회·완료·검색)"],
    ["점수화", "기회 점수(저성과=시급)", "기회 점수(고성장·저포화)"],
    ["근거", "지표 변화 요약", "'왜 떴나' 신호 요약"],
    ["AI 브리프", "주간 셀러 브리프", "이번 주 만들 주제 3"],
    ["검증", "액션 수락률", "추천 주제 제작률"]
  ].map(([step, s, c]) => `
    <div class="engine-row">
      <span class="engine-step">${step}</span>
      <div class="engine-pair"><span class="tag-seller">셀러</span> ${s}</div>
      <div class="engine-pair"><span class="tag-creator">창작자</span> ${c}</div>
    </div>
  `).join("");

  $("#ncpGrid").innerHTML = ncpMapping.map(([name, use, scope]) => `
    <article class="ncp-card">
      <div class="ncp-head"><b>${name}</b><span class="scope">${scope}</span></div>
      <p>${use}</p>
    </article>
  `).join("");
}

// ─────────────────────────────────────────────────────────────
// 6) 뷰 전환 + 라벨 적용 + CSV + 모드 토글
// ─────────────────────────────────────────────────────────────
function setView(view) {
  state.view = view;
  $$(".view").forEach((s) => s.classList.toggle("active", s.id === view));
  $$(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  $("#viewTitle").textContent = domain().labels.viewTitles[view] || "";
}

function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
function setHtml(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }

function applyDomainLabels() {
  const L = domain().labels;
  setText("brandTitle", L.brandTitle);
  setText("brandSub", L.brandSub);
  setText("navItemsLabel", L.navItems);
  setText("topEyebrow", L.topEyebrow);
  setText("sidebarNote", L.sidebarNote);
  setText("scatterTitle", L.scatterTitle);
  setText("scatterAxisNote", L.scatterAxis);
  setText("categoryBarsTitle", L.categoryBars);
  setText("funnelTitle", L.funnelTitle);
  setText("itemTableTitle", L.itemTableTitle);
  setHtml("itemHead", L.itemHead.map((h) => `<th>${h}</th>`).join(""));
  setText("reportTitle", L.reportTitle);
  setText("reportItemLabel", L.reportItemLabel);
  setText("benchmarkTitle", L.benchmarkTitle);
  setText("sqlTitle", L.sqlTitle);
  setHtml("sqlExplain", L.sqlExplain);
  // 어조 옵션 라벨
  const toneSel = $("#reportTone");
  if (toneSel) {
    const opts = domain().toneOptions;
    Array.from(toneSel.options).forEach((o) => { if (opts[o.value]) o.textContent = opts[o.value]; });
  }
  setText("viewTitle", domain().labels.viewTitles[state.view] || "");
}

function exportCsv() {
  const d = domain();
  const rows = filteredItems().map((it) => d.csvRow(it, d));
  const csv = [d.csvHeader, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = d.csvFile;
  link.click();
  URL.revokeObjectURL(url);
}

function setMode(mode) {
  if (!DOMAINS[mode] || mode === state.mode) return;
  state.mode = mode;
  state.segment = "all";
  state.selectedId = DOMAINS[mode].items[1]?.id || DOMAINS[mode].items[0].id;
  const seg = $("#segmentFilter"); if (seg) seg.value = "all";
  const search = $("#sellerSearch"); if (search) search.value = "";
  $$(".mode-btn").forEach((b) => {
    const on = b.dataset.mode === mode;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", on ? "true" : "false");
  });
  document.body.dataset.mode = mode;
  applyDomainLabels();
  renderAll();
}

function renderAll() {
  $("#sqlBlock").textContent = domain().sql;
  renderKpis();
  renderScatter();
  renderActions();
  renderCategoryBars();
  renderFunnel();
  renderItemRows();
  renderItemDetail();
  renderReportControls();
  renderReport();
  renderBenchmark();
  renderHypotheses();
  renderTesting();
  renderWeights();
  renderMetrics();
  renderWorkflow();
  renderFlywheel();
  if (window.lucide) window.lucide.createIcons();
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.dataset.mode = state.mode;
  $$(".mode-btn").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  $$(".nav-item").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));

  $("#segmentFilter").addEventListener("change", (e) => { state.segment = e.target.value; renderAll(); });
  $("#sellerSearch").addEventListener("input", renderItemRows);
  $("#reportSeller").addEventListener("change", (e) => {
    state.selectedId = e.target.value;
    renderItemRows(); renderItemDetail(); renderReport();
  });
  $("#reportTone").addEventListener("change", renderReport);
  $("#exportCsvBtn").addEventListener("click", exportCsv);

  $("#saveKeyBtn")?.addEventListener("click", () => {
    const input = $("#geminiKey");
    const value = (input?.value || "").trim();
    if (value) localStorage.setItem(AI.keyStore, value);
    else localStorage.removeItem(AI.keyStore);
    if (input) input.value = "";
    refreshKeyStatus();
  });
  $("#geminiKey")?.addEventListener("keydown", (e) => { if (e.key === "Enter") $("#saveKeyBtn")?.click(); });
  $("#generateAiBtn")?.addEventListener("click", handleGenerateAi);

  $("#copyReportBtn").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(currentReportMarkdown || domain().template(selectedItem(), $("#reportTone").value)); } catch (_) { /* no clipboard */ }
  });
  $("#copySqlBtn").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(domain().sql); } catch (_) { /* no clipboard */ }
  });

  applyDomainLabels();
  refreshKeyStatus();
  renderAll();
});
