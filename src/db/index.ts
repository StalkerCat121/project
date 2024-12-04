import { openDB } from 'idb';
import type { User, Course } from '../types';

const DB_NAME = 'courseRegistrationDB';
const DB_VERSION = 1;

const getDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('courses')) {
        db.createObjectStore('courses', { keyPath: 'id' });
      }
    },
  });
};

export const dbOperations = {
  async getAllUsers(): Promise<User[]> {
    const db = await getDB();
    return db.getAll('users');
  },

  async addUser(user: User): Promise<void> {
    const db = await getDB();
    await db.add('users', user);
  },

  async getAllCourses(): Promise<Course[]> {
    const db = await getDB();
    return db.getAll('courses');
  },

  async addCourse(course: Course): Promise<void> {
    const db = await getDB();
    await db.add('courses', course);
  },

  async updateCourse(course: Course): Promise<void> {
    const db = await getDB();
    await db.put('courses', course);
  },

  async clearAll(): Promise<void> {
    const db = await getDB();
    await db.clear('users');
    await db.clear('courses');
  }
};