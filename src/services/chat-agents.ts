import type {
  ChatProject,
  ProjectChat,
  RecentChat,
  AgentCategory,
  AgentChatMessage,
  FrequentQuery,
  ChatMode,
} from '../types/chat-agents';
import api from '../lib/axios';

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

export async function getAgentCategories(): Promise<AgentCategory[]> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockAgentCategories } = await import('../mocks/chat-agents');
    return mockAgentCategories;
  }
  const { data } = await api.get<AgentCategory[]>('/chat-agents/agents');
  return data;
}

export async function getChatMessages(chatId: string): Promise<AgentChatMessage[]> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockChatMessages } = await import('../mocks/chat-agents');
    return mockChatMessages;
  }
  const { data } = await api.get<AgentChatMessage[]>(`/chat-agents/messages?chatId=${chatId}`);
  return data;
}

export async function getFrequentQueries(assetId: string): Promise<FrequentQuery[]> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockFrequentQueries } = await import('../mocks/chat-agents');
    return mockFrequentQueries;
  }
  const { data } = await api.get<FrequentQuery[]>(`/chat-agents/frequent-queries?assetId=${assetId}`);
  return data;
}

export async function createProject(assetId: string, name: string): Promise<ChatProject> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    return { id: `proj-${Date.now()}`, name, chats: [] };
  }
  const { data } = await api.post<ChatProject>('/chat-agents/projects', { assetId, name });
  return data;
}

export async function createChat(projectId: string, title: string): Promise<ProjectChat> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    return { id: `chat-${Date.now()}`, title, projectId };
  }
  const { data } = await api.post<ProjectChat>('/chat-agents/chats', { projectId, title });
  return data;
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
