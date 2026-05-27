import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout/AppLayout';
import AssetSubNav from '../../components/AssetSubNav/AssetSubNav';
import ChatAgentsSidebar from '../../components/ChatAgents/ChatAgentsSidebar';
import ChatWindow from '../../components/ChatAgents/ChatWindow';
import AgentMarketplace from '../../components/ChatAgents/AgentMarketplace';
import type {
  AgentChatMessage,
  AgentCategory,
  AgentExecutionState,
  ChatMode,
  ChatProject,
  FrequentQuery,
  RecentChat,
} from '../../types/chat-agents';
import type { Asset } from '../../types/home';
import { getAssetDetails } from '../../services/home';
import {
  getChatProjects,
  getRecentChats,
  getAgentCategories,
  getChatMessages,
  getFrequentQueries,
  createProject,
  createChat,
  sendChatMessage,
  runAgent as runAgentService,
  addMessageToNotes as addMessageToNotesService,
} from '../../services/chat-agents';
import { ROUTES } from '../../constants/routes';

const USER_INITIALS = 'AS';

function ChatAgents() {
  const navigate = useNavigate();
  const { assetId = '', indicationId = '' } = useParams<{ assetId: string; indicationId: string }>();

  const [asset, setAsset] = useState<Asset>();
  const [projects, setProjects] = useState<ChatProject[]>([]);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [agentCategories, setAgentCategories] = useState<AgentCategory[]>([]);
  const [frequentQueries, setFrequentQueries] = useState<FrequentQuery[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [selectedAgentIds, setSelectedAgentIds] = useState<Set<string>>(new Set());
  const [executionStates, setExecutionStates] = useState<Record<string, AgentExecutionState>>({});

  useEffect(() => {
    getAssetDetails(assetId).then(setAsset);
    getChatProjects(assetId).then(setProjects);
    getRecentChats(assetId).then(setRecentChats);
    getAgentCategories().then(setAgentCategories);
    getFrequentQueries(assetId).then(setFrequentQueries);
  }, [assetId]);

  const addMessage = useCallback((msg: AgentChatMessage) => {
    setMessages((prev) => [...prev, msg]);
    setActiveChatId((prev) => prev ?? 'new');
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleAddProject = async (name: string) => {
    const project = await createProject(assetId, name);
    setProjects((prev) => [...prev, project]);
    setActiveProjectId(project.id);
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

  const handleChatSelect = async (chatId: string) => {
    setActiveChatId(chatId);
    const msgs = await getChatMessages(chatId);
    setMessages(msgs);
    const owningProject = projects.find((p) => p.chats.some((c) => c.id === chatId));
    if (owningProject) setActiveProjectId(owningProject.id);
  };

  const handleSendMessage = async (text: string, mode: ChatMode) => {
    let currentChatId = activeChatId;

    if (currentChatId === null && activeProjectId) {
      const title = text.length > 50 ? `${text.slice(0, 50)}…` : text;
      const newChat = await createChat(activeProjectId, title);
      currentChatId = newChat.id;
      setActiveChatId(currentChatId);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId ? { ...p, chats: [...p.chats, newChat] } : p,
        ),
      );
    }

    // Add user message optimistically
    addMessage({
      id: `amsg-${Date.now()}`,
      role: 'user',
      content: text,
      userInitials: USER_INITIALS,
      timestamp: new Date().toISOString(),
    });

    const aiMessage = await sendChatMessage(currentChatId ?? 'new', text, mode);
    addMessage(aiMessage);
  };

  const handleAddToNotes = async (message: AgentChatMessage) => {
    await addMessageToNotesService(message.id);
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, addedToNotes: true } : m)),
    );
  };

  const handleCheckAgent = (agentId: string) => {
    setSelectedAgentIds((prev) => {
      const next = new Set(prev);
      if (next.has(agentId)) { next.delete(agentId); } else { next.add(agentId); }
      return next;
    });
  };

  const handleRunAgent = useCallback(async (agentId: string) => {
    setExecutionStates((prev) => ({ ...prev, [agentId]: 'running' }));
    try {
      const response = await runAgentService(agentId, activeChatId ?? 'new');
      setExecutionStates((prev) => ({ ...prev, [agentId]: 'done' }));
      addMessage(response);
    } catch {
      setExecutionStates((prev) => ({ ...prev, [agentId]: 'idle' }));
    }
  }, [addMessage, activeChatId]);


  const handleRunSelected = () => {
    Array.from(selectedAgentIds).forEach((agentId, i) => {
      setTimeout(() => handleRunAgent(agentId), i * 400);
    });
  };

  const handleClearSelected = () => setSelectedAgentIds(new Set());

  const handleRunComplete = useCallback(() => {
    setSelectedAgentIds(new Set());
    setExecutionStates({});
  }, []);

  const handleBack = () => navigate(ROUTES.HOME);

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <AssetSubNav
          assetName={asset?.name ?? ''}
          activeTab="Chat & Agents"
          indicationName={asset?.indications.find(i => i.id === indicationId)?.name}
          lastUpdated={asset?.lastUpdated}
          onBack={handleBack}
        />

        <div className="flex flex-1 overflow-hidden">
          <ChatAgentsSidebar
            projects={projects}
            recentChats={recentChats}
            activeChatId={activeChatId}
            activeProjectId={activeProjectId}
            onChatSelect={handleChatSelect}
            onNewChat={handleNewChat}
            onAddProject={handleAddProject}
            onProjectSelect={handleProjectSelect}
          />

          <ChatWindow
            messages={messages}
            frequentQueries={frequentQueries}
            onSendMessage={handleSendMessage}
            onAddToNotes={handleAddToNotes}
            onClearChat={handleNewChat}
          />

          <AgentMarketplace
            categories={agentCategories}
            selectedAgentIds={selectedAgentIds}
            executionStates={executionStates}
            onCheckAgent={handleCheckAgent}
            onRunSelected={handleRunSelected}
            onClearSelected={handleClearSelected}
            onRunComplete={handleRunComplete}
          />
        </div>
      </div>
    </AppLayout>
  );
}

export default ChatAgents;
