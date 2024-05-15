// import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getServerSession } from "next-auth";
import { authOptions } from "./app/api/auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";



export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  async function middleware(req) {
    // console.log("hello");
    const token = await getToken({ req });
    const isAuth = !!token;
    // console.log("token", token);
    // console.log("session: ", isAuth);

    
    // if (isAuth) {
      const url = req.nextUrl;
    //   console.log("url", url);
      const searchParams = url.searchParams?.toString();
      let hostname = req.headers;

      const pathWithSearchParams = `${url.pathname}${
        searchParams.length > 0 ? `?${searchParams}` : ""
      }`;

      // if subdomain exists
      const customSubDomain = hostname
        .get("host")
        ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
        .filter(Boolean)[0];

      if (customSubDomain) {
        return NextResponse.rewrite(
          new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
        );
      }

      if((url.pathname === "/sign-in"||url.pathname === "/agency/sign-in") && isAuth){
        return NextResponse.redirect(new URL("/",req.url))
      }

      if (url.pathname === "/sign-in") {
        return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
      }



      if (
        url.pathname === "/" ||
        (url.pathname === "/site" &&
          url.host === process.env.NEXT_PUBLIC_DOMAIN)
      ) {
        return NextResponse.rewrite(new URL("/site", req.url));
      }

      if (
        url.pathname.startsWith("/agency") ||
        url.pathname.startsWith("/subaccount")
      ) {
        return NextResponse.rewrite(
          new URL(`${pathWithSearchParams}`, req.url)
        );
      }
    // }
  },
  // {
  //   callbacks: {
  //     authorized: ({ token }) => token?.role === "admin",
  //   },
  // }
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

// export { default } from "next-auth/middleware"
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// export const config = {
//     matcher : ["/dashboard"]
// }
