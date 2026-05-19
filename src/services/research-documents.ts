import type { ResearchDocument, ResearchDocumentData, ShareMember, TeamMember } from '../types/research-documents';
import { todayDocDate } from '../utils/dateUtils';
import api from '../lib/axios';

function emptyDocumentData(): ResearchDocumentData {
  return {
    document: {
      id: 'new',
      title: 'New Research Document',
      accessType: 'My Doc',
      owner: { name: 'Ava Sharma', initials: 'AS', role: 'Portfolio Strategy Lead', avatarColor: '#7c3aed' },
      lastEdited: todayDocDate(),
      lastEditedBy: 'Ava Sharma',
      description: '',
      noteCount: 0,
      commentCount: 0,
      isNew: true,
    },
    notes: [],
    chatMessages: [],
    comments: [],
    commentHeader: 'Document Comments (0)',
  };
}

export async function getResearchDocuments(assetId: string): Promise<ResearchDocument[]> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockDocuments } = await import('../mocks/research-documents');
    return mockDocuments;
  }
  const { data } = await api.get<ResearchDocument[]>(`/research-documents?assetId=${assetId}`);
  return data;
}

export async function getDocumentData(
  assetId: string,
  docId: string,
): Promise<ResearchDocumentData> {
  if (docId === 'new') return emptyDocumentData();

  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockDocumentData } = await import('../mocks/research-documents');
    return mockDocumentData[docId] ?? emptyDocumentData();
  }
  const { data } = await api.get<ResearchDocumentData>(
    `/research-documents/${docId}?assetId=${assetId}`,
  );
  return data;
}

export async function getDocShareMembers(docId: string): Promise<ShareMember[]> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockDocShareMembers } = await import('../mocks/research-documents');
    return mockDocShareMembers[docId] ?? [];
  }
  const { data } = await api.get<ShareMember[]>(`/research-documents/${docId}/share`);
  return data;
}

export async function createResearchDocument(
  assetId: string,
  name: string,
  description: string,
): Promise<{ id: string }> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    return { id: 'new' };
  }
  const { data } = await api.post<{ id: string }>('/research-documents', { assetId, name, description });
  return data;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockTeamMembers } = await import('../mocks/research-documents');
    return mockTeamMembers;
  }
  const { data } = await api.get<TeamMember[]>('/team-members');
  return data;
}
