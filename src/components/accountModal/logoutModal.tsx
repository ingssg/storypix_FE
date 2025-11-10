import React from "react";
import Image from "next/image";
// ============================================
// 🔧 백엔드 없이 동작하도록 import 주석 처리됨
// ============================================
// import { signout } from "@/app/services/userService";
import { trackingEvent } from "@/utils/gtagFunc";
import { getNickName } from "@/utils/stores";

type Props = {
  onClose: () => void;
};

const LogOutModal = ({ onClose }: Props) => {
  const modalClose = () => onClose();

  const handleLogout = async () => {
    // ============================================
    // 🔧 백엔드 API 호출 주석 처리됨
    // ============================================
    // try {
    //   await signout();
    //   modalClose();
    //   trackingEvent("sign_out", {"user_id": getNickName()});
    //   localStorage.removeItem("nickname");
    //   window.location.href = "/list";
    // } catch (error) {
    //   console.error(error);
    // }
    modalClose();
    trackingEvent("sign_out", {"user_id": getNickName()});
    localStorage.removeItem("nickname");
    window.location.href = "/list";
  };

  return (
    <div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-64 bg-[#F6F6F6] flex flex-col shadow-custom justify-center items-center p-5 gap-3 rounded-lg relative">
        <button className="absolute top-5 right-4" onClick={modalClose}>
          <Image src="/images/x_icon.svg" alt="close" width={12} height={20} />
        </button>
        <p className="font-medium text-lg text-[#5A5C63]">로그아웃</p>
        <p className="text-sm text-[#5A5C63]">정말 로그아웃 하시겠어요?</p>
        <div className="flex gap-2">
          <button
            className="bg-[#FF7134] rounded-lg w-24 text-white p-1"
            onClick={modalClose}
          >
            취소
          </button>
          <button
            className="bg-[#E8E8E8] rounded-lg w-16 text-[#5A5C63] p-1"
            onClick={handleLogout}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogOutModal;
