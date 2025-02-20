'use client';

import React, { useEffect, useState } from 'react'

// 가로모드 사용 권장 모달
const ViewOptimizationModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
    className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gray-500 text-white rounded-lg transition-opacity duration-1000 w-56 text-center z-[9999] ${
      isVisible ? "opacity-100" : "opacity-0"
    }`}
  >
    가로 모드 사용을 권장합니다
  </div>
  )
}

export default ViewOptimizationModal