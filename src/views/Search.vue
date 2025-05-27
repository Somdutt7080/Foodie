<template>
  <v-container>
    <v-text-field
      v-model="searchQuery"
      label="Search meals by name"
      @input="searchMeals"
      outlined
      dense
    ></v-text-field>
    <v-row>
      <v-col
        v-for="meal in meals"
        :key="meal.idMeal"
        cols="12" sm="4" md="3"
      >
        <v-card @click="goToMeal(meal.idMeal)" class="ma-2">
          <v-img :src="meal.strMealThumb" height="200px"></v-img>
          <v-card-title>{{ meal.strMeal }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'Search',
  data() {
    return {
      searchQuery: ''
    };
  },
  computed: {
    ...mapState(['meals'])
  },
  methods: {
    ...mapActions(['fetchMealsByName']),
    searchMeals() {
      if (this.searchQuery.trim()) {
        this.fetchMealsByName(this.searchQuery);
      }
    },
    goToMeal(id) {
      this.$router.push(`/meal/${id}`);
    }
  }
};
</script>
