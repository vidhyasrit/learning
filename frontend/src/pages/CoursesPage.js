import React from 'react';
import CourseCard from '../components/CourseCard';

const LEVELS = ['All','Beginner','Intermediate','Advanced'];

export default function CoursesPage({
  courses, loading, navigate, enroll, enrolled,
  categories, filterCategory, setFilterCategory,
  filterLevel, setFilterLevel, searchQuery, setSearchQuery, getCourseProgress,
}) {
  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1 className="page-title">Explore Courses</h1>
        <p className="page-sub">{courses.length} courses available</p>
      </div>

      <div className="filters-bar">
        <div className="filter-search">
          <span>🔍</span>
          <input type="text" placeholder="Search by title, topic, instructor..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="filter-input" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="clear-btn">✕</button>}
        </div>
        <div className="filter-group">
          <label>Category</label>
          <div className="filter-chips">
            {categories.map(c => (
              <button key={c} className={`filter-chip ${filterCategory===c?'active':''}`} onClick={() => setFilterCategory(c)}>{c}</button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label>Level</label>
          <div className="filter-chips">
            {LEVELS.map(l => (
              <button key={l} className={`filter-chip ${filterLevel===l?'active':''}`} onClick={() => setFilterLevel(l)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-grid">{[...Array(6)].map((_,i) => <div key={i} className="skeleton-card" />)}</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No courses found</h3>
          <p>Try adjusting your search or filters</p>
          <button className="btn-primary" onClick={() => { setSearchQuery(''); setFilterCategory('All'); setFilterLevel('All'); }}>Clear Filters</button>
        </div>
      ) : (
        <div className="courses-grid wide">
          {courses.map(c => {
            const isEnrolled = !!enrolled.find(e => e.id===c.id);
            return (
              <CourseCard key={c.id} course={c} onView={course => navigate('course',course)}
                onEnroll={enroll} isEnrolled={isEnrolled}
                progress={isEnrolled ? getCourseProgress(c.id, c.chapters) : undefined} />
            );
          })}
        </div>
      )}
    </div>
  );
}
