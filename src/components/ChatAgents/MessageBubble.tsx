import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { AgentChatMessage } from '../../types/chat-agents';
import AddToNotesModal from './AddToNotesModal';
import { buildPath, ROUTES } from '../../constants/routes';

interface MessageBubbleProps {
  message: AgentChatMessage;
  onAddToNotes?: (message: AgentChatMessage) => void;
}

function renderInline(text: string): React.ReactNode {
  const pattern = /(\*\*.*?\*\*|\b\d+(?:\.\d+)?%|\bp\s*[<>]\s*0\.\d+\b|\bHR\s+\d+\.\d+\b|\bORR\s+[\d.]+%\b)/g;
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    if (/^\*\*(.*)\*\*$/.test(part)) {
      return (
        <strong key={i} className="font-semibold text-neutral-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (/\b\d+(?:\.\d+)?%/.test(part) || /p\s*[<>]/.test(part) || /\bHR\s+\d/.test(part) || /\bORR\s+\d/.test(part)) {
      return (
        <span key={i} className="font-semibold text-brand-primary bg-brand-primary/10 px-1 rounded text-[11px]">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  const blocks = text.split(/\n\n+/);

  return blocks.map((block, bi) => {
    const lines = block.split('\n').filter(Boolean);
    if (lines.length === 0) return null;

    if (lines.length === 1 && /^## /.test(lines[0])) {
      return (
        <p key={bi} className="text-xs font-bold text-neutral-800 mt-3 mb-1 first:mt-0 uppercase tracking-wide">
          {lines[0].replace(/^## /, '')}
        </p>
      );
    }

    if (lines.length === 1 && /^# /.test(lines[0])) {
      return (
        <p key={bi} className="text-sm font-bold text-neutral-900 mt-3 mb-1 first:mt-0">
          {lines[0].replace(/^# /, '')}
        </p>
      );
    }

    const elements = lines.map((line, li) => {
      if (/^## /.test(line)) {
        return (
          <p key={li} className="text-xs font-bold text-neutral-800 mt-2 mb-0.5 uppercase tracking-wide">
            {line.replace(/^## /, '')}
          </p>
        );
      }
      if (/^# /.test(line)) {
        return (
          <p key={li} className="text-sm font-bold text-neutral-900 mt-2 mb-0.5">
            {line.replace(/^# /, '')}
          </p>
        );
      }
      if (/^[-*] /.test(line)) {
        return (
          <div key={li} className="flex gap-1.5 mt-0.5">
            <span className="text-brand-primary flex-shrink-0 mt-px">•</span>
            <span>{renderInline(line.replace(/^[-*] /, ''))}</span>
          </div>
        );
      }
      if (/^\d+\. /.test(line)) {
        const num = line.match(/^(\d+)\. /)?.[1] ?? '';
        return (
          <div key={li} className="flex gap-2 mt-0.5">
            <span className="flex-shrink-0 font-semibold text-brand-primary w-4 text-right">{num}.</span>
            <span>{renderInline(line.replace(/^\d+\. /, ''))}</span>
          </div>
        );
      }
      return (
        <p key={li} className="mt-0.5">
          {renderInline(line)}
        </p>
      );
    });

    return (
      <div key={bi} className="mt-1 first:mt-0">
        {elements}
      </div>
    );
  });
}

function MessageBubble({ message, onAddToNotes }: MessageBubbleProps) {
  const [added, setAdded] = useState(message.addedToNotes ?? false);
  const [showModal, setShowModal] = useState(false);
  const isUser = message.role === 'user';

  const navigate = useNavigate();
  const { assetId } = useParams<{ assetId: string }>();

  const handleModalSelect = (documentId: string | 'new') => {
    setShowModal(false);
    setAdded(true);
    onAddToNotes?.(message);

    const noteState = { pendingNote: { title: 'Chat Note', content: message.content } };
    const docId = documentId === 'new' ? 'new' : documentId;
    navigate(buildPath(ROUTES.ASSET.RESEARCH_DOCUMENTS.DOC, { assetId: assetId ?? '', docId }), { state: noteState });
  };

  if (isUser) {
    return (
      <div className="flex items-start gap-2 justify-end">
        <div className="max-w-[72%] bg-rd-chat-user-bg text-white rounded-3xl rounded-tr-none px-4 py-3 text-xs font-sans font-medium leading-relaxed">
          {message.content}
        </div>
        {message.userInitials && (
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-rd-chat-user-bg text-white text-xs font-semibold flex items-center justify-center">
            {message.userInitials}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-tint-10 flex items-center justify-center">
          <i className="bi bi-stars text-brand-primary-dark text-xs" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-2 max-w-[82%]">
          {/* Response bubble */}
          <div className="bg-white border border-rd-chat-border rounded-3xl rounded-tl-none px-4 py-3 text-xs font-sans text-neutral-700 leading-relaxed">
            {renderMarkdown(message.content)}
          </div>

          {/* Action row */}
          <div className="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 transition-colors"
              title="Copy"
            >
              <i className="bi bi-copy text-xs" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 transition-colors"
              title="Regenerate"
            >
              <i className="bi bi-arrow-repeat text-xs" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 transition-colors"
              title="Thumbs up"
            >
              <i className="bi bi-hand-thumbs-up text-xs" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 transition-colors"
              title="Thumbs down"
            >
              <i className="bi bi-hand-thumbs-down text-xs" aria-hidden="true" />
            </button>

            <div className="w-px h-3 bg-neutral-200 mx-0.5" />

            <button
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-neutral-200 text-xs text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              <i className="bi bi-hand-thumbs-up text-xs" aria-hidden="true" />
              Helpful
            </button>
            <button
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-neutral-200 text-xs text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              <i className="bi bi-pencil text-xs" aria-hidden="true" />
              Improve
            </button>

            {onAddToNotes && (
              added ? (
                <span className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200">
                  <i className="bi bi-check-circle-fill text-xs" aria-hidden="true" />
                  Added to Notes
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-full border border-brand-primary text-xs font-semibold text-brand-primary hover:bg-purple-50 transition-colors"
                >
                  <i className="bi bi-plus text-sm" aria-hidden="true" />
                  Add to Notes
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <AddToNotesModal
          onSelect={handleModalSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default MessageBubble;
