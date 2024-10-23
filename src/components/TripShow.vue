<template>
  <!-- Contenitore principale -->
  <div class="container">
    
    <!-- Sezione di benvenuto -->
    <div class="jumbotron text-center text-white py-5 my-bg">
      <h1 class="display-4">Welcome to MyTrips</h1>
      <p class="lead">Plan and share your amazing trips with ease!!</p>
    </div>

    <!-- Sezione dei dettagli del viaggio -->
    <div class="trip-content">
      
      <!-- Dettagli del viaggio -->
      <div class="trip-details">
        <!-- Mostra il titolo del viaggio se esiste -->
        <h1 v-if="trip">{{ trip.title }}</h1>
        <!-- Mostra la descrizione del viaggio se esiste -->
        <p class="mt-4 d-flex justify-content-end my-title fs-4" v-if="trip">{{ trip.description }}</p>
        <!-- Mostra un messaggio di errore se il viaggio non esiste -->
        <div v-else>{{ error }}</div>
      </div>

      <!-- Sezioni del viaggio -->
      <div class="trip-sections">
        
        <!-- Sezione per ogni giorno del viaggio -->
        <div class="day-section" v-for="day in trip.days" :key="day.id">
          <!-- Mostra la data del giorno -->
          <div class="date-box">
            <h2 class="date-text">Day: <i class="fa-regular fa-calendar"></i> {{ new Date(day.date).toLocaleDateString('en-EN', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            }) }}</h2>
          </div>
          <ul class="mb-4 mt-4">
            <!-- Elenco delle fermate per ogni giorno -->
            <li v-for="stop in day.stops" :key="stop.id" class="stop-item">
              <strong>{{ stop.location }}</strong>

              <!-- Sistema di valutazione a stelle -->
              <span class="star-rating">
                <i v-for="n in 5" :key="n" :class="n <= stop.userRating ? 'fas fa-star' : 'far fa-star'"
                  @click="rateStop(stop, n)">
                </i>
              </span>

              <div>
                <!-- Barra di ricerca per i luoghi -->
                <div class="places-bar mt-3">
                <input v-model="stop.searchQuery" @keyup.enter="searchPlaces(stop)"
                  placeholder="Search by category (e.g. 'Beach', 'Bar', 'Restaurant')" />
                <button class="btn text-white" @click="searchPlaces(stop)"><i class="fa-solid fa-magnifying-glass"></i></button>
              </div>
                
                <!-- Mostra i risultati della ricerca dei luoghi se ci sono risultati -->
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

                  <!-- Controlli di paginazione per i luoghi -->
                  <div class="pagination">
                    <button class="btn text-white" @click="previousPagePlaces"
                      :disabled="currentPagePlaces === 1">Precedente</button>
                    <span>Page {{ currentPagePlaces }} di {{ totalPagesPlaces }}</span>
                    <button class="btn text-white" @click="nextPagePlaces"
                      :disabled="currentPagePlaces === totalPagesPlaces">Successiva</button>
                  </div>
                </div>

                <!-- Messaggio quando non ci sono risultati per la ricerca -->
                <div v-else-if="stop.searched">
                  <p>No results found for "{{ stop.searchQuery }}".</p>
                </div>

                <!-- Mostra messaggio di errore se esiste -->
                <div v-if="error">{{ error }}</div>
              </div>

              <!-- Sezione per aggiungere e visualizzare note -->
              <div class="note-section">
                <textarea class="p-2" v-model="newNoteContent[stop.id]" placeholder="Add your thougths...."></textarea>
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

          <!-- Sezione della mappa per il giorno -->
          <div :id="`map-day-${day.id}`" class="map"></div>
        </div>
      </div>

      <!-- Sezioni di ricerca -->
      <div class="search-sections">
        
        <!-- Ricerca di piatti tipici -->
        <div class="dishes-search">
          <h1 class="my-4">Search Typical Dishes</h1>

          <div class="search-bar mb-4">
            <input v-model="searchQuery" type="text" placeholder="Insert place name...." />
            <button @click="searchDishes"><i class="fa-solid fa-magnifying-glass"></i></button>
          </div>

          <!-- Mostra i risultati della ricerca dei piatti tipici -->
          <div v-if="dishes.length" class="dishes-section">
            <h3>Search Typical Dishes</h3>
            <ul>
              <li v-for="dish in paginatedDishes" :key="dish.id" class="dish-item">
                <div class="dish-image-wrapper">
                  <img :src="dish.image" alt="Immagine piatto" class="dish-image" />
                </div>
                <div class="dish-info">
                  <h4>{{ dish.title }}</h4>
                </div>
              </li>
            </ul>
            <div class="pagination">
              <button class="btn text-white" @click="previousPageDishes"
                :disabled="currentPageDishes === 1">Precedente</button>
              <span>Page {{ currentPageDishes }} di {{ totalPagesDishes }}</span>
              <button class="btn text-white" @click="nextPageDishes"
                :disabled="currentPageDishes === totalPagesDishes">Successiva</button>
            </div>
          </div>

          <!-- Messaggio di errore se non ci sono piatti trovati -->
          <div v-if="dishes.length === 0 && error" class="error">{{ error }}</div>
        </div>

        <!-- Ricerca di musei e cultura -->
        <div class="museum-search">
          <h1 class="my-4">Search Museum & Culture</h1>

          <div class="search-bar mb-4">
            <input v-model="query" type="text" placeholder="Search Museums and Cultural places...." />
            <button @click="searchMuseums"><i class="fa-solid fa-magnifying-glass"></i></button>
          </div>

          <!-- Mostra i risultati della ricerca dei musei -->
          <div v-if="museums.length" class="results">
            <h3>Results for Searching</h3>
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
                :disabled="currentPageMuseums === 1">Precedente</button>
              <span>Pagina {{ currentPageMuseums }} di {{ totalPagesMuseums }}</span>
              <button class="btn text-white" @click="nextPageMuseums"
                :disabled="currentPageMuseums === totalPagesMuseums">Successiva</button>
            </div>
          </div>

          <!-- Messaggio di errore se non ci sono musei trovati -->
          <div v-if="museums.length === 0 && error" class="error">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'vue-cal/dist/vuecal.css';
import VueCal from 'vue-cal';
export default {
  components: {
    VueCal
  },
  data() {
    return {
      trip: null, // Dati del viaggio, inizialmente null
      error: null, // Messaggi di errore, inizialmente null
      query: '', // Query di ricerca per i musei
      places: [], // Lista dei luoghi ricercati
      searched: false, // Indica se è stata eseguita una ricerca
      currentPageMuseums: 1, // Pagina corrente per i musei
      resultsPerPageMuseums: 5, // Risultati per pagina per i musei
      currentPageDishes: 1, // Pagina corrente per i piatti
      resultsPerPageDishes: 5, // Risultati per pagina per i piatti
      currentPagePlaces: 1, // Pagina corrente per i luoghi
      resultsPerPagePlaces: 5, // Risultati per pagina per i luoghi
      museums: [], // Lista dei musei
      dishes: [], // Lista dei piatti
      newNoteContent: {}, // Contenuto delle nuove note, inizialmente vuoto
      searchQuery: '', // Query di ricerca per i piatti
      localDishes: {
        'Napoli': [
          { id: 1, title: 'Pizza Margherita', image: 'https://media-cdn.tripadvisor.com/media/photo-s/09/f0/dd/a7/pizzeria-starita-a-materdei.jpg' },
        ],
      },
      spoonacularApiKey: 'ae85ec0a30e443e290f82d2ba8c6fec1' // Chiave API per Spoonacular
    };
  },
  created() {
    this.fetchTripDetails(); // Fetch dei dettagli del viaggio al momento della creazione del componente
  },
  computed: {
    // Calcola il numero totale di pagine per i musei
    totalPagesMuseums() {
      return Math.ceil(this.museums.length / this.resultsPerPageMuseums);
    },
    // Restituisce un sottoinsieme dei musei per la pagina corrente
    paginatedMuseums() {
      const start = (this.currentPageMuseums - 1) * this.resultsPerPageMuseums;
      const end = start + this.resultsPerPageMuseums;
      return this.museums.slice(start, end);
    },
    // Calcola il numero totale di pagine per i piatti
    totalPagesDishes() {
      return Math.ceil(this.dishes.length / this.resultsPerPageDishes);
    },
    // Restituisce un sottoinsieme dei piatti per la pagina corrente
    paginatedDishes() {
      const start = (this.currentPageDishes - 1) * this.resultsPerPageDishes;
      const end = start + this.resultsPerPageDishes;
      return this.dishes.slice(start, end);
    },
    // Calcola il numero totale di pagine per i luoghi
    totalPagesPlaces() {
      return Math.ceil(this.trip.days.flatMap(day => day.stops.flatMap(stop => stop.places)).length / this.resultsPerPagePlaces);
    },
    // Restituisce un sottoinsieme dei luoghi per la pagina corrente
    paginatedPlaces() {
      const allPlaces = this.trip.days.flatMap(day => day.stops.flatMap(stop => stop.places));
      const start = (this.currentPagePlaces - 1) * this.resultsPerPagePlaces;
      const end = start + this.resultsPerPagePlaces;
      return allPlaces.slice(start, end);
    },
  },

  methods: {
    // Fetch dei dettagli del viaggio
    async fetchTripDetails() {
      try {
        const response = await fetch(`https://camper4fourdev-d4dcbf2bd931.herokuapp.com/api/trips/${this.$route.params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch trip details'); // Errore nella fetch dei dettagli del viaggio
        }
        const data = await response.json();

        // Inizializza le proprietà dei "stop" nel viaggio
        data.days.forEach(day => {
          day.stops.forEach(stop => {
            stop.userRating = stop.rating || 0; // Imposta la valutazione dell'utente
            stop.notes = stop.notes || []; // Imposta le note
            stop.dishes = stop.dishes || []; // Imposta i piatti
            stop.searchQuery = ''; // Imposta la query di ricerca
            stop.places = []; // Imposta i luoghi
            stop.searched = false; // Imposta lo stato di ricerca

            this.newNoteContent[stop.id] = ''; // Inizializza il contenuto delle nuove note

            // Fetch dei piatti tipici per la location dello stop
            this.fetchTypicalDishes(stop.location)
              .then(() => {
                const stopDishes = this.dishes.filter(dish => dish.title.includes(stop.location));
                stop.dishes = stopDishes;
              });
          });
        });

        this.trip = data; // Imposta i dettagli del viaggio
        this.$nextTick(() => {
          this.initMap(); // Inizializza la mappa dopo il rendering
        });
      } catch (error) {
        this.error = error.message; // Gestione degli errori
      }
    },

    // Ricerca dei luoghi utilizzando Yelp API
    async searchPlaces(stop) {
      if (!stop.searchQuery) {
        this.error = 'Inserisci una categoria da cercare'; // Errore se la query è vuota
        return;
      }

      stop.searched = false; // Imposta lo stato di ricerca
      this.error = null;

      try {
        stop.places = await this.fetchYelpPlaces(stop.searchQuery, stop.location); // Fetch dei luoghi da Yelp
        stop.searched = true; // Imposta lo stato di ricerca completata
      } catch (error) {
        this.error = 'Errore durante la ricerca'; // Gestione degli errori
      }
    },

    // Fetch dei luoghi utilizzando Yelp API
    async fetchYelpPlaces(term, location) {
      const apiKey = 'gBxMHufFJrBhAPt1Joi2s_GfgGHx0xkK9QKgMMDvPjtUEyt5ARuzUWf0D8SoS24RxjlGda88oB0XuyVPlXjrFGJxr0_fA90rjWXwIc-BoM-6_UKOmLc1kEn4aJPRZnYx';
      const url = `https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&limit=40`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`, // Autenticazione con chiave API
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch places from Yelp'); // Errore nella fetch dei luoghi
      }

      const data = await response.json();
      return data.businesses;
    },

    // Naviga alla pagina precedente dei luoghi
    previousPagePlaces() {
      if (this.currentPagePlaces > 1) {
        this.currentPagePlaces--;
      }
    },

    // Naviga alla pagina successiva dei luoghi
    nextPagePlaces() {
      if (this.currentPagePlaces < this.totalPagesPlaces) {
        this.currentPagePlaces++;
      }
    },

    // Ricerca dei musei utilizzando OpenStreetMap API
    async searchMuseums() {
      if (!this.query) {
        this.error = 'Please enter a search query.'; // Errore se la query è vuota
        return;
      }
      this.error = null;
      this.currentPage = 1;

      const encodedQuery = encodeURIComponent(this.query);

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}`);
        const geocodingData = await response.json();

        if (!geocodingData || geocodingData.length === 0) {
          this.error = 'Location not found.'; // Errore se la location non è trovata
          return;
        }

        const { lat, lon } = geocodingData[0];

        const museumsResponse = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"~"museum|artwork|theatre|library"](around:5000,${lat},${lon});out;`);
        if (!museumsResponse.ok) {
          throw new Error('Failed to fetch museums'); // Errore nella fetch dei musei
        }

        const museumsData = await museumsResponse.json();

        this.museums = museumsData.elements.map(element => ({
          id: element.id,
          name: element.tags.name || 'Unnamed place', // Nome del museo
          description: element.tags.description || 'No description available', // Descrizione del museo
          lat: element.lat,
          lon: element.lon,
        }));
      } catch (error) {
        this.error = error.message; // Gestione degli errori
        console.error('Error fetching museums:', error);
      }
    },

    // Naviga alla pagina precedente dei musei
    previousPageMuseums() {
      if (this.currentPageMuseums > 1) {
        this.currentPageMuseums--;
      }
    },

    // Naviga alla pagina successiva dei musei
    nextPageMuseums() {
      if (this.currentPageMuseums < this.totalPagesMuseums) {
        this.currentPageMuseums++;
      }
    },

    // Aggiunge una valutazione a uno "stop"
    async rateStop(stop, rating) {
      try {
        stop.userRating = rating; // Imposta la valutazione

        const response = await fetch(`https://camper4fourdev-d4dcbf2bd931.herokuapp.com/api/stops/${stop.id}/rate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rating }), // Corpo della richiesta con la valutazione
        });

        if (!response.ok) {
          throw new Error('Failed to rate stop'); // Errore nella valutazione
        }

        const data = await response.json();
        console.log('Rating saved:', data); // Mostra il risultato della valutazione

      } catch (error) {
        console.error('Error rating stop:', error); // Gestione degli errori
      }
    },

    // Aggiunge una nota a uno "stop"
    async addNote(stopId) {
      try {
        const response = await fetch(`https://camper4fourdev-d4dcbf2bd931.herokuapp.com/api/stops/${stopId}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: this.newNoteContent[stopId] }), // Corpo della richiesta con il contenuto della nota
        });

        if (!response.ok) {
          throw new Error('Failed to add note'); // Errore nell'aggiungere la nota
        }

        const newNote = await response.json();
        const stop = this.trip.days.flatMap(day => day.stops).find(s => s.id === stopId);
        stop.notes.push(newNote); // Aggiungi la nuova nota
        this.newNoteContent[stopId] = ''; // Pulisci il contenuto della nuova nota

      } catch (error) {
        console.error('Error adding note:', error); // Gestione degli errori
      }
    },

    // Elimina una nota
    async deleteNote(noteId) {
      try {
        const response = await fetch(`https://camper4fourdev-d4dcbf2bd931.herokuapp.com/api/notes/${noteId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete note'); // Errore nell'eliminare la nota
        }

        this.trip.days.forEach(day => {
          day.stops.forEach(stop => {
            const index = stop.notes.findIndex(n => n.id === noteId);
            if (index !== -1) {
              stop.notes.splice(index, 1); // Rimuovi la nota
            }
          });
        });

      } catch (error) {
        console.error('Error deleting note:', error); // Gestione degli errori
      }
    },

    // Ricerca dei piatti utilizzando Spoonacular API
    async searchDishes() {
      if (!this.searchQuery.trim()) {
        alert('Per favore, inserisci il nome di un luogo.'); // Errore se la query è vuota
        return;
      }

      const query = this.searchQuery.trim();

      // Se esistono piatti locali per la query, impostali
      if (this.localDishes[query]) {
        this.dishes = this.localDishes[query];
        this.totalDishPages = 1;
        this.currentDishPage = 1;
        return;
      }

      try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=100&apiKey=${this.spoonacularApiKey}`);
        if (!response.ok) {
          throw new Error('Failed to fetch dishes'); // Errore nella fetch dei piatti
        }
        const data = await response.json();
        console.log('Fetched dishes:', data);

        if (data.results && data.results.length > 0) {
          this.dishes = data.results;
          this.totalDishPages = Math.ceil(this.dishes.length / this.resultsPerPageDishes); // Calcola il numero totale di pagine per i piatti
          this.currentDishPage = 1;
        } else {
          this.dishes = [];
          this.totalDishPages = 1;
          this.currentDishPage = 1;
        }

      } catch (error) {
        console.error('Error fetching dishes:', error); // Gestione degli errori
      }
    },

    // Naviga alla pagina precedente dei piatti
    previousPageDishes() {
      if (this.currentPageDishes > 1) {
        this.currentPageDishes--;
      }
    },

    // Naviga alla pagina successiva dei piatti
    nextPageDishes() {
      if (this.currentPageDishes < this.totalPagesDishes) {
        this.currentPageDishes++;
      }
    },

    // Fetch dei piatti tipici per una location
    async fetchTypicalDishes(location) {
      try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${location}&number=5&apiKey=${this.spoonacularApiKey}`);
        if (!response.ok) {
          throw new Error('Failed to fetch typical dishes'); // Errore nella fetch dei piatti tipici
        }
        const data = await response.json();
        console.log(`Fetched typical dishes for ${location}:`, data);

        if (data.results && data.results.length > 0) {
          this.dishes = data.results;
        } else {
          this.dishes = [];
          console.warn(`No typical dishes found for ${location}`); // Avviso se non sono stati trovati piatti tipici
        }

      } catch (error) {
        console.error(`Error fetching typical dishes for ${location}:`, error); // Gestione degli errori
      }
    },

    // Inizializza la mappa utilizzando TomTom API
    initMap() {
      if (typeof tt === 'undefined') {
        console.error('TomTom Map library is not loaded.'); // Errore se la libreria TomTom non è caricata
        return;
      }

      const apiKey = 'Cf1IzBcyaYOQVbv27Qm29CkFFZxlMK9w'; // Chiave API per TomTom

      if (!this.trip || !this.trip.days || this.trip.days.length === 0) {
        console.error('No days available for this trip.'); // Errore se non ci sono giorni disponibili per il viaggio
        return;
      }

      this.trip.days.forEach(day => {
        if (!day.stops || day.stops.length === 0) {
          console.warn(`No stops available for day ${day.id}`); // Avviso se non ci sono soste per il giorno
        } else {
          console.log(`Initializing map for day ${day.id} at ${day.stops[0].latitude}, ${day.stops[0].longitude}`);
        }
      });

      this.trip.days.forEach(day => {
        if (day.stops && day.stops.length > 0) {
          const map = tt.map({
            key: apiKey,
            container: `map-day-${day.id}`, // ID del contenitore della mappa
            center: [day.stops[0].longitude, day.stops[0].latitude],
            zoom: 8
          });

          // Aggiungi marker per ciascuna sosta
          day.stops.forEach(stop => {
            new tt.Marker()
              .setLngLat([stop.longitude, stop.latitude])
              .setPopup(new tt.Popup({ offset: 35 }).setHTML(`<h4>${stop.location}</h4>`))
              .addTo(map);
          });

          // Calcola il percorso tra le soste se ce ne sono più di una
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
                console.error('Error calculating route:', error); // Gestione degli errori
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
  border-radius: 12px;
}

/* Layout Styles */
.trip-content {
  display: flex;
  flex-direction: column;
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

.date-box {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
  text-align: center;
}

.date-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a5d5e;
}
</style>
