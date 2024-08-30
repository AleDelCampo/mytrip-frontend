<template>
  <div class="container">
    <div class="jumbotron text-center text-white py-5 my-bg">
      <h1 class="display-4">Welcome to MyTrips</h1>
      <p class="lead">Plan and share your amazing trips with ease!!</p>
    </div>

    <div class="trip-content">
      <div class="trip-details">
        <h1 v-if="trip">{{ trip.title }}</h1>
        <p v-if="trip">{{ trip.description }}</p>
        <div v-else>{{ error }}</div>
      </div>

      <div class="trip-sections">
        <div class="day-section" v-for="day in trip.days" :key="day.id">
          <h2>Day {{ new Date(day.date).toLocaleDateString() }}</h2>
          <ul>
            <li v-for="stop in day.stops" :key="stop.id" class="stop-item">
              <strong>{{ stop.location }}</strong>

              <!-- Sezione per il rating -->
              <span class="star-rating">
                <i v-for="n in 5" :key="n" :class="n <= stop.userRating ? 'fas fa-star' : 'far fa-star'"
                  @click="rateStop(stop, n)">
                </i>
              </span>

              <!-- Sezione di ricerca per ogni stop -->
              <div>
                <div class="places-bar">
                <input v-model="stop.searchQuery" @keyup.enter="searchPlaces(stop)"
                  placeholder="Search by category (e.g. 'Beach', 'Bar', 'Restaurant')" />
                <button class="btn text-white" @click="searchPlaces(stop)"><i class="fa-solid fa-magnifying-glass"></i></button>
              </div>
                <div v-if="stop.places.length">
                  <h2>Results for "{{ stop.searchQuery }}"</h2>
                  <ul class="places-list">
                    <li v-for="place in paginatedPlaces" :key="place.id" class="place-item">
                      <div class="place-image-wrapper">
                        <img :src="place.image_url" alt="Immagine luogo" class="place-image" />
                      </div>
                      <div class="place-info">
                        <strong>{{ place.name }}</strong>
                        <p>{{ place.location.address1 }}, {{ place.location.city }}</p>
                        <p>Rating: {{ place.rating }}</p>
                      </div>
                    </li>
                  </ul>

                  <div class="pagination">
                    <button class="btn text-white" @click="previousPagePlaces"
                      :disabled="currentPagePlaces === 1">Previous</button>
                    <span>Page {{ currentPagePlaces }} of {{ totalPagesPlaces }}</span>
                    <button class="btn text-white" @click="nextPagePlaces"
                      :disabled="currentPagePlaces === totalPagesPlaces">Next</button>
                  </div>
                </div>
                <div v-else-if="stop.searched">
                  <p>No results found for "{{ stop.searchQuery }}".</p>
                </div>


                <div v-if="error">{{ error }}</div>
              </div>

              <!-- Note Section -->
              <div class="note-section">
                <textarea class="p-2" v-model="newNoteContent[stop.id]" placeholder="Add your thoughts"></textarea>
                <button class="btn text-white" @click="addNote(stop.id)"><i class="fa-solid fa-plus"></i></button>
                <ul>
                  <li v-for="note in stop.notes" :key="note.id">
                    {{ note.content }}
                    <button class="btn text-white" @click="deleteNote(note.id)">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </ul>

          <div :id="`map-day-${day.id}`" class="map"></div>
        </div>
      </div>
      <div class="search-sections">
        <div class="dishes-search">
          <h1 class="my-4">Search Typical Dishes</h1>

          <!-- Search bar for dishes -->
          <div class="search-bar mb-4">
            <input v-model="searchQuery" type="text" placeholder="Enter the name of the place" />
            <button @click="searchDishes"><i class="fa-solid fa-magnifying-glass"></i></button>
          </div>

          <!-- Section to display dishes -->
          <div v-if="dishes.length" class="dishes-section">
            <h3>Typical Dishes Founded</h3>
            <ul>
              <li v-for="dish in paginatedDishes" :key="dish.id" class="dish-item">
                <div class="dish-image-wrapper">
                  <img :src="dish.image" alt="Dish image" class="dish-image" />
                </div>
                <div class="dish-info">
                  <h4>{{ dish.title }}</h4>
                </div>
              </li>
            </ul>
            <div class="pagination">
              <button class="btn text-white" @click="previousPageDishes"
                :disabled="currentPageDishes === 1">Previous</button>
              <span>Page {{ currentPageDishes }} of {{ totalPagesDishes }}</span>
              <button class="btn text-white" @click="nextPageDishes"
                :disabled="currentPageDishes === totalPagesDishes">Next</button>
            </div>
          </div>
          <div v-if="dishes.length === 0 && error" class="error">{{ error }}</div>
        </div>

        <div class="museum-search">
          <h1 class="my-4">Search Museum & Culture</h1>

          <!-- Search bar for museums -->
          <div class="search-bar mb-4">
            <input v-model="query" type="text" placeholder="Search for museums and cultural places..." />
            <button @click="searchMuseums"><i class="fa-solid fa-magnifying-glass"></i></button>
          </div>

          <!-- Section to display museums -->
          <div v-if="museums.length" class="results">
            <h3>Search Results</h3>
            <ul>
              <li v-for="museum in paginatedMuseums" :key="museum.id" class="museum-item">
                <div class="museum-icon">
                  <i class="fas fa-landmark"></i>
                </div>
                <div class="museum-info">
                  <h4>{{ museum.name }}</h4>
                  <p>{{ museum.description }}</p>
                </div>
              </li>
            </ul>
            <div class="pagination">
              <button class="btn text-white" @click="previousPageMuseums"
                :disabled="currentPageMuseums === 1">Previous</button>
              <span>Page {{ currentPageMuseums }} of {{ totalPagesMuseums }}</span>
              <button class="btn text-white" @click="nextPageMuseums"
                :disabled="currentPageMuseums === totalPagesMuseums">Next</button>
            </div>
          </div>
          <div v-if="museums.length === 0 && error" class="error">{{ error }}</div>
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
      query: '',
      places: [],
      searched: false,
      currentPageMuseums: 1,
      resultsPerPageMuseums: 5,
      currentPageDishes: 1,
      resultsPerPageDishes: 5,
      currentPagePlaces: 1,
      resultsPerPagePlaces: 5,
      museums: [],
      dishes: [],
      newNoteContent: {},
      searchQuery: '',
      localDishes: {
        'Napoli': [
          { id: 1, title: 'Pizza Margherita', image: 'https://media-cdn.tripadvisor.com/media/photo-s/09/f0/dd/a7/pizzeria-starita-a-materdei.jpg' },
        ],
      },
      spoonacularApiKey: 'ae85ec0a30e443e290f82d2ba8c6fec1'
    };
  },
  created() {
    this.fetchTripDetails();
  },
  computed: {
    totalPagesMuseums() {
      return Math.ceil(this.museums.length / this.resultsPerPageMuseums);
    },
    paginatedMuseums() {
      const start = (this.currentPageMuseums - 1) * this.resultsPerPageMuseums;
      const end = start + this.resultsPerPageMuseums;
      return this.museums.slice(start, end);
    },
    totalPagesDishes() {
      return Math.ceil(this.dishes.length / this.resultsPerPageDishes);
    },
    paginatedDishes() {
      const start = (this.currentPageDishes - 1) * this.resultsPerPageDishes;
      const end = start + this.resultsPerPageDishes;
      return this.dishes.slice(start, end);
    },
    totalPagesPlaces() {
      return Math.ceil(this.trip.days.flatMap(day => day.stops.flatMap(stop => stop.places)).length / this.resultsPerPagePlaces);
    },
    paginatedPlaces() {
      const allPlaces = this.trip.days.flatMap(day => day.stops.flatMap(stop => stop.places));
      const start = (this.currentPagePlaces - 1) * this.resultsPerPagePlaces;
      const end = start + this.resultsPerPagePlaces;
      return allPlaces.slice(start, end);
    },
  },

  methods: {
    async fetchTripDetails() {
      try {
        const response = await fetch(`http://localhost:8000/api/trips/${this.$route.params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch trip details');
        }
        const data = await response.json();

        data.days.forEach(day => {
          day.stops.forEach(stop => {
            stop.userRating = stop.rating || 0;
            stop.notes = stop.notes || [];
            stop.dishes = stop.dishes || [];
            stop.searchQuery = ''; // Aggiungi la proprietà searchQuery
            stop.places = []; // Aggiungi la proprietà places
            stop.searched = false; // Aggiungi la proprietà searched
            this.newNoteContent[stop.id] = '';

            this.fetchTypicalDishes(stop.location)
              .then(() => {
                const stopDishes = this.dishes.filter(dish => dish.title.includes(stop.location));
                stop.dishes = stopDishes;
              });
          });
        });

        this.trip = data;
        this.$nextTick(() => {
          this.initMap();
        });
      } catch (error) {
        this.error = error.message;
      }
    },

    async searchPlaces(stop) {
      if (!stop.searchQuery) {
        this.error = 'Inserisci una categoria da cercare';
        return;
      }

      stop.searched = false;
      this.error = null;

      try {
        stop.places = await this.fetchYelpPlaces(stop.searchQuery, stop.location);
        stop.searched = true;
      } catch (error) {
        this.error = 'Errore durante la ricerca';
      }
    },
    async fetchYelpPlaces(term, location) {
      const apiKey = 'gBxMHufFJrBhAPt1Joi2s_GfgGHx0xkK9QKgMMDvPjtUEyt5ARuzUWf0D8SoS24RxjlGda88oB0XuyVPlXjrFGJxr0_fA90rjWXwIc-BoM-6_UKOmLc1kEn4aJPRZnYx';
      const url = `https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&limit=40`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch places from Yelp');
      }

      const data = await response.json();
      return data.businesses;
    },
    previousPagePlaces() {
      if (this.currentPagePlaces > 1) {
        this.currentPagePlaces--;
      }
    },
    nextPagePlaces() {
      if (this.currentPagePlaces < this.totalPagesPlaces) {
        this.currentPagePlaces++;
      }
    },
    async searchMuseums() {
      if (!this.query) {
        this.error = 'Please enter a search query.';
        return;
      }
      this.error = null;
      this.currentPage = 1; // Reset to first page on new search

      const encodedQuery = encodeURIComponent(this.query);

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}`);
        const geocodingData = await response.json();

        if (!geocodingData || geocodingData.length === 0) {
          this.error = 'Location not found.';
          return;
        }

        const { lat, lon } = geocodingData[0];

        const museumsResponse = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"~"museum|artwork|theatre|library"](around:5000,${lat},${lon});out;`);
        if (!museumsResponse.ok) {
          throw new Error('Failed to fetch museums');
        }

        const museumsData = await museumsResponse.json();

        this.museums = museumsData.elements.map(element => ({
          id: element.id,
          name: element.tags.name || 'Unnamed place',
          description: element.tags.description || 'No description available',
          lat: element.lat,
          lon: element.lon,
        }));
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching museums:', error);
      }
    },
    previousPageMuseums() {
      if (this.currentPageMuseums > 1) {
        this.currentPageMuseums--;
      }
    },
    nextPageMuseums() {
      if (this.currentPageMuseums < this.totalPagesMuseums) {
        this.currentPageMuseums++;
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
    async searchDishes() {
      if (!this.searchQuery.trim()) {
        alert('Per favore, inserisci il nome di un luogo.');
        return;
      }

      const query = this.searchQuery.trim();

      // Controlla se il luogo è nella lista dei piatti locali
      if (this.localDishes[query]) {
        this.dishes = this.localDishes[query];
        this.totalDishPages = 1; // Reset total pages
        this.currentDishPage = 1; // Reset to first page
        return;
      }

      // Altrimenti, fai una richiesta all'API di Spoonacular
      try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=100&apiKey=${this.spoonacularApiKey}`);
        if (!response.ok) {
          throw new Error('Failed to fetch dishes');
        }
        const data = await response.json();
        console.log('Fetched dishes:', data);

        if (data.results && data.results.length > 0) {
          this.dishes = data.results;
          this.totalDishPages = this.totalDishPages;
          this.currentDishPage = 1; // Reset to first page
        } else {
          this.dishes = [];
          this.totalDishPages = 1;
          this.currentDishPage = 1;
        }

      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    },
    previousPageDishes() {
      if (this.currentPageDishes > 1) {
        this.currentPageDishes--;
      }
    },
    nextPageDishes() {
      if (this.currentPageDishes < this.totalPagesDishes) {
        this.currentPageDishes++;
      }
    },
    async fetchTypicalDishes(location) {
      try {
        // Usa un nome di cucina generico se il nome della località non produce risultati


        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=5&apiKey=${this.spoonacularApiKey}`);
        if (!response.ok) {
          throw new Error('Failed to fetch typical dishes');
        }
        const data = await response.json();
        console.log(`Fetched typical dishes for ${query}:`, data);

        if (data.results && data.results.length > 0) {
          this.dishes = data.results;
        } else {
          this.dishes = [];
          console.warn(`No typical dishes found for ${query}`);
        }

      } catch (error) {
        console.error(`Error fetching typical dishes for ${location}:`, error);
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
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Jumbotron */
.jumbotron {
  background: #4a5d5e;
}

/* Layout Styles */
.trip-content {
  display: flex;
  flex-direction: column;
}

.trip-details {
  margin-bottom: 20px;
}

.trip-sections {
  display: flex;
  flex-direction: column;
}

.day-section {
  margin-bottom: 20px;
}

.map {
  height: 300px;
  width: 100%;
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
  width: 100%;
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
  background-color: #3a4a4a;
}

/* Search Sections */
.search-sections {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.dishes-search,
.museum-search {
  width: 48%;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar button {
  padding: 10px 20px;
  background-color: #4a5d5e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-bar button:hover {
  background-color: #3a4a4a;
}

.dishes-section {
  margin-top: 20px;
}

.dishes-section ul {
  padding-left: 0;
}

.dish-item {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
}

.dish-image-wrapper {
  flex-shrink: 0;
  margin-right: 15px;
}

.dish-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.dish-info {
  flex: 1;
}

.dish-info h4 {
  margin: 0;
  font-size: 1.2em;
}

.dish-info p {
  margin: 5px 0;
}

.museum-item {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
}

.museum-icon {
  font-size: 50px;
  color: #4a5d5e;
  margin-right: 15px;
}

.museum-info {
  flex: 1;
}

.museum-info h4 {
  margin: 0;
  font-size: 1.2em;
}

.museum-info p {
  margin: 5px 0;
}

.results {
  margin-top: 20px;
}

.results ul {
  list-style-type: none;
  padding: 0;
}

.results li {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  padding: 10px;
  margin: 0 5px;
}

.error {
  color: red;
  margin-top: 20px;
}

/* Lista dei luoghi */
.places-list {
  list-style-type: none;
  padding: 0;
}

.place-item {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
}

.place-image-wrapper {
  flex-shrink: 0;
  margin-right: 15px;
}

.place-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.place-info {
  flex: 1;
}

.place-info strong {
  display: block;
  font-size: 1.2em;
  margin-bottom: 5px;
}

.place-info p {
  margin: 5px 0;
}

.places-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.places-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.places-bar button {
  padding: 10px 20px;
  background-color: #4a5d5e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.places-bar button:hover {
  background-color: #3a4a4a;
}
</style>
