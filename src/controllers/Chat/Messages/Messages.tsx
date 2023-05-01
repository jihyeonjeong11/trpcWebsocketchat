import { useEffect, useRef } from 'react';
import { trpc } from '../../../utils/trpc';
import type { ChatState } from '../Chat';
import MessageTextArea from '../MessagesTextArea/MessagesTextArea';
import MessageHeader from './MessageHeader/MessageHeader';
import MessageSection from './MessageSection/MessageSection';
import NewConversationUserInput from './NewConversationUserInput/NewConversationUserInput';

// import { User } from '@prisma/client';

export interface User {
  id: string;
  username: string;
  image: string;
  name: string;
}

export interface MessagesState {
  addToConvoQueue: (conversationId: string, recipient: Partial<User>) => void;
  closeMessages: () => void;
}

type Props = ChatState &
  MessagesState & {
    queueLength: number;
  };
export default function Messages({
  currentRecipient,
  currentConversationId,
  setCurrentRecipient,
  setCurrentConversationId,
  queueLength,
  addToConvoQueue,
  closeMessages,
}: Props) {
  const { data: conversationIdFound, refetch } =
    trpc.chat.findConversation.useQuery(
      {
        userId: currentRecipient?.id || '',
      },
      { enabled: false },
    );

  useEffect(() => {
    if (currentRecipient?.id === 'newMessage') {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRecipient]);

  useEffect(() => {
    if (conversationIdFound) {
      setCurrentConversationId(conversationIdFound);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationIdFound]);

  return (
    <div
      className={`fixed bottom-0 right-0 flex flex-col space-y-5 rounded-xl bg-level1 p-5 shadow-sm max-md:top-0 max-md:left-0 md:right-4 md:bottom-4 md:h-[540px] md:w-96 ${
        queueLength ? 'md:right-[76px]' : ''
      } `}
    >
      <MessageHeader
        currentConversationId={currentConversationId}
        currentRecipient={currentRecipient}
        addToConvoQueue={addToConvoQueue}
        closeMessages={closeMessages}
      />
      {currentRecipient === null && (
        <NewConversationUserInput setCurrentRecipient={setCurrentRecipient} />
      )}
      <MessageSection
        currentRecipient={currentRecipient}
        currentConversationId={currentConversationId}
      />
      {currentRecipient !== null && (
        <MessageTextArea
          currentConversationId={currentConversationId}
          currentRecipient={currentRecipient}
          setCurrentConversationId={setCurrentConversationId}
        />
      )}
    </div>
  );
}
