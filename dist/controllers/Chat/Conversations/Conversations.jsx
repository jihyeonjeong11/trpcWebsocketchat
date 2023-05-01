"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const io5_1 = require("react-icons/io5");
const IconButton_1 = __importDefault(require("../../../components/IconButton/IconButton"));
const trpc_1 = require("../../../utils/trpc");
const styles = {
    wrapper: 'fixed top-0 bottom-0 left-0 right-0 flex flex-col space-y-5 bg-level1 p-5 md:bottom-[unset] md:left-[unset] md:top-[76px] md:right-4 md:h-[540px] md:w-96 md:rounded-xl md:shadow-sm',
};
function Conversations({ selectConversation, setShowConversations, }) {
    const { data: conversations, isLoading, error, } = trpc_1.trpc.chat.conversations.useQuery();
    if (isLoading || error) {
        return (<div className={`${styles.wrapper} flex items-center justify-center`}>
        <p>{false ? 'Loading...' : 'Error'}</p>
      </div>);
    }
    return (<div className={styles.wrapper}>
      <div className="flex items-center justify-between">
        <IconButton_1.default className="md:hidden" onClick={() => setShowConversations(false)}>
          <io5_1.IoChevronBack />
        </IconButton_1.default>
        <p className="text-lg">Messages</p>
        <IconButton_1.default onClick={() => selectConversation('newMessage', null)}>
          <io5_1.IoAddOutline />
        </IconButton_1.default>
      </div>
      <ul>
        {conversations.map((conversationInfo) => {
            var _a, _b, _c;
            const recipient = conversationInfo.conversation.conversationUsers[0].userId ===
                conversationInfo.userId
                ? (_a = conversationInfo.conversation.conversationUsers[1]) === null || _a === void 0 ? void 0 : _a.user
                : (_b = conversationInfo.conversation.conversationUsers[0]) === null || _b === void 0 ? void 0 : _b.user;
            return (<li key={conversationInfo.userId + 'conversation'} className="rounded-lg py-2 hover:bg-level1Hover">
              <button className="space-x mx-2 flex items-center space-x-2 text-left" onClick={() => selectConversation(conversationInfo.conversation.id, recipient)}>
                <img src={recipient.image || ''} alt="avartar image" className="h-12 w-12 rounded-full"/>
                <div className="flex flex-col space-y-2">
                  <p>{recipient.name}</p>
                  <p className="text-sm text-tertiaryText">
                    {conversationInfo.conversation.lastMessage.userId !==
                    recipient.id
                    ? 'You: '
                    : ''}
                    {(_c = conversationInfo.conversation.lastMessage) === null || _c === void 0 ? void 0 : _c.messageText}
                  </p>
                </div>
              </button>
            </li>);
        })}
      </ul>
    </div>);
}
exports.default = Conversations;
// dummy conversation data
// const conversations = [
//   {
//     userId: "1",
//     conversation: {
//       id: "2",
//       conversationUsers: [
//         {
//           id: "1",
//           name: "me",
//           image:
//             "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/712.jpg",
//           username: "me",
//         },
//         {
//           id: "3",
//           name: "John Rumi",
//           image:
//             "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/712.jpg",
//           username: "jrumi",
//         },
//       ],
//     },
//     messages: [
//       {
//         id: "4",
//         messageText: "this is a Message.",
//       },
//     ],
//   },
// ];
