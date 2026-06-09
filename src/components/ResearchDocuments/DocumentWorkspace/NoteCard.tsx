import { useState } from "react";
import { formatDocDate } from "../../../utils/dateUtils";
import type { ResearchNote } from "../../../types/research-documents";
import CommentsIcon from "../../../assets/icons/comments.svg?react";
import CommentIcon from "../../../assets/icons/comment.svg?react";
import ClockIcon from "../../../assets/icons/clock.svg?react";
import TrashIcon from "../../../assets/icons/trash.svg?react";

interface NoteCardProps {
  note: ResearchNote;
  isEditing: boolean;
  onEdit: (id: string, title: string, content: string) => void;
  onEditChange?: (id: string, title: string, content: string) => void;
  onDuplicate: (note: ResearchNote) => void;
  onDelete: (id: string) => void;
  onCommentsClick: (noteId: string, noteTitle: string) => void;
}

const NOTE_TAG_COLORS = [
  {
    badge: "bg-violet-100 text-violet-600 border-violet-200",
    source: "text-violet-600",
  },
  { badge: "bg-sky-100 text-sky-600 border-sky-200", source: "text-sky-600" },
  {
    badge: "bg-emerald-100 text-emerald-600 border-emerald-200",
    source: "text-emerald-600",
  },
  {
    badge: "bg-amber-100 text-amber-600 border-amber-200",
    source: "text-amber-600",
  },
  {
    badge: "bg-rose-100 text-rose-600 border-rose-200",
    source: "text-rose-600",
  },
];

function NoteCard({
  note,
  isEditing,
  onEdit,
  onEditChange,
  onDuplicate: _onDuplicate,
  onDelete,
  onCommentsClick,
}: NoteCardProps) {
  const [editing, setEditing] = useState(false);
  const tagColor = NOTE_TAG_COLORS[(note.number - 1) % NOTE_TAG_COLORS.length];
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleEditSubmit = () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    onEdit(note.id, editTitle.trim(), editContent.trim());
    setEditing(false);
  };

  const handleEditCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditing(false);
  };

  const commentCount = note.commentCount ?? 0;

  const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // Only save when focus leaves the entire card (not moving between title and content)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      handleEditSubmit();
    }
  };

  if (editing) {
    return (
      <div
        className="pt-3 pb-4 bg-white rounded-md shadow-sm mb-4 border border-rd-card-border"
        onBlur={handleContainerBlur}
        onKeyDown={(e) => {
          if (e.key === "Escape") handleEditCancel();
        }}
      >
        {/* Top row — same structure as read mode */}
        <div className="flex items-center px-4 mb-3">
          <span
            className={`h-[18px] flex items-center px-2.5 rounded-full text-2xs font-medium font-sans border uppercase tracking-wider shrink-0 ${tagColor.badge}`}
          >
            Note {note.number}
          </span>
          <div className="flex-1" />
          <span className="text-2xs font-sans text-rd-section-label mr-1">
            {formatDocDate(note.date)}
          </span>
          <button
            type="button"
            className="p-1 rounded hover:bg-neutral-100 text-rd-section-label transition-colors"
            aria-label="Note history"
          >
            <ClockIcon className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-1 rounded hover:bg-red-50 text-rd-trash transition-colors"
            aria-label="Delete note"
          >
            <TrashIcon className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Inline editable fields — styled to match read-mode text */}
        <div className="px-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => {
              setEditTitle(e.target.value);
              onEditChange?.(note.id, e.target.value, editContent);
            }}
            autoFocus
            placeholder="Note title"
            className="w-full bg-transparent border-none outline-none p-0 mb-2 text-sm font-semibold font-sans text-rd-note-title placeholder:text-neutral-300"
          />
          <textarea
            value={editContent}
            onChange={(e) => {
              setEditContent(e.target.value);
              onEditChange?.(note.id, editTitle, e.target.value);
            }}
            rows={5}
            placeholder="Note content"
            className="w-full bg-transparent border-none outline-none p-0 resize-none text-xs font-normal font-sans text-rd-note-body leading-relaxed placeholder:text-neutral-300"
          />

          <div className="border-t border-rd-divider mt-3" />

          {/* Footer — same as read mode */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-3xs font-normal font-sans text-rd-section-label flex items-center gap-1">
              <span>{note.author}</span>
              <span>·</span>
              <span className={tagColor.source}>
                {note.source === "EvGenAI" ? "via EvGenAi" : "via manual entry"}
              </span>
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCommentsClick(note.id, note.title);
              }}
              className={`flex items-center gap-1 ${commentCount === 0 ? "text-black" : "text-[--color-rd-comment-text]"} text-center font-inter text-[11px] font-semibold leading-normal bg-transparent px-2.5 py-1 rounded-full transition-colors`}
            >
              {commentCount === 0 ? (
                <CommentsIcon className={`w-3 h-3`} aria-hidden="true" />
              ) : (
                <CommentIcon className={`w-3 h-3`} aria-hidden="true" />
              )}
              {commentCount === 0
                ? "0 comments"
                : `${commentCount} ${commentCount === 1 ? "comment" : "comments"}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isEditing
          ? "pt-3 pb-4 bg-white rounded-lg shadow-sm mb-4 border border-rd-card-border"
          : "pt-3 pb-4"
      }
    >
      {/* Top row: badge + date + clock + trash */}
      <div className="flex items-center px-4 mb-3">
        <span className="h-[18px] flex items-center px-2.5 rounded-full text-2xs font-medium font-sans bg-rd-note-tag-bg text-rd-note-tag-text border border-rd-note-tag-text/20 uppercase tracking-wider shrink-0">
          Note {note.number}
        </span>
        <div className="flex-1" />
        <span className="text-2xs font-sans text-rd-section-label mr-1">
          {formatDocDate(note.date)}
        </span>
        {isEditing && (
          <>
            <button
              type="button"
              className={`p-1 rounded hover:bg-neutral-100 text-rd-section-label transition-colors ${isEditing ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              aria-label="Note history"
            >
              <i className="bi bi-clock text-sm" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className={`p-1 rounded hover:bg-red-50 text-rd-trash transition-colors ${isEditing ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              aria-label="Delete note"
            >
              <i className="bi bi-trash3 text-sm" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* Content — clickable to enter inline edit */}
      <div
        className={isEditing ? "px-4 cursor-pointer" : "px-4 cursor-default"}
        onClick={() => {
          if (isEditing) setEditing(true);
        }}
        role="button"
        tabIndex={isEditing ? 0 : -1}
        onKeyDown={(e) => {
          if (isEditing && e.key === "Enter") setEditing(true);
        }}
        aria-label={isEditing ? "Edit note" : "Note"}
      >
        <h3 className="text-sm font-semibold font-sans text-rd-note-title mb-2">
          {note.title}
        </h3>
        <p className="text-xs font-normal font-sans text-rd-note-body leading-relaxed">
          {note.content}
        </p>

        <div className="border-t border-rd-divider mt-3" />

        {/* Footer: author + comment count */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-3xs font-normal font-sans text-rd-section-label flex items-center gap-1">
            <span>{note.author}</span>
            <span>·</span>
            <span className="text-rd-tag-my-doc-text">
              {note.source === "EvGenAI" ? "via EvGenAi" : "via manual entry"}
            </span>
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCommentsClick(note.id, note.title);
            }}
            className={`flex items-center gap-1 text-3xs font-normal font-sans ${commentCount === 0 ? "text-black" : "text-[--color-rd-comment-text]"} bg-transparent px-2.5 py-1 rounded-full transition-colors`}
          >
            {commentCount !== 0 ? (
              <CommentsIcon className={`w-3 h-3`} aria-hidden="true" />
            ) : (
              <CommentIcon className={`w-3 h-3`} aria-hidden="true" />
            )}
            {commentCount === 0
              ? "0 comments"
              : `${commentCount} ${commentCount === 1 ? "comment" : "comments"}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
