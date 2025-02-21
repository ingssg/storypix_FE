import React from "react";
import Image from "next/image";
import { useModalStore } from "@/app/store/modalStore";


function FirstGuide() {
  const { setIsFirstGuideModalOpen } = useModalStore();

  const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsFirstGuideModalOpen(false);
  };

  const modalStyle =
    "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] bg-[#F6F6F6] rounded-lg p-5 w-80 flex flex-col gap-6";

  return (
    <div
      className="fixed h-screen w-screen bg-black bg-opacity-50"
      onClick={(e) => closeModal(e)}
    >
      <div className={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col justify-center items-center font-semibold">
          <p className="text-[#5A5C63] text-xs">처음 오셨나요?</p>
          <p className="text-[#292A2D]">이렇게 이용해보세요!</p>
          <button className="absolute top-5 right-5 p-1" onClick={() => setIsFirstGuideModalOpen(false)}>
            <Image
              src="/images/x_icon.svg"
              alt="close"
              width={12}
              height={20}
            />
          </button>
        </div>
        <div className="bg-white rounded-lg p-5 flex flex-col gap-5">
          <div className="flex gap-3">
            <div className="flex justify-center items-center font-semibold text-white text-[0.625rem] bg-[#FF7134] rounded-full p-3 w-6 h-6">
              1
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-[#FF7134] font-extrabold">작품선택</h1>
              <p className="text-[#46474C] text-sm">
                작품 목록에서 원하는 영어 스토리북을 선택하세요.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex justify-center items-center font-semibold text-white text-[0.625rem] bg-[#FF7134] rounded-full p-3 w-6 h-6">
              2
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-[#FF7134] font-extrabold">작품 감상하기</h1>
              <p className="text-[#46474C] text-sm">
                영어 자막과 이미지를 보며 AI가 들려주는 영어 스토리텔링을
                청취하세요.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex justify-center items-center font-semibold text-white text-[0.625rem] bg-[#FF7134] rounded-full p-3 w-6 h-6">
              3
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-[#FF7134] font-extrabold">AI 도우미 픽시</h1>
              <p className="text-[#46474C] text-sm">
                모르는 영어 표현, 이해가 어려운 내용이 있을 때 픽시에게
                물어보세요.
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsFirstGuideModalOpen(false)}
          className="w-full rounded-lg text-sm bg-[#FF7134] text-white py-[0.375rem] font-semibold"
        >
          스토리픽스 시작하기
        </button>
      </div>
    </div>
  );
}

export default FirstGuide;
