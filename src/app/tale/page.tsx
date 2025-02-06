"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PlayerHover from "@/components/playerHover";
import { usePlayerStore } from "../store/playerStore";
import AIModal from "@/components/aiModal";
import ViewOptimizationModal from "@/components/viewOptimizationModal";
import { useWebRTCStore } from "../store/webRTCStore";
import { fetchTaleById } from "@/app/services/taleService";
import { getTokenAPI } from "../services/aiService";
import { useRouter } from "next/navigation";
import WithAuth from "@/components/HOC/withAuth";
import { useRealtimeAPIStore } from "../store/realtimeAPIStore";

// const storyContents = dummy;

const Tale = () => {
  const router = useRouter();
  const {
    storyContents,
    currentPageIdx,
    currentSentenceIdx,
    playSentence,
    hasStarted,
    setStoryContents,
    stopHandler,
    reset,
    storyId,
    setFullContent,
  } = usePlayerStore();

  const { setEphemeralKey, createPeerConnection } = useWebRTCStore();
  const { setQuestionCount } = useRealtimeAPIStore(); 

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
    const token = await getTokenAPI(storyId);
    const EPHEMERAL_KEY = token.session.client_secret.value;
    setEphemeralKey(EPHEMERAL_KEY);
    setFullContent(token.instruction);
    setQuestionCount(() => token.remainedCount); 
  };

  useEffect(() => {
    if (hasStarted) {
      playSentence();
    }
  }, [currentPageIdx, currentSentenceIdx]);

  useEffect(() => {
    if(storyId === 0) {
      alert("잘못된 접근입니다.");
      router.push("/list");
      return () => {
        reset();
      }
    }
    const fetchStoryContents = async () => {
      try {
        const data = await fetchTaleById(storyId, 3, 1);
        setStoryContents(data);
      } catch (error) {
        console.log("데이터 로딩 오류", error);
      }
    };
    fetchStoryContents();
    fetchToken().then(() => {
      createPeerConnection();
    });

    return () => {
      reset();
    };
  }, []);

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
              {storyContents[currentPageIdx].details[currentSentenceIdx].sentence}
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

export default WithAuth(Tale);
