"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSession = exports.getSession = exports.createSession = void 0;
const uuid_1 = require("uuid");
const sessionStore = {};
const createSession = (user) => {
    const sessionId = (0, uuid_1.v4)();
    sessionStore[sessionId] = { user, createdAt: Date.now() };
    return sessionId;
};
exports.createSession = createSession;
const getSession = (sessionId) => {
    return sessionStore[sessionId];
};
exports.getSession = getSession;
const deleteSession = (sessionId) => {
    delete sessionStore[sessionId];
};
exports.deleteSession = deleteSession;
//# sourceMappingURL=session.store.js.map