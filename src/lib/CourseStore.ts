/**
 * CourseStore — Single Source of Truth for ALL course data.
 * 
 * Every page reads and writes through this store.
 * No page should directly touch localStorage keys anymore.
 */

import type { Course, Lesson, Module } from '../components/dashboard/types'

const SK = {
  courses: 'courseforge_courses',
  complete: (cid: string, lid: string) => `courseforge_complete_${cid}_${lid}`,
  quiz: (cid: string, lid: string) => `courseforge_quiz_${cid}_${lid}`,
  quizScore: (cid: string, lid: string) => `courseforge_quizscore_${cid}_${lid}`,
  guide: (cid: string, lid: string) => `courseforge_guide_${cid}_${lid}`,
  weak: (cid: string, lid: string) => `courseforge_weak_${cid}_${lid}`,
}

// ─── Low-level localStorage helpers ──────────────────────────────────────

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function lsSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('[CourseStore] lsSet error:', e)
  }
}

function lsRemove(key: string): void {
  try { localStorage.removeItem(key) } catch {}
}

// ─── Completion helpers ──────────────────────────────────────────────────

function isLessonComplete(courseId: string, lessonId: string): boolean {
  return localStorage.getItem(SK.complete(courseId, lessonId)) === 'true'
}

function setLessonCompleteRaw(courseId: string, lessonId: string, completed: boolean): void {
  localStorage.setItem(SK.complete(courseId, lessonId), completed ? 'true' : 'false')
}

// ─── Course syncing ──────────────────────────────────────────────────────

/**
 * Merge individual completion keys INTO a course object.
 * Call this every time a course is loaded from storage.
 */
function syncCompletionIntoCourse(course: Course): Course {
  let total = 0
  let done = 0
  const syncedModules = course.modules.map((mod) => {
    const syncedLessons = mod.lessons.map((lesson) => {
      total++
      const fromStorage = isLessonComplete(course.id, lesson.id)
      const isDone = !!lesson.completed || fromStorage
      if (isDone) done++
      return { ...lesson, completed: isDone } as Lesson
    })
    return { ...mod, lessons: syncedLessons } as Module
  })
  return {
    ...course,
    modules: syncedModules,
    totalLessons: total,
    completedLessons: done,
    progress: total > 0 ? Math.round((done / total) * 100) : 0,
  }
}

// ─── Public API ──────────────────────────────────────────────────────────

export const CourseStore = {

  /** Load all courses with synced completion data */
  loadAll(): Course[] {
    const courses: Course[] = lsGet(SK.courses, [])
    return courses.map(syncCompletionIntoCourse)
  },

  /** Load one course with synced completion data */
  load(courseId: string): Course | null {
    const courses = this.loadAll()
    const course = courses.find((c) => c.id === courseId)
    return course || null
  },

  /** Save (overwrite) a course */
  save(course: Course): void {
    const all = lsGet<Course[]>(SK.courses, [])
    const idx = all.findIndex((c) => c.id === course.id)
    if (idx >= 0) {
      all[idx] = course
    } else {
      all.push(course)
    }
    lsSet(SK.courses, all)
  },

  /** Mark a lesson complete/incomplete — updates BOTH individual key AND course JSON */
  markLesson(courseId: string, lessonId: string, completed: boolean): void {
    // 1. Save to individual key (source of truth for completion)
    setLessonCompleteRaw(courseId, lessonId, completed)

    // 2. Update the course JSON so progress survives on all pages
    const course = this.load(courseId)
    if (!course) return
    let found = false
    const updatedModules = course.modules.map((mod) => {
      const updatedLessons = mod.lessons.map((l) => {
        if (l.id === lessonId) {
          found = true
          return { ...l, completed } as Lesson
        }
        return l
      })
      return { ...mod, lessons: updatedLessons } as Module
    })
    if (found) {
      const updated = { ...course, modules: updatedModules }
      const synced = syncCompletionIntoCourse(updated)
      this.save(synced)
    }
  },

  /** Toggle lesson completion */
  toggleLesson(courseId: string, lessonId: string): boolean {
    const wasComplete = isLessonComplete(courseId, lessonId)
    this.markLesson(courseId, lessonId, !wasComplete)
    return !wasComplete
  },

  /** Delete a course */
  delete(courseId: string): void {
    const all = lsGet<Course[]>(SK.courses, []).filter((c) => c.id !== courseId)
    lsSet(SK.courses, all)
    // Also clean up per-lesson keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`courseforge_complete_${courseId}_`)) {
        lsRemove(key)
      }
    }
  },

  /** Delete ALL courses */
  deleteAll(): void {
    lsRemove(SK.courses)
    // Remove all per-course keys
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('courseforge_complete_')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(lsRemove)
  },

  /** Reset progress for a course */
  resetProgress(courseId: string): void {
    const course = this.load(courseId)
    if (!course) return
    // Clear all completion keys for this course
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        lsRemove(SK.complete(courseId, lesson.id))
      }
    }
    // Re-save course with zero progress
    const cleared = {
      ...course,
      modules: course.modules.map((mod) => ({
        ...mod,
        lessons: mod.lessons.map((l) => ({ ...l, completed: false }) as Lesson),
      })),
      completedLessons: 0,
      progress: 0,
    }
    this.save(cleared)
  },

  // ─── Quiz data (stored per-lesson, synced to course object) ───────────

  saveQuiz(courseId: string, lessonId: string, quiz: unknown): void {
    lsSet(SK.quiz(courseId, lessonId), quiz)
  },

  loadQuiz(courseId: string, lessonId: string): unknown | null {
    return lsGet(SK.quiz(courseId, lessonId), null)
  },

  saveQuizScore(courseId: string, lessonId: string, score: number, total: number): void {
    lsSet(SK.quizScore(courseId, lessonId), { score, total })
  },

  loadQuizScore(courseId: string, lessonId: string): { score: number; total: number } | null {
    return lsGet(SK.quizScore(courseId, lessonId), null)
  },

  saveStudyGuide(courseId: string, lessonId: string, guide: string): void {
    lsSet(SK.guide(courseId, lessonId), guide)
  },

  loadStudyGuide(courseId: string, lessonId: string): string {
    return lsGet(SK.guide(courseId, lessonId), '')
  },

  recordWeakArea(courseId: string, lessonId: string, topic: string): void {
    const areas: Array<{ topic: string; count: number }> = lsGet(SK.weak(courseId, lessonId), [])
    const existing = areas.find((a) => a.topic === topic)
    if (existing) {
      existing.count++
    } else {
      areas.push({ topic, count: 1 })
    }
    lsSet(SK.weak(courseId, lessonId), areas)
  },

  loadWeakAreas(courseId: string, lessonId: string): Array<{ topic: string; count: number }> {
    return lsGet(SK.weak(courseId, lessonId), [])
  },

  /** Find first incomplete lesson in a course */
  findFirstIncompleteLesson(courseId: string): { moduleIndex: number; lessonIndex: number; lessonId: string } | null {
    const course = this.load(courseId)
    if (!course) return null
    for (let mi = 0; mi < course.modules.length; mi++) {
      for (let li = 0; li < course.modules[mi].lessons.length; li++) {
        if (!course.modules[mi].lessons[li].completed) {
          return { moduleIndex: mi, lessonIndex: li, lessonId: course.modules[mi].lessons[li].id }
        }
      }
    }
    return null
  },

  /** Aggregate quiz score for a course (sum of all lesson quiz scores) */
  getCourseQuizStats(courseId: string): { totalScore: number; totalQuestions: number; lessonsWithQuizzes: number } {
    const course = this.load(courseId)
    if (!course) return { totalScore: 0, totalQuestions: 0, lessonsWithQuizzes: 0 }

    let totalScore = 0
    let totalQuestions = 0
    let lessonsWithQuizzes = 0

    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        const score = this.loadQuizScore(courseId, lesson.id)
        if (score) {
          totalScore += score.score
          totalQuestions += score.total
          lessonsWithQuizzes++
        }
      }
    }
    return { totalScore, totalQuestions, lessonsWithQuizzes }
  },
}
