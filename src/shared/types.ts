export type AdviceCategory = 'setup' | 'items' | 'skills' | 'draft' | 'macro' | 'lane' | 'system';

export type AdviceSeverity = 'info' | 'warning' | 'critical';

export interface TimedItem {
  key: string;
  name: string;
  nameCn: string;
  timeMinute: number;
  image?: string;
}

export interface SkillStep {
  level: number;
  abilityKey: string;
  abilityName: string;
  abilityNameCn: string;
}

export interface TalentChoice {
  level: number;
  choice: 'left' | 'right';
  descriptionCn: string;
}

export interface HeroMeta {
  slug: string;
  gsiName: string;
  heroName: string;
  heroNameCn: string;
  role: string;
  primaryPosition: 'carry' | 'mid' | 'offlane' | 'support' | 'hard-support';
  winRate: number;
  matches: number;
  reasonsCn: string[];
  countersCn: string[];
  sourceUrl: string;
  patchVersion: string;
  fetchedAt: string;
}

export interface HeroBuild {
  slug: string;
  position: HeroMeta['primaryPosition'];
  startingItems: TimedItem[];
  coreItems: TimedItem[];
  situationalItems: TimedItem[];
  skillOrder: SkillStep[];
  talents: TalentChoice[];
  playstyleCn: string[];
  sourceUrl: string;
  patchVersion: string;
  fetchedAt: string;
}

export interface MetaSnapshot {
  source: string;
  patchVersion: string;
  fetchedAt: string;
  heroes: HeroMeta[];
  builds: HeroBuild[];
}

export interface LivePlayerState {
  activity?: string;
  teamName?: string;
  gold?: number;
  goldReliable?: number;
  goldUnreliable?: number;
  kills?: number;
  deaths?: number;
  assists?: number;
  gpm?: number;
  xpm?: number;
}

export interface LiveHeroState {
  id?: number;
  rawName?: string;
  slug?: string;
  displayName?: string;
  level?: number;
  alive?: boolean;
  respawnSeconds?: number;
  health?: number;
  maxHealth?: number;
  mana?: number;
  maxMana?: number;
}

export interface LiveAbilityState {
  slot: string;
  key: string;
  rawName: string;
  level: number;
  cooldown?: number;
  canCast?: boolean;
  passive?: boolean;
}

export interface LiveItemState {
  slot: string;
  key: string;
  rawName: string;
  displayName: string;
  cooldown?: number;
  charges?: number;
  canCast?: boolean;
}

export interface LiveMapState {
  clockTime?: number;
  gameTime?: number;
  gameState?: string;
  paused?: boolean;
  radiantScore?: number;
  direScore?: number;
  winTeam?: string;
  roshanState?: string;
}

export interface LiveGameState {
  receivedAt: string;
  providerName?: string;
  authOk: boolean;
  map: LiveMapState;
  player: LivePlayerState;
  hero: LiveHeroState;
  abilities: LiveAbilityState[];
  items: LiveItemState[];
  draftHeroSlugs: string[];
  events: string[];
  rawSummary: {
    hasDraft: boolean;
    hasBuildings: boolean;
    hasRoshan: boolean;
  };
}

export interface AdviceCard {
  id: string;
  category: AdviceCategory;
  severity: AdviceSeverity;
  priority: number;
  title: string;
  body: string;
  source: string;
  createdAt: string;
  expiresAt?: string;
}

export interface AdviceResponse {
  generatedAt: string;
  mode: 'waiting' | 'live' | 'offline-simulated';
  hero?: HeroMeta;
  build?: HeroBuild;
  cards: AdviceCard[];
}

export interface OverlayState {
  expanded: boolean;
  clickThrough: boolean;
  hidden: boolean;
  alwaysOnTop: boolean;
  bounds?: WindowBounds;
}

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DisplayWorkArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type RuntimePlatform =
  | 'aix'
  | 'android'
  | 'darwin'
  | 'freebsd'
  | 'haiku'
  | 'linux'
  | 'openbsd'
  | 'sunos'
  | 'win32'
  | 'cygwin'
  | 'netbsd'
  | string;

export interface GsiInstallStatus {
  platform: RuntimePlatform;
  defaultDotaPath: string;
  detected: boolean;
  configPath?: string;
  launchOption: string;
  message: string;
}

export interface GsiInstallResult extends GsiInstallStatus {
  installed: boolean;
}

export interface LiveSnapshot {
  liveState: LiveGameState | null;
  advice: AdviceResponse;
  overlay: OverlayState;
  installStatus: GsiInstallStatus;
}

export interface ElectronCoachApi {
  getLiveSnapshot(): Promise<LiveSnapshot>;
  installGsi(dotaPath?: string): Promise<GsiInstallResult>;
  toggleExpanded(): Promise<OverlayState>;
  setExpanded(expanded: boolean): Promise<OverlayState>;
  toggleClickThrough(): Promise<OverlayState>;
  /** 穿透模式下由渲染进程上报鼠标是否在可交互区域 */
  setPointerInteractive(interactive: boolean): Promise<void>;
  hideOverlay(): Promise<OverlayState>;
  showOverlay(): Promise<OverlayState>;
  quitApp(): Promise<void>;
  sendDemoPayload(stage?: 'early' | 'mid' | 'late'): Promise<LiveSnapshot>;
}
