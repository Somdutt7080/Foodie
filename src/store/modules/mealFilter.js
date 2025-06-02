// store/modules/mealFilter.js
import { db } from '../../plugins/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default {
  namespaced: true,
  state: () => ({
    mealsByLetter: [],
  }),
  mutations: {
    setMealsByLetter(state, meals) {
      state.mealsByLetter = meals
    },
  },
  actions: {
    async fetchMealsByLetter({ commit }, letter) {
      try {
        const recipesRef = collection(db, 'recipes')
        const nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1)
        const q = query(
          recipesRef,
          where('strMeal', '>=', letter),
          where('strMeal', '<', nextLetter)
        )
        const querySnapshot = await getDocs(q)
        const meals = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        commit('setMealsByLetter', meals)
      } catch (error) {
        console.error('Error fetching meals by letter:', error)
        commit('setMealsByLetter', [])
      }
    },
    async searchMealsByName({ commit }, searchTerm) {
  try {
    if (!searchTerm) {
      commit('setMealsByLetter', [])
      return
    }

    const capitalized = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)
    const next = capitalized.slice(0, -1) + String.fromCharCode(capitalized.charCodeAt(capitalized.length - 1) + 1)

    const recipesRef = collection(db, 'recipes')
    const q = query(
      recipesRef,
      where('strMeal', '>=', capitalized),
      where('strMeal', '<', next)
    )
    const querySnapshot = await getDocs(q)
    const meals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    commit('setMealsByLetter', meals)
  } catch (error) {
    console.error('Error searching meals by name:', error)
    commit('setMealsByLetter', [])
  }
    },

  },
}
