export type AccessType = 'My Doc' | 'Can Edit' | 'View Only';

export interface RawDocUser {
  user_id: string
  name: string
  role?: string
}

export interface RawResearchDocument {
  doc_id: string
  name: string
  description: string
  access_type: string
  created_by: RawDocUser
  owner: RawDocUser
  last_edited_by: { user_id: string; name: string }
  last_edited: string
  is_active: boolean
  created_at: string | null
  iep_id: string
}

export interface RawResearchDocumentsResponse {
  success: boolean
  message: string
  total: number
  data: RawResearchDocument[]
}

export type ShareRole = 'Owner' | 'Editor' | 'Viewer';

export interface ShareMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  role: ShareRole;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  jobRole: string;
}

export interface DocumentOwner {
  name: string;
  initials: string;
  role: string;
  avatarColor: string;
}

export interface ResearchDocument {
  id: string;
  title: string;
  accessType: AccessType;
  owner: DocumentOwner;
  lastEdited: string;
  lastEditedBy: string;
  description: string;
  noteCount: number;
  commentCount: number;
  isNew?: boolean;
}

export interface ResearchNote {
  id: string;
  number: number;
  title: string;
  content: string;
  date: string;
  author: string;
  source: 'EvGenAI' | 'manual';
  originalQuery?: string;
  commentCount?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  userInitials?: string;
  timestamp: string;
}

export interface DocumentComment {
  id: string;
  noteId: string;
  noteTitle: string;
  author: string;
  authorInitials: string;
  authorColor: string;
  authorTextColor: string;
  date: string;
  time: string;
  content: string;
  replies?: DocumentComment[];
}

export interface ResearchDocumentData {
  document: ResearchDocument;
  notes: ResearchNote[];
  chatMessages: ChatMessage[];
  comments: DocumentComment[];
  commentHeader: string;
}
