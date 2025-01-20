import Image from "next/image";
import React from "react";
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
        <h1 className="text-lg w-full">{taleInfo.titleKor}</h1>
        <p className="text-sm w-full">{taleInfo.titleEng}</p>
        <p className="text-sm w-full">{taleInfo.description}</p>
        <div className="w-full flex justify-between">
          <p className="text-[#FF7134] text-sm">
            {taleInfo.price ? taleInfo.price + " 원" : "무료"}
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
          <FaPlay className="text-white mr-2 text-xl" />
          감상하기
        </button>
      ) : (
        <button
          type="button"
          className="border-2 rounded-lg w-full h-12 flex justify-center items-center"
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
