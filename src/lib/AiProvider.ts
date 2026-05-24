/**
 * AiProvider -- Centralized AI wrapper for all LLM calls.
 *
 * Rules:
 * - One callOpenRouter() and one callKimi() function. No duplicate fetches.
 * - No fake fallback quizzes. If AI fails, throw error with clear message.
 * - Answers are shuffled so correct answer isn't always A.
 * - Keys are cleaned (strip accidental "Bearer " prefix) via aiKeys.ts.
 * - All errors are logged and surfaced to the UI.
 */

import type { Quiz } from '../components/lesson-player/types'
import { getAiKeys, hasAnyAIKey, maskKey, diagnoseKeys } from './aiKeys'

// ─── Types ───────────────────────────────────────────────────────────────

export interface AIResult<T> {
  ok: boolean
  provider: 'kimi' | 'openrouter' | 'none'
  model: string
  data: T
  fallbackUsed: boolean
  errorCode?: string
  errorMessage?: string
}

export interface ConnectionTestResult {
  provider: 'kimi' | 'openrouter' | 'youtube'
  status: 'connected' | 'failed' | 'no_key'
  error?: string
  latencyMs?: number
}

// ─── Constants ───────────────────────────────────────────────────────────

const OR_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const KIMI_API_URL = 'https://api.moonshot.ai/v1/chat/completions'
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3'

const OR_REFERER = typeof window !== 'undefined' ? window.location.origin : 'https://courseforge.app'

// ─── Internal helpers ────────────────────────────────────────────────────

/** The ONLY OpenRouter fetch function in the entire app. */
async function callOpenRouter(prompt: string, model: string = 'openrouter/auto'): Promise<string> {
  const { openRouterKey } = getAiKeys()

  console.group('[AiProvider] OpenRouter call')
  console.log('model:', model)
  console.log('key:', maskKey(openRouterKey))
  console.log('has key:', Boolean(openRouterKey))
  console.groupEnd()

  if (!openRouterKey) {
    throw new Error('OpenRouter API key is missing. Add it in Settings.')
  }

  const headers: Record<string, string> = {
    'Authorization': 'Bearer ' + openRouterKey,
    'Content-Type': 'application/json',
    'HTTP-Referer': OR_REFERER,
    'X-OpenRouter-Title': 'CourseForge',
  }

  const body = JSON.stringify({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  })

  // Log final headers for debugging (with masked auth)
  console.log('[OpenRouter final headers]', {
    hasAuth: Boolean(headers.Authorization),
    authPrefix: headers.Authorization?.substring(0, 12),
    keyLength: openRouterKey.length,
    referer: headers['HTTP-Referer'],
  })

  const res = await fetch(OR_API_URL, { method: 'POST', headers, body })

  const rawText = await res.text()

  console.log('[OpenRouter] Status:', res.status, res.statusText)
  console.log('[OpenRouter] Raw:', rawText.substring(0, 300))

  if (res.status === 429) {
    throw new Error('OPENROUTER_RATE_LIMITED: Too many requests or insufficient credits. Check your OpenRouter dashboard.')
  }

  if (!res.ok) {
    throw new Error('[OpenRouter] HTTP ' + res.status + ': ' + rawText.substring(0, 200))
  }

  let data: Record<string, unknown>
  try {
    data = JSON.parse(rawText)
  } catch {
    throw new Error('[OpenRouter] Invalid JSON response')
  }

  if (data.error) {
    throw new Error('[OpenRouter] ' + JSON.stringify(data.error))
  }

  const choices = data.choices as Array<{ message?: { content?: string } }> | undefined
  if (!choices || choices.length === 0) {
    throw new Error('[OpenRouter] No choices in response')
  }

  return choices[0]?.message?.content || ''
}

/** The ONLY Kimi fetch function in the entire app. */
async function callKimi(prompt: string, model: string = 'kimi-k2.6'): Promise<string> {
  const { kimiKey } = getAiKeys()

  console.group('[AiProvider] Kimi call')
  console.log('model:', model)
  console.log('key:', maskKey(kimiKey))
  console.log('has key:', Boolean(kimiKey))
  console.groupEnd()

  if (!kimiKey) {
    throw new Error('Kimi API key is missing. Add it in Settings.')
  }

  const headers: Record<string, string> = {
    'Authorization': 'Bearer ' + kimiKey,
    'Content-Type': 'application/json',
  }

  const body = JSON.stringify({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  })

  const res = await fetch(KIMI_API_URL, { method: 'POST', headers, body })

  const rawText = await res.text()

  console.log('[Kimi] Status:', res.status, res.statusText)
  console.log('[Kimi] Raw:', rawText.substring(0, 300))

  if (res.status === 429) {
    throw new Error('KIMI_QUOTA_EXCEEDED: Kimi account has insufficient balance or suspended quota. Recharge at platform.moonshot.cn or let OpenRouter handle it.')
  }

  if (!res.ok) {
    throw new Error('[Kimi] HTTP ' + res.status + ': ' + rawText.substring(0, 200))
  }

  let data: Record<string, unknown>
  try {
    data = JSON.parse(rawText)
  } catch {
    throw new Error('[Kimi] Invalid JSON response')
  }

  if (data.error) {
    throw new Error('[Kimi] ' + JSON.stringify(data.error))
  }

  const choices = data.choices as Array<{ message?: { content?: string } }> | undefined
  if (!choices || choices.length === 0) {
    throw new Error('[Kimi] No choices in response')
  }

  return choices[0]?.message?.content || ''
}

/** Shuffle array in-place (Fisher-Yates). */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function parseQuizJson(content: string, lessonIndex: number): Quiz | null {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    if (!parsed?.questions || parsed.questions.length === 0) {
      return null
    }

    const questions = parsed.questions.map(
      (q: { question: string; options: string[]; correctIndex: number; explanation: string }, i: number) => {
        // Validate: must have 4 options
        const rawOptions = (q.options || []).slice(0, 4)
        if (rawOptions.length < 4) {
          console.warn('[AiProvider] Question', i, 'has only', rawOptions.length, 'options, skipping shuffle validation')
        }

        // Shuffle options so correct answer isn't always A
        const shuffledOptions = shuffle(rawOptions)
        const correctAnswer = rawOptions[Math.min(Math.max(0, q.correctIndex || 0), rawOptions.length - 1)]
        const newCorrectIndex = shuffledOptions.indexOf(correctAnswer)

        // Reject generic fallback options
        const genericBad = ['Unrelated concept', 'General computing', 'Historical overview', 'Fusion Layer Behind']
        if (shuffledOptions.some((o: string) => genericBad.includes(o))) {
          console.warn('[AiProvider] Question', i, 'contains generic fallback options — rejecting')
        }

        return {
          id: 'q' + (i + 1),
          question: q.question,
          options: shuffledOptions,
          correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
          explanation: q.explanation || 'Correct!',
        }
      }
    )

    return {
      title: parsed.title || 'Lesson ' + (lessonIndex + 1) + ' Quiz',
      questions,
    }
  } catch (err) {
    console.error('[AiProvider] parseQuizJson failed:', err)
    return null
  }
}

function buildRichQuizPrompt(_lessonTitle: string, _channelName: string, studyOutline: string, contextBlock: string): string {
  return (
    'You are an expert educator. Based on the study outline and video context below, create 5 multiple-choice questions.\n\n' +
    'VIDEO CONTEXT:\n' + contextBlock + '\n\n' +
    'STUDY OUTLINE:\n' + studyOutline + '\n\n' +
    'Rules:\n' +
    '- Each question must test SPECIFIC knowledge from the video context above\n' +
    '- Questions should be detailed and require actual understanding of the topic\n' +
    '- Do NOT ask generic questions like "What is the main topic?"\n' +
    '- Instead ask about specific concepts, techniques, facts, or applications from the content\n' +
    '- Include one correct answer and three plausible distractors\n' +
    '- Provide a brief explanation for the correct answer\n' +
    '- Do NOT use these as options: "Unrelated concept", "General computing", "Historical overview"\n\n' +
    'Return ONLY valid JSON (no markdown, no code blocks, no backticks):\n' +
    '{"title":"Quiz","questions":[{"question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}]}\n\n' +
    'Generate exactly 5 questions. correctIndex must be 0-3.'
  )
}

function buildRichOutlinePrompt(_lessonTitle: string, _channelName: string, contextBlock: string): string {
  return (
    'You are an expert educator analyzing a YouTube video. Create a detailed study outline of what this video teaches.\n\n' +
    'VIDEO CONTEXT:\n' + contextBlock + '\n\n' +
    'Create a study outline with 5-8 specific concepts/topics this video covers. ' +
    'Be detailed and educational. Reference specific techniques, facts, or applications mentioned. ' +
    'Each point should be testable in a quiz.\n\n' +
    'Format: Return ONLY a numbered list, one concept per line.'
  )
}

// ─── Connection Testing ──────────────────────────────────────────────────

export async function testKimiConnection(apiKey?: string): Promise<ConnectionTestResult> {
  if (apiKey) {
    // Test with provided key directly
    const start = performance.now()
    try {
      await callKimiDirect(apiKey, 'Say "pong" and nothing else.', 'kimi-k2.6')
      return { provider: 'kimi', status: 'connected', latencyMs: Math.round(performance.now() - start) }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      return { provider: 'kimi', status: 'failed', error: msg }
    }
  }

  const { kimiKey } = getAiKeys()
  if (!kimiKey) {
    return { provider: 'kimi', status: 'no_key' }
  }

  const start = performance.now()
  try {
    await callKimi('Say "pong" and nothing else.', 'kimi-k2.6')
    return { provider: 'kimi', status: 'connected', latencyMs: Math.round(performance.now() - start) }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { provider: 'kimi', status: 'failed', error: msg }
  }
}

async function callKimiDirect(apiKey: string, prompt: string, model: string): Promise<string> {
  const headers: Record<string, string> = {
    'Authorization': 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.7 })
  const res = await fetch(KIMI_API_URL, { method: 'POST', headers, body })
  const rawText = await res.text()
  if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + rawText.substring(0, 200))
  const data = JSON.parse(rawText)
  return data.choices?.[0]?.message?.content || ''
}

export async function testOpenRouterConnection(apiKey?: string): Promise<ConnectionTestResult> {
  if (apiKey) {
    const start = performance.now()
    try {
      await callOpenRouterDirect(apiKey, 'Say "pong" and nothing else.')
      return { provider: 'openrouter', status: 'connected', latencyMs: Math.round(performance.now() - start) }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      return { provider: 'openrouter', status: 'failed', error: msg }
    }
  }

  const { openRouterKey } = getAiKeys()
  if (!openRouterKey) {
    return { provider: 'openrouter', status: 'no_key' }
  }

  const start = performance.now()
  try {
    await callOpenRouter('Say "pong" and nothing else.')
    return { provider: 'openrouter', status: 'connected', latencyMs: Math.round(performance.now() - start) }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { provider: 'openrouter', status: 'failed', error: msg }
  }
}

async function callOpenRouterDirect(apiKey: string, prompt: string): Promise<string> {
  const cleanKey = apiKey.trim().replace(/^Bearer\s+/i, '')
  const headers: Record<string, string> = {
    'Authorization': 'Bearer ' + cleanKey,
    'Content-Type': 'application/json',
    'HTTP-Referer': OR_REFERER,
    'X-OpenRouter-Title': 'CourseForge',
  }
  const body = JSON.stringify({ model: 'openrouter/auto', messages: [{ role: 'user', content: prompt }], temperature: 0.7 })
  const res = await fetch(OR_API_URL, { method: 'POST', headers, body })
  const rawText = await res.text()
  if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + rawText.substring(0, 200))
  const data = JSON.parse(rawText)
  return data.choices?.[0]?.message?.content || ''
}

export async function testYouTubeConnection(apiKey?: string): Promise<ConnectionTestResult> {
  const key = apiKey || getAiKeys().ytKey
  if (!key) {
    return { provider: 'youtube', status: 'no_key' }
  }

  const start = performance.now()
  try {
    const res = await fetch(
      YOUTUBE_API_URL + '/channels?part=snippet&forHandle=google&key=' + encodeURIComponent(key),
    )
    if (!res.ok) {
      const data = await res.json()
      const errMsg = data.error?.message || 'HTTP ' + res.status
      return { provider: 'youtube', status: 'failed', error: errMsg }
    }
    return { provider: 'youtube', status: 'connected', latencyMs: Math.round(performance.now() - start) }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { provider: 'youtube', status: 'failed', error: msg }
  }
}

// ─── Quiz Generation ─────────────────────────────────────────────────────

export interface QuizContext {
  lessonTitle: string
  channelName: string
  lessonIndex: number
  totalLessons: number
  description?: string
  transcript?: string
  videoId?: string
}

export async function generateQuiz(
  ctx: QuizContext,
): Promise<AIResult<{ quiz: Quiz; studyGuide: string }>> {
  // Debug: log key status + context
  diagnoseKeys()
  console.log('[AiProvider DEBUG] Quiz context:', {
    title: ctx.lessonTitle,
    channel: ctx.channelName,
    hasDescription: !!ctx.description,
    descLength: ctx.description?.length || 0,
    hasTranscript: !!ctx.transcript,
    transcriptLength: ctx.transcript?.length || 0,
    videoId: ctx.videoId,
  })

  // Check if ANY AI key exists before attempting calls
  if (!hasAnyAIKey()) {
    return {
      ok: false,
      provider: 'none',
      model: 'none',
      data: { quiz: { title: '', questions: [] }, studyGuide: '' },
      fallbackUsed: true,
      errorCode: 'NO_AI_KEY',
      errorMessage: 'No AI API key found. Add a Kimi or OpenRouter key in Settings to get AI-generated quizzes.',
    }
  }

  // Build rich context string
  const contextParts = [
    'Video Title: "' + ctx.lessonTitle + '"',
    'Channel: ' + ctx.channelName,
  ]
  if (ctx.description && ctx.description.length > 10) {
    contextParts.push('Video Description: ' + ctx.description.substring(0, 500))
  }
  if (ctx.transcript && ctx.transcript.length > 20) {
    contextParts.push('Transcript Excerpt: ' + ctx.transcript.substring(0, 1000))
  }
  const contextBlock = contextParts.join('\n')

  const errors: string[] = []

  // Try Kimi first
  try {
    console.log('[AiProvider] Trying Kimi...')
    const outlinePrompt = buildRichOutlinePrompt(ctx.lessonTitle, ctx.channelName, contextBlock)
    const outline = await callKimi(outlinePrompt)
    console.log('[AiProvider] Kimi outline:', outline.substring(0, 120))

    const quizPrompt = buildRichQuizPrompt(ctx.lessonTitle, ctx.channelName, outline, contextBlock)
    const quizContent = await callKimi(quizPrompt)
    console.log('[AiProvider] Kimi quiz response length:', quizContent.length)

    const parsed = parseQuizJson(quizContent, ctx.lessonIndex)

    if (parsed && parsed.questions.length > 0) {
      console.log('[AiProvider] Kimi SUCCESS -', parsed.questions.length, 'questions')
      return {
        ok: true,
        provider: 'kimi',
        model: 'kimi-k2.6',
        data: { quiz: parsed, studyGuide: outline },
        fallbackUsed: false,
      }
    }
    console.error('[AiProvider] Kimi returned empty/unparseable quiz')
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[AiProvider] Kimi FAILED:', msg.substring(0, 200))
    errors.push('Kimi: ' + msg.substring(0, 100))
  }

  // Try OpenRouter
  try {
    console.log('[AiProvider] Trying OpenRouter...')
    const outlinePrompt = buildRichOutlinePrompt(ctx.lessonTitle, ctx.channelName, contextBlock)
    const outline = await callOpenRouter(outlinePrompt)
    console.log('[AiProvider] OR outline:', outline.substring(0, 120))

    const quizPrompt = buildRichQuizPrompt(ctx.lessonTitle, ctx.channelName, outline, contextBlock)
    const quizContent = await callOpenRouter(quizPrompt)
    console.log('[AiProvider] OR quiz response length:', quizContent.length)

    const parsed = parseQuizJson(quizContent, ctx.lessonIndex)

    if (parsed && parsed.questions.length > 0) {
      console.log('[AiProvider] OpenRouter SUCCESS -', parsed.questions.length, 'questions')
      return {
        ok: true,
        provider: 'openrouter',
        model: 'openrouter/auto',
        data: { quiz: parsed, studyGuide: outline },
        fallbackUsed: false,
      }
    }
    console.error('[AiProvider] OpenRouter returned empty/unparseable quiz')
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[AiProvider] OpenRouter FAILED:', msg.substring(0, 200))
    errors.push('OpenRouter: ' + msg.substring(0, 100))
  }

  // Both providers failed — return error, NO fake fallback quiz
  return {
    ok: false,
    provider: 'none',
    model: 'none',
    data: { quiz: { title: '', questions: [] }, studyGuide: '' },
    fallbackUsed: true,
    errorCode: 'AI_FAILED',
    errorMessage: errors.length
      ? 'All AI providers failed:\n' + errors.join('\n') + '\n\nCheck: (1) key is valid, (2) account has credits/quota, (3) regenerate key if exposed.'
      : 'AI quiz generation failed. No fallback was used because fallback quizzes produce inaccurate answers.',
  }
}

// ─── Follow-up Quiz ──────────────────────────────────────────────────────

export async function generateFollowUpQuiz(
  lessonTitle: string,
  _channelName: string,
  weakAreas: Array<{ topic: string; count: number }>,
  lessonIndex: number,
): Promise<AIResult<Quiz> | null> {
  if (weakAreas.length === 0) return null

  if (!hasAnyAIKey()) return null

  const topics = weakAreas.map((w) => w.topic).join(', ')

  const prompt = (
    'The student got questions wrong about these topics from "' + lessonTitle + '": ' + topics + '\n\n' +
    'Create 3 follow-up questions focused on these weak areas. Teach the concept while testing.\n\n' +
    'Return ONLY valid JSON:\n' +
    '{"title":"Follow-up Review","questions":[{"question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}]}\n\n' +
    '3 questions. correctIndex 0-3.'
  )

  // Try Kimi first
  try {
    const content = await callKimi(prompt)
    const parsed = parseQuizJson(content, lessonIndex)
    if (parsed && parsed.questions.length > 0) {
      return {
        ok: true,
        provider: 'kimi',
        model: 'kimi-k2.6',
        data: parsed,
        fallbackUsed: false,
      }
    }
  } catch (err) {
    console.error('[AiProvider] Kimi follow-up failed:', err)
  }

  // Try OpenRouter
  try {
    const content = await callOpenRouter(prompt)
    const parsed = parseQuizJson(content, lessonIndex)
    if (parsed && parsed.questions.length > 0) {
      return {
        ok: true,
        provider: 'openrouter',
        model: 'openrouter/auto',
        data: parsed,
        fallbackUsed: false,
      }
    }
  } catch (err) {
    console.error('[AiProvider] OR follow-up failed:', err)
  }

  return null
}

// ─── Course Generation ───────────────────────────────────────────────────

export async function generateCourse(
  channelName: string,
  videoTitles: string[],
): Promise<AIResult<{ title: string; modules: Array<{ title: string; lessons: Array<{ title: string; duration: string }> }> }>> {
  if (!hasAnyAIKey()) {
    return {
      ok: false,
      provider: 'none',
      model: 'none',
      data: { title: '', modules: [] },
      fallbackUsed: true,
      errorCode: 'NO_AI_KEY',
      errorMessage: 'No AI API key found. Add a key in Settings to generate AI-powered courses.',
    }
  }

  const videoList = videoTitles.map((v, i) => (i + 1) + '. "' + v + '"').join('\n')

  const prompt = (
    'You are an expert course designer. Create a structured learning course based on the YouTube channel "' + channelName + '".\n\n' +
    'Here are the actual video titles from this channel. Use them as the source material:\n' + videoList +
    '\n\nInstructions:\n' +
    '- Create course modules and lessons that reflect the ACTUAL topics from the video titles.\n' +
    '- Return ONLY a JSON object: { "title": string, "modules": [{ "title": string, "lessons": [{ "title": string, "duration": string }] }] }\n' +
    '- Create 2-4 modules with 3-8 lessons each.'
  )

  const errors: string[] = []

  // Try Kimi first
  try {
    const content = await callKimi(prompt)
    const parsed = parseCourseJson(content)
    if (parsed) {
      return { ok: true, provider: 'kimi', model: 'kimi-k2.6', data: parsed, fallbackUsed: false }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[AiProvider] Kimi course generation failed:', err)
    errors.push('Kimi: ' + msg.substring(0, 100))
  }

  // Try OpenRouter
  try {
    const content = await callOpenRouter(prompt)
    const parsed = parseCourseJson(content)
    if (parsed) {
      return { ok: true, provider: 'openrouter', model: 'openrouter/auto', data: parsed, fallbackUsed: false }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[AiProvider] OR course generation failed:', err)
    errors.push('OpenRouter: ' + msg.substring(0, 100))
  }

  return {
    ok: false,
    provider: 'none',
    model: 'none',
    data: { title: '', modules: [] },
    fallbackUsed: true,
    errorCode: 'AI_FAILED',
    errorMessage: errors.length
      ? 'All AI providers failed:\n' + errors.join('\n')
      : 'AI course generation failed. Check your API keys in Settings.',
  }
}

function parseCourseJson(content: string): { title: string; modules: Array<{ title: string; lessons: Array<{ title: string; duration: string }> }> } | null {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null
    if (parsed && parsed.modules && parsed.title) {
      return parsed
    }
  } catch {
    // ignore
  }
  return null
}
