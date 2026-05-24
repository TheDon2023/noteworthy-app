/**
 * quizApi.ts -- Quiz data layer.
 *
 * All AI calls go through AiProvider. This file only handles:
 * - localStorage read/write for quiz data
 * - Weak area tracking
 * - Thin wrappers around AiProvider.generateQuiz
 */

import type { Quiz } from './types'
import { generateQuiz as aiGenerateQuiz, generateFollowUpQuiz as aiGenerateFollowUp, type AIResult, type QuizContext } from '../../lib/AiProvider'

const SK_QUIZ = (c: string, l: string) => `courseforge_quiz_${c}_${l}`
const SK_GUIDE = (c: string, l: string) => `courseforge_guide_${c}_${l}`
const SK_WEAK = (c: string, l: string) => `courseforge_weak_${c}_${l}`

export interface QuizResult {
  quiz: Quiz
  studyGuide: string
  aiGenerated: boolean
  error?: string
}

export interface WeakArea {
  topic: string
  count: number
}

export async function generateQuiz(
  lessonTitle: string,
  channelName: string,
  lessonIndex: number,
  totalLessons: number,
  description?: string,
  transcript?: string,
  videoId?: string,
): Promise<QuizResult> {
  console.log('[quizApi] Generating quiz for:', lessonTitle)

  const ctx: QuizContext = {
    lessonTitle,
    channelName,
    lessonIndex,
    totalLessons,
    description,
    transcript,
    videoId,
  }

  const result: AIResult<{ quiz: Quiz; studyGuide: string }> = await aiGenerateQuiz(ctx)

  return {
    quiz: result.data.quiz,
    studyGuide: result.data.studyGuide,
    aiGenerated: !result.fallbackUsed,
    error: result.errorMessage,
  }
}

export async function generateFollowUpQuiz(
  lessonTitle: string,
  channelName: string,
  weakAreas: WeakArea[],
  lessonIndex: number,
): Promise<Quiz | null> {
  const result = await aiGenerateFollowUp(lessonTitle, channelName, weakAreas, lessonIndex)
  return result?.data || null
}

export function recordWeakArea(courseId: string, lessonId: string, topic: string): void {
  try {
    const key = SK_WEAK(courseId, lessonId)
    const stored = localStorage.getItem(key)
    const areas: WeakArea[] = stored ? JSON.parse(stored) : []
    const existing = areas.find((a) => a.topic === topic)
    if (existing) {
      existing.count++
    } else {
      areas.push({ topic, count: 1 })
    }
    localStorage.setItem(key, JSON.stringify(areas))
  } catch (e) {
    console.error('[quizApi] recordWeakArea error:', e)
  }
}

export function loadWeakAreas(courseId: string, lessonId: string): WeakArea[] {
  try {
    const stored = localStorage.getItem(SK_WEAK(courseId, lessonId))
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function loadStudyGuide(courseId: string, lessonId: string): string {
  try {
    return localStorage.getItem(SK_GUIDE(courseId, lessonId)) || ''
  } catch {
    return ''
  }
}

export function saveStudyGuide(courseId: string, lessonId: string, guide: string): void {
  localStorage.setItem(SK_GUIDE(courseId, lessonId), guide)
}

export function loadQuiz(courseId: string, lessonId: string): Quiz | null {
  try {
    const stored = localStorage.getItem(SK_QUIZ(courseId, lessonId))
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function saveQuiz(courseId: string, lessonId: string, quiz: Quiz): void {
  localStorage.setItem(SK_QUIZ(courseId, lessonId), JSON.stringify(quiz))
}

export function saveQuizScore(courseId: string, lessonId: string, score: number, total: number): void {
  localStorage.setItem('courseforge_quizscore_' + courseId + '_' + lessonId, JSON.stringify({ score, total }))
}
