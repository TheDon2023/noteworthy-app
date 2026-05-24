import type { Course, Module, YouTubeChannelInfo, GenerationStep } from './types';

const STORAGE_KEYS = {
  courses: 'courseforge_courses',
  youtubeKey: 'courseforge_youtube_api_key',
  openrouterKey: 'courseforge_openrouter_api_key',
  preferredModel: 'courseforge_preferred_model',
} as const;

/** Check if a lesson is completed via the individual localStorage key */
function isLessonCompleteFromStorage(courseId: string, lessonId: string): boolean {
  try {
    return localStorage.getItem(`courseforge_complete_${courseId}_${lessonId}`) === 'true';
  } catch {
    return false;
  }
}

/** Sync individual completion keys into a course object */
function syncCourseCompletion(course: Course): Course {
  let totalLessons = 0;
  let completedLessons = 0;
  const syncedModules = course.modules.map((mod) => {
    const syncedLessons = mod.lessons.map((lesson) => {
      totalLessons++;
      const fromStorage = isLessonCompleteFromStorage(course.id, lesson.id);
      const isComplete = lesson.completed || fromStorage;
      if (isComplete) completedLessons++;
      return { ...lesson, completed: isComplete };
    });
    return { ...mod, lessons: syncedLessons };
  });
  return {
    ...course,
    modules: syncedModules,
    totalLessons,
    completedLessons,
    progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
  };
}

export const getStoredCourses = (): Course[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.courses);
    if (!data) return [];
    const courses: Course[] = JSON.parse(data);
    // Sync individual completion keys into every course
    return courses.map((c) => syncCourseCompletion(c));
  } catch {
    return [];
  }
};

export const saveCourses = (courses: Course[]): void => {
  localStorage.setItem(STORAGE_KEYS.courses, JSON.stringify(courses));
};

export const getApiKeys = () => {
  const youtubeKey = localStorage.getItem(STORAGE_KEYS.youtubeKey) || '';
  const openrouterKey = localStorage.getItem(STORAGE_KEYS.openrouterKey) || '';
  console.log('[CourseForge] getApiKeys() read from localStorage:', {
    storageKey: STORAGE_KEYS.youtubeKey,
    youtubeKeyPresent: !!youtubeKey,
    youtubeKeyLength: youtubeKey.length,
    youtubeKeyPrefix: youtubeKey ? youtubeKey.substring(0, 10) + '...' : 'EMPTY',
    openrouterKeyPresent: !!openrouterKey,
  });
  return { youtubeKey, openrouterKey };
};

export const getPreferredModel = (): string => {
  return localStorage.getItem(STORAGE_KEYS.preferredModel) || 'google/gemma-2-9b-it:free';
};

export const savePreferredModel = (model: string): void => {
  localStorage.setItem(STORAGE_KEYS.preferredModel, model);
};

const SAMPLE_COURSE: Course = {
  id: 'demo-1',
  title: '[SAMPLE] Introduction to Networking',
  channelName: 'The Network',
  channelUrl: 'https://youtube.com/@thenetwork411',
  thumbnail: 'https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg',
  totalLessons: 12,
  completedLessons: 0,
  progress: 0,
  sample: true,
  modules: [
    {
      title: 'Module 1: Networking Fundamentals',
      lessons: [
        { id: 'l1', title: 'What is a Network?', duration: '8:32', completed: false, videoId: 'DEMO' },
        { id: 'l2', title: 'Types of Networks', duration: '12:15', completed: false, videoId: 'DEMO' },
        { id: 'l3', title: 'Network Topologies', duration: '10:45', completed: false, videoId: 'DEMO' },
        { id: 'l4', title: 'The OSI Model Explained', duration: '15:20', completed: false, videoId: 'DEMO' },
        { id: 'l5', title: 'TCP/IP Protocol Suite', duration: '14:10', completed: false, videoId: 'DEMO' },
        { id: 'l6', title: 'Network Devices Overview', duration: '11:25', completed: false, videoId: 'DEMO' },
        { id: 'l7', title: 'Network Security Basics', duration: '13:50', completed: false, videoId: 'DEMO' },
      ]
    },
    {
      title: 'Module 2: IP Addressing',
      lessons: [

        { id: 'l8', title: 'IP Addresses Overview', duration: '9:10', completed: false, videoId: 'DEMO' },
        { id: 'l9', title: 'Subnetting Basics', duration: '14:30', completed: false, videoId: 'DEMO' },
        { id: 'l10', title: 'Public vs Private IPs', duration: '7:45', completed: false, videoId: 'DEMO' },
        { id: 'l11', title: 'IPv6 Fundamentals', duration: '10:20', completed: false, videoId: 'DEMO' },
        { id: 'l12', title: 'Network Troubleshooting', duration: '16:05', completed: false, videoId: 'DEMO' },
      ]
    }
  ]
};

export const getDemoCourses = (): Course[] => [SAMPLE_COURSE];

export function extractChannelId(url: string): string | null {
  // Handle @handle format
  const handleMatch = url.match(/@([a-zA-Z0-9_-]+)/);
  if (handleMatch) return handleMatch[1];

  // Handle channel ID format
  const channelIdMatch = url.match(/channel\/([a-zA-Z0-9_-]+)/);
  if (channelIdMatch) return channelIdMatch[1];

  // Handle c/ format
  const cMatch = url.match(/c\/([a-zA-Z0-9_-]+)/);
  if (cMatch) return cMatch[1];

  return null;
}

export interface ChannelSearchResult {
  info: YouTubeChannelInfo | null;
  error?: string;
}

export async function fetchYouTubeChannelInfo(query: string): Promise<ChannelSearchResult> {
  const { youtubeKey } = getApiKeys();

  if (!youtubeKey) {
    // Demo mode: extract handle from user input for realistic preview
    const handle = extractChannelId(query) || query.replace(/^.*\//, '').replace(/^@/, '') || 'demo-channel';
    const displayHandle = handle.startsWith('@') ? handle : `@${handle}`;
    const name = handle.replace(/^@/, '').replace(/([A-Z])/g, ' $1').replace(/^\w/, (c) => c.toUpperCase());
    // Generate initials avatar from channel name
    const initials = name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase();
    const bgColor = stringToColor(handle);
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=fff&size=128&font-size=0.5&bold=true`;
    return {
      info: {
        id: 'mock-channel',
        name,
        handle: displayHandle,
        thumbnail: avatarUrl,
        subscriberCount: '—',
        videoCount: '—',
        demo: true,
      }
    };
  }

  try {
    // Extract handle or identifier from the query
    const handle = extractChannelId(query);
    let apiUrl: string;

    // Validate key looks like a real YouTube API key (39 chars, starts with AIza)
    const trimmedKey = youtubeKey.trim();
    if (!trimmedKey.startsWith('AIza') || trimmedKey.length < 20) {
      return { info: null, error: 'Your YouTube API key looks invalid (should start with "AIza" and be ~39 characters). Please re-copy it from Google Cloud Console.' };
    }

    if (handle) {
      // Use forHandle parameter for @username lookups — more accurate and cheaper (1 quota unit)
      // Pass handle WITHOUT @ prefix — YouTube accepts either, plain is simpler
      apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${encodeURIComponent(handle)}&key=${trimmedKey}`;
    } else {
      // Fallback: use search endpoint for generic name queries
      apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=channel&maxResults=1&key=${trimmedKey}`;
    }

    console.log('[CourseForge] YouTube API URL:', apiUrl.replace(youtubeKey, '***KEY_HIDDEN***'));
    
    const res = await fetch(apiUrl);
    const data = await res.json();

    console.log('[CourseForge] YouTube API response:', data);

    // Check for API errors
    if (data.error) {
      const err = data.error;
      if (err.code === 400) {
        const reason = err.errors?.[0]?.reason;
        if (reason === 'keyInvalid') {
          return { info: null, error: 'Invalid YouTube API key. Please check your key in Settings.' };
        }
      }
      if (err.code === 403) {
        const reason = err.errors?.[0]?.reason;
        if (reason === 'accessNotConfigured') {
          return { info: null, error: 'YouTube Data API v3 is not enabled. Go to Google Cloud Console → APIs & Services → Library → Enable "YouTube Data API v3".' };
        }
        if (reason === 'quotaExceeded') {
          return { info: null, error: 'YouTube API quota exceeded. Try again tomorrow or use a different key.' };
        }
        if (reason === 'refererNotAllowed') {
          return { info: null, error: 'API key referrer restriction blocked this request. In Google Cloud Console, add https://hwlcohpwurya2.kimi.page/* to allowed referrers (or remove referrer restriction for testing).' };
        }
        return { info: null, error: `YouTube API error: ${err.message}` };
      }
      return { info: null, error: `YouTube API error (${err.code}): ${err.message}` };
    }

    if (!data.items?.length) {
      return { info: null, error: 'No channel found for that URL. Try a different channel name or URL.' };
    }

    // When using forHandle (channels.list), data.items[0] is the channel directly
    // When using search, data.items[0] is a search result, need to get channelId
    let channel;
    if (handle) {
      // Direct channels.list response
      channel = data.items[0];
      const subs = Number(channel.statistics?.subscriberCount || 0);
      const videos = Number(channel.statistics?.videoCount || 0);
      return {
        info: {
          id: channel.id,
          name: channel.snippet.title,
          handle: channel.snippet.customUrl || `@${channel.snippet.title.toLowerCase().replace(/\s+/g, '')}`,
          thumbnail: channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url,
          subscriberCount: subs >= 1_000_000 ? `${(subs / 1_000_000).toFixed(1)}M` : subs >= 1_000 ? `${(subs / 1_000).toFixed(1)}K` : `${subs}`,
          videoCount: `${videos}`,
        }
      };
    } else {
      // Search response — need second call for statistics
      const searchResult = data.items[0];
      const cid = searchResult.id.channelId;

      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${cid}&key=${youtubeKey}`
      );
      const statsData = await statsRes.json();

      if (statsData.error || !statsData.items?.length) {
        return { info: null, error: 'Channel found but could not load full details.' };
      }

      const info = statsData.items[0];
      const subs = Number(info.statistics.subscriberCount);
      const videos = Number(info.statistics.videoCount);

      return {
        info: {
          id: cid,
          name: info.snippet.title,
          handle: info.snippet.customUrl || `@${info.snippet.title.toLowerCase().replace(/\s+/g, '')}`,
          thumbnail: info.snippet.thumbnails?.high?.url || info.snippet.thumbnails?.default?.url,
          subscriberCount: subs >= 1_000_000 ? `${(subs / 1_000_000).toFixed(1)}M` : subs >= 1_000 ? `${(subs / 1_000).toFixed(1)}K` : `${subs}`,
          videoCount: `${videos}`,
        }
      };
    }
  } catch (error) {
    console.error('Error fetching channel:', error);
    return { info: null, error: 'Network error. Check your internet connection and try again.' };
  }
}

export async function fetchChannelVideos(channelId: string): Promise<Array<{ id: string; title: string; thumbnail: string; description: string }>> {
  const { youtubeKey } = getApiKeys();

  if (!youtubeKey) {
    // Return mock video data with real YouTube IDs
    const mockIds = ['dQw4w9WgXcQ', 'rfscVS0vtbw', '9bZkp7q19f0', 'M7lc1UVf-VE', 'jNQXAC9IVRw', 'LXb3EKWsInQ', 'dQw4w9WgXcQ', 'rfscVS0vtbw'];
    return Array.from({ length: 8 }, (_, i) => ({
      id: mockIds[i],
      title: `Video ${i + 1}: Introduction to Topic ${i + 1}`,
      thumbnail: `https://img.youtube.com/vi/${mockIds[i]}/maxresdefault.jpg`,
      description: '',
    }));
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&maxResults=50&order=date&key=${youtubeKey}`
    );
    const data = await res.json();

    return (data.items || []).map((item: Record<string, unknown>) => ({
      id: (item.id as Record<string, string>)?.videoId || '',
      title: (item.snippet as Record<string, string>)?.title || '',
      description: (item.snippet as Record<string, string>)?.description || '',
      thumbnail: ((item.snippet as Record<string, unknown>)?.thumbnails as Record<string, { url: string }>)?.high?.url || '',
    }));
  } catch {
    return [];
  }
}

export async function extractTranscript(videoId: string): Promise<string> {
  try {
    // Try to fetch transcript via CORS proxy
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(
      `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en`
    )}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  }
}

export async function generateCourseWithAI(
  channelInfo: YouTubeChannelInfo,
  videoData: Array<{ id: string; title: string; transcript: string; description?: string }>,
  onStep: (step: GenerationStep) => void,
): Promise<Course> {
  const { openrouterKey } = getApiKeys();
  const model = getPreferredModel();

  onStep('Fetching channel videos...');
  await delay(1200);

  onStep('Extracting transcripts...');
  await delay(1500);

  onStep('Analyzing content with AI...');
  await delay(1800);

  onStep('Building course structure...');
  await delay(1500);

  onStep('Course ready!');
  await delay(500);

  if (!openrouterKey) {
    // Return demo course with updated info
    const course = {
      ...SAMPLE_COURSE,
      id: `course-${Date.now()}`,
      title: `[SAMPLE] Introduction to ${channelInfo.name}`,
      channelName: channelInfo.name,
      channelUrl: `https://youtube.com/${channelInfo.handle}`,
      thumbnail: channelInfo.thumbnail,
      sample: true,
    };
    // Mark all lessons with videoId: 'DEMO' so the player shows a placeholder
    course.modules = course.modules.map((mod) => ({
      ...mod,
      lessons: mod.lessons.map((lesson) => ({
        ...lesson,
        videoId: 'DEMO',
      })),
    }));
    return course;
  }

  // Real OpenRouter API call
  try {
    // Build a list of video titles to give the AI context about the channel's content
    const videoList = videoData.map((v, i) => `${i + 1}. "${v.title}"`).join('\n');
    
    console.log('[CourseForge] Calling OpenRouter with key length:', openrouterKey.length, 'model:', model);
    
    const prompt = `You are an expert course designer. Create a structured learning course based on the YouTube channel "${channelInfo.name}".

Here are the actual video titles from this channel. Use them as the source material to design the course:
${videoList || '(No video data available)'}

Instructions:
- Create course modules and lessons that reflect the ACTUAL topics and themes from the video titles above.
- The course title should capture what this channel teaches.
- Each module should group related videos/topics together.
- Return ONLY a JSON object with this exact structure:
{ "title": string, "modules": [{ "title": string, "lessons": [{ "title": string, "duration": string }] }] }
- Create 2-4 modules with 3-8 lessons each.
- Make lesson titles educational and descriptive based on the video content.
- Use realistic video durations like "8:32" or "15:20".`;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    console.log('[CourseForge] OpenRouter status:', res.status);
    const data = await res.json();
    
    if (!res.ok) {
      console.error('[CourseForge] OpenRouter error:', data.error?.message || JSON.stringify(data));
      // Generate from video titles instead of falling back to demo course
      return generateCourseFromVideos(channelInfo, videoData);
    }
    
    const content = data.choices?.[0]?.message?.content || '';

    // Try to parse JSON from the response
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      parsed = null;
    }

    if (parsed && parsed.modules) {
      let globalLessonIndex = 0;
      const modules = parsed.modules.map((m: { title: string; lessons: Array<{ title: string; duration?: string }> }) => ({
        title: m.title,
        lessons: m.lessons.map((l) => {
          const idx = globalLessonIndex++;
          return {
            id: `l${idx + 1}`,
            title: l.title,
            duration: l.duration || '10:00',
            videoId: videoData[idx]?.id || 'rfscVS0vtbw',
            completed: false,
          };
        }),
      }));

      const totalLessons = modules.reduce((acc: number, m: { lessons: unknown[] }) => acc + m.lessons.length, 0);

      return {
        id: `course-${Date.now()}`,
        title: parsed.title || `Introduction to ${channelInfo.name}`,
        channelName: channelInfo.name,
        channelUrl: `https://youtube.com/${channelInfo.handle}`,
        thumbnail: channelInfo.thumbnail,
        totalLessons,
        completedLessons: 0,
        progress: 0,
        modules,
      };
    }

    // AI response couldn't be parsed — generate from videos directly
    console.log('[CourseForge] AI response unparseable, using video-based generation');
    return generateCourseFromVideos(channelInfo, videoData);
  } catch (error) {
    console.error('[CourseForge] AI generation error:', error);
    return generateCourseFromVideos(channelInfo, videoData);
  }
}

/**
 * Generate a course directly from video titles — NO AI needed.
 * Groups videos into modules, uses REAL video IDs.
 * Only falls back to SAMPLE_COURSE if there are zero videos.
 */
function generateCourseFromVideos(
  channelInfo: YouTubeChannelInfo,
  videoData: Array<{ id: string; title: string; transcript: string; description?: string }>,
): Course {
  console.log('[CourseForge] Building course from', videoData.length, 'videos');

  if (videoData.length === 0) {
    return {
      ...SAMPLE_COURSE,
      id: `course-${Date.now()}`,
      title: `[SAMPLE] Introduction to ${channelInfo.name}`,
      channelName: channelInfo.name,
      channelUrl: `https://youtube.com/${channelInfo.handle}`,
      thumbnail: channelInfo.thumbnail,
      sample: true,
    };
  }

  // Chunk videos into modules of ~8 lessons each
  const MODULE_SIZE = 8;
  const modules: Module[] = [];
  for (let i = 0; i < videoData.length; i += MODULE_SIZE) {
    const chunk = videoData.slice(i, i + MODULE_SIZE);
    modules.push({
      title: `Module ${Math.floor(i / MODULE_SIZE) + 1}: ${channelInfo.name} Content`,
      lessons: chunk.map((v, idx) => ({
        id: `l${i + idx + 1}`,
        title: v.title,
        description: v.description || '',
        duration: `${Math.floor(Math.random() * 15 + 5)}:${Math.floor(Math.random() * 50 + 10).toString().padStart(2, '0')}`,
        videoId: v.id,
        completed: false,
      })),
    });
  }

  return {
    id: `course-${Date.now()}`,
    title: `Introduction to ${channelInfo.name}`,
    channelName: channelInfo.name,
    channelUrl: `https://youtube.com/${channelInfo.handle}`,
    thumbnail: channelInfo.thumbnail,
    totalLessons: videoData.length,
    completedLessons: 0,
    progress: 0,
    modules,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Convert a string to a consistent hex color (for demo avatars)
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase().padStart(6, '0');
  return c;
}
