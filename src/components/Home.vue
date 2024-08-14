<template>
    <div>
      <h1>Trips</h1>
      <ul>
        <li v-for="trip in trips" :key="trip.id">
          <router-link :to="{ name: 'trip-show', params: { id: trip.id } }">{{ trip.title }}</router-link>
        </li>
      </ul>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        trips: [],
        error: null
      };
    },
    created() {
      this.fetchTrips();
    },
    methods: {
      async fetchTrips() {
        try {
            const response = await fetch('http://localhost:8000/api/trips'); // Assicurati che l'URL sia corretto
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          this.trips = data;
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
          this.error = 'Failed to load trips';
        }   
      }
    }
  };
  </script>