<template>
  <v-container class="fill-height login-background" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-6 rounded-xl login-card">
          <v-card-title class="text-center text-h5 font-weight-bold mb-4">
            <v-avatar size="50" class="mx-4 mb-3">
              <v-img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
            </v-avatar>
            <span>Login</span>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="isSignup ? handleSignup() : handleLogin()">
              <v-text-field
                v-model="email"
                label="Email address"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                density="comfortable"
                class="mb-3"
                rounded
                required
              />
              <v-text-field
                v-model="password"
                label="Password"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                density="comfortable"
                type="password"
                class="mb-4"
                rounded
                required
              />
              <v-btn
                type="submit"
                block
                color="indigo-darken-2"
                class="text-white py-3 rounded-lg mb-3"
              >
                {{ isSignup ? 'Sign Up' : 'Login' }}
              </v-btn>
              <v-alert v-if="error" type="error" class="mt-2" dense>
                {{ error }}
              </v-alert>
              <div class="text-center mt-2">
                <span>
                  {{ isSignup ? 'Already have an account?' : "Don't have an account?" }}
                  <a href="#" @click.prevent="toggleForm" class="text-indigo font-weight-bold">
                    {{ isSignup ? 'Login' : 'Sign up' }}
                  </a>
                </span>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { auth, db } from '../plugins/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      isSignup: false
    }
  },
  methods: {
    toggleForm() {
      this.error = ''
      this.isSignup = !this.isSignup
    },
    // :white_check_mark: Signup — with role: 'user'
    async handleSignup() {
      this.error = ''
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password)
        const user = userCredential.user
        const userRef = doc(db, 'users', user.uid)
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          role: 'user', // :point_left: important!
          createdAt: serverTimestamp()
        })
        localStorage.setItem('userRole', 'user')
        this.$router.push('/home')
      } catch (err) {
        this.error = 'Signup failed: ' + err.message
      }
    },
    // :white_check_mark: Login — checks role
    async handleLogin() {
      this.error = ''
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password)
        const user = userCredential.user
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        if (!userSnap.exists() || !userSnap.data().role) {
          this.error = 'User role not found in database.'
          return
        }
        const userData = userSnap.data()
        const role = userData.role
        localStorage.setItem('userRole', role)
        this.$router.push('/home')
      } catch (err) {
        this.error = 'Login failed: ' + err.message
      }
    }
  }
}
</script>
<style scoped>
.login-background {
  background: linear-gradient(to bottom right, #F5F0FF, #F7F7F7);
}
.login-card {
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}
a {
  text-decoration: none;
}
</style>