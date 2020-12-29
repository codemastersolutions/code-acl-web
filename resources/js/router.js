import VueRouter from 'vue-router';

const pathUrl = window.location.pathname;
const path = pathUrl.split('/code-acl-web', 1);
const url = `${path}/code-acl-web`

const routes = [
    { path: '/cms', redirect: { name: 'home' } },
    { path: '/code-acl-web', redirect: { name: 'home' } },
    { path: `/`, name: 'home', component: () => import('./components/HomeComponent.vue') },
    { path: `/modules`, name: 'modules', component: () => import('./components/ModulesComponent.vue') },
    { path: `/permissions`, name: 'permissions', component: () => import('./components/PermissionsComponent.vue') },
    { path: `/roles`, name: 'roles', component: () => import('./components/RolesComponent.vue') },
    { path: `/systems`, name: 'systems', component: () => import('./components/SystemsComponent.vue') },
    { path: `/users`, name: 'users', component: () => import('./components/UsersComponent.vue') }
];

export const router = new VueRouter({
    mode: 'history',
    base: url,
    routes,
});
