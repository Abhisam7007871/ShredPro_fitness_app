import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            membershipLevel: string;
        } & DefaultSession["user"]
    }

    interface User {
        id: string;
        username: string;
        membershipLevel: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: string;
            username: string;
            membershipLevel: string;
        }
    }
}
