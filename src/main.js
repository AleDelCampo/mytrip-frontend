import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


axios.defaults.baseURL = 'https://camper4fourdev-d4dcbf2bd931.herokuapp.com/api';
createApp(App).use(router).mount('#app')
