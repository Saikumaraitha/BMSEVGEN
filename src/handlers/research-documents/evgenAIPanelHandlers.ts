import type { Dispatch, SetStateAction, RefObject } from 'react';
import type { ChatMessage } from '../../types/research-documents';

interface EvgenAIPanelHandlerDeps {
  inputRef: RefObject<HTMLTextAreaElement>;
  setInputText: Dispatch<SetStateAction<string>>;
  setResponseMode: Dispatch<SetStateAction<'concise' | 'detailed'>>;
  onSendMessage: (content: string, userInitials: string) => void;
  onAddToNotes: (content: string, query: string) => void;
  userInitials: string;
}

export function createEvgenAIPanelHandlers(deps: EvgenAIPanelHandlerDeps) {
  const { inputRef, setInputText, setResponseMode, onSendMessage, onAddToNotes, userInitials } = deps;

  const handleSend = (inputText: string) => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onSendMessage(trimmed, userInitials);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, inputText: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputText);
    }
  };

  const handleModeToggle = (mode: 'concise' | 'detailed') => setResponseMode(mode);

  const handleAddToNotes = (message: ChatMessage, queryContent: string) => {
    onAddToNotes(message.content, queryContent);
  };

  const handleFileAttach = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt';
    input.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  return { handleSend, handleKeyDown, handleModeToggle, handleAddToNotes, handleFileAttach, handleInputChange };
}
