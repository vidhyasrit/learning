import React from 'react';

const ICONS = { js:'🟨', react:'⚛️', python:'🐍', design:'🎨', node:'🟢', ml:'🧠', mobile:'📱', cloud:'☁️', devops:'⚙️', db:'🗄️', security:'🔒' };
const LEVEL_COLORS = { Beginner:'#86efac', Intermediate:'#fcd34d', Advanced:'#fca5a5' };

export default function CourseCard({ course, onView, onEnroll, isEnrolled, progress }) {
  return (
    <div className="course-card" onClick={() => onView(course)}>
      <div className="course-card-header" style={{ background:`${course.color}18`, borderBottom:`3px solid ${course.color}` }}>
        <span className="course-icon">{ICONS[course.image]||'📖'}</span>
        <span className="course-level-badge" style={{ background:LEVEL_COLORS[course.level]||'#c084fc', color:'#3d2352' }}>
          {course.level}
        </span>
      </div>
      <div className="course-card-body">
        <div className="course-category">{course.category}</div>
        <h3 className="course-title">{course.title}</h3>
        <p className="course-desc">{course.description.slice(0,100)}...</p>
        <div className="course-tags">
          {course.tags?.slice(0,3).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <div className="course-meta">
          <span>⏱ {course.duration}</span>
          <span>📝 {course.lessons} lessons</span>
          <span>⭐ {course.rating}</span>
        </div>
        <div className="course-instructor">
          <span className="instructor-avatar">{course.instructor[0]}</span>
          <span>{course.instructor}</span>
          <span className="students-count">👥 {course.students?.toLocaleString()}</span>
        </div>
        {isEnrolled && progress !== undefined && (
          <div className="progress-section">
            <div className="progress-bar-wrapper">
              <div className="progress-bar-fill" style={{ width:`${progress}%`, background:course.color }} />
            </div>
            <span className="progress-text">{progress}% complete</span>
          </div>
        )}
        <button
          className={`enroll-btn ${isEnrolled?'enrolled':''}`}
          style={!isEnrolled?{ background:`linear-gradient(135deg, ${course.color}, #f9a8d4)`, color:'#fff' }:{}}
          onClick={e => { e.stopPropagation(); isEnrolled ? onView(course) : onEnroll(course); }}
        >
          {isEnrolled ? '▶ Continue Learning' : '🚀 Enroll Now'}
        </button>
      </div>
    </div>
  );
}
