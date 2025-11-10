import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      email: string;
      username: string;
      roleId?: string;
      sex?: string;
      dayOfBirth?: string;
      lastLogin?: string;
    };
    admin?: {
      id: string;
      username: string;
      role: string;
    };
  }
}