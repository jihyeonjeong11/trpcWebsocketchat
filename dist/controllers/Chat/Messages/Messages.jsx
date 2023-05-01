"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const trpc_1 = require("../../../utils/trpc");
const MessagesTextArea_1 = __importDefault(require("../MessagesTextArea/MessagesTextArea"));
const MessageHeader_1 = __importDefault(require("./MessageHeader/MessageHeader"));
const MessageSection_1 = __importDefault(require("./MessageSection/MessageSection"));
const NewConversationUserInput_1 = __importDefault(require("./NewConversationUserInput/NewConversationUserInput"));
function Messages({ currentRecipient, currentConversationId, setCurrentRecipient, setCurrentConversationId, queueLength, addToConvoQueue, closeMessages, }) {
    const { data: conversationIdFound, refetch } = trpc_1.trpc.chat.findConversation.useQuery({
        userId: (currentRecipient === null || currentRecipient === void 0 ? void 0 : currentRecipient.id) || '',
    }, { enabled: false });
    (0, react_1.useEffect)(() => {
        if ((currentRecipient === null || currentRecipient === void 0 ? void 0 : currentRecipient.id) === 'newMessage') {
            refetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRecipient]);
    (0, react_1.useEffect)(() => {
        if (conversationIdFound) {
            setCurrentConversationId(conversationIdFound);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationIdFound]);
    return (<div className={`fixed bottom-0 right-0 flex flex-col space-y-5 rounded-xl bg-level1 p-5 shadow-sm max-md:top-0 max-md:left-0 md:right-4 md:bottom-4 md:h-[540px] md:w-96 ${queueLength ? 'md:right-[76px]' : ''} `}>
      <MessageHeader_1.default currentConversationId={currentConversationId} currentRecipient={currentRecipient} addToConvoQueue={addToConvoQueue} closeMessages={closeMessages}/>
      {currentRecipient === null && (<NewConversationUserInput_1.default setCurrentRecipient={setCurrentRecipient}/>)}
      <MessageSection_1.default currentRecipient={currentRecipient} currentConversationId={currentConversationId}/>
      {currentRecipient !== null && (<MessagesTextArea_1.default currentConversationId={currentConversationId} currentRecipient={currentRecipient} setCurrentConversationId={setCurrentConversationId}/>)}
    </div>);
}
exports.default = Messages;
