"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiMenu } from "react-icons/fi";
import AccountInfo from "@/components/accountModal/accountInfo";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useUserStore } from "@/app/store/userStore";

const ServiceGNB = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const router = useRouter();
  const gnbRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const logoWidth = 130;
  const [nicknameWidth, setNicknameWidth] = useState<number | null>(null);
  const [nickname, setNickname] = useState("");
  const { hasLogin } = useUserStore();

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  const goList = () => {
    setIsOpenModal(false);
    router.push("/list");
  };

  
  useEffect(() => {
    const calculateNameElWidth = () => {
      if (gnbRef.current && logoRef.current) {
        const gnbRightWidth = gnbRef.current.getBoundingClientRect().right;
        const logoRightWidth = logoRef.current.getBoundingClientRect().right;
        setNicknameWidth(gnbRightWidth - logoRightWidth - 18 - 16); // 로고랑 18, mr-4 16
      }
      return 0;
    };
    calculateNameElWidth();
    window.addEventListener("resize", calculateNameElWidth);
    return () => {
      window.removeEventListener("resize", calculateNameElWidth);
    };
  }, []);

  useEffect(() => {
    if(hasLogin)
      setNickname(localStorage.getItem("nickname") || "");
  }, [hasLogin])

  useBodyScrollLock(isOpenModal);

  return (
    <div
      className="w-full fixed flex justify-center items-center py-2 bg-white z-10 max-w-[1400px] h-[46px]"
      ref={gnbRef}
    >
      <button
        className="flex items-center absolute left-4 text-2xl w-20 h-full"
        onClick={toggleModal}
        type="button"
      >
        <FiMenu />
      </button>
      <Image
        src="/images/gnb_logo.svg"
        alt="storypix_logo"
        width={logoWidth}
        height={50}
        onClick={goList}
        className="cursor-pointer"
        ref={logoRef}
      />
      {hasLogin && (
        <p
          className="flex gap-1 absolute right-4 h-full items-center justify-end text-xs font-medium"
          style={{
            width: nicknameWidth !== null ? `${nicknameWidth}px` : "auto",
          }}
        >
          <span className="truncate">{nickname}</span>
          <span className="text-[#5A5C63] font-normal">님</span>
        </p>
      )}
      <AnimatePresence>
        {isOpenModal && (
          <AccountInfo
            onClose={setIsOpenModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceGNB;
