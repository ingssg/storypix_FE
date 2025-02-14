'use client';

import { fetchUser } from "@/app/services/userService";
import React, { ComponentType, useEffect, useState } from "react";

const WithAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const authenticate = async () => {
        try {
          await fetchUser();
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          alert("로그인이 필요합니다.");
          const loginURL = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/kakao";
          window.location.href = loginURL;
        }
      };
      authenticate();
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
