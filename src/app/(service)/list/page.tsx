import Tale from "@/components/tale";

const dummy = {
  titleKor: "양치기 소년",
  titleEng: "The Boy Who Cried Wolf",
  description:
    "거짓말을 하던 소년이 진짜 위험에 처했을 때 아무도 믿어주지 않은 이야기",
  image: "/images/dummy-tale.svg",
  minuteLength: 5,
  totalPage: 3,
  price: 0,
  isAccessible: true,
};

const dummy1 = {
  titleKor: "백설공주",
  titleEng: "Snow White",
  description: "백설공주가 사과를 먹고 잠들어버린 이야기",
  image: "/images/dummy-tale.svg",
  minuteLength: 10,
  totalPage: 3,
  price: 9900,
  isAccessible: false,
};

const dummy2 = {
  titleKor: "백설공주",
  titleEng: "Snow White",
  description: "백설공주가 사과를 먹고 잠들어버린 이야기인데 글이 너무 길어 두 줄만 나오는 지 테스트하기 위해 억지로 글을 늘리고 있는데 얼만큼 더 써야할 지 나도 모르겠는 이야기 더미 데이터 더미 데이터 더미 데이터 더미 데이터 더미 데이터 더미 데이터 더미 데이터 더미 데이터 더미 데이터 더미 데이터 입니다",
  image: "/images/dummy-tale.svg",
  minuteLength: 10,
  totalPage: 3,
  price: 9900,
  isAccessible: false,
};

const List = () => {
  return (
    <>
      <div className={`pt-14 flex flex-col items-center px-[6%]`}>
        <p className="w-full mt-6 text-2xl font-semibold">작품 목록</p>
        <ul className="mt-5">
          <Tale taleInfo={dummy} />
          <Tale taleInfo={dummy1} />
          <Tale taleInfo={dummy2} />
        </ul>
      </div>
    </>
  );
};

export default List;
