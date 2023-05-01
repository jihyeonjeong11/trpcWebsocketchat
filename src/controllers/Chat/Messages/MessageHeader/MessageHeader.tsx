import { IoCloseOutline, IoRemoveOutline } from 'react-icons/io5';
import IconButton from '../../../../components/IconButton/IconButton';
import type { ChatState } from '../../Chat';
import { MessagesState } from '../Messages';

type Props = Omit<
  ChatState,
  'setCurrentConversationId' | 'setCurrentRecipient'
> &
  MessagesState;

export default function MessageHeader({
  currentConversationId,
  currentRecipient,
  closeMessages,
  addToConvoQueue,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      {!currentRecipient ? (
        <p>New Message</p>
      ) : (
        <div className="flex items-center">
          <img
            className="mr-2 h-11 w-11 rounded-full"
            src={currentRecipient.image || ''}
            alt="avatar profile image"
          />
          <div className="flex flex-col">
            <p>{currentRecipient.name}</p>
            <p className="text-sm text-tertiaryText">
              {currentRecipient.username}
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center">
        {currentRecipient && (
          <IconButton
            onClick={() =>
              addToConvoQueue(currentConversationId!, currentRecipient)
            }
          >
            <IoRemoveOutline />
          </IconButton>
        )}
        <IconButton onClick={closeMessages}>
          <IoCloseOutline />
        </IconButton>
      </div>
    </div>
  );
}
