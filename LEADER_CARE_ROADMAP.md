# 동행방 — 리더 케어 강화 로드맵 (오늘 진행용)

## 배경

지금 화면은 "오늘 상태"(체크인)와 "리더보드"(우선순위 정렬) 2개뿐이다.
실제로 리더가 필요한 건 3가지 차원인데, 지금 전부 비어있다:

1. 리더가 먼저 연락했는데 멤버가 응답이 없는 경우 — 안 보임
2. 멤버가 글에서 비관적/심각한 신호를 보였을 때 mood 체크박스를 넘어서 눈에 띄는가 — 약함
3. 한 멤버가 시간이 지나며 어떻게 변해왔는지 — 전혀 없음

mood 기반 위험 신호(`hard`, `need_prayer`)는 이미 최우선순위로 처리되고 있다.
이건 그대로 두고 건드리지 않는다.

오늘은 이 순서로 진행한다: 티켓 A(컨택 로그) → 티켓 B(키워드 신호) → 티켓 C(타임라인)
각 티켓은 독립적으로 동작해야 하고, 앞 티켓이 끝나야 다음을 시작한다.

---

## 티켓 A — 컨택 로그 (리더가 먼저 보낸 연락에 응답이 없는 경우 표시)

### 목표
리더가 Care Thread로 먼저 메시지를 보냈는데, 멤버가 N일 이상 응답이 없으면
멤버 행에 "응답 없음" 표시가 뜬다. 지금 있는 "답장 필요"(멤버→리더 응답 대기)와는
반대 방향이다.

### 데이터 (새 테이블 없음, 기존 care_messages 재사용)
`care_messages`는 이미 `sender_id`, `thread_owner_id`, `created_at`을 갖고 있다.
한 멤버(`thread_owner_id`)의 최근 메시지들 중 마지막 발신자가:
- 리더(`sender_id != thread_owner_id`)이고
- 그 마지막 메시지로부터 3일 이상 지났는데 멤버가 후속 메시지를 안 보냈으면
→ "리더 연락에 응답 없음" 상태

### 구현 범위
`lib/data/leader-care-board.ts`에 함수 추가:

```typescript
function buildContactWaitingStatus(
  threadMessages: CareMessageWithSender[],
  currentUserId: string,
  today: Date,
): { isWaitingOnMember: boolean; daysSinceLeaderContact: number | null } {
  if (threadMessages.length === 0) {
    return { isWaitingOnMember: false, daysSinceLeaderContact: null };
  }
  const last = threadMessages[threadMessages.length - 1];
  const leaderSentLast = last.sender_id === currentUserId;
  if (!leaderSentLast) {
    return { isWaitingOnMember: false, daysSinceLeaderContact: null };
  }
  const days = Math.floor(
    (today.getTime() - new Date(last.created_at).getTime()) / (1000 * 60 * 60 * 24),
  );
  return { isWaitingOnMember: days >= 3, daysSinceLeaderContact: days };
}
```

`LeaderMemberCareSummary` 타입에 `isWaitingOnMember: boolean`,
`daysSinceLeaderContact: number | null` 필드 추가.

`buildMemberPriorityRank`에 새 분기 추가 (mood 위험신호 바로 다음 순위):

```typescript
if (latestCheckIn?.mood === "hard" || latestCheckIn?.mood === "need_prayer") {
  return 1;
}
if (isWaitingOnMember && daysSinceLeaderContact !== null && daysSinceLeaderContact >= 3) {
  return 1.5; // mood 위험보다는 낮고, 체크인 누락보다는 높음
}
```
(다른 return 값들의 정수 순서를 깨지 않도록 1.5처럼 사이값을 쓰거나,
전체 숫자를 1,2,3,4,5,6으로 한 칸씩 밀어도 된다 — 코덱스가 일관되게 적용)

### UI
`MemberStatusRow`에 기존 "답장 필요" 배지 옆에 다른 색(주황 계열)으로
"D+{daysSinceLeaderContact} 응답 없음" 배지 추가. 두 배지가 동시에 뜨지는 않는다
(한 스레드에서 마지막 발신자는 한쪽뿐이므로 자연히 배타적).

### Acceptance Criteria
- 리더가 메시지 보내고 3일 안 지났으면 배지 없음
- 3일 지나고 멤버 응답 없으면 "D+3 응답 없음" 표시
- 멤버가 응답하면 배지 사라지고 기존 "답장 필요"로 전환
- lint/typecheck/build 통과

---

## 티켓 B — 키워드 신호 감지 (멤버 텍스트에서 위험 신호 1차 필터링)

### 중요한 제약
이건 진단이 아니다. AI도 아니다. 단순 키워드 매칭으로 "리더가 놓칠 수 있는
문장을 눈에 띄게" 하는 것뿐이다. 절대 "위험도 점수"나 "심각도 %" 같은
수치화된 평가를 보여주지 않는다. 그냥 "이 글에 살펴볼 표현이 있어요" 정도의
중립적 알림이다. 멤버 본인에게는 이 표시가 보이지 않는다 (리더만 본다).

### 구현 범위
`lib/care-signals.ts` 새 파일:

```typescript
const CARE_SIGNAL_KEYWORDS = [
  "힘들어",
  "힘들다",
  "지쳤",
  "포기",
  "그만두고 싶",
  "혼자",
  "무너질",
  "사라지고 싶",
  "버겁",
];

export function hasCareSignal(text: string | null | undefined): boolean {
  if (!text) return false;
  return CARE_SIGNAL_KEYWORDS.some((keyword) => text.includes(keyword));
}
```

체크인 노트(`note`), 기도제목 본문, Care Thread 멤버 메시지 본문에
`hasCareSignal()`을 적용해서 `LeaderMemberCareSummary`에
`hasTextCareSignal: boolean` 필드 추가.

`buildMemberPriorityRank`에서 mood 위험신호와 같은 최우선 순위로 처리:
```typescript
if (
  latestCheckIn?.mood === "hard" ||
  latestCheckIn?.mood === "need_prayer" ||
  hasTextCareSignal
) {
  return 1;
}
```

### UI
멤버 행에 작은 회색 점이나 텍스트 아이콘으로 "살펴볼 표현이 있어요" 정도의
절제된 표시만. 빨간색이나 경고 아이콘처럼 과하게 자극적인 디자인 금지.
펼치면 그 표현이 포함된 원문(체크인 노트 또는 메시지)이 그대로 보임 —
리더가 직접 읽고 판단하게, 앱이 대신 판단하지 않는다.

### Acceptance Criteria
- 키워드 목록에 있는 단어가 포함된 텍스트가 있으면 표시됨
- 표시는 절제된 디자인 (경고색 남발 금지)
- 멤버 본인 화면에는 이 표시가 절대 노출되지 않음 (RLS와 무관, UI 레벨에서 확실히 분리)
- lint/typecheck/build 통과

---

## 티켓 C — 멤버 성장 타임라인 (시간축 뷰)

### 목표
리더가 한 멤버를 펼쳤을 때 "최근 4주 리듬 그리드"를 본다.
멤버 본인도 자기 화면에서 같은 형태(평가적 표현 제외)로 본다.

### 데이터 (새 테이블 없음)
`checkins` 테이블에서 최근 28일치를 `user_id`로 가져와서
`checkin_date` 기준으로 28칸 배열을 만든다 (체크인 없으면 빈 칸).

`lib/data/member-timeline.ts` 새 파일:
```typescript
export type TimelineDay = {
  date: string;
  hasCheckIn: boolean;
  mood: Mood | null;
  bibleRead: boolean;
  prayed: boolean;
  attended: boolean;
};

export async function getMemberTimeline(
  supabase: SupabaseClient,
  userId: string,
  groupId: string,
): Promise<TimelineDay[]> {
  // 최근 28일 checkins 조회 후 날짜별 28칸 배열로 변환
  // 데이터 없는 날은 hasCheckIn: false로 채움
}
```

### UI
`components/member-timeline-grid.tsx` 새 컴포넌트:
- 28개 작은 정사각형 그리드 (7x4, 요일별 줄바꿈)
- 체크인 있으면 색칠, 없으면 빈 칸
- mood가 hard/need_prayer면 그 칸만 다른 색
- 호버/탭하면 그 날짜의 상세(리듬 항목) 텍스트로 표시

리더 쪽: `leader-care-board.tsx`의 멤버 행 펼친 영역에 추가
멤버 쪽: 본인 체크인 화면 상단에 추가 (평가 문구 없이 순수 기록만)

### Acceptance Criteria
- 28칸 그리드가 실제 checkins 데이터와 일치
- 체크인 없는 날은 빈 칸으로 정확히 표시 (데이터 조작/추측 없음)
- 멤버 화면에는 케어 우선순위 같은 평가 문구 없음
- lint/typecheck/build 통과

---

## 코덱스에게 줄 프롬프트 (이 문서를 첨부하고 그대로 사용)

```
이 문서(LEADER_CARE_ROADMAP.md)의 티켓 A, B, C를 순서대로 구현한다.
디자인 판단을 새로 하지 말고 문서에 적힌 그대로 따른다.
한 티켓이 끝나야 다음 티켓을 시작한다. 끝났다고 말하기 전에
반드시 다음을 실행하고 raw 출력을 그대로 보여줘라:

corepack pnpm lint
corepack pnpm typecheck
corepack pnpm build

티켓 하나가 끝나면:
1. docs/WORKLOG.md에 "## 2026-06-23" 아래 한 줄 추가
   (예: "- Ticket A: contact-waiting badge added.")
2. git add -A && git commit -m "<티켓 이름>"
3. git push origin main 시도 (실패하면 에러 그대로 보여주고 다음 티켓 계속 진행,
   push 실패가 작업을 막지 않게 한다)
4. 다음 티켓 시작 전 "티켓 X 완료, 다음 티켓 Y로 진행합니다"라고 명시

티켓 B(키워드 감지)는 특히 주의: 절대 "위험도 점수", "심각도 %",
숫자로 된 평가를 만들지 마라. 키워드 매칭 결과는 boolean(있다/없다)으로만
다루고, UI에는 절제된 텍스트 표시만 한다. 멤버 본인 화면에는 이 표시가
어떤 경로로도 노출되면 안 된다 — 이 부분은 구현 후 직접 멤버 계정으로
로그인해서 눈으로 확인하고 보고해라.

3개 티켓이 다 끝나면 최종 보고:
| 티켓 | 변경 파일 | lint/typecheck/build | WORKLOG 기록 |
|---|---|---|---|
```
