import React from 'react';

const ICONS = { js:'🟨', react:'⚛️', python:'🐍', design:'🎨', node:'🟢', ml:'🧠', mobile:'📱', cloud:'☁️', devops:'⚙️', db:'🗄️', security:'🔒' };

export default function DashboardPage({ enrolled, progress, getCourseProgress, navigate, onOpenChat }) {
  const totalProgress = enrolled.length
    ? Math.round(enrolled.reduce((s,c) => s+getCourseProgress(c.id,c.chapters),0) / enrolled.length) : 0;
  const completedCount = enrolled.filter(c => getCourseProgress(c.id,c.chapters)===100).length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="page-title">My Dashboard</h1>
        <button className="btn-primary" onClick={() => navigate('courses')}>+ Find Courses</button>
      </div>

      <div className="dashboard-stats">
        {[
          { label:'Enrolled', value:enrolled.length, icon:'📚' },
          { label:'Avg Progress', value:`${totalProgress}%`, icon:'📈' },
          { label:'Completed', value:completedCount, icon:'🏆' },
          { label:'AI Chats', value:'∞', icon:'🤖' },
        ].map(s => (
          <div key={s.label} className="dash-stat-card">
            <span className="dash-stat-icon">{s.icon}</span>
            <span className="dash-stat-value">{s.value}</span>
            <span className="dash-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {enrolled.length === 0 ? (
        <div className="empty-state large">
          <div className="empty-icon">📚</div>
          <h3>No courses yet</h3>
          <p>Enroll in a course to start your learning journey</p>
          <button className="btn-primary" onClick={() => navigate('courses')}>Browse 20 Courses →</button>
        </div>
      ) : (
        <>
          <h2 className="section-title" style={{marginBottom:'20px'}}>Your Courses</h2>
          <div className="enrolled-list">
            {enrolled.map(course => {
              const pct = getCourseProgress(course.id,course.chapters);
              const doneCount = Object.keys(progress[course.id]||{}).length;
              return (
                <div key={course.id} className="enrolled-item" style={{borderLeft:`4px solid ${course.color}`}}>
                  <div className="enrolled-icon">{ICONS[course.image]||'📖'}</div>
                  <div className="enrolled-info">
                    <div className="enrolled-title">{course.title}</div>
                    <div className="enrolled-meta">{course.category} · {course.level} · {doneCount}/{course.chapters?.length} chapters</div>
                    <div className="progress-bar-wrapper">
                      <div className="progress-bar-fill" style={{width:`${pct}%`,background:course.color}} />
                    </div>
                    <div className="progress-text">{pct}% complete</div>
                  </div>
                  <div className="enrolled-actions">
                    <button className="btn-secondary small" onClick={() => navigate('course',course)}>
                      {pct===100?'🏆 Review':'▶ Continue'}
                    </button>
                    <button className="btn-ghost small" onClick={onOpenChat}>🤖 AI Help</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="dashboard-ai-cta">
        <div>
          <h3>🤖 Need help with any topic?</h3>
          <p>Your AI tutor is ready 24/7 — ask questions, get explanations, or practice with quizzes.</p>
        </div>
        <button className="btn-primary" onClick={onOpenChat}>Open AI Tutor</button>
      </div>
    </div>
  );
}
