<template>
  <v-app-bar app color="indigo darken-3" dark elevation="6">
    <!-- Title -->
    <v-toolbar-title @click="$router.push('/home')" class="clickable-title">
      🍽️ Foodie
    </v-toolbar-title>

    <v-spacer />

    <!-- Filter Menu -->
    <v-menu v-model="filterMenu" :close-on-content-click="false" offset-y transition="scale-transition">
      <template #activator="{ props }">
        <v-btn v-bind="props" color="cyan darken-2" dark class="mx-2 rounded-pill font-weight-bold">
          <v-icon start>mdi-filter-variant</v-icon>
          Filter
        </v-btn>
      </template>
      <v-card class="rounded-xl" elevation="10" width="220">
        <v-list dense nav>
          <v-list-item @click="$router.push('/by-letter'); filterMenu = false">
            <v-list-item-title><v-icon start small>mdi-alphabetical</v-icon>By Letter</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$router.push('/search'); filterMenu = false">
            <v-list-item-title><v-icon start small>mdi-magnify</v-icon>By Name</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <!-- Gallery Button -->
    <v-btn text @click="$router.push('/gallery')">
      Gallery
    </v-btn>

    <!-- Admin/Login/Logout -->
    <v-btn v-if="user && userRole === 'admin'" text @click="$router.push('/admin')">
      Admin
    </v-btn>
    <v-btn v-if="!user" text @click="$router.push('/login')">
      Login
    </v-btn>
    <v-btn v-else text @click="logout">
      Logout
    </v-btn>
  </v-app-bar>
</template>

<script>
import { auth, db } from '../plugins/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export default {
  name: 'NavigationBar',
  data() {
    return {
      user: null,
      userRole: null,
      filterMenu: false,
      isDark: false,
    }
  },
  mounted() {
    onAuthStateChanged(auth, async (u) => {
      this.user = u
      if (u) {
        const userDoc = await getDoc(doc(db, 'users', u.uid))
        if (userDoc.exists()) {
          this.userRole = userDoc.data().role
          localStorage.setItem('userRole', this.userRole)
        } else {
          this.userRole = null
          localStorage.removeItem('userRole')
        }
      } else {
        this.userRole = null
        localStorage.removeItem('userRole')
      }
    })
  },
  methods: {
    logout() {
      signOut(auth).then(() => {
        this.user = null
        this.userRole = null
        localStorage.removeItem('userRole')
        this.$router.push('/login')
      })
    },
    toggleTheme() {
      this.isDark = !this.isDark
      this.$vuetify.theme.dark = this.isDark
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    }
  }
}
</script>

<style scoped>
.clickable-title {
  cursor: pointer;
  font-weight: bold;
  font-size: 24px;
  transition: 0.3s;
}
.clickable-title:hover {
  opacity: 0.8;
}
.v-list-item {
  cursor: pointer;
  transition: 0.2s;
}
.v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
