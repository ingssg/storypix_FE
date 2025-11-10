import { useRealtimeAPIStore } from "@/app/store/realtimeAPIStore";
import React from "react";
import { trackingPlayerEvent } from "@/utils/gtagFunc";
import Image from "next/image";

type Props = {
  setIsCancelled: (value: boolean) => void;
};

function AiButtonContainer({ setIsCancelled }: Props) {
  const {
    isSessionStarted,
    isButtonVisible,
    isSpeaking,
    finishUserQuestion,
    setIsButtonVisible,
    setIsAISpeaking,
    setCurrentQuestion,
    setIsSpeaking,
  } = useRealtimeAPIStore();

  const { startUserQuestion } = useRealtimeAPIStore();

  const resetCommuicationBubble = () => {
    setCurrentQuestion("");
  };

  const finishSpeaking = () => {
    finishUserQuestion();
    setIsButtonVisible(false);
    setIsAISpeaking(true);
  };

  const startSpeaking = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    resetCommuicationBubble();
    startUserQuestion();
    setIsCancelled(false);
  };

  const cancelQuestion = () => {
    setIsCancelled(true);
    setIsSpeaking(false);
  };

  return (
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
          onClick={(e) => {
            startSpeaking(e);
            trackingPlayerEvent("story_ai_ask_start");
          }}
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
            onClick={() => {
              cancelQuestion();
              trackingPlayerEvent("story_ai_ask_cancel");
            }}
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
            onClick={() => {
              finishSpeaking();
              trackingPlayerEvent("story_ai_ask_complete");
            }}
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
  );
}

export default AiButtonContainer;
