"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = exports.createContextInner = void 0;
const react_1 = require("next-auth/react");
const prisma_1 = require("./prisma");
const eventEmitter_1 = require("./eventEmitter");
/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
const createContextInner = async (opts) => {
    return {
        session: opts.session,
        prisma: prisma_1.prisma,
        ee: eventEmitter_1.ee,
    };
};
exports.createContextInner = createContextInner;
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
const createContext = async (opts) => {
    const session = await (0, react_1.getSession)(opts);
    console.log('createContext for', session !== null && session !== void 0 ? session : 'unknown user');
    return await (0, exports.createContextInner)({
        session,
    });
};
exports.createContext = createContext;
