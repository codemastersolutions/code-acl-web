/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

window.Vue = require('vue');

//Import progressbar
require('./progressbar');

//Setup custom events
require('./customEvents');

import VueRouter from 'vue-router';
Vue.use(VueRouter);

//Import Sweetalert2
import Swal from 'sweetalert2';
window.Swal = Swal;

const SwalQuestion = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary btn-square ml-5',
        cancelButton: 'btn btn-danger btn-square'
    },
    buttonsStyling: false,
    allowOutsideClick: false,
    reverseButtons: true,
    text: 'Esta ação não poderá ser desfeita!',
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

//Import v-from
import { Form, HasError, AlertError } from 'vform';
window.Form = Form;
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);

//Routes
import { routes } from './routes';

const router = new VueRouter({
    mode: 'history',
    routes,
});

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
