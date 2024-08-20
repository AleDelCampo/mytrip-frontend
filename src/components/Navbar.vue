<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-info">
    <div class="container">
      <div class="navbar-brand">MyTrip</div>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <!-- Aggiungi altri link se necessario -->
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>

</script>

<style scoped>

</style>