<template>
  <div class="jumbotron text-center text-white py-5 my-bg">
    <div class="container">
      <h1 class="display-4">Welcome to MyTrips</h1>
      <p class="lead">Plan and share your amazing trips with ease!!</p>
    </div>
  </div>
  <div>
    <div class="container">
      <h1 v-if="trip">{{ trip.title }}</h1>
      <p v-if="trip">{{ trip.description }}</p>
      <div v-else>{{ error }}</div>

      <div v-if="trip">
        <div v-for="day in trip.days" :key="day.id" class="day-section">
          <h2>Giorno {{ new Date(day.date).toLocaleDateString() }}</h2>
          <ul>
            <li v-for="stop in day.stops" :key="stop.id">
              <strong>{{ stop.location }}</strong>

              <!-- Sezione per il rating -->
              <span class="star-rating">
                <i v-for="n in 5" :key="n" :class="n <= stop.userRating ? 'fas fa-star' : 'far fa-star'"
                  @click="rateStop(stop, n)">
                </i>
              </span>

              <!-- Sezione per le note -->
              <div class="note-section">
                <textarea v-model="newNoteContent[stop.id]" placeholder="Add a note..."></textarea>
                <br>
                <button class="btn text-white" @click="addNote(stop.id)">Add Note</button>
                <ul>
                  <li v-for="note in stop.notes" :key="note.id">
                    {{ note.content }}
                    <button class="btn text-white" @click="deleteNote(note.id)"><i class="fa-solid fa-trash"></i></button>
                  </li>
                </ul>
              </div>
            </li>
          </ul>

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
      newNoteContent: {}, // Object to store new note content for each stop
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
        console.log('Fetched trip details:', data);

        // Assicurati che stop.userRating e stop.notes siano inizializzati correttamente
        data.days.forEach(day => {
          day.stops.forEach(stop => {
            stop.userRating = stop.rating || 0; // Usa il rating salvato o 0 se non esiste
            stop.notes = stop.notes || []; // Assicurati che notes sia un array
            this.newNoteContent[stop.id] = ''; // Inizializza l'input delle note
          });
        });

        this.trip = data;
        this.$nextTick(() => {
          this.initMap();
        });
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching trip details:', error);
      }
    },
    async rateStop(stop, rating) {
      try {
        // Aggiorna il rating visualizzato immediatamente
        stop.userRating = rating;

        // Invia il rating al server
        const response = await fetch(`http://localhost:8000/api/stops/${stop.id}/rate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rating }),
        });

        if (!response.ok) {
          throw new Error('Failed to rate stop');
        }

        const data = await response.json();
        console.log('Rating saved:', data);

      } catch (error) {
        console.error('Error rating stop:', error);
      }
    },
    async addNote(stopId) {
      try {
        const response = await fetch(`http://localhost:8000/api/stops/${stopId}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: this.newNoteContent[stopId] }),
        });

        if (!response.ok) {
          throw new Error('Failed to add note');
        }

        const newNote = await response.json();
        const stop = this.trip.days.flatMap(day => day.stops).find(s => s.id === stopId);
        stop.notes.push(newNote);
        this.newNoteContent[stopId] = ''; // Clear the input field

      } catch (error) {
        console.error('Error adding note:', error);
      }
    },
    async deleteNote(noteId) {
      try {
        const response = await fetch(`http://localhost:8000/api/notes/${noteId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete note');
        }

        // Remove the note from the UI
        this.trip.days.forEach(day => {
          day.stops.forEach(stop => {
            const index = stop.notes.findIndex(n => n.id === noteId);
            if (index !== -1) {
              stop.notes.splice(index, 1);
            }
          });
        });

      } catch (error) {
        console.error('Error deleting note:', error);
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
  width: 60%;
  border-radius: 18px;
}

.star-rating {
  color: #4a5d5e;
  cursor: pointer;
}

.fa-star,
.fa-star-o {
  font-size: 20px;
  margin-left: 5px;
}

.note-section {
  margin-top: 10px;
}

.note-section textarea {
  width: 40%;
  height: 60px;
  margin-bottom: 10px;
}

.note-section button {
  margin-top: 5px;
}

.btn {
  background-color: #4a5d5e;
}

.btn:hover {
  background-color: #4a5d5e;
}
</style>
