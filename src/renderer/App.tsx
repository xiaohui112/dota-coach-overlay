import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  EyeOff,
  Maximize2,
  Minimize2,
  MousePointer2,
  Package,
  Play,
  Radio,
  Shield,
  Swords,
  Wrench,
  X,
  Zap
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AdviceCard, AdviceCategory, ElectronCoachApi, LiveSnapshot } from '../shared/types.js';
import { formatGameTime } from '../shared/text.js';
import { mockApi } from './mockApi.js';

const api: ElectronCoachApi = window.coach ?? mockApi;

const POINTER_INTERACTIVE_SELECTOR =
  'button, .toolbar, .titlebar, .no-drag, .passthrough-banner, .toast, a, input, textarea, select, [role="button"]';

function isPointerOverInteractive(clientX: number, clientY: number): boolean {
  const target = document.elementFromPoint(clientX, clientY);
  return Boolean(target?.closest(POINTER_INTERACTIVE_SELECTOR));
}

const categoryIcons: Record<AdviceCategory, typeof Package> = {
  setup: Wrench,
  items: Package,
  skills: Zap,
  draft: Swords,
  macro: Shield,
  lane: ChevronRight,
  system: Radio
};

function severityLabel(card: AdviceCard): string {
  if (card.severity === 'critical') return '高';
  if (card.severity === 'warning') return '中';
  return '稳';
}

function severityIcon(card: AdviceCard) {
  if (card.severity === 'critical') return <AlertTriangle size={14} />;
  if (card.severity === 'warning') return <AlertTriangle size={14} />;
  return <CheckCircle2 size={14} />;
}

function sourceShort(source: string): string {
  return source.replace(' 本地策略库', '').replace('GSI ', '');
}

function AdviceRow({ card, compact }: { card: AdviceCard; compact?: boolean }) {
  const Icon = categoryIcons[card.category];
  return (
    <article className={`advice-row ${card.severity} ${compact ? 'compact' : ''}`}>
      <div className="advice-head">
        <span className="category-icon">
          <Icon size={15} />
        </span>
        <h3>{card.title}</h3>
        <span className="severity-pill">
          {severityIcon(card)}
          {severityLabel(card)}
        </span>
      </div>
      <p>{card.body}</p>
      {!compact && <footer>{sourceShort(card.source)}</footer>}
    </article>
  );
}

function Toolbar({
  snapshot,
  onToggleExpanded,
  onToggleClickThrough,
  onInstall,
  onDemo,
  onQuit
}: {
  snapshot: LiveSnapshot;
  onToggleExpanded: () => void;
  onToggleClickThrough: () => void;
  onInstall: () => void;
  onDemo: (stage: 'early' | 'mid' | 'late') => void;
  onQuit: () => void;
}) {
  const expanded = snapshot.overlay.expanded;
  return (
    <header className="titlebar app-region-drag">
      <div className="brand">
        <span className={`live-dot ${snapshot.liveState?.authOk ? 'online' : 'waiting'}`} />
        <div>
          <strong>Dota Coach</strong>
          <span>{snapshot.liveState ? formatGameTime(snapshot.liveState.map.clockTime) : '等待 GSI'}</span>
        </div>
      </div>
      <div className="toolbar no-drag">
        <button type="button" title="安装 GSI" onClick={onInstall}>
          <Wrench size={15} />
        </button>
        <button type="button" title="模拟数据" onClick={() => onDemo('mid')}>
          <Play size={15} />
        </button>
        <button
          type="button"
          title={
            snapshot.overlay.clickThrough
              ? '点击穿透已开（悬停工具栏可点，或 Ctrl+Shift+F8）'
              : '开启点击穿透'
          }
          className={snapshot.overlay.clickThrough ? 'active' : ''}
          onClick={onToggleClickThrough}
        >
          <MousePointer2 size={15} />
        </button>
        <button type="button" title={expanded ? '迷你模式' : '展开'} onClick={onToggleExpanded}>
          {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
        <button type="button" className="quit" title="退出应用" onClick={onQuit}>
          <X size={15} />
        </button>
      </div>
    </header>
  );
}

function MiniView({ snapshot }: { snapshot: LiveSnapshot }) {
  const cards = snapshot.advice.cards.slice(0, 3);
  const hero = snapshot.advice.hero;
  const nextItem = snapshot.advice.build?.coreItems.find((item) => !snapshot.liveState?.items.some((owned) => owned.key === item.key));
  return (
    <main className="mini-view">
      <section className="hero-strip">
        <div>
          <span>{hero?.heroNameCn ?? snapshot.liveState?.hero.slug ?? '未识别英雄'}</span>
          <strong>{nextItem ? `下一件：${nextItem.nameCn}` : '观察局势'}</strong>
        </div>
        <div className="score">
          <span>{snapshot.liveState?.map.radiantScore ?? '-'}</span>
          <small>:</small>
          <span>{snapshot.liveState?.map.direScore ?? '-'}</span>
        </div>
      </section>
      <section className="mini-cards">
        {cards.map((card) => (
          <AdviceRow key={card.id} card={card} compact />
        ))}
      </section>
    </main>
  );
}

function DetailView({ snapshot }: { snapshot: LiveSnapshot }) {
  const { liveState, advice } = snapshot;
  const build = advice.build;
  const owned = new Set(liveState?.items.map((item) => item.key) ?? []);
  const grouped = useMemo(() => {
    const map = new Map<AdviceCategory, AdviceCard[]>();
    for (const card of advice.cards) {
      const list = map.get(card.category) ?? [];
      list.push(card);
      map.set(card.category, list);
    }
    return map;
  }, [advice.cards]);

  return (
    <main className="detail-view">
      <section className="match-panel">
        <div>
          <span>英雄</span>
          <strong>{advice.hero?.heroNameCn ?? liveState?.hero.slug ?? '未识别'}</strong>
        </div>
        <div>
          <span>等级</span>
          <strong>{liveState?.hero.level ?? '-'}</strong>
        </div>
        <div>
          <span>时间</span>
          <strong>{formatGameTime(liveState?.map.clockTime)}</strong>
        </div>
        <div>
          <span>比分</span>
          <strong>
            {liveState?.map.radiantScore ?? '-'}:{liveState?.map.direScore ?? '-'}
          </strong>
        </div>
      </section>

      <section className="scroll-area">
        {[...grouped.entries()].map(([category, cards]) => (
          <div className="advice-group" key={category}>
            {cards.map((card) => (
              <AdviceRow key={card.id} card={card} />
            ))}
          </div>
        ))}

        {build && (
          <section className="build-panel">
            <h2>
              <Package size={15} />
              出装节奏
            </h2>
            <div className="item-track">
              {build.coreItems.map((item) => (
                <div className={`item-chip ${owned.has(item.key) ? 'owned' : ''}`} key={item.key}>
                  <span>{item.timeMinute}m</span>
                  <strong>{item.nameCn}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        {build && (
          <section className="build-panel">
            <h2>
              <Zap size={15} />
              加点摘要
            </h2>
            <div className="skill-list">
              {build.skillOrder.map((step) => (
                <span key={`${step.level}-${step.abilityKey}`}>
                  {step.level}级 {step.abilityNameCn}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="build-panel">
          <h2>
            <Clock size={15} />
            状态
          </h2>
          <p className="status-text">
            {snapshot.installStatus.detected ? snapshot.installStatus.message : '未检测目标 Windows 目录时，安装向导会在目标机器上重新判断。'}
          </p>
        </section>
      </section>
    </main>
  );
}

export function App() {
  const [snapshot, setSnapshot] = useState<LiveSnapshot | null>(null);
  const [toast, setToast] = useState<string>('');

  const refresh = useCallback(async () => {
    setSnapshot(await api.getLiveSnapshot());
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 1000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!snapshot?.overlay.clickThrough) {
      void api.setPointerInteractive(false);
      return;
    }

    let lastInteractive = false;
    const report = (interactive: boolean) => {
      if (interactive === lastInteractive) return;
      lastInteractive = interactive;
      void api.setPointerInteractive(interactive);
    };

    const onPointerMove = (event: MouseEvent) => {
      report(isPointerOverInteractive(event.clientX, event.clientY));
    };

    const onPointerLeave = () => report(false);

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseleave', onPointerLeave);
    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseleave', onPointerLeave);
      report(false);
    };
  }, [snapshot?.overlay.clickThrough]);

  const setOverlayFromAction = async (action: Promise<unknown>) => {
    await action;
    await refresh();
  };

  const install = async () => {
    const result = await api.installGsi();
    setToast(result.message);
    await refresh();
  };

  const demo = async (stage: 'early' | 'mid' | 'late') => {
    await api.sendDemoPayload(stage);
    setToast(`已载入 ${stage} 模拟局势`);
    await refresh();
  };

  if (!snapshot) {
    return (
      <div className="shell loading">
        <Radio size={18} />
        <span>启动中</span>
      </div>
    );
  }

  return (
    <div className={`shell ${snapshot.overlay.expanded ? 'expanded' : 'mini'} ${snapshot.overlay.clickThrough ? 'passthrough' : ''}`}>
      <Toolbar
        snapshot={snapshot}
        onToggleExpanded={() => void setOverlayFromAction(api.toggleExpanded())}
        onToggleClickThrough={() => void setOverlayFromAction(api.toggleClickThrough())}
        onInstall={() => void install()}
        onDemo={(stage) => void demo(stage)}
        onQuit={() => void api.quitApp()}
      />
      {snapshot.overlay.expanded ? <DetailView snapshot={snapshot} /> : <MiniView snapshot={snapshot} />}
      {snapshot.overlay.clickThrough && (
        <div className="passthrough-banner no-drag">
          <EyeOff size={14} />
          点击穿透 · 悬停顶部栏操作 · Ctrl+Shift+F8 关闭
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
