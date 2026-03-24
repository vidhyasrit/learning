import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import DashboardPage from './pages/DashboardPage';
import AIChat from './components/AIChat';
import './styles.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4002/api';

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [progress, setProgress] = useState({});

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (filterCategory !== 'All') params.set('category', filterCategory);
      if (filterLevel !== 'All') params.set('level', filterLevel);
      const res = await fetch(`${API}/courses?${params}`);
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (e) { console.error('Fetch error:', e); }
    setLoading(false);
  }, [searchQuery, filterCategory, filterLevel]);

  useEffect(() => {
    fetchCourses();
    fetch(`${API}/categories`).then(r => r.json()).then(setCategories).catch(() => {});
  }, [fetchCourses]);

  const navigate = (p, course = null) => {
    setSelectedCourse(course); setPage(p); window.scrollTo(0, 0);
  };

  const enroll = (course) => {
    if (!enrolled.find(e => e.id === course.id)) {
      setEnrolled(prev => [...prev, { ...course, enrolledAt: new Date() }]);
      setProgress(prev => ({ ...prev, [course.id]: {} }));
    }
    navigate('course', course);
  };

  const markChapter = (courseId, chapterId) => {
    setProgress(prev => ({ ...prev, [courseId]: { ...(prev[courseId] || {}), [chapterId]: true } }));
  };

  const getCourseProgress = (courseId, chapters) => {
    const done = Object.keys(progress[courseId] || {}).length;
    return chapters?.length ? Math.round((done / chapters.length) * 100) : 0;
  };

  return (
    <div className="app">
      <Navbar page={page} navigate={navigate} enrolledCount={enrolled.length} onSearch={setSearchQuery} searchQuery={searchQuery} />
      <main className="main-content">
        {page === 'home' && <HomePage courses={courses} loading={loading} navigate={navigate} enroll={enroll} enrolled={enrolled} onOpenChat={() => setChatOpen(true)} />}
        {page === 'courses' && <CoursesPage courses={courses} loading={loading} navigate={navigate} enroll={enroll} enrolled={enrolled} categories={categories} filterCategory={filterCategory} setFilterCategory={setFilterCategory} filterLevel={filterLevel} setFilterLevel={setFilterLevel} searchQuery={searchQuery} setSearchQuery={setSearchQuery} getCourseProgress={getCourseProgress} />}
        {page === 'course' && selectedCourse && <CourseDetailPage course={selectedCourse} enroll={enroll} enrolled={enrolled} progress={progress[selectedCourse.id] || {}} markChapter={markChapter} getCourseProgress={getCourseProgress} onOpenChat={() => setChatOpen(true)} navigate={navigate} />}
        {page === 'dashboard' && <DashboardPage enrolled={enrolled} progress={progress} getCourseProgress={getCourseProgress} navigate={navigate} onOpenChat={() => setChatOpen(true)} />}
      </main>
      <AIChat open={chatOpen} onClose={() => setChatOpen(false)} courseContext={page === 'course' ? selectedCourse : null} API={API} />
      {!chatOpen && (
        <button className="chat-fab" onClick={() => setChatOpen(true)} title="Open AI Assistant">
          <span className="chat-fab-icon">🤖</span>
          <span className="chat-fab-pulse" />
        </button>
      )}
    </div>
  );
}
