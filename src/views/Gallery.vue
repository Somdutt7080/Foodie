<template>
  <v-container>
    <!-- Title & Toggle -->
    <v-row align="center" justify="space-between">
      <h2>Image Gallery</h2>
      <div class="d-flex align-center gap-2">
        <v-btn color="primary" prepend-icon="mdi-plus">Add New Image</v-btn>
        <v-btn icon @click="toggleView">
          <v-icon>{{ isGridView ? 'mdi-view-list' : 'mdi-view-grid' }}</v-icon>
        </v-btn>
      </div>
    </v-row>

    <!-- Grid View -->
    <v-row v-if="isGridView" class="mt-4" dense>
      <v-col
        v-for="(meal, index) in meals"
        :key="index"
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card class="gallery-card h-100 d-flex flex-column">
          <v-img
            :src="meal.strMealThumb"
            height="180"
            cover
            class="gallery-img"
          />
          <v-card-title class="text-wrap py-2">{{ meal.strMeal }}</v-card-title>
          <v-card-text class="flex-grow-1 d-flex flex-column justify-space-between">
            <div>
              <div><strong>Description:</strong> {{ meal.strMeal }}</div>
              <div class="mt-2"><strong>Tags:</strong></div>
              <div class="d-flex flex-wrap" style="min-height: 36px;">
                <v-chip
                  v-for="(tag, i) in meal.tags"
                  :key="i"
                  size="small"
                  class="ma-1"
                  color="blue-lighten-4"
                  text-color="blue-darken-4"
                >
                  {{ tag }}
                </v-chip>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Table View -->
    <v-data-table
      v-else
      :headers="headers"
      :items="meals"
      class="elevation-1 mt-4"
    >
      <template v-slot:item.strMealThumb="{ item }">
        <v-img :src="item.strMealThumb" height="100" width="150" cover />
      </template>

      <template v-slot:item.tags="{ item }">
        <div class="d-flex flex-wrap">
          <v-chip
            v-for="(tag, i) in item.tags"
            :key="i"
            size="small"
            class="ma-1"
            color="blue-lighten-4"
            text-color="blue-darken-4"
          >
            {{ tag }}
          </v-chip>
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../plugins/firebase'

export default {
  name: 'GalleryView',
  data() {
    return {
      meals: [],
      isGridView: true,
      headers: [
        { title: 'Image', key: 'strMealThumb' },
        { title: 'Title', key: 'strMeal' },
        { title: 'Description', key: 'strMeal' },
        { title: 'Tags', key: 'tags' },
      ],
    }
  },
  methods: {
    async fetchMeals() {
      const querySnapshot = await getDocs(collection(db, 'recipes'))
      this.meals = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          ...data,
          tags: data.strTags ? data.strTags.split(',') : [],
        }
      })
    },
    toggleView() {
      this.isGridView = !this.isGridView
    },
  },
  mounted() {
    this.fetchMeals()
  },
}
</script>

<style scoped>
.gallery-card {
  min-height: 390px;
  max-height: 390px;
  overflow: hidden;
}

.gallery-img {
  border-bottom: 1px solid #eee;
}
</style>
