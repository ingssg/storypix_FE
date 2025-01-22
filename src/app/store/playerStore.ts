import { create } from "zustand";

interface StoryContent {
  page: number;
  details: {
    text: string;
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

  setIsPlaying: (value: boolean) => void;
  setHasStarted: (value: boolean) => void;
  setSpeed: (value: number) => void;
  setCurrentSentenceIdx: (value: number) => void;
  setCurrentPageIdx: (value: number) => void;
  setAudioPlayer: (value: HTMLAudioElement | null) => void;
  setStoryContents: (value: StoryContents) => void;
  setLanguage: (value: string) => void;

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

  // 상태 변경 함수
  setIsPlaying: (value) => set({ isPlaying: value }),
  setHasStarted: (value) => set({ hasStarted: value }),
  setSpeed: (value) => set({ speed: value }),
  setCurrentSentenceIdx: (value) => set({ currentSentenceIdx: value }),
  setCurrentPageIdx: (value) => set({ currentPageIdx: value }),
  setAudioPlayer: (player) => set({ audioPlayer: player }),
  setStoryContents: (value: StoryContents) => set({ storyContents: value }),
  setLanguage: (value) => set({ language: value }),

  playSentence: () => {
    const {
      setIsPlaying,
      setAudioPlayer,
      audioPlayer,
      speed,
      currentPageIdx,
      currentSentenceIdx,
      storyContents,
    } = get();

    const currentSentence =
      storyContents![currentPageIdx]?.details[currentSentenceIdx];
    if (!currentSentence) return;

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
      setTimeout(() => {
        get().playNextSentence();
      }, 1000);
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
    } = get();

    const currentPage = storyContents![currentPageIdx];
    if (currentSentenceIdx < currentPage.details.length - 1) {
      setCurrentSentenceIdx(currentSentenceIdx + 1);
    } else if (currentPageIdx < storyContents!.length - 1) {
      setCurrentPageIdx(currentPageIdx + 1);
      setCurrentSentenceIdx(0);
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
    } = get();

    if (currentSentenceIdx > 0) {
      setCurrentSentenceIdx(currentSentenceIdx - 1);
    } else if (currentPageIdx > 0) {
      setCurrentPageIdx(currentPageIdx - 1);
      setCurrentSentenceIdx(
        storyContents![currentPageIdx - 1].details.length - 1
      );
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
      storyContents,
    } = get();

    if (currentPageIdx < storyContents!.length - 1) {
      setCurrentPageIdx(currentPageIdx + 1);
      setCurrentSentenceIdx(0);
    } else {
      alert("마지막 페이지입니다!");
      setIsPlaying(false);
    }
  },

  playPrevPage: () => {
    const { setCurrentPageIdx, setCurrentSentenceIdx, currentPageIdx } = get();

    if (currentPageIdx > 0) {
      setCurrentPageIdx(currentPageIdx - 1);
      setCurrentSentenceIdx(0);
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
}));
