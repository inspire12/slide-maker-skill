# CS Cardnews Cycle 1 Execution (2026-05-13)

## Scope For This Cycle

- Deliverable target: `slides/cs_cardnews_001_cache_stampede.md` first shippable draft
- Audience: junior-to-mid backend engineers who operate event-driven traffic spikes
- Goal: explain cache stampede risk in one short narrative and provide immediately actionable 대응 체크리스트
- Out of scope (next cycle): visual asset selection, HTML export polish, narrative board review feedback 반영

## Story Arc

1. 문제 공감: "트래픽 급증 + 동시 만료" 상황 인식
2. 개념 정의: cache stampede를 운영 장애 관점으로 설명
3. 위험 흐름: 장애 전파 단계를 간결하게 연결
4. 대응 전략: jitter / single flight / SWR 3축 제시
5. 실행 마감: 관측 지표 + 배포 전 체크리스트 제공

## Per-Slide Planning Cards

### Slide 1: 트래픽이 몰릴 때 DB보다 먼저 무너지는 건 설계다
- purpose: 캐시를 성능보다 안정성 관점으로 재정의
- key message: 캐시는 장애 방어선이다
- source material: 실무 이벤트 트래픽 패턴
- visual: 없음
- layout: basic
- visual budget: 낮음
- speaker note: 문제 정의를 짧고 강하게
- review focus: 도입 문구의 강도

### Slide 2: 30초 상황 재현
- purpose: 실제 운영 맥락에서 상황 상상 가능하게 만들기
- key message: 동시 만료가 DB 폭주를 만든다
- source material: 예시 수치(40x)
- visual: 없음
- layout: basic
- visual budget: 낮음
- speaker note: 숫자는 예시임을 명시
- review focus: 수치 현실성

### Slide 3: 이 현상의 이름
- purpose: 용어 정렬
- key message: cache stampede = 동시 재계산 폭주
- source material: 캐시 미스 동작 모델
- visual: 없음
- layout: basic
- visual budget: 낮음
- speaker note: 용어는 1회만 강조
- review focus: 정의 표현 난이도

### Slide 4: 장애 전파 5단계
- purpose: 원인-결과 구조를 단계로 고정
- key message: 만료 설계 실패는 연쇄 장애로 번진다
- source material: 운영 장애 흐름
- visual: 없음
- layout: timeline
- visual budget: 중간
- speaker note: 단계별 지표 매칭 설명
- review focus: 단계 수(5단계) 적절성

### Slide 5: 메시지 강조
- purpose: 핵심 주장 고정
- key message: 캐시는 장애 방어선이다
- source material: slide 1/4 요약
- visual: 없음
- layout: keyword
- visual budget: 낮음
- speaker note: 템포 조절 구간
- review focus: 키워드 문장 유지 여부

### Slide 6: 실패 패턴 3가지
- purpose: 실수 포인트를 재발 방지 목록으로 제시
- key message: TTL/재시도/warm-up 부재가 위험
- source material: 운영 안티패턴
- visual: 없음
- layout: basic
- visual budget: 낮음
- speaker note: 비난보다 회고 톤 유지
- review focus: 항목 누락 여부

### Slide 7-9: 대응 3축 (Jitter / Single Flight / SWR)
- purpose: 즉시 적용 가능한 대응책 제시
- key message: 동시성 제어 + 완충 전략이 핵심
- source material: 캐시 안정화 패턴
- visual: 없음
- layout: basic
- visual budget: 낮음
- speaker note: 구현보다 운영 효과 중심
- review focus: 기술 난이도 균형

### Slide 10: 운영 지표 최소 세트
- purpose: 대응책의 관측 가능성 확보
- key message: 개선은 지표 없이 검증할 수 없다
- source material: cache/db/latency 핵심 메트릭
- visual: 없음
- layout: basic
- visual budget: 낮음
- speaker note: 알람 임계치 논의로 연결
- review focus: 지표 우선순위

### Slide 11: 이벤트 전 10분 점검
- purpose: 행동 가능한 마감 체크리스트 제공
- key message: 배포 전 점검으로 장애 확률을 낮춘다
- source material: 운영 점검 루틴
- visual: 없음
- layout: basic
- visual budget: 낮음
- speaker note: 실제 체크리스트로 재사용 가능
- review focus: 체크리스트 항목 실효성

### Slide 12: 한 줄 요약
- purpose: 기억에 남는 종료
- key message: 만료 설계 실패는 장애 예약이다
- source material: 전체 요약
- visual: 없음
- layout: keyword
- visual budget: 낮음
- speaker note: 다음 편 주제 teaser
- review focus: 문구 확정

## Verification For This Cycle

- Markdown source updated: `slides/cs_cardnews_001_cache_stampede.md`
- Structural sanity: chapter/slide separators and speaker notes retained
- Deployment build compatibility: `bash scripts/build-pages.sh` should pass (existing HTML outputs unaffected by markdown-only edit)

## Next Action

1. Export this markdown into `slides/cs_cardnews_001_cache_stampede.html`
2. Run board narrative review and capture feedback memo
3. Apply approved edits, then rebuild `_site/` for publish readiness
