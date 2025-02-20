import React from "react";
import dynamic from "next/dynamic";
import userSpeakAnimation from "@/animation/userSpeak.json";
import { useRealtimeAPIStore } from "@/app/store/realtimeAPIStore";
import ProgressBar from "../progressbar";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

function UserSpeaking() {
  const { isSpeaking } = useRealtimeAPIStore();
  const {
    finishUserQuestion,
    setIsButtonVisible,
    setIsAISpeaking,
  } = useRealtimeAPIStore();

  const finishSpeaking = () => {
    finishUserQuestion();
    setIsButtonVisible(false);
    setIsAISpeaking(true);
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <div className="w-[3.75rem] h-[3.75rem]">
        <Lottie
          key={String(isSpeaking)}
          loop
          animationData={userSpeakAnimation}
          play
          className="w-[3.75rem] h-[3.75rem]"
        />
      </div>
      <p className="text-black mt-3">듣고 있어요.</p>
      <ProgressBar onComplete={finishSpeaking} />
    </div>
  );
}

export default UserSpeaking;
