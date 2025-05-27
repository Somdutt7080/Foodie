<template>
  <v-container>
    <v-text-field
      v-model="ingredient"
      label="Search by Ingredient (e.g., chicken)"
      @input="fetchMeals"
      clearable
    ></v-text-field>
    <v-row>
      <v-col
        v-for="meal in meals"
        :key="meal.idMeal"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card @click="goToMeal(meal.idMeal)" class="hoverable">
          <v-img :src="meal.strMealThumb" height="200px"></v-img>
          <v-card-title>{{ meal.strMeal }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Ingredients',
  data() {
    return {
      ingredient: '',
      meals: [],
    }
  },
  methods: {
    async fetchMeals() {
      if (this.ingredient.trim() === '') {
        this.meals = []
        return
      }
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${this.ingredient}`
      )
      this.meals = response.data.meals || []
    },
    goToMeal(id) {
      this.$router.push(`/meal/${id}`)
    },
  },
}
</script>
