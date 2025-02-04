"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PlayerHover from "@/components/playerHover";
import { usePlayerStore } from "../../store/playerStore";
import AIModal from "@/components/aiModal";
import ViewOptimizationModal from "@/components/viewOptimizationModal";
import { getToken } from "@/utils/aiService";
import { useWebRTCStore } from "../../store/webRTCStore";
import { useParams } from "next/navigation";
import { fetchTaleById } from "@/app/services/taleService";

// const storyContents = dummy;

const Tale = () => {
  const { id } = useParams<{ id: string }>();

  const {
    storyContents,
    currentPageIdx,
    currentSentenceIdx,
    playSentence,
    hasStarted,
    setStoryContents,
    stopHandler,
    reset,
    setId,
  } = usePlayerStore();

  const { setEphemeralKey, createPeerConnection } = useWebRTCStore();

  const [isOpenAIModal, setIsOpenAIModal] = useState(false);
  const AIModalRef = useRef<HTMLButtonElement>(null);

  const openAIModal = () => {
    setIsOpenAIModal(true);
    stopHandler();
  };

  const closeAIModal = () => {
    setIsOpenAIModal(false);
  };

  const fetchToken = async () => {
    const token = await getToken();
    // console.log(token);
    const EPHEMERAL_KEY = token.client_secret.value;
    setEphemeralKey(EPHEMERAL_KEY);
  };

  useEffect(() => {
    if (hasStarted) playSentence();
  }, [currentPageIdx, currentSentenceIdx]);
  return (
    <>
      {!storyContents ? (
        <>로딩중</>
      ) : (
        <div className="bg-black h-screen w-screen text-white">
          <ViewOptimizationModal />
          <PlayerHover />
          <div
            className="bg-contain bg-center bg-no-repeat h-dvh max-mx-[12%] overflow-hidden flex flex-col justify-between"
            style={{
              backgroundImage: `url(${storyContents[currentPageIdx].image})`,
            }}
          >
            <p className="mt-auto py-10 text-xl px-[20%] bg-gradient-to-t from-[rgba(28,28,28,1)] via-[rgba(28,28,28,1)] to-[rgba(28,28,28,0)] font-hammersmith text-center">
              {storyContents[currentPageIdx].details[currentSentenceIdx].text}
            </p>
          </div>
          <button
            type="button"
            className="fixed bottom-6 right-6 bg-gradient-to-br from-[#FFB648] to-[#FF7134] rounded-lg flex flex-col justify-center items-center p-2 text-xs font-light gap-1 w-16 h-16 z-[11]"
            onClick={openAIModal}
            ref={AIModalRef}
          >
            <Image
              src={"/images/mike_icon.svg"}
              width={16}
              height={18}
              alt="question_icon"
            />
            질문하기
          </button>
          {isOpenAIModal && <AIModal onClose={closeAIModal} />}
        </div>
      )}
    </>
  );
};

export default Tale;
