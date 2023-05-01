"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOptions = void 0;
const next_auth_1 = __importDefault(require("next-auth"));
//import DiscordProvider from "next-auth/providers/discord";
// Prisma adapter for NextAuth, optional and can be removed
const prisma_adapter_1 = require("@next-auth/prisma-adapter");
const prisma_1 = require("../../../server/prisma");
const google_1 = __importDefault(require("next-auth/providers/google"));
exports.authOptions = {
    // Include user.id on session
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
                session.user.username = user.username;
                session.user.theme = user.theme;
            }
            return session;
        },
    },
    // Configure one or more authentication providers
    adapter: (0, prisma_adapter_1.PrismaAdapter)(prisma_1.prisma),
    providers: [
        (0, google_1.default)({
            clientId: (_a = process.env.GOOGLE_ID) !== null && _a !== void 0 ? _a : 'error',
            clientSecret: (_b = process.env.GOOGLE_SECRET) !== null && _b !== void 0 ? _b : 'error',
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),
        // we also need email secret. find NextAuth docs for more info
        // ...add more providers here
    ],
};
exports.default = (0, next_auth_1.default)(exports.authOptions);
// import NextAuth from 'next-auth';
// import { AppProviders } from 'next-auth/providers';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import GithubProvider from 'next-auth/providers/github';
// let useMockProvider = process.env.NODE_ENV === 'test';
// const { GITHUB_CLIENT_ID, GITHUB_SECRET, NODE_ENV, APP_ENV } = process.env;
// if (
//   (NODE_ENV !== 'production' || APP_ENV === 'test') &&
//   (!GITHUB_CLIENT_ID || !GITHUB_SECRET)
// ) {
//   console.log('⚠️ Using mocked GitHub auth correct credentials were not added');
//   useMockProvider = true;
// }
// const providers: AppProviders = [];
// if (useMockProvider) {
//   providers.push(
//     CredentialsProvider({
//       id: 'github',
//       name: 'Mocked GitHub',
//       async authorize(credentials) {
//         if (credentials) {
//           const user = {
//             id: credentials.name,
//             name: credentials.name,
//             email: credentials.name,
//           };
//           return user;
//         }
//         return null;
//       },
//       credentials: {
//         name: { type: 'test' },
//       },
//     }),
//   );
// } else {
//   if (!GITHUB_CLIENT_ID || !GITHUB_SECRET) {
//     throw new Error('GITHUB_CLIENT_ID and GITHUB_SECRET must be set');
//   }
//   providers.push(
//     GithubProvider({
//       clientId: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_SECRET,
//       profile(profile) {
//         return {
//           id: profile.id,
//           name: profile.login,
//           email: profile.email,
//           image: profile.avatar_url,
//         } as any;
//       },
//     }),
//   );
// }
// export default NextAuth({
//   // Configure one or more authentication providers
//   providers,
// });
