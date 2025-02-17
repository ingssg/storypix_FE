import { usePlayerStore } from "@/app/store/playerStore";
import { getNickName } from "./stores";

export const trackingEvent = (event: string, params: Record<string, unknown> = {}) => {
  if (window.gtag) {
    window.gtag("event", event, params);
  }
};

export const trackingPlayerEvent = (event: string, params: Record<string, unknown> = {}) => {
  const { storyId } = usePlayerStore.getState();
  if (window.gtag) {
    params.story_id = storyId;
    params.user_id = getNickName();
    params.timestamp = Date.now();
    window.gtag("event", event, params);
  }
}
