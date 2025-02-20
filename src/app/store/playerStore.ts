import { create } from "zustand";
import { fetchTaleById } from "../services/taleService";
import { trackingPlayerEvent } from "@/utils/gtagFunc";

interface StoryContent {
  page: number;
  details: {
    sentence: string;
    narration: string;
  }[];
  image: string;
}

export type StoryContents = StoryContent[];

// 플레이어 관련 전역 상태
interface PlayerState {
  isPlaying: boolean;
  hasStarted: boolean;
  speed: number;
  currentSentenceIdx: number;
  currentPageIdx: number;
  audioPlayer: HTMLAudioElement | null;
  storyContents: StoryContents | null;
  language: string;
  currSentence: string;
  prevSentence: string;
  totalPage: number;
  lastFetchedPage: number;
  storyId: number;
  titleEng: string;
  fullContent: string;
  isEnd: boolean;
  isPageMoveTriggered: boolean;
  enterTime: number;
  prevTimer: NodeJS.Timeout | null;     // 문장 전 1초 텀 
  nextTimer: NodeJS.Timeout | null;     // 문장 후 1초 텀
  isHoverOpen: boolean;
  hoverTimer: NodeJS.Timeout | null;    // 호버 닫히는 타이머

  setIsPlaying: (value: boolean) => void;
  setHasStarted: (value: boolean) => void;
  setSpeed: (value: number) => void;
  setCurrentSentenceIdx: (value: number) => void;
  setCurrentPageIdx: (value: number) => void;
  setAudioPlayer: (value: HTMLAudioElement | null) => void;
  setStoryContents: (value: StoryContents) => void;
  setLanguage: (value: string) => void;
  setCurrPrevSentence: () => void;
  setTotalPage: (value: number) => void;
  setStoryId: (value: number) => void;
  setTitleEng: (value: string) => void;
  setFullContent: (value: string) => void;
  setEnterTime: (value: number) => void;
  setIsHoverOpen: (value: boolean) => void;
  setHoverTimer: (value: NodeJS.Timeout | null) => void;
  
  resetHoverTimer: () => void;

  // 속도 및 언어 설정 함수
  decreaseSpeed: () => void;
  increaseSpeed: () => void;
  resetSpeed: () => void;
  setKorean: () => void;
  setEnglish: () => void;

  playSentence: () => void;
  playNextSentence: (value?: number) => void;
  playPrevSentence: () => void;
  playNextPage: () => void;
  playPrevPage: () => void;
  playHandler: () => void;
  stopHandler: () => void;
  setIsEnd: (value: boolean) => void;
  setIsPageMoveTriggered: (value: boolean) => void;

  fetchPage: (page: number) => void;

  goFirst: () => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // 초기 상태
  isPlaying: false,
  hasStarted: false,
  speed: 1,
  currentSentenceIdx: 0,
  currentPageIdx: 0,
  audioPlayer: null,
  storyContents: null,
  language: "korean",
  currSentence: "",
  prevSentence: "",
  totalPage: 0,
  lastFetchedPage: 3,
  storyId: 0,
  titleEng: "",
  fullContent: "", //인스트럭션 설정을 위함
  isEnd: false,
  isPageMoveTriggered: false,
  enterTime: 0,
  prevTimer: null,
  nextTimer: null,
  isHoverOpen: true,
  hoverTimer: null,

  // 상태 변경 함수
  setIsPlaying: (value) => set({ isPlaying: value }),
  setHasStarted: (value) => set({ hasStarted: value }),
  setSpeed: (value) => set({ speed: value }),
  setCurrentSentenceIdx: (value) => set({ currentSentenceIdx: value }),
  setCurrentPageIdx: (value) => set({ currentPageIdx: value }),
  setAudioPlayer: (player) => set({ audioPlayer: player }),
  setStoryContents: (value: StoryContents) => set({ storyContents: value }),
  setLanguage: (value) => set({ language: value }),
  setTotalPage: (value) => set({ totalPage: value }),
  setStoryId: (value) => set({ storyId: value }),
  setTitleEng: (value) => set({ titleEng: value }),
  setFullContent: (value) => set({ fullContent: value }),
  setIsEnd: (value) => set({ isEnd: value }),
  setIsPageMoveTriggered: (value) => set({ isPageMoveTriggered: value }),
  setEnterTime: (value) => set({ enterTime: value }),
  setIsHoverOpen: (value) => set({ isHoverOpen: value }),
  setHoverTimer: (value) => set({ hoverTimer: value }),
  resetHoverTimer: () => {
    const { hoverTimer } = get();
    if (hoverTimer) clearTimeout(hoverTimer);
    const timer = setTimeout(() => {
      set({ isHoverOpen: false });
      set({ hoverTimer: null });
    }, 2500);
    set({ hoverTimer: timer });
  },

  setCurrPrevSentence: () => {
    const { storyContents, currentPageIdx, currentSentenceIdx } = get();
    if (!storyContents) return;
    const currentSentence =
      storyContents[currentPageIdx]?.details[currentSentenceIdx];
    set({ currSentence: currentSentence.sentence });
    let prevSentence = "";
    if (currentSentenceIdx > 0) {
      prevSentence =
        storyContents[currentPageIdx]?.details[currentSentenceIdx - 1]
          ?.sentence || "";
    } else if (currentPageIdx > 0) {
      const prevPageDetails = storyContents[currentPageIdx - 1]?.details;
      if (prevPageDetails && prevPageDetails.length > 0) {
        prevSentence =
          prevPageDetails[prevPageDetails.length - 1]?.sentence || "";
      }
    }

    set({ prevSentence });
  },

  playSentence: async () => {
    const {
      setIsPlaying,
      setAudioPlayer,
      audioPlayer,
      speed,
      currentPageIdx,
      currentSentenceIdx,
      storyContents,
      hasStarted,
      setCurrPrevSentence,
      prevTimer,
    } = get();

    if (!storyContents) return;
    const currentSentence =
      storyContents[currentPageIdx]?.details[currentSentenceIdx];
    if (!currentSentence) return;
    setCurrPrevSentence();

    if (audioPlayer) {
      audioPlayer.pause();
    }

    if (prevTimer) {
      clearTimeout(prevTimer);
      set({ prevTimer: null });
    }

    const player = new Audio(currentSentence.narration);
    setAudioPlayer(player);

    player.playbackRate = speed;
    player.preservesPitch = true;

    setIsPlaying(true);
    const newTimer = setTimeout(async () => {
      await player.play();
      if (!hasStarted) set({ hasStarted: true });
      player.onended = () => {
        get().playNextSentence(1000);
      };
    }, 1000);

    set({ prevTimer: newTimer });
  },

  playNextSentence: (value:number = 0) => {
    const {
      setCurrentSentenceIdx,
      setCurrentPageIdx,
      setIsPlaying,
      currentSentenceIdx,
      currentPageIdx,
      storyContents,
      setCurrPrevSentence,
      totalPage,
      lastFetchedPage,
      fetchPage,
      hasStarted,
      playHandler,
      audioPlayer,
      isEnd,
      hoverTimer,
      resetHoverTimer,
    } = get();
    if (!storyContents) return;
    set({ isPageMoveTriggered: false });
    const newTimer = setTimeout(() => {
      const currentPage = storyContents[currentPageIdx];
      if (currentSentenceIdx < currentPage.details.length - 1) {
        setCurrentSentenceIdx(currentSentenceIdx + 1);
        setCurrPrevSentence();
      } else if (currentPageIdx < totalPage - 1) {
        const nextPage = currentPageIdx + 2; // page는 1-based index
        if (nextPage === lastFetchedPage - 1) {
          fetchPage(lastFetchedPage + 1);
          set({ lastFetchedPage: lastFetchedPage + 1 });
        }

        setCurrentPageIdx(currentPageIdx + 1);
        setCurrentSentenceIdx(0);
        setCurrPrevSentence();
      } else {
        set({ isEnd: true });
        setIsPlaying(false);
        if (audioPlayer) audioPlayer.pause();
      }
      if (!hasStarted) playHandler();
    }, value);
    if (hoverTimer) resetHoverTimer();
    if (!isEnd) {
      set({ isPlaying: true });
    }
    set({ nextTimer: newTimer });
  },

  playPrevSentence: () => {
    const {
      setCurrentSentenceIdx,
      setCurrentPageIdx,
      currentSentenceIdx,
      currentPageIdx,
      storyContents,
      setCurrPrevSentence,
      hoverTimer,
      resetHoverTimer,
      hasStarted,
      playHandler,
    } = get();
    if (!storyContents) return;
    set({ isPageMoveTriggered: false });
    if (currentSentenceIdx > 0) {
      setCurrentSentenceIdx(currentSentenceIdx - 1);
      setCurrPrevSentence();
      if (!hasStarted) playHandler();
      if (hoverTimer) resetHoverTimer();
    } else if (currentPageIdx > 0) {
      setCurrentPageIdx(currentPageIdx - 1);
      setCurrentSentenceIdx(
        storyContents[currentPageIdx - 1].details.length - 1
      );
      setCurrPrevSentence();
      if (!hasStarted) playHandler();
      if (hoverTimer) resetHoverTimer();
    } else {
      alert("첫번째 문장입니다!");
    }
  },

  playNextPage: () => {
    const {
      setCurrentPageIdx,
      setCurrentSentenceIdx,
      currentPageIdx,
      setCurrPrevSentence,
      totalPage,
      lastFetchedPage,
      fetchPage,
      hoverTimer,
      resetHoverTimer,
    } = get();

    if (currentPageIdx < totalPage - 1) {
      setCurrentPageIdx(currentPageIdx + 1);
      const nextPage = currentPageIdx + 2; // page는 1-based index
      if (nextPage === lastFetchedPage - 1) {
        fetchPage(lastFetchedPage + 1);
        set({ lastFetchedPage: lastFetchedPage + 1 });
      }
      setCurrentSentenceIdx(0);
      setCurrPrevSentence();
      set({ isPageMoveTriggered: true });
      if (hoverTimer) {
        resetHoverTimer();
      }
    } else {
      alert("마지막 페이지입니다!");
    }
  },

  playPrevPage: () => {
    const {
      setCurrentPageIdx,
      setCurrentSentenceIdx,
      currentPageIdx,
      setCurrPrevSentence,
      hoverTimer,
      resetHoverTimer
    } = get();

    if (currentPageIdx > 0) {
      setCurrentPageIdx(currentPageIdx - 1);
      setCurrentSentenceIdx(0);
      setCurrPrevSentence();
      set({ isPageMoveTriggered: true });
      if (hoverTimer) resetHoverTimer();
    } else {
      alert("첫번째 페이지입니다!");
    }
  },

  playHandler: () => {
    const { playSentence } = get();
    playSentence();
  },

  stopHandler: () => {
    const { setIsPlaying, audioPlayer, prevTimer, nextTimer } = get();
    setIsPlaying(false);

    if (prevTimer) {
      clearTimeout(prevTimer);
      set({ prevTimer: null });
    }

    if (nextTimer) {
      clearTimeout(nextTimer);
      set({ nextTimer: null });
    }

    if (audioPlayer) {
      audioPlayer.pause();
    }
  },

  // 속도 및 언어 설정 함수
  decreaseSpeed: () => {
    const { audioPlayer, setSpeed } = get();
    if (!audioPlayer) return;

    audioPlayer.playbackRate = 0.8;
    setSpeed(0.8);
  },

  increaseSpeed: () => {
    const { audioPlayer, setSpeed } = get();
    if (!audioPlayer) return;

    audioPlayer.playbackRate = 1.4;
    setSpeed(1.4);
  },

  resetSpeed: () => {
    const { audioPlayer, setSpeed } = get();
    if (!audioPlayer) return;

    audioPlayer.playbackRate = 1;
    setSpeed(1);
  },

  setKorean: () => {
    const { setLanguage } = get();
    setLanguage("korean");
  },

  setEnglish: () => {
    const { setLanguage } = get();
    setLanguage("english");
  },

  fetchPage: async (page: number) => {
    if (page > get().totalPage) return;
    const { storyId, storyContents, setStoryContents } = get();
    try {
      const data = await fetchTaleById(storyId, 1, page);
      trackingPlayerEvent("story_page_view", { page_number: page });
      setStoryContents([...storyContents!, ...data]);
    } catch (error) {
      console.error("데이터 로딩 오류", error);
      alert("다시 로그인해주세요");
      window.location.href =
        process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/kakao";
    }
  },

  goFirst: () => {
    set({
      isPlaying: false,
      hasStarted: false,
      currentPageIdx: 0,
      currentSentenceIdx: 0,
      currSentence: "",
      prevSentence: "",
      isEnd: false,
      isPageMoveTriggered: false,
    });
  },

  reset: () => {
    get().audioPlayer?.pause();
    set({
      isPlaying: false,
      hasStarted: false,
      speed: 1,
      currentSentenceIdx: 0,
      currentPageIdx: 0,
      audioPlayer: null,
      storyContents: null,
      language: "korean",
      currSentence: "",
      prevSentence: "",
      totalPage: 0,
      lastFetchedPage: 3,
      storyId: 0,
      titleEng: "",
      fullContent: "",
      isEnd: false,
      isPageMoveTriggered: false,
      enterTime: 0,
    });
  },
}));
