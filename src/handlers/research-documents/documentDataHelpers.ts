import type { AccessType, RawNote, RawNotesResponse, RawSingleDocument, ResearchDocumentData, ResearchNote } from '../../types/research-documents';

const ACCESS_TYPE_MAP: Record<string, AccessType> = {
  OWNER:  'My Doc',
  EDITOR: 'Can Edit',
  VIEWER: 'View Only',
};

function deriveInitials(name: string): string {
  return name.split(' ').map((p) => p[0] ?? '').join('').toUpperCase().slice(0, 2);
}

export function buildWorkspaceData(rawDoc: RawSingleDocument, rawNotesRes: RawNotesResponse): ResearchDocumentData {
  const notes: ResearchNote[] = (rawNotesRes.data ?? []).map((n: RawNote, i) => ({
    id:            n.note_id,
    number:        i + 1,
    title:         n.title,
    content:       n.content,
    date:          n.created_at,
    author:        n.author_name,
    source:        n.origin === 'MANUAL' ? 'manual' : 'EvGenAI',
    originalQuery: n.source_query ?? undefined,
    commentCount:  n.comments_count,
  }));

  return {
    document: {
      id:           rawDoc.doc_id,
      title:        rawDoc.name,
      description:  rawDoc.description,
      accessType:   ACCESS_TYPE_MAP[rawDoc.access_type] ?? 'View Only',
      owner: {
        name:        rawDoc.owner.name,
        initials:    deriveInitials(rawDoc.owner.name),
        role:        rawDoc.owner.role ?? '',
        avatarColor: '#7c3aed',
      },
      lastEdited:   rawDoc.last_edited || rawDoc.created_at || '',
      lastEditedBy: rawDoc.last_edited_by.name,
      noteCount:    rawNotesRes.total,
      commentCount: 0,
      shared_with:  rawDoc.shared_with ?? [],
    },
    notes,
    chatMessages: [],
    comments:     [],
    commentHeader: 'Document Comments (0)',
  };
}
