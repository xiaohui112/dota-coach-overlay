import type { HeroBuild, HeroMeta, MetaSnapshot, TimedItem } from '../shared/types.js';

const fetchedAt = '2026-05-18T00:00:00.000Z';
const patchVersion = '7.41c';
const source = 'https://metadota2.com/zh-cn';

function item(key: string, name: string, nameCn: string, timeMinute: number): TimedItem {
  return {
    key,
    name,
    nameCn,
    timeMinute,
    image: `https://dota2protracker.com/static/items/${key}.png`
  };
}

export const heroMetas: HeroMeta[] = [
  {
    slug: 'alchemist',
    gsiName: 'npc_dota_hero_alchemist',
    heroName: 'Alchemist',
    heroNameCn: '炼金术士',
    role: '核心 / 节奏经济',
    primaryPosition: 'carry',
    winRate: 54.2,
    matches: 18200,
    reasonsCn: ['当前版本中期经济爆发快', '强依赖关键装备时间点', '适合用领先经济连续压塔和控盾'],
    countersCn: ['怕强驱散和连续打断刷钱节奏', '敌方高爆发阵容成型后容错降低'],
    sourceUrl: `${source}/hero/alchemist`,
    patchVersion,
    fetchedAt
  },
  {
    slug: 'slark',
    gsiName: 'npc_dota_hero_slark',
    heroName: 'Slark',
    heroNameCn: '斯拉克',
    role: '核心 / 视野压制',
    primaryPosition: 'carry',
    winRate: 53.6,
    matches: 16500,
    reasonsCn: ['中期抓边和反眼能力强', '对近战核心压迫力高', '适合围绕夜晚视野滚雪球'],
    countersCn: ['怕沉默、瞬控和爆发链', '对线被压时需要避免硬接早期团'],
    sourceUrl: `${source}/hero/slark`,
    patchVersion,
    fetchedAt
  },
  {
    slug: 'juggernaut',
    gsiName: 'npc_dota_hero_juggernaut',
    heroName: 'Juggernaut',
    heroNameCn: '主宰',
    role: '核心 / 稳定推进',
    primaryPosition: 'carry',
    winRate: 52.9,
    matches: 20100,
    reasonsCn: ['对线自保和治疗推进稳定', '关键装备后打盾和推塔节奏清晰', '适合惩罚控制不足的阵容'],
    countersCn: ['怕缴械和高护甲肉核', '大招被幻象或召唤物分摊时输出不稳定'],
    sourceUrl: `${source}/hero/juggernaut`,
    patchVersion,
    fetchedAt
  },
  {
    slug: 'drow-ranger',
    gsiName: 'npc_dota_hero_drow_ranger',
    heroName: 'Drow Ranger',
    heroNameCn: '卓尔游侠',
    role: '核心 / 远程物理',
    primaryPosition: 'carry',
    winRate: 52.4,
    matches: 14300,
    reasonsCn: ['远程推进和高地防守强', '成型后物理输出稳定', '适合有前排和控制保护的阵容'],
    countersCn: ['怕贴脸和先手跳后排', '前中期需要避免无视野单走'],
    sourceUrl: `${source}/hero/drow-ranger`,
    patchVersion,
    fetchedAt
  },
  {
    slug: 'faceless-void',
    gsiName: 'npc_dota_hero_faceless_void',
    heroName: 'Faceless Void',
    heroNameCn: '虚空假面',
    role: '核心 / 团战大招',
    primaryPosition: 'carry',
    winRate: 52.1,
    matches: 13800,
    reasonsCn: ['大招决定团战上限', '后期能力强', '适合搭配远程爆发和持续输出'],
    countersCn: ['怕前期被压缩经济', '大招空窗期不宜主动开大规模团'],
    sourceUrl: `${source}/hero/faceless-void`,
    patchVersion,
    fetchedAt
  },
  {
    slug: 'queen-of-pain',
    gsiName: 'npc_dota_hero_queenofpain',
    heroName: 'Queen of Pain',
    heroNameCn: '痛苦女王',
    role: '中单 / 爆发节奏',
    primaryPosition: 'mid',
    winRate: 52.8,
    matches: 11900,
    reasonsCn: ['中路压制和边路支援快', '法系装备成型后爆发高', '适合打断敌方刷钱节奏'],
    countersCn: ['怕沉默和瞬控', '后期需要靠切入时机避免先手被秒'],
    sourceUrl: `${source}/hero/queen-of-pain`,
    patchVersion,
    fetchedAt
  },
  {
    slug: 'rubick',
    gsiName: 'npc_dota_hero_rubick',
    heroName: 'Rubick',
    heroNameCn: '拉比克',
    role: '辅助 / 反手控制',
    primaryPosition: 'support',
    winRate: 51.8,
    matches: 17100,
    reasonsCn: ['强反手和技能偷取上限高', '中期小件提升明显', '适合针对敌方关键大招'],
    countersCn: ['身板脆，怕被先手', '需要视野和站位保证偷技能价值'],
    sourceUrl: `${source}/hero/rubick`,
    patchVersion,
    fetchedAt
  },
  {
    slug: 'phoenix',
    gsiName: 'npc_dota_hero_phoenix',
    heroName: 'Phoenix',
    heroNameCn: '凤凰',
    role: '辅助 / 团战反打',
    primaryPosition: 'support',
    winRate: 52.0,
    matches: 9800,
    reasonsCn: ['团战反手能力强', '克制近战核心扎堆输出', '守塔和阵地战表现稳定'],
    countersCn: ['怕高攻速拆蛋和沉默', '大招前需要确认敌方关键控制位置'],
    sourceUrl: `${source}/hero/phoenix`,
    patchVersion,
    fetchedAt
  }
];

export const heroBuilds: HeroBuild[] = [
  {
    slug: 'alchemist',
    position: 'carry',
    startingItems: [item('quelling_blade', 'Quelling Blade', '压制之刃', 0), item('bracer', 'Bracer', '护腕', 2)],
    coreItems: [
      item('phase_boots', 'Phase Boots', '相位鞋', 7),
      item('hand_of_midas', 'Hand of Midas', '迈达斯之手', 12),
      item('radiance', 'Radiance', '辉耀', 17),
      item('blink', 'Blink Dagger', '闪烁匕首', 21),
      item('black_king_bar', 'Black King Bar', '黑皇杖', 28),
      item('shivas_guard', "Shiva's Guard", '希瓦的守护', 32),
      item('octarine_core', 'Octarine Core', '玲珑心', 35)
    ],
    situationalItems: [item('ultimate_scepter', "Aghanim's Scepter", '阿哈利姆神杖', 38), item('overwhelming_blink', 'Overwhelming Blink', '盛势闪光', 44)],
    skillOrder: [
      { level: 1, abilityKey: 'alchemist_acid_spray', abilityName: 'Acid Spray', abilityNameCn: '酸性喷雾' },
      { level: 2, abilityKey: 'alchemist_unstable_concoction', abilityName: 'Unstable Concoction', abilityNameCn: '不稳定化合物' },
      { level: 3, abilityKey: 'alchemist_acid_spray', abilityName: 'Acid Spray', abilityNameCn: '酸性喷雾' },
      { level: 4, abilityKey: 'alchemist_goblins_greed', abilityName: "Greevil's Greed", abilityNameCn: '贪魔的贪婪' },
      { level: 6, abilityKey: 'alchemist_chemical_rage', abilityName: 'Chemical Rage', abilityNameCn: '化学狂暴' }
    ],
    talents: [{ level: 10, choice: 'right', descriptionCn: '优先选择提升刷钱或生存的天赋' }],
    playstyleCn: ['前 12 分钟优先保证补刀和经济道具', '辉耀后带队推塔控图', 'BKB 前不要硬吃多控制团'],
    sourceUrl: `${source}/hero/alchemist`,
    patchVersion,
    fetchedAt
  },
  {
    slug: 'slark',
    position: 'carry',
    startingItems: [item('wraith_band', 'Wraith Band', '系带', 2), item('magic_wand', 'Magic Wand', '魔杖', 5)],
    coreItems: [
      item('power_treads', 'Power Treads', '动力鞋', 8),
      item('echo_sabre', 'Echo Sabre', '回音战刃', 13),
      item('diffusal_blade', 'Diffusal Blade', '净魂之刃', 17),
      item('black_king_bar', 'Black King Bar', '黑皇杖', 24),
      item('ultimate_scepter', "Aghanim's Scepter", '阿哈利姆神杖', 28),
      item('skadi', 'Eye of Skadi', '斯嘉蒂之眼', 35)
    ],
    situationalItems: [item('mage_slayer', 'Mage Slayer', '法师克星', 16), item('butterfly', 'Butterfly', '蝴蝶', 39)],
    skillOrder: [
      { level: 1, abilityKey: 'slark_dark_pact', abilityName: 'Dark Pact', abilityNameCn: '黑暗契约' },
      { level: 2, abilityKey: 'slark_pounce', abilityName: 'Pounce', abilityNameCn: '突袭' },
      { level: 3, abilityKey: 'slark_dark_pact', abilityName: 'Dark Pact', abilityNameCn: '黑暗契约' },
      { level: 4, abilityKey: 'slark_essence_shift', abilityName: 'Essence Shift', abilityNameCn: '能量转移' },
      { level: 6, abilityKey: 'slark_shadow_dance', abilityName: 'Shadow Dance', abilityNameCn: '暗影之舞' }
    ],
    talents: [{ level: 10, choice: 'left', descriptionCn: '根据对线压力选择生存或输出天赋' }],
    playstyleCn: ['前期避免无视野硬拼，先保证等级和第一件节奏装', '中期围绕夜晚和反眼压缩敌方活动区域', 'BKB 后找后排，打完一套要拉扯等技能'],
    sourceUrl: `${source}/hero/slark`,
    patchVersion,
    fetchedAt
  },
  {
    slug: 'juggernaut',
    position: 'carry',
    startingItems: [item('wraith_band', 'Wraith Band', '系带', 2), item('magic_wand', 'Magic Wand', '魔杖', 5)],
    coreItems: [
      item('phase_boots', 'Phase Boots', '相位鞋', 7),
      item('bfury', 'Battle Fury', '狂战斧', 14),
      item('manta', 'Manta Style', '幻影斧', 22),
      item('aghanims_shard', "Aghanim's Shard", '阿哈利姆魔晶', 23),
      item('butterfly', 'Butterfly', '蝴蝶', 32),
      item('abyssal_blade', 'Abyssal Blade', '深渊之刃', 39)
    ],
    situationalItems: [item('black_king_bar', 'Black King Bar', '黑皇杖', 28), item('skadi', 'Eye of Skadi', '斯嘉蒂之眼', 36)],
    skillOrder: [
      { level: 1, abilityKey: 'juggernaut_blade_fury', abilityName: 'Blade Fury', abilityNameCn: '剑刃风暴' },
      { level: 2, abilityKey: 'juggernaut_blade_dance', abilityName: 'Blade Dance', abilityNameCn: '剑舞' },
      { level: 3, abilityKey: 'juggernaut_blade_fury', abilityName: 'Blade Fury', abilityNameCn: '剑刃风暴' },
      { level: 4, abilityKey: 'juggernaut_healing_ward', abilityName: 'Healing Ward', abilityNameCn: '治疗守卫' },
      { level: 6, abilityKey: 'juggernaut_omni_slash', abilityName: 'Omnislash', abilityNameCn: '无敌斩' }
    ],
    talents: [{ level: 10, choice: 'right', descriptionCn: '优先保证刷钱和推线节奏' }],
    playstyleCn: ['狂战前不要连续参战导致经济断档', '有治疗守卫时主动逼塔和打盾', '大招尽量等幻象和召唤物被清掉后再用'],
    sourceUrl: `${source}/hero/juggernaut`,
    patchVersion,
    fetchedAt
  },
  {
    slug: 'drow-ranger',
    position: 'carry',
    startingItems: [item('wraith_band', 'Wraith Band', '系带', 2), item('falcon_blade', 'Falcon Blade', '隼刃', 6)],
    coreItems: [
      item('power_treads', 'Power Treads', '动力鞋', 7),
      item('dragon_lance', 'Dragon Lance', '魔龙枪', 14),
      item('yasha', 'Yasha', '夜叉', 16),
      item('manta', 'Manta Style', '幻影斧', 24),
      item('hurricane_pike', 'Hurricane Pike', '飓风长戟', 24),
      item('aghanims_shard', "Aghanim's Shard", '阿哈利姆魔晶', 33),
      item('butterfly', 'Butterfly', '蝴蝶', 34),
      item('black_king_bar', 'Black King Bar', '黑皇杖', 36)
    ],
    situationalItems: [item('greater_crit', 'Daedalus', '代达罗斯之殇', 41), item('silver_edge', 'Silver Edge', '白银之锋', 32)],
    skillOrder: [
      { level: 1, abilityKey: 'drow_ranger_frost_arrows', abilityName: 'Frost Arrows', abilityNameCn: '霜冻之箭' },
      { level: 2, abilityKey: 'drow_ranger_wave_of_silence', abilityName: 'Gust', abilityNameCn: '狂风' },
      { level: 3, abilityKey: 'drow_ranger_multishot', abilityName: 'Multishot', abilityNameCn: '数箭齐发' },
      { level: 6, abilityKey: 'drow_ranger_marksmanship', abilityName: 'Marksmanship', abilityNameCn: '射手天赋' }
    ],
    talents: [{ level: 10, choice: 'left', descriptionCn: '优先保证输出距离和生存' }],
    playstyleCn: ['尽量站在前排身后输出', '中期用分身和长戟处理贴脸', '无视野不要单独带深线'],
    sourceUrl: `${source}/hero/drow-ranger`,
    patchVersion,
    fetchedAt
  },
  {
    slug: 'faceless-void',
    position: 'carry',
    startingItems: [item('wraith_band', 'Wraith Band', '系带', 2), item('magic_wand', 'Magic Wand', '魔杖', 5)],
    coreItems: [
      item('power_treads', 'Power Treads', '动力鞋', 8),
      item('bfury', 'Battle Fury', '狂战斧', 13),
      item('manta', 'Manta Style', '幻影斧', 20),
      item('ultimate_scepter', "Aghanim's Scepter", '阿哈利姆神杖', 26),
      item('monkey_king_bar', 'Monkey King Bar', '金箍棒', 30),
      item('sphere', "Linken's Sphere", '林肯法球', 33),
      item('butterfly', 'Butterfly', '蝴蝶', 37)
    ],
    situationalItems: [item('black_king_bar', 'Black King Bar', '黑皇杖', 29), item('refresher', 'Refresher Orb', '刷新球', 45)],
    skillOrder: [
      { level: 1, abilityKey: 'faceless_void_time_walk', abilityName: 'Time Walk', abilityNameCn: '时间漫游' },
      { level: 2, abilityKey: 'faceless_void_time_lock', abilityName: 'Time Lock', abilityNameCn: '时间锁定' },
      { level: 3, abilityKey: 'faceless_void_time_dilation', abilityName: 'Time Dilation', abilityNameCn: '时间膨胀' },
      { level: 6, abilityKey: 'faceless_void_chronosphere', abilityName: 'Chronosphere', abilityNameCn: '时间结界' }
    ],
    talents: [{ level: 10, choice: 'right', descriptionCn: '优先提升刷钱和大招团战收益' }],
    playstyleCn: ['大招空窗期以刷钱和带线为主', '开团前确认队友能跟伤害', '后期以视野和买活决定团战位置'],
    sourceUrl: `${source}/hero/faceless-void`,
    patchVersion,
    fetchedAt
  },
  {
    slug: 'queen-of-pain',
    position: 'mid',
    startingItems: [item('bottle', 'Bottle', '魔瓶', 2), item('null_talisman', 'Null Talisman', '空灵挂件', 4)],
    coreItems: [
      item('power_treads', 'Power Treads', '动力鞋', 10),
      item('kaya', 'Kaya', '慧光', 14),
      item('veil_of_discord', 'Veil of Discord', '纷争面纱', 19),
      item('ultimate_scepter', "Aghanim's Scepter", '阿哈利姆神杖', 20),
      item('kaya_and_sange', 'Kaya and Sange', '散慧对剑', 25),
      item('black_king_bar', 'Black King Bar', '黑皇杖', 30)
    ],
    situationalItems: [item('shivas_guard', "Shiva's Guard", '希瓦的守护', 34), item('octarine_core', 'Octarine Core', '玲珑心', 38)],
    skillOrder: [
      { level: 1, abilityKey: 'queenofpain_shadow_strike', abilityName: 'Shadow Strike', abilityNameCn: '暗影突袭' },
      { level: 2, abilityKey: 'queenofpain_blink', abilityName: 'Blink', abilityNameCn: '闪烁' },
      { level: 3, abilityKey: 'queenofpain_scream_of_pain', abilityName: 'Scream of Pain', abilityNameCn: '痛苦尖叫' },
      { level: 6, abilityKey: 'queenofpain_sonic_wave', abilityName: 'Sonic Wave', abilityNameCn: '超声冲击波' }
    ],
    talents: [{ level: 10, choice: 'left', descriptionCn: '顺风补伤害，逆风补生存' }],
    playstyleCn: ['6 级后优先控符支援边路', '中期找落单目标，不要先手跳进多人控制', 'BKB 前团战以侧翼切入为主'],
    sourceUrl: `${source}/hero/queen-of-pain`,
    patchVersion,
    fetchedAt
  },
  {
    slug: 'rubick',
    position: 'support',
    startingItems: [item('magic_wand', 'Magic Wand', '魔杖', 5), item('boots', 'Boots of Speed', '速度之靴', 8)],
    coreItems: [
      item('essence_distiller', 'Essence Distiller', '精华蒸馏器', 14),
      item('aghanims_shard', "Aghanim's Shard", '阿哈利姆魔晶', 20),
      item('aether_lens', 'Aether Lens', '以太之镜', 24),
      item('blink', 'Blink Dagger', '闪烁匕首', 28),
      item('ultimate_scepter', "Aghanim's Scepter", '阿哈利姆神杖', 37)
    ],
    situationalItems: [item('force_staff', 'Force Staff', '原力法杖', 18), item('glimmer_cape', 'Glimmer Cape', '微光披风', 18)],
    skillOrder: [
      { level: 1, abilityKey: 'rubick_telekinesis', abilityName: 'Telekinesis', abilityNameCn: '隔空取物' },
      { level: 2, abilityKey: 'rubick_fade_bolt', abilityName: 'Fade Bolt', abilityNameCn: '弱化能流' },
      { level: 3, abilityKey: 'rubick_fade_bolt', abilityName: 'Fade Bolt', abilityNameCn: '弱化能流' },
      { level: 6, abilityKey: 'rubick_spell_steal', abilityName: 'Spell Steal', abilityNameCn: '技能窃取' }
    ],
    talents: [{ level: 10, choice: 'right', descriptionCn: '优先提升施法距离和生存空间' }],
    playstyleCn: ['站位优先活下来，等敌方关键技能露出后再偷', '中期用跳刀或以太镜放大反手距离', '团战不要为了偷技能先暴露在正面'],
    sourceUrl: `${source}/hero/rubick`,
    patchVersion,
    fetchedAt
  },
  {
    slug: 'phoenix',
    position: 'support',
    startingItems: [item('magic_wand', 'Magic Wand', '魔杖', 5), item('tranquil_boots', 'Tranquil Boots', '静谧之鞋', 8)],
    coreItems: [
      item('urn_of_shadows', 'Urn of Shadows', '影之灵龛', 9),
      item('spirit_vessel', 'Spirit Vessel', '魂之灵瓮', 16),
      item('shivas_guard', "Shiva's Guard", '希瓦的守护', 31),
      item('refresher', 'Refresher Orb', '刷新球', 42)
    ],
    situationalItems: [item('lotus_orb', 'Lotus Orb', '清莲宝珠', 27), item('heavens_halberd', "Heaven's Halberd", '天堂之戟', 25)],
    skillOrder: [
      { level: 1, abilityKey: 'phoenix_icarus_dive', abilityName: 'Icarus Dive', abilityNameCn: '凤凰冲击' },
      { level: 2, abilityKey: 'phoenix_fire_spirits', abilityName: 'Fire Spirits', abilityNameCn: '烈火精灵' },
      { level: 3, abilityKey: 'phoenix_fire_spirits', abilityName: 'Fire Spirits', abilityNameCn: '烈火精灵' },
      { level: 6, abilityKey: 'phoenix_supernova', abilityName: 'Supernova', abilityNameCn: '超新星' }
    ],
    talents: [{ level: 10, choice: 'left', descriptionCn: '优先补团战生存和技能覆盖' }],
    playstyleCn: ['等敌方高攻速技能交掉后再开蛋', '围绕塔和狭窄地形打阵地战', '灵瓮节奏能明显提升击杀和续航压制'],
    sourceUrl: `${source}/hero/phoenix`,
    patchVersion,
    fetchedAt
  }
];

export const metaSnapshot: MetaSnapshot = {
  source,
  patchVersion,
  fetchedAt,
  heroes: heroMetas,
  builds: heroBuilds
};

export function findHeroMeta(slug?: string): HeroMeta | undefined {
  return heroMetas.find((hero) => hero.slug === slug);
}

export function findHeroBuild(slug?: string): HeroBuild | undefined {
  return heroBuilds.find((build) => build.slug === slug);
}
