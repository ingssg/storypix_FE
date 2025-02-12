"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useWebRTCStore } from "@/app/store/webRTCStore";
import { useRealtimeAPIStore } from "@/app/store/realtimeAPIStore";
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
  const { prevSentence, currSentence, fullContent, titleEng } =
    usePlayerStore();
  const {
    setInstructions,
    updateInstructions,
    receiveServerEvent,
    setIsButtonVisible,
    setIsAISpeaking,
    sendCommuication,
    setCurrentQuestion,
    startUserQuestion,
    finishUserQuestion,
    currentAnswer,
    currentQuestion,
    questionCount,
    isSessionStarted,
    isSpeaking,
    isAISpeaking,
    instructions,
    isButtonVisible,
    setIsSpeaking,
  } = useRealtimeAPIStore();

  const questionCountRef = useRef(questionCount);
  const [isEnded, setIsEnded] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [displayText, setDisplayText] = useState("");

  const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClose();
    if (audioElement) audioElement.volume = 0;
  };

  const startAI = async () => {
    connectRealtimeAPI();
    receiveServerEvent();
  };

  const startSpeaking = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    resetCommuicationBubble();
    startUserQuestion();
    setIsCancelled(false);
  };

  const finishSpeaking = () => {
    finishUserQuestion();
    setIsButtonVisible(false);
    setIsAISpeaking(true);
  };

  const resetCommuicationBubble = () => {
    setCurrentQuestion("");
    setDisplayText("");
  };

  const cancelQuestion = () => {
    setIsCancelled(true);
    setIsSpeaking(false);
  };

  useEffect(() => {
    questionCountRef.current = questionCount;
    if (typeof window !== "undefined" && questionCount === 0) {
      questionParagraph.current!.innerText = "모든 질문을 다 사용했어요.";
      setIsButtonVisible(false);
    }
  }, [questionCount]);

  useEffect(() => {
    if (!dc && questionCount > 0) startAI();
    if (questionCount === 0) setIsEnded(true);

    return () => {
      sendCommuication();
      resetCommuicationBubble();
    };
  }, []);

  useEffect(() => {
    if (isSessionStarted) {
      setInstructions(titleEng, fullContent, prevSentence, currSentence);
    }
  }, [isSessionStarted]);

  useEffect(() => {
    if (isSessionStarted && dc && dc.readyState === "open") {
      updateInstructions(instructions);
    }
  }, [instructions, dc, isSessionStarted]);

  useEffect(() => {
    if (currentAnswer === "") return;
    let i = 0;
    setDisplayText(currentAnswer[0]);
    const interval = setInterval(() => {
      setDisplayText((prev) => prev + currentAnswer[i]);
      i++;
      if (i >= currentAnswer.length - 1) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [currentAnswer]);

  return (
    <div
      className="h-screen w-screen fixed top-0 left-0 z-20"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    >
      <div className="flex flex-col items-center absolute top-2 z-50 right-4 bg-white bg-opacity-60 backdrop-blur-lg h-[95%] rounded-xl p-4 w-56">
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
        {!isSessionStarted ? (
          <div className="flex flex-col justify-center items-center h-full w-full">
            <div className="w-[3.75rem] h-[3.75rem]">
              <Lottie
                loop
                animationData={aiSpeakAnimation}
                play
                className="w-[3.75rem] h-[3.75rem]"
              />
            </div>
            <p className="text-[#46474C] mt-3 font-semibold text-sm text-center">
              픽시가 대화를 준비하고 있어요. <br />
              잠시만 기다려주세요.
            </p>
          </div>
        ) : (
          <>
            {isEnded ? (
              <div className="flex flex-col justify-center items-center h-full w-full gap-3">
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
              <div className="flex flex-col justify-center items-center h-full w-full">
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
              <div className="flex flex-col justify-center items-center h-full w-full relative">
                <div className="w-[3.75rem] h-[3.75rem]">
                  <Lottie
                    loop
                    animationData={aiSpeakAnimation}
                    play
                    className="w-[3.75rem] h-[3.75rem]"
                  />
                </div>
                <p className="text-black mt-3">잠시 생각중이에요.</p>
                <p className="text-[#5A5C63] text-xs font-medium absolute bottom-1">
                  제공되는 답변은 AI가 생성한 결과로,
                  <br />
                  부정확한 정보가 포함될 수 있습니다.
                </p>
              </div>
            ) : (
              isSessionStarted &&
              (isCancelled ? (
                <div className="w-full h-full flex justify-center items-center">
                  <p className="text-[#46474C] font-semibold text-sm text-center">
                    버튼을 눌러 동화 내용이나
                    <br />
                    영어 표현에 대해 질문해보세요.
                  </p>
                </div>
              ) : (
                <div className="overflow-y-auto h-full text-black w-full">
                  <div className="flex flex-col w-full text-xs">
                    <div className="mb-2 text-[#292A2D] font-semibold text-sm">
                      {currentQuestion}
                    </div>
                    <div className="mb-2 text-[#46474C] font-semibold text-sm">
                      {displayText}
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
        <div
          className={`${
            isSessionStarted ? `${isButtonVisible ? "" : "hidden"}` : "hidden"
          } w-full flex justify-center items-center mt-2 h-28`}
        >
          <div className={`w-full h-full flex items-end`}>
            <button
              className={`w-full h-16 flex flex-col gap-1 justify-center items-center bg-gradient-to-br from-[#FFB648] to-[#FF7134] rounded-xl text-sm font-semibold ${
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
            <div
              className={`${
                isSpeaking ? "" : "hidden"
              } w-full h-full text-sm font-semibold flex gap-2 justify-center items-center`}
            >
              <button
                type="button"
                className="w-16 h-16 flex flex-col gap-1 justify-center items-center bg-[#F3F3F4] rounded-xl text-[#989BA2] p-1"
                onClick={cancelQuestion}
              >
                <Image
                  src={"images/cancel_icon.svg"}
                  width={24}
                  height={24}
                  alt="cancel_icon"
                />
                질문 취소
              </button>
              <button
                className={`w-32 h-16 flex flex-col gap-1 justify-center items-center bg-[#FF7134] rounded-xl`}
                onClick={finishSpeaking}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <Image
                    src={"images/check_icon.svg"}
                    width={20}
                    height={20}
                    alt="check_icon"
                  />
                </div>
                질문완료
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModal;
