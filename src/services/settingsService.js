import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SETTINGS_COLLECTION = "settings";
const SETTINGS_ID = "portfolio";

export const DEFAULT_SETTINGS = {
  name: "Thamil",
  heroBio:
    "Crafting digital experiences with premium aesthetics and bleeding-edge technologies. I build solutions that don't just work—they inspire.",
  typewriterRoles: "Full-Stack Developer, UI/UX Designer, Cloud Architect, Creative Thinker",
  availabilityText: "Available for new opportunities",
  email: "hello@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  github: "",
  linkedin: "",
  twitter: "",
  whatsapp: "",
  cvUrl: "",
  aboutText:
    "I'm a passionate developer focused on building exceptional digital experiences. With expertise across the full stack, I bring ideas to life through clean code and thoughtful design.",
};

export async function getSettings() {
  if (!db) return DEFAULT_SETTINGS;

  try {
    const snap = await getDoc(doc(db, SETTINGS_COLLECTION, SETTINGS_ID));
    if (snap.exists()) {
      return { ...DEFAULT_SETTINGS, ...snap.data() };
    }
    return DEFAULT_SETTINGS;
  } catch (e) {
    const isOffline =
      e?.code === "unavailable" ||
      e?.message?.includes("offline");
    if (!isOffline) {
      console.error("Error fetching settings:", e);
    }
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(data) {
  if (!db) throw new Error("Firestore is not available. Check your connection and .env.local.");
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_ID);
  await setDoc(
    docRef,
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
