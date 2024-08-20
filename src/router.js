import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';
import Stops from './components/Stops.vue';
import Trips from './components/Trips.vue';
import TripShow from './components/TripShow.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard },
    { path: '/stops', component: Stops },
    { path: '/trips', component: Trips },
    { path: '/trips/:id', component: TripShow, name: 'TripShow' },
    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;