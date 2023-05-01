"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const trpc_1 = require("../trpc");
const z = __importStar(require("zod"));
exports.userRouter = (0, trpc_1.router)({
    getSession: trpc_1.publicProcedure.query(({ ctx }) => {
        return ctx.session;
    }),
    getSecretMessage: trpc_1.authedProcedure.query(() => {
        return 'you can now see this secret message!';
    }),
    changeUserData: trpc_1.authedProcedure
        .input(z.object({
        name: z.string().nullish(),
        username: z.string().nullish(),
        image: z.string().nullish(),
    }))
        .mutation(({ input: { username, name, image }, ctx }) => {
        var _a, _b;
        return ctx.prisma.user.update({
            where: {
                id: (_b = (_a = ctx.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id,
            },
            data: {
                name,
                username,
                image,
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
            },
        });
    }),
    changeUserTheme: trpc_1.authedProcedure
        .input(z.object({ theme: z.enum(['light', 'dark']) }))
        .mutation(({ input: { theme }, ctx }) => {
        var _a, _b;
        return ctx.prisma.user.update({
            data: {
                theme,
            },
            where: {
                id: (_b = (_a = ctx.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id,
            },
            select: {
                id: true,
                theme: true,
            },
        });
    }),
    users: trpc_1.authedProcedure
        .input(z.object({ user: z.string() }))
        .query(({ input: { user }, ctx }) => {
        var _a, _b;
        return ctx.prisma.user.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: user,
                            mode: 'insensitive',
                        },
                        username: {
                            contains: user,
                            mode: 'insensitive',
                        },
                    },
                ],
                NOT: { id: (_b = (_a = ctx.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id }, // don't want to return myself.
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
            },
        });
    }),
});
// usermodel is all nullish because it can be freely changed
// also, prisma does not update undefined values, so empty value must be null.
