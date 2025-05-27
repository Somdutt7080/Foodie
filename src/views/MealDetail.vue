<template>
    <v-container>
        <v-card v-if="meal" class="pa-4">
            <v-row>
                <v-col cols="12" md="6">
                    <v-img :src="meal.strMealThumb" height="300px" />
                </v-col>
                <v-col cols="12" md="6">
                    <h2>{{ meal.strMeal }}</h2>
                    <p><strong>Category:</strong> {{ meal.strCategory }}</p>
                    <p><strong>Area:</strong> {{ meal.strArea }}</p>
                    <v-btn v-if="meal.strYoutube" :href="meal.strYoutube" target="_blank" color="red">
                        Watch on YouTube
                    </v-btn>
                </v-col>
            </v-row>
            <v-divider class="my-4" />
            <h3>Ingredients</h3>
            <ul>
                <li v-for="(ingredient, index) in ingredients" :key="index">{{ ingredient }}</li>
            </ul>
            <v-divider class="my-4" />
            <h3>Instructions</h3>
            <p>{{ meal.strInstructions }}</p>
        </v-card>
        <v-alert v-else type="error">Meal not found</v-alert>
    </v-container>
</template>
<script>
import axios from 'axios'
export default {
    name: 'MealDetail',
    data() {
        return {
            meal: null,
            ingredients: [],
        }
    },
    async created() {
        const id = this.$route.params.id
        try {
            const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            this.meal = res.data.meals[0]
            this.extractIngredients()
        } catch (err) {
            console.error(err)
        }
    },
    methods: {
        extractIngredients() {
            this.ingredients = []
            for (let i = 1; i <= 20; i++) {
                const ingredient = this.meal[`strIngredient${i}`]
                const measure = this.meal[`strMeasure${i}`]
                if (ingredient && ingredient.trim()) {
                    this.ingredients.push(`${ingredient} - ${measure}`)
                }
            }
        },
    },
}
</script>
