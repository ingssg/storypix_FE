import { deleteUser } from "@/app/services/userService";
import { trackingEvent } from "@/utils/gtagFunc";
import { getNickName } from "@/utils/stores";
import Image from "next/image";
import React, { useState } from "react";

type Props = {
  onClose: () => void;
};

const AccountDeletionModal = ({ onClose }: Props) => {

  const modalClose = () => onClose();
  const [inputValue, setInputValue] = useState("");
  const deleteAccount = async () => {
    try {
      await deleteUser();
      modalClose();
      trackingEvent("account_deactivate", {"user_id": getNickName()});
      localStorage.removeItem("nickname");
      window.location.href = "/list";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" onClick={(e) => e.stopPropagation()}>
      <div className="w-64 bg-[#F6F6F6] flex flex-col shadow-custom justify-center items-center p-5 gap-3 rounded-lg relative">
        <button className="absolute top-5 right-4" onClick={modalClose}>
          <Image src="/images/x_icon.svg" alt="close" width={12} height={20} />
        </button>
        <p className="font-medium text-lg text-[#5A5C63]">회원탈퇴</p>
        <p className="text-sm text-[#5A5C63]">
          &apos;회원탈퇴&apos;를 입력해주세요.
        </p>
        <input
          className="w-full border-[1px] rounded-lg h-8 flex items-center pl-2"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.slice(0, 4))}
        />
        <button
          className={`bg-[#E8E8E8] rounded-lg text-[#5A5C63] p-1 w-36 ${inputValue === "회원탈퇴" ? "bg-[#FF7134] text-white": ""}`}
          onClick={deleteAccount}
          disabled={inputValue !== "회원탈퇴"}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default AccountDeletionModal;
