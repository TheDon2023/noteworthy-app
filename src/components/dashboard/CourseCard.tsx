import { motion } from 'framer-motion';
import { ChevronRight, Play, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Course } from './types';

interface CourseCardProps {
  course: Course;
  index: number;
}

const easeOut = [0.4, 0, 0.2, 1] as [number, number, number, number];

export default function CourseCard({ course, index }: CourseCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/app/course/${course.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: easeOut }}
      whileHover={{ y: -4 }}
      onClick={handleClick}
      className="group cursor-pointer overflow-hidden rounded-2xl transition-all"
      style={{
        background: 'rgba(2, 62, 138, 0.4)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/logo.png';
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent 50%, rgba(2, 62, 138, 0.8) 100%)',
          }}
        />
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Title */}
        <h3
          className="truncate text-base font-normal"
          style={{
            color: 'var(--ice)',
            fontFamily: "'Inter', sans-serif",
          }}
          title={course.title}
        >
          {course.title}
        </h3>

        {/* Channel Name */}
        <p
          className="mt-1 text-sm font-light"
          style={{
            color: 'var(--cyan)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {course.channelName}
        </p>

        {/* Progress Bar */}
        <div className="mt-3">
          <div
            className="h-1 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: easeOut }}
              className="h-full rounded-full"
              style={{ background: 'var(--gradient-accent)' }}
            />
          </div>
          <p
            className="mt-1.5 text-xs"
            style={{
              color: 'var(--stone)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
            }}
          >
            {course.progress}% complete
          </p>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between">
          <span
            style={{
              color: 'var(--stone)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
            }}
          >
            {course.modules.length} modules &bull; {course.totalLessons} lessons
          </span>
          <div className="flex items-center gap-1" style={{ color: 'var(--azure)' }}>
            {course.progress > 0 ? (
              <span className="flex items-center gap-1 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                <Play size={12} />
                Continue
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                <BookOpen size={12} />
                Start
              </span>
            )}
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
