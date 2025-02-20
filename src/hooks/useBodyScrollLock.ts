'use client';

import { useEffect } from "react";

// 모달이 열렸을 때 body 스크롤을 막는다.
export const useBodyScrollLock = (isOpenModal: boolean) => {
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isOpenModal) {
        document.body.style.overflow = "hidden";
        return;
      }
      document.body.style.overflow = "";
  
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpenModal]);
};
