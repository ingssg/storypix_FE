import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/app/store/playerStore";

const TaleEndModal = () => {
  const { setIsEnd, goFirst, setCurrPrevSentence } = usePlayerStore();
  const modalClose = () => {
    setIsEnd(false);
  };

  const replayHandler = () => {
    goFirst();
    setCurrPrevSentence();
  };

  const router = useRouter();
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white bg-opacity-60 backdrop-blur-lg rounded-xl w-64 h-44">
      <div className="relative px-3 py-5 flex flex-col items-end h-full">
        <button
          type="button"
          className="rounded-full bg-[#F3F3F4] p-2 bg-opacity-60"
          onClick={modalClose}
        >
          <Image
            src={"images/x_icon.svg"}
            width={10}
            height={10}
            alt="close_icon"
          />
        </button>
        <div className="flex flex-col justify-center items-center w-full h-full gap-5 font-semibold">
          <p className="text-[#46474C] text-sm">
            이번 이야기가 끝났습니다. <br />
            다른 작품도 감상해볼까요?
          </p>
          <div className="flex gap-2 w-full justify-center items-center text-xs">
            <button
              type="button"
              className="px-2 py-[0.875rem] rounded-xl w-28 h-8 text-[#989BA2] bg-[#F3F3F4] flex items-center justify-center"
              onClick={replayHandler}
            >
              처음부터 다시보기
            </button>
            <button
              type="button"
              className="px-2 py-[0.875rem] rounded-xl w-28 h-8 text-white bg-[#FF7134] flex items-center justify-center"
              onClick={() => router.push("/list")}
            >
              다른 작품 감상하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaleEndModal;
