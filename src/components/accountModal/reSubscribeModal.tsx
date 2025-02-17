import React, { useEffect, useState } from "react";
import Image from "next/image";
import { apiClient } from "@/app/lib/apiClient";
import aiSpeakAnimation from "@/animation/AISpeak.json";
import dynamic from "next/dynamic";
import { useModalStore } from "@/app/store/animateStore";

type Props = {
  renewsAt: string;
  onClose: () => void;
};

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

const ReSubscribeModal = ({ renewsAt, onClose }: Props) => {
  const [isRenewStart, setIsRenewStart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const { setIsSidebarOpen } = useModalStore();

  const renewSubscribe = async () => {
    setIsLoading(true);
    setIsRenewStart(true);
    try {
      await apiClient.patch("/payment");
      setIsSuccess(true);
    } catch (error) {
      console.log(error, "구독 재개 에러");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setIsSidebarOpen(true);
    };
  }, []);

  const modalStyle =
    "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] bg-white rounded-lg px-6 py-5 w-64";

  return !isRenewStart ? (
    <div className={modalStyle}>
      <div className="flex flex-col justify-center items-center gap-6 text-[#5A5C63]">
        <h1 className="font-semibold">구독을 재개하시겠어요?</h1>
        <button className="absolute top-5 right-3 p-1" onClick={onClose}>
          <Image src="/images/x_icon.svg" alt="close" width={12} height={20} />
        </button>
        <div className="flex flex-col text-xs font-medium">
          <p>
            현재 구독 취소 상태로, 다음 결제일에 스토리패스 구독 혜택이 종료될
            예정입니다.
          </p>
          <br />
          <p>
            구독을 재개하시면, 기존 결제일에 예정된 결제가 그대로 이루어지며
            서비스 이용을 계속하실 수 있습니다.
          </p>
          <br />
          <p className="font-bold">다음 결제일: {renewsAt}</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            renewSubscribe();
            e.stopPropagation();
          }}
          className="w-full rounded-lg text-sm bg-[#FF7134] text-white py-[0.375rem] font-semibold"
        >
          구독 재개하기
        </button>
      </div>
    </div>
  ) : isLoading ? (
    <div
      className={`${modalStyle} flex flex-col justify-center items-center gap-6`}
    >
      <h1 className="font-semibold text-[#5A5C63]">잠시만 기다려주세요</h1>
      <div className="w-[3.75rem] h-[3.75rem]">
        <Lottie
          loop
          animationData={aiSpeakAnimation}
          play
          className="w-[3.75rem] h-[3.75rem]"
        />
      </div>
    </div>
  ) : (
    <div
      className={`${modalStyle} flex flex-col justify-center items-center gap-6 text-[#5A5C63]`}
    >
      <h1 className="font-semibold">
        {isSuccess ? "구독이 재개되었어요!" : "구독 재개에 실패했어요"}
        <button className="absolute top-5 right-3 p-1" onClick={onClose}>
          <Image src="/images/x_icon.svg" alt="close" width={12} height={20} />
        </button>
      </h1>
      {isSuccess ? (
        <div className="flex flex-col gap-6 text-xs font-medium justify-center items-center">
          <Image
            src={"/images/resubSuccess.png"}
            alt="reSubSuccessImg"
            width={200}
            height={56}
          />
          <p>다시 구독해주셔서 감사합니다.</p>
        </div>
      ) : (
        <p className="text-center text-xs font-medium">
          불편을 드려 죄송합니다. <br />
          productcamp@teamsparta.co로 재개 요청 메일을 보내주시면 2영업일 이내에
          처리해드리겠습니다.{" "}
        </p>
      )}
      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-lg text-sm bg-[#FF7134] text-white py-[0.375rem] font-semibold"
      >
        {isSuccess ? "이야기 살펴보기" : "확인"}
      </button>
    </div>
  );
};

export default ReSubscribeModal;
