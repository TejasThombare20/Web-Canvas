import NextAuth, { DefaultSession, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { getAuthUserDetails, getUserRole } from "@/lib/querires";

type sessionProps = {
  user: {
    id?: string | undefined;
    name: string;
    email: string;
    image: string;
    role?: string | undefined;
  };
};

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // connectToDB();
      // const dbuser = await User.findOne({ email: token.email });

      // console.log("user in JWT", user);
      // console.log("token in JWT", token);
      // console.log("session", session);

      if (!token.role && token.email) {
        const data = await getUserRole(token.email);
        token.role = data?.role;
        token.id = data?.id;

        console.log("token bhai", token);
      }

      if (trigger === "update") {
        // console.log("token", token);
        // console.log("trigger", { ...token, ...session.user });
        return { ...token, ...session.user };
      }
      return token;
    },

    async session({ token, session }: { token: JWT; session: any }) {
      if (token) {
        if (session.user) {
          session.user.id = token.id;
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.image = token.picture;
          session.user.role = token.role;
        }
      }
      return session;
    },

    redirect() {
      return "/";
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
