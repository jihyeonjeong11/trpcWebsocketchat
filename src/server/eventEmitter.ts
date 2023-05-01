// this code also stole from
// https://github.com/trpc/examples-next-prisma-websockets-starter/blob/main/src/server/routers/post.ts

import EventEmitter from 'events';

interface MyEvents {
  sendMessage: (data: { conversationId: string; userId: string }) => void;
  isTypingUpdate: () => void;
}
declare interface MyEventEmitter {
  on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  emit<TEv extends keyof MyEvents>(
    event: TEv,
    ...args: Parameters<MyEvents[TEv]>
  ): boolean;
}

class MyEventEmitter extends EventEmitter {}

// In a real app, you'd probably use Redis or something
export const ee = new MyEventEmitter();
