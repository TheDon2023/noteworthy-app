// Kimi AI Chat Completion API
import { env } from "../lib/env";

export interface KimiChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface KimiChatCompletionOptions {
  model?: string;
  messages: KimiChatMessage[];
  temperature?: number;
  max_tokens?: number;
  botId?: string;
}

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

async function fetchAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.accessToken;
  }
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: env.appId,
    client_secret: env.appSecret,
  });
  const resp = await fetch(`${env.kimiAuthUrl}/api/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!resp.ok) throw new Error(`Token fetch failed: ${resp.status}`);
  const data = await resp.json() as { access_token: string; expires_in: number };
  cachedToken = { accessToken: data.access_token, expiresAt: Date.now() + (data.expires_in * 1000) };
  return data.access_token;
}

export async function kimiChatCompletion(options: any): Promise<string> {
  const token = await fetchAccessToken();
  const body: any = {
    model: options.model || "kimi-latest",
    messages: options.messages,
    temperature: options.temperature ?? 0.8,
    max_tokens: options.max_tokens ?? 500,
  };
  if (options.botId) body.bot_id = options.botId;
  const resp = await fetch(`${env.kimiOpenUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`Kimi API failed: ${resp.status}`);
  const data = await resp.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export async function checkKimiAIAvailable(): Promise<boolean> {
  try {
    const token = await fetchAccessToken();
    const resp = await fetch(`${env.kimiOpenUrl}/v1/models`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.ok;
  } catch {
    return false;
  }
}
