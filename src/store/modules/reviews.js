import { db } from '../../plugins/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const actions = {
  async addReview(_, { mealId, review }) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    // Check if this user has already reviewed
    const reviewRef = collection(db, 'recipes', mealId, 'reviews');
    const q = query(reviewRef, where('userId', '==', user.uid));
    const existing = await getDocs(q);
    if (!existing.empty) {
      throw new Error('You have already submitted a review for this meal.');
    }

    await addDoc(reviewRef, {
      ...review,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
  },

  async fetchReviews(_, mealId) {
    const reviewRef = collection(db, 'recipes', mealId, 'reviews');
    const q = query(reviewRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async deleteReview(_, { mealId, reviewId }) {
    const reviewDocRef = doc(db, 'recipes', mealId, 'reviews', reviewId);
    await deleteDoc(reviewDocRef);
  },

  async editReview(_, { mealId, reviewId, updatedReview }) {
    const reviewDocRef = doc(db, 'recipes', mealId, 'reviews', reviewId);
    await updateDoc(reviewDocRef, {
      ...updatedReview,
      updatedAt: serverTimestamp()
    });
  }
};

export default {
  namespaced: true,
  actions
};
