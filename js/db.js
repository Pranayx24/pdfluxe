/**
 * PDFLuxe Industrial Storage (IndexedDB)
 * Ensures zero-data loss and handles large file buffers securely.
 */

const DB_NAME = 'PDFLuxe_Industrial_DB';
const DB_VERSION = 1;

export const STORES = {
    WIP_SCANS: 'wip_scans',        // Work-in-progress scans (images as Blobs/DataURLs)
    TOOL_STATE: 'tool_state',      // Last used settings/queues
    FILE_HISTORY: 'file_history'   // Metadata of processed files (Local only)
};

export async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // 1. Scans Store
            if (!db.objectStoreNames.contains(STORES.WIP_SCANS)) {
                db.createObjectStore(STORES.WIP_SCANS, { keyPath: 'id' });
            }
            
            // 2. Tool State Store
            if (!db.objectStoreNames.contains(STORES.TOOL_STATE)) {
                db.createObjectStore(STORES.TOOL_STATE, { keyPath: 'toolId' });
            }

            // 3. History Store
            if (!db.objectStoreNames.contains(STORES.FILE_HISTORY)) {
                db.createObjectStore(STORES.FILE_HISTORY, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Generic Save/Get helpers
 */
export async function setItem(storeName, item) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.put(item);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

export async function getItem(storeName, key) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function getAll(storeName) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function removeItem(storeName, key) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.delete(key);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

export async function clearStore(storeName) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.clear();
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}
