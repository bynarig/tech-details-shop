import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

// Create a storage object that works in both browser and server environments
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Use localStorage if available, otherwise use the noop storage
const storage = typeof window !== 'undefined' 
  ? createWebStorage('local') 
  : createNoopStorage();

export default storage;