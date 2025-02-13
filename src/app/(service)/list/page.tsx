"use client";

import { fetchTales } from "@/app/services/taleService";
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
      console.log("데이터 로딩 오류", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreTales();
        }
      },
      { threshold: 0.5 }
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
    return () => setTales([]);
  }, []);
  

  return (
    <div className={`max-w-[1000px] mx-auto pt-12 flex flex-col items-center px-[6%]`}>
      <p className="w-full mt-6 text-2xl font-semibold">작품 목록</p>
      <ul className="mt-5">
        {tales.map((tale) => (
          <Tale key={tale.id} taleInfo={tale} isSubscribedUser={isSubscribedUser}/>
        ))}
      </ul>
      {isLoading && <p className="mt-10 w-full text-center">로딩중...</p>}
      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default List;
