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
