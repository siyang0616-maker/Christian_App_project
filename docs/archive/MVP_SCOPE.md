# Donghaeng Room MVP Scope

## 1. 범위 결정 원칙

1주 MVP는 기능 수를 늘리는 프로젝트가 아니다. 리더가 다음 주에도 다시 쓰고 싶은지 검증하는 프로젝트다.

우선순위:

1. Daily check-in
2. Prayer request cards
3. “I prayed” reaction
4. Leader dashboard
5. Invite code

## 2. 4-Role Scope Review

### Developer

- 중요: 구현 범위가 작아야 RLS, 타입, 서버 액션, 배포를 안전하게 유지할 수 있다.
- 위험: 채팅, 알림, 파일 업로드가 들어오면 비용과 권한 모델이 급격히 복잡해진다.
- 지금 구축: Supabase Auth, 프로필, 그룹, 멤버십, 체크인, 기도제목, 반응, 리더 조회.
- 보류: 실시간 구독, 저장소, 백그라운드 잡, 외부 API.

### Entrepreneur

- 중요: 베타에서 확인할 것은 “리더 재사용 의향”이다.
- 위험: 주간 요약, 커스텀 항목, 결제를 너무 빨리 넣으면 학습보다 기능 설명이 많아진다.
- 지금 구축: 리더가 멤버 흐름과 기도제목을 기억하는 최소 루프.
- 보류: 유료 플랜, 부서 단위 운영, 고급 리포트.

### Web Designer

- 중요: 모바일에서 한 화면씩 이해되고, 입력 부담이 낮아야 한다.
- 위험: 대시보드가 어둡거나 촘촘하면 관리 시스템처럼 보인다.
- 지금 구축: 카드 기반 레이아웃, 큰 버튼, 짧은 입력, 공개 범위 표시.
- 보류: 복잡한 차트, 필터, 설정 화면, 다단계 온보딩.

### Marketer

- 중요: 카톡보다 좋은 이유를 “기억되는 기도제목”으로 분명히 말한다.
- 위험: “교회 관리 솔루션”처럼 보이면 초기 리더 도입이 느려진다.
- 지금 구축: 소그룹 리더가 바로 설명할 수 있는 초대 메시지와 베타 문구.
- 보류: 큰 교회 대상 영업 메시지, 가격표, 고급 플랜 소개.

## 3. Build Now

- 이메일 기반 Auth
- 이름 중심 Profile setup
- Create group
- Join by invite code
- Daily check-in
- Prayer request cards
- “기도했어요” reaction
- Leader dashboard
- 모바일-first UI
- Supabase RLS
- Vercel deployment readiness

## 4. Defer

- Weekly summary
- Custom check-in items
- Multiple groups per leader UX
- Department-level reporting
- Export
- Advanced analytics
- Kakao social login for Korean beta onboarding
- Paid plan screen
- Push notifications

## 5. Remove From MVP

- Full chat
- AI features
- Payment
- Bible content database
- File uploads
- Profile image uploads
- Native iOS/Android app
- Church-wide admin system
- Ranking, scoring, guilt-based gamification

## 6. MVP Acceptance Criteria

- 멤버가 가입 후 프로필을 만들 수 있다.
- 리더가 동행방을 만들고 초대코드를 공유할 수 있다.
- 멤버가 초대코드로 동행방에 참여할 수 있다.
- 멤버가 오늘 체크인을 남기거나 수정할 수 있다.
- 멤버가 기도제목 카드를 남길 수 있다.
- 공개 범위가 UI와 RLS 양쪽에서 반영된다.
- 멤버가 “기도했어요” 반응을 남길 수 있다.
- 리더가 최근 체크인, 조용한 멤버, 기도제목 흐름을 볼 수 있다.
- 모든 package scripts는 macOS Terminal과 Windows PowerShell에서 실행 가능하다.
