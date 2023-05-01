"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const io5_1 = require("react-icons/io5");
const IconButton_1 = __importDefault(require("../../../components/IconButton/IconButton"));
const useOnChange_1 = __importDefault(require("../../../hooks/useOnChange"));
const react_1 = require("react");
const trpc_1 = require("../../../utils/trpc");
function MessageTextArea({ currentConversationId, currentRecipient, setCurrentConversationId, }) {
    const { values: { message }, setValues, handleChange, } = (0, useOnChange_1.default)({ message: '' });
    const textAreaRef = (0, react_1.useRef)(null);
    const utils = trpc_1.trpc.useContext();
    const sendMessageMutation = trpc_1.trpc.chat.sendMessage.useMutation();
    const sendMessage = () => {
        if (message) {
            sendMessageMutation.mutate({
                messageText: message,
                ...(currentConversationId === 'newMessage'
                    ? { userId: currentRecipient.id }
                    : { conversationId: currentConversationId }),
            }, {
                onSettled: (data, error) => {
                    if (currentConversationId !== 'newMessage') {
                        utils.chat.conversations.invalidate(); // to get latest
                        utils.chat.messages.invalidate({
                            conversationId: currentConversationId,
                        });
                    }
                    if (data) {
                        setCurrentConversationId(data.id);
                    }
                    if (error) {
                        alert(error.message);
                    }
                    setValues({ message: '' });
                },
            });
        }
        setValues({ messages: '' });
    };
    const resizeTextArea = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = '';
            textAreaRef.current.style.height =
                Math.min(textAreaRef.current.scrollHeight, 144) + 'px';
        }
    };
    const onKeyDown = (event) => {
        if (event.key === 'Enter' && !event.altKey && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
        if (event.key === 'Enter' && event.altKey) {
            event.preventDefault();
            setValues((values) => ({ message: values.message + '\r\n' }));
        }
    };
    (0, react_1.useEffect)(() => {
        resizeTextArea();
    }, [message]);
    return (<div className="flex items-center space-x-1">
      <textarea name="message" ref={textAreaRef} value={message} placeholder="Message" onChange={handleChange} onKeyDown={onKeyDown} className="h-10 max-h-36 w-full resize-none bg-level2 py-2 px-3 outline-none placeholder:text-quaternaryText"/>
      {message !== '' && (<IconButton_1.default onClick={sendMessage}>
          <io5_1.IoSend />
        </IconButton_1.default>)}
    </div>);
}
exports.default = MessageTextArea;
