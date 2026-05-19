import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout/AppLayout';
import AssetSubNav from '../../components/AssetSubNav/AssetSubNav';
import ChatAgentsSidebar from '../../components/ChatAgents/ChatAgentsSidebar';
import ChatWindow from '../../components/ChatAgents/ChatWindow';
import AgentMarketplace from '../../components/ChatAgents/AgentMarketplace';
import {
  mockProjects,
  mockRecentChats,
  mockAgentCategories,
  mockChatMessages,
  mockFrequentQueries,
  mockAgentResponseContent,
} from '../../mocks/chat-agents';
import type { AgentChatMessage, AgentExecutionState, ChatMode, ChatProject } from '../../types/chat-agents';
import type { Asset } from '../../types/home';
import { getAssetDetails } from '../../services/home';
import { ROUTES } from '../../constants/routes';

let nextMsgId = mockChatMessages.length + 1;
let nextProjectId = mockProjects.length + 1;

const MOCK_USER_NAME = 'Ava Sharma';

function getAgentById(agentId: string) {
  for (const cat of mockAgentCategories) {
    const agent = cat.agents.find((a) => a.id === agentId);
    if (agent) return agent;
  }
  return null;
}

function ChatAgents() {
  const navigate = useNavigate();
  const { assetId = '' } = useParams<{ assetId: string }>();
  const [asset, setAsset] = useState<Asset>();

  useEffect(() => {
    getAssetDetails(assetId).then(setAsset);
  }, [assetId]);

  const [projects, setProjects] = useState<ChatProject[]>(mockProjects);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [selectedAgentIds, setSelectedAgentIds] = useState<Set<string>>(new Set());
  const [executionStates, setExecutionStates] = useState<Record<string, AgentExecutionState>>({});

  const addMessage = useCallback((msg: Omit<AgentChatMessage, 'id' | 'timestamp'>) => {
    setMessages((prev) => [
      ...prev,
      {
        ...msg,
        id: `amsg-${String(nextMsgId++).padStart(3, '0')}`,
        timestamp: new Date().toISOString(),
      },
    ]);
    setActiveChatId((prev) => prev ?? 'new');
  }, []);

  const simulateAgent = useCallback(
    (agentId: string) => {
      const agent = getAgentById(agentId);
      if (!agent) return;

      setExecutionStates((prev) => ({ ...prev, [agentId]: 'running' }));

      setTimeout(() => {
        setExecutionStates((prev) => ({ ...prev, [agentId]: 'done' }));
        addMessage({
          role: 'ai',
          content:
            mockAgentResponseContent[agentId] ??
            `## ${agent.name}\n\nAnalysis complete. Connect the EvGen API to retrieve live insights for this agent.`,
        });
      }, 1500);
    },
    [addMessage]
  );

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleAddProject = (name: string) => {
    const id = `proj-${String(nextProjectId++).padStart(3, '0')}`;
    setProjects((prev) => [...prev, { id, name, chats: [] }]);
    setActiveProjectId(id);
  };

  const handleProjectSelect = (projectId: string) => {
    setActiveProjectId(projectId);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveChatId(null);
    setExecutionStates({});
    setSelectedAgentIds(new Set());
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    setMessages(mockChatMessages);
    const owningProject = projects.find((p) => p.chats.some((c) => c.id === chatId));
    if (owningProject) setActiveProjectId(owningProject.id);
  };

  const handleSendMessage = (text: string, mode: ChatMode) => {
    // On the first message of a new chat, register it under the active project
    if (activeChatId === null && activeProjectId) {
      const newChatId = `chat-${Date.now()}`;
      setActiveChatId(newChatId);
      const chatTitle = text.length > 50 ? `${text.slice(0, 50)}…` : text;
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? { ...p, chats: [...p.chats, { id: newChatId, title: chatTitle, projectId: activeProjectId }] }
            : p,
        ),
      );
    }

    addMessage({
      role: 'user',
      content: text,
      userInitials: 'AS',
    });
    setTimeout(() => {
      addMessage({
        role: 'ai',
        content: `## Response\n\nI'm reviewing the available evidence for your query.\n\n- **Context:** Pumitamig 1L NSCLC competitive landscape\n- **Mode:** ${mode === 'concise' ? 'Concise summary' : 'Detailed analysis'}\n\nConnect the EvGen API to retrieve live clinical insights.`,
      });
    }, 800);
  };

  const handleAddToNotes = (message: AgentChatMessage) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, addedToNotes: true } : m))
    );
  };

  const handleCheckAgent = (agentId: string) => {
    setSelectedAgentIds((prev) => {
      const next = new Set(prev);
      if (next.has(agentId)) { next.delete(agentId); } else { next.add(agentId); }
      return next;
    });
  };

  const handleRunAgent = (agentId: string) => {
    simulateAgent(agentId);
  };

  const handleRunAll = (categoryId: string) => {
    const category = mockAgentCategories.find((c) => c.id === categoryId);
    if (!category) return;
    category.agents.forEach((agent, i) => {
      setTimeout(() => simulateAgent(agent.id), i * 400);
    });
  };

  const handleRunSelected = () => {
    Array.from(selectedAgentIds).forEach((agentId, i) => {
      setTimeout(() => simulateAgent(agentId), i * 400);
    });
  };

  const handleClearSelected = () => setSelectedAgentIds(new Set());

  const handleBack = () => navigate(ROUTES.HOME);

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <AssetSubNav
          assetName={asset?.name ?? ''}
          activeTab="Chat & Agents"
          onBack={handleBack}
        />

        <div className="flex flex-1 overflow-hidden">
          <ChatAgentsSidebar
            projects={projects}
            recentChats={mockRecentChats}
            activeChatId={activeChatId}
            activeProjectId={activeProjectId}
            onChatSelect={handleChatSelect}
            onNewChat={handleNewChat}
            onAddProject={handleAddProject}
            onProjectSelect={handleProjectSelect}
          />

          <ChatWindow
            userName={MOCK_USER_NAME}
            messages={messages}
            frequentQueries={mockFrequentQueries}
            onSendMessage={handleSendMessage}
            onAddToNotes={handleAddToNotes}
          />

          <AgentMarketplace
            categories={mockAgentCategories}
            selectedAgentIds={selectedAgentIds}
            executionStates={executionStates}
            onCheckAgent={handleCheckAgent}
            onRunAgent={handleRunAgent}
            onRunAll={handleRunAll}
            onRunSelected={handleRunSelected}
            onClearSelected={handleClearSelected}
          />
        </div>
      </div>
    </AppLayout>
  );
}

export default ChatAgents;
