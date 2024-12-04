export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface Course {
  id: string;
  name: string;
  date: string;
  description: string;
  teacherId: string;
  enrolledStudents: string[];
}