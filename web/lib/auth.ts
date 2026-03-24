import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import TwitterProvider from "next-auth/providers/twitter";
import FacebookProvider from "next-auth/providers/facebook";
import InstagramProvider from "next-auth/providers/instagram";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${BACKEND_URL}/users/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });
          if (res.data) return res.data;
          return null;
        } catch (e: unknown) {
          const err = e as { response?: { data?: { message?: string } } };
          throw new Error(err.response?.data?.message || "Invalid credentials");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "mock-google-id",
      clientSecret: process.env.GOOGLE_SECRET || "mock",
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || "mock-apple-id",
      clientSecret: process.env.APPLE_SECRET || "mock",
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID || "mock-twitter-id",
      clientSecret: process.env.TWITTER_SECRET || "mock",
      version: "2.0",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID || "mock-facebook-id",
      clientSecret: process.env.FACEBOOK_SECRET || "mock",
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_ID || "mock-instagram-id",
      clientSecret: process.env.INSTAGRAM_SECRET || "mock",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        if (account.provider !== "credentials") {
          try {
            const syncRes = await axios.post(`${BACKEND_URL}/users/oauth-sync`, {
              email: user.email || `${account.providerId}@oauth.user`,
              fullName: user.name || "App Athlete",
              provider: account.provider?.toUpperCase(),
              providerId: account.providerAccountId,
              profilePicture: user.image || null,
            });
            token.user = syncRes.data;
          } catch {
            token.user = user;
          }
        } else {
          token.user = user;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as typeof session.user;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
