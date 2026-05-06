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

/**
 * Call Kimi AI chat completion API.
 * Authenticates using APP_ID and APP_SECRET via client credentials flow.
 */
export async function kimiChatCompletion(
  options: KimiChatCompletionOptions,
): Promise<string> {
  const model = options.model || "kimi-latest";

  // Build the request body for Kimi chat completions
  const body: Record<string, any> = {
    model,
    messages: options.messages,
    temperature: options.temperature ?? 0.8,
    max_tokens: options.max_tokens ?? 500,
  };

  // If a Kimi Claw bot ID is provided, route through the agent
  if (options.botId) {
    body.bot_id = options.botId;
  }

  // Kimi API uses the APP_ID as a Bearer token for app-level requests
  // or we can use a generated token
  const token = await getKimiToken();

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
 * Check if Kimi AI is available by attempting a minimal request
 */
export async function checkKimiAIAvailable(): Promise<boolean> {
  try {
    const token = await getKimiToken();
    const resp = await fetch(`${env.kimiOpenUrl}/v1/models`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return resp.ok;
  } catch {
    return false;
  }
}

/**
 * Get Kimi API token.
 * Uses APP_SECRET as a simple token, or generates one from app credentials.
 */
async function getKimiToken(): Promise<string> {
  // For Kimi API, we can use the APP_SECRET as a bearer token
  // The platform validates the app identity via the Authorization header
  return env.appSecret;
}
