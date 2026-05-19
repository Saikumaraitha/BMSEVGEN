import { useState } from 'react';
import type { DocumentComment } from '../../../types/research-documents';
import { createCommentsPanelHandlers } from '../../../handlers/research-documents/commentsPanelHandlers';
import CommentThread from './CommentThread';

interface CommentsPanelProps {
  comments: DocumentComment[];
  filterNoteId: string | null;
  filterNoteTitle: string;
  onPost: (content: string, author: string, initials: string, noteId: string, noteTitle: string) => void;
  onReply: (parentId: string, content: string, author: string, initials: string) => void;
  onClearFilter: () => void;
}

function CommentsPanel({ comments, filterNoteId, filterNoteTitle, onPost, onReply, onClearFilter }: CommentsPanelProps) {
  const [postText, setPostText] = useState('');

  const { handlePostChange, handlePost } = createCommentsPanelHandlers({
    setPostText,
    onPost: (content, author, initials) =>
      onPost(content, author, initials, filterNoteId ?? '', filterNoteTitle),
    author: 'You',
    initials: 'YO',
  });

  const handleCancel = () => setPostText('');

  // Group comments by noteId
  const grouped = comments.reduce<Record<string, { noteTitle: string; items: DocumentComment[] }>>(
    (acc, comment) => {
      if (!acc[comment.noteId]) {
        acc[comment.noteId] = { noteTitle: comment.noteTitle, items: [] };
      }
      acc[comment.noteId].items.push(comment);
      return acc;
    },
    {},
  );

  const groups = Object.entries(grouped);
  const visibleGroups = filterNoteId
    ? groups.filter(([noteId]) => noteId === filterNoteId)
    : groups;

  return (
    <div className="flex flex-col h-full bg-tab-bg overflow-hidden">
      {/* Filter banner — stays pinned at top */}
      {filterNoteId && (
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-tint-04 border-b border-rd-card-border flex-shrink-0">
          <span className="text-xs font-sans text-brand-primary-dark flex-1 truncate">
            Showing comments for selected note
          </span>
          <button
            type="button"
            onClick={onClearFilter}
            className="text-xs font-semibold font-sans text-brand-primary hover:text-brand-primary-dark whitespace-nowrap transition-colors"
          >
            Show all
          </button>
        </div>
      )}

      {/* Single scrollable area — groups + leave-a-comment flow together */}
      <div className="flex-1 overflow-y-auto">
        {/* Note comment groups */}
        <div className="px-4 pt-4 flex flex-col gap-3">
          {visibleGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
              <i className="bi bi-chat-text text-3xl text-neutral-300" aria-hidden="true" />
              <p className="text-sm text-neutral-400">No comments yet</p>
            </div>
          ) : (
            visibleGroups.map(([noteId, { noteTitle, items }]) => (
              <div
                key={noteId}
                className="border border-rd-card-border rounded-[10px] bg-[rgba(247,246,243,0.5)] overflow-hidden"
              >
                {/* Note title header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-rd-card-border bg-white">
                  <i className="bi bi-file-earmark-text text-sm text-rd-section-label flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs font-medium font-sans text-rd-owner-name truncate flex-1">
                    Re: {noteTitle}
                  </span>
                </div>

                {/* All comments rendered at natural height */}
                <div className="px-4">
                  {items.map((comment) => (
                    <CommentThread key={comment.id} comment={comment} onReply={onReply} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Leave a comment */}
        <div className="px-4 py-4 mt-2 border-t border-neutral-100">
          <textarea
            value={postText}
            onChange={handlePostChange}
            placeholder="Leave a comment"
            rows={3}
            className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
          />
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-1.5 rounded-lg text-sm font-medium border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handlePost(postText)}
              disabled={!postText.trim()}
              className="px-4 py-1.5 rounded-lg text-sm font-medium bg-brand-primary text-white hover:bg-brand-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentsPanel;
