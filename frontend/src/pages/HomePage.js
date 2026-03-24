import React from 'react';
import CourseCard from '../components/CourseCard';

const STATS = [
  { label:'Active Students', value:'50K+', icon:'👥' },
  { label:'Expert Courses', value:'20+', icon:'📚' },
  { label:'Avg Rating', value:'4.8★', icon:'⭐' },
  { label:'Completion Rate', value:'92%', icon:'🏆' },
];

export default function HomePage({ courses, loading, navigate, enroll, enrolled, onOpenChat }) {
  const featured = courses.slice(0, 3);
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-bg">
          {[...Array(20)].map((_,i) => (
            <div key={i} className="hero-particle" style={{
              left:`${Math.random()*100}%`,
              animationDelay:`${Math.random()*4}s`,
              animationDuration:`${3+Math.random()*4}s`,
            }} />
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-badge">🚀 AI-Powered Learning</div>
          <h1 className="hero-title">Master Skills<br /><span className="hero-accent">Faster with AI</span></h1>
          <p className="hero-sub">Learn programming, design, cloud, security and more with personalized AI guidance. 20 expert courses with an intelligent tutor.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('courses')}>Browse 20 Courses →</button>
            <button className="btn-secondary" onClick={onOpenChat}>🤖 Ask AI Tutor</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card floating">
            <div className="hero-card-top"><span>🤖 AI Tutor</span><span className="online-dot" /></div>
            <div className="hero-chat-preview">
              <div className="preview-msg bot">How can I help you learn today?</div>
              <div className="preview-msg user">Explain React hooks</div>
              <div className="preview-msg bot">React hooks let you use state in functional components...</div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-bar">
        {STATS.map(s => (
          <div key={s.label} className="stat-item">
            <span className="stat-icon">{s.icon}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Courses</h2>
          <button className="see-all-btn" onClick={() => navigate('courses')}>View All 20 →</button>
        </div>
        {loading ? (
          <div className="loading-grid">{[...Array(3)].map((_,i) => <div key={i} className="skeleton-card" />)}</div>
        ) : (
          <div className="courses-grid">
            {featured.map(c => (
              <CourseCard key={c.id} course={c} onView={course => navigate('course',course)}
                onEnroll={enroll} isEnrolled={!!enrolled.find(e => e.id===c.id)} />
            ))}
          </div>
        )}
      </section>

      <section className="ai-banner">
        <div className="ai-banner-content">
          <h2>🤖 Your Personal AI Tutor</h2>
          <p>Get instant answers, code explanations, and personalized guidance at every step of your learning journey.</p>
          <ul className="ai-features">
            <li>✅ Context-aware course assistance</li>
            <li>✅ Code debugging & explanation</li>
            <li>✅ Personalized learning paths</li>
            <li>✅ Available 24/7 — completely free</li>
          </ul>
          <button className="btn-primary" onClick={onOpenChat}>Chat with AI Tutor →</button>
        </div>
        <div className="ai-banner-visual"><div className="ai-orb" /></div>
      </section>
    </div>
  );
}
