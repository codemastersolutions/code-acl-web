<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="card">
                    <div class="card-header pt-1 pb-1">
                        <div class="row align-items-center">
                            <div class="col-sm-12 col-md-5 col-lg-4">
                                <h5>Permissões</h5>
                            </div>
                            <div class="col-sm-12 col-md-3 col-lg-3">
                                <button class="btn btn-sm btn-square btn-primary" type="button" @click="newPermission()">
                                    Nova permissão
                                </button>
                                <button class="btn btn-square btn-success" type="button" @click="getPermissions()"
                                    title="Atualizar lista de permissões">
                                    <i class="cil-reload"></i>
                                </button>
                            </div>
                            <div class="col-sm-12 col-md-4 col-lg-5">
                                <div class="input-group mb-0">
                                    <div class="input-group-prepend pointer">
                                        <select class="form-control flat" id="selectPermissionSearchField" name="selectPermissionSearchField"
                                            v-model="permissionSearchField" @change="filterPermissions()">
                                            <option value="name">Nome</option>
                                        </select>
                                    </div>
                                    <input type="text" class="form-control flat" v-model="permissionSearch"
                                        @keyup.stop="filterPermissions()" :placeholder="permissionSearchFieldPlaceholder">
                                    <div class="input-group-prepend pointer" title="Pesquisar usuário">
                                        <div class="input-group-text flat" v-on:click.stop="filterPermissions()">
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
                                <th class="text-center">Inclusão</th>
                                <th class="text-center">Alteração</th>
                                <th class="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="permission in permissions" :key="permission.slug">
                                <td>{{permission.name}}</td>
                                <td class="text-center">{{permission.createdAt | pt_br}}</td>
                                <td class="text-center">{{permission.updatedAt | pt_br}}</td>
                                <td class="text-center">
                                    <span class="pointer" @click="editPermission(permission)" title="Editar esta permissão">
                                        <i class="c-icon cil-pencil text-primary"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="deletePermission(permission)" title="Exluir esta permissão">
                                        <i class="c-icon cil-trash text-danger"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="rolesPermission(permission)" title="Papéis que possuem esta permissão">
                                        <i class="c-icon cil-notes text-dark"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="usersPermission(permission)" title="Usuários que possuem este permissões">
                                        <i class="c-icon cil-people text-info"></i>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                        </table>

                        <paginate
                            v-if="hasPermissions"
                            :pageCount="permissionsPageCount"
                            :pageRange="3"
                            :clickHandler="getPermissions"
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

        <form id="form" @submit.prevent="editMode ? updatePermission() : storePermission()">
            <div class="modal fade" id="modalPermission" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display: none;" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content flat">
                        <div class="modal-header">
                            <h4 class="modal-title">{{modalTitle}}</h4>
                            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="name">Nome da permissão</label>
                                <input class="form-control flat" name="name" id="name" type="text" placeholder="Informe um nome para a permissão"
                                v-model="form.name"/>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button v-show="editMode" class="btn btn-block btn-square" type="submit" :class="{ 'btn-primary': editMode }">
                                Atualizar
                            </button>
                            <button v-show="!editMode" class="btn btn-success btn-block btn-square" type="submit" :class="{ 'btn-success': !editMode }">
                                Salvar
                            </button>
                            <button class="btn btn-secondary btn-block btn-square" type="button" data-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <div class="modal fade" id="modalPermissionRoles" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display: none;" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content flat" v-if="selectedPermission">
                    <div class="modal-header pt-1 pb-1">
                        <h4 class="modal-title">Papéis vinculados à permissão: <strong>{{selectedPermission.name}}</strong></h4>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-6">
                                <div class="card card-accent-info mb-2">
                                    <div class="card-header p-1">Pesquisar papéis vinculados</div>
                                    <div class="card-body p-1">
                                        <div class="input-group mb-1">
                                            <div class="input-group-prepend pointer">
                                                <select class="form-control flat" id="selectPermissionRoleSearchField" name="selectPermissionRoleSearchField"
                                                    v-model="permissionRoleSearchField" @change="getRolesPermission()">
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" v-model="rolePermissionSearch"
                                                @keyup="getRolesPermission()" :placeholder="permissionRoleSearchFieldPlaceholder">
                                            <div class="input-group-prepend pointer" title="Pesquisar papel">
                                                <div class="input-group-text flat" v-on:click.stop="getRolesPermission()">
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
                                                <select class="form-control flat" id="selectSearchField" name="selectSearchField"
                                                v-model="rolesSearchField" @change="searchRoles()">
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" :placeholder="rolesSearchFieldPlaceholder"
                                                v-model="roleSearch" @keyup="searchRoles()">
                                            <div class="input-group-prepend pointer" v-on:click.stop="searchRoles()" title="Pesquisar papel">
                                                <div class="input-group-text flat">
                                                    <i class="cil-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="rolesSearched" v-if="rolesSearched.length > 0">
                                            <table class="table table-responsive-sm table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th class="text-right">
                                                        <span class="badge badge-danger pointer flat" @click="clearRolesSearched()">
                                                            Limpar
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="role in rolesSearched" :key="role.id">
                                                    <td>{{role.name}}</td>
                                                    <td class="text-right">
                                                        <span class="badge badge-primary pointer flat" @click="addRolePermission(role)">
                                                            Vincular
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                            <div class="row m-0 p-0 justify-content-center">
                                                <paginate
                                                    v-if="hasRolesSearched"
                                                    :pageCount="rolesSearchedPageCount"
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
                                    <tr v-for="role in permissionRoles" :key="role.id">
                                        <td>{{role.name}}</td>
                                        <td class="text-center">
                                            <span class="pointer" @click="removeRolePermission(role)" title="Desvincular papel">
                                                <i class="cc-icon cil-trash text-danger"></i>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            <div class="card-footer m-0 p-1">
                                <paginate
                                    v-if="hasPermissionRoles"
                                    :pageCount="permissionRolesPageCount"
                                    :pageRange="3"
                                    :clickHandler="getRolesPermission"
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
                        <button class="btn btn-success btn-square" @click.stop="refreshRolesPermission()">
                            <i class="cil-reload"></i> Atualizar
                        </button>
                        <button class="btn btn-danger btn-square" type="button" data-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modalPermissionUsers" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display: none;" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content flat" v-if="selectedPermission">
                    <div class="modal-header pt-1 pb-1">
                        <h4 class="modal-title">Usuários vinculados aa permissão: <strong>{{selectedPermission.name}}</strong></h4>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-6">
                                <div class="card card-accent-info mb-2">
                                    <div class="card-header p-1">Pesquisar usuários vinculados</div>
                                    <div class="card-body p-1">
                                        <div class="input-group mb-1">
                                            <div class="input-group-prepend pointer">
                                                <select class="form-control flat" id="selectPermissionUserSearchField" name="selectPermissionUserSearchField"
                                                    v-model="permissionUserSearchField" @change="getUsersPermission()">
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" v-model="permissionUserSearch"
                                                @keyup.stop="getUsersPermission()" :placeholder="permissionUserSearchFieldPlaceholder">
                                            <div class="input-group-prepend pointer" title="Pesquisar usuário">
                                                <div class="input-group-text flat" v-on:click.stop="getUsersPermission()">
                                                    <i class="cil-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="card card-accent-success mb-2">
                                    <div class="card-header p-1">Vincular novo usuário</div>
                                    <div class="card-body p-1">
                                        <div class="input-group mb-1">
                                            <div class="input-group-prepend pointer">
                                                <select class="form-control flat" id="selectSearchField" name="selectSearchField"
                                                v-model="usersSearchField" @change="searchUsers()">
                                                    <option value="email">E-mail</option>
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" :placeholder="usersSearchFieldPlaceholder"
                                                v-model="userSearch" @keyup="searchUsers()">
                                            <div class="input-group-prepend pointer" v-on:click.stop="searchUsers()" title="Pesquisar usuário">
                                                <div class="input-group-text flat">
                                                    <i class="cil-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="usersSearched" v-if="usersSearched.length > 0">
                                            <table class="table table-responsive-sm table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th class="text-right">
                                                        <span class="badge badge-danger pointer flat" @click="clearUsersSearched()">
                                                            Limpar
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="user in usersSearched" :key="user.id">
                                                    <td>{{user.name}}</td>
                                                    <td class="text-right">
                                                        <span class="badge badge-primary pointer flat" @click="addUserPermission(user)">
                                                            Vincular
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                            <div class="row m-0 p-0 justify-content-center">
                                                <paginate
                                                    v-if="hasUsersSearched"
                                                    :pageCount="usersSearchedPageCount"
                                                    :pageRange="3"
                                                    :clickHandler="searchUsers"
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
                                    <tr v-for="user in permissionUsers" :key="user.id">
                                        <td>{{user.name}}</td>
                                        <td class="text-center">
                                            <span class="pointer" data-id="user.id" @click="removeUserPermission(user)" title="Desvincular usuário">
                                                <i class="cc-icon cil-trash text-danger"></i>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            <div class="card-footer m-0 p-1">
                                <paginate
                                    v-if="hasPermissionUsers"
                                    :pageCount="permissionUsersPageCount"
                                    :pageRange="3"
                                    :clickHandler="getUsersPermission"
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
                        <button class="btn btn-success btn-square" @click.stop="refreshUsersPermission()">
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
    #usersSearched td, #usersSearched th {
        padding-top: 1px;
        padding-bottom: 1px;
    }
</style>

<script>
    export default {
        name: 'permissions',
        props: {
        },
        data() {
            return {
                editMode: false,
                modalTitle: '',
                form: new Form({ name: '', slug: '' }),
                formLogin: new Form({ email: '', password: '' }),
                permissions: [],
                permissionUsers: [],
                permissionRoles: [],
                usersSearched: [],
                rolesSearched: [],
                userSearch: '',
                roleSearch: '',
                rolePermissionSearch: '',
                permissionSearch: '',
                permissionUserSearch: '',
                hasPermissions: false,
                hasPermissionUsers: false,
                hasPermissionRoles: false,
                permissionsPageCount: 0,
                permissionsPerPage: 15,
                permissionsPage: 1,
                permissionUsersPageCount: 0,
                permissionRolesPageCount: 0,
                permissionUsersPerPage: 5,
                permissionRolesPerPage: 5,
                permissionUsersPage: 1,
                permissionRolesPage: 1,
                permissionUsersSearchTerm: '*',
                permissionSearchField: 'name',
                usersSearchField: 'name',
                rolesSearchField: 'name',
                permissionUserSearchField: 'name',
                permissionRoleSearchField: 'name',
                hasUsersSearched: false,
                usersSearchedPageCount: 0,
                usersSearchedPerPage: 5,
                usersSearchedPage: 1,
                roleSearchedPageCount: 0,
                roleSearchedPage: 1,
                rolesSearchedPerPage: 5,
                selectedPermission: null,
                permissionsQueryFields: `data { name, slug, createdAt, updatedAt }, total, current_page, last_page, has_more_pages, per_page`,
                relationshipQueryFields: `data { id, name }, total, current_page, last_page, has_more_pages, per_page`,
                permissionsOrderFields: `"created_at desc"`
            }
        },
        async created() {
            this.resetModal();
            await window.api.get(window.urls.sanctumCsrf);
            this.getPermissions();
        },
        computed: {
            permissionRoleSearchFieldPlaceholder() {
                return this.getPlaceholder(this.permissionRoleSearchField);
            },
            permissionUserSearchFieldPlaceholder() {
                return this.getPlaceholder(this.permissionUserSearchField);
            },
            usersSearchFieldPlaceholder() {
                return this.getPlaceholder(this.usersSearchField);
            },
            rolesSearchFieldPlaceholder() {
                return this.getPlaceholder(this.usersSearchField);
            },
            permissionSearchFieldPlaceholder() {
                return this.getPlaceholder(this.permissionSearchField);
            },
        },
        methods: {
            addUserPermission(user) {
                this.executeDB({
                    query: `
                        mutation attachUser($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                            give_permission_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                        }
                    `,
                    variables: {
                        modelIdOrSlug: user.id,
                        relationIdOrSlug: this.selectedPermission.slug,
                    }
                }).then(response => {
                    const data = response?.data?.data?.give_permission_to_user;

                    if (data) {
                        this.getUsersPermission();
                        this.searchUsers();
                        Toast.fire({ icon: 'success', title: `Usuário vinculado com sucesso!` });
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao vincular o usuário!`,
                            footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                        });
                    }
                }).catch(err => {
                    Toast.fire({ icon: 'error', title: `Falha ao vincular o usuário!` });
                });
            },
            addRolePermission(role) {
                this.executeDB({
                    query: `
                        mutation attachRole($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                            give_permission_to_role(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                        }
                    `,
                    variables: {
                        modelIdOrSlug: role.id,
                        relationIdOrSlug: this.selectedPermission.slug,
                    }
                }).then(response => {
                    const data = response?.data?.data?.give_permission_to_role;

                    if (data) {
                        this.getRolesPermission();
                        this.searchRoles();
                        Toast.fire({ icon: 'success', title: `Papel vinculado com sucesso!` });
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao vincular o papel!`,
                            footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                        });
                    }
                }).catch(err => {
                    Toast.fire({ icon: 'error', title: `Falha ao vincular o usuário!` });
                });
            },
            clearRolesSearched() {
                this.rolesSearched = [];
                this.rolesSearchedPage = 1;
                this.rolesSearchedPageCount = 0;
            },
            clearUsersSearched() {
                this.usersSearched = [];
                this.usersSearchedPage = 1;
                this.usersSearchedPageCount = 0;
            },
            deletePermission(permission) {
                SwalQuestion.fire({
                    title: `Confirma a exclusão da permissão ${permission.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.executeDB({
                            query: `
                                mutation deletePermission($idOrSlug: String!) {
                                    delete_permission(idOrSlug: $idOrSlug)
                                }
                            `,
                            variables: {
                                idOrSlug: permission.slug
                            }
                        }).then(response => {
                            if (response?.data?.data?.delete_permission) {
                                this.getPermissions();
                                $('#modalPermission').modal('hide');
                                Toast.fire({ icon: 'success', title: `Permissão excluída com sucesso!` });
                            } else if (response?.data?.errors?.length > 0) {
                                SwalError.fire({
                                    title: `Falha ao excluir a permissão!`,
                                    footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                                });
                            }
                        }).catch(err => {
                            Toast.fire({ icon: 'error', title: `Falha ao excluir a permissão!` });
                        });
                    }
                });
            },
            editPermission(permission) {
                this.resetForm();
                this.modalTitle = 'Editar permissão';
                this.form.fill(permission);
                this.editMode = true;
                $('#modalPermission').modal({backdrop: false});
            },
            executeDB(queryData) {
                return window.api.post(window.urls.graphqlApi, queryData).catch((err) => {
                    if (err.response.status === 401) {
                        window.location = `${window.urls.baseURL}${window.urls.login}`;
                    }
                });;
            },
            filterPermissions() {
                this.permissionsPage = 1;

                if (this.permissionSearch.length === 0) {
                    this.permissionsOrderFields = `"created_at desc"`;
                    this.getPermissions();
                } else {
                    const query = {
                        query: `
                            {
                                permissions_paginated(per_page: ${this.permissionsPerPage},
                                    page: ${this.permissionsPage},
                                    search_term: "${this.permissionSearch}",
                                    search_field: "${this.permissionSearchField}",
                                    order_by: "${this.permissionSearchField}"
                                ) { ${this.permissionsQueryFields} }
                            }
                        `
                    };

                    this.executeDB(query).then(response => {
                        const data = response?.data?.data?.permissions_paginated;
                        if (data) {
                            this.setPermissionsData(data);
                        } else if (response?.data?.errors?.length > 0) {
                            SwalError.fire({
                                title: `Falha ao consultar permissões!`,
                                footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                            });
                        }
                    });
                }
            },
            getPermissions(pageNum = 1) {
                this.permissionsPage = pageNum;
                const query = {
                    query: `
                        {
                            permissions_paginated(per_page: ${this.permissionsPerPage},
                                page: ${this.permissionsPage},
                                order_by: ${this.permissionsOrderFields}) {
                                    ${this.permissionsQueryFields}
                            }
                        }
                    `
                };

                this.executeDB(query).then(response => {
                    const data = response?.data?.data?.permissions_paginated;
                    if (data) {
                        this.setPermissionsData(data);
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao consultar permissões!`,
                            footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                        });
                    }
                });
            },
            getPlaceholder(property) {
                switch(property) {
                    case 'name':
                        return 'Informe o nome do usuário';
                    case 'email':
                        return 'Informe o e-mail do usuário';
                }
            },
            getRolesPermission(pageNum = 1) {
                this.permissionRolesPage = pageNum;
                this.permissionRolesSearchTerm = '*';

                if (this.rolePermissionSearch.length > 0) {
                    this.permissionRolesSearchTerm = this.rolePermissionSearch;
                }

                this.executeDB({
                    query: `
                        {
                            roles_paginated(
                                search_field: "${this.permissionRoleSearchField}",
                                search_term: "${this.permissionRolesSearchTerm}",
                                page: ${this.permissionRolesPage},
                                per_page: ${this.permissionRolesPerPage},
                                have_relationship: "permissions",
                                relationshipIdOrSlug: "${this.selectedPermission.slug}",
                            ) { ${this.relationshipQueryFields} }
                        }
                    `
                }).then(response => {
                    const data = response.data.data.roles_paginated;

                    if (data) {
                        this.permissionRoles = data.data;
                        this.permissionRolesPageCount = data.last_page;
                        this.permissionRolesPerPage = data.per_page;
                        this.permissionRolesPage = data.current_page;
                        this.hasPermissionRoles = data.has_more_pages || this.permissionRolesPage > 1;
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao consultar papéis vinculados à permissão!`,
                            footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                        });
                    }
                });
            },
            getUsersPermission(pageNum = 1) {
                this.permissionUsersPage = pageNum;
                this.permissionUsersSearchTerm = '*';

                if (this.permissionUserSearch.length > 0) {
                    this.permissionUsersSearchTerm = this.permissionUserSearch;
                }

                this.executeDB({
                    query: `
                        {
                            users_paginated(
                                search_field: "${this.permissionUserSearchField}",
                                search_term: "${this.permissionUsersSearchTerm}",
                                page: ${this.permissionUsersPage},
                                per_page: ${this.permissionUsersPerPage},
                                have_relationship: "permissions",
                                relationshipIdOrSlug: "${this.selectedPermission.slug}",
                            ) { ${this.relationshipQueryFields} }
                        }
                    `
                }).then(response => {
                    const data = response.data.data.users_paginated;

                    if (data) {
                        this.permissionUsers = data.data;
                        this.permissionUsersPageCount = data.last_page;
                        this.permissionUsersPerPage = data.per_page;
                        this.permissionUsersPage = data.current_page;
                        this.hasPermissionUsers = data.has_more_pages || this.permissionUsersPage > 1;
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao consultar usuários vinculados à permissão!`,
                            footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                        });
                    }
                });
            },
            newPermission() {
                this.resetForm();
                this.modalTitle = 'Incluir nova permissão';
                this.editMode = false;
                $('#modalPermission').modal({backdrop: false});
            },
            refreshRolesPermission() {
                this.roleSearch = this.rolePermissionSearch = '';
                this.rolesSearched = [];
                this.getRolesPermission();
            },
            refreshUsersPermission() {
                this.userSearch = this.permissionUserSearch = '';
                this.usersSearched = [];
                this.getUsersPermission();
            },
            removeRolePermission(role) {
                SwalQuestion.fire({
                    title: `Confirma a desvinculação do papel ${role.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.executeDB({
                            query: `
                                mutation detachRole($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                                    detach_permission_to_role(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                                }
                            `,
                            variables: {
                                modelIdOrSlug: role.id,
                                relationIdOrSlug: this.selectedPermission.slug,
                            }
                        }).then(response => {
                            if (response?.data?.data?.detach_permission_to_role) {
                                this.getRolesPermission();
                                $('#modalRole').modal('hide');
                                Toast.fire({ icon: 'success', title: `Papel desvinculado com sucesso!` });
                            } else if (response?.data?.errors?.length > 0) {
                                SwalError.fire({
                                    title: `Falha ao desvincular o papel!`,
                                    footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                                });
                            }
                        }).catch(err => {
                            Toast.fire({ icon: 'error', title: `Falha ao desvincular o papel!` });
                        });
                    }
                });
            },
            removeUserPermission(user) {
                SwalQuestion.fire({
                    title: `Confirma a desvinculação do usuário ${user.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.executeDB({
                            query: `
                                mutation detachUser($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                                    detach_permission_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                                }
                            `,
                            variables: {
                                modelIdOrSlug: user.id,
                                relationIdOrSlug: this.selectedPermission.slug,
                            }
                        }).then(response => {
                            if (response?.data?.data?.detach_permission_to_user) {
                                this.getUsersPermission();
                                $('#modalPermission').modal('hide');
                                Toast.fire({ icon: 'success', title: `Usuário desvinculado com sucesso!` });
                            } else if (response?.data?.errors?.length > 0) {
                                SwalError.fire({
                                    title: `Falha ao desvincular o usuário!`,
                                    footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                                });
                            }
                        }).catch(err => {
                            Toast.fire({ icon: 'error', title: `Falha ao desvincular o usuário!` });
                        });
                    }
                });
            },
            resetForm() {
                this.form.clear();
                this.form.reset();
                this.editMode = false;
                this.modalTitle = '';
            },
            resetModal() {
                this.permissionUsers = [],
                this.usersSearched = [],
                this.userSearch = '',
                this.permissionUserSearch = '',
                this.hasPermissions = false,
                this.hasPermissionUsers = false,
                this.permissionsPageCount = 0,
                this.permissionsPerPage = 15,
                this.permissionsPage = 1,
                this.permissionUsersPageCount = 0,
                this.permissionUsersPerPage = 5,
                this.permissionUsersPage = 1,
                this.permissionUsersSearchTerm = '*',
                this.usersSearchField = 'name',
                this.permissionUserSearchField = 'name',
                this.hasUsersSearched = false,
                this.usersSearchedPageCount = 0,
                this.usersSearchedPerPage = 5,
                this.usersSearchedPage = 1,
                this.selectedPermission = null
            },
            rolesPermission(permission) {
                this.resetModal();
                this.selectedPermission = permission;
                this.getRolesPermission();
                $('#modalPermissionRoles').modal({backdrop: false});
            },
            searchRoles(pageNum = 1) {
                if (this.roleSearch.length > 0) {
                    this.rolesSearchedPage = pageNum;
                    this.executeDB({
                        query: `
                            {
                                roles_paginated(
                                    search_field: "${this.rolesSearchField}",
                                    search_term: "${this.roleSearch}",
                                    page: ${this.rolesSearchedPage},
                                    per_page: ${this.rolesSearchedPerPage},
                                    doesnt_have_relationship: "permissions",
                                    relationshipIdOrSlug: "${this.selectedPermission.slug}",
                                ) { ${this.relationshipQueryFields} }
                            }
                        `
                    }).then(response => {
                        const data = response.data.data.roles_paginated;

                        if (data) {
                            this.rolesSearched = data.data;
                            this.rolesSearchedPageCount = data.last_page;
                            this.rolesSearchedPerPage = data.per_page;
                            this.rolesSearchedPage = data.current_page;
                            this.hasRolesSearched = data.has_more_pages || this.rolesSearchedPage > 1;
                        } else if (response?.data?.errors?.length > 0) {
                            SwalError.fire({
                                title: `Falha ao consultar papéis!`,
                                footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                            });
                        }
                    });
                }
            },
            searchUsers(pageNum = 1) {
                if (this.userSearch.length > 0) {
                    this.usersSearchedPage = pageNum;
                    this.executeDB({
                        query: `
                            {
                                users_paginated(
                                    search_field: "${this.usersSearchField}",
                                    search_term: "${this.userSearch}",
                                    page: ${this.usersSearchedPage},
                                    per_page: ${this.usersSearchedPerPage},
                                    doesnt_have_relationship: "permissions",
                                    relationshipIdOrSlug: "${this.selectedPermission.slug}",
                                ) { ${this.relationshipQueryFields} }
                            }
                        `
                    }).then(response => {
                        const data = response?.data?.data?.users_paginated;

                        if (data) {
                            this.usersSearched = data.data;
                            this.usersSearchedPageCount = data.last_page;
                            this.usersSearchedPerPage = data.per_page;
                            this.usersSearchedPage = data.current_page;
                            this.hasUsersSearched = data.has_more_pages || this.usersSearchedPage > 1;
                        } else if (response?.data?.errors?.length > 0) {
                            SwalError.fire({
                                title: `Falha ao consultar usuários!`,
                                footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                            });
                        }
                    });
                }
            },
            setPermissionsData(data) {
                if (data) {
                    this.permissions = data.data;
                    this.permissionsPageCount = data.last_page;
                    this.permissionsPerPage = data.per_page;
                    this.permissionsPage = data.current_page;
                    this.hasPermissions = data.has_more_pages || this.permissionsPage > 1;
                }
            },
            storePermission() {
                this.executeDB({
                    query: `
                        mutation storePermission($name: String!) {
                            create_permission(name: $name) {
                                name,
                                slug,
                                createdAt,
                                updatedAt,
                            }
                        }
                    `,
                    variables: {
                        name: this.form.name
                    }
                }).then(response => {
                    if (response?.data?.data?.create_permission) {
                        this.resetForm();
                        this.getPermissions();
                        $('#modalPermission').modal('hide');
                        Toast.fire({ icon: 'success', title: `Permissão incluída com sucesso!` });
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao incluir a permissão!`,
                            footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                        });
                    }
                }).catch(err => {
                    Toast.fire({ icon: 'error', title: `Falha ao incluia permissão!` });
                });
            },
            sortPermissions() {
                this.permissions = this.permissions.sort(function(a, b) {
                    if (a.createdAt < b.createdAt) return 1;
                    if (a.createdAt > b.createdAt) return -1;
                    return 0;
                });
            },
            updatePermission() {
                const query = {
                    query: `
                        mutation updatePermission($idOrSlug: String!, $name: String!) {
                            update_permission(idOrSlug: $idOrSlug, name: $name) {
                                name,
                                slug,
                                updatedAt
                            }
                        }
                    `,
                    variables: {
                        idOrSlug: this.form.slug,
                        name: this.form.name,
                    }
                };

                this.executeDB(query).then(response => {
                    if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao atualizar permissão!`,
                            footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                        });
                    } else {
                        const permission = response?.data?.data?.update_permission;

                        this.permissions.map(item => {
                            if (item.slug === permission?.slug) {
                                item.name = permission?.name;
                                item.updatedAt = permission?.updatedAt;
                            };
                        });
                        this.sortPermissions();
                        this.resetForm();
                        $('#modalPermission').modal('hide');
                        Toast.fire({ icon: 'success', title: `Permissão atualizada com sucesso!` });
                    }
                }).catch(err => {
                    Toast.fire({ icon: 'error', title: `Falha ao atualizar permissão!` });
                });
            },
            usersPermission(permission) {
                this.resetModal();
                this.selectedPermission = permission;
                this.getUsersPermission();
                $('#modalPermissionUsers').modal({backdrop: false});
            },
        }
    }
</script>
