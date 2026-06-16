# Donghaeng Room Database Plan

## 1. Database Goal

기도제목과 체크인은 민감 정보다. MVP 데이터베이스는 기능보다 먼저 개인정보 보호를 보장해야 한다. 모든 접근 제한은 Supabase RLS로 강제하며 UI 조건문만 신뢰하지 않는다.

## 2. 4-Role Database Review

### Developer

- 중요: 스키마가 작고 읽기 쉬워야 하며 RLS 함수가 명확해야 한다.
- 위험: 멤버십, 공개 범위, 리더 권한을 앱 코드에서만 처리하면 데이터가 노출될 수 있다.
- 지금 구축: profiles, groups, group_members, checkins, prayers, prayer_reactions.
- 보류: audit log, analytics table, file storage, push token table, payment table.

### Entrepreneur

- 중요: 현재 스키마는 3~5개 베타 그룹 테스트에 충분해야 한다.
- 위험: 교회 전체 조직 구조를 미리 넣으면 검증 전에 복잡도가 커진다.
- 지금 구축: 소그룹 하나의 반복 사용 검증에 필요한 데이터.
- 보류: church, department, subscription, billing, export 구조.

### Web Designer

- 중요: 공개 범위 옵션이 데이터 모델에 직접 있어야 사용자가 안전함을 느낀다.
- 위험: 익명 UI만 만들고 DB에 author가 그대로 노출되면 신뢰가 깨진다.
- 지금 구축: checkin_visibility, prayer_visibility enum과 visibility 컬럼.
- 보류: 복잡한 익명 프로필, 닉네임 시스템.

### Marketer

- 중요: 데이터 모델은 포지셔닝을 뒷받침해야 한다. 메시지가 아니라 기록이 남아야 한다.
- 위험: chat_messages 같은 구조가 생기면 “카톡 대체”로 오해된다.
- 지금 구축: 카드와 체크인 중심 구조.
- 보류: 채팅 메시지, 댓글 스레드, 콘텐츠 라이브러리.

## 3. Tables

### profiles

사용자 표시 이름 저장.

- `id`: auth.users 참조
- `display_name`: 앱 내 표시 이름
- `created_at`, `updated_at`

### groups

동행방 기본 정보.

- `id`
- `name`
- `invite_code`
- `created_by`
- `created_at`

### group_members

그룹 멤버십과 역할.

- `group_id`
- `user_id`
- `role`: `leader` 또는 `member`
- `joined_at`

### checkins

하루 체크인.

- `group_id`
- `user_id`
- `checkin_date`
- `mood`: `good`, `normal`, `hard`, `need_prayer`
- `woke_up`
- `bible_read`
- `prayed`
- `meditated`
- `attended`
- `note`
- `visibility`: `private`, `leader`, `group`

제약:

- 같은 그룹/사용자/날짜에는 하나만 저장한다.
- note는 240자 이하.

### prayers

기도제목 카드.

- `group_id`
- `user_id`
- `content`
- `visibility`: `private`, `leader`, `group`, `anonymous`
- `created_at`, `updated_at`

제약:

- content는 1~500자.

### prayer_reactions

“기도했어요” 반응.

- `prayer_id`
- `user_id`
- `created_at`

제약:

- 같은 사용자는 같은 기도제목에 한 번만 반응.

## 4. RLS Helper Functions

- `is_group_member(group_id)`: 현재 사용자가 그룹 멤버인지 확인.
- `is_group_leader(group_id)`: 현재 사용자가 그룹 리더인지 확인.
- `is_group_creator(group_id)`: 현재 사용자가 그룹 생성자인지 확인.
- `can_view_prayer(prayer_request)`: 기도제목 공개 범위 확인.
- `can_view_checkin(checkin)`: 체크인 공개 범위 확인.
- `join_group_by_code(invite_code)`: 초대코드로 그룹 참여.

초대코드 참여는 RPC로 처리한다. 일반 select 정책으로 모든 사용자가 그룹을 검색할 수 있게 만들지 않는다.

## 5. Visibility Rules

### private

- 작성자만 볼 수 있다.

### leader

- 작성자와 그룹 리더만 볼 수 있다.

### group

- 그룹 멤버 전체가 볼 수 있다.

### anonymous

- 그룹 멤버 전체가 볼 수 있다.
- UI에서는 작성자 이름을 숨긴다.
- MVP에서는 기도제목에만 사용한다.

## 6. Deployment Notes

- Supabase SQL editor에서 `supabase/migrations/001_initial_schema.sql`을 먼저 적용한다.
- 앱에는 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`만 설정한다.
- service_role key는 클라이언트, 서버 액션, Vercel env에 넣지 않는다.
- Vercel Hobby와 Supabase Free Plan을 기준으로 운영한다.

## 7. Future Database Changes Deferred

- weekly_summaries
- custom_checkin_items
- churches
- departments
- subscriptions
- payment_events
- push_tokens
- file_uploads
- chat_messages
