// ============================================
// 🔧 백엔드 없이 동작하도록 import 주석 처리됨
// ============================================
// import { fetchUser } from "@/app/services/userService";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SubscribeInfo from "../subscribeInfo";
import { motion } from "framer-motion";
import { trackingEvent } from "@/utils/gtagFunc";
import { getNickName } from "@/utils/stores";
import { useModalStore } from "@/app/store/modalStore";
import { formatDate } from "@/utils/formatDate";
import dynamic from "next/dynamic";
import { useUserStore } from "@/app/store/userStore";

const ReSubscribeModal = dynamic(() => import("./reSubscribeModal"));

interface AccountInfoProps {
  onClose: (value: boolean) => void;
}

type SubscriptionInfo = {
  status: string;
  renewsAt: string;
  createdAt: string;
};

// 사이드바 컴포넌트
const AccountInfo = ({ onClose }: AccountInfoProps) => {
  // ============================================
  // 🔧 백엔드 없이 동작하도록 사용하지 않는 변수들
  // ============================================
  const [nickname] = useState("");
  const [email] = useState("");
  const [subscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const { isRenewModalOpen, setIsRenewModalOpen, isSidebarOpen } =
    useModalStore();
  const { hasLogin } = useUserStore();

  const router = useRouter();
  const pathname = usePathname();

  const handleLogin = () => {
    alert("추후 업데이트 예정");
    return;
    // ============================================
    // 🔧 백엔드 없이 동작하도록 로그인 기능 비활성화
    // ============================================
    // const loginURL = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/kakao";
    // window.location.href = loginURL;
    // trackingEvent("login_btn_click");
  };

  const manageAccount = () => {
    router.push("/account");
    onClose(false);
  };

  const redirectListPage = () => {
    onClose(false);
    router.push("/list");
  };

  const openUseGuide = () => {
    trackingEvent("guide_btn_click", { user_id: getNickName() });
    window.open(
      "https://teamsparta.notion.site/19e2dc3ef51480ebaf05ce6977ae92ce",
      "_blank",
      "noopener, noreferrer"
    );
  };

  const closeModal = () => {
    onClose(false);
    setIsRenewModalOpen(false);
  };

  useEffect(() => {
    // ============================================
    // 🔧 백엔드 API 호출 주석 처리됨
    // ============================================
    // const fetchUserInfo = async () => {
    //   try {
    //     const data = await fetchUser();
    //     const { userInfo, subscriptionInfo } = data;
    //     setNickname(userInfo.nickname);
    //     setEmail(userInfo.email);
    //     setSubscriptionInfo(subscriptionInfo);
    //     setHasLogin(true);
    //   } catch (error) {
    //     console.error(error);
    //     setSubscriptionInfo(null);
    //     setHasLogin(false);
    //     setEmail("");
    //     setNickname("");
    //   }
    // };
    // fetchUserInfo();
  }, []);

  return (
    <div
      className="absolute h-dvh w-full top-12 bg-opacity-50 bg-black overflow-hidden"
      onClick={() => {
        onClose(false);
        setIsRenewModalOpen(false);
      }}
    >
      {isRenewModalOpen && (
        <ReSubscribeModal
          renewsAt={formatDate(subscriptionInfo!.renewsAt) || ""}
          onClose={closeModal}
        />
      )}
      {isSidebarOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="absolute w-[50%] max-w-96 bg-[#FFF6EE] h-full px-3 max-[425px]:w-[57%] z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col justify-between h-full mt-12">
            <div>
              {hasLogin ? (
                <div>
                  <div className="text-lg font-bold">
                    <p className="flex items-center gap-2">
                      <span className="truncate">{nickname}</span>
                      <span className="text-[#989BA2]">님</span>
                    </p>
                    안녕하세요.
                  </div>
                  <p
                    className="mt-3 mb-2 text-[#989BA2] truncate"
                    style={{ direction: "ltr" }}
                  >
                    {email.split("@")[0]}
                    <span className="select-none">@</span>
                    {email.split("@")[1]}
                  </p>
                  <SubscribeInfo
                    subscribeInfo={subscriptionInfo}
                    onClose={onClose}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full bg-[#FEE500] rounded-lg h-10 mb-8 text-xl flex justify-center items-center font-semibold"
                  onClick={handleLogin}
                >
                  <Image
                    src="/images/kakao_icon.svg"
                    alt="kakao"
                    width={25}
                    height={20}
                    className="mr-3"
                  />
                  로그인
                </button>
              )}
              <div className="flex flex-col gap-3 pt-4">
                <button
                  className={`flex gap-2 items-center text-lg font-medium rounded-lg p-1 hover:bg-[#FAF4F1] ${
                    pathname === "/list" ? "bg-[#FFE7DA]" : ""
                  }`}
                  type="button"
                  onClick={redirectListPage}
                >
                  <Image
                    src={"/images/articles-img.svg"}
                    alt="articles"
                    width={20}
                    height={20}
                  />
                  작품 목록
                </button>
                <button
                  className="flex gap-2 items-center text-lg font-medium p-1 rounded-lg hover:bg-[#FAF4F1]"
                  type="button"
                  onClick={openUseGuide}
                >
                  <Image
                    src={"/images/guide-img.svg"}
                    alt="guide"
                    width={20}
                    height={20}
                  />
                  이용 가이드
                </button>
              </div>
            </div>
            <div className="mb-40 relative">
              <div className="flex flex-col bg-white rounded-lg w-full p-3 font-medium">
                <p className="pb-2 text-[#5A5C63]">서비스 문의 안내</p>
                <p className="text-xs py-3 border-t-2 text-[#5A5C63]">
                  서비스 이용 관련 문의는 아래 이메일로 주시면 2영업일 이내로
                  회신드리겠습니다.
                </p>
                <a
                  href="mailto:productcamp@teamsparta.co"
                  className="text-[#989BA2] underline text-xs"
                >
                  productcamp@teamsparta.co
                </a>
              </div>
              {hasLogin && (
                <button
                  type="button"
                  className="text-[#989BA2] underline text-sm mt-3 absolute right-0"
                  onClick={manageAccount}
                >
                  계정관리
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AccountInfo;
