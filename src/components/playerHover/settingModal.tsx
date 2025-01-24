'use client';

import React, { useEffect } from "react";
import { usePlayerStore } from "@/app/store/playerStore";
import Image from "next/image";
import { useRef } from "react";

type Props = {
  onClose: () => void;
};

const SettingModal = ({ onClose }: Props) => {
  const { decreaseSpeed, resetSpeed, increaseSpeed, setKorean, setEnglish, speed, language } =
    usePlayerStore();

    const slowButton = useRef<HTMLButtonElement>(null);
    const normalButton = useRef<HTMLButtonElement>(null);
    const fastButton = useRef<HTMLButtonElement>(null);
    const koreanButton = useRef<HTMLButtonElement>(null);
    const englishButton = useRef<HTMLButtonElement>(null);

  const closeSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClose();
    e.stopPropagation();
  };

  const decreaseSpeedBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    decreaseSpeed();
    slowButton.current?.classList.add("selected");
    normalButton.current?.classList.remove("selected");
    fastButton.current?.classList.remove("selected");
    e.stopPropagation();
  }

  const resetSpeedBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    resetSpeed();
    slowButton.current?.classList.remove("selected");
    normalButton.current?.classList.add("selected");
    fastButton.current?.classList.remove("selected");
    e.stopPropagation();
  }

  const increaseSpeedBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    increaseSpeed();
    slowButton.current?.classList.remove("selected");
    normalButton.current?.classList.remove("selected");
    fastButton.current?.classList.add("selected");
    e.stopPropagation();
  }

  const setKoreanBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    setKorean();
    koreanButton.current?.classList.add("selected");
    englishButton.current?.classList.remove("selected");
    e.stopPropagation();
  }

  const setEnglishBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    setEnglish();
    koreanButton.current?.classList.remove("selected");
    englishButton.current?.classList.add("selected");
    e.stopPropagation();
  }


  useEffect(() => {
    switch(speed) {
      case 0.8:
        slowButton.current?.classList.add("selected");
        break;
      case 1:
        normalButton.current?.classList.add("selected");
        break;
      case 1.4:
        fastButton.current?.classList.add("selected");
        break;
    }
    switch(language) {
      case "korean":
        koreanButton.current?.classList.add("selected");
        break;
      case "english":
        englishButton.current?.classList.add("selected");
        break;
    }
  }, [])

  return (
    <div
      className=" h-full absolute right-0 z-[21]"
      onClick={(e:React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      // ref={settingModal}
    >
      <div className="flex flex-col justify-center items-center bg-white bg-opacity-60 backdrop-blur-lg h-[95%] rounded-xl mr-4 mt-[3%] p-4 w-68">
        <div className="flex justify-between items-center w-full text-black">
          <span className="text-lg font-semibold text-[#46474C]">설정</span>
          <button
            type="button"
            className="rounded-full bg-[#F3F3F4] p-2 bg-opacity-60"
            onClick={closeSettings}
          >
            <Image
              src={"images/x_icon.svg"}
              width={12}
              height={12}
              alt="close_icon"
            />
          </button>
        </div>
        <div className="h-full mt-6">
          <div className="flex flex-col gap-3 pr-9">
            <p className="text-[#5A5C63]">구연 속도</p>
            <div className="flex gap-2">
              <button
                className="px-3 py-2 bg-white text-[#5A5C63] rounded-lg font-semibold"
                onClick={decreaseSpeedBtn}
                ref={slowButton}
              >
                천천히
              </button>
              <button
                className="px-3 py-2 bg-white text-[#5A5C63] rounded-lg font-semibold"
                onClick={resetSpeedBtn}
                ref={normalButton}
              >
                보통
              </button>
              <button
                className="px-3 py-2 bg-white text-[#5A5C63] rounded-lg font-semibold"
                onClick={increaseSpeedBtn}
                ref={fastButton}
              >
                빠르게
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-6">
            <p className="text-[#5A5C63]">AI 답변 언어</p>
            <div className="flex gap-2">
              <button
                className="px-3 py-2 bg-white text-[#5A5C63] rounded-lg font-semibold"
                ref={koreanButton}
                onClick={setKoreanBtn}
              >
                한국어
              </button>
              <button
                className="px-3 py-2 bg-white text-[#5A5C63] rounded-lg font-semibold"
                ref={englishButton}
                onClick={setEnglishBtn}
              >
                영어
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingModal;
