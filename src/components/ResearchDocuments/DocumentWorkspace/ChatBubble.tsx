import type { ChatMessage } from '../../../types/research-documents';

interface ChatBubbleProps {
  message: ChatMessage;
  onAddToNotes?: (message: ChatMessage) => void;
  isAdded?: boolean;
}

function ChatBubble({ message, onAddToNotes, isAdded }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex items-start gap-2 justify-end">
        <div className="max-w-[80%] bg-[#704EA5] text-white rounded-3xl rounded-tr-none px-4 py-3 text-xs font-sans font-medium leading-relaxed">
          {message.content}
        </div>
        {message.userInitials && (
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#704EA5] text-white text-xs font-semibold flex items-center justify-center">
            {message.userInitials}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-tint-10 flex items-center justify-center">
        <i className="bi bi-stars text-brand-primary-dark text-xs" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2 max-w-[80%]">
        <div className="bg-rd-body-bg border border-[#E2E0D7] rounded-3xl rounded-tl-none px-4 py-3 text-xs font-sans font-medium text-rd-owner-name leading-relaxed">
          {message.content}
        </div>
        {onAddToNotes && (
          isAdded ? (
            <span className="self-start flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <i className="bi bi-check-circle-fill text-xs" aria-hidden="true" />
              Added
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onAddToNotes(message)}
              className="self-start flex items-center gap-1.5 text-xs font-semibold text-brand-primary border border-brand-primary px-3 py-1 rounded-full hover:bg-purple-50 transition-colors"
            >
              <i className="bi bi-plus text-sm" aria-hidden="true" />
              Add to Notes
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default ChatBubble;
