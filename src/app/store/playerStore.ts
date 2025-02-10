import { create } from "zustand";
import { fetchTaleById } from "../services/taleService";

interface StoryContent {
  page: number;
  details: {
    sentence: string;
    narration: string;
  }[];
  image: string;
}

export type StoryContents = StoryContent[];

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

  // 속도 및 언어 설정 함수
  decreaseSpeed: () => void;
  increaseSpeed: () => void;
  resetSpeed: () => void;
  setKorean: () => void;
  setEnglish: () => void;

  playSentence: () => void;
  playNextSentence: () => void;
  playPrevSentence: () => void;
  playNextPage: () => void;
  playPrevPage: () => void;
  playHandler: () => void;
  stopHandler: () => void;

  fetchPage: (page: number) => void;

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
  fullContent: "",

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

  setCurrPrevSentence: () => {
    const { storyContents, currentPageIdx, currentSentenceIdx } = get();
    if(!storyContents) return;
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

  playSentence: () => {
    const {
      setIsPlaying,
      setAudioPlayer,
      audioPlayer,
      speed,
      currentPageIdx,
      currentSentenceIdx,
      storyContents,
      setCurrPrevSentence,
    } = get();
    
    if(!storyContents) return;
    const currentSentence =
      storyContents[currentPageIdx]?.details[currentSentenceIdx];
    if (!currentSentence) return;
    setCurrPrevSentence();

    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }

    const player = new Audio(currentSentence.narration);
    setAudioPlayer(player);

    player.playbackRate = speed;
    player.preservesPitch = true;

    player.play();
    setIsPlaying(true);

    player.onended = () => {
      get().playNextSentence();
    };
  },

  playNextSentence: () => {
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
    } = get();
    if(!storyContents) return;
    const currentPage = storyContents[currentPageIdx];
    if (currentSentenceIdx < currentPage.details.length - 1) {
      setCurrentSentenceIdx(currentSentenceIdx + 1);
      setCurrPrevSentence();
    } else if (currentPageIdx < totalPage - 1) {
      const nextPage = currentPageIdx + 2; // page는 1-based index
      // console.log("페이지 넘기는중")
      if (nextPage === lastFetchedPage - 1) {
        fetchPage(lastFetchedPage + 1);
        set({ lastFetchedPage: lastFetchedPage + 1 });
      }

      setCurrentPageIdx(currentPageIdx + 1);
      setCurrentSentenceIdx(0);
      setCurrPrevSentence();
    } else {
      alert("마지막 문장입니다!");
      setIsPlaying(false);
    }
  },

  playPrevSentence: () => {
    const {
      setCurrentSentenceIdx,
      setCurrentPageIdx,
      currentSentenceIdx,
      currentPageIdx,
      storyContents,
      setCurrPrevSentence,
    } = get();
    if(!storyContents) return;

    if (currentSentenceIdx > 0) {
      setCurrentSentenceIdx(currentSentenceIdx - 1);
      setCurrPrevSentence();
    } else if (currentPageIdx > 0) {
      setCurrentPageIdx(currentPageIdx - 1);
      setCurrentSentenceIdx(
        storyContents[currentPageIdx - 1].details.length - 1
      );
      setCurrPrevSentence();
    } else {
      alert("첫번째 문장입니다!");
    }
  },

  playNextPage: () => {
    const {
      setCurrentPageIdx,
      setCurrentSentenceIdx,
      setIsPlaying,
      currentPageIdx,
      setCurrPrevSentence,
      totalPage,
      lastFetchedPage,
      fetchPage,
    } = get();

    if (currentPageIdx < totalPage - 1) {
      setCurrentPageIdx(currentPageIdx + 1);
      const nextPage = currentPageIdx + 2; // page는 1-based index
      // console.log("페이지 넘기는중")
      if (nextPage === lastFetchedPage - 1) {
        fetchPage(lastFetchedPage + 1);
        set({ lastFetchedPage: lastFetchedPage + 1 });
      }
      setCurrentSentenceIdx(0);
      setCurrPrevSentence();
    } else {
      alert("마지막 페이지입니다!");
      setIsPlaying(false);
    }
  },

  playPrevPage: () => {
    const {
      setCurrentPageIdx,
      setCurrentSentenceIdx,
      currentPageIdx,
      setCurrPrevSentence,
    } = get();

    if (currentPageIdx > 0) {
      setCurrentPageIdx(currentPageIdx - 1);
      setCurrentSentenceIdx(0);
      setCurrPrevSentence();
    } else {
      alert("첫번째 페이지입니다!");
    }
  },

  playHandler: () => {
    const { setHasStarted, playSentence } = get();
    setHasStarted(true);
    playSentence();
  },

  stopHandler: () => {
    const { setIsPlaying, audioPlayer } = get();
    console.log("정지버튼 누름");
    setIsPlaying(false);
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
    console.log(page, "페이지 추가로 가져오는중");
    const { storyId, storyContents, setStoryContents } = get();
    try {
      const data = await fetchTaleById(storyId, 1, page);
      setStoryContents([...storyContents!, ...data]);
      console.log("페이지 추가로 가져옴", ...data);
    } catch (error) {
      console.log("페이지 로드 오류", error);
    }
  },

  reset: () =>
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
    }),
}));
