export type ResponseStyle = 'concise' | 'detailed';
 
export interface ReferenceOption {
  id: string;
  name: string;
}
 
export interface ContextReferenceResponse {
  countries: ReferenceOption[];
  therapeutic_areas: ReferenceOption[];
  products: ReferenceOption[];
  indications: ReferenceOption[];
  data_sources: ReferenceOption[];
}
 
export interface ContextReferencesRequest {
  country_name?: string;
  therapeutic_area_name?: string;
  product_name?: string;
}
 
export interface FrequentQueriesRequest {
  market?: string;
  therapeutic_area?: string;
  product?: string;
  indication?: string;
  limit?: number;
}
 
export interface FrequentQueryItem {
  id: string;
  text: string;
}
 
export interface FrequentQueriesResponse {
  queries: FrequentQueryItem[];
  total_count: number;
  has_more: boolean;
}
 
export interface NavigationProjectChat {
  chat_id: string;
  title: string;
  is_active: boolean;
  last_message_at: string;
}
 
export interface NavigationProject {
  project_id: string;
  name: string;
  is_expanded?: boolean;
  chat_sessions: NavigationProjectChat[];
}
 
export interface NavigationRecentChat {
  chat_id: string;
  title: string;
  project_id: string | null;
  last_message_at: string;
  relative_time?: string;
}
 
export interface NavigationResponse {
  projects: NavigationProject[];
  recents: NavigationRecentChat[];
}
 
export interface CreateChatRequest {
  project_name?: string;
  project_id?: string | null;
  response_style?: ResponseStyle;
  iep_id?: string;
  metadata?: {
    source?: string;
    [key: string]: unknown;
  };
}

export interface CreateChatResponse {
  chat_id: string;
  session_id: string;
  project_name?: string;
  agent_name?: string;
  thread_id?: string;
  title?: string;
  project_id: string | null;
  response_style: ResponseStyle;
  created_at: string;
}
 
export interface ChatMessageHistoryItem {
  message_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: {
    market?: string;
    therapeutic_area?: string;
    product?: string;
    indication?: string;
    data_sources?: string[] | string;
  };
  response_style?: ResponseStyle;
  elapsed_time_seconds?: number;
  feedback?: 'helpful' | 'improve';
  follow_up_suggestions?:
    | { suggestions?: string[] | null }
    | string[]
    | null;
}
 
export interface ChatMessagesResponse {
  chat_id: string;
  title: string;
  project_id: string | null;
  messages: ChatMessageHistoryItem[];
  pagination?: {
    current_page: number;
    page_size: number;
    total_messages: number;
  };
}
 
export interface SendMessageRequest {
  message: string;
  sessionId: string;
  context: {
    market?: string;
    therapeuticArea?: string;
    product?: string;
    indication?: string;
    source?: string[];
  };
  responseStyle: ResponseStyle;
}
 
export interface SendMessageResponse {
  response: string;
  sources?: string[];
  follow_up_queries?: string[];
  message_id?: string;
}
 
export interface StreamToolCall {
  id: string;
  name: string;
  args?: Record<string, unknown>;
}
 
export interface StreamDonePayload {
  response: string;
  tool_calls?: StreamToolCall[];
  structured_response?: unknown;
  status?: string;
  interrupt?: unknown;
  follow_up_queries?: string[];
  message_id?: string;
  metadata?: {
    model?: string;
    tokens?: number;
    cost?: number;
  };
}
 
/**
 * Discriminated union of intermediate stream events surfaced by the WebSocket
 * adapter. Mirrors the backend event contract:
 *
 *   status            – activity (tool/subagent) start or end
 *   stage             – grouping header start or end
 *   tool_call_start   – raw tool fires (always emitted; fallback step)
 *   tool_call_end     – raw tool completes
 *   thinking          – model is generating but no tokens yet
 *   subagent_start    – subagent delegation begins
 *   subagent_end      – subagent delegation ends
 *   interrupt         – HITL pause
 *   error             – terminal stream error
 *   keepalive         – idle heartbeat (UI ignores)
 *
 * `message_delta` is delivered via `onDelta`, and `done` via `onDone`.
 */
export type StreamIntermediateEvent =
  | {
      type: 'status';
      activityId: string;
      state: 'start' | 'end';
      text?: string;
      toolName?: string;
      kind?: 'tool' | 'subagent';
    }
  | {
      type: 'stage';
      stageId: string;
      state: 'start' | 'end';
      text?: string;
    }
  | {
      type: 'tool_call_start';
      toolCallId: string;
      toolName: string;
      args?: Record<string, unknown>;
    }
  | {
      type: 'tool_call_end';
      toolCallId: string;
      toolName?: string;
      output?: string;
    }
  | { type: 'thinking'; state: 'start' | 'end' }
  | { type: 'subagent_start'; subagentName: string }
  | { type: 'subagent_end'; subagentName: string }
  | { type: 'interrupt' }
  | { type: 'error'; message: string }
  | { type: 'keepalive' };
 
export interface SendMessageStreamHandlers {
  onDelta: (delta: string, index?: number) => void;
  onDone?: (payload: StreamDonePayload) => void;
  onMessageReset?: () => void;
  onToolCallStart?: (payload: { tool_call_id: string; tool_name: string; args?: Record<string, unknown> }) => void;
  onToolCallEnd?: (payload: { tool_call_id: string; tool_name: string; output?: string }) => void;
  onIntermediateEvent?: (event: StreamIntermediateEvent) => void;
}
 
export interface CreateProjectRequest {
  name: string;
  iep_id?: string;
}
 
export interface CreateProjectResponse {
  projectId: string;
  name: string;
}
 
export interface AddChatToProjectRequest {
  projectId: string;
  chatId: string;
}
 
export interface AddChatToProjectResponse {
  projectId: string;
  chatId: string;
  added: boolean;
}
 
export interface DeleteChatRequest {
  chatId: string;
}
 
export interface DeleteChatResponse {
  chatId: string;
  deleted: boolean;
}
 
export interface RenameChatRequest {
  chatId: string;
  title: string;
}
 
export interface RenameChatResponse {
  message?: string;
  chat_id?: string;
  title?: string;
}
 
export interface RenameProjectRequest {
  projectId: string;
  name: string;
}
 
export interface RenameProjectResponse {
  message?: string;
  project_id?: string;
  name?: string;
}
 
export interface SubmitFeedbackRequest {
  chatId: string;
  messageId: string;
  rating: 'helpful' | 'improve' | 'none';
  improve_reasons?: string[];
  comments?: string;
}
 
export interface SubmitFeedbackResponse {
  message: string;
  message_id: string;
  rating: 'helpful' | 'improve' | 'none';
  improve_reasons?: string[];
}
 
export interface SaveChatRequest {
  chatId: string;
  action: 'save_to_existing' | 'create_new_project' | 'keep_in_recents';
  project_id?: string;
  new_project_name?: string;
}
 
export interface SaveChatResponse {
  message: string;
  chat_id: string;
  action: SaveChatRequest['action'];
  project_id?: string;
  project_name?: string;
}
 
export interface UnlinkChatFromProjectRequest {
  projectId: string;
  chatId: string;
}
 
export interface UnlinkChatFromProjectResponse {
  message: string;
  project_id: string;
  chat_id: string;
}
 
export interface DeleteProjectRequest {
  projectId: string;
  retain_chats?: boolean;
}
 
export interface DeleteProjectResponse {
  message: string;
  project_id: string;
  chats_retained?: string[];
}
 
export interface RecentChatsResponse {
  recentSessionIds: string[];
}
 
export interface ChatApiAdapter {
  sendMessage(request: SendMessageRequest): Promise<SendMessageResponse>;
  sendMessageStream(request: SendMessageRequest, handlers: SendMessageStreamHandlers): Promise<SendMessageResponse>;
  getContextReferences(request?: ContextReferencesRequest): Promise<ContextReferenceResponse>;
  getTherapeuticAreaOptions(country_name?: string): Promise<string[]>;
  getProductOptions(country_name?: string, therapeutic_area_name?: string): Promise<string[]>;
  getIndicationOptions(country_name?: string, therapeutic_area_name?: string, product_name?: string): Promise<string[]>;
  getDataSources(): Promise<string[]>;
  getLastRunAt(): Promise<string | null>;
  getFrequentQueries(request?: FrequentQueriesRequest): Promise<FrequentQueriesResponse>;
  getNavigationData(): Promise<NavigationResponse>;
  createChat(request: CreateChatRequest): Promise<CreateChatResponse>;
  getChatMessages(chatId: string, page?: number, pageSize?: number): Promise<ChatMessagesResponse>;
  submitFeedback(request: SubmitFeedbackRequest): Promise<SubmitFeedbackResponse>;
  saveChat(request: SaveChatRequest): Promise<SaveChatResponse>;
  createProject(request: CreateProjectRequest): Promise<CreateProjectResponse>;
  addChatToProject(request: AddChatToProjectRequest): Promise<AddChatToProjectResponse>;
  unlinkChatFromProject(request: UnlinkChatFromProjectRequest): Promise<UnlinkChatFromProjectResponse>;
  deleteProject(request: DeleteProjectRequest): Promise<DeleteProjectResponse>;
  deleteChat(request: DeleteChatRequest): Promise<DeleteChatResponse>;
  renameChat(request: RenameChatRequest): Promise<RenameChatResponse>;
  renameProject(request: RenameProjectRequest): Promise<RenameProjectResponse>;
  getRecentChats(): Promise<RecentChatsResponse>;
}
 
 