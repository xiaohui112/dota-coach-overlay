import type { LiveAbilityState, LiveGameState, LiveItemState } from './types.js';
import { humanizeItemKey, normalizeAbilityKey, normalizeHeroSlug, normalizeItemKey } from './text.js';

export const GSI_AUTH_TOKEN = 'codex-dota-coach-local';
export const GSI_PORT = 42857;
export const GSI_ENDPOINT = `http://127.0.0.1:${GSI_PORT}/gsi`;

type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function recordAt(value: unknown, key: string): AnyRecord {
  if (!isRecord(value)) return {};
  const child = value[key];
  return isRecord(child) ? child : {};
}

function stringAt(value: AnyRecord, key: string): string | undefined {
  const child = value[key];
  return typeof child === 'string' ? child : undefined;
}

function numberAt(value: AnyRecord, key: string): number | undefined {
  const child = value[key];
  return typeof child === 'number' ? child : undefined;
}

function booleanAt(value: AnyRecord, key: string): boolean | undefined {
  const child = value[key];
  return typeof child === 'boolean' ? child : undefined;
}

function normalizeAbilities(rawAbilities: unknown): LiveAbilityState[] {
  if (!isRecord(rawAbilities)) return [];
  return Object.entries(rawAbilities)
    .filter(([, ability]) => isRecord(ability) && typeof ability.name === 'string')
    .map(([slot, ability]) => {
      const record = ability as AnyRecord;
      const rawName = stringAt(record, 'name') ?? '';
      return {
        slot,
        key: normalizeAbilityKey(rawName),
        rawName,
        level: numberAt(record, 'level') ?? 0,
        cooldown: numberAt(record, 'cooldown'),
        canCast: booleanAt(record, 'can_cast'),
        passive: booleanAt(record, 'passive')
      };
    });
}

function normalizeItems(rawItems: unknown): LiveItemState[] {
  if (!isRecord(rawItems)) return [];
  return Object.entries(rawItems)
    .filter(([, item]) => isRecord(item) && typeof item.name === 'string' && item.name !== 'empty')
    .map(([slot, item]) => {
      const record = item as AnyRecord;
      const rawName = stringAt(record, 'name') ?? '';
      const key = normalizeItemKey(rawName);
      return {
        slot,
        key,
        rawName,
        displayName: humanizeItemKey(key),
        cooldown: numberAt(record, 'cooldown'),
        charges: numberAt(record, 'charges'),
        canCast: booleanAt(record, 'can_cast')
      };
    });
}

function collectDraftHeroSlugs(rawDraft: unknown): string[] {
  if (!isRecord(rawDraft)) return [];
  const slugs = new Set<string>();
  for (const value of Object.values(rawDraft)) {
    if (!isRecord(value)) continue;
    const hero = stringAt(value, 'hero_id') ?? stringAt(value, 'hero_name') ?? stringAt(value, 'name');
    const slug = normalizeHeroSlug(hero);
    if (slug) slugs.add(slug);
  }
  return [...slugs];
}

function collectEvents(rawEvents: unknown): string[] {
  if (!isRecord(rawEvents)) return [];
  return Object.entries(rawEvents)
    .slice(-12)
    .map(([key, value]) => {
      if (!isRecord(value)) return key;
      const eventType = stringAt(value, 'event_type') ?? key;
      const player = stringAt(value, 'player_name') ?? stringAt(value, 'player') ?? '';
      return [eventType, player].filter(Boolean).join(': ');
    });
}

export function normalizeGsiPayload(payload: unknown, expectedToken = GSI_AUTH_TOKEN): LiveGameState {
  const root = isRecord(payload) ? payload : {};
  const auth = recordAt(root, 'auth');
  const provider = recordAt(root, 'provider');
  const map = recordAt(root, 'map');
  const player = recordAt(root, 'player');
  const hero = recordAt(root, 'hero');
  const rawHeroName = stringAt(hero, 'name');
  const heroSlug = normalizeHeroSlug(rawHeroName);

  return {
    receivedAt: new Date().toISOString(),
    providerName: stringAt(provider, 'name'),
    authOk: stringAt(auth, 'token') === expectedToken,
    map: {
      clockTime: numberAt(map, 'clock_time'),
      gameTime: numberAt(map, 'game_time'),
      gameState: stringAt(map, 'game_state'),
      paused: booleanAt(map, 'paused'),
      radiantScore: numberAt(map, 'radiant_score'),
      direScore: numberAt(map, 'dire_score'),
      winTeam: stringAt(map, 'win_team'),
      roshanState: stringAt(map, 'roshan_state')
    },
    player: {
      activity: stringAt(player, 'activity'),
      teamName: stringAt(player, 'team_name'),
      gold: numberAt(player, 'gold'),
      goldReliable: numberAt(player, 'gold_reliable'),
      goldUnreliable: numberAt(player, 'gold_unreliable'),
      kills: numberAt(player, 'kills'),
      deaths: numberAt(player, 'deaths'),
      assists: numberAt(player, 'assists'),
      gpm: numberAt(player, 'gpm'),
      xpm: numberAt(player, 'xpm')
    },
    hero: {
      id: numberAt(hero, 'id'),
      rawName: rawHeroName,
      slug: heroSlug,
      displayName: heroSlug,
      level: numberAt(hero, 'level'),
      alive: booleanAt(hero, 'alive'),
      respawnSeconds: numberAt(hero, 'respawn_seconds'),
      health: numberAt(hero, 'health'),
      maxHealth: numberAt(hero, 'max_health'),
      mana: numberAt(hero, 'mana'),
      maxMana: numberAt(hero, 'max_mana')
    },
    abilities: normalizeAbilities(root.abilities),
    items: normalizeItems(root.items),
    draftHeroSlugs: collectDraftHeroSlugs(root.draft),
    events: collectEvents(root.events),
    rawSummary: {
      hasDraft: isRecord(root.draft),
      hasBuildings: isRecord(root.buildings),
      hasRoshan: isRecord(root.roshan)
    }
  };
}
