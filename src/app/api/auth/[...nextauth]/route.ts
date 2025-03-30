import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the built-in session types
interface ExtendedSession extends Session {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        // Split the name into first and last name
        const nameParts = profile.name?.split(" ") || ["", ""];
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        return {
          id: profile.sub,
          firstName,
          lastName,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified
            ? new Date().toISOString()
            : null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async session({ session, user }: { session: ExtendedSession; user: any }) {
      if (session.user) {
        session.user.id = user.id;
        // Add firstName and lastName to the session
        session.user.name = `${user.firstName || ""} ${
          user.lastName || ""
        }`.trim();
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
