import HomeComponent from './components/HomeComponent.vue';
import PermissionsComponent from './components/PermissionsComponent.vue';
import RolesComponent from './components/RolesComponent.vue';

export const routes = [
    { path:'/', component: HomeComponent },
    { path:'/permissions', component: PermissionsComponent },
    { path:'/roles', component: RolesComponent },
];
