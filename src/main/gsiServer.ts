import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { demoPayload, type DemoStage } from '../data/demoPayloads.js';
import { generateAdvice } from '../shared/adviceEngine.js';
import { GSI_AUTH_TOKEN, GSI_PORT, normalizeGsiPayload } from '../shared/gsi.js';
import type { AdviceResponse, LiveGameState } from '../shared/types.js';

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error('GSI payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, statusCode: number, payload: unknown): void {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': 'http://127.0.0.1:5173',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type'
  });
  res.end(body);
}

export class GsiServer {
  private server: Server | null = null;
  private liveState: LiveGameState | null = null;
  private readonly token: string;

  constructor(token = GSI_AUTH_TOKEN) {
    this.token = token;
  }

  async start(port = GSI_PORT): Promise<void> {
    if (this.server) return;
    this.server = createServer((req, res) => {
      void this.handle(req, res);
    });
    await new Promise<void>((resolve, reject) => {
      this.server?.once('error', reject);
      this.server?.listen(port, '127.0.0.1', () => resolve());
    });
  }

  async stop(): Promise<void> {
    if (!this.server) return;
    const server = this.server;
    this.server = null;
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }

  getLiveState(): LiveGameState | null {
    return this.liveState;
  }

  getAdvice(): AdviceResponse {
    return generateAdvice(this.liveState);
  }

  injectPayload(payload: unknown): LiveGameState {
    this.liveState = normalizeGsiPayload(payload, this.token);
    return this.liveState;
  }

  injectDemo(stage?: DemoStage): LiveGameState {
    return this.injectPayload(demoPayload(stage));
  }

  private async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (req.method === 'OPTIONS') {
      sendJson(res, 204, {});
      return;
    }

    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? '127.0.0.1'}`);

    try {
      if (req.method === 'POST' && url.pathname === '/gsi') {
        const body = await readRequestBody(req);
        const payload = body ? JSON.parse(body) : {};
        const state = this.injectPayload(payload);
        sendJson(res, state.authOk ? 202 : 401, { ok: state.authOk, receivedAt: state.receivedAt });
        return;
      }

      if (req.method === 'GET' && url.pathname === '/api/live-state') {
        sendJson(res, 200, { liveState: this.liveState });
        return;
      }

      if (req.method === 'GET' && url.pathname === '/api/advice') {
        sendJson(res, 200, this.getAdvice());
        return;
      }

      if (req.method === 'POST' && url.pathname === '/api/demo') {
        const stage = (url.searchParams.get('stage') ?? 'mid') as DemoStage;
        const liveState = this.injectDemo(stage);
        sendJson(res, 200, { liveState, advice: this.getAdvice() });
        return;
      }

      sendJson(res, 404, { error: 'Not found' });
    } catch (error) {
      sendJson(res, 500, { error: error instanceof Error ? error.message : 'Unknown server error' });
    }
  }
}
