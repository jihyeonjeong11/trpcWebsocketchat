"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const observable_1 = require("@trpc/server/observable");
exports.chatRouter = (0, trpc_1.router)({
    hello: trpc_1.publicProcedure
        .input(zod_1.z.object({ text: zod_1.z.string().nullish() }).nullish())
        .query(({ input }) => {
        var _a;
        return {
            greeting: `Hello ${(_a = input === null || input === void 0 ? void 0 : input.text) !== null && _a !== void 0 ? _a : 'world'}`,
        };
    }),
    getAll: trpc_1.publicProcedure.query(({ ctx }) => {
        return ctx.prisma.example.findMany();
    }),
    conversations: trpc_1.authedProcedure.query(async ({ ctx }) => {
        var _a, _b;
        return ctx.prisma.conversationUser.findMany({
            where: {
                userId: (_b = (_a = ctx.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id,
            },
            include: {
                conversation: {
                    include: {
                        conversationUsers: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        image: true,
                                        username: true,
                                    },
                                },
                            },
                        },
                        lastMessage: true,
                    },
                },
            },
            orderBy: {
                conversation: {
                    lastMessageId: 'desc',
                },
            },
        });
    }),
    findConversation: trpc_1.authedProcedure
        .input(zod_1.z.object({ userId: zod_1.z.string() }))
        .query(async ({ input: { userId }, ctx }) => {
        var _a, _b, _c, _d;
        // pseudo process
        // user1 has two conversations: [c1, c2]
        // user2 has one conversation: [c1]
        // [{c1: u2, c2: u1}, {c2: u1}]
        // c1: u2 return c1.
        const conversationUsers = await ctx.prisma.conversationUser.groupBy({
            by: ['conversationId'],
            where: {
                userId: {
                    in: [userId, (_c = (_b = (_a = ctx.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : ''], // find conversationUser has those ids
                },
            },
            having: {
                userId: {
                    _count: {
                        equals: 2, // need Two userId
                    },
                },
            },
        });
        return conversationUsers.length
            ? (_d = conversationUsers[0]) === null || _d === void 0 ? void 0 : _d.conversationId
            : null;
    }),
    messages: trpc_1.authedProcedure
        .input(zod_1.z.object({ conversationId: zod_1.z.string() }))
        .query(async ({ input: { conversationId }, ctx }) => {
        var _a, _b, _c;
        await ctx.prisma.conversationUser.findUniqueOrThrow({
            where: {
                userId_conversationId: {
                    userId: (_c = (_b = (_a = ctx.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : '',
                    conversationId,
                },
            },
        });
        return ctx.prisma.message.findMany({
            where: {
                conversationId,
            },
            orderBy: {
                id: 'asc',
            },
        });
    }),
    changeUserTheme: trpc_1.authedProcedure
        .input(zod_1.z.object({ theme: zod_1.z.enum(['light', 'dark']) }))
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
    sendMessage: trpc_1.authedProcedure
        .input(zod_1.z.object({
        conversationId: zod_1.z.string().nullish(),
        messageText: zod_1.z.string(),
        userId: zod_1.z.string().nullish(),
    }))
        .mutation(async ({ input: { messageText, conversationId, userId }, ctx }) => {
        var _a;
        // messageText: chatting content
        // conversationId: conversation record id
        // userId: user Id
        // ctx: ctx.session.userId logon userid
        if (!conversationId) {
            if (!userId) {
                throw new Error('No recipient passes');
            }
            return ctx.prisma.$transaction(async (trx) => {
                var _a, _b, _c, _d, _e;
                const conversation = await trx.conversation.create({
                    // 1. if conversationId not passed, creates new Message row and new conversation
                    data: {
                        messages: {
                            create: {
                                messageText,
                                userId: (_b = (_a = ctx.session.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '',
                            },
                        },
                        conversationUsers: {
                            createMany: {
                                data: [{ userId }, { userId: (_d = (_c = ctx.session.user) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : '' }],
                            },
                        },
                    },
                    include: {
                        messages: true,
                    },
                });
                trx.conversation.update({
                    // updates conversation record with the new message id as the lastMessageId
                    data: {
                        lastMessageId: conversation &&
                            conversation.messages &&
                            conversation.messages[0]
                            ? (_e = conversation.messages[0]) === null || _e === void 0 ? void 0 : _e.id
                            : '',
                    },
                    where: {
                        id: conversation.id,
                    },
                });
                ctx.ee.emit('sendMessage', {
                    conversationId: conversation.id,
                    userId,
                });
                return conversation;
            });
        }
        //
        await ctx.prisma.$transaction(async (trx) => {
            var _a, _b, _c, _d;
            // if conversationId passed,
            // that means we already have conversation and conversationUsers
            //
            const [message] = await Promise.all([
                trx.message.create({
                    data: {
                        messageText,
                        userId: (_b = (_a = ctx.session.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '',
                        conversationId,
                    },
                }),
                trx.conversationUser.findUniqueOrThrow({
                    where: {
                        userId_conversationId: {
                            userId: (_d = (_c = ctx.session.user) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : '',
                            conversationId,
                        },
                    },
                }),
            ]);
            await trx.conversation.update({
                // and update new message id as lastMessageId
                data: {
                    lastMessageId: message.id,
                },
                where: {
                    id: conversationId,
                },
            });
        });
        // if conversationId passed (case 2 outside of if block)
        // we need to find user after we create conversation record.
        // because we don't create new conversationUser hence it already exists.
        const user = await ctx.prisma.conversationUser.findFirst({
            where: {
                conversationId,
                NOT: {
                    userId: (_a = ctx.session.user) === null || _a === void 0 ? void 0 : _a.id,
                },
            },
            select: {
                userId: true,
            },
        });
        ctx.ee.emit('sendMessage', {
            conversationId,
            userId: user ? user === null || user === void 0 ? void 0 : user.userId : '',
        });
        // finally we call onSendMessage callback
    }),
    onSendMessage: trpc_1.authedProcedure.subscription(({ ctx }) => {
        return (0, observable_1.observable)((emit) => {
            // server subscripts db changes and returns conversationId
            const onSendMessage = (data) => {
                var _a;
                if (data.userId === ((_a = ctx.session.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    // if same user id
                    emit.next({ conversationId: data.conversationId }); // event Emitter pass conversationId
                }
            };
            ctx.ee.on('sendMessage', onSendMessage); // when sendMessage event happens, trigger onSendMessageCallback
            return () => {
                ctx.ee.on('sendMessage', onSendMessage);
            };
        });
    }),
});
