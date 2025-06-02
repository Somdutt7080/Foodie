<template>
  <v-app>
    <NavigationBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavigationBar from './components/Navigation.vue'

export default {
  name: 'App',
  components: {
    NavigationBar
  }
}
</script>
