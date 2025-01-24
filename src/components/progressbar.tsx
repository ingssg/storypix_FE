"use client";

import React, { useEffect, useState } from "react";

type Props = {
  onComplete: () => void;
};

const ProgressBar = ({ onComplete }: Props) => {
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(20);
  const duration = 20000;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / (duration / 1000), 100));
      setTime((prev) => Math.max(prev - 1, 0));
    }, 1000);

    const timeout = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="flex items-center w-full mx-auto gap-3 justify-center mt-5">
      <div className="text-[#46474C] w-12">{formatTime(time)}</div>
      <div className="bg-white w-24 h-1 rounded-lg">
        <div
          className={`h-full bg-[#5A5C63] ease-linear duration-1000 rounded-lg`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
