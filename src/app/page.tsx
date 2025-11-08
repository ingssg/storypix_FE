"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

// 웹플로우 랜딩페이지로 대체
// 사용 x
const Home = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <div className="home flex flex-col items-center justify-center">
        <div className="w-full flex justify-between items-center px-[5%] py-4">
          <Image
            src="/images/logo.png"
            alt="storypix_logo"
            width={180}
            height={50}
          />
          <button
            onClick={() => handleNavigate("/list")}
            className="rounded-lg bg-[#A607AE] w-30 h-9 px-3 py-1 text-sm"
          >
            작품 무료 체험하기
          </button>
        </div>
        <div className="flex flex-col justify-center items-center mt-16 mb-10">
          <h1 className="text-[#A90084] text-4xl">영어의 첫인상</h1>
          <p className="text-5xl mt-2 mb-5 text-black">AI 동화로 특별하게</p>
          <p className="text-[#5F4056] text-xl">
            우리 아이에게 다채로운 목소리로 동화를 구연하고
          </p>
          <p className="text-[#5F4056] text-xl">
            질문에 답해주는 AI 동화 서비스, 스토리픽스
          </p>
        </div>
        <button
          onClick={() => handleNavigate("/list")}
          className="rounded-xl bg-[#A607AE] w-48 h-12 px-4 py-2 mb-12 text-lg"
        >
          작품 무료 체험하기
        </button>
        <Image
          src="/images/mainPreview.png"
          alt="storypix_preview"
          width={785}
          height={360}
        />
      </div>
    </>
  );
};

export default Home;
