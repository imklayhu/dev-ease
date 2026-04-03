export type ThemeMode = "light" | "dark" | "system";

type SettingRecord = {
  key: string;
  value: string;
};

type ActivityRecord = {
  toolId: string;
  count: number;
  lastVisitedAt: string;
};

const DB_NAME = "devEaseDB";
const DB_VERSION = 1;
const SETTINGS_STORE = "settings";
const ACTIVITY_STORE = "activity";

const memorySettings = new Map<string, string>();
const memoryActivity = new Map<string, ActivityRecord>();

const supportsIdb = (): boolean =>
  typeof window !== "undefined" && "indexedDB" in window;

const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!supportsIdb()) {
      reject(new Error("IndexedDB is not supported in this environment."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: "key" });
      }

      if (!db.objectStoreNames.contains(ACTIVITY_STORE)) {
        db.createObjectStore(ACTIVITY_STORE, { keyPath: "toolId" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB."));
  });
};

const withStore = async <T>(
  mode: IDBTransactionMode,
  storeName: string,
  runner: (store: IDBObjectStore) => Promise<T>,
): Promise<T> => {
  const db = await openDb();

  try {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const result = await runner(store);

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error ?? new Error("IndexedDB transaction aborted."));
      tx.onerror = () => reject(tx.error ?? new Error("IndexedDB transaction failed."));
    });

    return result;
  } finally {
    db.close();
  }
};

const getRecord = <T>(store: IDBObjectStore, key: string): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB read failed."));
  });
};

const putRecord = <T>(store: IDBObjectStore, value: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = store.put(value);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error("IndexedDB write failed."));
  });
};

export const getThemeSetting = async (): Promise<ThemeMode> => {
  const fallback = (memorySettings.get("theme") ?? "system") as ThemeMode;

  if (!supportsIdb()) {
    return fallback;
  }

  try {
    const record = await withStore<SettingRecord | undefined>(
      "readonly",
      SETTINGS_STORE,
      async (store) => getRecord<SettingRecord>(store, "theme"),
    );

    return (record?.value ?? fallback) as ThemeMode;
  } catch (error) {
    console.error("Failed to read theme setting from IndexedDB.", error);
    return fallback;
  }
};

export const setThemeSetting = async (theme: ThemeMode): Promise<void> => {
  memorySettings.set("theme", theme);

  if (!supportsIdb()) {
    return;
  }

  try {
    await withStore<void>("readwrite", SETTINGS_STORE, async (store) => {
      await putRecord<SettingRecord>(store, { key: "theme", value: theme });
    });
  } catch (error) {
    console.error("Failed to write theme setting to IndexedDB.", error);
  }
};

export const getToolActivity = async (toolId: string): Promise<ActivityRecord> => {
  const fallback =
    memoryActivity.get(toolId) ??
    ({ toolId, count: 0, lastVisitedAt: "" } satisfies ActivityRecord);

  if (!supportsIdb()) {
    return fallback;
  }

  try {
    const record = await withStore<ActivityRecord | undefined>(
      "readonly",
      ACTIVITY_STORE,
      async (store) => getRecord<ActivityRecord>(store, toolId),
    );

    return record ?? fallback;
  } catch (error) {
    console.error("Failed to read activity from IndexedDB.", error);
    return fallback;
  }
};

export const recordToolVisit = async (toolId: string): Promise<ActivityRecord> => {
  const current = await getToolActivity(toolId);
  const nextActivity = {
    ...current,
    toolId,
    count: current.count + 1,
    lastVisitedAt: new Date().toISOString(),
  } satisfies ActivityRecord;

  memoryActivity.set(toolId, nextActivity);

  if (!supportsIdb()) {
    return nextActivity;
  }

  try {
    await withStore<void>("readwrite", ACTIVITY_STORE, async (store) => {
      await putRecord<ActivityRecord>(store, nextActivity);
    });
  } catch (error) {
    console.error("Failed to write activity to IndexedDB.", error);
  }

  return nextActivity;
};

export const isIndexedDbAvailable = (): boolean => supportsIdb();
