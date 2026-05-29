import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { offlineStorage } from "@/lib/offlineStorage";

const COLLECTION = "gallerys";

export async function getGallerys(forceRefresh = false) {
  try {
    if (typeof window !== "undefined" && !forceRefresh && !navigator.onLine) {
      const cached = await offlineStorage.getCachedGalleryItems();
      if (cached.length > 0) {
        return cached.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      }
    }

    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (typeof window !== "undefined") {
      await offlineStorage.cacheGalleryItems(items);
    }

    return items;
  } catch (e) {
    console.error("Error fetching gallerys:", e);
    if (typeof window !== "undefined") {
      const cached = await offlineStorage.getCachedGalleryItems();
      if (cached.length > 0) {
        return cached.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      }
    }
    return [];
  }
}

export async function addGallery(data) {
  if (typeof window !== "undefined" && !navigator.onLine) {
    const queueId = await offlineStorage.addToUploadQueue({
      action: "add",
      data,
    });
    return { offlineId: queueId, isOffline: true };
  }

  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, isOffline: false };
}

export async function updateGallery(id, data) {
  if (typeof window !== "undefined" && !navigator.onLine) {
    const queueId = await offlineStorage.addToUploadQueue({
      action: "update",
      id,
      data,
    });
    return { offlineId: queueId, isOffline: true };
  }

  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  return { isOffline: false };
}

export async function deleteGallery(id) {
  if (typeof window !== "undefined" && !navigator.onLine) {
    const queueId = await offlineStorage.addToUploadQueue({
      action: "delete",
      id,
    });
    return { offlineId: queueId, isOffline: true };
  }

  await deleteDoc(doc(db, COLLECTION, id));
  return { isOffline: false };
}

export async function syncOfflineQueue() {
  if (typeof window === "undefined" || !navigator.onLine) return;

  const queue = await offlineStorage.getUploadQueue();
  const pendingItems = queue.filter((item) => item.status === "pending");

  for (const item of pendingItems) {
    try {
      await offlineStorage.updateQueueItem(item.id, { status: "syncing" });

      if (item.action === "add") {
        const docRef = await addDoc(collection(db, COLLECTION), {
          ...item.data,
          createdAt: serverTimestamp(),
        });
        await offlineStorage.removeFromQueue(item.id);
      } else if (item.action === "update") {
        const docRef = doc(db, COLLECTION, item.id);
        await updateDoc(docRef, { ...item.data, updatedAt: serverTimestamp() });
        await offlineStorage.removeFromQueue(item.id);
      } else if (item.action === "delete") {
        await deleteDoc(doc(db, COLLECTION, item.id));
        await offlineStorage.removeFromQueue(item.id);
      }
    } catch (error) {
      console.error("Sync failed for item:", item, error);
      await offlineStorage.updateQueueItem(item.id, {
        status: "failed",
        retryCount: (item.retryCount || 0) + 1,
      });
    }
  }
}
