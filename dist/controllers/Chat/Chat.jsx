"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Conversations_1 = __importDefault(require("./Conversations/Conversations"));
const react_1 = require("react");
const Messages_1 = __importDefault(require("./Messages/Messages"));
const IconButton_1 = __importDefault(require("../../components/IconButton/IconButton"));
const io5_1 = require("react-icons/io5");
const trpc_1 = require("../../utils/trpc");
function Chat() {
    const utils = trpc_1.trpc.useContext();
    trpc_1.trpc.chat.onSendMessage.useSubscription(undefined, {
        onData: ({ conversationId }) => {
            utils.chat.conversations.invalidate();
            utils.chat.messages.invalidate({ conversationId });
            if (!showConversations && currentConversationId !== conversationId) {
                setShowNotificationBadge(true);
            }
        },
    });
    const [showConversations, setShowConversations] = (0, react_1.useState)(false);
    const [currentConversationId, setCurrentConversationId] = (0, react_1.useState)(null);
    const [currentRecipient, setCurrentRecipient] = (0, react_1.useState)(null);
    const [conversationQueue, setConversationQueue] = (0, react_1.useState)([]);
    const [showNotificationBadge, setShowNotificationBadge] = (0, react_1.useState)(false);
    const selectConversation = (currentConversationId, recipient) => {
        setCurrentConversationId(currentConversationId);
        setCurrentRecipient(recipient);
        setShowConversations(false);
        removeFromConvoQueue(currentConversationId);
    };
    const addToConvoQueue = (conversationId, recipient) => {
        setConversationQueue((queue) => [{ conversationId, recipient }, ...queue]);
        closeMessages();
    };
    const removeFromConvoQueue = (conversationId) => {
        setConversationQueue((queue) => queue.filter((convoEntry) => convoEntry.conversationId !== conversationId));
    };
    const closeMessages = () => {
        setCurrentConversationId(null);
        setCurrentRecipient(null);
    };
    return (<div className="relative">
      <IconButton_1.default onClick={() => {
            setShowConversations((conversations) => !conversations);
            if (showNotificationBadge) {
                setShowNotificationBadge(false);
            }
        }} shouldFill={showConversations}>
        <io5_1.IoChatboxOutline />
      </IconButton_1.default>
      {showNotificationBadge && (<div className="absolute right-[6px] top-[6px] h-2 w-2 animate-pulse rounded-full bg-red-600"/>)}
      {showConversations && (<Conversations_1.default selectConversation={selectConversation} setShowConversations={setShowConversations}/>)}
      {currentConversationId && (<Messages_1.default setCurrentConversationId={setCurrentConversationId} currentRecipient={currentRecipient} currentConversationId={currentConversationId} setCurrentRecipient={setCurrentRecipient} queueLength={conversationQueue.length} addToConvoQueue={addToConvoQueue} closeMessages={closeMessages}/>)}
      {conversationQueue.length > 0 && (<ul className="fixed bottom-4 right-4 space-y-3 leading-[0]">
          {conversationQueue.map((convoEntry) => {
                return (<li key={convoEntry.conversationId}>
                <button onClick={() => {
                        setCurrentConversationId(convoEntry.conversationId);
                        setCurrentRecipient(convoEntry.recipient);
                        removeFromConvoQueue(convoEntry.conversationId);
                    }}>
                  <img src={convoEntry.recipient.image || ''} alt="avatar profile image" className="h-12 w-12 rounded-full"/>
                </button>
              </li>);
            })}
        </ul>)}
    </div>);
}
exports.default = Chat;
