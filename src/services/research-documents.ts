import type {
  ApiUser,
  CreateAddNotePayload,
  CreateAddNoteResponse,
  CreateCommentPayload,
  CreateCommentResponse,
  UpdateNotePayload,
  UpdateNoteResponse,
  DeleteNoteResponse,
  RawNotesResponse,
  RawResearchDocument,
  RawResearchDocumentsResponse,
  RawSingleDocument,
  RawComment,
  RawCommentsResponse,
} from "../types/research-documents";
import { awsSigV4Api } from "./http";

interface SingleDocApiResponse {
  success: boolean;
  data: RawSingleDocument;
}

interface CreateDocApiResponse {
  success: boolean;
  message: string;
  data: {
    doc_id: string;
    name: string;
    description: string;
    access_type: string;
    created_by: { user_id: string; name: string; role?: string };
    last_edited: string;
    is_active: boolean;
    created_at: string;
  };
}

export async function getMockResearchDocuments(): Promise<
  RawResearchDocument[]
> {
  const { mockRawDocuments } = await import("../mocks/research-documents");
  return mockRawDocuments;
}

export async function getResearchDocuments(
  _assetId: string,
  indicationId: string,
): Promise<RawResearchDocument[]> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const response = await awsSigV4Api.get<RawResearchDocumentsResponse>(
    `${base}/api/v1/research-docs`,
    { query: { iep_id: indicationId } },
  );
  return response.data;
}

export async function getDocumentData(
  _assetId: string,
  docId: string,
): Promise<RawSingleDocument> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const response = await awsSigV4Api.get<SingleDocApiResponse>(
    `${base}/api/v1/research-docs/${docId}`,
  );
  return response.data;
}

export async function getDocumentNotes(
  docId: string,
): Promise<RawNotesResponse> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const response = await awsSigV4Api.get<RawNotesResponse>(
    `${base}/api/v1/research-docs/${docId}/notes`,
  );
  return response;
}

interface UpdateDocApiResponse {
  success: boolean;
  message: string;
  data: { doc_id: string; name: string; last_edited: string };
}

export async function updateResearchDocument(
  docId: string,
  name: string,
  description: string,
): Promise<UpdateDocApiResponse["data"]> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const response = await awsSigV4Api.put<UpdateDocApiResponse>(
    `${base}/api/v1/research-docs/${docId}`,
    { name, description },
  );
  return response.data;
}

export async function getDocUsers(iepId: string): Promise<ApiUser[]> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? "").replace(/\/$/, "");
  const response = await awsSigV4Api.get<{ data: ApiUser[] }>(
    `${base}/api/v1/research-docs/users`,
    { query: { iep_id: iepId } },
  );
  return response.data;
}

export async function shareDocument(
  docId: string,
  users: { user_id: string; access_type: string }[],
): Promise<void> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? "").replace(/\/$/, "");
  await awsSigV4Api.post(
    `${base}/api/v1/research-docs/${docId}/share`,
    { users },
  );
}

export async function createResearchDocument(
  iepId: string,
  name: string,
  description: string,
): Promise<CreateDocApiResponse["data"]> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const response = await awsSigV4Api.post<CreateDocApiResponse>(
    `${base}/api/v1/research-docs`,
    { name, description, iep_id: iepId },
  );
  return response.data;
}

export async function deleteResearchDocument(docId: string): Promise<void> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  await awsSigV4Api.delete(`${base}/api/v1/research-docs/${docId}`);
}


export async function createAddNote(
  docId: string,
  payload: CreateAddNotePayload,
): Promise<CreateAddNoteResponse> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const response = await awsSigV4Api.post<CreateAddNoteResponse>(
    `${base}/api/v1/research-docs/${docId}/notes`,
    payload,
  );
  return response;
}

export async function deleteNote(
  docId: string,
  noteId: string,
): Promise<DeleteNoteResponse> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const response = await awsSigV4Api.delete<DeleteNoteResponse>(
    `${base}/api/v1/research-docs/${docId}/notes/${noteId}`,
  );
  return response;
}

export async function UpdateNote(
  docId: string,
  noteId: string,
  payload: UpdateNotePayload,
): Promise<UpdateNoteResponse> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const response = await awsSigV4Api.put<UpdateNoteResponse>(
    `${base}/api/v1/research-docs/${docId}/notes/${noteId}`,
    payload,
  );
  return response;
}

export async function createComment(
  payload: CreateCommentPayload,
): Promise<CreateCommentResponse> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const response = await awsSigV4Api.post<CreateCommentResponse>(
    `${base}/api/v1/research-docs/comment`,
    payload,
  );
  return response;
}

export async function getDocumentComments(
  docId: string,
): Promise<RawComment[]> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const response = await awsSigV4Api.get<RawCommentsResponse>(
    `${base}/api/v1/research-docs/${docId}/comments`,
  );
  return response.data;
}

export async function getNoteComments(
  docId: string,
  noteId: string,
): Promise<RawComment[]> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const response = await awsSigV4Api.get<RawCommentsResponse>(
    `${base}/api/v1/research-docs/${docId}/notes/${noteId}/comments`,
  );
  return response.data;
}
