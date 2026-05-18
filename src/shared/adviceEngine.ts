import { findHeroBuild, findHeroMeta } from '../data/metaSnapshot.js';
import type { AdviceCard, AdviceResponse, HeroBuild, HeroMeta, LiveAbilityState, LiveGameState, TimedItem } from './types.js';
import { formatGameTime, scoreLead } from './text.js';

function card(input: Omit<AdviceCard, 'createdAt'>): AdviceCard {
  return {
    ...input,
    createdAt: new Date().toISOString()
  };
}

function gameMinute(state: LiveGameState): number {
  const seconds = state.map.clockTime ?? state.map.gameTime ?? 0;
  return Math.max(0, Math.floor(seconds / 60));
}

function hasItem(state: LiveGameState, itemKey: string): boolean {
  return state.items.some((item) => item.key === itemKey);
}

function nextMissingCoreItem(state: LiveGameState, build: HeroBuild): TimedItem | undefined {
  return build.coreItems.find((item) => !hasItem(state, item.key));
}

function generateSetupAdvice(state: LiveGameState | null): AdviceCard[] {
  if (!state) {
    return [
      card({
        id: 'setup-waiting-gsi',
        category: 'setup',
        severity: 'warning',
        priority: 100,
        title: '等待 Dota 2 实时数据',
        body: '进入比赛后，GSI 会把本局状态发送到本地服务。当前可先检查启动项和 GSI 配置。',
        source: '本地 GSI 服务'
      })
    ];
  }

  if (!state.authOk) {
    return [
      card({
        id: 'setup-auth-token',
        category: 'setup',
        severity: 'critical',
        priority: 120,
        title: 'GSI token 不匹配',
        body: '已经收到 Dota 2 数据，但 auth token 与本地配置不一致。请重新运行安装向导生成 cfg。',
        source: '本地 GSI 校验'
      })
    ];
  }

  return [];
}

function generateItemAdvice(state: LiveGameState, build?: HeroBuild): AdviceCard[] {
  if (!build) {
    return [
      card({
        id: 'items-generic',
        category: 'items',
        severity: 'info',
        priority: 30,
        title: '暂无该英雄深度出装',
        body: '当前英雄不在首批内置策略库里，先按局势选择保命、输出或团队装。',
        source: '通用规则'
      })
    ];
  }

  const minute = gameMinute(state);
  const next = nextMissingCoreItem(state, build);
  if (!next) {
    return [
      card({
        id: 'items-core-complete',
        category: 'items',
        severity: 'info',
        priority: 56,
        title: '核心装备已基本成型',
        body: `后续根据局势从 ${build.situationalItems.map((item) => item.nameCn).join('、')} 中选择。`,
        source: `${build.patchVersion} 本地策略库`
      })
    ];
  }

  const delay = minute - next.timeMinute;
  const severity = delay >= 5 ? 'critical' : delay >= 2 ? 'warning' : 'info';
  const timingText = delay >= 2 ? `已经比参考时间慢约 ${delay} 分钟` : `参考时间约 ${next.timeMinute} 分钟`;
  return [
    card({
      id: `items-next-${next.key}`,
      category: 'items',
      severity,
      priority: delay >= 5 ? 94 : delay >= 2 ? 78 : 62,
      title: `下一件优先：${next.nameCn}`,
      body: `${timingText}。当前 ${formatGameTime(state.map.clockTime)}，先围绕这件装备安排刷钱/参团节奏。`,
      source: `${build.patchVersion} 本地策略库`
    })
  ];
}

function findAbility(abilities: LiveAbilityState[], expectedKey: string): LiveAbilityState | undefined {
  return abilities.find((ability) => ability.key === expectedKey || ability.key.endsWith(expectedKey));
}

function generateSkillAdvice(state: LiveGameState, build?: HeroBuild): AdviceCard[] {
  if (!build || !state.hero.level) return [];
  const expectedSteps = build.skillOrder.filter((step) => step.level <= (state.hero.level ?? 0));
  const missing = expectedSteps.find((step) => {
    const ability = findAbility(state.abilities, step.abilityKey);
    return !ability || ability.level === 0;
  });

  if (!missing) {
    const next = build.skillOrder.find((step) => step.level > (state.hero.level ?? 0));
    return next
      ? [
          card({
            id: `skills-next-${next.level}-${next.abilityKey}`,
            category: 'skills',
            severity: 'info',
            priority: 45,
            title: `下个关键加点：${next.abilityNameCn}`,
            body: `${next.level} 级建议补 ${next.abilityNameCn}，保持当前技能节奏。`,
            source: `${build.patchVersion} 本地策略库`
          })
        ]
      : [];
  }

  return [
    card({
      id: `skills-missing-${missing.abilityKey}`,
      category: 'skills',
      severity: 'warning',
      priority: 70,
      title: `检查加点：${missing.abilityNameCn}`,
      body: `参考构筑在 ${missing.level} 级前需要 ${missing.abilityNameCn}。如果你是针对局势变招，可以忽略这条。`,
      source: `${build.patchVersion} 本地策略库`
    })
  ];
}

function generateMacroAdvice(state: LiveGameState, hero?: HeroMeta, build?: HeroBuild): AdviceCard[] {
  const minute = gameMinute(state);
  const lead = scoreLead(state.map.radiantScore, state.map.direScore);
  const cards: AdviceCard[] = [];

  if (state.hero.alive === false) {
    cards.push(
      card({
        id: 'macro-dead-timer',
        category: 'macro',
        severity: 'warning',
        priority: 88,
        title: '复活前先规划下一波',
        body: `剩余复活 ${state.hero.respawnSeconds ?? '?'} 秒。先看兵线、盾点和队友位置，避免复活后直接走进无视野区域。`,
        source: 'GSI 实时状态'
      })
    );
  }

  if (minute < 10) {
    cards.push(
      card({
        id: 'macro-laning',
        category: 'lane',
        severity: 'info',
        priority: 52,
        title: '对线期目标',
        body: hero ? `${hero.heroNameCn} 当前优先保证等级和第一件节奏装，不要为了小击杀亏两波线。` : '优先处理兵线、补给和河道资源。',
        source: hero ? `${hero.patchVersion} 本地策略库` : '通用规则'
      })
    );
  } else if (minute < 22) {
    cards.push(
      card({
        id: 'macro-midgame-map',
        category: 'macro',
        severity: 'info',
        priority: 64,
        title: '中期控图节奏',
        body: build?.playstyleCn[1] ?? '围绕外塔、河道视野和关键装备时间点行动，少接无收益团。',
        source: build ? `${build.patchVersion} 本地策略库` : '通用规则'
      })
    );
  } else {
    cards.push(
      card({
        id: 'macro-lategame-objective',
        category: 'macro',
        severity: 'info',
        priority: 66,
        title: '后期先处理目标',
        body: '先看 Roshan、买活和兵线位置，再决定是否逼高。没有视野和关键技能时，不要从低地硬走。',
        source: '通用规则'
      })
    );
  }

  if (Math.abs(lead) >= 8) {
    cards.push(
      card({
        id: 'macro-score-lead',
        category: 'macro',
        severity: lead > 0 ? 'info' : 'warning',
        priority: 58,
        title: lead > 0 ? '比分领先，转目标' : '比分落后，收缩资源',
        body: lead > 0 ? '领先时不要只追人，优先把优势转成塔、盾和深视野。' : '落后时减少河道无视野接触，先守塔清线，等关键装备或买活。',
        source: 'GSI 比分状态'
      })
    );
  }

  return cards;
}

function generateDraftAdvice(state: LiveGameState, hero?: HeroMeta): AdviceCard[] {
  if (!hero) return [];
  const visibleDraft = state.draftHeroSlugs.length;
  return [
    card({
      id: `draft-${hero.slug}`,
      category: 'draft',
      severity: 'info',
      priority: 44,
      title: `${hero.heroNameCn} 本局定位`,
      body: `${hero.role}。${hero.reasonsCn[0]}；注意 ${hero.countersCn[0]}。${visibleDraft ? `当前已识别 ${visibleDraft} 个选人。` : '当前 GSI 未提供完整 BP 信息。'}`,
      source: `${hero.patchVersion} 本地策略库`
    })
  ];
}

export function generateAdvice(state: LiveGameState | null): AdviceResponse {
  const setupCards = generateSetupAdvice(state);
  if (!state || setupCards.length) {
    return {
      generatedAt: new Date().toISOString(),
      mode: 'waiting',
      cards: setupCards
    };
  }

  const hero = findHeroMeta(state.hero.slug);
  const build = findHeroBuild(state.hero.slug);
  const cards = [
    ...generateItemAdvice(state, build),
    ...generateSkillAdvice(state, build),
    ...generateMacroAdvice(state, hero, build),
    ...generateDraftAdvice(state, hero)
  ].sort((a, b) => b.priority - a.priority);

  return {
    generatedAt: new Date().toISOString(),
    mode: 'live',
    hero,
    build,
    cards
  };
}
