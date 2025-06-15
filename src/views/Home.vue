<template>
  <FullPageLoader :show="loading" />

  <v-container fluid class="home-container pa-10">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-primary mb-6">Browse Meals</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="meal in meals"
        :key="meal.id"
        cols="12"
        sm="6"
        md="3"
        class="d-flex justify-center"
      >
        <v-card
          @click="goToMeal(meal.id)"
          class="meal-card"
          elevation="2"
          rounded="lg"
        >
          <v-img
            :src="meal.strMealThumb"
            height="140"
            class="rounded-lg"
            cover
          />
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import FullPageLoader from '../components/FullPageLoader.vue'

const store = useStore()
const router = useRouter()

const loading = ref(true)
const meals = computed(() => store.state.meals.firestoreMeals)

const goToMeal = (id) => {
  router.push(`/meal/${id}`)
}

onMounted(async () => {
  try {
    await store.dispatch('meals/fetchFirestoreMeals')
  } catch (e) {
    console.error('Failed to fetch meals:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.home-container {
  background: #f9f3fc;
  min-height: 100vh;
  border-radius: 16px;
}
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
