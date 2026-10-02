import { createSeed, SEED_VERSION, type MockDb } from "./seed";

const STORAGE_KEY = "filmograf-mock-db";

// Состояние мок-бэкенда живёт в localStorage, чтобы созданные коллекции,
// оценки и комментарии переживали перезагрузку (в т.ч. на телефоне).
// Если хранилище недоступно — просто работаем в памяти.
const load = (): MockDb => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MockDb;
      if (parsed.version === SEED_VERSION) return parsed;
    }
  } catch {
    // ignore
  }
  return createSeed();
};

export const db: MockDb = load();

export const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // ignore
  }
};

export const resetMockDb = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  Object.assign(db, createSeed());
};

export const nextId = (prefix: string) => {
  db.seq += 1;
  return `${prefix}${db.seq}`;
};

export const now = () => new Date().toISOString();
