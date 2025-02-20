"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useWebRTCStore } from "@/app/store/webRTCStore";
import { useRealtimeAPIStore } from "@/app/store/realtimeAPIStore";
import { usePlayerStore } from "@/app/store/playerStore";
import AiButtonContainer from "./aiModalComponents/aiButtonContainer";

const LoadingAI = dynamic(() => import("./aiModalComponents/loadingAI"));
const UserSpeaking = dynamic(() => import("./aiModalComponents/userSpeaking"));
const AiThinking = dynamic(() => import("./aiModalComponents/aiThinking"));
const CancelQuestion = dynamic(
  () => import("./aiModalComponents/cancelQuestion")
);
const StreamingText = dynamic(() => import("./streamingText"));

type Props = {
  onClose: () => void;
};


// AI 질문 모달 컴포넌트
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
    sendCommuication,
    setCurrentQuestion,
    questionCount,
    isSessionStarted,
    isSpeaking,
    isAISpeaking,
    instructions,
  } = useRealtimeAPIStore();

  const questionCountRef = useRef(questionCount);
  const [isCancelled, setIsCancelled] = useState(false);

  const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClose();
    if (audioElement) audioElement.volume = 0;
  };

  const startAI = async () => {
    connectRealtimeAPI();
    receiveServerEvent();
  };

  const resetCommuicationBubble = () => {
    setCurrentQuestion("");
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

  return (
    <div
      className="h-full w-screen fixed top-0 left-0 z-[10001]"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    >
      <div className="flex flex-col items-center absolute top-1/2 -translate-y-1/2 z-50 right-4 bg-white bg-opacity-60 backdrop-blur-lg h-[95%] max-h-[40rem] rounded-xl p-4 w-56">
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
        {!isSessionStarted && questionCount > 0 ? (
          <LoadingAI />
        ) : (
          <>
            {isSpeaking ? (
              <UserSpeaking />
            ) : isAISpeaking ? (
              <AiThinking />
            ) : isCancelled ? (
              <CancelQuestion />
            ) : (
              <StreamingText />
            )}
          </>
        )}
        <AiButtonContainer setIsCancelled={setIsCancelled}/>
      </div>
    </div>
  );
};

export default AIModal;
