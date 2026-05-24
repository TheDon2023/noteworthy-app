export interface Lesson {
  id: string
  title: string
  videoId: string
  duration: string
  description: string
  completed: boolean
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  modules: Module[]
  createdAt: string
  totalLessons?: number
  completedLessons?: number
  progress?: number
  demo?: boolean
  sample?: boolean
  channelName?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Quiz {
  questions: QuizQuestion[]
  title: string
}

export type PanelType = 'tutor' | 'notes' | 'quiz' | null
