"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const io5_1 = require("react-icons/io5");
const IconButton_1 = __importDefault(require("../../../../components/IconButton/IconButton"));
function MessageHeader({ currentConversationId, currentRecipient, closeMessages, addToConvoQueue, }) {
    return (<div className="flex items-center justify-between">
      {!currentRecipient ? (<p>New Message</p>) : (<div className="flex items-center">
          <img className="mr-2 h-11 w-11 rounded-full" src={currentRecipient.image || ''} alt="avatar profile image"/>
          <div className="flex flex-col">
            <p>{currentRecipient.name}</p>
            <p className="text-sm text-tertiaryText">
              {currentRecipient.username}
            </p>
          </div>
        </div>)}
      <div className="flex items-center">
        {currentRecipient && (<IconButton_1.default onClick={() => addToConvoQueue(currentConversationId, currentRecipient)}>
            <io5_1.IoRemoveOutline />
          </IconButton_1.default>)}
        <IconButton_1.default onClick={closeMessages}>
          <io5_1.IoCloseOutline />
        </IconButton_1.default>
      </div>
    </div>);
}
exports.default = MessageHeader;
