const fs = require('fs');
const path = require('path');

const collections = ['project', 'skill', 'experience', 'education', 'gallery', 'message', 'testimonial', 'service'];

const servicesDir = path.join(__dirname, 'src', 'services');
const hooksDir = path.join(__dirname, 'src', 'hooks');

if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir, { recursive: true });
if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir, { recursive: true });

collections.forEach(name => {
  const collectionName = name + 's';
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  const capitalizedCollection = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);

  // Service
  const serviceContent = `import {
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

const COLLECTION = "${collectionName}";

export async function get${capitalizedCollection}() {
  try {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("Error fetching ${collectionName}:", e);
    return [];
  }
}

export async function add${capitalizedName}(data) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function update${capitalizedName}(id, data) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function delete${capitalizedName}(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
`;

  fs.writeFileSync(path.join(servicesDir, `${name}Service.js`), serviceContent);

  // Hook
  const hookContent = `"use client";
import { useState, useEffect, useCallback } from "react";
import { get${capitalizedCollection} } from "@/services/${name}Service";

export function use${capitalizedCollection}() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await get${capitalizedCollection}();
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ${collectionName}: data, loading, error, refetch: fetchData };
}
`;

  fs.writeFileSync(path.join(hooksDir, `use${capitalizedCollection}.js`), hookContent);
});

// Write Auth Hook
const useAuthContent = `"use client";
import { useAuthContext } from "@/context/AuthContext";

export function useAuth() {
  return useAuthContext();
}
`;
fs.writeFileSync(path.join(hooksDir, 'useAuth.js'), useAuthContent);

console.log("Generated successfully.");
