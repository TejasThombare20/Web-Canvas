import BlurPage from "@/components/Blur-page";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <BlurPage>{children}</BlurPage>;
  // return <div>{children}</div>;
};

export default layout;
