import { useState } from 'react';
import type { DocumentComment } from '../../../types/research-documents';
import { createCommentThreadHandlers } from '../../../handlers/research-documents/commentsPanelHandlers';
import { getAvatarChipClasses } from '../../../utils/avatarPalette';

interface CommentThreadProps {
  comment: DocumentComment;
  onReply: (parentId: string, content: string, author: string, initials: string) => void;
}

function CommentThread({ comment, onReply }: CommentThreadProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  const { handleReplyChange, handleReplyToggle, handleReplyPost } = createCommentThreadHandlers({
    setReplyText,
    setShowReply,
    onReply,
    parentId: comment.id,
    author: 'You',
    initials: 'YO',
  });

  const authorChip = getAvatarChipClasses(comment.author);

  return (
    <div className="flex flex-col gap-3 py-3 border-b border-rd-divider last:border-b-0">
      {/* Main comment */}
      <div className="flex gap-2.5">
        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-2xs font-bold ${authorChip.bg} ${authorChip.text}`}>
          {comment.authorInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className="text-xs font-semibold text-rd-owner-name">{comment.author}</span>
            <span className="text-2xs text-rd-section-label">{comment.date}</span>
            <span className="text-2xs text-rd-section-label">·</span>
            <span className="text-2xs text-rd-section-label">{comment.time}</span>
          </div>
          <p className="text-sm font-sans text-rd-description leading-relaxed">{comment.content}</p>
          <button
            type="button"
            onClick={handleReplyToggle}
            className="mt-2 flex items-center gap-1 text-2xs text-rd-section-label hover:text-neutral-600 transition-colors"
          >
            <i className="bi bi-reply text-xs" aria-hidden="true" />
            Reply
          </button>
        </div>
      </div>

      {/* Replies */}
      {(comment.replies ?? []).map((reply) => {
        const replyChip = getAvatarChipClasses(reply.author);
        return (
          <div key={reply.id} className="flex gap-2.5 pl-4">
            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-2xs font-bold ${replyChip.bg} ${replyChip.text}`}>
              {reply.authorInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <span className="text-xs font-semibold text-rd-owner-name">{reply.author}</span>
                <span className="text-2xs text-rd-section-label">{reply.date}</span>
                <span className="text-2xs text-rd-section-label">·</span>
                <span className="text-2xs text-rd-section-label">{reply.time}</span>
              </div>
              <p className="text-sm font-sans text-rd-description leading-relaxed">{reply.content}</p>
            </div>
          </div>
        );
      })}

      {/* Reply input */}
      {showReply && (
        <div className="pl-4 flex flex-col gap-2">
          <textarea
            value={replyText}
            onChange={handleReplyChange}
            placeholder="Write a reply..."
            rows={2}
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleReplyToggle}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleReplyPost(replyText)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-primary text-white hover:bg-brand-primary-dark transition-colors"
            >
              Post Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentThread;
