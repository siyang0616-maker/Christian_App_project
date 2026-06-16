# Donghaeng Room / 동행방

동행방은 소그룹을 위한 말씀·기도 체크인 MVP입니다. 카카오톡을 대체하는 채팅 앱이 아니라, 체크인과 기도제목이 흘러가지 않도록 기록하는 모바일 웹 앱입니다.

## MVP Features

- Supabase Auth 기반 이메일 로그인
- 프로필 설정
- 동행방 생성 및 초대코드 참여
- 오늘의 체크인
- 기도제목 카드와 공개 범위
- "기도했어요" 반응
- 리더 돌봄 보드

## Setup

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Apply the SQL files in `supabase/migrations` in filename order before testing auth and data flows.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

All scripts use package commands only and avoid OS-specific shell commands.
