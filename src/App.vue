<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title @click="$router.push('/')">: : Foodie</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="$router.push('/')">Home</v-btn>
      <v-btn text @click="$router.push('/by-letter')">By Letter</v-btn>
      <v-btn text @click="$router.push('/search')">By Name</v-btn>
      <v-btn text @click="$router.push('/ingredient')">By Ingredient</v-btn>
      <v-btn text @click="$router.push('/admin')">Admin</v-btn>
      <v-btn v-if="!user" @click="$router.push('/login')">Login</v-btn>
      <v-btn v-else @click="logout">Logout</v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script>
import { auth } from './plugins/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
export default {
  name: 'App',
  data() {
    return {
      user: null,
    }
  },
  created() {
    onAuthStateChanged(auth, (u) => {
      this.user = u
    })
  },
  methods: {
    logout() {
      signOut(auth)
      this.$router.push('/login')
    },
  },
}
</script>
