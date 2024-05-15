import Navigation from "@/components/Navigation";
import Provider from "@/components/Provider";
import { constructMetaData } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";

export const metadata = constructMetaData()

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    // <ClerkProvider appearance={{ baseTheme: dark }}>
    <Provider>
      <main>
        <Navigation />
        {children}
      </main>
  </Provider> 
    // </ClerkProvider>
  );
};

export default layout;
