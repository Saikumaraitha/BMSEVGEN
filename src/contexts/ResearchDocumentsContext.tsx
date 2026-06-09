import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface DocCounts {
  all: number;
  "created-by-me": number;
  "can-edit": number;
  "view-only": number;
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
  onSaveAndExit: (() => Promise<void>) | null;
  setOnSaveAndExit: (fn: (() => Promise<void>) | null) => void;
  canEdit: boolean;
  setCanEdit: (v: boolean) => void;
  canDelete: boolean;
  setCanDelete: (v: boolean) => void;
}

const ResearchDocumentsContext = createContext<ResearchDocumentsCtxValue>({
  docCounts: { all: 0, "created-by-me": 0, "can-edit": 0, "view-only": 0 },
  setDocCounts: () => {},
  noteCount: 0,
  setNoteCount: () => {},
  commentCount: 0,
  setCommentCount: () => {},
  hasUnsavedChanges: false,
  setHasUnsavedChanges: () => {},
  onSaveAndExit: null,
  setOnSaveAndExit: () => {},
  canEdit: false,
  setCanEdit: () => {},
  canDelete: false,
  setCanDelete: () => {},
});

export function ResearchDocumentsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [docCounts, setDocCounts] = useState<DocCounts>({
    all: 0,
    "created-by-me": 0,
    "can-edit": 0,
    "view-only": 0,
  });
  const [noteCount, setNoteCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [onSaveAndExit, setOnSaveAndExitState] = useState<
    (() => Promise<void>) | null
  >(null);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const setOnSaveAndExit = useCallback(
    (fn: (() => Promise<void>) | null) => setOnSaveAndExitState(() => fn),
    [],
  );

  return (
    <ResearchDocumentsContext.Provider
      value={{
        docCounts,
        setDocCounts,
        noteCount,
        setNoteCount,
        commentCount,
        setCommentCount,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        onSaveAndExit,
        setOnSaveAndExit,
        canEdit,
        setCanEdit,
        canDelete,
        setCanDelete,
      }}
    >
      {children}
    </ResearchDocumentsContext.Provider>
  );
}

export function useResearchDocumentsContext() {
  return useContext(ResearchDocumentsContext);
}
