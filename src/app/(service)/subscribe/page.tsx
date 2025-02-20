"use client";

import { refreshClient } from "@/app/lib/apiClient";
// import withAuth from "@/components/HOC/withAuth";
import { trackingEvent } from "@/utils/gtagFunc";
import { getNickName } from "@/utils/stores";
import { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import React, { useEffect, useRef } from "react";

const Subscribe = () => {
  const router = useRouter();
  const isLemonLoaded = useRef<boolean>(false);
  const promotionCodeRef = useRef<string>("");
  const isEventHandlerSetted = useRef<boolean>(false);

  const getCheckoutURL = async () => {
    try {
      const { data } = await refreshClient.post("/payment");
      return data.checkoutUrl;
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof AxiosError && error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        const loginURL = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/kakao";
        window.location.href = loginURL;
      }
      if (error instanceof AxiosError && error.response?.status === 409) {
        alert("이미 구독 중입니다.");
        router.push("/list");
      }
    }
  };
  
  // 레몬스퀴지 관련 이벤트 처리
  const startSubscribe = async () => {
    trackingEvent("subscribe_btn_click", { user_id: getNickName() });
    const checkouturl = await getCheckoutURL();
    window.createLemonSqueezy();
    if (isLemonLoaded.current && window.LemonSqueezy) {
      window.LemonSqueezy.Url.Open(checkouturl);
      clearHandler();
      window.LemonSqueezy.Setup({
        eventHandler: (event) => {
          isEventHandlerSetted.current = true;
          if (event.event === "Checkout.ApplyDiscount") {
            if (event.data.cart.discount) {
              promotionCodeRef.current = event.data.cart.discount.code;
            }
            else {
              promotionCodeRef.current = "";
            }
          }
          if (event.event === "Checkout.Success") {
            const paymentId = event.data.order.data.id;
            trackingEvent("subscribe_payment_success", {
              user_id: getNickName(),
              promotion_code: promotionCodeRef.current,
              transaction_id: paymentId,
            });
          }
        },
      });
    } else {
      alert("다시 시도해주세요");
      window.location.reload();
    }
  };

  const clearHandler = () => {
    if (isEventHandlerSetted.current) {
      window.LemonSqueezy.Setup({
        eventHandler: () => {},
      });
      isEventHandlerSetted.current = false;
    }
  };

  useEffect(() => {
    return () => {
      clearHandler();
    };
  }, []);

  return (
    <>
      <Script
        src="https://app.lemonsqueezy.com/js/lemon.js"
        onLoad={() => {
          isLemonLoaded.current = true;
        }}
      />

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
            src="/images/storypixie.png"
            alt="storypixie"
            width={105}
            height={150}
            unoptimized={true}
            priority
            className="object-contain backface-hidden"
          />
          <div
            className="w-screen bg-contain h-full max-w-[1400px]"
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
    </>
  );
};

// export default withAuth(Subscribe);
export default Subscribe;
