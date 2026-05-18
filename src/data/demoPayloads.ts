import { GSI_AUTH_TOKEN } from '../shared/gsi.js';

export type DemoStage = 'early' | 'mid' | 'late';

const basePayload = {
  auth: {
    token: GSI_AUTH_TOKEN
  },
  provider: {
    name: 'Dota 2'
  },
  player: {
    activity: 'playing',
    team_name: 'radiant',
    gold_reliable: 380,
    gold_unreliable: 720,
    kills: 2,
    deaths: 1,
    assists: 3,
    gpm: 468,
    xpm: 522
  },
  hero: {
    id: 93,
    name: 'npc_dota_hero_slark',
    level: 11,
    alive: true,
    health: 1210,
    max_health: 1510,
    mana: 442,
    max_mana: 612
  },
  abilities: {
    ability0: { name: 'slark_dark_pact', level: 4, cooldown: 0, can_cast: true },
    ability1: { name: 'slark_pounce', level: 3, cooldown: 4, can_cast: false },
    ability2: { name: 'slark_essence_shift', level: 2, cooldown: 0, passive: true },
    ability5: { name: 'slark_shadow_dance', level: 1, cooldown: 52, can_cast: false }
  },
  draft: {
    pick0: { name: 'npc_dota_hero_slark' },
    pick1: { name: 'npc_dota_hero_rubick' },
    pick2: { name: 'npc_dota_hero_queenofpain' }
  },
  buildings: {},
  roshan: {
    alive: true
  },
  events: {
    event0: { event_type: 'kill', player_name: 'slark' }
  }
};

export function demoPayload(stage: DemoStage = 'mid'): object {
  if (stage === 'early') {
    return {
      ...basePayload,
      map: {
        clock_time: 430,
        game_time: 430,
        game_state: 'DOTA_GAMERULES_STATE_GAME_IN_PROGRESS',
        paused: false,
        radiant_score: 4,
        dire_score: 5,
        roshan_state: 'alive'
      },
      items: {
        slot0: { name: 'item_wraith_band', cooldown: 0 },
        slot1: { name: 'item_magic_wand', charges: 7 },
        slot2: { name: 'item_boots', cooldown: 0 }
      }
    };
  }

  if (stage === 'late') {
    return {
      ...basePayload,
      map: {
        clock_time: 2135,
        game_time: 2135,
        game_state: 'DOTA_GAMERULES_STATE_GAME_IN_PROGRESS',
        paused: false,
        radiant_score: 31,
        dire_score: 24,
        roshan_state: 'alive'
      },
      player: {
        ...basePayload.player,
        gold_reliable: 2400,
        gold_unreliable: 1100,
        kills: 9,
        deaths: 3,
        assists: 12,
        gpm: 610,
        xpm: 688
      },
      hero: {
        ...basePayload.hero,
        level: 22,
        health: 2240,
        max_health: 2680,
        mana: 910,
        max_mana: 1100
      },
      items: {
        slot0: { name: 'item_power_treads', cooldown: 0 },
        slot1: { name: 'item_echo_sabre', cooldown: 0 },
        slot2: { name: 'item_diffusal_blade', cooldown: 0 },
        slot3: { name: 'item_black_king_bar', cooldown: 58 },
        slot4: { name: 'item_ultimate_scepter', cooldown: 0 },
        slot5: { name: 'item_skadi', cooldown: 0 }
      }
    };
  }

  return {
    ...basePayload,
    map: {
      clock_time: 1025,
      game_time: 1025,
      game_state: 'DOTA_GAMERULES_STATE_GAME_IN_PROGRESS',
      paused: false,
      radiant_score: 12,
      dire_score: 9,
      roshan_state: 'alive'
    },
    items: {
      slot0: { name: 'item_power_treads', cooldown: 0 },
      slot1: { name: 'item_echo_sabre', cooldown: 0 },
      slot2: { name: 'item_magic_wand', charges: 12 },
      slot3: { name: 'item_blades_of_attack', cooldown: 0 }
    }
  };
}
