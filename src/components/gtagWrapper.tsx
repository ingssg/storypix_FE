"use client";

import useGtag from "@/hooks/useGtag";

// gtag 커스텀훅으로 감싸주는 wrapper 컴포넌트
const GtagWrapper = () => {
  useGtag();
  return null;
};

export default GtagWrapper;
