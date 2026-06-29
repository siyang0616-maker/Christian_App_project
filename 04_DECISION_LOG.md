# 04_DECISION_LOG.md — 의사결정 기록 (추가만, 기존 항목 수정 금지)

이 문서는 "왜 이렇게 정했는지"를 시간순으로 누적한다.
새 결정이 옛 결정과 충돌하면, 옛 항목을 지우지 않고 "(2026-06-24 변경:
...)" 같은 후속 항목을 추가해서 변경 이력을 남긴다.

---

## 2026-06-16 — 1주 MVP 범위 고정
체크인, 기도제목, "기도했어요" 반응, 리더 대시보드, 초대코드로 범위를
좁힌다. 실시간 채팅/알림/AI/결제는 전부 보류.
(현재도 유효: 01_NORTH_STAR.md 금지 목록과 일치)

## 2026-06-21~22 — UI 반복 재작업의 위험성 확인
디자인을 검증 없이 여러 날 연속 재작업하는 패턴이 발견됨. 실사용자
스모크 테스트 없이 디자인만 갈아엎는 것은 금지. 모든 디자인 변경은
구체적 acceptance criteria가 있어야 함.
(02_PRODUCT_PRINCIPLES.md "디자인 판단 기준"으로 고정됨)

## 2026-06-22 — Care Thread를 "채팅"이 아니라 "댓글"로 정의
멤버-리더 소통을 풀 채팅으로 만들자는 제안(코덱스/GPT 양쪽에서 나옴)을
거절. 이유: 실시간/알림/모더레이션 인프라가 필요해지고, "기록으로
남는다"는 핵심 차별점이 사라짐. 대신 체크인/기도제목에 매달리는
append-only 비동기 댓글로 정의. RLS: 멤버는 자기 스레드만, 리더는
그룹 전체.
(01_NORTH_STAR.md 핵심 정의로 고정됨, 변경하지 않음)

## 2026-06-23 — 검증 기준을 "보고"가 아니라 "명령어 출력"으로 강제
코덱스가 실제로 안 한 작업을 "완료"라고 보고한 사례가 반복됨
(WORKLOG 미기록, git push 미실행 등). 이후 모든 완료 보고는 git/build
명령어의 raw 출력을 직접 보여주는 것으로만 인정.
(02_PRODUCT_PRINCIPLES.md "검증 기준"으로 고정됨)

## 2026-06-24 — 키워드 신호는 boolean만, 수치 평가 금지
"멤버가 비관적/심각한 반응을 보일 때 놓치지 않게 해달라"는 요청에서,
위험도 점수나 %로 수치화하지 않고 boolean(있다/없다) + 리더가 원문을
직접 읽는 방식으로 한정. 이유: 수치화된 평가는 진단처럼 보이고,
앱이 사람 대신 판단하는 것은 01_NORTH_STAR.md의 금지 목록("AI 자동
진단")과 충돌함.
(01_NORTH_STAR.md, 02_PRODUCT_PRINCIPLES.md에 고정됨)

## 2026-06-24 — BAND 보고문 생성기를 후순위로 미룸
크리스님 결정: 목사님이나 교회 상황에 따라 보고 형태가 자주 바뀌므로,
보고문 생성기는 지금 만들어도 안 만들어도 무방한 작업. 대신 리더보드
자체의 품질(관계 우선 재배치, Ticket D)을 먼저 진행.
(03_CURRENT_STATE.md "보류" 목록에 반영됨)

## 2026-06-24 — 리더보드를 "체크리스트 우선"에서 "관계 우선"으로 재배치
기존 리더보드는 펼친 영역에서 리듬 체크리스트가 먼저, 대화 기록이
조건부로 맨 마지막에만 나옴 (대화가 없으면 그 영역이 통째로 안 보임).
이걸 "관계 한 줄 헤더"가 항상 맨 위에 보이도록 재배치 (Ticket D).
새 기능이 아니라 기존 데이터의 재배치/빈 상태 명시화 작업으로 한정.
(상세: tickets/D_leader_care_redesign.md)

## 2026-06-28 — Ticket D 완료 확인 (GitHub 직접 검증)
커밋 `feat: prioritize relationship context in leader care rows`가 main에
반영됨을 GitHub에서 직접 확인. 코드가 스펙(tickets/D_leader_care_redesign.md)
과 정확히 일치 — `RelationshipStatusHeader` 함수명, 4가지 분기 문구,
순서 재배치, 보더 색상까지. typecheck 통과 확인.
동시에 `MAC_MINI_HANDOFF.md`(2026-06-16 시점, 옛 Supabase ref 포함)가
새 문서 체계와 별도로 프로젝트 루트에 남아있는 것을 발견. 이 파일도
archive 대상에 추가하고, Supabase project ref 불일치(vguvxpvysodugauaxfxz
vs lxcbaakedhvwganfwkec)를 다음 세션에서 우선 확인하도록 03_CURRENT_STATE.md
에 기록.

## 2026-06-24 — 문서 체계를 4단계 계층으로 재편
31개 넘는 docs 파일이 쌓였고, PRD.md/MVP_SCOPE.md/PROJECT_STATE.md/
PROJECT_STATUS.md/CURRENT_SPRINT.md가 서로 다른 시점의 내용을 담은 채
중복되어 있었음(Care Thread 이후 기능이 반영 안 됨). 00_GUIDE.md를
진입점으로 하는 4단계 체계(원칙/현황/결정로그/티켓)로 재편하고, 옛
문서는 archive로 이동.
(이 변경 자체가 00_GUIDE.md에 반영됨)

## 2026-06-29 — Supabase ref 재확인 후 MAC_MINI_HANDOFF archive 허용
`.env.local`의 Supabase project ref와 `MAC_MINI_HANDOFF.md`에 적힌 ref가
모두 `vguvxpvysodugauaxfxz`로 일치함을 확인. 이전 결정 로그에 남아 있던
ref 불일치 우려는 현재 파일 기준으로 재현되지 않았으므로, 오래된
`MAC_MINI_HANDOFF.md`는 00_GUIDE.md의 지시에 따라 archive 대상으로 처리.
