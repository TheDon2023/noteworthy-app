export interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: number;
}

export interface CoachingPoint {
  criterion: string;
  score: number; // 1-5
  feedback: string;
}

export interface ScenarioResult {
  scenarioId: string;
  roleId: string;
  completedAt: number;
  messages: Message[];
  coachingPoints: CoachingPoint[];
  overallScore: number; // percentage
  timeSpent: number; // seconds
}

export interface ScenarioStep {
  id: string;
  aiText: string;
  expectedResponseHints: string[];
  coachingNotes: string;
  waitForUser: boolean;
}

export interface Scenario {
  id: string;
  roleId: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'phone' | 'meeting' | 'email' | 'crisis';
  context: string;
  personaName: string;
  personaTitle: string;
  steps: ScenarioStep[];
  keyPerformanceElements: string[];
}

export interface CompanyRole {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  kpis: string[];
  scenarioIds: string[];
}

export interface StudyMaterial {
  id: string;
  roleId: string;
  title: string;
  content: string;
  type: 'script' | 'checklist' | 'template' | 'glossary';
}

export interface AppState {
  currentRole: string | null;
  currentScenario: string | null;
  isInCall: boolean;
  callStage: 'idle' | 'connecting' | 'ringing' | 'connected' | 'ended';
  messages: Message[];
  results: ScenarioResult[];
}
