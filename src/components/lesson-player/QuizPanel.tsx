import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, XCircle, HelpCircle, Trophy, RotateCcw, Loader2, AlertTriangle, Sparkles, BookOpen, Zap } from 'lucide-react'
import type { Quiz, QuizQuestion } from './types'
import { generateQuiz, generateFollowUpQuiz, loadQuiz, saveQuiz, saveQuizScore, recordWeakArea, loadWeakAreas, loadStudyGuide, saveStudyGuide } from './quizApi'

interface QuizPanelProps {
  isOpen: boolean
  onClose: () => void
  courseId: string
  lessonId: string
  lessonTitle: string
  channelName?: string
  lessonIndex: number
  totalLessons: number
  lessonDescription?: string
  videoId?: string
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']
const OPTION_COLORS = [
  { bg: '#EEF2FF', border: '#C7D2FE', hover: '#E0E7FF' },
  { bg: '#F0FDF4', border: '#BBF7D0', hover: '#DCFCE7' },
  { bg: '#FFFBEB', border: '#FDE68A', hover: '#FEF3C7' },
  { bg: '#FDF2F8', border: '#FBCFE8', hover: '#FCE7F3' },
]

export default function QuizPanel({
  isOpen,
  onClose,
  courseId,
  lessonId,
  lessonTitle,
  channelName = '',
  lessonIndex,
  totalLessons,
  lessonDescription = '',
  videoId = '',
}: QuizPanelProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [studyGuide, setStudyGuide] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [quizComplete, setQuizComplete] = useState(false)
  const [aiGenerated, setAiGenerated] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [showStudyGuide, setShowStudyGuide] = useState(false)
  const [followUpMode, setFollowUpMode] = useState(false)
  const [showAiExplanation, setShowAiExplanation] = useState(false)

  // Load quiz on open
  useEffect(() => {
    if (!isOpen) return

    const stored = loadQuiz(courseId, lessonId)
    const storedGuide = loadStudyGuide(courseId, lessonId)

    if (stored) {
      setQuiz(stored)
      setStudyGuide(storedGuide)
      setAiGenerated(false)
      setAiError(null)
      resetQuizState()
    } else {
      setLoading(true)
      setAiGenerated(false)
      setAiError(null)
      generateQuiz(lessonTitle, channelName, lessonIndex, totalLessons, lessonDescription, '', videoId)
        .then((result) => {
          saveQuiz(courseId, lessonId, result.quiz)
          saveStudyGuide(courseId, lessonId, result.studyGuide)
          setQuiz(result.quiz)
          setStudyGuide(result.studyGuide)
          setAiGenerated(result.aiGenerated)
          setAiError(result.error || null)
          setShowStudyGuide(!!result.studyGuide && result.aiGenerated)
          resetQuizState()
        })
        .catch((err) => {
          console.error('[CourseForge] Quiz load error:', err)
          setAiError('Failed to load quiz. Please try again.')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isOpen, courseId, lessonId, lessonTitle, channelName, lessonIndex, totalLessons])

  function resetQuizState() {
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setShowResult(false)
    setScore(0)
    setAnswers({})
    setQuizComplete(false)
    setFollowUpMode(false)
    setShowAiExplanation(false)
  }

  const currentQuestion: QuizQuestion | undefined = quiz?.questions[currentQuestionIndex]

  const handleSelectOption = useCallback((index: number) => {
    if (showResult || quizComplete) return
    setSelectedOption(index)
  }, [showResult, quizComplete])

  const handleSubmitAnswer = useCallback(() => {
    if (selectedOption === null || !currentQuestion) return

    const isCorrect = selectedOption === currentQuestion.correctIndex
    if (isCorrect) {
      setScore((prev) => prev + 1)
    } else {
      // Record weak area based on the question text
      const topicWords = currentQuestion.question.replace(/What is|How|Why|Which|the|of/g, '').trim().substring(0, 50)
      recordWeakArea(courseId, lessonId, topicWords)
    }

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedOption }))
    setShowResult(true)
    if (!isCorrect) setShowAiExplanation(true)
  }, [selectedOption, currentQuestion, courseId, lessonId])

  const handleNextQuestion = useCallback(() => {
    if (!quiz) return
    setShowAiExplanation(false)

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedOption(null)
      setShowResult(false)
    } else {
      // Quiz complete
      const savedCorrectCount = Object.entries(answers).filter(([qid, ans]) => {
        const q = quiz.questions.find((qq) => qq.id === qid)
        return q && Number(ans) === q.correctIndex
      }).length
      const currentCorrect = currentQuestion && answers[currentQuestion.id] === undefined
        ? (selectedOption === currentQuestion.correctIndex ? 1 : 0)
        : 0
      const totalCorrect = savedCorrectCount + currentCorrect

      saveQuizScore(courseId, lessonId, totalCorrect, quiz.questions.length)
      setScore(totalCorrect)
      setQuizComplete(true)
    }
  }, [quiz, currentQuestionIndex, answers, selectedOption, currentQuestion, courseId, lessonId])

  const handleRetake = useCallback(() => {
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setShowResult(false)
    setScore(0)
    setAnswers({})
    setQuizComplete(false)
    setFollowUpMode(false)
    setShowAiExplanation(false)
  }, [])

  const handleRegenerate = useCallback(() => {
    setLoading(true)
    setAiGenerated(false)
    setAiError(null)
    localStorage.removeItem(`courseforge_quiz_${courseId}_${lessonId}`)
    localStorage.removeItem(`courseforge_guide_${courseId}_${lessonId}`)
    generateQuiz(lessonTitle, channelName, lessonIndex, totalLessons, lessonDescription, '', videoId)
      .then((result) => {
        saveQuiz(courseId, lessonId, result.quiz)
        saveStudyGuide(courseId, lessonId, result.studyGuide)
        setQuiz(result.quiz)
        setStudyGuide(result.studyGuide)
        setAiGenerated(result.aiGenerated)
        setAiError(result.error || null)
        setShowStudyGuide(!!result.studyGuide && result.aiGenerated)
        handleRetake()
      })
      .finally(() => setLoading(false))
  }, [courseId, lessonId, lessonTitle, channelName, lessonIndex, totalLessons, handleRetake])

  const handleFollowUp = useCallback(async () => {
    const weakAreas = loadWeakAreas(courseId, lessonId)
    if (weakAreas.length === 0) return

    setLoading(true)
    const followUp = await generateFollowUpQuiz(lessonTitle, channelName, weakAreas, lessonIndex)
    if (followUp) {
      setQuiz(followUp)
      handleRetake()
      setFollowUpMode(true)
    }
    setLoading(false)
  }, [courseId, lessonId, lessonTitle, channelName, lessonIndex, handleRetake])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 z-30 flex flex-col"
      style={{
        width: '420px',
        maxWidth: '100vw',
        height: '100dvh',
        backgroundColor: '#FFFFFF',
        borderLeft: '1px solid rgba(10, 46, 82, 0.08)',
        boxShadow: '-4px 0 24px rgba(10, 46, 82, 0.08)',
        paddingTop: '64px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{
          padding: 'var(--space-md) var(--space-lg)',
          borderBottom: '1px solid rgba(10, 46, 82, 0.06)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(0, 119, 182, 0.1)',
            }}
          >
            <HelpCircle size={16} style={{ color: 'var(--azure)' }} />
          </div>
          <div>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 500, color: 'var(--deep-ink)' }}>
              {quizComplete ? 'Quiz Complete!' : followUpMode ? 'Follow-up Review' : (quiz?.title || 'Quiz')}
            </h3>
            {!quizComplete && quiz && (
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem', color: 'var(--stone)' }}>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {studyGuide && (
            <button
              onClick={() => setShowStudyGuide(!showStudyGuide)}
              className="flex items-center justify-center rounded-lg p-2 transition-colors"
              style={{ color: showStudyGuide ? 'var(--azure)' : 'var(--slate)' }}
              title="Study Guide"
            >
              <BookOpen size={16} />
            </button>
          )}
          {quiz && !quizComplete && (
            <button
              onClick={handleRegenerate}
              className="flex items-center justify-center rounded-lg p-2 transition-colors"
              style={{ color: 'var(--slate)' }}
              title="Generate new quiz"
            >
              <RotateCcw size={16} />
            </button>
          )}
          <button onClick={onClose} className="flex items-center justify-center rounded-lg p-2 transition-colors" style={{ color: 'var(--slate)' }}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ padding: 'var(--space-lg)' }}>
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin mb-3" style={{ color: 'var(--azure)' }} />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'var(--slate)', fontWeight: 300 }}>
              {followUpMode ? 'Generating follow-up questions...' : aiGenerated ? 'AI is creating your quiz...' : 'Loading quiz...'}
            </p>
          </div>
        )}

        {/* Study Guide */}
        <AnimatePresence>
          {!loading && showStudyGuide && studyGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 rounded-xl p-4"
              style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={14} style={{ color: '#0284C7' }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', fontWeight: 500, color: '#0369A1' }}>
                  AI Study Guide
                </span>
                <button onClick={() => setShowStudyGuide(false)} style={{ marginLeft: 'auto', color: '#7DD3FC', fontSize: '0.75rem' }}>Hide</button>
              </div>
              <pre style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: '#0C4A6E', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {studyGuide}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Status Banner */}
        {!loading && aiError && !aiGenerated && (
          <div className="mb-4 rounded-lg p-3" style={{ backgroundColor: '#FFF5F5', border: '1px solid #FED7D7' }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} style={{ color: '#E53E3E', flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8125rem', fontWeight: 500, color: '#C53030' }}>
                AI Unavailable — Fallback Questions
              </span>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#9B2C2C', lineHeight: 1.5 }}>
              {aiError}
            </p>
          </div>
        )}
        {!loading && aiGenerated && (
          <div className="mb-4 flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: '#F0FFF4', border: '1px solid #C6F6D5' }}>
            <Sparkles size={14} style={{ color: '#38A169', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#276749' }}>
              AI-generated quiz with study guide
            </span>
          </div>
        )}

        {/* Question */}
        {!loading && !quizComplete && currentQuestion && (
          <div>
            {quiz && (
              <div className="mb-6">
                <div style={{ height: '4px', borderRadius: '2px', backgroundColor: 'rgba(10, 46, 82, 0.06)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + (showResult ? 1 : 0)) / quiz.questions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                    style={{ height: '100%', borderRadius: '2px', background: 'var(--gradient-accent)' }}
                  />
                </div>
              </div>
            )}

            <h4 className="mb-6" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.0625rem', fontWeight: 400, color: 'var(--deep-ink)', lineHeight: 1.5 }}>
              {currentQuestion.question}
            </h4>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === index
                const isCorrect = index === currentQuestion.correctIndex
                const showCorrect = showResult && isCorrect
                const showWrong = showResult && isSelected && !isCorrect

                let borderColor = OPTION_COLORS[index].border
                let bgColor = OPTION_COLORS[index].bg

                if (showCorrect) { borderColor = '#38A169'; bgColor = '#F0FFF4' }
                else if (showWrong) { borderColor = '#E53E3E'; bgColor = '#FFF5F5' }
                else if (isSelected && !showResult) { borderColor = 'var(--azure)'; bgColor = 'rgba(0, 119, 182, 0.08)' }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    disabled={showResult}
                    className="flex items-center gap-3 rounded-xl p-4 text-left transition-all"
                    style={{ backgroundColor: bgColor, border: `2px solid ${borderColor}`, cursor: showResult ? 'default' : 'pointer', opacity: showResult && !isSelected && !isCorrect ? 0.6 : 1 }}
                  >
                    <span className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: '28px', height: '28px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', fontWeight: 600, color: showCorrect ? '#38A169' : showWrong ? '#E53E3E' : 'var(--deep-ink)', backgroundColor: showCorrect ? '#C6F6D5' : showWrong ? '#FED7D7' : 'rgba(255, 255, 255, 0.8)' }}>
                      {showCorrect ? <CheckCircle size={16} /> : showWrong ? <XCircle size={16} /> : OPTION_LABELS[index]}
                    </span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', fontWeight: 400, color: 'var(--deep-ink)', lineHeight: 1.4 }}>{option}</span>
                  </button>
                )
              })}
            </div>

            {/* AI Explanation for wrong answers */}
            <AnimatePresence>
              {showAiExplanation && showResult && selectedOption !== currentQuestion.correctIndex && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 rounded-xl p-4"
                  style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={14} style={{ color: '#0284C7' }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8125rem', fontWeight: 500, color: '#0369A1' }}>AI Tutor Explanation</span>
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: '#0C4A6E', lineHeight: 1.6 }}>
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Correct answer confirmation */}
            <AnimatePresence>
              {showResult && selectedOption === currentQuestion.correctIndex && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 rounded-xl p-4"
                  style={{ backgroundColor: '#F0FFF4', border: '1px solid #C6F6D5' }}
                >
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: '#276749', lineHeight: 1.5 }}>
                    <strong>Correct!</strong> {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action button */}
            <div className="mt-6">
              {!showResult ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="w-full rounded-xl py-3 text-sm font-medium transition-all"
                  style={{ background: selectedOption !== null ? 'linear-gradient(135deg, #0077B6, #48CAE4)' : 'rgba(10, 46, 82, 0.06)', color: selectedOption !== null ? '#FFFFFF' : 'var(--stone)', fontFamily: "'Inter', sans-serif", cursor: selectedOption !== null ? 'pointer' : 'not-allowed' }}
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full rounded-xl py-3 text-sm font-medium transition-all"
                  style={{ background: 'linear-gradient(135deg, #0077B6, #48CAE4)', color: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}
                >
                  {quiz && currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quiz Complete Screen */}
        {!loading && quizComplete && quiz && (
          <div className="flex flex-col items-center text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="mb-4 flex items-center justify-center rounded-full"
              style={{ width: '72px', height: '72px', backgroundColor: score >= quiz.questions.length / 2 ? '#F0FFF4' : '#FFFAF0' }}
            >
              <Trophy size={36} style={{ color: score >= quiz.questions.length / 2 ? '#38A169' : '#D69E2E' }} />
            </motion.div>

            <h3 className="mb-1" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.25rem', fontWeight: 500, color: 'var(--deep-ink)' }}>
              {score === quiz.questions.length ? 'Perfect Score!' : score >= quiz.questions.length / 2 ? 'Great Job!' : 'Keep Learning!'}
            </h3>

            <p className="mb-4" style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', color: 'var(--slate)', fontWeight: 300 }}>
              You scored <span style={{ fontWeight: 500, color: 'var(--azure)' }}>{score} / {quiz.questions.length}</span>
            </p>

            {/* Score circle */}
            <div className="mb-5 relative" style={{ width: '100px', height: '100px' }}>
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(10, 46, 82, 0.06)" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={score >= quiz.questions.length / 2 ? '#48CAE4' : '#F6AD55'}
                  strokeWidth="8" strokeLinecap="round"
                  initial={{ strokeDasharray: '0 264' }}
                  animate={{ strokeDasharray: `${(score / quiz.questions.length) * 264} 264` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.25rem', fontWeight: 600, color: 'var(--deep-ink)' }}>
                  {Math.round((score / quiz.questions.length) * 100)}%
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 w-full">
              {score < quiz.questions.length && !followUpMode && aiGenerated && (
                <button
                  onClick={handleFollowUp}
                  className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all"
                  style={{ background: 'linear-gradient(135deg, #0077B6, #48CAE4)', color: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}
                >
                  <Zap size={16} />
                  Practice Weak Areas (AI)
                </button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleRetake}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                  style={{ border: '1px solid rgba(10, 46, 82, 0.12)', color: 'var(--deep-ink)', fontFamily: "'Inter', sans-serif", backgroundColor: 'var(--warm-sand)' }}
                >
                  <RotateCcw size={16} />
                  Retake
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                  style={{ background: 'linear-gradient(135deg, #0077B6, #48CAE4)', color: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
