<template>
  <v-container class="pt-8">
    <!-- Main card -->
    <v-card v-if="meal" class="pa-4" elevation="2" rounded="xl">
      <v-row>
        <!-- LEFT: Image -->
        <v-col cols="12" md="6" class="d-flex flex-column align-center">
          <v-img :src="meal.strMealThumb" height="300" width="100%" class="rounded-lg mb-4" cover />
        </v-col>

        <!-- RIGHT: Info + Reviews + Ingredients -->
        <v-col cols="12" md="6">
          <!-- Meal Info + YouTube button -->
          <div class="d-flex justify-space-between align-center mb-4 flex-wrap">
            <div>
              <h2 class="text-h5 font-weight-bold font-italic text-purple-darken-3">{{ meal.strMeal }}</h2>
              <div class="text-body-2">Category: {{ meal.strCategory }}</div>
              <div class="text-body-2">Area: {{ meal.strArea }}</div>
            </div>
            <v-btn
              v-if="meal.strYoutube"
              :href="meal.strYoutube"
              target="_blank"
              color="red-darken-2"
              prepend-icon="mdi-youtube"
              class="mt-2 text-none font-weight-bold"
            >
              Watch on YouTube
            </v-btn>
          </div>

          <!-- Wrap Reviews + Ingredients -->
          <v-card class="pa-3 mb-4" color="#fbf9ff" rounded="xl" elevation="1">
            <!-- Review Form -->
            <v-card elevation="0" class="pa-3 mb-4 review-form-card" color="#f6f3ff">
              <h3 class="text-subtitle-1 font-weight-medium mb-2">Add a Review</h3>
              <v-rating
                v-model="newReview.rating"
                color="amber"
                background-color="grey-lighten-1"
                half-increments
                size="22"
              />
              <v-textarea
                v-model="newReview.text"
                label="Write your review..."
                auto-grow
                dense
                outlined
                hide-details
                class="rounded-lg mt-2"
              />
              <v-btn
                type="submit"
                color="deep-purple-accent-4"
                size="small"
                class="mt-2 text-none"
                @click="submitReview"
              >
                {{ editingReviewId ? 'Update Review' : 'Submit' }}
              </v-btn>
            </v-card>

            <!-- Review List -->
            <v-card elevation="0" class="pa-3 mb-4 review-list-card" color="#f9f6ff">
              <h3 class="text-subtitle-1 font-weight-medium mb-2">Reviews</h3>
              <v-alert v-if="reviews.length === 0" type="info" border="start" color="purple">No reviews yet.</v-alert>
              <v-list v-else density="compact">
                <v-list-item
                  v-for="review in sortedReviews"
                  :key="review.id"
                  class="rounded-lg mb-2"
                >
                  <v-list-item-content>
                    <v-rating
                      v-model="review.rating"
                      readonly
                      size="18"
                      color="amber"
                      background-color="grey-lighten-1"
                    />
                    <v-list-item-title class="text-body-2 mt-1">{{ review.text }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption grey--text">
                      {{ review.userName || review.userId }} - {{ formatDate(review.createdAt) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action v-if="review.userId === currentUserId || isAdmin">
                    <v-btn icon size="x-small" @click="startEditReview(review)">
                      <v-icon color="blue">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon size="x-small" @click="deleteReview(review.id)">
                      <v-icon color="red">mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>

            <!-- Ingredients Card -->
            <v-card class="pa-3 ingredient-card scrollable-container" elevation="0" rounded="lg">
              <h3 class="text-subtitle-1 font-weight-medium mb-3 text-primary">Ingredients</h3>
              <v-list density="compact" class="custom-ingredient-list">
                <v-list-item v-for="(ingredient, i) in ingredients" :key="i" class="py-1 px-0 ingredient-item">
                  <v-list-item-title class="ingredient-text">{{ ingredient }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-card>
        </v-col>
      </v-row>

      <!-- Divider + Scrollable Instructions -->
      <v-divider class="my-4" />
      <h3 class="text-subtitle-1 font-weight-medium mb-2">Instructions</h3>
      <div class="scrollable-instructions">
        <p class="text-body-1 text-grey-darken-3 font-italic">{{ meal.strInstructions }}</p>
      </div>
    </v-card>

    <v-alert v-else type="error" class="mt-4">Meal not found</v-alert>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'MealDetail',
  data() {
    return {
      ingredients: [],
      reviews: [],
      newReview: { text: '', rating: 0 },
      currentUserId: null,
      editingReviewId: null,
    };
  },
  computed: {
    ...mapState('meals', ['firestoreMeals']),
    meal() {
      const id = this.$route.params.id;
      return this.firestoreMeals.find((m) => m.id === id);
    },
    isAdmin() {
      return this.currentUserId === 'admin';
    },
    sortedReviews() {
      return [...(this.reviews || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
  },
  watch: {
    meal(newMeal) {
      if (newMeal) {
        this.extractIngredients(newMeal);
        this.fetchReviews();
      }
    },
  },
  async mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.currentUserId = user.uid;
      }
      if (this.meal) {
        this.extractIngredients(this.meal);
        await this.fetchReviews();
      } else {
        await this.$store.dispatch('meals/fetchFirestoreMeals');
      }
    });
  },
  methods: {
    extractIngredients(meal) {
      this.ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const meas = meal[`strMeasure${i}`];
        if (ing && ing.trim()) {
          this.ingredients.push(`${ing} - ${meas}`);
        }
      }
    },
    async fetchReviews() {
      try {
        this.reviews = await this.$store.dispatch('reviews/fetchReviews', this.meal.id);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        this.reviews = [];
      }
    },
    async submitReview() {
      if (!this.newReview.text.trim() || !this.newReview.rating) return;

      if (this.editingReviewId) {
        try {
          await this.$store.dispatch('reviews/editReview', {
            mealId: this.meal.id,
            reviewId: this.editingReviewId,
            updatedReview: {
              text: this.newReview.text,
              rating: this.newReview.rating,
            },
          });
          this.editingReviewId = null;
          this.newReview.text = '';
          this.newReview.rating = 0;
          await this.fetchReviews();
        } catch (err) {
          console.error('Failed to edit review:', err);
        }
        return;
      }

      const review = {
        text: this.newReview.text,
        rating: this.newReview.rating,
        userId: this.currentUserId,
        userName: this.$store.state.auth?.user?.displayName || 'User',
        createdAt: new Date().toISOString(),
      };
      try {
        await this.$store.dispatch('reviews/addReview', { mealId: this.meal.id, review });
        this.newReview.text = '';
        this.newReview.rating = 0;
        this.fetchReviews();
      } catch (error) {
        console.error('Failed to add review:', error);
      }
    },
    async deleteReview(reviewId) {
      try {
        await this.$store.dispatch('reviews/deleteReview', { mealId: this.meal.id, reviewId });
        this.fetchReviews();
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    },
    startEditReview(review) {
      this.newReview.text = review.text;
      this.newReview.rating = review.rating;
      this.editingReviewId = review.id;
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
};
</script>

<style scoped>
.ingredient-card {
  background-color: #f8f4fc;
  border: 1px solid #d6c8f5;
}
.custom-ingredient-list {
  padding: 0;
}
.ingredient-item {
  transition: background 0.2s ease;
  border-radius: 6px;
}
.ingredient-item:hover {
  background-color: #ece2fb;
}
.ingredient-text {
  font-size: 15px;
  font-weight: 500;
  color: #4a148c;
}
.scrollable-container {
  max-height: 250px;
  overflow-y: auto;
}
.scrollable-instructions {
  max-height: 250px;
  overflow-y: auto;
  padding-right: 10px;
}
.review-form-card {
  background-color: #f6f3ff;
}
.review-list-card {
  background-color: #f9f6ff;
}
h2 {
  margin-bottom: 8px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
p, .text-body-1, .text-body-2 {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
