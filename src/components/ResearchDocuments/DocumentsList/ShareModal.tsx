import { useState, useRef, useEffect } from 'react';
import type { ApiUser } from '../../../types/research-documents';
import { getDocUsers, shareDocument } from '../../../services/research-documents';

interface ShareModalProps {
  open: boolean;
  docId: string;
  docTitle: string;
  iepId: string;
  sharedWith: ApiUser[];
  onClose: () => void;
  onSave: () => void;
}

const getInitials = (name: string) =>
  name.split(' ').map((p) => p[0] ?? '').join('').toUpperCase().slice(0, 2);

const COLORS = ['bg-violet-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];
const pickColor = (id: string) => COLORS[id.charCodeAt(0) % COLORS.length];

const roleSelectClass =
  'w-[102px] h-[35px] border border-[#979797] rounded-[5px] pl-3 pr-7 text-[13px] text-[#414141] bg-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-primary/40';
const roleSelectStyle = { fontFamily: 'Roboto, sans-serif', fontWeight: 500, borderWidth: '0.75px' };

function RoleSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative flex-shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={roleSelectClass}
        style={roleSelectStyle}
      >
        <option value="EDITOR">Editor</option>
        <option value="VIEWER">Viewer</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
        <svg width="10" height="5" viewBox="0 0 10 5" fill="none">
          <path d="M0 0L5 5L10 0" fill="#414141" />
        </svg>
      </div>
    </div>
  );
}

function ShareModal({ open, docId, docTitle, iepId, sharedWith, onClose, onSave }: ShareModalProps) {
  const [searchValue, setSearchValue] = useState('');
  const [people, setPeople] = useState<ApiUser[]>([]);
  const [pending, setPending] = useState<ApiUser[]>([]);
  const [allUsers, setAllUsers] = useState<ApiUser[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setSearchValue('');
    setShowSuggestions(false);
    setPeople(sharedWith);
    setPending([]);
    if (iepId) {
      getDocUsers(iepId).then(setAllUsers).catch(() => setAllUsers([]));
    }
  }, [open, docId, iepId, sharedWith]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowSuggestions(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!open) return null;

  const takenIds = new Set([...people.map((p) => p.user_id), ...pending.map((p) => p.user_id)]);

  const suggestions = searchValue.trim()
    ? allUsers.filter(
        (u) =>
          !takenIds.has(u.user_id) &&
          u.name.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : [];

  function handleAddUser(user: ApiUser) {
    setPending((prev) => [...prev, { ...user, access_type: 'VIEWER' }]);
    setSearchValue('');
    setShowSuggestions(false);
  }

  function handlePendingRoleChange(userId: string, access_type: string) {
    setPending((prev) => prev.map((p) => (p.user_id === userId ? { ...p, access_type } : p)));
  }

  function handlePeopleRoleChange(userId: string, access_type: string) {
    setPeople((prev) => prev.map((p) => (p.user_id === userId ? { ...p, access_type } : p)));
  }

  function removePending(userId: string) {
    setPending((prev) => prev.filter((p) => p.user_id !== userId));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await shareDocument(
        docId,
        [...people, ...pending].map((p) => ({
          user_id: p.user_id,
          access_type: p.access_type ?? 'VIEWER',
        })),
      );
      onSave();
      onClose();
    } catch {
      // keep modal open on error
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-[10px] shadow-xl w-full max-w-[516px] p-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <i className="bi bi-share text-brand-primary text-[18px]" aria-hidden="true" />
            <h2 className="font-heading font-bold text-[18px] text-brand-primary leading-snug">
              Share &ldquo;{docTitle}&rdquo;
            </h2>
          </div>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors mt-0.5" aria-label="Close">
            <i className="bi bi-x-lg text-base" aria-hidden="true" />
          </button>
        </div>

        <p className="text-[12px] text-black mb-5 ml-6">
          Invite team members to review or collaborate on this document.
        </p>

        {/* Search */}
        <p className="text-[12px] font-medium text-[#595454] mb-1.5" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Add Team Member
        </p>
        <div ref={searchRef} className="relative mb-4">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => { setSearchValue(e.target.value); setShowSuggestions(true); }}
            onFocus={() => searchValue.trim() && setShowSuggestions(true)}
            placeholder="Search by name…"
            className="w-full bg-[#f2f6fb] rounded-[2.5px] h-[36px] px-3 pr-9 text-[12px] text-[#595454] focus:outline-none focus:ring-1 focus:ring-brand-primary/40"
          />
          <i className="bi bi-search absolute right-3 top-1/2 -translate-y-1/2 text-[#595454] text-sm" aria-hidden="true" />

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full mt-1 z-20 bg-white border border-neutral-200 rounded-[5px] shadow-lg overflow-hidden max-h-44 overflow-y-auto">
              {suggestions.map((u) => (
                <li key={u.user_id}>
                  <button
                    type="button"
                    onClick={() => handleAddUser(u)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className={`w-[35px] h-[35px] rounded-full flex items-center justify-center ${pickColor(u.user_id)} text-white text-[13px] font-bold flex-shrink-0`}>
                      {getInitials(u.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-black truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{u.name}</p>
                      {u.role && <p className="text-[11px] text-neutral-500 truncate">{u.role}</p>}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pending — selected but not yet saved */}
        {pending.length > 0 && (
          <div className="mb-4">
            <p className="text-[11px] font-medium text-[#595454] mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Selected — not yet saved
            </p>
            <ul className="flex flex-col gap-[12px]">
              {pending.map((person) => (
                <li key={person.user_id} className="flex items-center gap-3 bg-[#f9f0f9] rounded-[5px] px-3 py-2">
                  <div className={`w-[35px] h-[35px] rounded-full flex items-center justify-center ${pickColor(person.user_id)} text-white text-[13px] font-bold flex-shrink-0`}>
                    {getInitials(person.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-black leading-tight truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {person.name}
                    </p>
                    {person.role && (
                      <p className="text-[11px] text-neutral-500 leading-tight truncate">{person.role}</p>
                    )}
                  </div>
                  <RoleSelect
                    value={person.access_type ?? 'VIEWER'}
                    onChange={(v) => handlePendingRoleChange(person.user_id, v)}
                  />
                  <button
                    type="button"
                    onClick={() => removePending(person.user_id)}
                    className="text-neutral-400 hover:text-neutral-600 ml-1 flex-shrink-0"
                    aria-label="Remove"
                  >
                    <i className="bi bi-x text-base" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* People with Access */}
        <p className="text-[12px] font-medium text-[#595454] mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
          People with Access
        </p>
        <ul className="flex flex-col gap-[15px] mb-7 max-h-52 overflow-y-auto pr-1">
          {people.length === 0 && (
            <li className="text-xs text-neutral-400 text-center py-2">No one has access yet.</li>
          )}
          {people.map((person) => (
            <li key={person.user_id} className="flex items-center gap-3">
              <div className="w-[35px] h-[35px] rounded-full bg-[#f9e0f9] flex items-center justify-center flex-shrink-0">
                <span className="text-brand-primary text-[14px] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {getInitials(person.name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-black leading-tight truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {person.name}
                </p>
                {person.role && (
                  <p className="text-[11px] text-black leading-tight truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {person.role}
                  </p>
                )}
              </div>
              <RoleSelect
                value={person.access_type && person.access_type !== 'OWNER' ? person.access_type : 'VIEWER'}
                onChange={(v) => handlePeopleRoleChange(person.user_id, v)}
              />
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onClose}
            className="w-[102px] h-[35px] rounded-[5px] text-[13px] font-medium border border-[#c10000] text-[#c10000] hover:bg-red-50 transition-colors"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-[102px] h-[35px] rounded-[5px] text-[13px] font-medium text-white disabled:opacity-50"
            style={{ fontFamily: 'Roboto, sans-serif', background: 'linear-gradient(180deg, #e43be0 0%, #b500b1 100%)' }}
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ShareModal;
