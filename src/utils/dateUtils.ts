export function formatDocDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function todayDocDate(): string {
  return formatDocDate(new Date().toISOString());
}
