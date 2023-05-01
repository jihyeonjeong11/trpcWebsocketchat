import UseOnChange from '../../../../hooks/useOnChange';
import { useEffect, useState, useRef } from 'react';
import type { ChatState } from '../../Chat';
import { trpc } from '../../../../utils/trpc';
// const users = [
//   {
//     id: "1",
//     name: "me",
//     image:
//       "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/712.jpg",
//     username: "me",
//   },
//   {
//     id: "3",
//     name: "John Rumi",
//     image:
//       "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/712.jpg",
//     username: "jrumi",
//   },
// ];

type Props = Pick<ChatState, 'setCurrentRecipient'>;

const styles = {
  wrapper: 'absolute left-0 right-0 top-[calc(100%+12px)] rounded-lg bg-level2',
};

export default function NewConversationUserInput({
  setCurrentRecipient,
}: Props) {
  const {
    values: { user },
    setValues,
    handleChange,
  } = UseOnChange({ user: '' });

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = trpc.user.users.useQuery(
    {
      user: user!,
    },
    { enabled: false },
  );

  const [searchResults, setSearchResults] = useState<typeof users>();
  const timer = useRef<NodeJS.Timeout>();

  // const fetchUsers = () => {
  //   if (!user) {
  //     setSearchResults([]);
  //     return;
  //   }
  //   setSearchResults(
  //     users.filter(
  //       (userEntry) =>
  //         userEntry.name.toLowerCase().includes(user.toLowerCase()) ||
  //         userEntry.username.toLowerCase().includes(user.toLowerCase())
  //     )
  //   );
  // };

  useEffect(() => {
    if (user) {
      clearTimeout(timer.current);
      timer.current = setTimeout(refetch, 200);
    } else {
      setSearchResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    setSearchResults(users);
  }, [users]);

  return (
    <div className="relative ">
      <input
        placeholder="Search User"
        className="h-10 w-full rounded-lg bg-level2 px-3 py-2 outline-none placeholder:text-quaternaryText"
        name="user"
        onChange={handleChange}
        value={user}
        autoComplete="off"
      />
      {((isLoading && user !== '') || error) && (
        <div className={styles.wrapper}>
          <p className="py-2 text-center">
            {isLoading ? 'loading...' : 'Error'}
          </p>
        </div>
      )}
      {searchResults && (
        <ul className={`${styles.wrapper}`}>
          {searchResults.map((userEntry) => (
            <li
              className="first:rounded-t-lg last:rounded-b-lg hover:bg-level2Hover"
              key={userEntry.name}
            >
              <button
                className="mx-2 flex w-full items-center space-x-2 p-3 py-2 text-left"
                onClick={() => setCurrentRecipient(userEntry)}
              >
                <img
                  src={userEntry.image || ''}
                  alt="avartar profile image"
                  className="mr-2 h-11 w-11 rounded-full"
                />
                <div>
                  <p>{userEntry.name}</p>
                  <p className="text-sm text-tertiaryText">
                    {userEntry.username}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
