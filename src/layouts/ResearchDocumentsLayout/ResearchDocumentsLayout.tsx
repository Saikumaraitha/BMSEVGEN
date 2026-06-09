import { useState, type ReactNode } from "react";
import UnsavedChangesModal from "../../components/ResearchDocuments/DocumentWorkspace/UnsavedChangesModal";
import NoteIcon from "../../assets/icons/note.svg?react";
import GapIcon from "../../assets/icons/gap.svg?react";
import CommentIcon from "../../assets/icons/comment.svg?react";
import ShareIcon from "../../assets/icons/share.svg?react";
import TrashIcon from "../../assets/icons/trash.svg?react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
  useMatch,
} from "react-router-dom";
import AssetSubNav from "../../components/AssetSubNav/AssetSubNav";
import ResearchWorkspaceSidebar from "../../components/Sidebar/ResearchWorkspaceSidebar";
import { ROUTES } from "../../constants/routes";
import {
  RD_LIST_SIDEBAR_ITEMS,
  type RdFilterKey,
} from "../../config/ResearchDocumentsConfig";
import {
  RD_SECTION_LABELS,
  RD_BACK_TO_DOCS_LABEL,
  RD_WORKSPACE_DOC_LABEL,
  RD_WORKSPACE_ACTIONS_LABEL,
} from "../../constants/researchDocuments";
import { createLayoutHandlers } from "../../handlers/research-documents/layoutHandlers";
import {
  ResearchDocumentsProvider,
  useResearchDocumentsContext,
} from "../../contexts/ResearchDocumentsContext";

interface ResearchDocumentsLayoutProps {
  assetName?: string;
  indicationName?: string;
  lastUpdated?: string;
  onBack?: () => void;
  children: ReactNode;
}

function LayoutContent({
  assetName = "Asset",
  indicationName,
  lastUpdated,
  onBack,
  children,
}: ResearchDocumentsLayoutProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { assetId = "", indicationId = "" } = useParams<{
    assetId: string;
    indicationId: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isWorkspace = !!useMatch(ROUTES.ASSET.RESEARCH_DOCUMENTS.DOC);
  const activeFilter = (searchParams.get("filter") ?? "all") as RdFilterKey;
  const activePanel = searchParams.get("panel") ?? "evgen";

  const {
    docCounts,
    noteCount,
    commentCount,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    onSaveAndExit,
    canEdit,
    canDelete,
  } = useResearchDocumentsContext();
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNav, setPendingNav] = useState<(() => void) | null>(null);

  const guardedNavigate = (nav: () => void) => {
    if (hasUnsavedChanges) {
      setPendingNav(() => nav);
      setShowUnsavedModal(true);
    } else {
      nav();
    }
  };

  const handleExitWithoutSaving = () => {
    setHasUnsavedChanges(false);
    setShowUnsavedModal(false);
    pendingNav?.();
    setPendingNav(null);
  };

  const handleSaveAndExit = async () => {
    setShowUnsavedModal(false);
    await onSaveAndExit?.();
    setPendingNav(null);
  };

  const {
    handleSidebarToggle,
    handleFilterClick,
    handlePanelClick,
    handleBackToList: rawBackToList,
    handleGenerateGaps: rawGenerateGaps,
    handleAddNoteAction,
    handleShareAction,
    handleDeleteAction,
  } = createLayoutHandlers({
    setSidebarCollapsed,
    setSearchParams,
    navigate,
    assetId,
    indicationId,
  });

  const handleBackToList = () => guardedNavigate(rawBackToList);
  const handleGenerateGaps = () => guardedNavigate(rawGenerateGaps);

  const docsSectionItems = RD_LIST_SIDEBAR_ITEMS.filter(
    (i) => i.section === "docs",
  );
  const sharedSectionItems = RD_LIST_SIDEBAR_ITEMS.filter(
    (i) => i.section === "shared",
  );

  const countMap: Record<string, number> = {
    all: docCounts.all,
    "created-by-me": docCounts["created-by-me"],
    "can-edit": docCounts["can-edit"],
    "view-only": docCounts["view-only"],
  };

  return (
    <div className="flex flex-col h-full">
      <AssetSubNav
        assetName={assetName}
        activeTab="Research Workspace"
        indicationName={indicationName}
        lastUpdated={lastUpdated}
        onBack={onBack}
      />

      <div className="flex flex-1 overflow-hidden">
        <ResearchWorkspaceSidebar
          collapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
        >
          {!isWorkspace ? (
            <nav className="flex flex-col py-2">
              <p className="px-4 pt-2 pb-1 text-detail-link font-bold font-heading text-rd-section-label uppercase tracking-widest">
                {RD_SECTION_LABELS.docs}
              </p>
              {docsSectionItems.map((item) => {
                const isActive = activeFilter === item.key;
                const count = countMap[item.key] ?? 0;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleFilterClick(item.key)}
                    className={[
                      "flex items-center gap-2 text-left pl-3 pr-4 py-2.5 h-[35px] transition-colors border-l-[3px] font-[Inter] text-[12px] leading-normal",
                      isActive
                        ? "border-brand-primary bg-[var(--color-primary)] text-[#FFF] font-bold"
                        : "border-transparent text-[#3A3A3A] font-normal hover:bg-neutral-50",
                    ].join(" ")}
                  >
                    <i
                      className={`bi ${item.icon} text-base flex-shrink-0`}
                      aria-hidden="true"
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {count > 0 && (
                      <span
                        className={[
                          "w-5 h-5 inline-flex items-center justify-center rounded-full text-xs font-semibold flex-shrink-0 leading-none",
                          isActive
                            ? "bg-white/30 text-white"
                            : "bg-rd-count-badge text-rd-count",
                        ].join(" ")}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}

              <hr className="my-2 mx-4 border-0 border-t border-rd-divider" />

              <p className="px-4 pt-2 pb-1 text-detail-link font-bold font-heading text-rd-section-label uppercase tracking-widest">
                {RD_SECTION_LABELS.shared}
              </p>
              {sharedSectionItems.map((item) => {
                const isActive = activeFilter === item.key;
                const count = countMap[item.key] ?? 0;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleFilterClick(item.key)}
                    className={[
                      "flex items-center gap-2 text-left pl-3 pr-4 py-2.5 h-[35px] transition-colors border-l-[3px] font-[Inter] text-[12px] leading-normal",
                      isActive
                        ? "border-brand-primary bg-[var(--color-primary)] text-[#FFF] font-bold"
                        : "border-transparent text-[#3A3A3A] font-normal hover:bg-neutral-50",
                    ].join(" ")}
                  >
                    <i
                      className={`bi ${item.icon} text-base flex-shrink-0`}
                      aria-hidden="true"
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {count > 0 && (
                      <span
                        className={[
                          "w-5 h-5 inline-flex items-center justify-center rounded-full text-xs font-semibold flex-shrink-0 leading-none",
                          isActive
                            ? "bg-white/30 text-white"
                            : "bg-rd-count-badge text-rd-count",
                        ].join(" ")}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          ) : (
            <nav className="flex flex-col py-2 flex-1">
              <button
                type="button"
                onClick={handleBackToList}
                className="flex items-center gap-2 px-4 py-2.5 font-inter text-[10px]  uppercase font-bold not-italic text-[#666662] hover:bg-neutral-100 transition-colors"
              >
                <i className="bi bi-chevron-left text-xs" aria-hidden="true" />
                {RD_BACK_TO_DOCS_LABEL}
              </button>

              <div className="mx-4 my-1 border-t border-neutral-200" />

              <p className="px-4 pt-2 pb-1 text-detail-link font-bold font-heading text-rd-section-label uppercase tracking-widest">
                {RD_WORKSPACE_DOC_LABEL}
              </p>
              {[
                {
                  key: "evgen",
                  label: "Notes",
                  Icon: NoteIcon,
                  count: noteCount,
                  panelParam: "",
                },
                {
                  key: "comments",
                  label: "Comments",
                  Icon: CommentIcon,
                  count: commentCount,
                  panelParam: "comments",
                },
              ].map((item) => {
                const isActive =
                  item.key === "comments"
                    ? activePanel === "comments"
                    : activePanel !== "comments";
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      item.panelParam
                        ? handlePanelClick(item.panelParam)
                        : handlePanelClick("evgen")
                    }
                    className={[
                      "flex items-center gap-2 text-left pl-3 pr-4 py-2.5 h-[35px] transition-colors border-l-[3px] font-[Inter] text-[12px] leading-normal",
                      isActive
                        ? "border-brand-primary bg-[var(--color-primary)] text-[#FFF] font-bold"
                        : "border-transparent text-[#3A3A3A] font-normal hover:bg-neutral-50",
                    ].join(" ")}
                  >
                    <item.Icon
                      className="w-4 h-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.count > 0 && (
                      <span
                        className={[
                          "w-5 h-5 inline-flex items-center justify-center rounded-full text-xs font-semibold flex-shrink-0 leading-none",
                          isActive
                            ? "bg-white/30 text-white"
                            : "bg-rd-count-badge text-rd-count",
                        ].join(" ")}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="mx-4 my-3 border-t border-neutral-200" />

              <p className="px-4 pt-2 pb-1 text-detail-link font-bold font-heading text-rd-section-label uppercase tracking-widest">
                {RD_WORKSPACE_ACTIONS_LABEL}
              </p>
              {[
                {
                  label: "Add Note",
                  Icon: NoteIcon,
                  onClick: handleAddNoteAction,
                  requiresNotes: false,
                  show: canEdit,
                  danger: false,
                },
                {
                  label: "Generate Gaps",
                  Icon: GapIcon,
                  onClick: handleGenerateGaps,
                  requiresNotes: true,
                  show: canEdit,
                  danger: false,
                },
                {
                  label: "Share Document",
                  Icon: ShareIcon,
                  onClick: handleShareAction,
                  requiresNotes: true,
                  show: true,
                  danger: false,
                },
                {
                  label: "Delete Document",
                  Icon: TrashIcon,
                  onClick: handleDeleteAction,
                  requiresNotes: false,
                  show: canDelete,
                  danger: true,
                },
              ]
                .filter((item) => item.show)
                .map((item) => {
                  const disabled = item.requiresNotes && noteCount === 0;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={disabled ? undefined : item.onClick}
                      disabled={disabled}
                      className={[
                        "flex items-center gap-2 text-left pl-3 pr-4 py-2.5 h-[35px] transition-colors border-l-[3px] border-transparent font-[Inter] text-[12px] leading-normal",
                        disabled
                          ? "text-neutral-300 cursor-not-allowed"
                          : item.danger
                            ? "text-red-500 hover:bg-red-50"
                            : "text-[#3A3A3A] hover:bg-neutral-50",
                      ].join(" ")}
                    >
                      <item.Icon
                        className="w-4 h-4 flex-shrink-0"
                        aria-hidden="true"
                      />
                      {item.label}
                    </button>
                  );
                })}
            </nav>
          )}
        </ResearchWorkspaceSidebar>

        <main
          key={pathname}
          className="flex-1 overflow-auto bg-rd-body-bg page-fade-in scrollbar-thin-styled"
        >
          {children}
        </main>
      </div>

      <UnsavedChangesModal
        open={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onExitWithoutSaving={handleExitWithoutSaving}
        onSaveAndExit={handleSaveAndExit}
      />
    </div>
  );
}

function ResearchDocumentsLayout(props: ResearchDocumentsLayoutProps) {
  return (
    <ResearchDocumentsProvider>
      <LayoutContent {...props} />
    </ResearchDocumentsProvider>
  );
}

export default ResearchDocumentsLayout;
