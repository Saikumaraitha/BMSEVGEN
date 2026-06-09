export type AccessType = "My Doc" | "Can Edit" | "View Only";

export interface RawDocUser {
  user_id: string;
  name: string;
  role?: string;
}

export interface RawSingleDocument {
  doc_id: string;
  name: string;
  description: string;
  access_type: string;
  owner: { user_id: string; name: string; role?: string };
  last_edited_by: { user_id: string; name: string };
  last_edited: string;
  created_at?: string;
  iep_id: string;
  shared_with?: ApiUser[];
}

export interface RawNote {
  note_id: string;
  title: string;
  content: string;
  origin: "EVGEN_AI" | "EVGEN_AI_EDITED" | "MANUAL";
  author_name: string;
  source_query: string | null;
  message_id: string | null;
  created_at: string;
  comments_count: number;
}

export interface RawNotesResponse {
  success: boolean;
  total: number;
  data: RawNote[];
}

export interface ApiUser {
  user_id: string;
  name: string;
  role?: string;
  access_type: string | null;
}

export interface RawResearchDocument {
  doc_id: string;
  name: string;
  description: string;
  access_type: string;
  created_by: RawDocUser;
  owner: RawDocUser;
  last_edited_by: { user_id: string; name: string };
  last_edited: string;
  is_active: boolean;
  created_at: string | null;
  iep_id: string;
  shared_with?: ApiUser[];
}

export interface RawResearchDocumentsResponse {
  success: boolean;
  message: string;
  total: number;
  data: RawResearchDocument[];
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
  shared_with?: ApiUser[];
}

export interface ResearchNote {
  id: string;
  number: number;
  title: string;
  content: string;
  date: string;
  author: string;
  source: "EvGenAI" | "manual";
  originalQuery?: string;
  commentCount?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
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

export interface CreateAddNotePayload {
  title: string;
  content: string;
  origin: "manual" | "EvGen_AI";
}

export interface CreateAddNoteResponse {
  success: boolean;
  message: string;
  data: {
    note_id: string;
    title: string;
    content: string;
    origin: "manual" | "EvGen_AI";
    author_name: string;
    source_query: string;
    created_at: string;
    comments_count: number;
  };
}

export interface DeleteNoteResponse {
  success: boolean;
  message: string;
  data: {
    noteId: string[];
  };
}

export interface UpdateNotePayload {
  title: string;
  content: string;
}

export interface UpdateNoteResponse {
  success: boolean;
  message: string;
  data: {
    note_id: string;
    note_number: number;
    title: string;
    content: string;
    origin: "EVGEN_AI" | "EVGEN_AI_EDITED" | "MANUAL";
    attribution: {
      author_name: string;
      label: string;
    };
    updated_at: string;
  };
}

export interface CreateCommentPayload {
  document_id: string;
  note_id: string;
  comment: string;
  parent_comment_id?: string | null;
}

export interface CreateCommentResponse {
  success: boolean;
  message: string;
  data: {
    comment_id: string;
    document_id: string;
    note_id: string;
    comment: string;
    parent_comment_id: string | null;
    author_name: string;
    created_at: string;
  };
}
export interface UpdateNotePayload {
  title: string;
  content: string;
}

export interface RawComment {
  comment_id: string;
  note_id?: string;
  note_title?: string;
  parent_comment_id?: string | null;
  content: string;
  author_name: string;
  created_at: string;
  replies?: RawComment | RawComment[];
}

export interface RawCommentsResponse {
  success: boolean;
  message: string;
  total: number;
  data: RawComment[];
}
