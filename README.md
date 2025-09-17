
<br/>

## 🍳 스토리픽스

### AI와 함께하는 영어 동화 학습

<div>우리 아이에게 다채로운 목소리로 동화를 구연하고 <br /> 질문에 답해주는 AI 동화 서비스를 선물하세요</div>

## 💻 서비스 소개

### 서비스 화면

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/eb132f9f-2f91-48f6-bc85-634b9356cff5" width="200" height="400"/><br>
      <span>랜딩 페이지</span>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/2c8f60e1-1386-411c-9824-90491e94aab8" width="200" height="400"/><br>
      <span>리스트 페이지</span>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/72a0ec93-7be7-4110-b706-656172f9b227" width="200" height="400"/><br>
      <span>구독 페이지</span>
    </td>
  </tr>
</table>


<br/><br/>

### 동화 구연

유저가 플레이어 화면을 터치하여 재생 컨트롤러 버튼을 열어, 재생/일시정지, 문장/페이지 이동, 재생 속도, ai 응답 언어 설정을 할 수 있습니다.

https://github.com/user-attachments/assets/9bb5b289-be50-4c64-b598-8305052c9d4b

<br/><br/>

### AI 질문하기

유저가 질문하기 버튼을 클릭하여 일정 횟수 ai에게 동화 관련 질문 및 영어 질문을 할 수 있습니다.

https://github.com/user-attachments/assets/c1ca5bd1-8060-4db3-942b-eb7fac40d63e

<br/><br/>

## 🔨 기술 스택

<div style="display: flex;">
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/zustand-orange?style=for-the-badge&logo=zustand&logoColor=white">
<img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</div>

<br/><br/>

## ⌨️ 개발 내용

### OpenAI Realtime API를 활용한 WebRTC 기반 실시간 음성 질의응답 시스템 구축

OpenAI Realtime API와 클라이언트 간의 WebRTC 통신으로 실시간 음성 질의응답 시스템을 구축했습니다. 클라이언트가 음성으로 질문하면 AI가 낮은 지연속도로 음성 답변을 제공합니다.
<br/>

### 동화 구연 서비스 제공

백엔드 서버로부터 동화 데이터(음성, 이미지, 텍스트)를 페이지네이션으로 받아오고, 이 동화 데이터를 유저에게 제공합니다. 유저가 플레이어 화면을 터치하여 재생 컨트롤러 버튼을 열어, 재생/일시정지, 문장/페이지 이동, 재생 속도 설정, ai 응답 언어 설정을 할 수 있습니다.
<br/>

### OAuth 2.0 기반 카카오 로그인 서비스 연동 및 인증 시스템 구축

카카오 로그인 API를 활용하여 유저의 카카오 계정을 통해 로그인 및 회원가입을 할 수 있도록 구현했습니다. 또한, 액세스 토큰 및 리프레쉬 토큰을 활용하여 로그인 상태를 유지하고, next.js middleware에서 인증 로직을 구현하여 로그인을 한 유저만이 동화 구연 서비스를 이용할 수 있도록 구현했습니다.
<br/>

### 레몬스퀴지 구독 결제 시스템 구현

lemon.js를 임베드 하여 구독 결제 시스템을 구현했습니다. 유저가 구독을 신청하면, 결제 정보를 입력하고 결제를 완료하면, 구독이 완료되고, 유저는 구독 서비스를 이용할 수 있습니다.
<br/>


## 폴더구조

```
📦 src                       
 ┣ 📂 animation             # 애니메이션 관련 JSON
 ┃ ┣ 📜 AISpeak.json       
 ┃ ┗ 📜 userSpeak.json     
 ┣ 📂 app                  
 ┃ ┣ 📂 (service)          
 ┃ ┃ ┣ 📂 account         # 계정 관련 페이지
 ┃ ┃ ┃ ┗ 📜 page.tsx      
 ┃ ┃ ┣ 📂 list            # 리스트 페이지
 ┃ ┃ ┃ ┗ 📜 page.tsx      
 ┃ ┃ ┣ 📂 subscribe       # 구독 관련 페이지
 ┃ ┃ ┃ ┗ 📜 page.tsx      
 ┃ ┃ ┗ 📜 layout.tsx      # 서비스 공통 레이아웃(gnb)
 ┃ ┣ 📂 lib                # API 요청 및 유틸리티 라이브러리
 ┃ ┃ ┗ 📜 apiClient.ts    # Axios 관련
 ┃ ┣ 📂 services           # API 호출 및 비즈니스 로직 처리 서비스
 ┃ ┃ ┣ 📜 aiService.ts    # AI 관련 API 요청 처리
 ┃ ┃ ┣ 📜 taleService.ts  # 동화 관련 API 요청 처리
 ┃ ┃ ┗ 📜 userService.ts  # 사용자 관련 API 요청 처리
 ┃ ┣ 📂 store              # Zustand 상태 관리 스토어
 ┃ ┃ ┣ 📜 modalStore.ts   # 모달 상태 관리
 ┃ ┃ ┣ 📜 playerStore.ts  # 플레이어 상태 관리
 ┃ ┃ ┣ 📜 realtimeAPIStore.ts # realtimeAPI 관련 상태 관리
 ┃ ┃ ┣ 📜 userStore.ts    # 사용자 상태 관리
 ┃ ┃ ┗ 📜 webRTCStore.ts  # WebRTC 관련 상태 관리
 ┃ ┣ 📂 tale               
 ┃ ┃ ┗ 📜 page.tsx        # player 페이지
 ┃ ┣ 📜 apple-icon.png     # 애플 아이콘
 ┃ ┣ 📜 favicon.ico        # 웹사이트 파비콘
 ┃ ┣ 📜 globals.css        # 전역 스타일 파일
 ┃ ┣ 📜 layout.tsx         # 앱 전체 레이아웃/ 폰트, gtag 
 ┃ ┗ 📜 page.tsx           # 루트 페이지- 사용 x /  웹플로우로 대체
 ┣ 📂 components            # UI 컴포넌트 모음
 ┃ ┣ 📂 HOC                # 고차 컴포넌트
 ┃ ┃ ┗ 📜 withAuth.tsx    # 인증이 필요한 페이지를 감싸는 HOC - 사용 x middleware.ts에서 인증하는 것으로 변경
 ┃ ┣ 📂 accountModal       # 계정 관련 모달 컴포넌트 모음
 ┃ ┃ ┣ 📜 accountDeletionModal.tsx  # 계정 삭제 확인 모달
 ┃ ┃ ┣ 📜 accountInfo.tsx  # 계정 정보 표시 모달
 ┃ ┃ ┣ 📜 logoutModal.tsx  # 로그아웃 확인 모달
 ┃ ┃ ┗ 📜 reSubscribeModal.tsx # 재구독 모달
 ┃ ┣ 📂 aiModalComponents  # AI 모달 내부 요소
 ┃ ┃ ┣ 📜 aiButtonContainer.tsx # AI 버튼 컨테이너
 ┃ ┃ ┣ 📜 aiThinking.tsx   # AI 생각 중 컴포넌트
 ┃ ┃ ┣ 📜 cancelQuestion.tsx # 질문 취소 버튼 클릭시 컴포넌트
 ┃ ┃ ┣ 📜 loadingAI.tsx    # AI 로딩 중 컴포넌트
 ┃ ┃ ┗ 📜 userSpeaking.tsx # 사용자 발화 중 컴포넌트
 ┃ ┣ 📂 playerHover        # 플레이어 관련 UI
 ┃ ┃ ┣ 📜 pageController.tsx  # 페이지 이동 컨트롤러
 ┃ ┃ ┣ 📜 playController.tsx  # 재생 컨트롤러
 ┃ ┃ ┗ 📜 settingModal.tsx    # 설정 모달
 ┃ ┣ 📜 aiGuide.tsx          # 질문하기 버튼 위 AI 가이드 컴포넌트
 ┃ ┣ 📜 aiModal.tsx          # AI질문 모달 컴포넌트
 ┃ ┣ 📜 firstGuide.tsx       # 첫 사용자를 위한 가이드 UI
 ┃ ┣ 📜 gtagWrapper.tsx      # Google Analytics(Gtag) 래퍼 컴포넌트
 ┃ ┣ 📜 playerHover.tsx      # 플레이어 UI 컨트롤러
 ┃ ┣ 📜 progressbar.tsx      # 진행 바(Progress Bar) UI
 ┃ ┣ 📜 serviceGNB.tsx       # 상단 네비게이션 바(GNB)
 ┃ ┣ 📜 streamingText.tsx    # 스트리밍되는 텍스트 애니메이션
 ┃ ┣ 📜 subscribeInfo.tsx    # 구독 관련 정보 표시 컴포넌트
 ┃ ┣ 📜 tale.tsx             # list 페이지 내 하나의 이야기(Tale) 컴포넌트
 ┃ ┣ 📜 taleEndModal.tsx     # 이야기 종료 시 표시되는 모달
 ┃ ┗ 📜 viewOptimizationModal.tsx # 가로모드 권장 모달
 ┣ 📂 fonts                 # 프로젝트에서 사용하는 폰트 파일 모음
 ┃ ┣ 📜 HammersmithOne-Regular.ttf  # HammersmithOne 폰트
 ┃ ┗ 📜 PretendardVariable.woff2    # Pretendard 가변 폰트
 ┣ 📂 hooks                 # 커스텀 훅(Custom Hooks)
 ┃ ┣ 📜 useBodyScrollLock.ts  # 스크롤 락 방지 훅 (모달 열릴 때 사용)
 ┃ ┗ 📜 useGtag.ts            # Google Analytics(Gtag) 추적 훅
 ┣ 📂 utils                 # 유틸리티 함수 모음
 ┃ ┣ 📜 formatDate.ts       # 날짜 포맷 변환 함수
 ┃ ┣ 📜 gtagFunc.ts         # Google Analytics 관련 함수
 ┃ ┗ 📜 stores.ts           # localStorage 관련 함수
 ┗ 📜 middleware.ts          # Next.js 미들웨어 (유저 인증 및 "/" 페이지 웹플로우로 이동)

 ```
