import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { db } from "@/lib/prisma";

export const authOptions: AuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            const repsonse = await db.user.upsert({
                where: { email: user.email! },
                update: {
                    name: user.name!,
                    email: user.email!,
                    image: user.image!,
                },
                create: {
                    name: user.name!,
                    email: user.email!,
                    image: user.image!
                },
            });
            console.log(repsonse);
            return true;
        },
        async jwt({ token, user }) {
            if (user)
                token.id = user.id;
            return token;
        },

        async session({ session }) {
            session.user = {
                ...session.user,
            };
            return session;
        },
    },
};

export default NextAuth(authOptions);
