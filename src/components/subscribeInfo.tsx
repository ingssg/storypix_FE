import { useModalStore } from "@/app/store/animateStore";
import { formatDate } from "@/utils/formatDate";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

type SubscribeInfoProps = {
  subscribeInfo: {
    status: string;
    renewsAt: string;
    createdAt: string;
  } | null;
  onClose: (value: boolean) => void;
};

const SubscribeInfo = ({ subscribeInfo, onClose }: SubscribeInfoProps) => {
  const [renewsAt, setRenewsAt] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const { setIsRenewModalOpen, setIsSidebarOpen } = useModalStore();

  const router = useRouter();
  const startSubscribe = () => {
    router.push("/subscribe");
    onClose(false);
  };

  const renewSubscribe = () => {
    setIsRenewModalOpen(true);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (!subscribeInfo) return;
    setRenewsAt(formatDate(subscribeInfo.renewsAt) || "");
    setCreatedAt(formatDate(subscribeInfo.createdAt) || "");
  }, [subscribeInfo]);

  if (!subscribeInfo)
    return (
      <button
        type="button"
        className="bg-[#FF7134] rounded-lg w-24 text-white p-1 font-semibold text-[0.6rem]"
        onClick={startSubscribe}
      >
        스토리패스 구독하기
      </button>
    );

  return (
    <div className="flex flex-col gap-1 pb-4 font-semibold text-[0.6rem] border-b-[1px] border-[#D4DADF]">
      <button
        type="button"
        className={`rounded-lg w-24 p-1 ${
          (subscribeInfo.status === "cancelled" || subscribeInfo.status === "paused")
            ? "bg-inherit border-[2px] border-[#5A5C6338] text-[#989BA2]"
            : "text-white bg-[#FF7134]"
        }`}
        disabled={
          subscribeInfo.status === "active" ||
          subscribeInfo.status === "cancelled" ||
          subscribeInfo.status === "paused"
        }
      >
        {subscribeInfo.status === "active" && "스토리패스 구독중"}
        {(subscribeInfo.status === "cancelled" || subscribeInfo.status === "paused") && "구독 종료 예정"}
      </button>
      {subscribeInfo.status === "active" && (
        <div className="text-[#5A5C63] font-medium">
          <div className="flex items-center mb-1">
            <span className="w-16">구독 기간</span>
            <span className="text-[#46474C]">{createdAt + "~" + renewsAt}</span>
          </div>
          <div className="flex items-center">
            <span className="w-16">다음 결제일</span>
            <span className="text-[#46474C]">{renewsAt}</span>
          </div>
        </div>
      )}
      {subscribeInfo.status === "cancelled" || subscribeInfo.status === "paused" && (
        <div className="text-[#5A5C63] font-medium">
          <div className="flex items-center">
            <span className="w-16">구독 기간</span>
            <span className="text-[#46474C]">{createdAt + "~" + renewsAt}</span>
          </div>
          <button type="button" className="underline" onClick={renewSubscribe}>
            구독 재개하기
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscribeInfo;
