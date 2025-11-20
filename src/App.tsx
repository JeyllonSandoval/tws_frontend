import { useState, useEffect } from 'react';
import { HiOutlineArrowLeft, HiOutlineChartBar , HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';
import './App.css';
import ReviewList from './components/ReviewList';
import ReviewForm from './components/ReviewForm';
import { api } from './services/api';
import { useTheme } from './hooks/useTheme';
import type { Review } from './types/review';

type ViewMode = 'list' | 'edit';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    // Initialize API status check on mount
    const checkApiStatus = async () => {
      try {
        await api.healthCheck();
        setApiStatus('online');
      } catch {
        setApiStatus('offline');
      }
    };
    
    void checkApiStatus();
  }, []);

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setViewMode('edit');
  };

  const handleDelete = (id: number) => {
    console.log(`Review ${id} deleted`);
  };

  const handleFormSuccess = () => {
    setViewMode('list');
    setSelectedReview(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedReview(null);
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <HiOutlineChartBar  className="title-icon" />
            TWS - Reviews
          </h1>
          <div className="header-actions">
            <div className={`api-status ${apiStatus}`}>
              <span className="status-indicator"></span>
              <span className="status-text">
                {apiStatus === 'checking' && 'Checking...'}
                {apiStatus === 'online' && 'API Online'}
                {apiStatus === 'offline' && 'API Offline'}
              </span>
            </div>
            <button 
              className="btn btn-theme" 
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <HiOutlineSun /> : <HiOutlineMoon />}
            </button>
            {viewMode === 'edit' && (
              <button className="btn btn-secondary" onClick={handleFormCancel}>
                <HiOutlineArrowLeft />
                Back
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {viewMode === 'list' && (
          <ReviewList
            onEdit={handleEdit}
            onDelete={handleDelete}
            refreshTrigger={refreshTrigger}
            onRefresh={handleRefresh}
          />
        )}

        {viewMode === 'edit' && selectedReview && (
          <ReviewForm
            review={selectedReview}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>
          Connected to{' '}
          <a
            href="https://tws-backend-jssr.up.railway.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            TWS Backend API
          </a>
          {', '}by {' '}
          <a
            href="https://www.linkedin.com/in/jeyllon-slon-sandoval-rosario-bb2292320/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jeyllon Sandoval
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
