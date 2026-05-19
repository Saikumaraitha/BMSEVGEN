import { useRef, useEffect, useState } from 'react';
import type { AgentChatMessage, ChatMode, FrequentQuery } from '../../types/chat-agents';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  userName: string;
  messages: AgentChatMessage[];
  frequentQueries: FrequentQuery[];
  onSendMessage: (text: string, mode: ChatMode) => void;
  onAddToNotes: (message: AgentChatMessage) => void;
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
          <h2 className="text-base font-bold text-neutral-900">Frequently Asked Queries</h2>
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

function ModeToggle({
  mode,
  onChange,
}: {
  mode: ChatMode;
  onChange: (m: ChatMode) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-500">Response style:</span>
      <button
        type="button"
        onClick={() => onChange('concise')}
        className={[
          'px-3 py-1 rounded-full text-xs font-semibold transition-colors',
          mode === 'concise'
            ? 'bg-brand-primary text-white'
            : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
        ].join(' ')}
      >
        Concise
      </button>
      <button
        type="button"
        onClick={() => onChange('detailed')}
        className={[
          'px-3 py-1 rounded-full text-xs font-semibold transition-colors',
          mode === 'detailed'
            ? 'bg-brand-primary text-white'
            : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
        ].join(' ')}
      >
        Detailed
      </button>
    </div>
  );
}

function ChatWindow({
  userName,
  messages,
  frequentQueries,
  onSendMessage,
  onAddToNotes,
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

  const previewQueries = frequentQueries.slice(0, PREVIEW_FAQ_COUNT);

  const inputBox = (
    <div className="flex flex-col border border-neutral-200 rounded-2xl px-4 pt-3 pb-2 shadow-sm focus-within:border-brand-primary/50 transition-colors bg-white">
      <textarea
        ref={textareaRef}
        value={inputText}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        rows={2}
        placeholder="Ask anything about insights, actions, or related clinical topics..."
        className="w-full resize-none text-sm text-neutral-800 placeholder-neutral-400 outline-none bg-transparent leading-relaxed"
        style={{ maxHeight: '120px' }}
      />
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          className={[
            'w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0',
            inputText.trim()
              ? 'bg-brand-primary text-white hover:bg-brand-primary-dark'
              : 'bg-brand-primary/30 text-white',
          ].join(' ')}
          aria-label="Send message"
        >
          <i className="bi bi-send-fill text-xs" aria-hidden="true" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-rd-body-bg">
      {hasMessages ? (
        /* ── Conversation view ── */
        <>
          <div className="flex-1 overflow-y-auto scrollbar-thin-styled">
            <div className="px-6 py-5 flex flex-col gap-5 min-h-full">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onAddToNotes={msg.role === 'ai' ? onAddToNotes : undefined}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Fixed bottom input bar */}
          <div className="flex-shrink-0 border-t border-neutral-200 bg-white px-5 py-4">
            <div className="flex justify-end mb-2">
              <ModeToggle mode={mode} onChange={setMode} />
            </div>
            {inputBox}
          </div>
        </>
      ) : (
        /* ── Welcome / empty state — all content scrollable ── */
        <div className="flex-1 overflow-y-auto scrollbar-thin-styled">
          <div className="flex flex-col items-center px-6 pt-10 pb-10 w-full max-w-3xl mx-auto">

            {/* Avatar + greeting + title */}
            <div className="flex flex-col items-center gap-1 mb-8 text-center">
              <div className="w-14 h-14 rounded-full bg-brand-primary flex items-center justify-center mb-2">
                <i className="bi bi-stars text-white text-2xl" aria-hidden="true" />
              </div>
              <p className="text-sm text-neutral-500">Hi {userName}</p>
              <h1 className="text-2xl font-bold text-neutral-900 leading-snug max-w-md">
                Welcome to EvGen Studio Chat. Where should we start?
              </h1>
            </div>

            {/* Response style + textarea */}
            <div className="w-full mb-8">
              <div className="flex justify-end mb-2">
                <ModeToggle mode={mode} onChange={setMode} />
              </div>
              {inputBox}
            </div>

            {/* Frequently Asked Queries */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-neutral-800">
                  Frequently Asked Queries
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSeeAll(true)}
                  className="text-sm font-semibold text-brand-primary hover:underline transition-colors"
                >
                  See All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {previewQueries.map((query) => (
                  <button
                    key={query.id}
                    type="button"
                    onClick={() => handleFaqSelect(query)}
                    className="text-left p-4 bg-white border border-neutral-200 rounded-xl hover:border-brand-primary hover:bg-brand-primary/5 transition-all group shadow-sm"
                  >
                    <p className="text-xs text-neutral-700 leading-relaxed group-hover:text-brand-primary transition-colors">
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
