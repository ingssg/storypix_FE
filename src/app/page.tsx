"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-solid border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-[#171717]">
            <Image
              src="/images/gnb_logo.svg"
              alt="Storypix Logo"
              width={117}
              height={30}
              priority
            />
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a
              className="text-sm font-medium text-[#171717] hover:text-[#FF7134]"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-sm font-medium text-[#171717] hover:text-[#FF7134]"
              href="#about"
            >
              About
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavigate("/list")}
              className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#FF7134] px-4 text-sm font-bold leading-normal tracking-[0.015em] text-white transition-opacity hover:opacity-90"
            >
              <span className="truncate">체험하기</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-lg lg:rounded-xl">
              <div className="absolute inset-0">
                <Image
                  className="h-full w-full object-cover"
                  src="/images/mainPreview_up.png"
                  alt="Storypix 동화 플레이어 프리뷰"
                  fill
                  priority
                />
              </div>
              <div className="relative flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-black/50 p-8 text-center text-white sm:min-h-[70vh] md:min-h-[80vh]">
                <div className="flex flex-col gap-2">
                  <h1 className="font-hammersmith text-4xl font-black leading-tight tracking-tighter sm:text-5xl md:text-6xl">
                    AI와 함께 영어동화를 배우는 새로운 경험, Storypix
                  </h1>
                  <h2 className="font-pretendard mx-auto max-w-2xl text-base font-normal leading-normal text-white/90 sm:text-lg">
                    아이의 상상력과 대화를 이어주는 인터랙티브 동화 플레이어
                  </h2>
                </div>
                <button
                  onClick={() => handleNavigate("/list")}
                  className="font-pretendard flex h-12 min-w-[84px] max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#FFB648] to-[#FF7134] px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-transform hover:scale-105"
                >
                  <span className="truncate">👀 데모 바로보기</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Feature 1: 실시간 음성 대화 */}
              <div className="group relative flex flex-col items-center gap-6 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl md:border-r-2 md:border-gray-200">
                <div className="flex h-20 w-20 items-center justify-center">
                  <svg
                    className="h-16 w-16 text-[#FF7134]"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-hammersmith text-lg font-bold text-gray-900">
                    실시간 음성 대화
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    AI와의 대화가 멈추지 않아요. WebRTC로 70% 더 빠른 응답 속도.
                  </p>
                </div>
              </div>

              {/* Feature 2: 부드러운 로딩 */}
              <div className="group relative flex flex-col items-center gap-6 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl md:border-r-2 md:border-gray-200">
                <div className="flex h-20 w-20 items-center justify-center">
                  <svg
                    className="h-16 w-16 text-[#FF7134]"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-hammersmith text-lg font-bold text-gray-900">
                    부드러운 로딩
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    프리로딩과 캐싱으로 60% 더 빠른 페이지 전환.
                  </p>
                </div>
              </div>

              {/* Feature 3: 안전한 학습 환경 */}
              <div className="group relative flex flex-col items-center gap-6 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="flex h-20 w-20 items-center justify-center">
                  <svg
                    className="h-16 w-16 text-[#FF7134]"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-hammersmith text-lg font-bold text-gray-900">
                    안전한 학습 환경
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    JWT 기반 인증으로 아이의 데이터를 안전하게 보호.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Behind the Scene Section */}
        <section id="about" className="bg-[#F9F9F9] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex justify-center lg:justify-start">
                <Image
                  alt="개발자 프로필 사진"
                  className="h-auto w-full max-w-md rounded-lg object-cover"
                  src="/images/ingssg_photo.webp"
                  width={400}
                  height={400}
                />
              </div>
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <h2 className="font-hammersmith text-3xl font-bold tracking-tight text-[#171717] sm:text-4xl">
                  Behind the Scene
                </h2>
                <p className="mt-4 max-w-xl font-pretendard text-lg leading-8 text-[#171717]">
                  Storypix는 단순한 프로젝트가 아니라, &apos;실시간으로
                  반응하고, 자연스럽게 대화하며, &apos;아이의 몰입을 방해하지
                  않는 경험을 만들고자 했습니다. 기술이 사용자 경험을 방해하지
                  않도록 설계하는 과정을 배워가고 있습니다.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-[#5A5C63]">
                    Next.js
                  </span>
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-[#5A5C63]">
                    TypeScript
                  </span>
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-[#5A5C63]">
                    Zustand
                  </span>
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-[#5A5C63]">
                    Realtime API
                  </span>
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-[#5A5C63]">
                    TailwindCSS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-[#FFB648] to-[#FF7134] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-pretendard text-4xl font-bold text-white sm:text-5xl">
                이야기의 주인공이 되어보세요.
              </h2>
              <p className="font-pretendard mx-auto mt-4 max-w-2xl text-lg text-white/90">
                실시간으로 AI와 대화하는 동화 플레이어, 지금 바로 체험하기.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button
                  onClick={() => handleNavigate("/list")}
                  className="font-pretendard rounded-full bg-white px-8 py-4 text-xl font-semibold text-[#FF7134] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  🚀 Storypix Demo 체험하기
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-10 font-pretendard text-sm text-[#5F4056]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p>© 2025 Storypix | Frontend Developer</p>
            <div className="flex items-center gap-x-4">
              <a
                className="transition-colors hover:text-[#FF7134] hover:underline"
                href="https://raspy-law-bf1.notion.site/2a049a1a30b480e1a306c0a67ce68e5c"
                target="_blank"
                rel="noopener noreferrer"
              >
                📄 Resume
              </a>
              <span className="text-gray-400">·</span>
              <a
                className="transition-colors hover:text-[#FF7134] hover:underline"
                href="https://raspy-law-bf1.notion.site/2a049a1a30b48069871af531b05a21da"
                target="_blank"
                rel="noopener noreferrer"
              >
                💼 Portfolio
              </a>
              <span className="text-gray-400">·</span>
              <a
                className="transition-colors hover:text-[#FF7134] hover:underline"
                href="https://github.com/ingssg"
                target="_blank"
                rel="noopener noreferrer"
              >
                💻 GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
