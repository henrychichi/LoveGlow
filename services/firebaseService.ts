import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged, 
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadString, 
  getDownloadURL 
} from 'firebase/storage';
import { firebaseConfig } from '../firebaseConfig';
import { UserData, LoveWallPost } from '../types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// --- Auth Services ---

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error signing out: ", error);
  }
};

export const sendPasswordResetEmail = async (email: string) => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

// --- Firestore Database Services ---

export const saveUserData = async (userData: UserData) => {
  if (!userData.uid) return;
  try {
    const userRef = doc(db, 'users', userData.uid);
    // Use setDoc with merge: true to update existing fields or create if not exists
    await setDoc(userRef, userData, { merge: true });
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// --- Love Wall (Firestore) ---

export const addLoveWallPost = async (post: Omit<LoveWallPost, 'id' | 'likes'>) => {
  try {
    await addDoc(collection(db, 'lovewall'), {
      ...post,
      likes: 0,
      timestamp: serverTimestamp() // Use server timestamp for sorting
    });
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
};

export const subscribeToLoveWall = (callback: (posts: LoveWallPost[]) => void) => {
  const q = query(collection(db, 'lovewall'), orderBy('timestamp', 'desc'), limit(50));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const posts: LoveWallPost[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id, // Use Firestore Doc ID as the ID
        ...data
      } as LoveWallPost);
    });
    callback(posts);
  });
  
  return unsubscribe;
};

// --- Storage Services ---

export const uploadFile = async (fileDataUrl: string, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadString(storageRef, fileDataUrl, 'data_url');
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteUserAccount = async () => {
  const user = auth.currentUser;
  if (user) {
    await user.delete();
  }
};