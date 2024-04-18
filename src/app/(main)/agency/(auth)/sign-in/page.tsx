import UserAuthform from "@/components/UserAuthform";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Web-Canvas | Login",
  description: "Free & open source website builder",
};

const page = () => {
  return (
    <div className="absolute inset-0 mx-auto container flex h-screen flex-col items-center justify-center">
      <div className="mx-auto w-full flex-col justify-center space-y-6 max-w-lg  ">
        <div className="flex flex-col items-center gap-6 text-center">
          <Link
            href="/"
            className={buttonVariants({
              variant: "ghost",
              className: "w-fit",
            })}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>

          <h1 className="text-black dark:text-white text-center lg:text-left font-extrabold leading-tight tracking-tighter text-4xl md:text-5xl lg:text-6xl">
            Welcome back !
          </h1>
          <p className=" text-base sm:text-lg max-w-prose text-slate-700 dark:text-slate-300 mb-2 text-center">
            Please sign in using google account
          </p>

          <UserAuthform />
        </div>
      </div>
    </div>
  );
};

export default page;