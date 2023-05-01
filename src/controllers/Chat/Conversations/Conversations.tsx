import { IoAddOutline, IoChevronBack } from 'react-icons/io5';
import IconButton from '../../../components/IconButton/IconButton';
import type { User } from '@prisma/client';
import { trpc } from '../../../utils/trpc';

// db composition

// Converssations table
//id

// Message
//id
//conversationId

// ConversationUser
//userId
//conversationId

interface Props {
  selectConversation: (
    currentConversationId: string,
    currentRecipient: Partial<User> | null,
  ) => void;
  setShowConversations: (bool: boolean) => void;
}

const styles = {
  wrapper:
    'fixed top-0 bottom-0 left-0 right-0 flex flex-col space-y-5 bg-level1 p-5 md:bottom-[unset] md:left-[unset] md:top-[76px] md:right-4 md:h-[540px] md:w-96 md:rounded-xl md:shadow-sm',
};

export default function Conversations({
  selectConversation,
  setShowConversations,
}: Props) {
  const {
    data: conversations,
    isLoading,
    error,
  } = trpc.chat.conversations.useQuery();

  if (isLoading || error) {
    return (
      <div className={`${styles.wrapper} flex items-center justify-center`}>
        <p>{false ? 'Loading...' : 'Error'}</p>
      </div>
    );
  }
  return (
    <div className={styles.wrapper}>
      <div className="flex items-center justify-between">
        <IconButton
          className="md:hidden"
          onClick={() => setShowConversations(false)}
        >
          <IoChevronBack />
        </IconButton>
        <p className="text-lg">Messages</p>
        <IconButton onClick={() => selectConversation('newMessage', null)}>
          <IoAddOutline />
        </IconButton>
      </div>
      <ul>
        {conversations.map((conversationInfo) => {
          const recipient =
            conversationInfo.conversation.conversationUsers[0]!.userId ===
            conversationInfo.userId
              ? conversationInfo.conversation.conversationUsers[1]?.user
              : conversationInfo.conversation.conversationUsers[0]?.user;
          return (
            <li
              key={conversationInfo.userId + 'conversation'}
              className="rounded-lg py-2 hover:bg-level1Hover"
            >
              <button
                className="space-x mx-2 flex items-center space-x-2 text-left"
                onClick={() =>
                  selectConversation(
                    conversationInfo.conversation.id,
                    recipient!,
                  )
                }
              >
                <img
                  src={recipient!.image || ''}
                  alt="avartar image"
                  className="h-12 w-12 rounded-full"
                />
                <div className="flex flex-col space-y-2">
                  <p>{recipient!.name}</p>
                  <p className="text-sm text-tertiaryText">
                    {conversationInfo.conversation.lastMessage!.userId !==
                    recipient!.id
                      ? 'You: '
                      : ''}
                    {conversationInfo.conversation.lastMessage?.messageText}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

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
