import React from "react";
import dynamic from "next/dynamic";
import aiSpeakAnimation from "@/animation/AISpeak.json";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

function LoadingAI() {
  return (
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
  );
}

export default LoadingAI;
