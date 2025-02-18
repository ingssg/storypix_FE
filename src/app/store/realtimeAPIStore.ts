import { create } from "zustand";
import { useWebRTCStore } from "./webRTCStore";
import { usePlayerStore } from "./playerStore";
import {
  Communication,
  decreaseCommuiationCountAPI,
  getTokenAPI,
  postCommuicationAPI,
  Record,
} from "../services/aiService";
import { trackingPlayerEvent } from "@/utils/gtagFunc";

interface RealtimeAPIState {
  currentQuestion: string;
  currentAnswer: string;
  isSessionStarted: boolean;
  template: string;
  questionCount: number;
  isSpeaking: boolean;
  isAISpeaking: boolean;
  instructions: string;
  isButtonVisible: boolean;

  // 소통 기록
  sessionId: string;
  sessionCreatedAt: Date;
  records: Record[];
  isOpenAIModal: boolean;

  setCurrentQuestion: (value: string) => void;
  setCurrentAnswer: (value: string) => void;
  setIsSessionStarted: (value: boolean) => void;
  setInstructions: (
    title: string,
    content: string,
    prevSentence: string,
    currSentence: string
  ) => void;
  setQuestionCount: (updateFn: (count: number) => number) => void;
  setIsButtonVisible: (value: boolean) => void;
  setIsAISpeaking: (value: boolean) => void;
  setIsSpeaking: (value: boolean) => void;
  setIsOpenAIModal: (value: boolean) => void;

  sendInputSignal: () => void;
  sendInputClear: () => void;
  sendCreateResponse: () => void;
  sendInitSession: () => void;
  updateInstructions: (value: string) => void;
  receiveServerEvent: () => void;
  sendCommuication: () => void;
  startUserQuestion: () => void;
  finishUserQuestion: () => void;
  fetchToken: () => Promise<string>;

  reset: () => void;
}

export const useRealtimeAPIStore = create<RealtimeAPIState>((set, get) => ({
  questions: [],
  answers: [],
  currentQuestion: "",
  currentAnswer: "",
  isSessionStarted: false,
  template: `You are a kind teacher for korean children and your name is Pixie (in Korean, “픽시”). And I'm 3 years old korean learning english. Your answers must be very simple and short (within 100 characters). Always speak slowly and clearly. Your job is to help me resolve questions that come up while reading "{title}" in English. Those questions are either about English or the content of the story. If the question is about English, explain it in a very simple way that a 3-year-old can understand. If the question is unrelated to the story, politely ask the user to only ask about this story. However, it’s okay to tell your name. If it feels like the user is asking about the scene they are currently viewing, refer to the context below. [PreviousSentence] : {prevSentence} [CurrentSentence] : {currSentence} If it is related but not found in the content below, answer logically like a kindergarten teacher. Please answer in {language}, even if I speak another language.

############## [Story Content]

{content} ##############

REMEMBER: answer in {language}, even if I speak another language.`,
  questionCount: 0,
  isSpeaking: false,
  isAISpeaking: false,
  instructions: "",
  isButtonVisible: true,
  sessionId: "",
  sessionCreatedAt: new Date(),
  records: [],
  isOpenAIModal: false,

  setCurrentQuestion: (value) => set({ currentQuestion: value }),
  setCurrentAnswer: (value) => set({ currentAnswer: value }),
  setIsSessionStarted: (value) => set({ isSessionStarted: value }),
  setIsButtonVisible: (value: boolean) => set({ isButtonVisible: value }),
  setIsAISpeaking: (value: boolean) => set({ isAISpeaking: value }),
  setIsSpeaking: (value: boolean) => set({ isSpeaking: value }),
  setIsOpenAIModal: (value: boolean) => set({ isOpenAIModal: value }),
  setInstructions: (title, content, prevSentence, currSentence) => {
    const { language } = usePlayerStore.getState();
    const template = get().template;
    const updatedInstructions = template.replace(/{(.*?)}/g, (_, key) => {
      type Params = {
        title: string;
        content: string;
        prevSentence: string;
        currSentence: string;
        language: string;
      };

      const params = {
        title,
        content,
        prevSentence,
        currSentence,
        language,
      } as Params;
      if (params.language === "korean") {
        params.language = "한국어";
      }
      if (params.language === "english") {
        params.language = "ENGLISH";
      }
      console.log(params);
      return params[key as keyof Params] || `{${key}}`; // 키가 없으면 원래 템플릿 유지
    });

    // 업데이트된 instructions 설정
    set({ instructions: updatedInstructions });
  },

  setQuestionCount: (updateFn) =>
    set((state) => ({ questionCount: updateFn(state.questionCount) })),

  sendInputSignal: () => {
    const { dc } = useWebRTCStore.getState();
    const responseEvent = {
      type: "input_audio_buffer.commit",
    };
    if (dc && dc.readyState === "open") {
      set({ isSpeaking: false });
      dc.send(JSON.stringify(responseEvent));
    }
  },

  sendInputClear: () => {
    const { dc } = useWebRTCStore.getState();
    const responseEvent = {
      type: "input_audio_buffer.clear",
    };
    if (dc && dc.readyState === "open") {
      set({ isSpeaking: true });
      dc.send(JSON.stringify(responseEvent));
    }
  },

  sendCreateResponse: () => {
    const { dc } = useWebRTCStore.getState();
    const responseEvent = {
      type: "response.create",
    };
    if (dc && dc.readyState === "open") dc.send(JSON.stringify(responseEvent));
  },

  sendInitSession: () => {
    const { dc } = useWebRTCStore.getState();
    const responseEvent = {
      type: "session.update",
      session: {
        turn_detection: null, // push to talk
        input_audio_transcription: {
          model: "whisper-1",
        },
      },
    };
    if (dc && dc.readyState === "open") {
      dc.send(JSON.stringify(responseEvent));
    }
  },

  updateInstructions: (value) => {
    const { dc } = useWebRTCStore.getState();
    const responseEvent = {
      type: "session.update",
      session: {
        instructions: value,
      },
    };
    if (dc && dc.readyState === "open") dc.send(JSON.stringify(responseEvent));
  },

  receiveServerEvent: () => {
    const { dc, closeWebRTCSession } = useWebRTCStore.getState();
    const { setQuestionCount, sendInitSession } = get();
    if (dc) {
      dc.addEventListener("message", (e) => {
        const serverEvent = JSON.parse(e.data);
        // console.log(serverEvent);
        if( serverEvent.type === "session.updated" ) {
          console.log(serverEvent);
        }
        if (
          serverEvent.type ===
          "conversation.item.input_audio_transcription.completed"
        ) {
          set({ currentQuestion: serverEvent.transcript });
          const userRecord: Record = {
            text: serverEvent.transcript,
            isUser: true,
            createdAt: new Date(),
          };
          set((state) => ({ records: [...state.records, userRecord] }));
        }
        if (serverEvent.type === "response.audio_transcript.done") {
          set({ currentAnswer: serverEvent.transcript });
          setQuestionCount((prevCount) => prevCount - 1);
          const aiRecord: Record = {
            text: serverEvent.transcript,
            isUser: false,
            createdAt: new Date(),
          };
          set((state) => ({ records: [...state.records, aiRecord] }));
        }
        if (serverEvent.type === "session.created") {
          set({ sessionCreatedAt: new Date() });
          set({ sessionId: serverEvent.session.id });
          usePlayerStore.getState().setCurrPrevSentence();

          sendInitSession();
          get().startUserQuestion();
          set({ isSessionStarted: true });
        }
        if (serverEvent.type === "response.output_item.added") {
          set({ isAISpeaking: false });
        }
        if (serverEvent.type === "output_audio_buffer.stopped") {
          trackingPlayerEvent("story_ai_answer");
          if (get().questionCount > 0) {
            set({ isButtonVisible: true });
            return;
          }
          closeWebRTCSession();
        }

        if (serverEvent.type === "error") {
          if (serverEvent.error.code === "session_expired") {
            const disconnectAndReconnect = async () => {
              get().setIsOpenAIModal(false);
              await closeWebRTCSession();
              try {
                get()
                  .fetchToken()
                  .then(() => {
                    useWebRTCStore.getState().createPeerConnection();
                  });
              } catch (error) {
                console.error("토큰 요청 오류", error);
              }
            };
            disconnectAndReconnect();
          }
        }
      });
    }
  },
  sendCommuication: async () => {
    if (get().records.length === 0) return;
    const { storyId, currentPageIdx, prevSentence, currSentence } =
      usePlayerStore.getState();
    const communication: Communication = {
      storyId: storyId,
      openaiSessionId: get().sessionId,
      questionPage: currentPageIdx + 1,
      previousSentence: prevSentence,
      currentSentence: currSentence,
      records: get().records,
      createdAt: get().sessionCreatedAt,
    };
    await postCommuicationAPI(communication);
    set({ records: [] });
  },

  startUserQuestion: async () => {
    const { prevSentence, currSentence, titleEng, fullContent } =
      usePlayerStore.getState();
    const { sendInputClear, setInstructions } = get();
    setInstructions(titleEng, fullContent, prevSentence, currSentence);
    sendInputClear();
  },

  finishUserQuestion: async () => {
    const { storyId } = usePlayerStore.getState();
    const { sendInputSignal, sendCreateResponse } = get();
    const { closeWebRTCSession, audioElement } = useWebRTCStore.getState();
    try {
      decreaseCommuiationCountAPI(storyId);
      sendInputSignal();
      sendCreateResponse();
    } catch {
      closeWebRTCSession();
    } finally {
      if (audioElement) audioElement.volume = 1;
    }
  },

  fetchToken: async () => {
    const { storyId, setFullContent } = usePlayerStore.getState();
    const { setQuestionCount } = get();
    const { setEphemeralKey } = useWebRTCStore.getState();
    setQuestionCount(() => 0);
    const token = await getTokenAPI(storyId);
    if (token === null) return;
    const EPHEMERAL_KEY = token.session.client_secret.value;
    setEphemeralKey(EPHEMERAL_KEY);
    setFullContent(token.instruction);
    setQuestionCount(() => token.remainedCount);

    return token;
  },

  reset: () =>
    set({
      currentQuestion: "",
      currentAnswer: "",
      isSpeaking: false,
      isAISpeaking: false,
      instructions: "",
      isButtonVisible: true,
      sessionId: "",
      sessionCreatedAt: new Date(),
      questionCount: 0,
      records: [],
    }),
}));
