import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Metadata } from "next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStripeOAuthLink(
  accountType: "agency" | "subaccount",
  state: string
) {
  return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${process.env.NEXT_PUBLIC_URL}${accountType}&state=${state}`;
}

export function constructMetaData({
  title = "Web-Canvas",
  description = "Free & open source Web site builder",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@TejasTh371168321",
    },
    icons,
    metadataBase: new URL("https://text-twin-api.vercel.app"),
    themeColor: "#FFF",
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
