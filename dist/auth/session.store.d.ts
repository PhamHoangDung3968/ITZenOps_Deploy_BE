interface SessionData {
    user: any;
    createdAt: number;
}
export declare const createSession: (user: any) => string;
export declare const getSession: (sessionId: string) => SessionData | undefined;
export declare const deleteSession: (sessionId: string) => void;
export {};
