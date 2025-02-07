import { fetchUser } from "@/app/services/userService";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SubscribeInfo from "../subscribeInfo";

interface AccountInfoProps {
  hasLogin: boolean;
  setHasLogin: (value: boolean) => void;
  onClose: (value: boolean) => void;
}

type SubscriptionInfo = {
  status: string;
  renewsAt: string;
  createdAt: string;
};

const AccountInfo = ({ hasLogin, setHasLogin, onClose }: AccountInfoProps) => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(
    null
  );

  const router = useRouter();

  const handleLogin = () => {
    const loginURL = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/kakao";
    window.location.href = loginURL;
  };

  const manageAccount = () => {
    router.push("/account");
    onClose(false);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await fetchUser();
        const { userInfo, subscriptionInfo } = data;
        setNickname(userInfo.nickname);
        setEmail(userInfo.email);
        setSubscriptionInfo(subscriptionInfo);
        setHasLogin(true);
      } catch (error) {
        console.log("로그인 안되어 있음", error);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <div
      className="absolute h-dvh w-full top-12 bg-opacity-50 bg-black"
      onClick={() => onClose(false)}
    >
      <div
        className="absolute w-[50%] max-w-96 bg-[#FFF6EE] h-full px-3 max-[425px]:w-[57%] z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col justify-between h-full mt-12">
          <div>
            {hasLogin ? (
              <div>
                <p className="text-lg font-bold">
                  {nickname}
                  <span className="text-[#989BA2]"> 님</span>
                  <br />
                  안녕하세요.
                </p>
                <p className="mt-3 mb-2 text-[#989BA2]">{email}</p>
                <SubscribeInfo subscribeInfo={subscriptionInfo} onClose={onClose}/>
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
                className="flex gap-2 items-center text-lg font-medium"
                type="button"
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
                className="flex gap-2 items-center text-lg font-medium"
                type="button"
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
              <p className="text-[#989BA2] underline text-xs">
                productcamp@teamsparta.co
              </p>
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
      </div>
    </div>
  );
};

export default AccountInfo;
