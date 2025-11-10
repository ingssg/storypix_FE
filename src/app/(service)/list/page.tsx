"use client";

// ============================================
// 🔧 백엔드 없이 동작하도록 import 주석 처리됨
// ============================================
// import { fetchTales } from "@/app/services/taleService";
// import { fetchUser } from "@/app/services/userService";
import { useModalStore } from "@/app/store/modalStore";
import FirstGuide from "@/components/firstGuide";
import Tale from "@/components/tale";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useEffect, useState } from "react";

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

// ============================================
// 🔧 페이지네이션 관련 코드 주석 처리됨 (더미 데이터로 대체 예정)
// ============================================
// 5개씩 가져옴
// const PAGE_COUNT = 5;

const List = () => {
  const [tales, setTales] = useState<Array<Tale>>([]);
  // const [page, setPage] = useState(1);
  // const [isLoading, setIsLoading] = useState(false);
  // const [hasMore, setHasMore] = useState(true);
  const [isSubscribedUser] = useState(false);
  // const observerRef = useRef<HTMLDivElement | null>(null);

  const { isFirstGuideModalOpen } = useModalStore();

  // ============================================
  // 기존 백엔드 API 호출 코드 (주석 처리됨)
  // ============================================
  // const loadMoreTales = async () => {
  //   if (isLoading || !hasMore) return;
  //   setIsLoading(true);
  //
  //   try {
  //     const data = await fetchTales(page, PAGE_COUNT);
  //     setTales((prev) => [...prev, ...data.stories]);
  //     setPage((prev) => prev + 1);
  //     setIsSubscribedUser(data.isSubscribedUser);
  //
  //     if (data.stories.length < PAGE_COUNT) {
  //       setHasMore(false);
  //     }
  //   } catch (error) {
  //     alert("데이터 로딩 오류");
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  //
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       // 대상 요소가 화면에 50% 이상 나타나고(hasMore이 true일 때) 추가 데이터를 로드
  //       if (entries[0].isIntersecting && hasMore) {
  //         loadMoreTales();
  //       }
  //     },
  //     { threshold: 0.5 } // 50% 이상 화면에 보일 때 이벤트 발생
  //   );
  //
  //   if (observerRef.current) {
  //     observer.observe(observerRef.current);
  //   }
  //
  //   return () => {
  //     if (observerRef.current) {
  //       observer.unobserve(observerRef.current);
  //     }
  //   };
  // }, [hasMore, isLoading]);

  useEffect(() => {
    // ============================================
    // 🔧 백엔드 API 호출 주석 처리됨
    // ============================================
    // fetchUser();

    // ============================================
    // 🔧 더미 데이터 설정
    // ============================================
    const dummyTale: Tale = {
      id: 1,
      titleKor: "성냥팔이소녀",
      titleEng: "The Little Match Girl",
      description:
        "추운 겨울밤, 성냥을 팔기 위해 거리를 걷는 작은 소녀의 하루를 담은 이야기.",
      image: "/livedemo/img/title.png",
      minuteLength: 5,
      totalPage: 5,
      isFree: true,
    };
    setTales([dummyTale]);

    return () => setTales([]);
  }, []);

  useBodyScrollLock(isFirstGuideModalOpen);

  // ============================================
  // 🔧 페이지네이션 로딩 UI 주석 처리됨
  // ============================================
  // const lodaderClass =
  //   "w-12 h-12 rounded-full border-t-4 border-t-[#FF7134] border-r-4 border-r-transparent animate-spin block z-[-1]";

  return (
    <div
      className={`max-w-[1000px] mx-auto pt-12 flex flex-col items-center px-[6%]`}
    >
      {isFirstGuideModalOpen && <FirstGuide />}
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
      {/* ============================================ */}
      {/* 🔧 페이지네이션 로딩 UI 주석 처리됨 */}
      {/* ============================================ */}
      {/* {isLoading && (
        <div className="mt-10 w-full flex justify-center">
          <span className={lodaderClass}></span>
        </div>
      )}
      <div ref={observerRef} className="h-10" /> */}
    </div>
  );
};

export default List;
