import { create } from "zustand";
import { useRealtimeAPIStore } from "./realtimeAPIStore";

interface WebRTCState {
  peerConnection: RTCPeerConnection | null;
  ephemeralKey: string;
  sdp: RTCSessionDescriptionInit | null;
  dc: RTCDataChannel | null;
  audioElement: HTMLAudioElement | null;
  ms: MediaStream | null;

  setPeerConnection: (value: RTCPeerConnection | null) => void;
  setEphemeralKey: (value: string) => void;
  setSdp: (value: RTCSessionDescriptionInit | null) => void;
  setDc: (value: RTCDataChannel | null) => void;

  createPeerConnection: () => Promise<void>;
  createAndSendOffer: () => Promise<void>;
  createDataChannel: () => void;
  connectRealtimeAPI: () => void;

  closeWebRTCSession: () => void;
}

export const useWebRTCStore = create<WebRTCState>((set, get) => ({
  peerConnection: null,
  ephemeralKey: "",
  sdp: null,
  dc: null,
  audioElement: null,
  ms: null,

  setPeerConnection: (value) => set({ peerConnection: value }),
  setEphemeralKey: (value) => set({ ephemeralKey: value }),
  setSdp: (value) => set({ sdp: value }),
  setDc: (value) => set({ dc: value }),

  createPeerConnection: async () => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    if (typeof document !== "undefined") {
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      // audioEl.setAttribute("playsinline", "true");
      set({ audioElement: audioEl });

      peerConnection.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };
    }

    set({ peerConnection });
  },

  // Create offer and send it to the server
  createAndSendOffer: async () => {
    const { peerConnection, ephemeralKey, setSdp } = get();

    if (!peerConnection || !ephemeralKey) {
      console.error("PeerConnection or EphemeralKey is not initialized");
      return;
    }

    const constraints = {
      audio: {
        echoCancellation: false,  
        noiseSuppression: false,  
        autoGainControl: false,   
      }
    };

    const ms = await navigator.mediaDevices.getUserMedia(constraints);
    set({ ms });
    peerConnection.addTrack(ms.getTracks()[0]);

    // Create and set local offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Send SDP offer to the server
    const baseUrl = "https://api.openai.com/v1/realtime";
    const model = "gpt-4o-mini-realtime-preview-2024-12-17";
    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${ephemeralKey}`,
        "Content-Type": "application/sdp",
      },
    });

    const SDP = await sdpResponse.text();

    if (!sdpResponse.ok) {
      console.error("SDP 요청 실패", sdpResponse.status, SDP);
      return;
    }

    const sdpObject: RTCSessionDescriptionInit = {
      type: "answer",
      sdp: SDP,
    };

    setSdp(sdpObject);

    try {
      await peerConnection.setRemoteDescription(sdpObject);
    } catch (error) {
      console.error("Error setting remote description", error);
    }
  },

  createDataChannel: () => {
    const { peerConnection } = get();
    if (!peerConnection) {
      console.error("PeerConnection is not initialized");
      return;
    }

    const dc = peerConnection.createDataChannel("dataChannel");
    set({ dc });
  },

  connectRealtimeAPI: async () => {
    const { createDataChannel, createAndSendOffer } = get();
    createDataChannel();
    await createAndSendOffer();
  },

  closeWebRTCSession: () => {
    const {
      peerConnection,
      setPeerConnection,
      setSdp,
      setDc,
      audioElement,
      ms,
    } = get();

    if (peerConnection) {
      console.log("WebRTC 세션 종료 중...");

      peerConnection.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });

      peerConnection.getReceivers().forEach((receiver) => {
        if (receiver.track) {
          receiver.track.stop();
        }
      });

      peerConnection.close();

      peerConnection.ontrack = null;

      if (ms) {
        ms.getTracks().forEach((track) => {
          track.stop();
        });
      }

      setPeerConnection(null);
      setSdp(null);
      setDc(null);

      if (audioElement) {
        audioElement.srcObject = null;
      }
      console.log("WebRTC 세션 종료 완료");
    } else {
      console.log("종료할 WebRTC 세션이 없습니다.");
    }
    useRealtimeAPIStore.getState().setIsSessionStarted(false);
  },
}));
