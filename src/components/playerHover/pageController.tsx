"use client";

import React from "react";
import Image from "next/image";
import { usePlayerStore } from "@/app/store/playerStore";
import { trackingPlayerEvent } from "@/utils/gtagFunc";

type Props = {
  className?: string;
};

// 페이키 이동 컨트롤러
const PageController = ({ className }: Props) => {
  const {
    storyContents,
    currentPageIdx,
    playNextPage,
    playPrevPage,
    totalPage,
  } = usePlayerStore();

  return (
    <div
      className={`flex items-center justify-between bg-[#46474C99] bg-opacity-60 rounded-full w-44 h-10 absolute ${className}`}
    >
      <button
        className="p-4"
        onClick={() => {
          playPrevPage();
          trackingPlayerEvent("story_page_turn");
        }}
      >
        <Image
          src={"/images/playerHover/nextPageIcon.svg"}
          alt="prevPage"
          width={10}
          height={50}
          className="rotate-180"
        />
      </button>
      {storyContents && (
        <p className="font-semibold text-sm">
          <span className="font-bold">
            Page {storyContents[currentPageIdx].page}
          </span>{" "}
          / {totalPage}
        </p>
      )}
      <button
        className="p-4"
        onClick={() => {
          playNextPage();
          trackingPlayerEvent("story_page_turn");
        }}
      >
        <Image
          src={"/images/playerHover/nextPageIcon.svg"}
          alt="nextPage"
          width={10}
          height={50}
        />
      </button>
    </div>
  );
};

export default PageController;
