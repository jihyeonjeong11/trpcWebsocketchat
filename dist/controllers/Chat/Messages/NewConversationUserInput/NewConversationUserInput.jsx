"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const useOnChange_1 = __importDefault(require("../../../../hooks/useOnChange"));
const react_1 = require("react");
const trpc_1 = require("../../../../utils/trpc");
const styles = {
    wrapper: 'absolute left-0 right-0 top-[calc(100%+12px)] rounded-lg bg-level2',
};
function NewConversationUserInput({ setCurrentRecipient, }) {
    const { values: { user }, setValues, handleChange, } = (0, useOnChange_1.default)({ user: '' });
    const { data: users, isLoading, error, refetch, } = trpc_1.trpc.user.users.useQuery({
        user: user,
    }, { enabled: false });
    const [searchResults, setSearchResults] = (0, react_1.useState)();
    const timer = (0, react_1.useRef)();
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
    (0, react_1.useEffect)(() => {
        if (user) {
            clearTimeout(timer.current);
            timer.current = setTimeout(refetch, 200);
        }
        else {
            setSearchResults([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
    (0, react_1.useEffect)(() => {
        setSearchResults(users);
    }, [users]);
    return (<div className="relative ">
      <input placeholder="Search User" className="h-10 w-full rounded-lg bg-level2 px-3 py-2 outline-none placeholder:text-quaternaryText" name="user" onChange={handleChange} value={user} autoComplete="off"/>
      {((isLoading && user !== '') || error) && (<div className={styles.wrapper}>
          <p className="py-2 text-center">
            {isLoading ? 'loading...' : 'Error'}
          </p>
        </div>)}
      {searchResults && (<ul className={`${styles.wrapper}`}>
          {searchResults.map((userEntry) => (<li className="first:rounded-t-lg last:rounded-b-lg hover:bg-level2Hover" key={userEntry.name}>
              <button className="mx-2 flex w-full items-center space-x-2 p-3 py-2 text-left" onClick={() => setCurrentRecipient(userEntry)}>
                <img src={userEntry.image || ''} alt="avartar profile image" className="mr-2 h-11 w-11 rounded-full"/>
                <div>
                  <p>{userEntry.name}</p>
                  <p className="text-sm text-tertiaryText">
                    {userEntry.username}
                  </p>
                </div>
              </button>
            </li>))}
        </ul>)}
    </div>);
}
exports.default = NewConversationUserInput;
