import ServiceGNB from "@/components/serviceGNB";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ServiceGNB />
      {children}
    </>
  );
};

export default layout;
