"use client";

const DB_NAME = "portfolioOfflineDB";
const DB_VERSION = 1;
const STORE_NAME = "galleryCache";
const UPLOAD_QUEUE_STORE = "uploadQueue";

class OfflineStorage {
  constructor() {
    this.db = null;
  }

  async init() {
    if (typeof window === "undefined") return;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("category", "category", { unique: false });
          store.createIndex("createdAt", "createdAt", { unique: false });
        }

        if (!db.objectStoreNames.contains(UPLOAD_QUEUE_STORE)) {
          const queueStore = db.createObjectStore(UPLOAD_QUEUE_STORE, { keyPath: "id", autoIncrement: true });
          queueStore.createIndex("status", "status", { unique: false });
        }
      };
    });
  }

  async cacheGalleryItems(items) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      
      items.forEach((item) => {
        store.put({ ...item, cachedAt: Date.now() });
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getCachedGalleryItems() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedGalleryItem(id) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteCachedItem(id) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async addToUploadQueue(item) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([UPLOAD_QUEUE_STORE], "readwrite");
      const store = transaction.objectStore(UPLOAD_QUEUE_STORE);
      const request = store.add({
        ...item,
        status: "pending",
        createdAt: Date.now(),
        retryCount: 0,
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUploadQueue() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([UPLOAD_QUEUE_STORE], "readonly");
      const store = transaction.objectStore(UPLOAD_QUEUE_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateQueueItem(id, updates) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([UPLOAD_QUEUE_STORE], "readwrite");
      const store = transaction.objectStore(UPLOAD_QUEUE_STORE);
      const request = store.get(id);

      request.onsuccess = () => {
        const data = request.result;
        const updated = { ...data, ...updates };
        const updateRequest = store.put(updated);
        
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async removeFromQueue(id) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([UPLOAD_QUEUE_STORE], "readwrite");
      const store = transaction.objectStore(UPLOAD_QUEUE_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearOldCache(maxAge = 7 * 24 * 60 * 60 * 1000) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result;
        const now = Date.now();
        const itemsToDelete = items.filter((item) => now - item.cachedAt > maxAge);

        itemsToDelete.forEach((item) => {
          store.delete(item.id);
        });

        transaction.oncomplete = () => resolve(itemsToDelete.length);
        transaction.onerror = () => reject(transaction.error);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineStorage = new OfflineStorage();
