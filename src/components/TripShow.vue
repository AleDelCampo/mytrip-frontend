<template>
  <div>
    <div class="container">
      <h1 v-if="trip">{{ trip.title }}</h1>
      <p v-if="trip">{{ trip.description }}</p>
      <div v-else>{{ error }}</div>

      <div v-if="trip">
        <!-- Sezione per i giorni e le tappe -->
        <div v-for="day in trip.days" :key="day.id" class="day-section">
          <h2>Giorno {{ new Date(day.date).toLocaleDateString() }}</h2>
          <ul>
            <li v-for="stop in day.stops" :key="stop.id">
              <strong>{{ stop.location }}</strong>
            </li>
          </ul>

          <!-- Mappa per ogni giorno -->
          <div class="mb-4">
            <div :id="`map-day-${day.id}`" class="map"></div>
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
      console.log('Trip data:', data); // Verifica i dati del viaggio
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

    if (!this.trip || !this.trip.days || this.trip.days.length === 0) {
      console.error('No days available for this trip.');
      return;
    }

    this.trip.days.forEach(day => {
      if (!day.stops || day.stops.length === 0) {
        console.warn(`No stops available for day ${day.id}`);
      } else {
        console.log(`Initializing map for day ${day.id} at ${day.stops[0].latitude}, ${day.stops[0].longitude}`);
      }
    });

    // Inizializza la mappa per ogni giorno
    this.trip.days.forEach(day => {
      if (day.stops && day.stops.length > 0) {
        const map = tt.map({
          key: apiKey,
          container: `map-day-${day.id}`,
          center: [day.stops[0].longitude, day.stops[0].latitude],
          zoom: 8
        });

        day.stops.forEach(stop => {
          new tt.Marker()
            .setLngLat([stop.longitude, stop.latitude])
            .setPopup(new tt.Popup({ offset: 35 }).setHTML(`<h4>${stop.location}</h4>`))
            .addTo(map);
        });

        // Opzionale: aggiungi la rotta
        const locations = day.stops.map(stop => [stop.longitude, stop.latitude]);

        if (locations.length > 1) {
          const route = new tt.Routing({ key: apiKey });
          route.calculateRoute({ waypoints: locations })
            .then(response => {
              const routeGeoJSON = response.toGeoJSON();
              map.addLayer({
                id: `route-${day.id}`,
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
      }
    });
  }
},
};
</script>

<style scoped>
.day-section {
  margin-bottom: 20px;
}
.map {
  height: 300px;
  width: 100%;
  border-radius: 18px;
}
</style>
