import { describe, expect, it } from 'vitest';
import { demoPayload } from '../src/data/demoPayloads.js';
import { metaSnapshot } from '../src/data/metaSnapshot.js';
import { generateAdvice } from '../src/shared/adviceEngine.js';
import { GSI_AUTH_TOKEN, normalizeGsiPayload } from '../src/shared/gsi.js';

describe('GSI normalization and advice', () => {
  it('normalizes a Dota 2 GSI payload into a stable live state', () => {
    const state = normalizeGsiPayload(demoPayload('mid'));

    expect(state.authOk).toBe(true);
    expect(state.hero.slug).toBe('slark');
    expect(state.items.map((item) => item.key)).toContain('power_treads');
    expect(state.abilities.some((ability) => ability.key === 'slark_dark_pact')).toBe(true);
    expect(state.map.clockTime).toBe(1025);
  });

  it('flags invalid auth token without throwing', () => {
    const payload = {
      ...demoPayload('early'),
      auth: { token: 'wrong-token' }
    };
    const state = normalizeGsiPayload(payload, GSI_AUTH_TOKEN);
    const advice = generateAdvice(state);

    expect(state.authOk).toBe(false);
    expect(advice.cards[0]?.id).toBe('setup-auth-token');
  });

  it('generates item and macro advice from the current match minute', () => {
    const state = normalizeGsiPayload(demoPayload('mid'));
    const advice = generateAdvice(state);

    expect(advice.mode).toBe('live');
    expect(advice.hero?.slug).toBe('slark');
    expect(advice.cards.some((card) => card.category === 'items')).toBe(true);
    expect(advice.cards.some((card) => card.category === 'macro')).toBe(true);
  });

  it('keeps the fixed MetaDota2 snapshot self-contained', () => {
    expect(metaSnapshot.heroes.length).toBeGreaterThanOrEqual(8);
    for (const hero of metaSnapshot.heroes) {
      expect(hero.sourceUrl).toMatch(/^https:\/\/metadota2\.com\/zh-cn\/hero\//);
      expect(hero.patchVersion).toBe(metaSnapshot.patchVersion);
    }
    for (const build of metaSnapshot.builds) {
      expect(build.coreItems.length).toBeGreaterThan(0);
      expect(build.skillOrder.length).toBeGreaterThan(0);
    }
  });
});
