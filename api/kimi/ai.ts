// Kimi AI Chat Completion API
// Uses Kimi's own chat completion endpoint instead of OpenAI

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
  botId?: string; // Kimi Claw agent ID for persona routing
}

export interface KimiChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface CachedToken {
  accessToken: string;
  expiresAt: number; // timestamp in ms
}

let cachedToken: CachedToken | null = null;

/**
 * Fetch an OAuth access token using client_credentials grant.
 * Kimi requires this before any API call.
 */
async function fetchAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
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

  if (!resp.ok) {
    const text = await resp.text();
    console.warn(`[kimi-ai] Token fetch failed (${resp.status}): ${text}`);
    throw new Error(`Failed to get Kimi access token: ${resp.status}`);
  }

  const data = await resp.json() as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in * 1000),
  };

  return data.access_token;
}

/**
 * Call Kimi AI chat completion API.
 */
export async function kimiChatCompletion(
  options: KimiChatCompletionOptions,
): Promise<string> {
  const model = options.model || "kimi-latest";

  const body: Record<string, any> = {
    model,
    messages: options.messages,
    temperature: options.temperature ?? 0.8,
    max_tokens: options.max_tokens ?? 500,
  };

  if (options.botId) {
    body.bot_id = options.botId;
  }

  const token = await fetchAccessToken();

  const resp = await fetch(`${env.kimiOpenUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    console.warn(`[kimi-ai] Chat completion failed (${resp.status}): ${text}`);
    throw new Error(`Kimi AI request failed: ${resp.status}`);
  }

  const data = (await resp.json()) as KimiChatCompletionResponse;
  return data.choices?.[0]?.message?.content?.trim() || "I'm not sure what to say.";
}

/**
 * Check if Kimi AI is available by attempting a token fetch + models call
 */
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
