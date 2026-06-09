import { useRef, useEffect, useState } from 'react';
import type { AgentChatMessage, ChatMode, FrequentQuery } from '../../types/chat-agents';
import MessageBubble from './MessageBubble';
import ChatGroupIcon from '../../assets/icons/ChatGroup.svg?react';
import SendIcon from '../../assets/icons/Send.svg?react';

interface ChatWindowProps {
  messages: AgentChatMessage[];
  isLoadingMessages?: boolean;
  frequentQueries: FrequentQuery[];
  onSendMessage: (text: string, mode: ChatMode) => void;
  onAddToNotes: (message: AgentChatMessage) => void;
  onClearChat: () => void;
}

const PREVIEW_FAQ_COUNT = 4;

function SeeAllModal({
  queries,
  onSelect,
  onClose,
}: {
  queries: FrequentQuery[];
  onSelect: (q: FrequentQuery) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-neutral-900">Suggested Prompts</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
          >
            <i className="bi bi-x text-lg" aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 grid grid-cols-2 gap-3 scrollbar-thin-styled">
          {queries.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => { onSelect(q); onClose(); }}
              className="text-left p-4 border border-neutral-200 rounded-xl hover:border-brand-primary hover:bg-brand-primary/5 transition-all group"
            >
              <p className="text-xs text-neutral-700 leading-relaxed group-hover:text-brand-primary">
                {q.question}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatWindow({
  messages,
  isLoadingMessages = false,
  frequentQueries,
  onSendMessage,
  onAddToNotes,
  onClearChat,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<ChatMode>('concise');
  const [showSeeAll, setShowSeeAll] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (hasMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, hasMessages]);

  const handleSend = (text?: string) => {
    const trimmed = (text ?? inputText).trim();
    if (!trimmed) return;
    onSendMessage(trimmed, mode);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFaqSelect = (query: FrequentQuery) => {
    handleSend(query.question);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const previewQueries = Array.isArray(frequentQueries) ? frequentQueries.slice(0, PREVIEW_FAQ_COUNT) : [];

  // ── Mode pills + send button row (shared inside the input box) ──────────────
  const inputFooter = (
    <div className="flex items-center justify-between mt-3">
      {/* Segmented control — shared pill track with active fill */}
      {/* Unified segmented control — single pill track, active tab fills inside */}
      {/* Unified segmented control — fixed height so both tabs are always equal */}
      <div className="flex items-stretch font-heading bg-exec-icon-bg rounded-full overflow-hidden h-7">
        <button
          type="button"
          onClick={() => setMode('concise')}
          className={[
            'px-5 h-full rounded-full text-xs font-semibold transition-colors flex items-center',
            mode === 'concise'
              ? 'bg-brand-primary text-white'
              : 'text-brand-primary font-normal text-2xs',
          ].join(' ')}
        >
          Concise
        </button>
        <button
          type="button"
          onClick={() => setMode('detailed')}
          className={[
            'px-5 h-full rounded-full transition-colors flex items-center',
            mode === 'detailed'
              ? 'bg-brand-primary text-white text-xs font-semibold'
              : 'text-brand-primary font-normal text-2xs',
          ].join(' ')}
        >
          Detailed
        </button>
      </div>

      <button
        type="button"
        onClick={() => handleSend()}
        disabled={!inputText.trim()}
        className={[
          'flex-shrink-0 transition-opacity',
          inputText.trim() ? 'opacity-100 cursor-pointer' : 'opacity-40 cursor-not-allowed',
        ].join(' ')}
        aria-label="Send message"
      >
        <SendIcon className="w-8 h-8" aria-hidden="true" />
      </button>
    </div>
  );

  // ── Shared input box ────────────────────────────────────────────────────────
  const inputBox = (
    <div className="w-full flex flex-col input-gradient-border rounded-2xl bg-white px-2 pt-3 pb-1">
      <textarea
        ref={textareaRef}
        value={inputText}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        rows={3}
        placeholder="Ask a question or describe what you need..."
        className="w-full resize-none text-sm text-neutral-800 outline-none bg-transparent leading-relaxed placeholder:text-chat-placeholder placeholder:font-sans placeholder:font-light placeholder:italic placeholder:text-sm"
        style={{ maxHeight: '120px' }}
      />
      {inputFooter}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
      {isLoadingMessages ? (
        /* ── Loading skeleton ── */
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-bounce" />
            </div>
            <p className="text-xs text-text-subtle font-sans">Loading messages…</p>
          </div>
        </div>
      ) : hasMessages ? (
        /* ── Conversation view ── */
        <>
          {/* Top bar with Clear Chat */}
          <div className="flex-shrink-0 flex items-center justify-end px-6 py-3">
            <button
              type="button"
              onClick={onClearChat}
              className="px-6 py-2 rounded-md border border-brand-primary bg-white text-sm font-medium text-brand-primary hover:bg-brand-primary/5 transition-colors"
            >
              Clear Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin-styled">
            <div className="px-6 py-3 flex flex-col gap-5 min-h-full">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onAddToNotes={msg.role === 'ai' ? onAddToNotes : undefined}
                  onFollowUpQuery={
                    msg.role === 'ai'
                      ? (text) => onSendMessage(text, mode)
                      : undefined
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Fixed bottom input bar */}
          <div className="flex-shrink-0 bg-primary-light px-6 py-4">
            {inputBox}
          </div>
        </>
      ) : (
        /* ── Welcome / empty state ── */
        <div className="flex-1 overflow-y-auto scrollbar-thin-styled">
          <div className="flex flex-col min-h-full px-6 py-12">

            {/* Header — always centered across full chat width */}
            <div className="w-full flex flex-col items-center text-center mb-8">
              <ChatGroupIcon className="w-10 h-10 mb-3" aria-hidden="true" />

              <h1 className="text-2xl font-bold font-ui text-brand-primary-dark">
                Welcome to EvGen Studio.
              </h1>

              <p className="text-[22px] font-normal font-ui text-text-body">
                What would you like to work on?
              </p>
            </div>

            {/* Input box — centered, max-width constrained */}
            <div className="w-5/6 mx-auto">
              {inputBox}
            </div>

            {/* Suggested Prompts — full chat-window width, edge-to-edge with px-6 padding */}
            <div className="w-full mt-14 px-2">
              <p className="text-xs font-semibold font-sans text-brand-primary-dark mb-3">
                Suggested Prompts
              </p>

              <div className="grid grid-cols-2 gap-3">
                {previewQueries.map((query) => (
                  <button
                    key={query.id}
                    type="button"
                    onClick={() => handleFaqSelect(query)}
                    className="text-left px-4 py-3 bg-white border border-prompt-card-border rounded-xl hover:border-brand-primary hover:bg-brand-primary/5 transition-all group"
                  >
                    <p className="text-13 font-normal font-sans text-prompt-card-text leading-relaxed group-hover:text-brand-primary transition-colors">
                      {query.question}
                    </p>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {showSeeAll && (
        <SeeAllModal
          queries={frequentQueries}
          onSelect={handleFaqSelect}
          onClose={() => setShowSeeAll(false)}
        />
      )}
    </div>
  );
}

export default ChatWindow;
