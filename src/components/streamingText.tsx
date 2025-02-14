import { useRealtimeAPIStore } from "@/app/store/realtimeAPIStore";
import React, { useEffect, useRef, useState } from "react";

const StreamingText = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [displayText, setDisplayText] = useState("");
  const { currentAnswer } = useRealtimeAPIStore();

  useEffect(() => {
    if (currentAnswer === "" || displayText !== "") return;
    let i = 0;

    setDisplayText(currentAnswer[0]);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) => prev + currentAnswer[i]);
      i++;
      if (i >= currentAnswer.length - 1 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentAnswer]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText("");
  }, []);

  return (
    <div className="mb-4 text-[#46474C] font-semibold text-sm">
      {displayText}
    </div>
  );
};

export default StreamingText;
