"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
/**
 * This file contains the root router of your tRPC-backend
 */
const trpc_1 = require("../trpc");
const chat_1 = require("./chat");
// import { postRouter } from './post';
// import { observable } from '@trpc/server/observable';
// import { clearInterval } from 'timers';
const user_1 = require("./user");
exports.appRouter = (0, trpc_1.router)({
    chat: chat_1.chatRouter,
    user: user_1.userRouter,
});
