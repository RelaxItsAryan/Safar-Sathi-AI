import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { db } from "./firebase";
import { UserProfile } from "./auth";

export interface FirestoreSavedTrip {
  id?: string;
  user_id: string;
  destination: string;
  days: number;
  budget: number;
  currency: string;
  overview?: string;
  itinerary?: any[];
  weather?: any[];
  cost_breakdown?: any[];
  places?: any[];
  created_at: string;
}

/**
 * Get profile for a user ID
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, "profiles", userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching profile from Firestore:", error);
    return null;
  }
}

/**
 * Update profile for a user
 */
export async function updateProfileData(userId: string, data: Partial<UserProfile>): Promise<void> {
  const docRef = doc(db, "profiles", userId);
  await setDoc(docRef, {
    ...data,
    updated_at: new Date().toISOString()
  }, { merge: true });
}

/**
 * Save a new planned trip to Firestore
 */
export async function saveTripToFirestore(tripData: Omit<FirestoreSavedTrip, "created_at">): Promise<string> {
  const tripsCol = collection(db, "saved_trips");
  const docRef = await addDoc(tripsCol, {
    ...tripData,
    created_at: new Date().toISOString()
  });
  return docRef.id;
}

/**
 * Get all saved trips for a user
 */
export async function getTripsForUser(userId: string): Promise<FirestoreSavedTrip[]> {
  try {
    const tripsCol = collection(db, "saved_trips");
    // Try query with order first
    try {
      const q = query(tripsCol, where("user_id", "==", userId), orderBy("created_at", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<FirestoreSavedTrip, "id">)
      }));
    } catch (orderErr) {
      // Fallback if composite index is building or not created
      const qFallback = query(tripsCol, where("user_id", "==", userId));
      const snapshot = await getDocs(qFallback);
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<FirestoreSavedTrip, "id">)
      }));
      return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  } catch (error) {
    console.error("Error fetching trips:", error);
    return [];
  }
}

/**
 * Get a specific trip by its document ID
 */
export async function getTripById(tripId: string): Promise<FirestoreSavedTrip | null> {
  try {
    const docRef = doc(db, "saved_trips", tripId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return {
        id: snap.id,
        ...(snap.data() as Omit<FirestoreSavedTrip, "id">)
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching trip by ID:", error);
    return null;
  }
}

/**
 * Delete a saved trip by ID
 */
export async function deleteTripFromFirestore(tripId: string): Promise<void> {
  const docRef = doc(db, "saved_trips", tripId);
  await deleteDoc(docRef);
}
