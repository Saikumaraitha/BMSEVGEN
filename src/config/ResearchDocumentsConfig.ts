export type RdFilterKey = 'all' | 'created-by-me' | 'can-edit' | 'view-only';
export type RdSortKey = 'last-edited' | 'title-asc' | 'title-desc';

export interface RdListSidebarItem {
  key: RdFilterKey;
  label: string;
  icon: string;
  section: 'docs' | 'shared';
}

export interface RdWorkspaceNavItem {
  key: 'evgen' | 'comments';
  label: string;
  icon: string;
  panelParam: string;
}

export const RD_LIST_SIDEBAR_ITEMS: RdListSidebarItem[] = [
  { key: 'all', label: 'All Documents', icon: 'bi-grid', section: 'docs' },
  { key: 'created-by-me', label: 'Created by me', icon: 'bi-person', section: 'docs' },
  { key: 'can-edit', label: 'Can Edit', icon: 'bi-pencil', section: 'shared' },
  { key: 'view-only', label: 'View Only', icon: 'bi-eye', section: 'shared' },
];

export const RD_SORT_OPTIONS: { key: RdSortKey; label: string }[] = [
  { key: 'last-edited', label: 'Last Edited' },
  { key: 'title-asc', label: 'Title A–Z' },
  { key: 'title-desc', label: 'Title Z–A' },
];

export const RD_WORKSPACE_NAV_ITEMS: RdWorkspaceNavItem[] = [
  { key: 'evgen', label: 'EvGen AI', icon: 'bi-stars', panelParam: 'evgen' },
  { key: 'comments', label: 'Comments', icon: 'bi-chat-text', panelParam: 'comments' },
];
