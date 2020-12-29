/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

window.Vue = require('vue');

import moment from 'moment-timezone';
require('moment/locale/pt-br');

Vue.filter('pt_br', function(value) {
    if (value) {
        const newDate = moment.tz(value, 'UTC');
        return moment.tz(newDate, 'America/Sao_Paulo').format('DD/MM/YYYY HH:mm:ss');
    }
});

import axios from 'axios';
window.axios = axios;

window.urls = {
    baseURL: 'http://localhost:8000',
    pathUrl: '/cms/code-acl-web',
    login: '/login',
    graphqlApi: '/graphql/code_acl',
    sanctumCsrf: '/sanctum/csrf-cookie',
};

window.api = window.axios.create({
    baseURL: window.urls.baseURL,
    withCredentials: true
});

//Import progressbar
require('./progressbar');

//Setup custom events
require('./customEvents');

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Paginate from 'vuejs-paginate';
Vue.component('paginate', Paginate);

//Import Sweetalert2
import Swal from 'sweetalert2';
window.Swal = Swal;

const SwalQuestion = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary btn-square ml-3',
        cancelButton: 'btn btn-danger btn-square'
    },
    buttonsStyling: false,
    allowOutsideClick: false,
    reverseButtons: true,
    icon: 'question',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sim, confirmo'
});

const SwalSuccess = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-info btn-square'
    },
    buttonsStyling: false,
    allowOutsideClick: true,
    icon: 'success',
    showCancelButton: false,
    confirmButtonText: 'Fechar',
});

const SwalError = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-danger btn-square'
    },
    buttonsStyling: false,
    allowOutsideClick: true,
    icon: 'error',
    showCancelButton: false,
    confirmButtonText: 'Fechar',
});

const swalLoginForm = Swal.mixin({
    title: 'Multiple inputs',
    html:
        '<input id="swal-input1" class="swal2-input">' +
        '<input id="swal-input2" class="swal2-input">',
    focusConfirm: false,
    preConfirm: () => {
        return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value
        ]
    }
});

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

window.Toast = Toast;
window.SwalQuestion = SwalQuestion;
window.SwalSuccess = SwalSuccess;
window.SwalError = SwalError;

//Import v-from
import { Form, HasError, AlertError } from 'vform';
window.Form = Form;
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);

//Routes
import { router } from './router';

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

const files = require.context('./', true, /\.vue$/i);
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

// Vue.component('home-component', require('./components/HomeComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#code-acl-web',
    router
});
