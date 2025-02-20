"use client";

import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
// import WithAuth from "@/components/HOC/withAuth";

const LogOutModal = dynamic(() => import("@/components/accountModal/logoutModal"));
const AccountDeletionModal = dynamic(() => import("@/components/accountModal/accountDeletionModal"));

const Account = () => {
  const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const router = useRouter();

  const openDeletionModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsDeletionModalOpen(true);
    e.stopPropagation();
  };

  const openLogoutModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLogoutModalOpen(true);
    e.stopPropagation();
  };

  const closeDeletionModal = () => {
    setIsDeletionModalOpen(false);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  useBodyScrollLock(isDeletionModalOpen);
  useBodyScrollLock(isLogoutModalOpen);

  return (
    <div
      className="bg-[#FFF6EE] h-screen absolute w-full pt-14 max-w-[1400px]"
      onClick={() => {
        closeDeletionModal();
        closeLogoutModal();
      }}
    >
      <button
        type="button"
        className="mt-7 ml-5"
        onClick={() => router.back()}
      >
        <Image
          src={"/images/playerHover/nextPageIcon.svg"}
          alt="goBackButton"
          width={10}
          height={50}
          className="rotate-180 filter invert"
        />
      </button>
      <div className="flex flex-col items-start justify-center p-5">
        <p className="w-full border-b-[1px] border-[#989BA2] pb-3 font-bold text-xl">
          계정관리
        </p>
        <div className="flex flex-col gap-3 mt-3 text-[#5A5C63]">
          <button type="button" onClick={openLogoutModal}>
            로그아웃
          </button>
          <button type="button" onClick={openDeletionModal}>
            회원탈퇴
          </button>
        </div>
      </div>
      {isDeletionModalOpen && (
        <AccountDeletionModal onClose={closeDeletionModal} />
      )}
      {isLogoutModalOpen && <LogOutModal onClose={closeLogoutModal} />}
    </div>
  );
};

export default Account;
// export default WithAuth(Account);
