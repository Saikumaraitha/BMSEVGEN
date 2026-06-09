import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
  RawNavigationResponse,
} from '../../types/chat-agents';
import type { Asset } from '../../types/home';
import { getAssetDetails } from '../../services/home';
import {
  getChatProjectsAndRecents,
  getAgentCategories,
  getFrequentQueries,
  createProject,
  runAgent as runAgentService,
  addMessageToNotes as addMessageToNotesService,
} from '../../services/chat-agents';
import { realChatApiAdapter } from '../../services/chatbot/realAdaptor';
import type { ChatMessageHistoryItem } from '../../services/chatbot/contracts';
import { ROUTES } from '../../constants/routes';

const USER_INITIALS = 'AS';

function mapHistoryItem(item: ChatMessageHistoryItem): AgentChatMessage {
  const suggestions = item.follow_up_suggestions;
  let followUpQueries: string[] | undefined;
  if (Array.isArray(suggestions)) {
    followUpQueries = (suggestions as unknown[]).filter((s): s is string => typeof s === 'string');
  } else if (suggestions && typeof suggestions === 'object' && !Array.isArray(suggestions)) {
    const nested = (suggestions as { suggestions?: string[] | null }).suggestions;
    if (Array.isArray(nested)) followUpQueries = nested.filter((s): s is string => typeof s === 'string');
  }
  return {
    id: item.message_id,
    role: item.role === 'user' ? 'user' : 'ai',
    content: item.content,
    userInitials: item.role === 'user' ? USER_INITIALS : undefined,
    timestamp: item.timestamp,
    followUpQueries: followUpQueries?.length ? followUpQueries : undefined,
  };
}

function transformNavigation(raw: RawNavigationResponse): {
  projects: ChatProject[];
  recentChats: RecentChat[];
  initialActiveChatId: string | null;
} {
  let initialActiveChatId: string | null = null;

  const projects = raw.projects.map((p) => ({
    id: p.project_id,
    name: p.name,
    chats: p.chat_sessions.map((s) => {
      if (s.is_active && !initialActiveChatId) initialActiveChatId = s.chat_id;
      return { id: s.chat_id, title: s.title, projectId: p.project_id };
    }),
  }));

  const recentChats = raw.recents.map((r) => ({ id: r.chat_id, title: r.title }));

  return { projects, recentChats, initialActiveChatId };
}

function ChatAgents() {
  const navigate = useNavigate();
  const { assetId = '', indicationId = '' } = useParams<{ assetId: string; indicationId: string }>();
  const { state } = useLocation() as { state: { assetName?: string; indicationName?: string } | null };

  const [asset, setAsset] = useState<Asset>();
  const [projects, setProjects] = useState<ChatProject[]>([]);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [agentCategories, setAgentCategories] = useState<AgentCategory[]>([]);
  const [frequentQueries, setFrequentQueries] = useState<FrequentQuery[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [selectedAgentIds, setSelectedAgentIds] = useState<Set<string>>(new Set());
  const [executionStates, setExecutionStates] = useState<Record<string, AgentExecutionState>>({});

  useEffect(() => {
    getAssetDetails(assetId).then(setAsset);
    getAgentCategories().then(setAgentCategories);
    getFrequentQueries().then(setFrequentQueries);
    getChatProjectsAndRecents(indicationId).then(async (raw) => {
      const { projects, recentChats, initialActiveChatId } = transformNavigation(raw);
      setProjects(projects);
      setRecentChats(recentChats);
      if (initialActiveChatId) {
        setActiveChatId(initialActiveChatId);
        setIsLoadingMessages(true);
        try {
          const response = await realChatApiAdapter.getChatMessages(initialActiveChatId);
          setMessages(response.messages.map(mapHistoryItem));
        } catch (error) {
          console.error('[Chat] Failed to load initial messages:', error);
          setMessages([]);
        } finally {
          setIsLoadingMessages(false);
        }
      }
    });
  }, [assetId]);

  const addMessage = useCallback((msg: AgentChatMessage) => {
    setMessages((prev) => [...prev, msg]);
    setActiveChatId((prev) => prev ?? 'new');
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleAddProject = async (name: string) => {
    const project = await createProject(assetId, name, indicationId);
    setProjects((prev) => [...prev, project]);
    setActiveProjectId(project.id);
  };

  const handleProjectSelect = (projectId: string) => {
    setActiveProjectId(projectId);
  };

  const handleNewChat = async () => {
    setMessages([]);
    setExecutionStates({});
    setSelectedAgentIds(new Set());
    try {
      const chatResponse = await realChatApiAdapter.createChat({
        response_style: 'concise',
        iep_id: indicationId,
        project_id: activeProjectId ?? null,
      });
      setActiveChatId(chatResponse.chat_id);
      refreshNavigation();
    } catch (error) {
      console.error('[Chat] Failed to create new chat session:', error);
      setActiveChatId(null);
    }
  };

  const handleChatSelect = async (chatId: string) => {
    setActiveChatId(chatId);
    setMessages([]);
    setIsLoadingMessages(true);
    const owningProject = projects.find((p) => p.chats.some((c) => c.id === chatId));
    if (owningProject) setActiveProjectId(owningProject.id);
    try {
      const response = await realChatApiAdapter.getChatMessages(chatId);
      setMessages(response.messages.map(mapHistoryItem));
    } catch (error) {
      console.error('[Chat] Failed to load messages:', error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const refreshNavigation = useCallback(() => {
    getChatProjectsAndRecents(indicationId).then((raw) => {
      const { projects, recentChats } = transformNavigation(raw);
      setProjects(projects);
      setRecentChats(recentChats);
    });
  }, [indicationId]);

  const handleSendMessage = async (text: string, mode: ChatMode) => {
    let sessionId = activeChatId;

    // For new chats, create a backend session first and use the returned chat_id
    if (!sessionId) {
      try {
        const chatResponse = await realChatApiAdapter.createChat({
          response_style: mode,
          iep_id: indicationId,
          project_id: activeProjectId ?? null,
        });
        sessionId = chatResponse.chat_id;
        setActiveChatId(sessionId);
        refreshNavigation();
      } catch (error) {
        console.error('[Chat] Failed to create chat session:', error);
        return;
      }
    }

    // Add user message optimistically
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        userInitials: USER_INITIALS,
        timestamp: new Date().toISOString(),
      },
    ]);

    // Add streaming placeholder for AI response
    const streamId = `ai-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: streamId, role: 'ai', content: '', timestamp: new Date().toISOString(), streaming: true },
    ]);

    try {
      await realChatApiAdapter.sendMessageStream(
        { message: text, sessionId: sessionId as string, context: {}, responseStyle: mode },
        {
          onDelta: (delta) => {
            setMessages((prev) =>
              prev.map((m) => m.id === streamId ? { ...m, content: m.content + delta } : m)
            );
          },
          onMessageReset: () => {
            setMessages((prev) =>
              prev.map((m) => m.id === streamId ? { ...m, content: '', activityText: undefined } : m)
            );
          },
          onIntermediateEvent: (event) => {
            let activityText: string | undefined;
            if (event.type === 'thinking' && event.state === 'start') {
              activityText = 'Thinking…';
            } else if (event.type === 'stage' && event.state === 'start') {
              activityText = event.text || event.stageId;
            } else if (event.type === 'status' && event.state === 'start') {
              activityText = event.text;
            } else if (
              event.type === 'thinking' && event.state === 'end' ||
              event.type === 'stage' && event.state === 'end' ||
              event.type === 'status' && event.state === 'end'
            ) {
              activityText = undefined;
            } else {
              return;
            }
            setMessages((prev) =>
              prev.map((m) => m.id === streamId ? { ...m, activityText } : m)
            );
          },
          onDone: (payload) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamId
                  ? {
                      ...m,
                      content: payload.response || m.content,
                      streaming: false,
                      activityText: undefined,
                      followUpQueries: payload.follow_up_queries?.length
                        ? payload.follow_up_queries
                        : undefined,
                    }
                  : m
              )
            );
          },
        }
      );
    } catch (error) {
      console.error('[Chat] Streaming failed:', error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamId
            ? {
                ...m,
                content: 'Something went wrong while generating a response. Please try again.',
                streaming: false,
                activityText: undefined,
                isError: true,
              }
            : m
        )
      );
    }
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
          assetName={asset?.name ?? state?.assetName ?? ''}
          activeTab="Chat & Agents"
          indicationName={asset?.indications?.find(i => i.id === indicationId)?.name ?? state?.indicationName}
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
            isLoadingMessages={isLoadingMessages}
            frequentQueries={frequentQueries}
            onSendMessage={handleSendMessage}
            onAddToNotes={handleAddToNotes}
            onClearChat={handleNewChat}
          />

          <AgentMarketplace
            categories={Array.isArray(agentCategories) ? agentCategories : []}
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
