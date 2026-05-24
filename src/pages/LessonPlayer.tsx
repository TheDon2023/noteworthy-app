import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MessageCircle,
  Menu,
  ArrowLeft,
  HelpCircle,
} from 'lucide-react'
import LessonSidebar from '../components/lesson-player/LessonSidebar'
import YouTubePlayer from '../components/lesson-player/YouTubePlayer'
import AiTutorPanel from '../components/lesson-player/AiTutorPanel'
import NotesPanel from '../components/lesson-player/NotesPanel'
import QuizPanel from '../components/lesson-player/QuizPanel'
import CompletionCheckpoint from '../components/lesson-player/CompletionCheckpoint'
import {
  loadOrCreateCourse,
  findLesson,
  findAdjacentLessons,
  isLessonCompleted,
  setLessonCompleted,
  getLessonDisplayNumber,
} from '../components/lesson-player/data'
import type { PanelType } from '../components/lesson-player/types'

export default function LessonPlayer() {
  const { id, lid } = useParams<{ id: string; lid: string }>()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<PanelType>(null)
  const [, forceUpdate] = useState(0)

  // Load course
  const course = useMemo(() => loadOrCreateCourse(id || ''), [id])

  // Find current lesson
  const lessonResult = useMemo(() => {
    if (!course || !lid) return null
    return findLesson(course, lid)
  }, [course, lid])

  // Sync completion state from localStorage on mount and when params change
  useEffect(() => {
    if (!course || !lid) return
    // Refresh to pick up any localStorage changes
    forceUpdate((v) => v + 1)
  }, [course, lid, id])

  // Close panels on route change
  useEffect(() => {
    setActivePanel(null)
  }, [lid])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close panels on Escape
      if (e.key === 'Escape') {
        setActivePanel(null)
        setMobileSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Toggle panel (mutually exclusive)
  const togglePanel = useCallback((panel: PanelType) => {
    setActivePanel((current) => (current === panel ? null : panel))
  }, [])

  // Mark lesson complete
  const handleComplete = useCallback(() => {
    if (!id || !lid) return
    setLessonCompleted(id, lid, true)
    forceUpdate((v) => v + 1)
  }, [id, lid])

  // Navigate to a lesson
  const navigateToLesson = useCallback(
    (lessonId: string) => {
      if (!id) return
      navigate(`/app/course/${id}/lesson/${lessonId}`)
    },
    [id, navigate]
  )

  // Adjacent lessons
  const { prev, next } = useMemo(() => {
    if (!course || !lid) return { prev: null, next: null }
    return findAdjacentLessons(course, lid)
  }, [course, lid])

  // Check completion status
  const isComplete = useMemo(() => {
    if (!id || !lid) return false
    return isLessonCompleted(id, lid)
  }, [id, lid])

  // Loading / not found states
  if (!course) {
    return (
      <div
        className="flex items-center justify-center px-6"
        style={{ minHeight: '100dvh', backgroundColor: 'var(--parchment)', paddingTop: '64px' }}
      >
        <div className="text-center">
          <h2
            className="mb-4 font-display"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'var(--deep-ink)', fontWeight: 400 }}
          >
            Course Not Found
          </h2>
          <p className="mb-6" style={{ color: 'var(--slate)', fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
            This course doesn&apos;t exist yet.
          </p>
          <button
            onClick={() => navigate('/app')}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-normal transition-all hover:scale-[1.02]"
            style={{ background: 'var(--gradient-accent)', color: 'var(--deep-ink)' }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!lessonResult) {
    return (
      <div
        className="flex items-center justify-center px-6"
        style={{ minHeight: '100dvh', backgroundColor: 'var(--parchment)', paddingTop: '64px' }}
      >
        <div className="text-center">
          <h2
            className="mb-4 font-display"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'var(--deep-ink)', fontWeight: 400 }}
          >
            Lesson Not Found
          </h2>
          <p className="mb-6" style={{ color: 'var(--slate)', fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
            This lesson doesn&apos;t exist in this course.
          </p>
          <button
            onClick={() => navigate(`/app/course/${id}`)}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-normal transition-all hover:scale-[1.02]"
            style={{ background: 'var(--gradient-accent)', color: 'var(--deep-ink)' }}
          >
            <ArrowLeft size={16} /> Back to Course
          </button>
        </div>
      </div>
    )
  }

  const { lesson, moduleIndex, lessonIndex } = lessonResult
  const lessonNum = getLessonDisplayNumber(course, lid || '')

  // Calculate overall lesson index across all modules and total lessons
  const currentLessonIndex = useMemo(() => {
    let idx = 0
    for (let i = 0; i < moduleIndex; i++) {
      idx += course.modules[i]?.lessons.length || 0
    }
    return idx + lessonIndex
  }, [course.modules, moduleIndex, lessonIndex])

  const totalLessons = useMemo(() =>
    course.modules.reduce((acc, m) => acc + m.lessons.length, 0),
    [course.modules]
  )

  return (
    <div
      className="flex"
      style={{
        minHeight: 'calc(100dvh - 64px)',
        backgroundColor: 'var(--parchment)',
        marginTop: '64px',
      }}
    >
      {/* Lesson Sidebar (Desktop: always visible, collapsible. Mobile: overlay) */}
      <div className="hidden lg:block flex-shrink-0">
        <LessonSidebar
          course={course}
          currentLessonId={lid || ''}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          isMobileOpen={false}
          onMobileClose={() => {}}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        <LessonSidebar
          course={course}
          currentLessonId={lid || ''}
          isOpen={false}
          onToggle={() => {}}
          isMobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Inner Navbar for Lesson Player */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between"
          style={{
            height: '56px',
            padding: '0 var(--space-md)',
            backgroundColor: 'var(--parchment)',
            borderBottom: '1px solid rgba(10, 46, 82, 0.06)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex items-center justify-center rounded-lg p-2 transition-colors lg:hidden"
              style={{ color: 'var(--slate)', backgroundColor: 'var(--warm-sand)' }}
              aria-label="Open lesson menu"
            >
              <Menu size={18} />
            </button>

            {/* Back to course */}
            <button
              onClick={() => navigate(`/app/course/${id}`)}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm transition-colors"
              style={{
                color: 'var(--slate)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: '0.8125rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--warm-sand)'
                e.currentTarget.style.color = 'var(--deep-ink)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--slate)'
              }}
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* Course title + Lesson info */}
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="hidden sm:inline truncate"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8125rem',
                  fontWeight: 300,
                  color: 'var(--deep-ink)',
                  maxWidth: '200px',
                }}
                title={course.title}
              >
                {course.title}
              </span>
              <span style={{ color: 'var(--stone)' }}>/</span>
              <span
                className="truncate"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.6875rem',
                  color: 'var(--stone)',
                }}
              >
                Lesson {lessonNum}
              </span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Quiz Toggle */}
            <button
              onClick={() => togglePanel('quiz')}
              className="flex items-center justify-center gap-1.5 rounded-lg transition-all"
              style={{
                height: '36px',
                padding: '0 12px',
                backgroundColor: activePanel === 'quiz' ? 'var(--azure)' : 'var(--warm-sand)',
                color: activePanel === 'quiz' ? '#FFFFFF' : 'var(--deep-ink)',
                border: '1px solid rgba(10, 46, 82, 0.08)',
              }}
              title="Quiz"
            >
              <HelpCircle size={16} />
              <span
                className="hidden sm:inline"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8125rem',
                  fontWeight: 400,
                }}
              >
                Quiz
              </span>
            </button>

            {/* Notes Toggle */}
            <button
              onClick={() => togglePanel('notes')}
              className="flex items-center justify-center gap-1.5 rounded-lg transition-all"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: activePanel === 'notes' ? 'var(--azure)' : 'var(--warm-sand)',
                color: activePanel === 'notes' ? '#FFFFFF' : 'var(--deep-ink)',
                border: '1px solid rgba(10, 46, 82, 0.08)',
              }}
              title="Notes"
            >
              <BookOpen size={16} />
            </button>

            {/* AI Tutor Toggle */}
            <button
              onClick={() => togglePanel('tutor')}
              className="flex items-center justify-center gap-1.5 rounded-lg transition-all"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: activePanel === 'tutor' ? 'var(--azure)' : 'var(--warm-sand)',
                color: activePanel === 'tutor' ? '#FFFFFF' : 'var(--deep-ink)',
                border: '1px solid rgba(10, 46, 82, 0.08)',
              }}
              title="AI Tutor"
            >
              <MessageCircle size={16} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div
          className="flex-1"
          style={{ padding: 'var(--space-lg)' }}
        >
          <div className="mx-auto" style={{ maxWidth: '960px' }}>
            {/* Video Player */}
            <YouTubePlayer lesson={lesson} course={course} />

            {/* Lesson Meta & Description */}
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <div
                className="mb-2"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.75rem',
                  color: 'var(--stone)',
                }}
              >
                Module {moduleIndex + 1} &bull; Lesson {lessonIndex + 1} of {course.modules[moduleIndex]?.lessons.length || 0}
              </div>

              <h1
                className="font-display mb-4"
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  color: 'var(--deep-ink)',
                  fontWeight: 400,
                  lineHeight: 1.3,
                }}
              >
                {lesson.title}
              </h1>

              <div
                style={{
                  height: '1px',
                  backgroundColor: 'rgba(10, 46, 82, 0.06)',
                  margin: 'var(--space-md) 0',
                }}
              />

              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 300,
                  color: 'var(--slate)',
                  lineHeight: 1.7,
                  maxWidth: '720px',
                }}
              >
                {lesson.description}
              </p>

              {/* Completion Checkpoint */}
              <CompletionCheckpoint
                isComplete={isComplete}
                onComplete={handleComplete}
                onTakeQuiz={() => setActivePanel('quiz')}
                hasQuiz={true}
              />

              {/* Lesson Navigation Buttons */}
              <div
                className="mt-8 flex items-center justify-between gap-4"
                style={{ marginTop: 'var(--space-xl)' }}
              >
                <button
                  onClick={() => prev && navigateToLesson(prev.id)}
                  disabled={!prev}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm transition-all"
                  style={{
                    backgroundColor: prev ? 'var(--warm-sand)' : 'rgba(10, 46, 82, 0.04)',
                    border: '1px solid rgba(10, 46, 82, 0.08)',
                    color: prev ? 'var(--deep-ink)' : 'var(--stone)',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: prev ? 400 : 300,
                    fontSize: '0.875rem',
                    cursor: prev ? 'pointer' : 'not-allowed',
                    opacity: prev ? 1 : 0.5,
                    maxWidth: '45%',
                  }}
                >
                  <ChevronLeft size={16} />
                  <span className="truncate">
                    {prev ? prev.title : 'No previous lesson'}
                  </span>
                </button>

                <button
                  onClick={() => next && navigateToLesson(next.id)}
                  disabled={!next}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm transition-all"
                  style={{
                    background: next ? 'var(--gradient-accent)' : 'rgba(10, 46, 82, 0.04)',
                    color: next ? 'var(--deep-ink)' : 'var(--stone)',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: next ? 400 : 300,
                    fontSize: '0.875rem',
                    cursor: next ? 'pointer' : 'not-allowed',
                    opacity: next ? 1 : 0.5,
                    maxWidth: '45%',
                  }}
                >
                  <span className="truncate">
                    {next ? next.title : 'No next lesson'}
                  </span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panels */}
      <AnimatePresence>
        {activePanel === 'quiz' && (
          <QuizPanel
            isOpen={activePanel === 'quiz'}
            onClose={() => setActivePanel(null)}
            courseId={id || ''}
            lessonId={lid || ''}
            lessonTitle={lesson.title}
            channelName={course.channelName}
            lessonIndex={currentLessonIndex}
            totalLessons={totalLessons}
            lessonDescription={lesson.description || ''}
            videoId={lesson.videoId || ''}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activePanel === 'tutor' && (
          <AiTutorPanel
            isOpen={activePanel === 'tutor'}
            onClose={() => setActivePanel(null)}
            courseId={id || ''}
            courseTitle={course.title}
            lessonId={lid || ''}
            lessonTitle={lesson.title}
            lessonContent={lesson.description}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activePanel === 'notes' && (
          <NotesPanel
            isOpen={activePanel === 'notes'}
            onClose={() => setActivePanel(null)}
            courseId={id || ''}
            lessonId={lid || ''}
            lessonTitle={lesson.title}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
