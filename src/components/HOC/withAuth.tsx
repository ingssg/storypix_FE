'use client';

import { fetchUser } from "@/app/services/userService";
import React, { ComponentType, useEffect, useState } from "react";

// HOC 패턴으로 로그인 안한 유저 막기
// middleware 사용으로 현재는 사용하지 않는 코드

const WithAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      // ============================================
      // 🔧 백엔드 API 호출 주석 처리됨
      // ============================================
      // const authenticate = async () => {
      //   try {
      //     await fetchUser(); // users/me 에 유저정보  조회를 요청하면서 로그인 여부 확인
      //     setIsLoading(false);
      //   } catch (error) {
      //     console.error(error);
      //     alert("로그인이 필요합니다.");
      //     const loginURL = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/kakao";
      //     window.location.href = loginURL;
      //   }
      // };
      // authenticate();
      setIsLoading(false);
    }, []);

    if (isLoading)
      return (
        <div className="h-screen flex justify-center items-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#FF7134]"></div>
        </div>
      );

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default WithAuth;
