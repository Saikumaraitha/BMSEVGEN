import { createContext, useContext, useState, type ReactNode } from 'react';

export interface DocCounts {
  all: number;
  'created-by-me': number;
  'can-edit': number;
  'view-only': number;
}

interface ResearchDocumentsCtxValue {
  docCounts: DocCounts;
  setDocCounts: (counts: DocCounts) => void;
  noteCount: number;
  setNoteCount: (n: number) => void;
  commentCount: number;
  setCommentCount: (n: number) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (v: boolean) => void;
  onSaveAndExit: (() => void) | null;
  setOnSaveAndExit: (fn: (() => void) | null) => void;
}

const ResearchDocumentsContext = createContext<ResearchDocumentsCtxValue>({
  docCounts: { all: 0, 'created-by-me': 0, 'can-edit': 0, 'view-only': 0 },
  setDocCounts: () => {},
  noteCount: 0,
  setNoteCount: () => {},
  commentCount: 0,
  setCommentCount: () => {},
  hasUnsavedChanges: false,
  setHasUnsavedChanges: () => {},
  onSaveAndExit: null,
  setOnSaveAndExit: () => {},
});

export function ResearchDocumentsProvider({ children }: { children: ReactNode }) {
  const [docCounts, setDocCounts] = useState<DocCounts>({
    all: 0,
    'created-by-me': 0,
    'can-edit': 0,
    'view-only': 0,
  });
  const [noteCount, setNoteCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [onSaveAndExit, setOnSaveAndExitState] = useState<(() => void) | null>(null);

  const setOnSaveAndExit = (fn: (() => void) | null) => setOnSaveAndExitState(() => fn);

  return (
    <ResearchDocumentsContext.Provider
      value={{
        docCounts, setDocCounts,
        noteCount, setNoteCount,
        commentCount, setCommentCount,
        hasUnsavedChanges, setHasUnsavedChanges,
        onSaveAndExit, setOnSaveAndExit,
      }}
    >
      {children}
    </ResearchDocumentsContext.Provider>
  );
}

export function useResearchDocumentsContext() {
  return useContext(ResearchDocumentsContext);
}
