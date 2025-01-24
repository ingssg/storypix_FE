'use client';

import React, { useRef, useState } from "react";
import Image from "next/image";
import PlayController from "./playerHover/playController";
import SettingModal from "./playerHover/settingModal";

const PlayerHover = () => {

  const controller = useRef<HTMLDivElement>(null);
  const [isOpenController, setIsOpenController] = useState(false);
  const [isOpenSettings, setIsOpenSettings] = useState(false);

  const toggleController = (e: React.MouseEvent<HTMLDivElement>) => {
    if(isOpenSettings) {
      setIsOpenSettings(false);
      return;
    }
    setIsOpenController(!isOpenController);
    e.stopPropagation();
  };

  const openSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpenSettings(true);
    e.stopPropagation();
  }

  const closeSettings = () => {
    setIsOpenSettings(false);
  }

  return (
    <div
      className="w-full h-full absolute top-0 left-0 z-10"
      onClick={toggleController}
    >
      <div
        className={`controller w-full h-full flex justify-center items-center absolute bg-black bg-opacity-70 ${
          isOpenController ? "" : "hidden"
        }`}
        ref={controller}
      >
        <p className="text-white absolute top-8 left-8 w-80 truncate font-semibold text-sm">
          The Lion and the Mouse
        </p>
        <div className="absolute top-1 right-5">
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
        {isOpenSettings && (<SettingModal onClose={closeSettings} />)}
      </div>
    </div>
  );
};

export default PlayerHover;
