<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <div class="card">
                    <div class="card-header pt-1 pb-1">
                        <div class="row align-items-center">
                            <div class="col-sm-12 col-md-5 col-lg-4">
                                <h5>Usuários</h5>
                            </div>
                            <div class="col-sm-12 col-md-3 col-lg-3">
                                <!-- <button class="btn btn-sm btn-square btn-primary mb-xs-1 mb-sm-1 mb-md-1" type="button" @click="userNew()">
                                    Novo usuário
                                </button> -->
                                <button class="btn btn-square btn-success mb-xs-1 mb-sm-1 mb-md-1" type="button" @click.stop="usersList()"
                                    title="Atualizar lista de usuários">
                                    <i class="cil-reload"></i>
                                </button>
                            </div>
                            <div class="col-sm-12 col-md-4 col-lg-5">
                                <div class="input-group mb-0 mt-sm-1 mt-md-1">
                                    <div class="input-group-prepend pointer">
                                        <select class="form-control flat" id="userSearchFieldSelect" name="userSearchFieldSelect"
                                            v-model="userSearchField" @change="usersList()">
                                            <option value="email">E-mail</option>
                                            <option value="name">Nome</option>
                                        </select>
                                    </div>
                                    <input type="text" class="form-control flat" v-model="userSearch"
                                        @keyup.stop="usersList()" :placeholder="userSearchFieldPlaceholder">
                                    <div class="input-group-prepend pointer" title="Pesquisar usuário">
                                        <div class="input-group-text flat" @click.stop="usersList()">
                                            <i class="cil-search"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table table-responsive-sm table-sm table-hover">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>Data Criação</th>
                                <th>Última Alteração</th>
                                <th class="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in users" :key="user.id">
                                <td>{{user.name}}</td>
                                <td>{{user.email}}</td>
                                <td>{{user.createdAt | pt_br}}</td>
                                <td>{{user.updatedAt | pt_br}}</td>
                                <td class="text-center">
                                    <!-- <span class="pointer" @click="userDetails(user)" title="Detalhes do usuário">
                                        <i class="c-icon cil-plus text-warning"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="userEdit(user)" title="Editar este usuário">
                                        <i class="c-icon cil-pencil text-primary"></i>
                                    </span>
                                    | -->
                                    <span class="pointer" @click="userDelete(user)" title="Exluir este usuário">
                                        <i class="c-icon cil-trash text-danger"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="showModal('userModulesModal', user)" title="Módulos vinculados ao usuário">
                                        <i class="c-icon cil-view-module text-info"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="showModal('userRolesModal', user)" title="Papéis vinculados ao usuário">
                                        <i class="c-icon cil-notes text-dark"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="showModal('userPermissionsModal', user)" title="Permissões vinculados ao usuário">
                                        <i class="c-icon cil-fingerprint text-success"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="showModal('userSystemsModal', user)" title="Sistemas vinculados ao usuário">
                                        <i class="c-icon cil-memory text-light bg-dark"></i>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                        </table>

                        <paginate
                            v-if="hasUsers"
                            v-model="usersPage"
                            :pageCount="usersPageCount"
                            :pageRange="5"
                            :clickHandler="usersList"
                            :prevText="'Anterior'"
                            :nextText="'Próximo'"
                            :containerClass="'pagination pagination-sm'"
                            :pageClass="'page-item'"
                            :pageLinkClass="'page-link'"
                            :prevLinkClass="'page-link'"
                            :nextLinkClass="'page-link'"
                            :activeClass="'active'">
                        </paginate>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="userModulesModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display: none;" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content flat" v-if="selectedUser">
                    <div class="modal-header pt-1 pb-1">
                        <h4 class="modal-title">Módulos vinculados ao usuário: <strong>{{selectedUser.name}}</strong></h4>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-6">
                                <div class="card card-accent-info mb-2">
                                    <div class="card-header p-1">Pesquisar módulos vinculados</div>
                                    <div class="card-body p-1">
                                        <div class="input-group mb-1">
                                            <div class="input-group-prepend pointer">
                                                <select class="form-control flat" id="userModulesSearchFieldSelect" name="userModulesSearchFieldSelect"
                                                    v-model="userModulesSearchField" @change="userModulesList()">
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" v-model="userModulesSearch"
                                                @keyup.stop="userModulesList()" :placeholder="userModulesSearchFieldPlaceholder">
                                            <div class="input-group-prepend pointer" title="Pesquisar módulos">
                                                <div class="input-group-text flat" @click.stop="userModulesList()">
                                                    <i class="cil-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="card card-accent-success mb-2">
                                    <div class="card-header p-1">Vincular novo módulo</div>
                                    <div class="card-body p-1">
                                        <div class="input-group mb-1">
                                            <div class="input-group-prepend pointer">
                                                <select class="form-control flat" id="modulesSearchFieldSelect" name="modulesSearchFieldSelect"
                                                    v-model="modulesSearchField" @change="searchModules()">
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" :placeholder="modulesSearchFieldPlaceholder"
                                                v-model="modulesSearch" @keyup.stop="searchModules()">
                                            <div class="input-group-prepend pointer" @click.stop="searchModules()" title="Pesquisar módulos">
                                                <div class="input-group-text flat">
                                                    <i class="cil-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="searchTable" v-if="modules.length > 0">
                                            <table class="table table-responsive-sm table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th class="text-right">
                                                        <span class="badge badge-danger pointer flat" @click="clearModules()">
                                                            Limpar
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="module in modules" :key="module.slug">
                                                    <td>{{module.name}}</td>
                                                    <td class="text-right">
                                                        <span class="badge badge-primary pointer flat" @click.stop="attachModule(module)">
                                                            Vincular
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                            <div class="row m-0 p-0 justify-content-center">
                                                <paginate
                                                    v-if="modulesHasMorePages"
                                                    v-model="modulesPage"
                                                    :pageCount="modulePageCount"
                                                    :pageRange="3"
                                                    :clickHandler="searchModules"
                                                    :prevText="'Anterior'"
                                                    :nextText="'Próximo'"
                                                    :containerClass="'pagination pagination-sm mb-0'"
                                                    :pageClass="'page-item'"
                                                    :pageLinkClass="'page-link'"
                                                    :prevLinkClass="'page-link'"
                                                    :nextLinkClass="'page-link'"
                                                    :activeClass="'active'">
                                                </paginate>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card card-accent-primary p-0 mt-0 mb-0">
                            <div class="card-body m-0 p-0">
                                <table class="table table-responsive-sm table-sm table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th class="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="module in userModules" :key="module.slug">
                                        <td>{{module.name}}</td>
                                        <td class="text-center">
                                            <span class="pointer" @click.stop="detachModule(module)" title="Desvincular módulo">
                                                <i class="cc-icon cil-trash text-danger"></i>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            <div class="card-footer m-0 p-1">
                                <paginate
                                    v-if="hasUserModules"
                                    v-model="userModulesPage"
                                    :pageCount="userModulesPageCount"
                                    :pageRange="5"
                                    :clickHandler="userModulesList"
                                    :prevText="'Anterior'"
                                    :nextText="'Próximo'"
                                    :containerClass="'pagination pagination-sm m-0 justify-content-center'"
                                    :pageClass="'page-item'"
                                    :pageLinkClass="'page-link'"
                                    :prevLinkClass="'page-link'"
                                    :nextLinkClass="'page-link'"
                                    :activeClass="'active'">
                                </paginate>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer pt-1 pb-1 justify-content-between">
                        <button class="btn btn-success btn-square" @click.stop="refreshUserModulesList()">
                            <i class="cil-reload"></i> Atualizar
                        </button>
                        <button class="btn btn-danger btn-square" type="button" data-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="userPermissionsModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display: none;" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content flat" v-if="selectedUser">
                    <div class="modal-header pt-1 pb-1">
                        <h4 class="modal-title">Permissões vinculadas ao usuário: <strong>{{selectedUser.name}}</strong></h4>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-6">
                                <div class="card card-accent-info mb-2">
                                    <div class="card-header p-1">Pesquisar permissões vinculadas</div>
                                    <div class="card-body p-1">
                                        <div class="input-group mb-1">
                                            <div class="input-group-prepend pointer">
                                                <select class="form-control flat" id="userPermissionsSearchFieldSelect" name="userPermissionsSearchFieldSelect"
                                                    v-model="userPermissionsSearchField" @change="userPermissionsList()">
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" v-model="userPermissionsSearch"
                                                @keyup.stop="userPermissionsList()" :placeholder="userPermissionsSearchFieldPlaceholder">
                                            <div class="input-group-prepend pointer" title="Pesquisar permissões">
                                                <div class="input-group-text flat" @click.stop="userPermissionsList()">
                                                    <i class="cil-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="card card-accent-success mb-2">
                                    <div class="card-header p-1">Vincular nova permissão</div>
                                    <div class="card-body p-1">
                                        <div class="input-group mb-1">
                                            <div class="input-group-prepend pointer">
                                                <select class="form-control flat" id="permissionsSearchFieldSelect" name="permissionsSearchFieldSelect"
                                                    v-model="permissionsSearchField" @change="searchPermissions()">
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" :placeholder="permissionsSearchFieldPlaceholder"
                                                v-model="permissionsSearch" @keyup.stop="searchPermissions()">
                                            <div class="input-group-prepend pointer" @click.stop="searchPermissions()" title="Pesquisar permissões">
                                                <div class="input-group-text flat">
                                                    <i class="cil-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="searchTable" v-if="permissions.length > 0">
                                            <table class="table table-responsive-sm table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th class="text-right">
                                                        <span class="badge badge-danger pointer flat" @click="clearPermissions()">
                                                            Limpar
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="permission in permissions" :key="permission.slug">
                                                    <td>{{permission.name}}</td>
                                                    <td class="text-right">
                                                        <span class="badge badge-primary pointer flat" @click.stop="attachPermission(permission)">
                                                            Vincular
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                            <div class="row m-0 p-0 justify-content-center">
                                                <paginate
                                                    v-if="permissionsHasMorePages"
                                                    v-model="permissionsPage"
                                                    :pageCount="permissionPageCount"
                                                    :pageRange="3"
                                                    :clickHandler="searchPermissions"
                                                    :prevText="'Anterior'"
                                                    :nextText="'Próximo'"
                                                    :containerClass="'pagination pagination-sm mb-0'"
                                                    :pageClass="'page-item'"
                                                    :pageLinkClass="'page-link'"
                                                    :prevLinkClass="'page-link'"
                                                    :nextLinkClass="'page-link'"
                                                    :activeClass="'active'">
                                                </paginate>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card card-accent-primary p-0 mt-0 mb-0">
                            <div class="card-body m-0 p-0">
                                <table class="table table-responsive-sm table-sm table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th class="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="permission in userPermissions" :key="permission.slug">
                                        <td>{{permission.name}}</td>
                                        <td class="text-center">
                                            <span class="pointer" @click.stop="detachPermission(permission)" title="Desvincular permissão">
                                                <i class="cc-icon cil-trash text-danger"></i>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            <div class="card-footer m-0 p-1">
                                <paginate
                                    v-if="hasUserPermissions"
                                    v-model="userPermissionsPage"
                                    :pageCount="userPermissionsPageCount"
                                    :pageRange="5"
                                    :clickHandler="userPermissionsList"
                                    :prevText="'Anterior'"
                                    :nextText="'Próximo'"
                                    :containerClass="'pagination pagination-sm m-0 justify-content-center'"
                                    :pageClass="'page-item'"
                                    :pageLinkClass="'page-link'"
                                    :prevLinkClass="'page-link'"
                                    :nextLinkClass="'page-link'"
                                    :activeClass="'active'">
                                </paginate>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer pt-1 pb-1 justify-content-between">
                        <button class="btn btn-success btn-square" @click.stop="refreshUserPermissionsList()">
                            <i class="cil-reload"></i> Atualizar
                        </button>
                        <button class="btn btn-danger btn-square" type="button" data-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="userRolesModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display: none;" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content flat" v-if="selectedUser">
                    <div class="modal-header pt-1 pb-1">
                        <h4 class="modal-title">Papéis vinculadas ao usuário: <strong>{{selectedUser.name}}</strong></h4>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-6">
                                <div class="card card-accent-info mb-2">
                                    <div class="card-header p-1">Pesquisar papéis vinculadas</div>
                                    <div class="card-body p-1">
                                        <div class="input-group mb-1">
                                            <div class="input-group-prepend pointer">
                                                <select class="form-control flat" id="userRolesSearchFieldSelect" name="userRolesSearchFieldSelect"
                                                    v-model="userRolesSearchField" @change="userRolesList()">
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" v-model="userRolesSearch"
                                                @keyup.stop="userRolesList()" :placeholder="userRolesSearchFieldPlaceholder">
                                            <div class="input-group-prepend pointer" title="Pesquisar papéis">
                                                <div class="input-group-text flat" @click.stop="userRolesList()">
                                                    <i class="cil-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="card card-accent-success mb-2">
                                    <div class="card-header p-1">Vincular novo papel</div>
                                    <div class="card-body p-1">
                                        <div class="input-group mb-1">
                                            <div class="input-group-prepend pointer">
                                                <select class="form-control flat" id="rolesSearchFieldSelect" name="rolesSearchFieldSelect"
                                                    v-model="rolesSearchField" @change="searchRoles()">
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" :placeholder="rolesSearchFieldPlaceholder"
                                                v-model="rolesSearch" @keyup.stop="searchRoles()">
                                            <div class="input-group-prepend pointer" @click.stop="searchRoles()" title="Pesquisar papel">
                                                <div class="input-group-text flat">
                                                    <i class="cil-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="searchTable" v-if="roles.length > 0">
                                            <table class="table table-responsive-sm table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th class="text-right">
                                                        <span class="badge badge-danger pointer flat" @click="clearRoles()">
                                                            Limpar
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="role in roles" :key="role.slug">
                                                    <td>{{role.name}}</td>
                                                    <td class="text-right">
                                                        <span class="badge badge-primary pointer flat" @click.stop="attachRole(role)">
                                                            Vincular
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                            <div class="row m-0 p-0 justify-content-center">
                                                <paginate
                                                    v-if="rolesHasMorePages"
                                                    v-model="rolesPage"
                                                    :pageCount="rolesPageCount"
                                                    :pageRange="3"
                                                    :clickHandler="searchRoles"
                                                    :prevText="'Anterior'"
                                                    :nextText="'Próximo'"
                                                    :containerClass="'pagination pagination-sm mb-0'"
                                                    :pageClass="'page-item'"
                                                    :pageLinkClass="'page-link'"
                                                    :prevLinkClass="'page-link'"
                                                    :nextLinkClass="'page-link'"
                                                    :activeClass="'active'">
                                                </paginate>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card card-accent-primary p-0 mt-0 mb-0">
                            <div class="card-body m-0 p-0">
                                <table class="table table-responsive-sm table-sm table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th class="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="role in userRoles" :key="role.slug">
                                        <td>{{role.name}}</td>
                                        <td class="text-center">
                                            <span class="pointer" @click.stop="detachRole(role)" title="Desvincular papel">
                                                <i class="cc-icon cil-trash text-danger"></i>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            <div class="card-footer m-0 p-1">
                                <paginate
                                    v-if="hasUserRoles"
                                    v-model="userRolesPage"
                                    :pageCount="userRolesPageCount"
                                    :pageRange="5"
                                    :clickHandler="userRolesList"
                                    :prevText="'Anterior'"
                                    :nextText="'Próximo'"
                                    :containerClass="'pagination pagination-sm m-0 justify-content-center'"
                                    :pageClass="'page-item'"
                                    :pageLinkClass="'page-link'"
                                    :prevLinkClass="'page-link'"
                                    :nextLinkClass="'page-link'"
                                    :activeClass="'active'">
                                </paginate>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer pt-1 pb-1 justify-content-between">
                        <button class="btn btn-success btn-square" @click.stop="refreshUserRolesList()">
                            <i class="cil-reload"></i> Atualizar
                        </button>
                        <button class="btn btn-danger btn-square" type="button" data-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="userSystemsModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display: none;" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content flat" v-if="selectedUser">
                    <div class="modal-header pt-1 pb-1">
                        <h4 class="modal-title">Sistemas vinculados ao usuário: <strong>{{selectedUser.name}}</strong></h4>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-6">
                                <div class="card card-accent-info mb-2">
                                    <div class="card-header p-1">Pesquisar sistemas vinculados</div>
                                    <div class="card-body p-1">
                                        <div class="input-group mb-1">
                                            <div class="input-group-prepend pointer">
                                                <select class="form-control flat" id="userSystemsSearchFieldSelect" name="userSystemsSearchFieldSelect"
                                                    v-model="userSystemsSearchField" @change="userSystemsList()">
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" v-model="userSystemsSearch"
                                                @keyup.stop="userSystemsList()" :placeholder="userSystemsSearchFieldPlaceholder">
                                            <div class="input-group-prepend pointer" title="Pesquisar sistemas">
                                                <div class="input-group-text flat" @click.stop="userSystemsList()">
                                                    <i class="cil-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="card card-accent-success mb-2">
                                    <div class="card-header p-1">Vincular novo sistema</div>
                                    <div class="card-body p-1">
                                        <div class="input-group mb-1">
                                            <div class="input-group-prepend pointer">
                                                <select class="form-control flat" id="systemsSearchFieldSelect" name="systemsSearchFieldSelect"
                                                    v-model="systemsSearchField" @change="searchSystems()">
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" :placeholder="systemsSearchFieldPlaceholder"
                                                v-model="systemsSearch" @keyup.stop="searchSystems()">
                                            <div class="input-group-prepend pointer" @click.stop="searchSystems()" title="Pesquisar sistemas">
                                                <div class="input-group-text flat">
                                                    <i class="cil-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="searchTable" v-if="systems.length > 0">
                                            <table class="table table-responsive-sm table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th class="text-right">
                                                        <span class="badge badge-danger pointer flat" @click="clearSystems()">
                                                            Limpar
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="system in systems" :key="system.slug">
                                                    <td>{{system.name}}</td>
                                                    <td class="text-right">
                                                        <span class="badge badge-primary pointer flat" @click.stop="attachSystem(system)">
                                                            Vincular
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                            <div class="row m-0 p-0 justify-content-center">
                                                <paginate
                                                    v-if="systemsHasMorePages"
                                                    v-model="systemsPage"
                                                    :pageCount="systemPageCount"
                                                    :pageRange="3"
                                                    :clickHandler="searchSystems"
                                                    :prevText="'Anterior'"
                                                    :nextText="'Próximo'"
                                                    :containerClass="'pagination pagination-sm mb-0'"
                                                    :pageClass="'page-item'"
                                                    :pageLinkClass="'page-link'"
                                                    :prevLinkClass="'page-link'"
                                                    :nextLinkClass="'page-link'"
                                                    :activeClass="'active'">
                                                </paginate>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card card-accent-primary p-0 mt-0 mb-0">
                            <div class="card-body m-0 p-0">
                                <table class="table table-responsive-sm table-sm table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th class="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="system in userSystems" :key="system.slug">
                                        <td>{{system.name}}</td>
                                        <td class="text-center">
                                            <span class="pointer" @click.stop="detachSystem(system)" title="Desvincular usuário">
                                                <i class="cc-icon cil-trash text-danger"></i>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            <div class="card-footer m-0 p-1">
                                <paginate
                                    v-if="hasUserSystems"
                                    v-model="userSystemsPage"
                                    :pageCount="userSystemsPageCount"
                                    :pageRange="5"
                                    :clickHandler="userSystemsList"
                                    :prevText="'Anterior'"
                                    :nextText="'Próximo'"
                                    :containerClass="'pagination pagination-sm m-0 justify-content-center'"
                                    :pageClass="'page-item'"
                                    :pageLinkClass="'page-link'"
                                    :prevLinkClass="'page-link'"
                                    :nextLinkClass="'page-link'"
                                    :activeClass="'active'">
                                </paginate>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer pt-1 pb-1 justify-content-between">
                        <button class="btn btn-success btn-square" @click.stop="refreshUserSystemsList()">
                            <i class="cil-reload"></i> Atualizar
                        </button>
                        <button class="btn btn-danger btn-square" type="button" data-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .searchTable td, .searchTable th {
        padding-top: 1px;
        padding-bottom: 1px;
    }
</style>

<script>
    export default {
        name: 'users',
        props: {
        },
        data() {
            return {
                selectedUser: null,

                hasUsers: false,
                users: [],
                usersPage: 1,
                usersPageCount: 0,
                usersPerPage: 15,
                userSearch: '',
                userSearchField: 'name',

                hasUserPermissions: false,
                userPermissions: [],
                userPermissionsPage: 1,
                userPermissionsPageCount: 0,
                userPermissionsPerPage: 15,
                userPermissionsSearch: '',
                userPermissionsSearchField: 'name',

                hasUserSystems: false,
                userSystems: [],
                userSystemsPage: 1,
                userSystemsPageCount: 0,
                userSystemsPerPage: 15,
                userSystemsSearch: '',
                userSystemsSearchField: 'name',

                hasUserModules: false,
                userModules: [],
                userModulesPage: 1,
                userModulesPageCount: 0,
                userModulesPerPage: 15,
                userModulesSearch: '',
                userModulesSearchField: 'name',

                hasUserRoles: false,
                userRoles: [],
                userRolesPage: 1,
                userRolesPageCount: 0,
                userRolesPerPage: 15,
                userRolesSearch: '',
                userRolesSearchField: 'name',

                permissions: [],
                permissionsHasMorePages: false,
                permissionsPage: 1,
                permissionsPageCount: 0,
                permissionsPerPage: 5,
                permissionsSearch: '',
                permissionsSearchField: 'name',

                systems: [],
                systemsHasMorePages: false,
                systemsPage: 1,
                systemsPageCount: 0,
                systemsPerPage: 5,
                systemsSearch: '',
                systemsSearchField: 'name',

                modules: [],
                modulesHasMorePages: false,
                modulesPage: 1,
                modulesPageCount: 0,
                modulesPerPage: 5,
                modulesSearch: '',
                modulesSearchField: 'name',

                roles: [],
                rolesHasMorePages: false,
                rolesPage: 1,
                rolesPageCount: 0,
                rolesPerPage: 5,
                rolesSearch: '',
                rolesSearchField: 'name',

                usersQueryFields: `data { id, name, email, createdAt, updatedAt }`,
                paginatedQueryFields: `total, current_page, last_page, has_more_pages, per_page`,
                relationshipQueryFields: `data { slug, name }`,
                defaultOrderQueryFields: `"created_at desc"`
            };
        },
        async created() {
            await window.api.get(window.urls.sanctumCsrf);
            this.usersList();
        },
        computed: {
            modulesSearchFieldPlaceholder() {
                return this.getPlaceholder(this.modulesSearchField);
            },
            permissionsSearchFieldPlaceholder() {
                return this.getPlaceholder(this.permissionsSearchField);
            },
            rolesSearchFieldPlaceholder() {
                return this.getPlaceholder(this.rolesSearchField);
            },
            systemsSearchFieldPlaceholder() {
                return this.getPlaceholder(this.systemsSearchField);
            },
            userModulesSearchFieldPlaceholder() {
                return this.getPlaceholder(this.userModulesSearchField);
            },
            userPermissionsSearchFieldPlaceholder() {
                return this.getPlaceholder(this.userPermissionsSearchField);
            },
            userRolesSearchFieldPlaceholder() {
                return this.getPlaceholder(this.userRolesSearchField);
            },
            userSearchFieldPlaceholder() {
                return this.getPlaceholder(this.userSearchField);
            },
            userSystemsSearchFieldPlaceholder() {
                return this.getPlaceholder(this.userSystemsSearchField);
            },
        },
        methods: {
            attachModule(module) {
                this.executeDB({
                    query: `
                        mutation attachModule($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                            give_module_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                        }
                    `,
                    variables: {
                        modelIdOrSlug: this.selectedUser.id,
                        relationIdOrSlug: module.slug,
                    }
                }).then(response => {
                    if (response?.data?.data?.give_module_to_user) {
                        this.searchModules();
                        this.userModulesList();
                        Toast.fire({ icon: 'success', title: `Módulo vinculado com sucesso!` });
                    } else if (response?.data?.errors?.length > 0) {
                        throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                    }
                }).catch(err => {
                    SwalError.fire({
                        title: `Falha ao vincular o módulo!`,
                        footer: `<strong>Erro:</strong>&nbsp; ${err}`
                    });
                });
            },
            attachPermission(permission) {
                this.executeDB({
                    query: `
                        mutation attachPermission($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                            give_permission_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                        }
                    `,
                    variables: {
                        modelIdOrSlug: this.selectedUser.id,
                        relationIdOrSlug: permission.slug,
                    }
                }).then(response => {
                    if (response?.data?.data?.give_permission_to_user) {
                        this.searchPermissions();
                        this.userPermissionsList();
                        Toast.fire({ icon: 'success', title: `Permissão vinculada com sucesso!` });
                    } else if (response?.data?.errors?.length > 0) {
                        throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                    }
                }).catch(err => {
                    SwalError.fire({
                        title: `Falha ao vincular a permissão!`,
                        footer: `<strong>Erro:</strong>&nbsp; ${err}`
                    });
                });
            },
            attachRole(role) {
                this.executeDB({
                    query: `
                        mutation attachRole($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                            give_role_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                        }
                    `,
                    variables: {
                        modelIdOrSlug: this.selectedUser.id,
                        relationIdOrSlug: role.slug,
                    }
                }).then(response => {
                    if (response?.data?.data?.give_role_to_user) {
                        this.searchRoles();
                        this.userRolesList();
                        Toast.fire({ icon: 'success', title: `Papel vinculado com sucesso!` });
                    } else if (response?.data?.errors?.length > 0) {
                        throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                    }
                }).catch(err => {
                    SwalError.fire({
                        title: `Falha ao vincular o papel!`,
                        footer: `<strong>Erro:</strong>&nbsp; ${err}`
                    });
                });
            },
            attachSystem(system) {
                this.executeDB({
                    query: `
                        mutation attachSystem($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                            give_system_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                        }
                    `,
                    variables: {
                        modelIdOrSlug: this.selectedUser.id,
                        relationIdOrSlug: system.slug,
                    }
                }).then(response => {
                    if (response?.data?.data?.give_system_to_user) {
                        this.searchSystems();
                        this.userSystemsList();
                        Toast.fire({ icon: 'success', title: `Sistema vinculado com sucesso!` });
                    } else if (response?.data?.errors?.length > 0) {
                        throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                    }
                }).catch(err => {
                    SwalError.fire({
                        title: `Falha ao vincular o sistema!`,
                        footer: `<strong>Erro:</strong>&nbsp; ${err}`
                    });
                });
            },
            clearPermissions() {
                this.permissions = [];
                this.permissionsPage = 1;
                this.permissionsPageCount = 0;
                this.permissionsSearch = '';
            },
            clearModules() {
                this.modules = [];
                this.modulesPage = 1;
                this.modulesPageCount = 0;
                this.modulesSearch = '';
            },
            clearRoles() {
                this.roles = [];
                this.rolesPage = 1;
                this.rolesPageCount = 0;
                this.rolesSearch = '';
            },
            clearSystems() {
                this.systems = [];
                this.systemsPage = 1;
                this.systemsPageCount = 0;
                this.systemsSearch = '';
            },
            clearUserModules() {
                this.userModules = [];
                this.userModulesPage = 1;
                this.userModulesPageCount = 0;
                this.userModulesSearch = '';
            },
            clearUserPermissions() {
                this.userPermissions = [];
                this.userPermissionsPage = 1;
                this.userPermissionsPageCount = 0;
                this.userPermissionsSearch = '';
            },
            clearUserRoles() {
                this.userRoles = [];
                this.userRolesPage = 1;
                this.userRolesPageCount = 0;
                this.userRolesSearch = '';
            },
            clearUserSystems() {
                this.userSystems = [];
                this.userSystemsPage = 1;
                this.userSystemsPageCount = 0;
                this.userSystemsSearch = '';
            },
            detachModule(module) {
                SwalQuestion.fire({
                    title: `Confirma a desvinculação do módulo ${module.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.executeDB({
                            query: `
                                mutation detachModule($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                                    detach_module_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                                }
                            `,
                            variables: {
                                modelIdOrSlug: this.selectedUser.id,
                                relationIdOrSlug: module.slug,
                            }
                        }).then(response => {
                            if (response?.data?.data?.detach_module_to_user) {
                                this.userModulesList();
                                Toast.fire({ icon: 'success', title: `Módulo desvinculado com sucesso!` });
                            } else if (response?.data?.errors?.length > 0) {
                                throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                            }
                        }).catch(err => {
                            SwalError.fire({
                                title: `Falha ao desvincular o módulo!`,
                                footer: `<strong>Erro:</strong>&nbsp; ${err}`
                            });
                        });
                    }
                });
            },
            detachPermission(permission) {
                SwalQuestion.fire({
                    title: `Confirma a desvinculação da permissão ${permission.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.executeDB({
                            query: `
                                mutation detachPermission($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                                    detach_permission_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                                }
                            `,
                            variables: {
                                modelIdOrSlug: this.selectedUser.id,
                                relationIdOrSlug: permission.slug,
                            }
                        }).then(response => {
                            if (response?.data?.data?.detach_permission_to_user) {
                                this.userPermissionsList();
                                Toast.fire({ icon: 'success', title: `Permissão desvinculada com sucesso!` });
                            } else if (response?.data?.errors?.length > 0) {
                                throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                            }
                        }).catch(err => {
                            SwalError.fire({
                                title: `Falha ao desvincular a permissão!`,
                                footer: `<strong>Erro:</strong>&nbsp; ${err}`
                            });
                        });
                    }
                });
            },
            detachRole(role) {
                SwalQuestion.fire({
                    title: `Confirma a desvinculação do papel ${role.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.executeDB({
                            query: `
                                mutation detachRole($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                                    detach_role_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                                }
                            `,
                            variables: {
                                modelIdOrSlug: this.selectedUser.id,
                                relationIdOrSlug: role.slug,
                            }
                        }).then(response => {
                            if (response?.data?.data?.detach_role_to_user) {
                                this.userRolesList();
                                Toast.fire({ icon: 'success', title: `Papél desvinculado com sucesso!` });
                            } else if (response?.data?.errors?.length > 0) {
                                throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                            }
                        }).catch(err => {
                            SwalError.fire({
                                title: `Falha ao desvincular o papel!`,
                                footer: `<strong>Erro:</strong>&nbsp; ${err}`
                            });
                        });
                    }
                });
            },
            detachSystem(system) {
                SwalQuestion.fire({
                    title: `Confirma a desvinculação do sistema ${system.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.executeDB({
                            query: `
                                mutation detachSystem($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                                    detach_system_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                                }
                            `,
                            variables: {
                                modelIdOrSlug: this.selectedUser.id,
                                relationIdOrSlug: system.slug,
                            }
                        }).then(response => {
                            if (response?.data?.data?.detach_system_to_user) {
                                this.userSystemsList();
                                Toast.fire({ icon: 'success', title: `Sistema desvinculado com sucesso!` });
                            } else if (response?.data?.errors?.length > 0) {
                                throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                            }
                        }).catch(err => {
                            SwalError.fire({
                                title: `Falha ao desvincular o sistema!`,
                                footer: `<strong>Erro:</strong>&nbsp; ${err}`
                            });
                        });
                    }
                });
            },
            executeDB(queryData) {
                return window.api.post(window.urls.graphqlApi, queryData).catch((err) => {
                    if (err.response.status === 401) {
                        window.location = `${window.urls.baseURL}${window.urls.login}`;
                    }
                });;
            },
            getPlaceholder(property) {
                switch(property) {
                    case 'name':
                        return 'Informe o nome do usuário';
                    case 'email':
                        return 'Informe o e-mail do usuário';
                }
            },
            searchModules(pageNum = 1) {
                if (this.modulesSearch.trim().length > 0) {
                    this.modulesPage = pageNum;
                    this.defaultOrderQueryFields = `"${this.modulesSearchField}"`;

                    this.executeDB({
                        query: `
                            {
                                modules_paginated(
                                    search_field: "${this.modulesSearchField}",
                                    search_term: "${this.modulesSearch}",
                                    page: ${this.modulesPage},
                                    per_page: ${this.modulesPerPage},
                                    doesnt_have_relationship: "users",
                                    relationshipIdOrSlug: "${this.selectedUser.id}",
                                ) {
                                    ${this.relationshipQueryFields},
                                    ${this.paginatedQueryFields}
                                }
                            }
                        `
                    }).then(response => {
                        const data = response.data.data.modules_paginated;

                        if (data) {
                            this.modules = data.data;
                            this.modulesPageCount = data.last_page;
                            this.modulesPerPage = data.per_page;
                            this.modulesPage = data.current_page;
                            this.modulesHasMorePages = data.has_more_pages || this.modulesPage > 1;
                        } else if (response?.data?.errors?.length > 0) {
                            throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                        }
                    }).catch(err => {
                        SwalError.fire({
                            title: `Falha ao consultar módulos!`,
                            footer: `<strong>Erro:</strong>&nbsp; ${err}`
                        });
                    });
                } else {
                    this.defaultOrderQueryFields = `"created_at desc"`;
                    this.clearModules();
                }
            },
            searchPermissions(pageNum = 1) {
                if (this.permissionsSearch.trim().length > 0) {
                    this.permissionsPage = pageNum;
                    this.defaultOrderQueryFields = `"${this.permissionsSearchField}"`;

                    this.executeDB({
                        query: `
                            {
                                permissions_paginated(
                                    search_field: "${this.permissionsSearchField}",
                                    search_term: "${this.permissionsSearch}",
                                    page: ${this.permissionsPage},
                                    per_page: ${this.permissionsPerPage},
                                    doesnt_have_relationship: "users",
                                    relationshipIdOrSlug: "${this.selectedUser.id}",
                                ) {
                                    ${this.relationshipQueryFields},
                                    ${this.paginatedQueryFields}
                                }
                            }
                        `
                    }).then(response => {
                        const data = response.data.data.permissions_paginated;

                        if (data) {
                            this.permissions = data.data;
                            this.permissionsPageCount = data.last_page;
                            this.permissionsPerPage = data.per_page;
                            this.permissionsPage = data.current_page;
                            this.permissionsHasMorePages = data.has_more_pages || this.permissionsPage > 1;
                        } else if (response?.data?.errors?.length > 0) {
                            throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                        }
                    }).catch(err => {
                        SwalError.fire({
                            title: `Falha ao consultar sistemas!`,
                            footer: `<strong>Erro:</strong>&nbsp; ${err}`
                        });
                    });
                } else {
                    this.defaultOrderQueryFields = `"created_at desc"`;
                    this.clearPermissions();
                }
            },
            searchRoles(pageNum = 1) {
                if (this.rolesSearch.trim().length > 0) {
                    this.rolesPage = pageNum;
                    this.defaultOrderQueryFields = `"${this.rolesSearchField}"`;

                    this.executeDB({
                        query: `
                            {
                                roles_paginated(
                                    search_field: "${this.rolesSearchField}",
                                    search_term: "${this.rolesSearch}",
                                    page: ${this.rolesPage},
                                    per_page: ${this.rolesPerPage},
                                    doesnt_have_relationship: "users",
                                    relationshipIdOrSlug: "${this.selectedUser.id}",
                                ) {
                                    ${this.relationshipQueryFields},
                                    ${this.paginatedQueryFields}
                                }
                            }
                        `
                    }).then(response => {
                        const data = response.data.data.roles_paginated;

                        if (data) {
                            this.roles = data.data;
                            this.rolesPageCount = data.last_page;
                            this.rolesPerPage = data.per_page;
                            this.rolesPage = data.current_page;
                            this.rolesHasMorePages = data.has_more_pages || this.rolesPage > 1;
                        } else if (response?.data?.errors?.length > 0) {
                            throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                        }
                    }).catch(err => {
                        SwalError.fire({
                            title: `Falha ao consultar papéis!`,
                            footer: `<strong>Erro:</strong>&nbsp; ${err}`
                        });
                    });
                } else {
                    this.defaultOrderQueryFields = `"created_at desc"`;
                    this.clearRoless();
                }
            },
            searchSystems(pageNum = 1) {
                if (this.systemsSearch.trim().length > 0) {
                    this.systemsPage = pageNum;
                    this.defaultOrderQueryFields = `"${this.systemsSearchField}"`;

                    this.executeDB({
                        query: `
                            {
                                systems_paginated(
                                    search_field: "${this.systemsSearchField}",
                                    search_term: "${this.systemsSearch}",
                                    page: ${this.systemsPage},
                                    per_page: ${this.systemsPerPage},
                                    doesnt_have_relationship: "users",
                                    relationshipIdOrSlug: "${this.selectedUser.id}",
                                ) {
                                    ${this.relationshipQueryFields},
                                    ${this.paginatedQueryFields}
                                }
                            }
                        `
                    }).then(response => {
                        const data = response.data.data.systems_paginated;

                        if (data) {
                            this.systems = data.data;
                            this.systemsPageCount = data.last_page;
                            this.systemsPerPage = data.per_page;
                            this.systemsPage = data.current_page;
                            this.systemsHasMorePages = data.has_more_pages || this.systemsPage > 1;
                        } else if (response?.data?.errors?.length > 0) {
                            throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                        }
                    }).catch(err => {
                        SwalError.fire({
                            title: `Falha ao consultar sistemas!`,
                            footer: `<strong>Erro:</strong>&nbsp; ${err}`
                        });
                    });
                } else {
                    this.defaultOrderQueryFields = `"created_at desc"`;
                    this.clearPermissions();
                }
            },
            setUsersData(data) {
                if (data) {
                    this.users = data.data;
                    this.usersPageCount = data.last_page;
                    this.usersPerPage = data.per_page;
                    this.usersPage = data.current_page;
                    this.hasUsers = data.has_more_pages || this.usersPage > 1;
                }
            },
            showModal(modalId, user) {
                this.clearUserPermissions();
                this.clearPermissions();
                this.selectedUser = user;

                switch(modalId) {
                    case 'userModulesModal': {
                        this.userModulesList();
                    }
                    case 'userPermissionsModal': {
                        this.userPermissionsList();
                    }
                    case 'userRolesModal': {
                        this.userRolesList();
                    }
                    case 'userSystemsModal': {
                        this.userSystemsList();
                    }
                }

                $(`#${modalId}`).modal({backdrop: false});
            },
            userDelete(user) {
                SwalQuestion.fire({
                    title: `Confirma a exclusão do usuário ${user.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.executeDB({
                            query: `
                                mutation userDelete($idOrSlug: String!) {
                                    delete_user(idOrSlug: $idOrSlug)
                                }
                            `,
                            variables: {
                                idOrSlug: user.id
                            }
                        }).then(response => {
                            if (response?.data?.data?.delete_user) {
                                this.usersList(this.usersPage);
                                Toast.fire({ icon: 'success', title: `Usuário excluído com sucesso!` });
                            } else if (response?.data?.errors?.length > 0) {
                                throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                            }
                        }).catch(err => {
                            SwalError.fire({
                                title: `Falha ao excluir o usuário!`,
                                footer: `<strong>Erro:</strong>&nbsp; ${err}`
                            });
                        });
                    }
                });
            },
            userNew() {
            },
            userModulesList(pageNum = 1) {
                this.userModulesPage = pageNum;

                if (this.userModulesSearch.trim().length > 0) {
                    this.defaultOrderQueryFields = `"${this.userModulesSearchField}"`;
                } else {
                    this.defaultOrderQueryFields = `"created_at desc"`;
                }

                this.executeDB({
                    query: `
                        {
                            modules_paginated(
                                search_field: "${this.userModulesSearchField}",
                                search_term: "${this.userModulesSearch}",
                                page: ${this.userModulesPage},
                                per_page: ${this.userModulesPerPage},
                                have_relationship: "users",
                                relationshipIdOrSlug: "${this.selectedUser.id}",
                            ) {
                                ${this.relationshipQueryFields},
                                ${this.paginatedQueryFields}
                            }
                        }
                    `
                }).then(response => {
                    const data = response.data.data.modules_paginated;

                    if (data) {
                        this.userModules = data.data;
                        this.userModulesPageCount = data.last_page;
                        this.userModulesPerPage = data.per_page;
                        this.userModulesPage = data.current_page;
                        this.hasUserModules = data.has_more_pages || this.userModulesPage > 1;
                    } else if (response?.data?.errors?.length > 0) {
                        throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                    }
                }).catch(err => {
                    SwalError.fire({
                        title: `Falha ao consultar módulos vinculados ao usuário!`,
                        footer: `<strong>Erro:</strong>&nbsp; ${err}`
                    });
                });
            },
            userPermissionsList(pageNum = 1) {
                this.userPermissionsPage = pageNum;

                if (this.userPermissionsSearch.trim().length > 0) {
                    this.defaultOrderQueryFields = `"${this.userPermissionsSearchField}"`;
                } else {
                    this.defaultOrderQueryFields = `"created_at desc"`;
                }

                this.executeDB({
                    query: `
                        {
                            permissions_paginated(
                                search_field: "${this.userPermissionsSearchField}",
                                search_term: "${this.userPermissionsSearch}",
                                page: ${this.userPermissionsPage},
                                per_page: ${this.userPermissionsPerPage},
                                have_relationship: "users",
                                relationshipIdOrSlug: "${this.selectedUser.id}",
                            ) {
                                ${this.relationshipQueryFields},
                                ${this.paginatedQueryFields}
                            }
                        }
                    `
                }).then(response => {
                    const data = response.data.data.permissions_paginated;

                    if (data) {
                        this.userPermissions = data.data;
                        this.userPermissionsPageCount = data.last_page;
                        this.userPermissionsPerPage = data.per_page;
                        this.userPermissionsPage = data.current_page;
                        this.hasUserPermissions = data.has_more_pages || this.userPermissionsPage > 1;
                    } else if (response?.data?.errors?.length > 0) {
                        throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                    }
                }).catch(err => {
                    SwalError.fire({
                        title: `Falha ao consultar permissões vinculadas ao usuário!`,
                        footer: `<strong>Erro:</strong>&nbsp; ${err}`
                    });
                });
            },
            userRolesList(pageNum = 1) {
                this.userRolesPage = pageNum;

                if (this.userRolesSearch.trim().length > 0) {
                    this.defaultOrderQueryFields = `"${this.userRolesSearchField}"`;
                } else {
                    this.defaultOrderQueryFields = `"created_at desc"`;
                }

                this.executeDB({
                    query: `
                        {
                            roles_paginated(
                                search_field: "${this.userRolesSearchField}",
                                search_term: "${this.userRolesSearch}",
                                page: ${this.userRolesPage},
                                per_page: ${this.userRolesPerPage},
                                have_relationship: "users",
                                relationshipIdOrSlug: "${this.selectedUser.id}",
                            ) {
                                ${this.relationshipQueryFields},
                                ${this.paginatedQueryFields}
                            }
                        }
                    `
                }).then(response => {
                    const data = response.data.data.roles_paginated;

                    if (data) {
                        this.userRoles = data.data;
                        this.userRolesPageCount = data.last_page;
                        this.userRolesPerPage = data.per_page;
                        this.userRolesPage = data.current_page;
                        this.hasUserRoles = data.has_more_pages || this.userRolesPage > 1;
                    } else if (response?.data?.errors?.length > 0) {
                        throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                    }
                }).catch(err => {
                    SwalError.fire({
                        title: `Falha ao consultar papéis vinculados ao usuário!`,
                        footer: `<strong>Erro:</strong>&nbsp; ${err}`
                    });
                });
            },
            userSystemsList(pageNum = 1) {
                this.userSystemsPage = pageNum;

                if (this.userSystemsSearch.trim().length > 0) {
                    this.defaultOrderQueryFields = `"${this.userSystemsSearchField}"`;
                } else {
                    this.defaultOrderQueryFields = `"created_at desc"`;
                }

                this.executeDB({
                    query: `
                        {
                            systems_paginated(
                                search_field: "${this.userSystemsSearchField}",
                                search_term: "${this.userSystemsSearch}",
                                page: ${this.userSystemsPage},
                                per_page: ${this.userSystemsPerPage},
                                have_relationship: "users",
                                relationshipIdOrSlug: "${this.selectedUser.id}",
                            ) {
                                ${this.relationshipQueryFields},
                                ${this.paginatedQueryFields}
                            }
                        }
                    `
                }).then(response => {
                    const data = response.data.data.systems_paginated;

                    if (data) {
                        this.userSystems = data.data;
                        this.userSystemsPageCount = data.last_page;
                        this.userSystemsPerPage = data.per_page;
                        this.userSystemsPage = data.current_page;
                        this.hasUserSystems = data.has_more_pages || this.userSystemsPage > 1;
                    } else if (response?.data?.errors?.length > 0) {
                        throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                    }
                }).catch(err => {
                    SwalError.fire({
                        title: `Falha ao consultar sistemas vinculados ao usuário!`,
                        footer: `<strong>Erro:</strong>&nbsp; ${err}`
                    });
                });
            },
            refreshUserModulesList() {
                this.userModulesSearch = this.modulesSearch = '';
                this.userModulesList();
            },
            refreshUserPermissionsList() {
                this.userPermissionsSearch = this.permissionsSearch = '';
                this.userPermissionsList();
            },
            refreshUserRolesList() {
                this.userRolesSearch = this.rolesSearch = '';
                this.userRolesList();
            },
            refreshUserSystemsList() {
                this.userSystemsSearch = this.systemsSearch = '';
                this.userSystemsList();
            },
            usersList(pageNum = 1) {
                this.usersPage = pageNum;

                if (this.userSearch.trim().length > 0) {
                    this.defaultOrderQueryFields = `"${this.userSearchField}"`;
                } else {
                    this.defaultOrderQueryFields = `"created_at desc"`;
                }

                const query = {
                    query: `
                        {
                            users_paginated(
                                per_page: ${this.usersPerPage},
                                page: ${this.usersPage},
                                search_term: "${this.userSearch}",
                                search_field: "${this.userSearchField}",
                                order_by: ${this.defaultOrderQueryFields}
                            ) {
                                    ${this.usersQueryFields},
                                    ${this.paginatedQueryFields}
                            }
                        }
                    `
                };

                this.executeDB(query).then(response => {
                    const data = response?.data?.data?.users_paginated;
                    if (data) {
                        this.setUsersData(data);
                    } else if (response?.data?.errors?.length > 0) {
                        throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                    }
                }).catch(err => {
                    SwalError.fire({
                        title: `Falha ao consultar usuários!`,
                        footer: `<strong>Erro:</strong>&nbsp; ${err}`
                    });
                });
            },
        }
    }
</script>
