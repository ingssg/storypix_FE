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

// OPENAI 관련 전역 상태

interface RealtimeAPIState {
  currentQuestion: string;
  currentAnswer: string;
  isSessionStarted: boolean;
  template: string; // 모든 동화 기본 인스트럭션
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
  fetchToken: () => Promise<{
    session: {
      client_secret: {
        value: string;
      };
    };
    instruction: string;
    remainedCount: number;
  } | null>;

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
  questionCount: 20, // 🔧 더미 데이터 사용 시 기본 질문 횟수 20으로 설정
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
      return params[key as keyof Params] || `{${key}}`; // 키가 없으면 원래 템플릿 유지
    });

    // 업데이트된 instructions 설정
    set({ instructions: updatedInstructions });
  },

  setQuestionCount: (updateFn) =>
    set((state) => ({ questionCount: updateFn(state.questionCount) })),

  // 유저 말 종료 알림
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
  // 유저 인풋 초기화
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
  // AI 응답 생성 요청
  sendCreateResponse: () => {
    const { dc } = useWebRTCStore.getState();
    const responseEvent = {
      type: "response.create",
    };
    if (dc && dc.readyState === "open") dc.send(JSON.stringify(responseEvent));
  },
  // 최초에 세션 초기화
  sendInitSession: () => {
    const { dc } = useWebRTCStore.getState();
    const responseEvent = {
      type: "session.update",
      session: {
        turn_detection: null, // push to talk
        input_audio_transcription: {
          model: "whisper-1",
        },
        temperature: 0.6,
      },
    };
    if (dc && dc.readyState === "open") {
      dc.send(JSON.stringify(responseEvent));
    }
  },

  // 인스트럭션 업데이트
  updateInstructions: (value) => {
    const { dc } = useWebRTCStore.getState();
    const responseEvent = {
      type: "session.update",
      session: {
        instructions: value,
        temperature: 0.6,
      },
    };
    if (dc && dc.readyState === "open") dc.send(JSON.stringify(responseEvent));
  },

  // openai 서버 이벤트 수신
  receiveServerEvent: () => {
    const { dc, closeWebRTCSession } = useWebRTCStore.getState();
    const { setQuestionCount, sendInitSession } = get();
    if (dc) {
      dc.addEventListener("message", (e) => {
        const serverEvent = JSON.parse(e.data);
        if (
          serverEvent.type ===
          "conversation.item.input_audio_transcription.completed"
        ) {
          const userMessage = serverEvent.transcript;
          set({ currentQuestion: userMessage });
          const userRecord: Record = {
            text: userMessage,
            isUser: true,
            createdAt: new Date(),
          };
          set((state) => ({ records: [...state.records, userRecord] }));
        }
        if (serverEvent.type === "response.audio_transcript.done") {
          const aiMessage = serverEvent.transcript;
          set({ currentAnswer: aiMessage });
          setQuestionCount((prevCount) => prevCount - 1);
          const aiRecord: Record = {
            text: aiMessage,
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
        // AI가 응답 만들기 시작
        if (serverEvent.type === "response.output_item.added") {
          set({ isAISpeaking: false });
        } // AI 음성 출력 완료
        if (serverEvent.type === "output_audio_buffer.stopped") {
          trackingPlayerEvent("story_ai_answer");
          if (get().questionCount > 0) {
            set({ isButtonVisible: true });
            return;
          }
          closeWebRTCSession();
        }
        // 세션 만료 이벤트
        if (serverEvent.type === "error") {
          if (serverEvent.error.code === "session_expired") {
            // ============================================
            // 🔧 백엔드 API 호출 주석 처리됨
            // ============================================
            // const disconnectAndReconnect = async () => {
            //   get().setIsOpenAIModal(false);
            //   await closeWebRTCSession();
            //   try {
            //     get()
            //       .fetchToken()
            //       .then(() => {
            //         useWebRTCStore.getState().createPeerConnection();
            //       });
            //   } catch (error) {
            //     console.error("토큰 요청 오류", error);
            //   }
            // };
            // disconnectAndReconnect();
          }
        }
      });
    }
  },
  // 서버에 질답 내용 보내기
  sendCommuication: async () => {
    if (get().records.length === 0) return;
    // ============================================
    // 🔧 백엔드 API 호출 주석 처리됨
    // ============================================
    // const { storyId, currentPageIdx, prevSentence, currSentence } =
    //   usePlayerStore.getState();
    // const communication: Communication = {
    //   storyId: storyId,
    //   openaiSessionId: get().sessionId,
    //   questionPage: currentPageIdx + 1,
    //   previousSentence: prevSentence,
    //   currentSentence: currSentence,
    //   records: get().records,
    //   createdAt: get().sessionCreatedAt,
    // };
    // await postCommuicationAPI(communication);
    set({ records: [] });
  },
  // 유저 말 입력 시작
  startUserQuestion: async () => {
    const { prevSentence, currSentence, titleEng, fullContent } =
      usePlayerStore.getState();
    const { sendInputClear, setInstructions } = get();
    setInstructions(titleEng, fullContent, prevSentence, currSentence);
    sendInputClear();
  },
  // 유저 말 입력 종료 후 AI 대답 생성 요청
  finishUserQuestion: async () => {
    // ============================================
    // 🔧 백엔드 API 호출 주석 처리됨
    // ============================================
    // const { storyId } = usePlayerStore.getState();
    const { sendInputSignal, sendCreateResponse } = get();
    const { closeWebRTCSession, audioElement } = useWebRTCStore.getState();
    try {
      // decreaseCommuiationCountAPI(storyId);
      sendInputSignal();
      sendCreateResponse();
    } catch {
      closeWebRTCSession();
    } finally {
      if (audioElement) audioElement.volume = 1;
    }
  },
  // ============================================
  // 🔧 프론트엔드에서 OpenAI Realtime API 임시 토큰 직접 받아오기
  // ============================================
  // 백엔드 서버에 임시토큰 요청 (이제 프론트엔드에서 직접 받아옴)
  fetchToken: async () => {
    const { storyId, setFullContent } = usePlayerStore.getState();
    const { setQuestionCount } = get();
    // ============================================
    // 🔧 questionCount는 초기값 20으로 유지, API 성공 시에만 업데이트
    // ============================================
    // setQuestionCount(() => 0); // 제거: 초기값 20 유지

    try {
      // OpenAI Realtime API에서 세션 생성하여 임시 토큰 받아오기
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) {
        console.error("NEXT_PUBLIC_OPENAI_API_KEY가 설정되지 않았습니다.");
        return null;
      }

      const response = await fetch(
        "https://api.openai.com/v1/realtime/sessions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(
          "OpenAI 세션 생성 실패:",
          response.status,
          await response.text()
        );
        return null;
      }

      const sessionData = await response.json();

      // OpenAI Realtime API 응답 형식:
      // {
      //   "id": "session_id",
      //   "client_secret": {
      //     "value": "ephemeral_key"
      //   }
      // }

      // 기존 백엔드 응답 형식과 호환되도록 변환
      const token = {
        session: {
          client_secret: {
            value:
              sessionData.client_secret?.value || sessionData.client_secret,
          },
        },
        instruction: "", // 더미 데이터 사용 시 빈 문자열
        remainedCount: 20, // 🔧 기본 질문 횟수 20으로 설정
      };

      // ============================================
      // 🔧 fullContent는 tale/page.tsx에서 더미 데이터 설정 시 설정됨
      // fetchToken에서는 instruction만 설정 (더미 데이터 사용 시 빈 문자열)
      // ============================================
      // setFullContent(token.instruction); // 제거: tale/page.tsx에서 설정
      // ============================================
      // 🔧 questionCount는 세션 재생성 시에도 유지되도록 설정하지 않음
      // 초기 로드 시에만 20으로 설정되고, 이후 세션 재생성 시에는 현재 값 유지
      // ============================================
      // setQuestionCount(() => token.remainedCount); // 제거: 현재 값 유지

      return token;
    } catch (error) {
      console.error("임시 토큰 요청 오류:", error);
      return null;
    }
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
