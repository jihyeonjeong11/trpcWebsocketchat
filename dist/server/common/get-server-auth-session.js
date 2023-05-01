"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerAuthSession = void 0;
const next_auth_1 = require("next-auth");
const ____nextauth_1 = require("../../pages/api/auth/[...nextauth]");
/**
 * Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs
 * See example usage in trpc createContext or the restricted API route
 */
const getServerAuthSession = async (ctx) => {
    return await (0, next_auth_1.unstable_getServerSession)(ctx.req, ctx.res, ____nextauth_1.authOptions);
};
exports.getServerAuthSession = getServerAuthSession;
