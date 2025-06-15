<template>
  <v-overlay :model-value="show" class="loader-overlay" persistent>
    <div class="loader-content">
      <div class="emoji">🍲</div>
      <p class="loader-text">LOADING...</p>
    </div>
  </v-overlay>
</template>

<script>
export default {
  name: 'FullPageLoader',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.loader-overlay {
  background-color: rgba(239, 227, 239, 0.8) !important; /* Purple overlay */
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loader-content {
  text-align: center;
  color: white;
  animation: fadeIn 1s ease-in-out;
}
.emoji {
  font-size: 100px;
  animation: bounce 1s infinite alternate;
}
.loader-text {
  font-size: 18px;
  font-family: 'Courier New', monospace;
  margin-top: 8px;
  letter-spacing: 2px;
}
@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-12px);
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
