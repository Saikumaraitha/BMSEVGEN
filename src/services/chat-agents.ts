import type {
  ChatProject,
  ProjectChat,
  RecentChat,
  AgentCategory,
  AgentChatMessage,
  FrequentQuery,
  ChatMode,
  RawNavigationResponse,
} from '../types/chat-agents';
import api from '../lib/axios';
import { awsSigV4Api } from './http';
import { realChatApiAdapter } from './chatbot/realAdaptor';
import type {
  CreateChatResponse,
  SubmitFeedbackRequest,
  SubmitFeedbackResponse,
  SaveChatRequest,
  SaveChatResponse,
  DeleteChatResponse,
  DeleteProjectResponse,
  UnlinkChatFromProjectResponse,
  RenameChatResponse,
  RenameProjectResponse,
} from './chatbot/contracts';

export async function getChatProjects(assetId: string): Promise<ChatProject[]> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockProjects } = await import('../mocks/chat-agents');
    return mockProjects;
  }
  const { data } = await api.get<ChatProject[]>(`/chat-agents/projects?assetId=${assetId}`);
  return data;
}

export async function getRecentChats(assetId: string): Promise<RecentChat[]> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockRecentChats } = await import('../mocks/chat-agents');
    return mockRecentChats;
  }
  const { data } = await api.get<RecentChat[]>(`/chat-agents/recent-chats?assetId=${assetId}`);
  return data;
}

export async function getChatProjectsAndRecents(iepId: string): Promise<RawNavigationResponse> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? '').replace(/\/$/, '');
  return awsSigV4Api.get<RawNavigationResponse>(`${base}/api/v1/chats/navigation`, { query: { iep_id: iepId } });
}

export async function getAgentCategories(): Promise<AgentCategory[]> {
  const { mockAgentCategories } = await import('../mocks/chat-agents');
  return mockAgentCategories;
}

export async function getChatMessages(chatId: string): Promise<AgentChatMessage[]> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockChatMessages } = await import('../mocks/chat-agents');
    return mockChatMessages;
  }
  const { data } = await api.get<AgentChatMessage[]>(`/chat-agents/messages?chatId=${chatId}`);
  return data;
}

export async function getFrequentQueries(): Promise<FrequentQuery[]> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockFrequentQueries } = await import('../mocks/chat-agents');
    return mockFrequentQueries;
  }
  const response = await realChatApiAdapter.getFrequentQueries();
  return response.queries.map((q) => ({ id: q.id, question: q.text }));
}

// ─── Project APIs ─────────────────────────────────────────────────────────────

export async function createProject(_assetId: string, name: string, iepId: string): Promise<ChatProject> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    return { id: `proj-${Date.now()}`, name, chats: [] };
  }
  const response = await realChatApiAdapter.createProject({ name, iep_id: iepId });
  return {
    id: response.projectId,
    name: response.name,
    chats: [],
  };
}

export async function deleteProject(
  projectId: string,
  retainChats = true,
): Promise<DeleteProjectResponse> {
  return realChatApiAdapter.deleteProject({ projectId, retain_chats: retainChats });
}

export async function renameProject(
  projectId: string,
  name: string,
): Promise<RenameProjectResponse> {
  return realChatApiAdapter.renameProject({ projectId, name });
}

// ─── Chat Session APIs ────────────────────────────────────────────────────────

export async function createChat(
  projectId: string | null,
  iepId: string,
  responseStyle: ChatMode = 'concise',
): Promise<CreateChatResponse> {
  return realChatApiAdapter.createChat({
    project_id: projectId,
    iep_id: iepId,
    response_style: responseStyle,
  });
}

export async function deleteChat(chatId: string): Promise<DeleteChatResponse> {
  return realChatApiAdapter.deleteChat({ chatId });
}

export async function renameChat(chatId: string, title: string): Promise<RenameChatResponse> {
  return realChatApiAdapter.renameChat({ chatId, title });
}

export async function unlinkChatFromProject(
  projectId: string,
  chatId: string,
): Promise<UnlinkChatFromProjectResponse> {
  return realChatApiAdapter.unlinkChatFromProject({ projectId, chatId });
}

export async function saveChat(request: SaveChatRequest): Promise<SaveChatResponse> {
  return realChatApiAdapter.saveChat(request);
}

// ─── Message APIs ─────────────────────────────────────────────────────────────

export async function submitFeedback(
  request: SubmitFeedbackRequest,
): Promise<SubmitFeedbackResponse> {
  return realChatApiAdapter.submitFeedback(request);
}

// Returns only the AI response; caller is responsible for optimistically adding the user message.
export async function sendChatMessage(
  chatId: string,
  content: string,
  mode: ChatMode,
): Promise<AgentChatMessage> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    await new Promise((res) => setTimeout(res, 800));
    return {
      id: `amsg-${Date.now()}`,
      role: 'ai',
      content: `## Response\n\nI'm reviewing the available evidence for your query.\n\n- **Context:** Pumitamig 1L NSCLC competitive landscape\n- **Mode:** ${mode === 'concise' ? 'Concise summary' : 'Detailed analysis'}\n\nConnect the EvGen API to retrieve live clinical insights.`,
      timestamp: new Date().toISOString(),
    };
  }
  const { data } = await api.post<AgentChatMessage>('/chat-agents/messages', {
    chatId,
    content,
    mode,
  });
  return data;
}

export async function runAgent(agentId: string, chatId: string): Promise<AgentChatMessage> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockAgentResponseContent, mockAgentCategories } = await import('../mocks/chat-agents');
    await new Promise((res) => setTimeout(res, 1500));
    let agentName = agentId;
    for (const cat of mockAgentCategories) {
      const found = cat.agents.find((a) => a.id === agentId);
      if (found) { agentName = found.name; break; }
    }
    return {
      id: `amsg-${Date.now()}`,
      role: 'ai',
      content:
        mockAgentResponseContent[agentId] ??
        `## ${agentName}\n\nAnalysis complete. Connect the EvGen API to retrieve live insights for this agent.`,
      timestamp: new Date().toISOString(),
    };
  }
  const { data } = await api.post<AgentChatMessage>(`/chat-agents/agents/${agentId}/run`, { chatId });
  return data;
}

export async function addMessageToNotes(messageId: string): Promise<void> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    return;
  }
  await api.put(`/chat-agents/messages/${messageId}/notes`);
}

// ─── Re-exports for convenience ───────────────────────────────────────────────

export type { CreateChatResponse, SubmitFeedbackRequest, SubmitFeedbackResponse, SaveChatRequest, SaveChatResponse };
export type { ProjectChat };
