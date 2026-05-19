import type { Dispatch, SetStateAction } from 'react';

interface CommentsPanelHandlerDeps {
  setPostText: Dispatch<SetStateAction<string>>;
  onPost: (content: string, author: string, initials: string) => void;
  author: string;
  initials: string;
}

export function createCommentsPanelHandlers(deps: CommentsPanelHandlerDeps) {
  const { setPostText, onPost, author, initials } = deps;

  const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setPostText(e.target.value);

  const handlePost = (postText: string) => {
    const trimmed = postText.trim();
    if (!trimmed) return;
    onPost(trimmed, author, initials);
    setPostText('');
  };

  return { handlePostChange, handlePost };
}

interface CommentThreadHandlerDeps {
  setReplyText: Dispatch<SetStateAction<string>>;
  setShowReply: Dispatch<SetStateAction<boolean>>;
  onReply: (parentId: string, content: string, author: string, initials: string) => void;
  parentId: string;
  author: string;
  initials: string;
}

export function createCommentThreadHandlers(deps: CommentThreadHandlerDeps) {
  const { setReplyText, setShowReply, onReply, parentId, author, initials } = deps;

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setReplyText(e.target.value);

  const handleReplyToggle = () => setShowReply((prev) => !prev);

  const handleReplyPost = (replyText: string) => {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    onReply(parentId, trimmed, author, initials);
    setReplyText('');
    setShowReply(false);
  };

  return { handleReplyChange, handleReplyToggle, handleReplyPost };
}
