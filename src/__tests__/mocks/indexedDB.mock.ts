import { vi } from 'vitest';

const createStore = () => {
  const store: { [key: string]: any } = {};
  return {
    get: vi.fn((key: string) => Promise.resolve(store[key])),
    put: vi.fn((value: any, key: string) => {
      store[key] = value;
      return Promise.resolve();
    }),
    add: vi.fn((value: any, key?: string) => {
      const id = key || crypto.randomUUID();
      if (store[id]) {
        return Promise.reject(new Error('Key already exists'));
      }
      store[id] = value;
      return Promise.resolve();
    }),
    getAll: vi.fn(() => Promise.resolve(Object.values(store))),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
      return Promise.resolve();
    }),
  };
};

const createObjectStore = () => {
  return createStore();
};

const DB_STORES = ['users', 'courses'];

const indexedDB = {
  databases: [] as any[],
  open: vi.fn().mockImplementation(() => {
    const request = {
      error: null,
      result: {
        objectStoreNames: {
          contains: (name: string) => DB_STORES.includes(name),
        },
        createObjectStore: vi.fn().mockImplementation(createObjectStore),
        transaction: vi.fn().mockImplementation(() => ({
          objectStore: vi.fn().mockImplementation(createObjectStore),
        })),
      },
      onupgradeneeded: null as any,
      onsuccess: null as any,
    };
    
    setTimeout(() => {
      request.onsuccess?.({ target: request });
    }, 0);
    
    return request;
  }),
};

export const setupIndexedDBMock = () => {
  const originalIndexedDB = global.indexedDB;
  beforeAll(() => {
    Object.defineProperty(global, 'indexedDB', {
      value: indexedDB,
      writable: true,
    });
  });
  
  afterAll(() => {
    Object.defineProperty(global, 'indexedDB', {
      value: originalIndexedDB,
      writable: true,
    });
  });
};