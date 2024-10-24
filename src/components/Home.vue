<template>
  <div class="jumbotron text-center text-white py-5 logo">
    </div>
    <div class="jumbotron text-center text-white py-5 my-bg">
        <div class="container">
            <h1 class="display-4">Welcome to MyTrips</h1>
            <p class="lead">Plan and share your amazing trips with ease!!</p>
        </div>
    </div>
  <div class="container mt-4">
    <div class="row">
      <div v-for="trip in trips" :key="trip.id" class="col-md-4">
        <div class="card mb-4 card-bg">
          <div v-if="trip.image">
            <img :src="`https://camper4fourdev-d4dcbf2bd931.herokuapp.com/storage/${trip.image}`" class="card-img-top img-card" :alt="trip.title">
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ trip.title }}</h5>
            <p class="card-text">{{ trip.description }}</p>
            <router-link :to="{ name: 'TripShow', params: { id: trip.id } }" class="btn text-white">Find More <i class="fa-solid fa-plane"></i></router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      trips: [],
      error: null,
    };
  },
  created() {
    this.fetchTrips();
  },
  methods: {
    async fetchTrips() {
      try {
        const response = await fetch('https://camper4fourdev-d4dcbf2bd931.herokuapp.com/api/trips', {
    method: 'GET',
    mode: 'no-cors'
});
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data = await response.json();
        this.trips = data;
      } catch (error) {
        this.error = error.message;
      }
    },
  },
};
</script>

<style scoped>

.img-card {
  max-height: 260px;
  border-bottom-left-radius: 12px;
}

.card-bg {
  background-color: #f8f9fa;
}

.btn {
  background-color: #4a5d5e;
}

.btn:hover {
  background-color: #4a5d5e;
}

.logo {
  background-color: #4a5d5e;
  background-image: url(public/LogoTripss.png);
  height: 280px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>