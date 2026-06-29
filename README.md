문서 체계 진입점: [00_GUIDE.md](./00_GUIDE.md)

# Product North Star

The goal is not to build a big Christian app.
The goal is to make one small group leader say:

> "I want to use this again next week."

# Donghaeng Room / 동행방

동행방은 소그룹을 위한 말씀·기도 체크인 MVP입니다. 카카오톡을 대체하는 채팅 앱이 아니라, 체크인과 기도제목이 흘러가지 않도록 함께 기억하는 모바일 웹 앱입니다.

핵심 문장:

> 카톡에 흘러가는 기도제목을, 함께 기억하는 기록으로.

## Product Boundaries

Donghaeng Room should not try to beat larger products at what they already do best.

- Do not compete with KakaoTalk on real-time chat.
- Do not compete with Naver BAND on general group boards.
- Do not compete with YouVersion on Bible content.
- Do not compete with Hallow, Glorify, or Pray.com on devotional media.
- Do not compete with Planning Center or Church Center on full church administration.

Focus only on:

1. Daily small group faith check-in
2. Prayer request cards with visibility controls
3. "I prayed" reaction and prayer memory
4. Care-oriented leader dashboard
5. Lightweight Korean small group workflow

## 현재 구현 범위

- Supabase Auth 기반 이메일 회원가입/로그인
- 프로필 이름 설정
- 동행방 생성 및 초대코드 참여
- 오늘의 신앙 리듬 체크인
- 기도제목 카드 작성
- 공개 범위: 나만 보기, 리더와 나, 소그룹 전체, 익명 기도제목
- "기도했어요" 반응
- 리더 돌봄 보드
- Supabase Postgres/RLS 마이그레이션
- 모바일-first Next.js App Router UI

## 기술 스택

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, RLS
- pnpm via Corepack

## 로컬 실행

```bash
corepack enable
corepack pnpm install
corepack pnpm dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 환경 변수

`.env.example`을 `.env.local`로 복사한 뒤 값을 입력합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
```

주의:

- `.env.local`은 GitHub에 올리지 않습니다.
- Supabase `service_role` key는 앱 환경 변수에 넣지 않습니다.
- MVP에서는 anon key만 사용합니다.

## Supabase 설정

Supabase SQL Editor에서 아래 파일을 파일명 순서대로 적용합니다.

```text
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_daily_checkin_fields.sql
supabase/migrations/003_answered_prayers.sql
```

마이그레이션에는 테이블, enum, helper function, RLS policy가 포함되어 있습니다.

## 검증 명령

```bash
corepack pnpm verify
```

GitHub에 올리기 전 `lint`, `typecheck`, `build`가 순서대로 통과하는지 확인합니다.

## 문서

- [Mac Mini Handoff](MAC_MINI_HANDOFF.md)
- [PRD](docs/PRD.md)
- [MVP Scope](docs/MVP_SCOPE.md)
- [User Flow](docs/USER_FLOW.md)
- [Database Plan](docs/DATABASE_PLAN.md)
- [Privacy Rules](docs/PRIVACY_RULES.md)
- [Beta Test Guide](docs/BETA_TEST_GUIDE.md)
- [Beta Deployment](docs/BETA_DEPLOYMENT.md)
- [Competitor Differentiation](docs/COMPETITOR_DIFFERENTIATION.md)
- [Cross-Platform Setup](docs/CROSS_PLATFORM_SETUP.md)
- [Project Status](docs/PROJECT_STATUS.md)

## MVP에서 제외한 것

- 실시간 채팅
- AI 기능
- 결제
- 성경 콘텐츠 DB
- 푸시 알림
- 파일 업로드
- 네이티브 앱
- 교회 전체 관리자 기능
- 순위, 점수, 스트릭
