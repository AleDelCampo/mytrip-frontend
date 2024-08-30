import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import About from './components/About.vue';
import TripShow from './components/TripShow.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/trips/:id', component: TripShow, name: 'TripShow' },
    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;