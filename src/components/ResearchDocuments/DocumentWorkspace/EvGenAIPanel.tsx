import { useState, useRef } from 'react';
import type { ChatMessage } from '../../../types/research-documents';
import { createEvgenAIPanelHandlers } from '../../../handlers/research-documents/evgenAIPanelHandlers';
import ChatBubble from './ChatBubble';

interface EvGenAIPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, userInitials: string) => void;
  onAddToNotes: (content: string, query: string) => void;
  userInitials: string;
  userFirstName: string;
}

function EvGenAIPanel({
  messages,
  onSendMessage,
  onAddToNotes,
  userInitials,
  userFirstName,
}: EvGenAIPanelProps) {
  const [inputText, setInputText] = useState('');
  const [responseMode, setResponseMode] = useState<'concise' | 'detailed'>('concise');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { handleSend, handleKeyDown, handleModeToggle } = createEvgenAIPanelHandlers({
    inputRef,
    setInputText,
    setResponseMode,
    onSendMessage,
    onAddToNotes,
    userInitials,
  });

  const handleAddToNotesForMsg = (message: ChatMessage) => {
    const msgIdx = messages.indexOf(message);
    const userQuery =
      msgIdx > 0 && messages[msgIdx - 1].role === 'user' ? messages[msgIdx - 1].content : '';
    onAddToNotes(message.content, userQuery);
    setAddedIds((prev) => new Set([...prev, message.id]));
  };

  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachedFile(file.name);
    e.target.value = '';
  };

  const handleRemoveAttachment = () => setAttachedFile(null);

  const handleSendWithAttach = () => {
    handleSend(inputText);
    setAttachedFile(null);
  };

  const isGreeting = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-tab-bg">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {isGreeting ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <i className="bi bi-stars text-brand-primary text-xl" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold text-brand-primary">Hello, {userFirstName}</p>
              <p className="text-xs font-bold text-neutral-500 leading-relaxed max-w-[220px]">
                Ask about this document, upload supporting material, and add useful answers into the notes with one click.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              onAddToNotes={msg.role === 'ai' ? handleAddToNotesForMsg : undefined}
              isAdded={addedIds.has(msg.id)}
            />
          ))
        )}
      </div>

      {/* Bottom section */}
      <div className="border-t border-neutral-200 bg-tab-bg">
        {/* Mode toggle */}
        <div className="flex items-center px-4 pt-3 pb-2">
          <div className="flex items-center bg-brand-primary-light rounded-full p-1">
            {(['concise', 'detailed'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => handleModeToggle(mode)}
                className={[
                  'px-4 py-1 rounded-full text-xs font-semibold transition-colors capitalize focus:outline-none',
                  responseMode === mode
                    ? 'bg-brand-primary text-white'
                    : 'text-brand-primary',
                ].join(' ')}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Attached file chip */}
        {attachedFile && (
          <div className="px-4 pb-1 flex items-center gap-1">
            <span className="flex items-center gap-1 text-xs text-brand-primary bg-purple-50 border border-brand-primary px-2 py-0.5 rounded-full max-w-[180px] truncate">
              <i className="bi bi-paperclip text-xs" aria-hidden="true" />
              {attachedFile}
            </span>
            <button
              type="button"
              onClick={handleRemoveAttachment}
              className="text-neutral-400 hover:text-red-500 transition-colors"
              aria-label="Remove attachment"
            >
              <i className="bi bi-x text-sm" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-2">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (inputRef.current) {
                inputRef.current.style.height = 'auto';
                inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, inputText)}
            placeholder="Message EvGen AI"
            rows={4}
            className="w-full resize-none border border-rd-divider rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary max-h-32 overflow-y-auto bg-rd-body-bg placeholder:font-sans placeholder:italic placeholder:text-[10px]"
          />
        </div>

        {/* Attach + Send row */}
        <div className="flex items-center justify-between px-4 pb-3">
          <button
            type="button"
            onClick={handleAttachClick}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-brand-primary text-brand-primary bg-white text-xs font-medium hover:bg-primary-tint-04 transition-colors"
          >
            <i className="bi bi-plus text-sm" aria-hidden="true" />
            Attach
          </button>
          <button
            type="button"
            onClick={handleSendWithAttach}
            disabled={!inputText.trim() && !attachedFile}
            className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center hover:bg-brand-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            <i className="bi bi-send-fill text-xs" aria-hidden="true" />
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default EvGenAIPanel;
