<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Submit a New Recipe</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitRecipe">
              <v-text-field label="Meal Name" v-model="meal.name" required />
              <v-textarea label="Ingredients (comma-separated)" v-model="meal.ingredients" required />
              <v-textarea label="Instructions" v-model="meal.instructions" required />
              <v-text-field label="YouTube Video Link" v-model="meal.youtube" />
              <v-file-input
                label="Meal Image"
                accept="image/*"
                show-size
                v-model="meal.imageFile"
                prepend-icon="mdi-camera"
              />
              <v-btn type="submit" color="primary" class="mt-4" block>Submit Recipe</v-btn>
              <v-alert v-if="successMessage" type="success" class="mt-2">{{ successMessage }}</v-alert>
              <v-alert v-if="errorMessage" type="error" class="mt-2">{{ errorMessage }}</v-alert>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { ref } from 'vue'
import { db, storage, auth } from '../plugins/firebase'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { onAuthStateChanged } from 'firebase/auth'
export default {
  name: 'Admin',
  setup() {
    const meal = ref({
      name: '',
      ingredients: '',
      instructions: '',
      youtube: '',
      imageFile: null,
    })
    const successMessage = ref('')
    const errorMessage = ref('')
    // Admin auth guard
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = '/login'
      }
    })
    const submitRecipe = async () => {
      successMessage.value = ''
      errorMessage.value = ''
      try {
        if (!meal.value.imageFile) {
          throw new Error('Image file is required.')
        }
        const imageRef = storageRef(storage, `meals/${meal.value.imageFile.name}`)
        const snapshot = await uploadBytes(imageRef, meal.value.imageFile)
        const imageUrl = await getDownloadURL(snapshot.ref)
        await addDoc(collection(db, 'meals'), {
          name: meal.value.name,
          ingredients: meal.value.ingredients.split(',').map(i => i.trim()),
          instructions: meal.value.instructions,
          youtube: meal.value.youtube,
          image: imageUrl,
          createdAt: Timestamp.now(),
        })
        successMessage.value = 'Recipe added successfully!'
        meal.value = {
          name: '',
          ingredients: '',
          instructions: '',
          youtube: '',
          imageFile: null,
        }
      } catch (err) {
        errorMessage.value = err.message || 'Something went wrong.'
      }
    }
    return {
      meal,
      submitRecipe,
      successMessage,
      errorMessage,
    }
  }
}
</script>












