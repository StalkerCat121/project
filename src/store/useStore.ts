import { create } from 'zustand';
import { User, Course } from '../types';
import { dbOperations } from '../db';

interface Store {
  currentUser: User | null;
  users: User[];
  courses: Course[];
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  addCourse: (course: Omit<Course, 'id' | 'enrolledStudents'>) => Promise<void>;
  enrollStudent: (courseId: string, studentId: string) => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  currentUser: null,
  users: [],
  courses: [],
  
  initialize: async () => {
    const [users, courses] = await Promise.all([
      dbOperations.getAllUsers(),
      dbOperations.getAllCourses(),
    ]);
    set({ users, courses });
  },
  
  login: async (email: string, password: string) => {
    const { users } = get();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    set({ currentUser: user });
  },
  
  addUser: async (userData) => {
    const existingUser = get().users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    const newUser = { ...userData, id: crypto.randomUUID() };
    await dbOperations.addUser(newUser);
    set((state) => ({
      users: [...state.users, newUser],
      currentUser: newUser
    }));
  },
  
  addCourse: async (courseData) => {
    const newCourse = {
      ...courseData,
      id: crypto.randomUUID(),
      enrolledStudents: []
    };
    await dbOperations.addCourse(newCourse);
    set((state) => ({
      courses: [...state.courses, newCourse]
    }));
  },
  
  enrollStudent: async (courseId, studentId) => {
    const { courses } = get();
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    if (course.enrolledStudents.includes(studentId)) {
      throw new Error('Student already enrolled');
    }
    
    const updatedCourse = {
      ...course,
      enrolledStudents: [...course.enrolledStudents, studentId]
    };
    
    await dbOperations.updateCourse(updatedCourse);
    
    set((state) => ({
      courses: state.courses.map(c =>
        c.id === courseId ? updatedCourse : c
      )
    }));
  },
  
  logout: async () => {
    set({ currentUser: null });
  }
}));