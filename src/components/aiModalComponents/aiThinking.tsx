import React from "react";
import dynamic from "next/dynamic";
import aiSpeakAnimation from "@/animation/AISpeak.json";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

function AiThinking() {
  return (
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
  );
}

export default AiThinking;
