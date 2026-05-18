export function normalizeHeroSlug(raw?: string): string | undefined {
  if (!raw) return undefined;
  return raw
    .replace(/^npc_dota_hero_/, '')
    .replace(/_/g, '-')
    .replace(/^nevermore$/, 'shadow-fiend')
    .replace(/^doom-bringer$/, 'doom')
    .replace(/^windrunner$/, 'windranger')
    .replace(/^obsidian-destroyer$/, 'outworld-destroyer')
    .toLowerCase();
}

export function normalizeAbilityKey(raw?: string): string {
  if (!raw) return '';
  return raw
    .replace(/^ability_/, '')
    .replace(/^special_bonus_/, 'talent_')
    .replace(/^npc_dota_hero_/, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

export function normalizeItemKey(raw?: string): string {
  if (!raw || raw === 'empty') return '';
  return raw
    .replace(/^item_/, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

export function humanizeItemKey(key: string): string {
  return key
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatGameTime(seconds?: number): string {
  if (typeof seconds !== 'number' || Number.isNaN(seconds)) return '--:--';
  const sign = seconds < 0 ? '-' : '';
  const abs = Math.abs(Math.floor(seconds));
  const minutes = Math.floor(abs / 60);
  const remaining = abs % 60;
  return `${sign}${minutes}:${remaining.toString().padStart(2, '0')}`;
}

export function scoreLead(radiant?: number, dire?: number): number {
  if (typeof radiant !== 'number' || typeof dire !== 'number') return 0;
  return radiant - dire;
}
