import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User,
  NextOrObserver
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";

export interface UserProfile {
  user_id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  travel_preferences: string[];
  created_at?: any;
  updated_at?: any;
}

/**
 * Syncs user auth profile to Firestore `profiles` collection
 */
export async function syncUserProfile(user: User, customDisplayName?: string) {
  try {
    const userDocRef = doc(db, "profiles", user.uid);
    const existingSnap = await getDoc(userDocRef);

    if (!existingSnap.exists()) {
      const newProfile: UserProfile = {
        user_id: user.uid,
        email: user.email || "",
        display_name: customDisplayName || user.displayName || user.email?.split("@")[0] || "Traveler",
        avatar_url: user.photoURL || null,
        travel_preferences: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await setDoc(userDocRef, newProfile);
    } else if (customDisplayName && customDisplayName !== existingSnap.data()?.display_name) {
      await setDoc(userDocRef, {
        display_name: customDisplayName,
        updated_at: new Date().toISOString()
      }, { merge: true });
    }
  } catch (err) {
    console.error("Error syncing user profile:", err);
  }
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  if (result.user) {
    await syncUserProfile(result.user);
  }
  return result;
}

/**
 * Sign up with Email & Password
 */
export async function signUpWithEmail(email: string, password: string, fullName: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (result.user) {
    if (fullName) {
      await updateProfile(result.user, { displayName: fullName });
    }
    await syncUserProfile(result.user, fullName);
  }
  return result;
}

/**
 * Sign in with Email & Password
 */
export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  if (result.user) {
    await syncUserProfile(result.user);
  }
  return result;
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  return signOut(auth);
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuth(callback: NextOrObserver<User>) {
  return onAuthStateChanged(auth, callback);
}
