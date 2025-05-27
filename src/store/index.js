import { createStore } from "vuex";
import axios from "axios";
import { db } from "../plugins/firebase";
import { collection, getDocs } from "firebase/firestore";
export default createStore({
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
      const res = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/search.php?s="
      );
      commit("setMeals", res.data.meals || []);
    },
    async fetchMealsByName({ commit }, name) {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
        );
        const data = await res.json();
        commit("setMeals", data.meals || []);
      } catch (error) {
        console.error("Error fetching meals by name:", error);
      }
    },
    // async fetchFirestoreMeals({ commit }) {
    //   const querySnapshot = await getDocs(collection(db, "recipes"));
    //   const recipes = [];
    //   querySnapshot.forEach((doc) => {
    //     recipes.push({ id: doc.id, ...doc.data() });
    //   });
    //   commit("setFirestoreMeals", recipes);
    // },
  },
  getters: {
    allMeals(state) {
      return [...state.firestoreMeals, ...state.meals];
    },
  },
});
