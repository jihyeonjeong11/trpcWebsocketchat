"use strict";
// this code also stole from
// https://github.com/trpc/examples-next-prisma-websockets-starter/blob/main/src/server/routers/post.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ee = void 0;
const events_1 = __importDefault(require("events"));
class MyEventEmitter extends events_1.default {
}
// In a real app, you'd probably use Redis or something
exports.ee = new MyEventEmitter();
