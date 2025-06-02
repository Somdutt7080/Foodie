<template>
  <v-container>
    <v-text-field v-model="searchTerm" label="Search for a meal" outlined @input="searchMeals" clearable />

    <v-row>
      <v-col v-for="meal in meals" :key="meal.id" cols="12" sm="6" md="3" class="d-flex justify-center">
        <v-card @click="$router.push(`/meal/${meal.id}`)" class="meal-card" elevation="2" rounded="lg">
          <v-img :src="meal.strMealThumb" height="140" class="rounded-lg" cover />
          <div class="card-text-wrapper">
            <p class="meal-name">
              {{ meal.strMeal }}
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Search',
  data() {
    return {
      searchTerm: '',
    }
  },
  computed: {
    ...mapState('mealFilter', ['mealsByLetter']),
    meals() {
      return this.mealsByLetter
    },
  },
  methods: {
    searchMeals() {
      this.$store.dispatch('mealFilter/searchMealsByName', this.searchTerm)
    },
  },
}
</script>
<style scoped>
.meal-card {
  width: 100%;
  padding: 8px;
  max-width: 270px;
  background-color: #fffafc;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border-radius: 12px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.meal-card:hover {
  transform: translateY(-6px);
  box-shadow: 0px 10px 18px rgba(0, 0, 0, 0.15);
}

.card-text-wrapper {
  padding: 12px;
  text-align: center;
  flex-grow: 1;
}

.meal-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin: 0;
}
</style>
