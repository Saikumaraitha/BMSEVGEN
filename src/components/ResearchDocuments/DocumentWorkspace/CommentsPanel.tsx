import { useState } from 'react';
import type { DocumentComment } from '../../../types/research-documents';
import { createCommentsPanelHandlers } from '../../../handlers/research-documents/commentsPanelHandlers';
import CommentThread from './CommentThread';

interface CommentsPanelProps {
  comments: DocumentComment[];
  commentHeader: string;
  onPost: (content: string, author: string, initials: string, color: string) => void;
  onReply: (parentId: string, content: string, author: string, initials: string, color: string) => void;
}

function CommentsPanel({ comments, commentHeader, onPost, onReply }: CommentsPanelProps) {
  const [postText, setPostText] = useState('');

  const { handlePostChange, handlePost } = createCommentsPanelHandlers({
    setPostText,
    onPost,
    author: 'You',
    initials: 'YO',
    color: '#6366f1',
  });

  const handleCancel = () => setPostText('');

  return (
    <div className="flex flex-col h-full bg-tab-bg">
      {/* Single card: title + comments */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
        <div className="border border-rd-card-border rounded-[10px] bg-[rgba(247,246,243,0.5)] overflow-hidden">
          {/* Title row */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-rd-card-border bg-white">
            <i className="bi bi-file-earmark-text text-sm text-rd-section-label flex-shrink-0" aria-hidden="true" />
            <span className="text-xs font-medium text-rd-owner-name truncate flex-1">{commentHeader}</span>
          </div>

          {/* Comments */}
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
              <i className="bi bi-chat-text text-3xl text-neutral-300" aria-hidden="true" />
              <p className="text-sm text-neutral-400">No comments yet</p>
            </div>
          ) : (
            <div className="px-4">
              {comments.map((comment) => (
                <CommentThread key={comment.id} comment={comment} onReply={onReply} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leave a comment */}
      <div className="px-4 py-3 border-t border-neutral-100">
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
  );
}

export default CommentsPanel;
