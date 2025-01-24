"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import { useWebRTCStore } from "@/app/store/webRTCStore";
import { useRealtimeAPIStore } from "@/app/store/realtimeAPIStore";
import { dummyTale, dummyTitle } from "./playerHover/dummy";
import { usePlayerStore } from "@/app/store/playerStore";
import userSpeakAnimation from "@/animation/userSpeak.json";
import aiSpeakAnimation from "@/animation/AISpeak.json";
import dynamic from "next/dynamic";
import ProgressBar from "./progressbar";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

type Props = {
  onClose: () => void;
};

const AIModal = ({ onClose }: Props) => {
  const questionParagraph = useRef<HTMLParagraphElement>(null);
  const { connectRealtimeAPI, audioElement, dc } = useWebRTCStore();
  const { prevSentence, currSentence } = usePlayerStore();
  const {
    sendInputSignal,
    sendInputClear,
    setInstructions,
    updateInstructions,
    receiveServerEvent,
    sendCreateResponse,
    setIsButtonVisible,
    setIsAISpeaking,
    currentAnswer,
    currentQuestion,
    questionCount,
    isSessionStarted,
    isSpeaking,
    isAISpeaking,
    instructions,
    hasStarted,
    isButtonVisible,
  } = useRealtimeAPIStore();

  const questionCountRef = useRef(questionCount);
  const [isEnded, setIsEnded] = useState(false);

  const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClose();
    if (audioElement) audioElement.volume = 0;
  };

  const startAI = async () => {
    connectRealtimeAPI();
    receiveServerEvent();
  };

  const startSpeaking = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    sendInputClear();
    setInstructions(dummyTitle, dummyTale, prevSentence, currSentence);
    if (audioElement) audioElement.volume = 1;
  };

  const finishSpeaking = () => {
    sendInputSignal();
    sendCreateResponse();
    setIsButtonVisible(false);
    setIsAISpeaking(true);
  };

  useEffect(() => {
    questionCountRef.current = questionCount;
    if (typeof window !== "undefined" && questionCount === 0) {
      questionParagraph.current!.innerText = "모든 질문을 다 사용했어요.";
      setIsButtonVisible(false);
    }
  }, [questionCount]);

  useEffect(() => {
    if (!dc) startAI();
    if (questionCount === 0) setIsEnded(true);
  }, []);

  useEffect(() => {
    if (isSessionStarted && !hasStarted) {
      setInstructions(dummyTitle, dummyTale, prevSentence, currSentence);
    }
  }, [isSessionStarted]);

  useEffect(() => {
    if (isSessionStarted) {
      updateInstructions(instructions);
    }
  }, [instructions]);

  return (
    <div
      className="h-screen w-screen fixed top-0 left-0 z-20"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    >
      <div className="flex flex-col items-center absolute top-2 z-50 right-4 bg-white bg-opacity-60 backdrop-blur-lg h-[95%] rounded-xl p-4 w-68">
        <div className="flex justify-between items-center w-full mb-3">
          <p
            className="text-xs font-medium text-[#5A5C63]"
            ref={questionParagraph}
          >
            {questionCount}번 더 질문할 수 있어요.
          </p>
          <button
            type="button"
            className="rounded-full bg-[#F3F3F4] p-2 bg-opacity-60"
            onClick={closeModal}
          >
            <Image
              src={"images/x_icon.svg"}
              width={10}
              height={10}
              alt="close_icon"
            />
          </button>
        </div>
        {isEnded ? (
          <div className="flex flex-col justify-center items-center h-full w-[30vw] gap-3">
            <Image
              src={"/images/circle_icon.svg"}
              width={45}
              height={45}
              alt="caution_icon"
            />
            <p className="text-[#46474C] font-semibold text-sm">
              질문 기회를 모두 사용했어요.
            </p>
          </div>
        ) : isSpeaking ? (
          <div className="flex flex-col justify-center items-center h-full w-[30vw]">
            <div className="w-[3.75rem] h-[3.75rem]">
              <Lottie
                loop
                animationData={userSpeakAnimation}
                play
                className="w-[3.75rem] h-[3.75rem]"
              />
            </div>
            <p className="text-black mt-3">듣고 있어요.</p>
            <ProgressBar onComplete={finishSpeaking} />
          </div>
        ) : isAISpeaking ? (
          <div className="flex flex-col justify-center items-center h-full w-[30vw]">
            <div className="w-[3.75rem] h-[3.75rem]">
              <Lottie
                loop
                animationData={aiSpeakAnimation}
                play
                className="w-[3.75rem] h-[3.75rem]"
              />
            </div>
            <p className="text-black mt-3">잠시 생각중이에요.</p>
          </div>
        ) : (
          <div className="overflow-y-auto h-full text-black">
            <div className="flex flex-col w-[30vw] text-xs">
              <div className="mb-2 text-[#292A2D] font-semibold text-sm">
                {currentQuestion}
              </div>
              <div className="mb-2 text-[#46474C] font-semibold text-sm">
                {currentAnswer}
              </div>
            </div>
          </div>
        )}
        <div
          className={`${
            isSessionStarted ? `${isButtonVisible ? "" : "hidden"}` : "hidden"
          } w-full flex justify-center items-center mt-2 h-28`}
        >
          <div className={`w-full h-full`}>
            <button
              className={`w-full h-full speakButton flex flex-col gap-1 justify-center items-center bg-gradient-to-br from-[#FFB648] to-[#FF7134] rounded-xl text-sm font-semibold ${
                isSpeaking ? "hidden" : ""
              }`}
              onClick={startSpeaking}
            >
              <Image
                src={"/images/mike_icon.svg"}
                width={20}
                height={20}
                alt="question_icon"
              />
              질문하기
            </button>
            <button
              className={`w-full h-full finishButton flex flex-col gap-1 justify-center items-center bg-[#FF7134] rounded-xl text-sm font-semibold ${
                isSpeaking ? "" : "hidden"
              }`}
              onClick={finishSpeaking}
            >
              <FaCheck className="text-white text-lg" />
              질문완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModal;
