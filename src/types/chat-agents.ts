export interface RawProjectChatSession {
  chat_id: string;
  title: string;
  is_active: boolean;
  last_message_at: string;
}

export interface RawChatProject {
  project_id: string;
  name: string;
  chat_sessions: RawProjectChatSession[];
}

export interface RawRecentChat {
  chat_id: string;
  title: string;
  project_id: string | null;
  last_message_at: string;
  relative_time: string;
}

export interface RawNavigationResponse {
  projects: RawChatProject[];
  recents: RawRecentChat[];
}

export interface ProjectChat {
  id: string;
  title: string;
  projectId: string;
}

export interface ChatProject {
  id: string;
  name: string;
  chats: ProjectChat[];
}

export interface RecentChat {
  id: string;
  title: string;
}

export interface AgentChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  userInitials?: string;
  timestamp: string;
  addedToNotes?: boolean;
  streaming?: boolean;
  activityText?: string;
  followUpQueries?: string[];
  isError?: boolean;
}

export type AgentExecutionState = 'idle' | 'running' | 'done';

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface AgentCategory {
  id: string;
  name: string;
  icon: string;
  agents: Agent[];
}

export type ChatMode = 'concise' | 'detailed';

export interface FrequentQuery {
  id: string;
  question: string;
}
