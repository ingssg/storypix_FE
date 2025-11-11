"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PlayerHover from "@/components/playerHover";
import { usePlayerStore } from "../store/playerStore";
import { useWebRTCStore } from "../store/webRTCStore";
// ============================================
// 🔧 백엔드 없이 동작하도록 import 주석 처리됨
// ============================================
// import { fetchTaleById } from "@/app/services/taleService";
import { useRouter } from "next/navigation";
// import WithAuth from "@/components/HOC/withAuth";
import { useRealtimeAPIStore } from "../store/realtimeAPIStore";
import { trackingPlayerEvent } from "@/utils/gtagFunc";
import { AnimatePresence } from "framer-motion";
import AIModal from "@/components/aiModal";
import AiGuide from "@/components/aiGuide";
import dynamic from "next/dynamic";

const ViewOptimizationModal = dynamic(
  () => import("@/components/viewOptimizationModal")
);

const TaleEndModal = dynamic(() => import("@/components/taleEndModal"));

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
    // ============================================
    // 🔧 더미 데이터 사용 시 사용하지 않는 변수
    // ============================================
    // lastFetchedPage,
    isHoverOpen,
    setTitleEng,
    setFullContent,
    setTotalPage,
    setStoryId,
  } = usePlayerStore();

  const { createPeerConnection, closeWebRTCSession } = useWebRTCStore();
  const {
    questionCount,
    startUserQuestion,
    // ============================================
    // 🔧 백엔드 없이 동작하도록 사용하지 않는 변수
    // ============================================
    // sendCommuication,
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
    // 페이지 이동 버튼 클릭시 이동안하게 하려고 추가
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
    // ============================================
    // 기존 백엔드 API 호출 코드 (주석 처리됨)
    // ============================================
    // const fetchStoryContents = async () => {
    //   try {
    //     const data = await fetchTaleById(storyId, 3, 1);
    //     trackingPlayerEvent("story_page_view", { page_number: 1 });
    //     trackingPlayerEvent("story_page_view", { page_number: 2 });
    //     trackingPlayerEvent("story_page_view", { page_number: 3 });
    //     setStoryContents(data);
    //   } catch (error) {
    //     console.error(error);
    //     alert("다시 로그인해주세요");
    //     window.location.href =
    //       process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/kakao";
    //   }
    // };

    // ============================================
    // 🔧 더미 데이터 설정
    // ============================================
    const dummyStoryContents = [
      {
        page: 1,
        details: [
          {
            sentence: "It was the last night of the year.",
            narration: "/livedemo/audio/1-1.mp3",
          },
          {
            sentence: "Snow fell softly over the dark, empty streets.",
            narration: "/livedemo/audio/1-2.mp3",
          },
          {
            sentence:
              "A little girl walked barefoot in the cold, her feet red and frozen.",
            narration: "/livedemo/audio/1-3.mp3",
          },
          {
            sentence: "People hurried by, not noticing the poor child.",
            narration: "/livedemo/audio/1-4.mp3",
          },
          {
            sentence: "She carried a bundle of matches in her small hands.",
            narration: "/livedemo/audio/1-5.mp3",
          },
          {
            sentence:
              "All day long, she had tried to sell them, but no one stopped.",
            narration: "/livedemo/audio/1-6.mp3",
          },
          {
            sentence: "She thought,",
            narration: "/livedemo/audio/1-7.mp3",
          },
          {
            sentence: "“If I go home with no money, Father will be angry.”",
            narration: "/livedemo/audio/1-8.mp3",
          },
          {
            sentence:
              "The cold wind bit her cheeks as she wandered the street.",
            narration: "/livedemo/audio/1-9.mp3",
          },
        ],
        image: "/livedemo/img/1.png",
      },
      {
        page: 2,
        details: [
          {
            sentence:
              "At last, she sat down by a wall, too tired to walk anymore.",
            narration: "/livedemo/audio/2-1.mp3",
          },
          {
            sentence: "To warm her fingers, she struck a single match.",
            narration: "/livedemo/audio/2-2.mp3",
          },
          {
            sentence:
              "The tiny flame flickered, and she saw a bright, warm stove before her.",
            narration: "/livedemo/audio/2-3.mp3",
          },
          {
            sentence: "But when the match burned out, the stove disappeared.",
            narration: "/livedemo/audio/2-4.mp3",
          },
        ],
        image: "/livedemo/img/2.png",
      },
      {
        page: 3,
        details: [
          {
            sentence: "She lit another match.",
            narration: "/livedemo/audio/3-1.mp3",
          },
          {
            sentence:
              "This time, she saw a table covered with delicious food — a roasted goose and fruit.",
            narration: "/livedemo/audio/3-2.mp3",
          },
          {
            sentence:
              "The flame faded, and everything vanished into the cold darkness.",
            narration: "/livedemo/audio/3-3.mp3",
          },
          {
            sentence:
              "When she lit a third match, a tall Christmas tree sparkled with lights and stars.",
            narration: "/livedemo/audio/3-4.mp3",
          },
        ],
        image: "/livedemo/img/3.png",
      },
      {
        page: 4,
        details: [
          {
            sentence: "The girl struck her last match.",
            narration: "/livedemo/audio/4-1.mp3",
          },
          {
            sentence:
              "In its golden light appeared her dear grandmother, smiling gently.",
            narration: "/livedemo/audio/4-2.mp3",
          },
          {
            sentence: "“Take me with you”",
            narration: "/livedemo/audio/4-3.mp3",
          },
          {
            sentence: "whispered the girl.",
            narration: "/livedemo/audio/4-4.mp3",
          },
          {
            sentence:
              "The grandmother opened her arms, and together they rose toward the shining sky.",
            narration: "/livedemo/audio/4-5.mp3",
          },
        ],
        image: "/livedemo/img/4.png",
      },
      {
        page: 5,
        details: [
          {
            sentence:
              "In the morning, people found the little girl lying in the snow, smiling peacefully.",
            narration: "/livedemo/audio/5-1.mp3",
          },
          {
            sentence: "In her hands were the burnt matches, black and cold.",
            narration: "/livedemo/audio/5-2.mp3",
          },
          {
            sentence:
              "No one knew that, in the night, she had gone to a place warm and bright",
            narration: "/livedemo/audio/5-3.mp3",
          },
          {
            sentence: "where sorrow and hunger never come again.",
            narration: "/livedemo/audio/5-4.mp3",
          },
        ],
        image: "/livedemo/img/5.png",
      },
    ];

    trackingPlayerEvent("story_open");
    setEnterTime(Date.now());

    // ============================================
    // 🔧 더미 데이터를 storyContents로 저장
    // CSS backgroundImage는 URL 문자열을 그대로 사용하므로
    // S3 URL이든 로컬 경로든 상관없이 작동합니다.
    // ============================================
    setStoryContents(dummyStoryContents);

    // ============================================
    // 🔧 instruction 업데이트를 위한 fullContent 설정
    // 모든 문장을 합쳐서 fullContent로 설정
    // ============================================
    const fullContentText = dummyStoryContents
      .map((page) => page.details.map((detail) => detail.sentence).join(" "))
      .join(" ");

    setStoryId(1); // 성냥팔이소녀 ID
    setTitleEng("The Little Match Girl");
    setTotalPage(5);
    setFullContent(fullContentText);

    // ============================================
    // 🔧 프론트엔드에서 OpenAI Realtime API 임시 토큰 받아오기
    // ============================================
    try {
      fetchToken().then(() => {
        createPeerConnection();
        isDisconnectedRef.current = false;
      });
    } catch (error) {
      console.error(error);
    }

    return () => {
      // ============================================
      // 기존 백엔드 API 호출 코드 (주석 처리됨)
      // ============================================
      // sendCommuication();
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
          // ============================================
          // 🔧 프론트엔드에서 OpenAI Realtime API 임시 토큰 받아오기
          // ============================================
          try {
            fetchToken().then(() => {
              createPeerConnection();
              isDisconnectedRef.current = false;
              // 재연결 후 초기값 20으로 설정
              useRealtimeAPIStore.getState().setQuestionCount(() => 20);
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

    // ============================================
    // 🔧 더미 데이터 사용 시 모든 이미지 프리로드
    // 기존 로직은 백엔드에서 3개씩 가져올 때를 위한 것
    // ============================================
    // 더미 데이터는 전체 페이지를 가지고 있으므로 모든 이미지 프리로드
    storyContents.forEach((content) => {
      new window.Image().src = content.image;
    });

    // 기존 백엔드 로직 (주석 처리됨)
    // if (storyContents.length === 3) {
    //   storyContents.forEach((content) => {
    //     new window.Image().src = content.image;
    //   });
    //   return;
    // }
    // new window.Image().src = storyContents[lastFetchedPage - 1].image;
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
          <PlayerHover />
          <div
            className="bg-contain bg-center bg-no-repeat h-dvh max-mx-[12%] overflow-hidden flex flex-col justify-between"
            style={{
              backgroundImage: `url("${encodeURI(
                storyContents[currentPageIdx].image
              )}")`,
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
