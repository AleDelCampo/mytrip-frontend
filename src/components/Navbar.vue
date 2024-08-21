<template>
  <nav class="navbar navbar-expand-lg navbar-dark my-bg bord">
    <div class="container">
      <a class="navbar-brand" href="/">
        <h3>MyTrips</h3>  
      </a>
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

<style scoped>
.navbar-brand {
  display: flex;
  align-items: center;
}

.my-bg {
  background-color: #4a5d5e;  
}

.bord {
  position: fixed;

  border-bottom-right-radius: 12px;
}

h3 {
  font-family: 'Countryside', sans-serif;
}
</style>
