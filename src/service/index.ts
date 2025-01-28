import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBc94PFXJbCabgz9FXYcs8Ehc7Uv3m6-Gs",
  authDomain: "firestorebot-5ba06.firebaseapp.com",
  projectId: "firestorebot-5ba06",
  storageBucket: "firestorebot-5ba06.firebasestorage.app",
  messagingSenderId: "137747711103",
  appId: "1:137747711103:web:4954b02e81388f41da6b4a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to save userId and selectedOptions to Firestore
export const saveUserId = async (userData: { userId: string; selectedOptions: string[] }) => {
  try {
    console.log("Attempting to save user data:", userData);
    const addUser = await addDoc(collection(db, "users"), {
      userId: userData.userId,
      selectedOptions: userData.selectedOptions,
    });
    console.log("User data saved with ID:", addUser.id);
  } catch (error) {
    console.error("Error saving user data to Firestore:", error);
  }
};

// Check if user exists
export const checkUser = async (userId: string): Promise<boolean> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty; // Returns true if userId exists
};

export const getVote = async () => {
  try {
    // ดึงข้อมูลทั้งหมดจากคอลเลกชัน "users"
    const querySnapshot = await getDocs(collection(db, "users"));
    
    // สร้างตัวแปรเก็บผลรวมของแต่ละตัวเลือก
    const voteCounts: Record<string, number> = {};

    // รวมคะแนนโหวตจากแต่ละเอกสาร
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.selectedOptions && Array.isArray(data.selectedOptions)) {
        data.selectedOptions.forEach((option: string) => {
          voteCounts[option] = (voteCounts[option] || 0) + 1;
        });
      }
    });

    return voteCounts; // ส่งผลรวมของคะแนนโหวตกลับ
  } catch (error) {
    console.error("Error fetching vote data from Firestore:", error);
    throw error; // ส่ง error กลับไปหากมีปัญหา
  }
};

