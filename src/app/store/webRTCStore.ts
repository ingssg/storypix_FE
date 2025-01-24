import { create } from "zustand";

interface WebRTCState {
  peerConnection: RTCPeerConnection | null;
  ephemeralKey: string;
  sdp: RTCSessionDescriptionInit | null;
  dc: RTCDataChannel | null;
  audioElement: HTMLAudioElement | null;

  setPeerConnection: (value: RTCPeerConnection | null) => void;
  setEphemeralKey: (value: string) => void;
  setSdp: (value: RTCSessionDescriptionInit) => void;
  setDc: (value: RTCDataChannel) => void;

  createPeerConnection: () => Promise<void>;
  createAndSendOffer: () => Promise<void>;
  createDataChannel: () => void;
  connectRealtimeAPI: () => void;
}

export const useWebRTCStore = create<WebRTCState>((set, get) => ({
  peerConnection: null,
  ephemeralKey: "",
  sdp: null,
  dc: null,
  audioElement: null,

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

    // Handle ontrack event for remote audio
    if (typeof document !== "undefined") {
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      set({ audioElement: audioEl });

      peerConnection.ontrack = (e) => {
        // console.log("Remote track received:", e.streams[0]);
        audioEl.srcObject = e.streams[0];
      };
    }

    set({ peerConnection });
    // console.log(peerConnection);
    peerConnection.addEventListener("connectionstatechange", () => {
      // console.log("Connection State:", peerConnection.connectionState);
    });
  },

  // Create offer and send it to the server
  createAndSendOffer: async () => {
    const { peerConnection, ephemeralKey, setSdp } = get();

    if (!peerConnection || !ephemeralKey) {
      console.error("PeerConnection or EphemeralKey is not initialized");
      return;
    }

    const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
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

    // console.log("SDP 요청 성공", SDP);

    const sdpObject: RTCSessionDescriptionInit = {
      type: "answer",
      sdp: SDP,
    };

    setSdp(sdpObject);

    try {
      await peerConnection.setRemoteDescription(sdpObject);
      // console.log("Remote SDP 설정 완료");
    } catch (error) {
      // console.error("Error setting remote description", error);
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
    console.log("DataChannel created", dc);

    dc.addEventListener("open", () => {
      console.log("DataChannel opened");
    });

    // dc.addEventListener("message", (event) => {
    //   const serverEvent = JSON.parse(event.data);
    //   console.log("DataChannel message:", serverEvent);
    // });
  },

  connectRealtimeAPI: async () => {
    const { createDataChannel, createAndSendOffer } = get();
    createDataChannel();
    await createAndSendOffer();
  },
}));
