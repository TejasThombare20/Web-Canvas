import Provider from "@/components/Provider";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    // <ClerkProvider
    <Provider>{children}</Provider>
    // </ClerkProvider>
  );
};

export default layout;
