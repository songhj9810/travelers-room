# 여행자의 방

조건에 맞는 숙소를 찾아 위시리스트에 담고 리뷰를 남길 수 있는 제주 여행자를 위한 게스트하우스 탐색 플랫폼입니다.

## 주요 기능

- **인증**: 이메일/OAuth(구글·카카오) 로그인, 회원가입, 비밀번호 재설정
- **검색**: 키워드·인원·지역·가격·편의시설(주차/파티) 조건으로 게스트하우스 검색, 목록/지도 뷰 전환
- **게스트하우스 상세**: 이미지 캐러셀, 방 정보, 위치(지도), 리뷰
- **위시리스트**: 위시리스트 생성·수정·삭제, 게스트하우스 찜하기/옮기기
- **리뷰**: 이미지 첨부가 가능한 리뷰 작성·수정·삭제, 페이지네이션
- **마이페이지**: 프로필(닉네임·아바타) 수정, 내가 작성한 리뷰 조회
- **공유**: 링크 복사, 카카오톡 공유

## 기술 스택

| 구분        | 기술                                    |
| ----------- | --------------------------------------- |
| Framework   | Next.js (App Router), React, TypeScript |
| 스타일링    | Tailwind CSS, shadcn/ui                 |
| 상태 관리   | Zustand, TanStack Query                 |
| 폼 / 검증   | React Hook Form, Zod                    |
| 백엔드      | Supabase (Postgres, Auth, Storage)      |
| 지도 / 공유 | 네이버 지도 API, 카카오 공유 API        |

## 아키텍처

[Feature-Sliced Design](https://feature-sliced.design/)을 응용한 레이어 구조를 사용합니다.

```
app/                 # Next.js 라우팅 전용 (실제 구현은 src/views에 위치)
src/
├── app/             # 전역 프로바이더 (QueryProvider, ThemeProvider 등)
├── views/           # 페이지 단위 UI
├── widgets/         # 여러 feature/entity를 조합한 독립 UI 블록
├── features/        # 사용자 인터랙션 단위 기능 (인증, 검색, 위시리스트 등)
├── entities/        # 도메인 모델과 조회 로직 (게스트하우스, 리뷰, 프로필 등)
└── shared/          # 공통 UI 컴포넌트, API 클라이언트, 유틸, 설정
```

각 레이어는 `index.ts`를 통해 공개 API만 노출하며, 상위 레이어는 하위 레이어만 참조할 수 있습니다.

## 시작하기

먼저 `.env.example`을 참고하여 `.env.local` 파일을 생성합니다.

```bash
pnpm install
pnpm dev
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.
