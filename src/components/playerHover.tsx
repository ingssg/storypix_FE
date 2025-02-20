"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PlayController from "./playerHover/playController";
import SettingModal from "./playerHover/settingModal";
import { usePlayerStore } from "@/app/store/playerStore";
import { useRouter } from "next/navigation";
import { trackingPlayerEvent } from "@/utils/gtagFunc";
import { AnimatePresence, motion } from "framer-motion";

const PlayerHover = () => {
  const {
    titleEng,
    isHoverOpen,
    setIsHoverOpen,
    isPlaying,
    resetHoverTimer,
    hoverTimer,
    setHoverTimer,
  } = usePlayerStore();

  const controller = useRef<HTMLDivElement>(null);
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const router = useRouter();

  const toggleController = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpenSettings) {
      setIsOpenSettings(false);
      return;
    }
    setIsHoverOpen(!isHoverOpen);
    e.stopPropagation();
  };

  const openSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpenSettings(true);
    e.stopPropagation();
  };

  const closeSettings = () => {
    setIsOpenSettings(false);
  };

  useEffect(() => {
    if (isHoverOpen && isPlaying) {
      resetHoverTimer();
      return;
    }
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  }, [isPlaying, isHoverOpen]);

  return (
    <div
      className="w-full h-dvh absolute top-0 left-0 z-10"
      onClick={toggleController}
    >
      <AnimatePresence>
        {isHoverOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-full h-full flex justify-center items-center absolute bg-black bg-opacity-70`}
            ref={controller}
          >
            <p className="absolute top-8 left-8 flex items-center gap-2">
              <button
                className="p-1"
                onClick={() => {
                  router.push("/list");
                  trackingPlayerEvent("story_back_click");
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
              <span className="text-white truncate font-semibold text-sm w-80">
                {titleEng}
              </span>
            </p>
            <div className="absolute top-2 right-5">
              <button className="p-1" onClick={openSettings}>
                <Image
                  src="/images/setting_icon.svg"
                  alt="settings"
                  width={60}
                  height={40}
                />
              </button>
            </div>
            <PlayController />
            {isOpenSettings && <SettingModal onClose={closeSettings} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayerHover;
