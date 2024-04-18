import React from "react";

type Props = {
  children: React.ReactNode;
};

const BlurPage = ({ children }: Props) => {
  return (
    // <div className="h-screen overflow-scroll backdrop-blur-[35px] dark:bg-muted/40 bg-muted/60  dark:shadow-2xl dark:shadow-black mx-auto
    // pt-24 p-4 absolute top- right-0 left-0 bottom-0  z-[1] ">{children }</div>
    <div className="h-screen  pt-24 overflow-scroll backdrop-blur-[35px]  dark:bg-muted/40 bg-muted/60 dark:shadow-2xl dark:shadow-black mx-auto p-4 ">
      {children}
    </div>
  );
};

export default BlurPage;
