<template>
  <div class="container mt-4">
    <div class="row">
      <div v-for="trip in trips" :key="trip.id" class="col-md-4">
        <div class="card mb-4">
          <div v-if="trip.image">
            <img :src="`http://localhost:8000/storage/${trip.image}`" class="card-img-top img-card" :alt="trip.title">
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ trip.title }}</h5>
            <p class="card-text">{{ trip.description }}</p>
            <router-link :to="{ name: 'TripShow', params: { id: trip.id } }" class="btn btn-info text-white">View
              Details</router-link>
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
        const response = await fetch('http://localhost:8000/api/trips');
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
}

</style>