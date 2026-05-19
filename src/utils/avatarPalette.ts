const PALETTE_SIZE = 8;

function nameToSlot(name: string): number {
  const hash = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (hash % PALETTE_SIZE) + 1;
}

/** Returns a solid background Tailwind class (pair with `text-white`). */
export function getAvatarBgClass(name: string): string {
  return `bg-av-${nameToSlot(name)}`;
}

/** Returns light-bg + dark-text Tailwind classes for comment chip avatars. */
export function getAvatarChipClasses(name: string): { bg: string; text: string } {
  const slot = nameToSlot(name);
  return { bg: `bg-av-chip-${slot}-bg`, text: `text-av-chip-${slot}-text` };
}
