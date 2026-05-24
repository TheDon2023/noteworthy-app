export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoId?: string;
  description?: string;
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  channelName: string;
  channelUrl: string;
  thumbnail: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  modules: Module[];
  demo?: boolean;
  sample?: boolean;
}

export interface YouTubeChannelInfo {
  id: string;
  name: string;
  handle: string;
  thumbnail: string;
  subscriberCount: string;
  videoCount: string;
  demo?: boolean;
}

export type GenerationStep =
  | 'Fetching channel videos...'
  | 'Extracting transcripts...'
  | 'Analyzing content with AI...'
  | 'Building course structure...'
  | 'Course ready!';

export const AI_MODELS = [
  { value: 'nvidia/nemotron-3-super-120b-a12b:free', label: 'Nemotron 3 Super 120B', description: 'Most powerful — Recommended' },
  { value: 'nvidia/nemotron-nano-12b-v2-vl:free', label: 'Nemotron Nano 12B', description: 'Fast with vision support' },
  { value: 'nvidia/nemotron-3-nano-30b-a3b:free', label: 'Nemotron 3 Nano 30B', description: 'Balanced speed/quality' },
  { value: 'z-ai/glm-4.5-air:free', label: 'GLM 4.5 Air', description: 'Fast & efficient' },
  { value: 'liquid/lfm-2.5-1.2b-instruct:free', label: 'LFM 2.5 1.2B', description: 'Lightning fast' },
  { value: 'baidu/cobuddy:free', label: 'Baidu CoBuddy', description: 'Reliable fallback' },
] as const;

export type AIModel = typeof AI_MODELS[number]['value'];
