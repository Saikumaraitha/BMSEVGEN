const AI_ENGINE_BASE_URL = `${import.meta.env.VITE_CHAT_AI_ENGINE_BASE_URL ?? ''}`
  .trim()
  .replace(/\/+$/, '');

if (!AI_ENGINE_BASE_URL) {
  throw new Error('VITE_CHAT_AI_ENGINE_BASE_URL is required');
}

const EVGEN_BASE_URL = `${import.meta.env.VITE_AI_ENGINE_BASE_URL ?? ''}`
  .trim()
  .replace(/\/+$/, '');

if (!EVGEN_BASE_URL) {
  throw new Error('VITE_AI_ENGINE_BASE_URL is required');
}

const withAiEngineBase = (path: string): string => `${AI_ENGINE_BASE_URL}${path}`;
const withEvgenBase = (path: string): string => `${EVGEN_BASE_URL}/api/v1${path}`;

export const CHAT_ENDPOINTS = {
  countries: withEvgenBase('/reference/countries'),
  therapeuticAreas: withEvgenBase('/reference/therapeutic-areas'),
  products: withEvgenBase('/reference/products'),
  indications: withEvgenBase('/reference/indications'),
  dataSources: withEvgenBase('/reference/data-sources'),
  lastRunAt: withEvgenBase('/medinsights/latest-run-at'),
  frequentQueries: withAiEngineBase('/faqs/generated'),
  navigation: withAiEngineBase('/chats/navigation'),
  createChat: withAiEngineBase('/chats'),
  chatMessages: (chatId: string) => withAiEngineBase(`/chats/${chatId}/messages`),
  sendMessage: withAiEngineBase('/chats/message'),
  sendSessionMessage: (sessionId: string) => withAiEngineBase(`/sessions/${sessionId}/messages`),
  sendMessageStream: (sessionId: string) => withAiEngineBase(`/sessions/${sessionId}/messages/stream`),
  saveChat: (chatId: string) => withAiEngineBase(`/chats/${chatId}/save`),
  submitFeedback: (chatId: string, messageId: string) => withAiEngineBase(`/chats/${chatId}/messages/${messageId}/feedback`),
  createProject: withEvgenBase('/projects'),
  addChatToProject: (projectId: string) => withEvgenBase(`/projects/${projectId}/chats`),
  unlinkChatFromProject: (projectId: string, chatId: string) => withEvgenBase(`/projects/${projectId}/chats/${chatId}`),
  deleteProject: (projectId: string) => withEvgenBase(`/projects/${projectId}`),
  deleteChat: (chatId: string) => withAiEngineBase(`/chats/${chatId}`),
  renameChat: withAiEngineBase('/chats/rename'),
  renameProject: withAiEngineBase('/chats/rename_project'),
  recentChats: withAiEngineBase('/chats/navigation'),
};
