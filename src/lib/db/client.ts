export type ThemeMode = "light" | "dark" | "system";

type SettingRecord = {
  key: string;
  value: string;
};

export type ActivityRecord = {
  toolId: string;
  count: number;
  lastVisitedAt: string;
};

export type ToolHistoryRecord = {
  id: string;
  toolId: string;
  label: string;
  /** 可选摘要（如复制内容前 80 字），勿存敏感长文 */
  detail?: string;
  createdAt: string;
};

const DB_NAME = "devEaseDB";
const DB_VERSION = 2;
const SETTINGS_STORE = "settings";
const ACTIVITY_STORE = "activity";
const HISTORY_STORE = "toolHistory";

const MAX_HISTORY_PER_TOOL = 50;

const memorySettings = new Map<string, string>();
const memoryActivity = new Map<string, ActivityRecord>();
const memoryHistory = new Map<string, ToolHistoryRecord[]>();

const supportsIdb = (): boolean =>
  typeof window !== "undefined" && "indexedDB" in window;

const notifyToolHistoryUpdated = (toolId: string): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent("dev-ease-tool-history", { detail: { toolId } }));
};

const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!supportsIdb()) {
      reject(new Error("IndexedDB is not supported in this environment."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = request.result;
      const old = event.oldVersion;

      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: "key" });
      }

      if (!db.objectStoreNames.contains(ACTIVITY_STORE)) {
        db.createObjectStore(ACTIVITY_STORE, { keyPath: "toolId" });
      }

      if (old < 2 && !db.objectStoreNames.contains(HISTORY_STORE)) {
        const h = db.createObjectStore(HISTORY_STORE, { keyPath: "id" });
        h.createIndex("toolId", "toolId", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB."));
  });
};

const deleteRecordByKey = (store: IDBObjectStore, key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error ?? new Error("IndexedDB delete failed."));
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

/** 读取 activity 仓库全部记录（用于关于页汇总统计） */
export const getAllToolActivities = async (): Promise<ActivityRecord[]> => {
  if (!supportsIdb()) {
    return Array.from(memoryActivity.values());
  }

  try {
    return await withStore<ActivityRecord[]>("readonly", ACTIVITY_STORE, async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve((request.result as ActivityRecord[]) ?? []);
        request.onerror = () => reject(request.error ?? new Error("IndexedDB getAll failed."));
      });
    });
  } catch (error) {
    console.error("Failed to read all activity from IndexedDB.", error);
    return Array.from(memoryActivity.values());
  }
};

/** 追加一条工具历史，并裁剪单工具超出条数 */
export const appendToolHistory = async (input: {
  toolId: string;
  label: string;
  detail?: string;
}): Promise<void> => {
  const record: ToolHistoryRecord = {
    id: crypto.randomUUID(),
    toolId: input.toolId,
    label: input.label,
    detail: input.detail,
    createdAt: new Date().toISOString(),
  };

  const list = memoryHistory.get(record.toolId) ?? [];
  list.unshift(record);
  memoryHistory.set(record.toolId, list.slice(0, MAX_HISTORY_PER_TOOL));

  if (!supportsIdb()) {
    notifyToolHistoryUpdated(record.toolId);
    return;
  }

  try {
    await withStore<void>("readwrite", HISTORY_STORE, async (store) => {
      await putRecord(store, record);
      const index = store.index("toolId");
      const allForTool = await new Promise<ToolHistoryRecord[]>((resolve, reject) => {
        const req = index.getAll(record.toolId);
        req.onsuccess = () => resolve((req.result as ToolHistoryRecord[]) ?? []);
        req.onerror = () => reject(req.error ?? new Error("IndexedDB getAll history failed."));
      });

      if (allForTool.length <= MAX_HISTORY_PER_TOOL) {
        return;
      }

      allForTool.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      const toRemove = allForTool.slice(0, allForTool.length - MAX_HISTORY_PER_TOOL);
      for (const r of toRemove) {
        await deleteRecordByKey(store, r.id);
      }
    });
  } catch (error) {
    console.error("Failed to append tool history.", error);
  }

  notifyToolHistoryUpdated(record.toolId);
};

export const getToolHistory = async (
  toolId: string,
  limit = 30,
): Promise<ToolHistoryRecord[]> => {
  if (!supportsIdb()) {
    return (memoryHistory.get(toolId) ?? []).slice(0, limit);
  }

  try {
    const rows = await withStore<ToolHistoryRecord[]>("readonly", HISTORY_STORE, async (store) => {
      return new Promise((resolve, reject) => {
        const req = store.index("toolId").getAll(toolId);
        req.onsuccess = () => resolve((req.result as ToolHistoryRecord[]) ?? []);
        req.onerror = () => reject(req.error ?? new Error("IndexedDB read history failed."));
      });
    });

    return rows
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  } catch (error) {
    console.error("Failed to read tool history.", error);
    return (memoryHistory.get(toolId) ?? []).slice(0, limit);
  }
};

export const clearToolHistory = async (toolId: string): Promise<void> => {
  memoryHistory.set(toolId, []);

  if (!supportsIdb()) {
    notifyToolHistoryUpdated(toolId);
    return;
  }

  try {
    await withStore<void>("readwrite", HISTORY_STORE, async (store) => {
      const allForTool = await new Promise<ToolHistoryRecord[]>((resolve, reject) => {
        const req = store.index("toolId").getAll(toolId);
        req.onsuccess = () => resolve((req.result as ToolHistoryRecord[]) ?? []);
        req.onerror = () => reject(req.error ?? new Error("IndexedDB list history failed."));
      });
      for (const r of allForTool) {
        await deleteRecordByKey(store, r.id);
      }
    });
  } catch (error) {
    console.error("Failed to clear tool history.", error);
  }

  notifyToolHistoryUpdated(toolId);
};
