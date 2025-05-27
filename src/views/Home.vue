<template>
  <v-container>
    <!-- <v-row class="my-4" justify="space-between">
      <v-btn color="primary" @click="$router.push('/by-letter')">
        Search by Letter
      </v-btn>
      <v-btn color="secondary" @click="$router.push('/search')">
        Search by Name
      </v-btn>
      <v-btn color="secondary" @click="$router.push('/ingredient')">
        Search by Ingredient
      </v-btn>
    </v-row> -->
    <v-row>
      <v-col cols="12">
        <h2>Browse Meals</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="meal in meals"
        :key="meal.idMeal"
        cols="12"
        sm="6"
        md="4"
      >
     <v-card @click="$router.push(`/meal/${meal.idMeal}`)" class="hoverable" elevation="2">
          <v-img :src="meal.strMealThumb" height="200px" />
          <v-card-title>{{ meal.strMeal }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Home',
  data() {
    return {
      meals: [],
    }
  },
  methods: {
    async fetchMeals() {
      try {
        const res = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=')
        this.meals = res.data.meals
      } catch (err) {
        console.error('Failed to fetch meals:', err)
      }
    },
    goToMeal(id) {
      this.$router.push(`/meal/${id}`)
    },
  },
  mounted() {
    this.fetchMeals()
  },
}
</script>






