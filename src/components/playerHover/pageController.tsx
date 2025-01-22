import React from "react";
import Image from "next/image";
import { usePlayerStore } from "@/app/store/playerStore";

type Props = {
  className?: string;
};

const PageController = ({ className }: Props) => {
  const { storyContents, currentPageIdx, playNextPage, playPrevPage } =
    usePlayerStore();

  return (
    <div
      className={`flex items-center justify-between bg-[#46474C99] bg-opacity-60 rounded-full w-44 h-10 absolute ${className}`}
    >
      <button className="p-4" onClick={playPrevPage}>
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
          / {storyContents.length}
        </p>
      )}
      <button className="p-4" onClick={playNextPage}>
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
