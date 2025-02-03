import { useRouter } from "next/navigation";
import React from "react";

type SubscribeInfoProps = {
  subscribeInfo: {
    status: string;
    renewsAt: string;
    createdAt: string;
  } | null;
  onClose: (value: boolean) => void;
};

const SubscribeInfo = ({subscribeInfo, onClose}: SubscribeInfoProps) => {
  const router = useRouter();
  const startSubscribe = () => {
    router.push("/subscribe");
    onClose(false);
  }

  if(!subscribeInfo) return (
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
        className={`${"bg-[#FF7134]"} rounded-lg w-24 text-white p-1 ${
          subscribeInfo.status === "paused" &&
          "bg-inherit border-[1px] border-[#5A5C6338] text-[#5A5C6338]"
        }`}
        disabled={subscribeInfo.status === "active" || subscribeInfo.status === "paused"}
      >
        {subscribeInfo.status === "active" && "스토리패스 구독중"}
        {subscribeInfo.status === "paused" && "구독 종료 예정"}
      </button>
      {subscribeInfo.status === "active" && (
        <div className="text-[#5A5C63] font-medium">
          <div className="flex items-center">
            <span className="w-16 mb-1">구독 기간</span>
            <span className="text-[#46474C]">
              {subscribeInfo.createdAt + "~" + subscribeInfo.renewsAt}
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-16">다음 결제일</span>
            <span className="text-[#46474C]">{subscribeInfo.renewsAt}</span>
          </div>
        </div>
      )}
      {subscribeInfo.status === "paused" && (
        <div className="text-[#5A5C63] font-medium">
          <div className="flex items-center">
            <span className="w-16 mb-1">구독 기간</span>
            <span className="text-[#46474C]">
              {subscribeInfo.createdAt + "~" + subscribeInfo.renewsAt}
            </span>
          </div>
          <button type="button" className="underline" onClick={startSubscribe}>
            다시 구독하기
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscribeInfo;
