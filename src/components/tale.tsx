"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";

type TaleInfo = {
  titleKor: string;
  titleEng: string;
  description: string;
  image: string;
  minuteLength: number;
  totalPage: number;
  price: number;
  isAccessible: boolean;
};

type TaleProps = {
  taleInfo: TaleInfo;
};

const Tale = ({ taleInfo }: TaleProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  const toggleExpand = () => {
    if (descRef.current) {
      descRef.current.classList.toggle("line-clamp-2");
    }
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (descRef.current) {
      const element = descRef.current;
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight); // 한 줄 높이
      const maxHeight = lineHeight * 2; // 2줄 높이
      setIsOverflowing(element.scrollHeight > maxHeight); // 초과 여부 판단
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center mb-7">
      <Image
        src={taleInfo.image}
        alt="fairyTale_Thumbnail"
        width={1920}
        height={230}
        className="rounded-xl"
      />
      <div className="w-full flex flex-col gap-1 mt-3 mb-2">
        <h1 className="text-lg w-full font-semibold">{taleInfo.titleKor}</h1>
        <p className="text-sm w-full text-[#5A5C63] font-medium">
          {taleInfo.titleEng}
        </p>
        <p
          className={`text-sm w-full text-[#5A5C63] font-medium ${"line-clamp-2"}`}
          ref={descRef}
        >
          {taleInfo.description}
        </p>
        {isOverflowing && (
          <div className="flex flex-row-reverse">
            <button
              type="button"
              className="text-[#989BA2] text-sm"
              onClick={toggleExpand}
            >
              {isExpanded ? "접기" : "더보기"}
            </button>
          </div>
        )}
        <div className="w-full flex justify-between font-medium">
          <p className="text-[#FF7134] text-sm">
            {taleInfo.price
              ? Intl.NumberFormat("ko-KR").format(taleInfo.price) + " 원"
              : "무료"}
          </p>
          <div>
            <p className="text-[#5A5C63] text-sm">
              {taleInfo.minuteLength}분 | {taleInfo.totalPage}페이지
            </p>
          </div>
        </div>
      </div>
      {taleInfo.isAccessible ? (
        <button
          type="button"
          className="bg-[#FF7134] text-white rounded-lg w-full h-12 flex justify-center items-center"
        >
          <FaPlay className="text-white mr-2 text-xl font-bold" />
          감상하기
        </button>
      ) : (
        <button
          type="button"
          className="border-2 rounded-lg w-full h-12 flex justify-center items-center font-bold"
        >
          <Image
            src="/images/thunder.svg"
            alt="buy-imgae"
            width={20}
            height={20}
            className="mr-2"
          />
          구매하기
        </button>
      )}
    </div>
  );
};

export default Tale;
