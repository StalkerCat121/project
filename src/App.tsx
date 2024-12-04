import React, { useEffect } from 'react';
import { CourseForm } from './components/CourseForm';
import { CourseList } from './components/CourseList';
import { Header } from './components/Header';
import { AuthPage } from './components/AuthPage';
import { useStore } from './store/useStore';
import { useTheme } from './store/useTheme';

function App() {
  const { currentUser, initialize } = useStore();
  const isDark = useTheme((state) => state.isDark);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4">
        {!currentUser ? (
          <AuthPage />
        ) : (
          <div className="space-y-8">
            {currentUser.role === 'teacher' && <CourseForm />}
            <CourseList />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;