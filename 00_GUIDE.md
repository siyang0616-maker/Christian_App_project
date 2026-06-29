# 00_GUIDE.md — 동행방 문서 체계 (Single Source of Truth)

이 문서는 모든 세션(코덱스, Claude, 사람)이 작업을 시작하기 전에
가장 먼저 읽는다. 목적은 "이번엔 뭘 시킬까"를 매번 새로 정하는 게
아니라, 이미 합의된 방향 안에서만 움직이게 고정하는 것이다.

지금까지 31개 넘는 docs 파일이 쌓였고, 그중 다수가 서로 다른 시점의
내용을 담고 있다 (예: PRD.md와 MVP_SCOPE.md는 6/16 시점 그대로,
Care Thread/컨택 로그/키워드 신호/성장 타임라인이 전혀 반영 안 됨).
이 문제를 막기 위해 문서를 4단계 계층으로 재편한다.

## 읽는 순서

### 0단계 — 항상 먼저 (이 문서 + 세션 체크리스트)
- `00_GUIDE.md` (이 문서)
- `SESSION_START_CHECKLIST.md` — OS 확인, git 동기화, 도구 확인

### 1단계 — 변하지 않는 원칙 (분기마다 한 번 정도만 갱신)
- `01_NORTH_STAR.md` — 제품이 풀려는 문제와 하지 않을 것
- `02_PRODUCT_PRINCIPLES.md` — 기능을 더할지 말지 판단하는 기준

### 2단계 — 지금 살아있는 현황 (매 작업 후 갱신)
- `03_CURRENT_STATE.md` — 지금 만들어진 것, 검증된 것, 안 된 것
- `04_DECISION_LOG.md` — 왜 이렇게 결정했는지의 누적 기록 (추가만, 수정 안 함)

### 3단계 — 지금 당장 할 일 (작업 단위로 생성, 끝나면 보관)
- `tickets/` 폴더 안의 개별 티켓 파일들

## 원칙 (첨부 패턴에서 가져온 것)

1. **전면 재작성 금지.** 새 방향이 떠올라도 기존 핵심 흐름
   (체크인 → 기도제목 → Care Thread → 리더 케어보드)을 갈아엎지 않는다.
2. **기존 핵심 기능 유지.** 새 티켓은 기존 기능을 대체하지 않고 위에 쌓는다.
3. **흔적 제거.** 옛 방향(예: PRD.md의 "1주 MVP" 시절 보류 목록)이 새
   문서와 충돌하면, 옛 문서는 archive로 옮기고 새 문서가 유일한 진실이 된다.
4. **하나의 디자인 톤으로 통일.** 새 컴포넌트도 기존 leaf/clay/blue
   톤 체계만 쓴다. 화면마다 다른 색 체계를 만들지 않는다.
5. **검증 없이 "완료" 없음.** 모든 티켓은 실제 클릭 검증 또는 명령어
   raw 출력으로만 완료 처리한다 (이건 이미 SESSION_START_CHECKLIST.md와
   연결되어 있다).

## 지금 이 시점에서 해야 할 정리 작업

다음 옛 문서들은 Care Thread 이후 내용이 반영되지 않은 상태다.
`archive/` 폴더로 옮기고, 그 내용 중 여전히 유효한 부분만
`03_CURRENT_STATE.md`로 옮긴다 (아래 "마이그레이션 티켓" 참고):

- docs/PRD.md → archive 대상 (내용은 03_CURRENT_STATE.md로 흡수)
- docs/MVP_SCOPE.md → archive 대상
- docs/PROJECT_STATE.md → archive 대상 (역할이 03_CURRENT_STATE.md와 중복)
- docs/PROJECT_STATUS.md → archive 대상 (PROJECT_STATE.md와 중복, 둘 중
  최신 정보만 살리고 하나로 합침)
- docs/CURRENT_SPRINT.md → archive 대상 (역할이 BACKLOG.md와 중복)
- MAC_MINI_HANDOFF.md → archive 대상 (2026-06-16 시점, Care Thread
  이후 작업 전혀 반영 안 됨. 단, archive 전에 Supabase project ref가
  03_CURRENT_STATE.md에 기록된 ref와 일치하는지 반드시 먼저 확인하고
  결과를 사용자에게 보고할 것 — 다른 ref가 적혀 있으면 어느 게 실제
  운영 중인 DB인지 확인 전까지 추측하지 않는다)

다음은 그대로 유지한다 (역할이 분명하고 중복이 없음):
- docs/WORKLOG.md — 일별 작업 로그, 계속 누적
- docs/RISK_REGISTER.md — 보안/권한 관련 위험 기록
- docs/QA_CHECKLIST.md — 베타 검증 체크리스트
- docs/BETA_*.md 전체 — 베타 운영 관련, 역할 분명함
- docs/PRIVACY_RULES.md — RLS/권한 원칙

## 코덱스/Claude가 매 세션 지켜야 할 것

작업을 시작할 때:
1. `00_GUIDE.md`(이 문서), `01_NORTH_STAR.md`, `03_CURRENT_STATE.md`를
   먼저 읽는다.
2. 지시받은 작업이 `02_PRODUCT_PRINCIPLES.md`의 기준에 맞는지 확인한다.
   안 맞으면 구현하지 말고 사용자에게 그 불일치를 먼저 보고한다.
3. 작업 중 새로운 제품 방향 판단이 필요하면(예: "이 기능을 채팅으로
   만들지 댓글로 만들지") `04_DECISION_LOG.md`에 이미 그 판단이 있는지
   먼저 찾아본다. 있으면 그 결정을 따른다. 없으면 사용자에게 묻는다.

작업이 끝났을 때:
1. `03_CURRENT_STATE.md`를 갱신한다 (새로 만들어진 것, 검증된 것 추가).
2. 제품 방향에 영향을 주는 결정을 내렸다면 `04_DECISION_LOG.md`에
   한 항목을 추가한다 (기존 항목은 수정하지 않고 추가만 한다).
3. `tickets/` 안의 해당 티켓 파일을 `tickets/done/`으로 옮긴다.
