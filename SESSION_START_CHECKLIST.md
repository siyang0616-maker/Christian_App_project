# SESSION_START_CHECKLIST.md

이 프로젝트는 윈도우(사무실)와 맥(자택)을 번갈아 가며 작업한다.
코덱스는 작업을 시작하는 모든 새 세션에서, 단 한 줄의 코드도 건드리기 전에
이 체크리스트를 순서대로 실행한다. 건너뛰지 않는다.

## 1. 지금 어느 OS인지 먼저 밝힌다

다음을 실행해서 결과를 보여줘라:

Windows (PowerShell):
  $PSVersionTable.OS
  pwd

macOS/Linux:
  uname -a
  pwd

보고 형식: "지금 [Windows/macOS]에서 작업합니다. 작업 디렉토리: [경로]"

## 2. git 동기화 상태를 먼저 맞춘다

다음을 순서대로 실행하고 raw 출력을 그대로 보여줘라:

  git fetch origin
  git status
  git log --oneline -3

판단 기준:
- "Your branch is up to date with 'origin/main'" 이고
  git log의 최상단 커밋이 origin/main과 같다 → 정상, 3번으로 진행
- "Your branch is ahead of 'origin/main'" → 이전 세션(다른 OS)에서
  push가 안 된 채 끝났다는 뜻. 멈추고 다음을 보고하고 사용자 지시를 기다려라:
  "이전 세션에서 push되지 않은 로컬 커밋이 있습니다. 지금 push할까요,
  아니면 그대로 두고 진행할까요?"
- "Your branch and 'origin/main' have diverged" → 충돌 위험 상태.
  절대 임의로 merge/rebase/reset 하지 마라. 멈추고 정확히 보고하고
  사용자 지시를 기다려라.
- working tree가 clean하지 않다 (수정된 파일이 있다) → 그 파일 목록을
  보여주고, 의도적으로 진행 중이던 작업인지 사용자에게 확인 받아라.

## 3. 필요한 CLI 도구가 이 OS에 있는지 확인한다

아래 표의 명령어를 실행해서 설치 여부를 보여줘라. 없는 도구가 있어도
계속 진행하되, "이 세션에서는 X 작업을 할 수 없습니다"라고 미리 알려라.

| 도구 | 확인 명령어 | 없을 때 Windows 설치 안내 | 없을 때 macOS 설치 안내 |
|---|---|---|---|
| GitHub CLI | gh --version | winget install GitHub.cli | brew install gh |
| Supabase CLI | supabase --version | scoop install supabase | brew install supabase/tap/supabase |
| Node/pnpm | corepack pnpm --version | (Node.js 설치 후 corepack enable) | (Node.js 설치 후 corepack enable) |

**절대 OS에 안 맞는 설치 명령어를 안내하지 마라**
(예: Windows에서 brew install, macOS에서 winget install).
1번에서 확인한 OS에 맞는 명령어만 골라서 안내한다.

## 4. 이 프로젝트의 필수 참조 문서가 실제로 존재하는지 확인한다

  ls docs/
  ls LEADER_CARE_ROADMAP.md CARE_THREAD_V0_SPEC.md 2>/dev/null

이번 세션 작업 지시에 특정 스펙 문서(예: LEADER_CARE_ROADMAP.md)가
언급되어 있는데 파일이 없으면, 추측해서 구현하지 말고 즉시 멈추고
"[파일명]이 프로젝트 루트에 없습니다. 이 파일을 받아야 진행할 수
있습니다"라고 보고해라. 이전 세션 메모리나 채팅 기록에 있던 내용을
재구성해서 쓰지 마라 — 파일로 직접 받은 원문만 사용한다.

## 5. .env.local 존재 여부만 확인 (값은 절대 출력하지 않음)

  Windows: Test-Path .env.local
  macOS:   test -f .env.local && echo "exists" || echo "missing"

없으면 "이 OS의 .env.local이 없습니다. 환경변수 설정이 필요합니다"라고
보고하고 멈춰라. 다른 OS에 있던 .env.local 내용을 추측하거나
재생성하지 마라.

## 6. 위 5단계가 전부 끝난 뒤에만 실제 작업 지시를 수행한다

5단계 중 하나라도 "멈추고 보고" 상태가 나오면, 그 보고만 하고
사용자의 다음 지시를 기다린다. 같은 메시지 안에 있는 다른 작업
지시로 넘어가지 마라.

---

## 세션 종료 시 (작업을 끝내고 다른 OS로 넘어가기 전)

다음을 반드시 실행하고 결과를 보여줘라:

  git status
  git add -A
  git commit -m "<작업 내용>"  (커밋할 변경사항이 있을 때만)
  git push origin main

push가 실패하면 (인증 문제 등) 그 사실을 명확히 보고해라.
"다음 세션(다른 OS)에서 git fetch/status를 먼저 실행하면 이 상태가
자동으로 감지됩니다"라고 사용자에게 알려줘라.

docs/WORKLOG.md에 다음 형식으로 한 줄을 반드시 추가해라:

  - [OS명] <한 일 요약> (push: 성공/실패)

예시: "- [Windows] Ticket A 컨택 로그 구현 완료 (push: 성공)"
