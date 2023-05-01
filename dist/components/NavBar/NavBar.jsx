"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const io5_1 = require("react-icons/io5");
const IconButton_1 = __importDefault(require("../IconButton/IconButton"));
// import Chat from '../../controllers/Chat/Chat';
const react_1 = require("next-auth/react");
const trpc_1 = require("../../utils/trpc");
const next_themes_1 = require("next-themes");
const react_2 = require("react");
const Chat_1 = __importDefault(require("../../controllers/Chat/Chat"));
function Navbar() {
    var _a;
    const { theme, setTheme } = (0, next_themes_1.useTheme)();
    const { data: sessionData } = (0, react_1.useSession)();
    const changeUserThemeMutation = trpc_1.trpc.user.changeUserTheme.useMutation();
    const changeTheme = () => {
        changeUserThemeMutation.mutate({
            theme: theme === 'light' ? 'dark' : 'light',
        }, {
            onSettled: (data, error) => {
                if (data) {
                    setTheme(data.theme);
                }
                if (error) {
                    alert(error.message);
                }
            },
        });
    };
    (0, react_2.useEffect)(() => {
        if (sessionData === null || sessionData === void 0 ? void 0 : sessionData.user) {
            if ((sessionData === null || sessionData === void 0 ? void 0 : sessionData.user.theme) !== theme) {
                setTheme(sessionData === null || sessionData === void 0 ? void 0 : sessionData.user.theme);
            }
        }
        else {
            if (theme !== 'light') {
                setTheme('light');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionData]);
    return (<nav className="fixed top-0 z-50 flex h-14 w-full items-center justify-end space-x-2 bg-level1 px-4 shadow-sm">
      {sessionData ? (<>
          <IconButton_1.default onClick={changeTheme}>
            <io5_1.IoMoonOutline />
          </IconButton_1.default>
          <div>
            <Chat_1.default />
          </div>
          <div className="flex h-10 w-10 items-center justify-center">
            <img src={((_a = sessionData.user) === null || _a === void 0 ? void 0 : _a.image) ||
                'https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg'} alt="avatar image" className="h-8 w-8 rounded-full"/>
          </div>
        </>) : (<button onClick={() => (0, react_1.signIn)()}>sign in</button>)}
    </nav>);
}
exports.default = Navbar;
