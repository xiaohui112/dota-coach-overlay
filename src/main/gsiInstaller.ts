import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { GSI_AUTH_TOKEN, GSI_ENDPOINT } from '../shared/gsi.js';
import type { GsiInstallResult, GsiInstallStatus, RuntimePlatform } from '../shared/types.js';

export const WINDOWS_DEFAULT_DOTA_PATH = String.raw`C:\Program Files (x86)\Steam\steamapps\common\dota 2 beta`;
export const GSI_CONFIG_FILE = 'gamestate_integration_codex_coach.cfg';
export const GSI_LAUNCH_OPTION = '-gamestateintegration';

export function getDefaultDotaPath(platform: RuntimePlatform = process.platform): string {
  return platform === 'win32' ? WINDOWS_DEFAULT_DOTA_PATH : WINDOWS_DEFAULT_DOTA_PATH;
}

export function getGsiConfigPath(dotaPath: string): string {
  return join(dotaPath, 'game', 'dota', 'cfg', 'gamestate_integration', GSI_CONFIG_FILE);
}

export function buildGsiConfig(): string {
  return `"Codex Dota Coach"
{
  "uri" "${GSI_ENDPOINT}"
  "timeout" "5.0"
  "buffer" "0.1"
  "throttle" "0.5"
  "heartbeat" "30.0"
  "auth"
  {
    "token" "${GSI_AUTH_TOKEN}"
  }
  "data"
  {
    "provider" "1"
    "map" "1"
    "player" "1"
    "hero" "1"
    "abilities" "1"
    "items" "1"
    "events" "1"
    "buildings" "1"
    "draft" "1"
    "roshan" "1"
    "couriers" "1"
    "neutralitems" "1"
  }
}
`;
}

export function getInstallStatus(dotaPath = getDefaultDotaPath(), platform: RuntimePlatform = process.platform): GsiInstallStatus {
  const detected = existsSync(dotaPath);
  return {
    platform,
    defaultDotaPath: dotaPath,
    detected,
    configPath: detected ? getGsiConfigPath(dotaPath) : undefined,
    launchOption: GSI_LAUNCH_OPTION,
    message: detected
      ? '已检测到默认 Dota 2 目录，可以写入 GSI 配置。'
      : `未检测到默认 Dota 2 目录，请确认路径或手动选择：${dotaPath}`
  };
}

export async function installGsiConfig(dotaPath = getDefaultDotaPath()): Promise<GsiInstallResult> {
  const status = getInstallStatus(dotaPath);
  if (!status.detected) {
    return {
      ...status,
      installed: false
    };
  }

  const configPath = getGsiConfigPath(dotaPath);
  await mkdir(join(dotaPath, 'game', 'dota', 'cfg', 'gamestate_integration'), { recursive: true });
  await writeFile(configPath, buildGsiConfig(), 'utf8');

  return {
    ...status,
    installed: true,
    configPath,
    message: `已写入 GSI 配置。请确认 Steam 启动项包含 ${GSI_LAUNCH_OPTION}。`
  };
}
