<template>
  <div>
    <div class="container">
      <h1 v-if="trip">{{ trip.title }}</h1>
      <p v-if="trip">{{ trip.description }}</p>
      <div v-else>{{ error }}</div>

      <div class="mb-4">
        <div id="map" v-if="trip"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      trip: null,
      error: null,
    };
  },
  created() {
    this.fetchTripDetails();
  },
  methods: {
    async fetchTripDetails() {
      try {
        const response = await fetch(`http://localhost:8000/api/trips/${this.$route.params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch trip details');
        }
        const data = await response.json();
        console.log('Trip data:', data); // Aggiungi questo per vedere i dati del trip
        this.trip = data;
        this.$nextTick(() => {
          this.initMap();
        });
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching trip details:', error);
      }
    },
    initMap() {
      if (typeof tt === 'undefined') {
        console.error('TomTom Map library is not loaded.');
        return;
      }

      const apiKey = 'Cf1IzBcyaYOQVbv27Qm29CkFFZxlMK9w';

      if (!this.trip || !this.trip.stops || this.trip.stops.length === 0) {
        console.error('No stops available for this trip.');
        return;
      }

      console.log('Stops:', this.trip.stops); // Aggiungi questo per vedere i dati delle fermate

      const locations = this.trip.stops.map(stop => ({
        name: stop.location,
        position: [stop.longitude, stop.latitude]
      }));

      if (locations.length > 0) {
        const map = tt.map({
          key: apiKey,
          container: 'map',
          center: locations[0].position,
          zoom: 8
        });

        locations.forEach(location => {
          new tt.Marker()
            .setLngLat(location.position)
            .setPopup(new tt.Popup({ offset: 35 }).setHTML(`<h4>${location.name}</h4>`))
            .addTo(map);
        });

        if (locations.length > 1) {
          const route = new tt.Routing({ key: apiKey });
          const coordinates = locations.map(location => location.position);

          route.calculateRoute({ waypoints: coordinates })
            .then(response => {
              const routeGeoJSON = response.toGeoJSON();
              map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                  type: 'geojson',
                  data: routeGeoJSON
                },
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                paint: {
                  'line-color': '#FF0000',
                  'line-width': 5
                }
              });
            })
            .catch(error => {
              console.error('Error calculating route:', error);
            });
        }
      } else {
        console.log('No locations available to display on the map');
      }
    }
  },
};
</script>

<style scoped>
#map {
  height: 500px;
  width: 100%;
  border-radius: 18px;
}
</style>
