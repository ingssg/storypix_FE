import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  onClose: () => void;
};

const LogOutModal = ({ onClose }: Props) => {
  const router = useRouter();

  const modalClose = () => onClose();
  const handleLogout = () => {
    router.push("/");
    modalClose();
  };
  return (
    <div className="fixed top-16 w-screen h-screen bg-opacity-0 flex justify-center items-center z-10">
      <div className="w-64 bg-[#F6F6F6] flex flex-col shadow-custom mb-16 justify-center items-center p-5 gap-3 rounded-lg relative">
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
