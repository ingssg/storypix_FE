"use client";

import { fetchTales } from "@/app/services/taleService";
import { fetchUser } from "@/app/services/userService";
import Tale from "@/components/tale";
import { useEffect, useRef, useState } from "react";

interface Tale {
  id: number;
  titleKor: string;
  titleEng: string;
  description: string;
  image: string;
  minuteLength: number;
  totalPage: number;
  isFree: boolean;
}

// 5개씩 가져옴
const PAGE_COUNT = 5;

const List = () => {
  const [tales, setTales] = useState<Array<Tale>>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isSubscribedUser, setIsSubscribedUser] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadMoreTales = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const data = await fetchTales(page, PAGE_COUNT);
      setTales((prev) => [...prev, ...data.stories]);
      setPage((prev) => prev + 1);
      setIsSubscribedUser(data.isSubscribedUser);

      if (data.stories.length < PAGE_COUNT) {
        setHasMore(false);
      }
    } catch (error) {
      alert("데이터 로딩 오류");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 대상 요소가 화면에 50% 이상 나타나고(hasMore이 true일 때) 추가 데이터를 로드
        if (entries[0].isIntersecting && hasMore) {
          loadMoreTales();
        }
      },
      { threshold: 0.5 } // 50% 이상 화면에 보일 때 이벤트 발생
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, isLoading]);

  useEffect(() => {
    fetchUser();
    return () => setTales([]);
  }, []);

  const lodaderClass =
    "w-12 h-12 rounded-full border-t-4 border-t-[#FF7134] border-r-4 border-r-transparent animate-spin block";

  return (
    <div
      className={`max-w-[1000px] mx-auto pt-12 flex flex-col items-center px-[6%]`}
    >
      <p className="w-full mt-6 text-2xl font-semibold">작품 목록</p>
      <div className="mt-5 w-full">
        {tales.map((tale) => (
          <Tale
            key={tale.id}
            taleInfo={tale}
            isSubscribedUser={isSubscribedUser}
          />
        ))}
      </div>
      {isLoading && (
        <div className="mt-10 w-full flex justify-center">
          <span className={lodaderClass}></span>
        </div>
      )}
      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default List;
