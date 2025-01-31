'use client';

import React, { useState } from "react";
import Image from "next/image";
import { FiMenu } from "react-icons/fi";
import AccountInfo from "@/components/accountModal/accountInfo";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useRouter } from "next/navigation";

const ServiceGNB = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [hasLogin, setHasLogin] = useState(false);
  const router = useRouter();

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  const goHome = () => {
    router.push("/");
  }

  useBodyScrollLock(isOpenModal);

  return (
    <div className="w-full fixed flex justify-center items-center py-2 bg-white z-10">
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
        width={130}
        height={50}
        onClick={goHome}
      />
      {isOpenModal && <AccountInfo hasLogin={hasLogin} setHasLogin={setHasLogin} onClose={setIsOpenModal}/>}

    </div>
  );
};

export default ServiceGNB;
