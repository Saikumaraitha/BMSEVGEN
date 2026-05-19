import { useState, useRef, useEffect } from 'react';
import type { ShareMember, ShareRole, TeamMember } from '../../../types/research-documents';
import { getDocShareMembers, getTeamMembers } from '../../../services/research-documents';

interface ShareModalProps {
  open: boolean;
  docId: string;
  docTitle: string;
  onClose: () => void;
  onSave: (people: ShareMember[]) => void;
}

const ROLES: ShareRole[] = ['Owner', 'Editor', 'Viewer'];

function RoleDropdown({ role, onChange }: { role: ShareRole; onChange: (r: ShareRole) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors min-w-[90px] justify-between"
      >
        {role}
        <i className="bi bi-chevron-down text-neutral-400 text-xs" aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-10 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden min-w-[110px]">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => { onChange(r); setOpen(false); }}
              className={[
                'w-full text-left px-3 py-2 text-xs font-medium transition-colors',
                r === role
                  ? 'bg-brand-primary/10 text-brand-primary'
                  : 'text-neutral-700 hover:bg-neutral-50',
              ].join(' ')}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ShareModal({ open, docId, docTitle, onClose, onSave }: ShareModalProps) {
  const [searchValue, setSearchValue] = useState('');
  const [people, setPeople] = useState<ShareMember[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setSearchValue('');
    setShowSuggestions(false);
    Promise.all([getDocShareMembers(docId), getTeamMembers()]).then(([members, team]) => {
      setPeople(members);
      setTeamMembers(team);
    });
  }, [open, docId]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowSuggestions(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!open) return null;

  const alreadyAddedIds = new Set(people.map((p) => p.id));

  const suggestions = searchValue.trim()
    ? teamMembers.filter(
        (tm) =>
          !alreadyAddedIds.has(tm.id) &&
          (tm.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            tm.email.toLowerCase().includes(searchValue.toLowerCase())),
      )
    : [];

  function handleAddMember(tm: TeamMember) {
    const newMember: ShareMember = {
      id: tm.id,
      name: tm.name,
      email: tm.email,
      initials: tm.initials,
      role: 'Viewer',
    };
    setPeople((prev) => [...prev, newMember]);
    setSearchValue('');
    setShowSuggestions(false);
  }

  function handleRoleChange(id: string, role: ShareRole) {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, role } : p)));
  }

  function handleSave() {
    onSave(people);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <i className="bi bi-share text-brand-primary text-base" aria-hidden="true" />
            <h2 className="text-base font-bold text-neutral-900 leading-snug">
              Share &ldquo;{docTitle}&rdquo;
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors mt-0.5"
            aria-label="Close"
          >
            <i className="bi bi-x-lg text-base" aria-hidden="true" />
          </button>
        </div>

        <p className="text-xs text-neutral-500 mb-5 ml-6">
          Invite team members to review or collaborate on this document.
        </p>

        {/* Search */}
        <p className="text-xs font-medium text-neutral-700 mb-1.5">Add Team Member</p>
        <div ref={searchRef} className="relative mb-5">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => { setSearchValue(e.target.value); setShowSuggestions(true); }}
            onFocus={() => searchValue.trim() && setShowSuggestions(true)}
            placeholder="Search by name or email…"
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 pr-9 text-sm bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary"
          />
          <i className="bi bi-search absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" aria-hidden="true" />

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full mt-1 z-20 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden max-h-44 overflow-y-auto">
              {suggestions.map((tm) => (
                <li key={tm.id}>
                  <button
                    type="button"
                    onClick={() => handleAddMember(tm)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-rd-avatar-bg text-rd-avatar-text text-xs font-bold flex-shrink-0">
                      {tm.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 truncate">{tm.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{tm.email}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* People with Access */}
        <p className="text-xs font-medium text-neutral-700 mb-3">People with Access</p>
        <ul className="flex flex-col gap-3 mb-6 max-h-52 overflow-y-auto">
          {people.map((person) => (
            <li key={person.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-rd-avatar-bg text-rd-avatar-text text-xs font-bold flex-shrink-0">
                {person.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-900 leading-tight truncate">
                  {person.name}
                </p>
                <p className="text-xs text-neutral-500 leading-tight truncate">{person.email}</p>
              </div>
              <RoleDropdown role={person.role} onChange={(r) => handleRoleChange(person.id, r)} />
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm font-medium border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2 rounded-lg text-sm font-medium bg-brand-primary text-white hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
