import { motion } from "framer-motion";
import React, { useEffect } from "react";

type AiGuideProps = {
  onClose: () => void;
};

const AiGuide = ({ onClose }: AiGuideProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -12, opacity: 0 }}
      transition={{
        ease: "easeInOut",
        duration: 2,
      }}
      className={`fixed bottom-[6.25rem] right-6 py-[0.625rem] px-5 rounded-xl bg-white bg-opacity-60 backdrop-blur-lg font-semibold text-[#46474C] text-xs z-[9999]`}
    >
      이야기를 듣다가 궁금한 것이 생기면 <br />
      버튼을 눌러 픽시에게 질문해보세요
    </motion.div>
  );
};

export default AiGuide;
