"use client";

import { subscribeAPI } from "@/app/services/purchaseService";
import WithAuth from "@/components/HOC/withAuth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Subscribe = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutURL, setCheckoutURL] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getCheckoutURL = async () => {
    try {
      const { checkoutUrl } = await subscribeAPI();
      setCheckoutURL(checkoutUrl);
      // const dummy = "https://dougie.lemonsqueezy.com/checkout/custom/c2242bc8-a829-4c83-a8ef-c2a94dece7db?signature=33de5fa421262acaffa9612e86129ccccf9e10d6e395eb1d7d28e07209e64749"
      // setCheckoutURL(dummy);
    } catch (error) {
      console.log(error);
    }
  };

  const startSubscribe = async () => {
    setIsCheckoutOpen(true);
    getCheckoutURL();
  };

  useEffect(() => {
    if (checkoutURL) {
      setIsLoading(false);
    }
  }, [checkoutURL]);

  return (
    <>
      {isCheckoutOpen ? (
        !isLoading ? (
          <div className="pt-12 flex flex-col items-center h-screen">
            <iframe src={checkoutURL} className="w-full h-full" />
          </div>
        ) : (
          null
        )
      ) : (
        <div className="pt-12 w-full h-screen">
          <button
            type="button"
            className="mt-7 ml-5"
            onClick={() => router.push("/list")}
          >
            <Image
              src={"/images/playerHover/nextPageIcon.svg"}
              alt="goBackButton"
              width={10}
              height={50}
              className="rotate-180 filter invert"
            />
          </button>
          <div className="flex flex-col items-center mx-5 h-full">
            <Image
              src="/images/storypixie.svg"
              alt="storypixie"
              width={105}
              height={150}
            />
            <div
              className="w-screen bg-contain h-full"
              style={{
                backgroundImage: `url(${"/images/subscribeGradient.svg"})`,
              }}
            >
              <p className="text-center text-3xl font-bold mt-5 mb-3">
                스토리픽스 <br />
                콘텐츠 정기구독
              </p>
              <div className="mx-5 mb-12">
                <p className="font-semibold text-[#46474C] mb-10 text-center">
                  월구독으로 모든 작품을 무제한 감상하세요
                </p>
                <div className="flex flex-col border-2 rounded-2xl w-full py-6 px-5 bg-white">
                  <div className="border-b-2 border-[#F8EAE4]">
                    <Image
                      src={"/images/subscribeImg.svg"}
                      alt="storypix_subscribe"
                      width={40}
                      height={40}
                    />
                    <p className="mt-3 mb-7 font-bold text-2xl text-[#FF7134]">
                      스토리패스
                    </p>
                    <p className="pb-7 font-bold text-[#292A2D] text-xl flex items-center gap-[0.375rem]">
                      15,000 원
                      <span className="text-[#797075] font-medium text-xs">
                        /월
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-[0.375rem] font-medium text-[#46474C] text-xs mt-7">
                    <p className="flex gap-2">
                      <Image
                        src={"/images/checkImg.svg"}
                        alt="check"
                        width={20}
                        height={20}
                      />
                      모든 작품 무제한 감상
                    </p>
                    <p className="flex gap-2">
                      <Image
                        src={"/images/checkImg.svg"}
                        alt="check"
                        width={20}
                        height={20}
                      />
                      미국식 영어 발음과 억양을 가진 AI의 동화구연
                    </p>
                    <p className="flex gap-2">
                      <Image
                        src={"/images/checkImg.svg"}
                        alt="check"
                        width={20}
                        height={20}
                      />
                      아이의 질문에 친절하게 답변하는 AI 친구 (일일 사용량 제한)
                    </p>
                    <p className="flex gap-2">
                      <Image
                        src={"/images/checkImg.svg"}
                        alt="check"
                        width={20}
                        height={20}
                      />
                      동화구연 속도 및 AI 친구 언어 설정 (한국어/영어)
                    </p>
                  </div>
                </div>
                <button
                  className="w-full bg-[#FF7134] text-white rounded-lg h-11 mt-5 mb-2 py-3 font-bold text-sm"
                  type="button"
                  onClick={startSubscribe}
                >
                  스토리패스 구독 시작하기
                </button>
                <p className="text-xs text-[#5A5C63] font-medium text-center">
                  매월 15,000원 자동 결제
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WithAuth(Subscribe);
