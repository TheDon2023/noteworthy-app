import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Course, YouTubeChannelInfo } from '../components/dashboard/types';
import { CourseStore } from '../lib/CourseStore';
import { testKimiConnection, testOpenRouterConnection, testYouTubeConnection } from '../lib/AiProvider';
import type { ConnectionTestResult } from '../lib/AiProvider';
import {
  generateCourseWithAI,
  fetchChannelVideos,
  extractTranscript,
} from '../components/dashboard/api';
import EmptyState from '../components/dashboard/EmptyState';
import CourseCard from '../components/dashboard/CourseCard';
import CreateCourseModal from '../components/dashboard/CreateCourseModal';
import GenerationLoader from '../components/dashboard/GenerationLoader';
import SettingsDrawer from '../components/dashboard/SettingsDrawer';

const easeOut = [0.4, 0, 0.2, 1] as [number, number, number, number];

/* ─── System Health Badge ─── */
function SystemHealthBar() {
  const [ytStatus, setYtStatus] = useState<ConnectionTestResult['status']>('no_key');
  const [orStatus, setOrStatus] = useState<ConnectionTestResult['status']>('no_key');
  const [kimiStatus, setKimiStatus] = useState<ConnectionTestResult['status']>('no_key');

  useEffect(() => {
    let mounted = true;
    async function check() {
      const [yt, or, km] = await Promise.all([
        testYouTubeConnection(),
        testOpenRouterConnection(),
        testKimiConnection(),
      ]);
      if (!mounted) return;
      setYtStatus(yt.status);
      setOrStatus(or.status);
      setKimiStatus(km.status);
    }
    check();
    return () => { mounted = false; };
  }, []);

  const anyAi = orStatus === 'connected' || kimiStatus === 'connected';

  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-lg px-3 py-2"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <StatusDot label="YouTube" status={ytStatus} />
      <StatusDot label="AI" status={anyAi ? 'connected' : (orStatus === 'no_key' && kimiStatus === 'no_key' ? 'no_key' : 'failed')} />
      <StatusDot label="Storage" status={'connected'} />
    </div>
  );
}

function StatusDot({ label, status }: { label: string; status: ConnectionTestResult['status'] }) {
  const color = status === 'connected' ? '#38A169' : status === 'no_key' ? 'var(--stone)' : '#E53E3E';
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="rounded-full"
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: color,
          boxShadow: status === 'connected' ? '0 0 4px #38A169' : 'none',
        }}
      />
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.6875rem',
          fontWeight: 300,
          color: status === 'connected' ? 'var(--ice)' : 'var(--stone)',
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load courses from CourseStore (unified source of truth)
  useEffect(() => {
    const stored = CourseStore.loadAll();
    setCourses(stored);
    setLoaded(true);
  }, []);

  // Handle create course from modal
  const handleCreateCourse = useCallback(async (channelInfo: YouTubeChannelInfo) => {
    setCreateModalOpen(false);
    setGenerating(true);

    let videoData: Array<{ id: string; title: string; transcript: string }> = [];

    try {
      const videos = await fetchChannelVideos(channelInfo.id);
      videoData = await Promise.all(
        videos.slice(0, 10).map(async (v) => ({
          id: v.id,
          title: v.title,
          description: v.description || '',
          transcript: await extractTranscript(v.id),
        }))
      );
    } catch {
      // Use empty video data - AI will generate with channel name
      videoData = [];
    }

    // Generate course with AI
    const newCourse = await generateCourseWithAI(
      channelInfo,
      videoData,
      () => { /* steps are handled inside the loader component */ }
    );

    // Save and redirect
    CourseStore.save(newCourse);
    setCourses((prev) => [...prev, newCourse]);
    setGenerating(false);

    navigate(`/app/course/${newCourse.id}`);
  }, [navigate]);

  const handleDeleteAll = useCallback(() => {
    CourseStore.deleteAll();
    setCourses([]);
  }, []);

  const handleResetProgress = useCallback(() => {
    for (const c of courses) {
      CourseStore.resetProgress(c.id);
    }
    setCourses(CourseStore.loadAll());
  }, [courses]);

  // Settings button is rendered inline in populated state

  if (!loaded) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          backgroundColor: 'var(--abyss)',
          paddingTop: '64px',
        }}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--abyss)',
        paddingTop: '64px',
      }}
    >
      {/* Empty State */}
      <AnimatePresence mode="wait">
        {courses.length === 0 && (
          <EmptyState onCreateCourse={() => setCreateModalOpen(true)} />
        )}
      </AnimatePresence>

      {/* Populated State */}
      <AnimatePresence>
        {courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="mx-auto px-6 py-12"
            style={{ maxWidth: 'var(--max-width-lg)' }}
          >
            {/* System Health Bar */}
            <div className="mb-6">
              <SystemHealthBar />
            </div>

            {/* Section Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                    color: 'var(--ice)',
                    fontWeight: 400,
                  }}
                >
                  Active Courses
                </h2>
                <span
                  style={{
                    color: 'var(--cyan)',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    fontSize: '1rem',
                  }}
                >
                  ({courses.length})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-normal transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--ice)',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <Plus size={16} />
                  New Course
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSettingsOpen(true)}
                  className="rounded-xl p-2.5 transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--cyan)',
                  }}
                  aria-label="Settings"
                >
                  <Settings size={18} />
                </motion.button>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateCourse}
      />

      {/* Generation Loader */}
      <GenerationLoader
        isOpen={generating}
        onCancel={() => setGenerating(false)}
      />

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={() => navigate('/app')}
        onDeleteAll={handleDeleteAll}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
