import { DefaultUser, type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      theme: 'light' | 'dark';
      username: string;
      image: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    username: string;
    theme: 'light' | 'dark';
  }
}
