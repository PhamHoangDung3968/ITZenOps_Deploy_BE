import { v4 as uuidv4 } from 'uuid';

interface SessionData {
  user: any;
  createdAt: number;
}

const sessionStore: Record<string, SessionData> = {};

export const createSession = (user: any): string => {
  const sessionId = uuidv4();
  sessionStore[sessionId] = { user, createdAt: Date.now() };
  return sessionId;
};

export const getSession = (sessionId: string): SessionData | undefined => {
  return sessionStore[sessionId];
};

export const deleteSession = (sessionId: string): void => {
  delete sessionStore[sessionId];
};