import { collection, getDocs, addDoc } from "firebase/firestore";
import axios from "axios";
import { db } from "../../plugins/firebase";

export default {
  namespaced: true,
  state: {
    meals: [],
    firestoreMeals: [],
  },
  mutations: {
    setMeals(state, meals) {
      state.meals = meals;
    },
    setFirestoreMeals(state, firestoreMeals) {
      state.firestoreMeals = firestoreMeals;
    },
  },
  actions: {
    async fetchMeals({ commit }) {
      const res = await axios.get("https://www.themealdb.com/api/json/v1/1/search.php?s=");
      commit("setMeals", res.data.meals || []);
    },

    async uploadMealsToFirestore({ state }) {
      const recipesRef = collection(db, "recipes");
      for (const meal of state.meals) {
        await addDoc(recipesRef, meal);
      }
    },

    async addMealManually(_, meal) {
      const recipesRef = collection(db, "recipes");
      await addDoc(recipesRef, meal);
    },

    async fetchFirestoreMeals({ commit }) {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const recipes = [];
      querySnapshot.forEach((doc) => {
        recipes.push({ id: doc.id, ...doc.data() });
      });
      commit("setFirestoreMeals", recipes);
    },
  },
  getters: {
    allMeals(state) {
      return [...state.firestoreMeals, ...state.meals];
    },
  },
};
