import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Users } from 'lucide-react';

interface EnrolledStudentsProps {
  courseId: string;
}

export function EnrolledStudents({ courseId }: EnrolledStudentsProps) {
  const course = useStore(state => state.courses.find(c => c.id === courseId));
  const users = useStore(state => state.users);

  const enrolledStudentsList = useMemo(() => {
    if (!course) return [];
    return course.enrolledStudents
      .map(studentId => users.find(u => u.id === studentId))
      .filter(Boolean);
  }, [course, users]);

  if (!course || enrolledStudentsList.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
        <Users size={18} />
        <span className="font-medium">Enrolled Students ({enrolledStudentsList.length})</span>
      </div>
      <div className="space-y-2">
        {enrolledStudentsList.map(student => (
          <div
            key={student?.id}
            className="text-sm bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md flex flex-col"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">{student?.name}</span>
            <span className="text-gray-600 dark:text-gray-300">{student?.email}</span>
          </div>
        ))}
      </div>
    </div>
  );
}