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
