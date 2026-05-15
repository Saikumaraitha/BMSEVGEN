import { useState, useRef } from 'react';
import { createEvgenAIPanelHandlers } from '../../../handlers/research-documents/evgenAIPanelHandlers';

interface ChatInputProps {
  onSend: (content: string, userInitials: string) => void;
  userInitials: string;
}

function ChatInput({ onSend, userInitials }: ChatInputProps) {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { handleSend, handleKeyDown, handleFileAttach, handleInputChange } =
    createEvgenAIPanelHandlers({
      inputRef,
      setInputText,
      setResponseMode: () => {},
      onSendMessage: onSend,
      onAddToNotes: () => {},
      userInitials,
    });

  return (
    <div className="flex items-end gap-2 px-3 py-3 border-t border-neutral-200 bg-white">
      <button
        type="button"
        onClick={handleFileAttach}
        className="flex-shrink-0 p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-brand-primary transition-colors"
        aria-label="Attach file"
      >
        <i className="bi bi-paperclip text-base" aria-hidden="true" />
      </button>

      <textarea
        ref={inputRef}
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={(e) => handleKeyDown(e, inputText)}
        placeholder="Ask EvGen AI..."
        rows={1}
        className="flex-1 resize-none border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary max-h-28 overflow-y-auto"
      />

      <button
        type="button"
        onClick={() => handleSend(inputText)}
        disabled={!inputText.trim()}
        className="flex-shrink-0 p-2 rounded-lg bg-brand-primary text-white hover:bg-brand-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Send"
      >
        <i className="bi bi-send-fill text-sm" aria-hidden="true" />
      </button>
    </div>
  );
}

export default ChatInput;
