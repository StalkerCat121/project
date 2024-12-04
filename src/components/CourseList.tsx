import React from 'react';
import { useStore } from '../store/useStore';
import { EnrolledStudents } from './EnrolledStudents';

export function CourseList() {
  const courses = useStore(state => state.courses);
  const users = useStore(state => state.users);
  const enrollStudent = useStore(state => state.enrollStudent);
  const currentUser = useStore(state => state.currentUser);

  const handleEnroll = async (courseId: string) => {
    if (currentUser && currentUser.role === 'student') {
      try {
        await enrollStudent(courseId, currentUser.id);
      } catch (error) {
        console.error('Failed to enroll:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Available Courses</h2>
      <div className="grid gap-4">
        {courses.map(course => {
          const isEnrolled = currentUser && course.enrolledStudents.includes(currentUser.id);
          const teacher = users.find(u => u.id === course.teacherId);

          return (
            <div key={course.id} className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{course.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">Date: {new Date(course.date).toLocaleDateString()}</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Teacher: {teacher?.name}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">{course.description}</p>
                </div>
                {currentUser?.role === 'student' && (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    className={`px-4 py-2 rounded-md ${
                      isEnrolled
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 cursor-default'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                    disabled={isEnrolled}
                  >
                    {isEnrolled ? 'Enrolled' : 'Enroll'}
                  </button>
                )}
              </div>
              <EnrolledStudents courseId={course.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}