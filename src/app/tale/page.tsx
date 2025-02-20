"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PlayerHover from "@/components/playerHover";
import { usePlayerStore } from "../store/playerStore";
import AIModal from "@/components/aiModal";
import ViewOptimizationModal from "@/components/viewOptimizationModal";
import { useWebRTCStore } from "../store/webRTCStore";
import { fetchTaleById } from "@/app/services/taleService";
import { useRouter } from "next/navigation";
// import WithAuth from "@/components/HOC/withAuth";
import { useRealtimeAPIStore } from "../store/realtimeAPIStore";
import TaleEndModal from "@/components/taleEndModal";
import { trackingPlayerEvent } from "@/utils/gtagFunc";
import AiGuide from "@/components/aiGuide";
import { AnimatePresence } from "framer-motion";

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
    isEnd,
    isPlaying,
    isPageMoveTriggered,
    setEnterTime,
    setIsPageMoveTriggered,
    lastFetchedPage,
    isHoverOpen,
  } = usePlayerStore();

  const { createPeerConnection, closeWebRTCSession } = useWebRTCStore();
  const {
    questionCount,
    startUserQuestion,
    sendCommuication,
    isOpenAIModal,
    setIsOpenAIModal,
    fetchToken,
  } = useRealtimeAPIStore();

  const AIModalRef = useRef<HTMLButtonElement>(null);

  const [isLandscape, setIsLandscape] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(true);
  const disconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const isDisconnectedRef = useRef(false);

  const openAIModal = () => {
    setIsOpenAIModal(true);
    stopHandler();
    startUserQuestion();
  };

  const closeAIModal = () => {
    setIsOpenAIModal(false);
  };

  useEffect(() => {
    if (isPageMoveTriggered && !isPlaying) {
      setIsPageMoveTriggered(false);
      return;
    }
    if (hasStarted) {
      playSentence();
    }
  }, [currentPageIdx, currentSentenceIdx]);

  useEffect(() => {
    if (storyId === 0) {
      alert("잘못된 접근입니다.");
      router.push("/list");
      return () => {
        reset();
        closeWebRTCSession();
        isDisconnectedRef.current = true;
      };
    }
    const fetchStoryContents = async () => {
      try {
        const data = await fetchTaleById(storyId, 3, 1);
        trackingPlayerEvent("story_page_view", { page_number: 1 });
        trackingPlayerEvent("story_page_view", { page_number: 2 });
        trackingPlayerEvent("story_page_view", { page_number: 3 });
        setStoryContents(data);
      } catch (error) {
        console.error(error);
        alert("다시 로그인해주세요");
        window.location.href =
          process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/kakao";
      }
    };
    trackingPlayerEvent("story_open");
    setEnterTime(Date.now());
    fetchStoryContents();
    try {
      fetchToken().then(() => {
        createPeerConnection();
        isDisconnectedRef.current = false;
      });
    } catch (error) {
      console.error(error);
    }

    return () => {
      sendCommuication();
      useRealtimeAPIStore.getState().reset();
      reset();
      closeWebRTCSession();
      isDisconnectedRef.current = true;
    };
  }, []);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        disconnectTimer.current = setTimeout(() => {
          useRealtimeAPIStore.getState().reset();
          closeWebRTCSession();
          isDisconnectedRef.current = true;
          setIsOpenAIModal(false);
        }, 5000);
      } else {
        if (disconnectTimer.current) {
          clearTimeout(disconnectTimer.current);
          disconnectTimer.current = null;
        }
        if (isDisconnectedRef.current) {
          try {
            fetchToken().then(() => {
              createPeerConnection();
              isDisconnectedRef.current = false;
            });
          } catch (error) {
            console.error(error);
          }
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    checkOrientation();

    window.addEventListener("resize", checkOrientation);

    document.body.style.backgroundColor = "black";

    return () => {
      window.removeEventListener("resize", checkOrientation);
      document.body.style.backgroundColor = "";
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!storyContents) return;
    if (storyContents.length === 3) {
      storyContents.forEach((content) => {
        new window.Image().src = content.image;
      });
      return;
    }
    
    new window.Image().src = storyContents[lastFetchedPage - 1].image;

  }, [storyContents]);

  const lodaderClass =
    "w-12 h-12 rounded-full border-t-4 border-t-white border-r-4 border-r-transparent animate-spin block";

  return (
    <>
      {!storyContents ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <span className={lodaderClass}></span>
        </div>
      ) : (
        <div className="bg-black h-screen text-white w-full">
          {!isLandscape && <ViewOptimizationModal />}
          {isEnd && (
            <div
              className="fixed h-screen w-screen z-[49] bg-opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <TaleEndModal />
            </div>
          )}
          <PlayerHover
          />
          <div
            className="bg-contain bg-center bg-no-repeat h-dvh max-mx-[12%] overflow-hidden flex flex-col justify-between"
            style={{
              backgroundImage: `url(${storyContents[currentPageIdx].image})`,
            }}
          >
            <p className="mt-auto py-10 text-xl px-[20%] bg-gradient-to-t from-[rgba(28,28,28,1)] via-[rgba(28,28,28,1)] to-[rgba(28,28,28,0)] font-hammersmith text-center">
              {
                storyContents[currentPageIdx].details[currentSentenceIdx]
                  .sentence
              }
            </p>
          </div>
          {questionCount > 0 && !isHoverOpen && (
            <>
              <AnimatePresence>
                {isGuideOpen && (
                  <AiGuide onClose={() => setIsGuideOpen(false)} />
                )}
              </AnimatePresence>
              <button
                type="button"
                className="fixed bottom-6 right-6 bg-gradient-to-br from-[#FFB648] to-[#FF7134] rounded-lg flex flex-col justify-center items-center p-2 text-xs font-light gap-1 w-16 h-16 z-[11]"
                onClick={() => {
                  openAIModal();
                  trackingPlayerEvent("story_ai_ask_start");
                }}
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
            </>
          )}
          {isOpenAIModal && <AIModal onClose={closeAIModal} />}
        </div>
      )}
    </>
  );
};

// export default WithAuth(Tale);
export default Tale;
