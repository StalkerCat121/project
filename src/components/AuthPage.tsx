import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegistrationForm } from './RegistrationForm';
import { Waves } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md transition-colors animate-fade-in max-w-md w-full">
      <div className="flex flex-col items-center mb-8">
        <Waves className="text-indigo-600 dark:text-indigo-400 mb-2" size={32} />
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Welcome to Neptun</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
          Your Course Registration System
        </p>
      </div>
      <div className="flex justify-between mb-6">
        <button
          className={`text-lg font-semibold transition-colors ${
            isLogin
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`text-lg font-semibold transition-colors ${
            !isLogin
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>
      {isLogin ? <LoginForm /> : <RegistrationForm />}
    </div>
  );
}