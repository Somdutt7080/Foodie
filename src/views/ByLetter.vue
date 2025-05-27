<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          v-for="letter in alphabet"
          :key="letter"
          @click="fetchMeals(letter)"
          class="ma-1"
          size="small"
          color="primary"
        >
          {{ letter }}
        </v-btn>
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
  name: 'ByLetter',
  data() {
    return {
      meals: [],
      alphabet: [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
    }
  },
  methods: {
    async fetchMeals(letter) {
      try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
        this.meals = response.data.meals || []
      } catch (error) {
        console.error('Error fetching meals:', error)
        this.meals = []
      }
    },
  },
}
</script>












