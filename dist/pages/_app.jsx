"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../styles/global.css");
const react_1 = require("next-auth/react");
const trpc_1 = require("../utils/trpc");
const next_themes_1 = require("next-themes");
const MyApp = ({ Component, pageProps: { session, ...pageProps }, }) => {
    return (<next_themes_1.ThemeProvider defaultTheme="light">
      <react_1.SessionProvider session={session}>
        <Component {...pageProps}/>
      </react_1.SessionProvider>
    </next_themes_1.ThemeProvider>);
};
MyApp.getInitialProps = async ({ ctx }) => {
    return {
        session: await (0, react_1.getSession)(ctx),
    };
};
exports.default = trpc_1.trpc.withTRPC(MyApp);
