# 03_CURRENT_STATE.md — 지금 실제로 있는 것 (살아있는 문서, 매 작업 후 갱신)

마지막 갱신: 2026-06-28 (Ticket D 완료 시점 기준, GitHub main 직접 확인)

이 문서는 "계획"이 아니라 "검증된 현재 상태"만 적는다.
계획/다음 할 일은 `tickets/` 폴더에 별도로 둔다.

## 핵심 흐름 (구현 완료, 검증 완료)

1. 회원가입/로그인 → 초대코드 보존(`returnTo`) → 프로필 생성 → 그룹 가입
   - `getSafeInternalPath`로 외부 URL 차단 검증됨
   - `create_group_with_leader` RPC로 그룹+리더 멤버십 원자적 생성
   - 마이그레이션: 001~006
2. 체크인 (오늘 리듬: 말씀/기도/묵상/예배, mood, 한 줄 나눔)
3. 기도제목 (공개 범위: communal/personal, "기도했어요" 반응)
4. 리더 케어보드 (`/leader`) — 멤버 목록을 `priorityRank`로 정렬
   - mood가 hard/need_prayer면 최우선 (`priorityRank: 1`)
   - 20명까지 한 화면, 그 이상은 "더 보기"로 접힘 (`VISIBLE_MEMBER_SUMMARY_COUNT`)

## Care Thread v0 (완료, 검증 완료 — 2026-06-23)

- 마이그레이션: `007_care_messages.sql`
- 체크인/기도제목에 매달린 비동기 댓글. 채팅이 아님 (읽음표시/실시간/
  알림 없음 — 01_NORTH_STAR.md 금지 목록과 일치).
- 컴포넌트: `components/care-thread.tsx`
- 서버 액션: `lib/actions/care-messages.ts`
- 멤버 체크인 카드, 리더 멤버 행 양쪽에 인라인 통합됨
- RLS: 멤버는 자기 스레드만, 리더는 그룹 전체 (검증됨)

## Ticket A — 컨택 로그 (완료, 검증 완료 — 2026-06-24)

리더가 먼저 Care Thread로 연락했는데 멤버가 3일 이상 응답이 없으면
"D+N 응답 없음" 배지 표시. `lib/data/leader-care-board.ts`의
`buildContactWaitingStatus`. 새 테이블 없음, 기존 `care_messages` 재사용.

## Ticket B — 키워드 신호 감지 (완료, 검증 완료 — 2026-06-24)

`lib/care-signals.ts`의 `hasCareSignal()`. 체크인 노트/기도제목/Care
Thread 멤버 메시지에 미리 정한 키워드가 있으면 boolean 플래그만 세움
(수치 점수 없음 — 02_PRODUCT_PRINCIPLES.md 원칙 준수).
리더 화면에만 절제된 표시로 노출, 멤버 화면에는 어떤 경로로도 노출
안 되는 것이 실제 테스트 계정으로 검증됨 (4가지 조합 표로 확인됨).

## Ticket C — 멤버 성장 타임라인 (완료, 검증 완료 — 2026-06-24)

`components/member-timeline-grid.tsx`, `lib/data/member-timeline.ts`.
최근 28일 체크인을 그리드로 표시. 새 테이블 없음, 기존 `checkins`
재구성. 리더 케어보드 멤버 행과 멤버 본인 화면 양쪽에 통합.
실제 데이터와 그리드 일치 여부 검증됨.

## Ticket D — 리더보드 관계 우선 재배치 (완료, 검증 완료 — 2026-06-28)

- 커밋: `feat: prioritize relationship context in leader care rows`
- `components/leader-care-board.tsx`의 `RelationshipStatusHeader` 함수.
  펼친 영역 맨 위에 항상 "관계 한 줄" 표시 — 4가지 분기 전부 스펙대로 구현됨:
  1. 대화 없음 → "아직 OO님과 나눈 대화가 없어요. 먼저 인사를 건네볼까요?"
  2. 멤버가 먼저 말 걸고 응답 대기 중 → 최우선 표시
  3. 리더가 먼저 보내고 멤버 응답 없음(D+N) → 재촉 없는 톤
  4. 정상적으로 대화가 이어지는 중 → "최근까지 잘 이어지고 있어요"
- 순서 재배치 완료: 관계 헤더 → 대화 스레드 → 보낼 문장 → 리듬 상세 → 타임라인
  (이전엔 리듬 체크리스트가 먼저, 대화 기록이 조건부로 맨 마지막)
- 좌측 보더 색상(`border-l-4`)으로 우선순위 시각 구분 추가, 새 색상 체계
  없이 기존 `careBadgeTone` 매핑 재사용
- typecheck 직접 실행하여 통과 확인 (Claude 검증, 2026-06-28)

## 진행 예정 — 없음 (A/B/C/D 전부 완료)

다음 우선순위는 크리스님과 논의 후 결정 (아래 "다음 후보" 참고).

## 보류 (북극성 문서의 금지 목록과 일치, 지금 단계에서 손대지 않음)

- BAND 보고문 생성기 — 크리스님이 명시적으로 "나중, 안 해도 무관"이라고
  결정함 (2026-06-24). 리더보드 품질이 먼저.
- 실시간 채팅, 푸시 알림, 파일 업로드, 결제 — 01_NORTH_STAR.md 금지 목록

## 알아둘 것 (반복된 운영 이슈)

- 윈도우/맥을 번갈아 작업하므로 매 세션 `SESSION_START_CHECKLIST.md`
  필수 실행. git fetch/status로 동기화 확인 전엔 코드 작업 시작 금지.
- GitHub push 인증(`gh`)이 OS마다 따로 설정되어 있어야 함. 미설치 시
  멈추고 보고, 추측해서 우회하지 않음.
- "완료" 보고는 항상 명령어 raw 출력 또는 실제 클릭 검증 기준으로만
  인정. 텍스트 요약 보고는 별도로 검증 전까지 신뢰하지 않음.
- `MAC_MINI_HANDOFF.md`가 프로젝트 루트에 있는데 2026-06-16 시점
  내용 그대로이고 Care Thread 이후 작업이 전혀 반영 안 됨. 이 파일도
  `00_GUIDE.md`의 archive 대상에 포함시켜야 함 (확인 필요, 아래 참고).
- `MAC_MINI_HANDOFF.md`에 적힌 Supabase project ref가
  `vguvxpvysodugauaxfxz`인데, 최근 검증 세션에서 확인한 ref는
  `lxcbaakedhvwganfwkec`로 서로 다름. 두 프로젝트 중 어느 것이 지금
  실제로 쓰이는 DB인지 다음 세션에서 반드시 먼저 확인해야 함 — 잘못된
  프로젝트에 마이그레이션을 실행하지 않도록 주의.

## 다음 후보 (아직 결정 안 됨, 04_DECISION_LOG.md에 결정 기록 후 착수)

- Ticket B 키워드 목록 재검토 (실제 충분한지/과한지)
- A/B/C/D 통합 베타 테스트 (개별로는 검증됐으나 한 화면에 다 같이
  떴을 때 레이아웃이 깨지지 않는지는 아직 미확인)
- BAND 보고문 생성기 (크리스님 결정으로 후순위, 안 해도 무관)
