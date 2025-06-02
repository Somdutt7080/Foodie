<template>
  <v-container class="pa-6" fluid>
    <!-- HEADER BUTTONS -->
    <v-row justify="center" class="mb-8">
      <v-col cols="12" md="8" class="d-flex justify-center gap-4 flex-wrap">
        <v-btn large :color="showMeals ? 'error' : 'primary'" @click="toggleMealList" class="custom-btn">
          <v-icon start>{{ showMeals ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
          {{ showMeals ? 'Hide' : 'Show' }} Meals
        </v-btn>
      </v-col>
    </v-row>

    <!-- ADD MEAL FORM -->
    <v-card class="mx-auto mb-10 rounded-xl elevation-10" max-width="800">
      <v-card-title class="text-h5 font-weight-bold justify-center">Add a New Meal</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="addMeal" ref="mealForm" class="form-layout">
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field v-model="newMeal.strMeal" label="Meal Name" variant="outlined" color="primary" dense required />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="newMeal.strCategory" label="Category" variant="outlined" color="primary" dense required />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="newMeal.strArea" label="Area" variant="outlined" color="primary" dense required />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="newMeal.strMealThumb" label="Image URL" variant="outlined" color="primary" dense required />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="newMeal.strInstructions" label="Instructions" variant="outlined" auto-grow rows="3" color="primary" dense required />
            </v-col>
          </v-row>
          <div class="text-center mt-4">
            <v-btn large color="success" type="submit" class="custom-btn">
              <v-icon start>mdi-plus</v-icon> Add Meal
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- MEAL LIST -->
    <v-row v-if="showMeals" dense class="gap-4">
      <v-col v-for="meal in meals" :key="meal.id" cols="12" sm="6" md="4">
        <v-card class="meal-card elevation-6 rounded-xl">
          <v-img :src="meal.strMealThumb" height="200px" class="rounded-t-xl"  cover />
          <v-card-text>
            <div class="text-h6 font-weight-bold mb-1">{{ meal.strMeal }}</div>
            <div class="text-subtitle-2 mb-2 text-grey-darken-1">
              {{ meal.strCategory }} - {{ meal.strArea }}
            </div>
            <div class="text-body-2 mb-2">
              {{ meal.strInstructions?.slice(0, 100) }}...
            </div>
            <v-btn color="warning" class="me-2" @click="openEditDialog(meal)" size="small">
              <v-icon start>mdi-pencil</v-icon>Edit
            </v-btn>
            <v-btn color="error" @click="deleteMeal(meal.id)" size="small">
              <v-icon start>mdi-delete</v-icon>Delete
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- EDIT DIALOG -->
    <v-dialog v-model="editDialog" max-width="600px" persistent>
      <v-card class="pa-4 rounded-xl" elevation="10">
        <v-card-title class="text-h6 font-weight-bold">Edit Meal</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="updateMeal" ref="editForm" class="form-layout">
            <v-row dense>
              <v-col cols="12">
                <v-text-field v-model="editedMeal.strMeal" label="Meal Name" variant="outlined" color="primary" dense required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedMeal.strCategory" label="Category" variant="outlined" color="primary" dense required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedMeal.strArea" label="Area" variant="outlined" color="primary" dense required />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="editedMeal.strInstructions" label="Instructions" variant="outlined" color="primary" rows="3" auto-grow dense required />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedMeal.strMealThumb" label="Image URL" variant="outlined" color="primary" dense required />
              </v-col>
            </v-row>
            <div class="text-center mt-4">
              <v-btn large color="primary" type="submit" class="custom-btn">
                <v-icon start>mdi-content-save</v-icon>Save Changes
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../plugins/firebase";

export default {
  data() {
    return {
      newMeal: {
        strMeal: "",
        strCategory: "",
        strArea: "",
        strInstructions: "",
        strMealThumb: "",
      },
      showMeals: false,
      editDialog: false,
      editedMeal: {},
    };
  },
  computed: {
    ...mapState("meals", ["firestoreMeals"]),
    meals() {
      return this.firestoreMeals;
    },
  },
  methods: {
    async fetchAndSaveMeals() {
      await this.$store.dispatch("meals/fetchMeals");
      await this.$store.dispatch("meals/uploadMealsToFirestore");
      await this.$store.dispatch("meals/fetchFirestoreMeals");
    },
    async addMeal() {
      await this.$store.dispatch("meals/addMealManually", this.newMeal);
      this.resetForm();
      await this.$store.dispatch("meals/fetchFirestoreMeals");
    },
    resetForm() {
      this.newMeal = {
        strMeal: "",
        strCategory: "",
        strArea: "",
        strInstructions: "",
        strMealThumb: "",
      };
    },
    toggleMealList() {
      this.showMeals = !this.showMeals;
      if (this.showMeals) {
        this.$store.dispatch("meals/fetchFirestoreMeals");
      }
    },
    openEditDialog(meal) {
      this.editedMeal = { ...meal };
      this.editDialog = true;
    },
    async updateMeal() {
      const mealRef = doc(db, "recipes", this.editedMeal.id);
      const { id, ...dataToUpdate } = this.editedMeal;
      await updateDoc(mealRef, dataToUpdate);
      this.editDialog = false;
      this.$store.dispatch("meals/fetchFirestoreMeals");
    },
    async deleteMeal(mealId) {
      const mealRef = doc(db, "recipes", mealId);
      await deleteDoc(mealRef);
      this.$store.dispatch("meals/fetchFirestoreMeals");
    },
  },
};
</script>

<style scoped>
.meal-card {
  transition: all 0.3s ease;
  cursor: pointer;
}
.meal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
.custom-btn {
  font-weight: 600;
  letter-spacing: 1px;
}
.form-layout {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
