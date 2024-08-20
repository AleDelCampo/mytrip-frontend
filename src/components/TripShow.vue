<template>
  <div>
    <h1 v-if="trip">{{ trip.title }}</h1>
    <p v-if="trip">{{ trip.description }}</p>
    <div v-else>{{ error }}</div>

    <div id="map" v-if="trip"></div>
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
        this.trip = data;
        this.$nextTick().then(() => {
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

      const apiKey = 'Cf1IzBcyaYOQVbv27Qm29CkFFZxlMK9w'; // Replace with your TomTom API key

      // Initialize the map
      const map = tt.map({
        key: apiKey,
        container: 'map',
        center: [80.9838, 76.7275], // Center the map at a fixed location (e.g., Athens)
        zoom: 4
      });

      // Log the map initialization
      console.log('Map initialized');

      const locations = this.trip.stops.map(stop => ({
        name: stop.location,
        position: [stop.longitude, stop.latitude]
      }));

      // Log the locations
      console.log('Locations:', locations);

      if (locations.length > 0) {
        map.setCenter(locations[0].position);

        locations.forEach(location => {
          new tt.Marker()
            .setLngLat(location.position)
            .setPopup(new tt.Popup({ offset: 35 }).setHTML(`<h4>${location.name}</h4>`))
            .addTo(map);
        });

        const route = new tt.Routing({ key: apiKey });
        const coordinates = locations.map(location => location.position);

        if (coordinates.length > 1) {
          route.calculateRoute({ waypoints: coordinates })
            .then(response => {
              const routeGeoJSON = response.toGeoJSON();
              console.log('Route GeoJSON:', routeGeoJSON); // Log the route GeoJSON

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
  border: 1px solid red; /* Temporarily added for debugging */
}
</style>
