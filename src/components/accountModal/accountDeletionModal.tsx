import { deleteUser } from "@/app/services/userService";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  onClose: () => void;
};

const AccountDeletionModal = ({ onClose }: Props) => {
  const router = useRouter();

  const modalClose = () => onClose();
  const [inputValue, setInputValue] = useState("");
  const deleteAccount = () => {
    try {
      deleteUser();
    } catch (error) {
      console.log(error, "회원탈퇴 에러");
    }
    modalClose();
    router.push("/");
  };

  return (
    <div className="fixed top-16 w-screen h-screen bg-opacity-0 flex justify-center items-center z-10">
      <div className="w-64 bg-[#F6F6F6] flex flex-col shadow-custom mb-16 justify-center items-center p-5 gap-3 rounded-lg relative">
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
          onChange={(e) => setInputValue(e.target.value)}
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
