"use client";

import React from "react";
import Image from "next/image";
import PageController from "./pageController";
import { usePlayerStore } from "@/app/store/playerStore";
import { trackingPlayerEvent } from "@/utils/gtagFunc";

const PlayController = () => {
  const {
    playPrevSentence,
    playNextSentence,
    playHandler,
    stopHandler,
    isPlaying,
  } = usePlayerStore();

  return (
    <div
      className="flex items-center justify-center gap-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <PageController className="-bottom-24" />
      <button
        className="mt-5 flex flex-col items-center"
        onClick={() => {
          playPrevSentence();
          trackingPlayerEvent("story_sentence_turn");
        }}
      >
        <Image
          src="/images/playerHover/leftArrow.svg"
          alt="prev"
          width={40}
          height={40}
        />
        이전 문장
      </button>
      {!isPlaying ? (
        <button
          className=""
          onClick={() => {
            playHandler();
            trackingPlayerEvent("story_play_click");
          }}
        >
          ;
          <Image
            src="/images/playerHover/playIcon.svg"
            alt="play"
            width={80}
            height={80}
          />
        </button>
      ) : (
        <button
          className=""
          onClick={() => {
            stopHandler();
            trackingPlayerEvent("story_stop_click");
          }}
        >
          <Image
            src="/images/playerHover/pauseIcon.svg"
            alt="stop"
            width={80}
            height={80}
          />
        </button>
      )}
      <button
        className="mt-5 flex flex-col items-center"
        onClick={() => {
          playNextSentence();
          trackingPlayerEvent("story_sentence_turn");
        }}
      >
        <Image
          src="/images/playerHover/leftArrow.svg"
          alt="next"
          width={40}
          height={40}
          className="rotate-180"
        />
        다음 문장
      </button>
    </div>
  );
};

export default PlayController;
