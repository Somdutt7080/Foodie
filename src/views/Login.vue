<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="text-h5">
            {{ isSignup ? 'Sign Up' : 'Login' }}
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="isSignup ? handleSignup() : handleLogin()">
              <v-text-field
                label="Email"
                v-model="email"
                prepend-icon="mdi-email"
                type="email"
                required
              />
              <v-text-field
                label="Password"
                v-model="password"
                prepend-icon="mdi-lock"
                type="password"
                required
              />
              <v-btn type="submit" color="primary" block class="mt-4">
                {{ isSignup ? 'Sign Up' : 'Login' }}
              </v-btn>
              <v-alert v-if="error" type="error" class="mt-2">
                {{ error }}
              </v-alert>
              <v-btn text block @click="toggleForm" class="mt-2">
                {{ isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up" }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { ref } from 'vue'
import { auth } from '../plugins/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const isSignup = ref(false)
    const toggleForm = () => {
      error.value = ''
      isSignup.value = !isSignup.value
    }
    const handleLogin = async () => {
      error.value = ''
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value)
        router.push('/home') // :white_check_mark: Safe push after login
      } catch (err) {
        error.value = 'Login failed: ' + err.message
      }
    }
    const handleSignup = async () => {
      error.value = ''
      try {
        await createUserWithEmailAndPassword(auth, email.value, password.value)
        router.push('/home') // :white_check_mark: Safe push after signup
      } catch (err) {
        error.value = 'Signup failed: ' + err.message
      }
    }
    return {
      email,
      password,
      error,
      isSignup,
      toggleForm,
      handleLogin,
      handleSignup
    }
  }
}
</script>