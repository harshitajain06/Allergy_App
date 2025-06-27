import { auth, db } from "@/config/firebase"; // adjust path
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface Allergen {
  id: string;
  name: string;
  severity: "mild" | "moderate" | "severe";
  comments: string;
  dateAdded: string;
}

interface AllergenContextType {
  allergens: Allergen[];
  loading: boolean;
  error: string | null;
  addAllergen: (allergen: Omit<Allergen, "id" | "dateAdded">) => void;
  removeAllergen: (id: string) => void;
}

const AllergenContext = createContext<AllergenContextType | undefined>(
  undefined
);

export const useAllergens = () => {
  const context = useContext(AllergenContext);
  if (!context) {
    throw new Error("useAllergens must be used within an AllergenProvider");
  }
  return context;
};

export const AllergenProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "allergens"),
      where("userId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Allergen[];
        setAllergens(data);
        setLoading(false);
      },
      (err) => {
        setError("Failed to load allergens");
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addAllergen = async (
    newAllergen: Omit<Allergen, "id" | "dateAdded">
  ) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, "allergens"), {
        ...newAllergen,
        userId: user.uid,
        dateAdded: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error adding allergen:", err);
    }
  };

  const removeAllergen = async (id: string) => {
    try {
      await deleteDoc(doc(db, "allergens", id));
    } catch (err) {
      console.error("Error removing allergen:", err);
    }
  };

  return (
    <AllergenContext.Provider
      value={{ allergens, loading, error, addAllergen, removeAllergen }}
    >
      {children}
    </AllergenContext.Provider>
  );
};
