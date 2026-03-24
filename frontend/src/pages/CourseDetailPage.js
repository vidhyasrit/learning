import React, { useState } from 'react';

const ICONS = { js:'🟨', react:'⚛️', python:'🐍', design:'🎨', node:'🟢', ml:'🧠', mobile:'📱', cloud:'☁️', devops:'⚙️', db:'🗄️', security:'🔒' };

export default function CourseDetailPage({ course, enroll, enrolled, progress, markChapter, getCourseProgress, onOpenChat, navigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const isEnrolled = !!enrolled.find(e => e.id===course.id);
  const pct = getCourseProgress(course.id, course.chapters);
  const doneCount = Object.keys(progress).length;

  return (
    <div className="course-detail-page">
      <button className="back-btn" onClick={() => navigate('courses')}>← Back to Courses</button>

      <div className="detail-hero" style={{ borderTop:`4px solid ${course.color}` }}>
        <div className="detail-hero-left">
          <span className="detail-icon">{ICONS[course.image]||'📖'}</span>
          <div className="detail-category">{course.category}</div>
          <h1 className="detail-title">{course.title}</h1>
          <p className="detail-desc">{course.description}</p>
          <div className="detail-tags">{course.tags?.map(t => <span key={t} className="tag accent">{t}</span>)}</div>
          <div className="detail-meta-row">
            <span>⭐ {course.rating}</span><span>👥 {course.students?.toLocaleString()}</span>
            <span>⏱ {course.duration}</span><span>📝 {course.lessons} lessons</span><span>🎯 {course.level}</span>
          </div>
          <div className="detail-instructor">
            <span className="instructor-avatar large">{course.instructor[0]}</span>
            <span>Instructor: <strong>{course.instructor}</strong></span>
          </div>
        </div>
        <div className="detail-hero-right">
          <div className="enroll-card">
            {isEnrolled ? (
              <>
                <div className="progress-ring-wrapper">
                  <svg className="progress-ring" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#f0e6ff" strokeWidth="8" />
                    <circle cx="40" cy="40" r="34" fill="none" stroke={course.color} strokeWidth="8"
                      strokeDasharray={`${(pct/100)*213.6} 213.6`} strokeLinecap="round" transform="rotate(-90 40 40)" />
                    <text x="40" y="45" textAnchor="middle" fill={course.color} fontSize="16" fontWeight="bold">{pct}%</text>
                  </svg>
                </div>
                <p>{doneCount}/{course.chapters?.length} chapters completed</p>
                <button className="btn-primary full" onClick={onOpenChat}>🤖 Ask AI About This Course</button>
              </>
            ) : (
              <>
                <div className="price-display">FREE</div>
                <ul className="enroll-perks">
                  <li>✅ Lifetime access</li><li>✅ AI tutor support</li>
                  <li>✅ Certificate on completion</li><li>✅ {course.lessons} lessons</li>
                </ul>
                <button className="btn-primary full" onClick={() => enroll(course)}>🚀 Enroll Now — Free</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="detail-tabs">
        {['overview','curriculum','ai-help'].map(t => (
          <button key={t} className={`tab-btn ${activeTab===t?'active':''}`}
            onClick={() => setActiveTab(t)} style={activeTab===t?{borderBottomColor:course.color}:{}}>
            {t==='overview'?'📋 Overview':t==='curriculum'?'📚 Curriculum':'🤖 AI Help'}
          </button>
        ))}
      </div>

      <div className="detail-tab-content">
        {activeTab==='overview' && (
          <div className="overview-content">
            <h3>What You'll Learn</h3>
            <div className="learn-grid">
              {course.tags?.map(t => <div key={t} className="learn-item"><span style={{color:course.color}}>✓</span> {t}</div>)}
            </div>
            <h3>Course Description</h3>
            <p className="full-desc">{course.description}</p>
          </div>
        )}
        {activeTab==='curriculum' && (
          <div className="curriculum-content">
            <h3>{course.chapters?.length} Chapters · {course.duration} total</h3>
            <div className="chapters-list">
              {course.chapters?.map((ch,i) => {
                const done = !!progress[ch.id];
                const locked = !isEnrolled;
                return (
                  <div key={ch.id} className={`chapter-item ${done?'done':''} ${locked?'locked':''}`}>
                    <div className="chapter-left">
                      <div className="chapter-num" style={done?{background:course.color,color:'#fff',border:'none'}:{}}>
                        {done?'✓':i+1}
                      </div>
                      <div>
                        <div className="chapter-title">{ch.title}</div>
                        <div className="chapter-duration">⏱ {ch.duration}</div>
                      </div>
                    </div>
                    {isEnrolled && !done && (
                      <button className="mark-done-btn" style={{borderColor:course.color,color:course.color}}
                        onClick={() => markChapter(course.id,ch.id)}>Mark Done</button>
                    )}
                    {done && <span className="done-badge" style={{color:course.color}}>✓ Done</span>}
                    {locked && <span className="lock-icon">🔒</span>}
                  </div>
                );
              })}
            </div>
            {!isEnrolled && <button className="btn-primary" onClick={() => enroll(course)}>Enroll to Unlock All Chapters</button>}
          </div>
        )}
        {activeTab==='ai-help' && (
          <div className="ai-help-content">
            <div className="ai-help-card">
              <div className="ai-help-icon">🤖</div>
              <h3>AI Tutor for {course.title}</h3>
              <p>Get personalized help understanding concepts, debugging code, and accelerating your learning.</p>
              <div className="ai-prompts">
                <p>Try asking:</p>
                {[
                  `Explain the core concepts of ${course.title}`,
                  `What are common mistakes in ${course.category}?`,
                  `Give me a quiz on ${course.tags?.[0]}`,
                  `Help me understand ${course.tags?.[1]}`,
                ].map(q => <div key={q} className="ai-prompt-chip" onClick={onOpenChat}>{q}</div>)}
              </div>
              <button className="btn-primary" onClick={onOpenChat}>Open AI Tutor Chat →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
