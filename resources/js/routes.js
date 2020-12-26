import HomeComponent from './components/HomeComponent.vue';
import ModulesComponent from './components/ModulesComponent.vue';
import PermissionsComponent from './components/PermissionsComponent.vue';
import RolesComponent from './components/RolesComponent.vue';
import SystemsComponent from './components/SystemsComponent.vue';
import UsersComponent from './components/UsersComponent.vue';

const pathUrl = '/cms/code-acl-web';

export const routes = [
    { path: pathUrl, component: HomeComponent },
    { path: `${pathUrl}/modules`, component: ModulesComponent },
    { path: `${pathUrl}/permissions`, component: PermissionsComponent },
    { path: `${pathUrl}/roles`, component: RolesComponent },
    { path: `${pathUrl}/systems`, component: SystemsComponent },
    { path: `${pathUrl}/users`, component: UsersComponent },
];
