<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="card">
                    <div class="card-header pt-1 pb-1">
                        <div class="row align-items-center">
                            <div class="col-sm-12 col-md-5 col-lg-4">
                                <h5>Papéis</h5>
                            </div>
                            <div class="col-sm-12 col-md-3 col-lg-3">
                                <button class="btn btn-sm btn-square btn-primary" type="button" @click="newRole()">
                                    Novo papel
                                </button>
                                <button class="btn btn-square btn-success" type="button" @click="getRoles()"
                                    title="Atualizar lista de papéis">
                                    <i class="cil-reload"></i>
                                </button>
                            </div>
                            <div class="col-sm-12 col-md-4 col-lg-5">
                                <div class="input-group mb-0">
                                    <div class="input-group-prepend pointer">
                                        <select class="form-control flat" id="selectRoleSearchField" name="selectRoleSearchField"
                                            v-model="roleSearchField" @change="filterRoles()">
                                            <option value="name">Nome</option>
                                        </select>
                                    </div>
                                    <input type="text" class="form-control flat" v-model="roleSearch"
                                        @keyup.stop="filterRoles()" :placeholder="roleSearchFieldPlaceholder">
                                    <div class="input-group-prepend pointer" title="Pesquisar usuário">
                                        <div class="input-group-text flat" v-on:click.stop="filterRoles()">
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
                            <tr v-for="role in roles" :key="role.slug">
                                <td>{{role.name}}</td>
                                <td class="text-center">{{role.createdAt | pt_br}}</td>
                                <td class="text-center">{{role.updatedAt | pt_br}}</td>
                                <td class="text-center">
                                    <span class="pointer" @click="editRole(role)" title="Editar este papel">
                                        <i class="c-icon cil-pencil text-primary"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="deleteRole(role)" title="Exluir este papel">
                                        <i class="c-icon cil-trash text-danger"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="permissionsRole(role)" title="Permissões que possuem este papéis">
                                        <i class="c-icon cil-fingerprint text-success"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="usersRole(role)" title="Usuários que possuem este papéis">
                                        <i class="c-icon cil-people text-info"></i>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                        </table>

                        <paginate
                            v-if="hasRoles"
                            :pageCount="rolesPageCount"
                            :pageRange="3"
                            :clickHandler="getRoles"
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

        <form id="form" @submit.prevent="editMode ? updateRole() : storeRole()">
            <div class="modal fade" id="modalRole" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display: none;" aria-hidden="true">
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
                                <label for="name">Nome do papel</label>
                                <input class="form-control flat" name="name" id="name" type="text" placeholder="Informe um nome para o papel"
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

        <div class="modal fade" id="modalRoleUsers" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display: none;" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content flat" v-if="selectedRole">
                    <div class="modal-header pt-1 pb-1">
                        <h4 class="modal-title">Usuários vinculados ao papel: <strong>{{selectedRole.name}}</strong></h4>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-6">
                                <div class="card card-accent-info mb-2">
                                    <div class="card-header p-1">Pesquisar usuário vinculado</div>
                                    <div class="card-body p-1">
                                        <div class="input-group mb-1">
                                            <div class="input-group-prepend pointer">
                                                <select class="form-control flat" id="selectRoleUserSearchField" name="selectRoleUserSearchField"
                                                    v-model="roleUserSearchField" @change="getUsersRole()">
                                                    <option value="email">E-mail</option>
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" v-model="roleUserSearch"
                                                @keyup="getUsersRole()" :placeholder="roleUserSearchFieldPlaceholder">
                                            <div class="input-group-prepend pointer" title="Pesquisar usuário">
                                                <div class="input-group-text flat" v-on:click.stop="getUsersRole()">
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
                                                        <span class="badge badge-primary pointer flat" @click="addUserRole(user)">
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
                                    <tr v-for="user in roleUsers" :key="user.id">
                                        <td>{{user.name}}</td>
                                        <td class="text-center">
                                            <span class="pointer" data-id="user.id" @click="removeUserRole(user)" title="Desvincular usuário">
                                                <i class="cc-icon cil-trash text-danger"></i>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            <div class="card-footer m-0 p-1">
                                <paginate
                                    v-if="hasRoleUsers"
                                    :pageCount="roleUsersPageCount"
                                    :pageRange="3"
                                    :clickHandler="getUsersRole"
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
                        <button class="btn btn-success btn-square" @click.stop="refreshUsersRole()">
                            <i class="cil-reload"></i> Atualizar
                        </button>
                        <button class="btn btn-danger btn-square" type="button" data-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modalRolePermissions" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display: none;" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content flat" v-if="selectedRole">
                    <div class="modal-header pt-1 pb-1">
                        <h4 class="modal-title">Permissões vinculadas ao papel: <strong>{{selectedRole.name}}</strong></h4>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-6">
                                <div class="card card-accent-info mb-2">
                                    <div class="card-header p-1">Pesquisar permissão vinculada</div>
                                    <div class="card-body p-1">
                                        <div class="input-group mb-1">
                                            <div class="input-group-prepend pointer">
                                                <select class="form-control flat" id="selectRolePermissionSearchField" name="selectRolePermissionSearchField"
                                                    v-model="rolePermissionSearchField" @change="getPermissionsRole()">
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" v-model="rolePermissionSearch"
                                                @keyup="getPermissionsRole()" :placeholder="rolePermissionSearchFieldPlaceholder">
                                            <div class="input-group-prepend pointer" title="Pesquisar usuário">
                                                <div class="input-group-text flat" v-on:click.stop="getPermissionsRole()">
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
                                                <select class="form-control flat" id="selectSearchField" name="selectSearchField"
                                                    v-model="permissionsSearchField" @change="searchPermissions()">
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" :placeholder="permissionsSearchFieldPlaceholder"
                                                v-model="permissionSearch" @keyup.stop="searchPermissions()">
                                            <div class="input-group-prepend pointer" v-on:click.stop="searchPermissions()" title="Pesquisar permissão">
                                                <div class="input-group-text flat">
                                                    <i class="cil-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="permissionsSearched" v-if="permissionsSearched.length > 0">
                                            <table class="table table-responsive-sm table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th class="text-right">
                                                        <span class="badge badge-danger pointer flat" @click="clearPermissionsSearched()">
                                                            Limpar
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="permission in permissionsSearched" :key="permission.id">
                                                    <td>{{permission.name}}</td>
                                                    <td class="text-right">
                                                        <span class="badge badge-primary pointer flat" @click="addPermissionRole(permission)">
                                                            Vincular
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                            <div class="row m-0 p-0 justify-content-center">
                                                <paginate
                                                    v-if="hasPermissionsSearched"
                                                    :pageCount="permissionsSearchedPageCount"
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
                                    <tr v-for="permission in rolePermissions" :key="permission.id">
                                        <td>{{permission.name}}</td>
                                        <td class="text-center">
                                            <span class="pointer" data-id="permission.id" @click="removePermissionRole(permission)" title="Desvincular permissão">
                                                <i class="cc-icon cil-trash text-danger"></i>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            <div class="card-footer m-0 p-1">
                                <paginate
                                    v-if="hasRolePermissions"
                                    :pageCount="rolePermissionsPageCount"
                                    :pageRange="3"
                                    :clickHandler="getPermissionsRole"
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
                        <button class="btn btn-success btn-square" @click.stop="refreshPermissionsRole()">
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
        name: 'roles',
        props: {
        },
        data() {
            return {
                editMode: false,
                modalTitle: '',
                form: new Form({ name: '', slug: '' }),
                formLogin: new Form({ email: '', password: '' }),
                roles: [],
                roleUsers: [],
                rolePermissions: [],
                usersSearched: [],
                permissionsSearched: [],
                userSearch: '',
                permissionSearch: '',
                roleSearch: '',
                roleUserSearch: '',
                rolePermissionSearch: '',
                hasRoles: false,
                hasRoleUsers: false,
                hasRolePermissions: false,
                rolesPageCount: 0,
                rolesPerPage: 15,
                rolesPage: 1,
                roleUsersPageCount: 0,
                roleUsersPerPage: 5,
                roleUsersPage: 1,
                roleUsersSearchTerm: '*',
                rolePermissionsPageCount: 0,
                rolePermissionsPerPage: 5,
                rolePermissionsPage: 1,
                rolePermissionsSearchTerm: '*',
                roleSearchField: 'name',
                usersSearchField: 'name',
                roleUserSearchField: 'name',
                rolePermissionSearchField: 'name',
                permissionsSearchField: 'name',
                hasUsersSearched: false,
                usersSearchedPageCount: 0,
                usersSearchedPerPage: 5,
                usersSearchedPage: 1,
                hasPermissionsSearched: false,
                permissionsSearchedPageCount: 0,
                permissionsSearchedPerPage: 5,
                permissionsSearchedPage: 1,
                selectedRole: null,
                rolesQueryFields: `data { name, slug, createdAt, updatedAt }, total, current_page, last_page, has_more_pages, per_page`,
                rolesOrderFields: `"created_at desc"`,
                relationshipQueryFields: `data { name, id }, total, current_page, last_page, has_more_pages, per_page`,
            }
        },
        computed: {
            roleUserSearchFieldPlaceholder() {
                return this.getPlaceholder(this.roleUserSearchField);
            },
            usersSearchFieldPlaceholder() {
                return this.getPlaceholder(this.usersSearchField);
            },
            roleSearchFieldPlaceholder() {
                return this.getPlaceholder(this.roleSearchField);
            },
            rolePermissionSearchFieldPlaceholder() {
                return this.getPlaceholder(this.rolePermissionSearchField);
            },
            permissionsSearchFieldPlaceholder() {
                return this.getPlaceholder(this.permissionsSearchField);
            },
        },
        async created() {
            this.resetModal();
            await window.api.get(window.urls.sanctumCsrf);
            this.getRoles();
        },
        methods: {
            addPermissionRole(permission) {
                this.executeDB({
                    query: `
                        mutation attachPermission($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                            give_permission_to_role(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                        }
                    `,
                    variables: {
                        modelIdOrSlug: this.selectedRole.slug,
                        relationIdOrSlug: permission.id,
                    }
                }).then(response => {
                    const data = response?.data?.data?.give_permission_to_role;

                    if (data) {
                        this.getPermissionsRole();
                        this.searchPermissions();
                        Toast.fire({ icon: 'success', title: `Permissão vinculada com sucesso!` });
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao vincular a permissão ao papel!`,
                            footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                        });
                    }
                }).catch(err => {
                    Toast.fire({ icon: 'error', title: `Falha ao vincular a permissão!` });
                });
            },
            addUserRole(user) {
                this.executeDB({
                    query: `
                        mutation attachUser($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                            give_role_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                        }
                    `,
                    variables: {
                        modelIdOrSlug: user.id,
                        relationIdOrSlug: this.selectedRole.slug,
                    }
                }).then(response => {
                    const data = response?.data?.data?.give_role_to_user;

                    if (data) {
                        this.getUsersRole();
                        this.searchUsers();
                        Toast.fire({ icon: 'success', title: `Usuário vinculado com sucesso!` });
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao vincular o usuário ao papel!`,
                            footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                        });
                    }
                }).catch(err => {
                    Toast.fire({ icon: 'error', title: `Falha ao vincular o usuário!` });
                });
            },
            clearPermissionsSearched() {
                this.permissionsSearched = [];
                this.permissionsSearchedPage = 1;
                this.permissionsSearchedPageCount = 0;
            },
            clearUsersSearched() {
                this.usersSearched = [];
                this.usersSearchedPage = 1;
                this.usersSearchedPageCount = 0;
            },
            deleteRole(role) {
                SwalQuestion.fire({
                    title: `Confirma a exclusão do sistema ${role.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.executeDB({
                            query: `
                                mutation deleteRole($idOrSlug: String!) {
                                    delete_role(idOrSlug: $idOrSlug)
                                }
                            `,
                            variables: {
                                idOrSlug: role.slug
                            }
                        }).then(response => {
                            if (response?.data?.data?.delete_role) {
                                this.getRoles();
                                $('#modalRole').modal('hide');
                                Toast.fire({ icon: 'success', title: `Papel incluído com sucesso!` });
                            } else if (response?.data?.errors?.length > 0) {
                                SwalError.fire({
                                    title: `Falha ao excluir a papel!`,
                                    footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                                });
                            }
                        }).catch(err => {
                            Toast.fire({ icon: 'error', title: `Falha ao excluir a papel!` });
                        });
                    }
                });
            },
            editRole(role) {
                this.resetForm();
                this.modalTitle = 'Editar sistema';
                this.form.fill(role);
                this.editMode = true;
                $('#modalRole').modal({backdrop: false});
            },
            executeDB(queryData) {
                return window.api.post(window.urls.graphqlApi, queryData).catch((err) => {
                    if (err.response.status === 401) {
                        window.location = `${window.urls.baseURL}${window.urls.login}`;
                    }
                });;
            },
            filterRoles() {
                this.rolesPage = 1;

                if (this.roleSearch.length === 0) {
                    this.rolesOrderFields = `"created_at desc"`;
                    this.getRoles();
                } else {
                    const query = {
                        query: `
                            {
                                roles_paginated(per_page: ${this.rolesPerPage},
                                    page: ${this.rolesPage},
                                    search_term: "${this.roleSearch}",
                                    search_field: "${this.roleSearchField}",
                                    order_by: "${this.roleSearchField}"
                                ) { ${this.rolesQueryFields} }
                            }
                        `
                    };

                    this.executeDB(query).then(response => {
                        const data = response?.data?.data?.roles_paginated;
                        if (data) {
                            this.setRolesData(data);
                        } else if (response?.data?.errors?.length > 0) {
                            SwalError.fire({
                                title: `Falha ao consultar papéis!`,
                                footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                            });
                        }
                    });
                }
            },
            getRoles(pageNum = 1) {
                this.rolesPage = pageNum;
                const query = {
                    query: `
                        {
                            roles_paginated(per_page: ${this.rolesPerPage},
                                page: ${this.rolesPage},
                                order_by: ${this.rolesOrderFields}
                            ) { ${this.rolesQueryFields} }
                        }
                    `
                };

                this.executeDB(query).then(response => {
                    const data = response?.data?.data?.roles_paginated;
                    if (data) {
                        this.setRolesData(data);
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao consultar papéis!`,
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
            getUsersRole(pageNum = 1) {
                this.roleUsersPage = pageNum;
                this.roleUsersSearchTerm = '*';

                if (this.roleUserSearch.length > 0) {
                    this.roleUsersSearchTerm = this.roleUserSearch;
                }

                this.executeDB({
                    query: `
                        {
                            users_paginated(
                                search_field: "${this.roleUserSearchField}",
                                search_term: "${this.roleUsersSearchTerm}",
                                page: ${this.roleUsersPage},
                                per_page: ${this.roleUsersPerPage},
                                have_relationship: "roles",
                                relationshipIdOrSlug: "${this.selectedRole.slug}",
                            ) { ${this.relationshipQueryFields} }
                        }
                    `
                }).then(response => {
                    const data = response.data.data.users_paginated;

                    if (data) {
                        this.roleUsers = data.data;
                        this.roleUsersPageCount = data.last_page;
                        this.roleUsersPerPage = data.per_page;
                        this.roleUsersPage = data.current_page;
                        this.hasRoleUsers = data.has_more_pages || this.roleUsersPage > 1;
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao consultar usuários vinculados ao papel!`,
                            footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                        });
                    }
                });
            },
            getPermissionsRole(pageNum = 1) {
                this.rolePermissionsPage = pageNum;
                this.rolePermissionsSearchTerm = '*';

                if (this.rolePermissionSearch.length > 0) {
                    this.rolePermissionsSearchTerm = this.rolePermissionSearch;
                }

                this.executeDB({
                    query: `
                        {
                            permissions_paginated(
                                search_field: "${this.rolePermissionSearchField}",
                                search_term: "${this.rolePermissionsSearchTerm}",
                                page: ${this.rolePermissionsPage},
                                per_page: ${this.rolePermissionsPerPage},
                                have_relationship: "roles",
                                relationshipIdOrSlug: "${this.selectedRole.slug}",
                            ) { ${this.relationshipQueryFields} }
                        }
                    `
                }).then(response => {
                    const data = response.data.data.permissions_paginated;

                    if (data) {
                        this.rolePermissions = data.data;
                        this.rolePermissionsPageCount = data.last_page;
                        this.rolePermissionsPerPage = data.per_page;
                        this.rolePermissionsPage = data.current_page;
                        this.hasRolePermissions = data.has_more_pages || this.rolePermissionsPage > 1;
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao consultar permissões vinculados ao papel!`,
                            footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                        });
                    }
                });
            },
            newRole() {
                this.resetForm();
                this.modalTitle = 'Incluir novo papel';
                this.editMode = false;
                $('#modalRole').modal({backdrop: false});
            },
            permissionsRole(role) {
                this.resetModal();
                this.selectedRole = role;
                this.getPermissionsRole();
                $('#modalRolePermissions').modal({backdrop: false});
            },
            refreshPermissionsRole() {
                this.rolePermissionSearch = this.permissionSearch = '';
                this.permissionsSearched = [];
                this.getPermissionsRole();
            },
            refreshUsersRole() {
                this.roleUserSearch = this.userSearch = '';
                this.usersSearched = [];
                this.getUsersRole();
            },
            removePermissionRole(permission) {
                SwalQuestion.fire({
                    title: `Confirma a desvinculação da permissão ${permission.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.executeDB({
                            query: `
                                mutation detachPermission($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                                    detach_permission_to_role(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                                }
                            `,
                            variables: {
                                modelIdOrSlug: this.selectedRole.slug,
                                relationIdOrSlug: permission.id,
                            }
                        }).then(response => {
                            console.log(response);
                            if (response?.data?.data?.detach_permission_to_role) {
                                this.getPermissionsRole();
                                $('#modalPermission').modal('hide');
                                Toast.fire({ icon: 'success', title: `Permissão desvinculada com sucesso!` });
                            } else if (response?.data?.errors?.length > 0) {
                                SwalError.fire({
                                    title: `Falha ao desvincular a permissão!`,
                                    footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                                });
                            }
                        }).catch(err => {
                            Toast.fire({ icon: 'error', title: `Falha ao desvincular a permissão!` });
                        });
                    }
                });
            },
            removeUserRole(user) {
                SwalQuestion.fire({
                    title: `Confirma a desvinculação do usuário ${user.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.executeDB({
                            query: `
                                mutation detachUser($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                                    detach_role_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                                }
                            `,
                            variables: {
                                modelIdOrSlug: user.id,
                                relationIdOrSlug: this.selectedRole.slug,
                            }
                        }).then(response => {
                            if (response?.data?.data?.detach_role_to_user) {
                                this.getUsersRole();
                                $('#modalRole').modal('hide');
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
                this.roleUsers = [],
                this.usersSearched = [],
                this.userSearch = '',
                this.roleUserSearch = '',
                this.hasRoles = false,
                this.hasRoleUsers = false,
                this.rolesPageCount = 0,
                this.rolesPerPage = 15,
                this.rolesPage = 1,
                this.roleUsersPageCount = 0,
                this.roleUsersPerPage = 5,
                this.roleUsersPage = 1,
                this.roleUsersSearchTerm = '*',
                this.usersSearchField = 'name',
                this.roleUserSearchField = 'name',
                this.hasUsersSearched = false,
                this.usersSearchedPageCount = 0,
                this.usersSearchedPerPage = 5,
                this.usersSearchedPage = 1,
                this.selectedRole = null
            },
            searchPermissions(pageNum = 1) {
                if (this.permissionSearch.length > 0) {
                    this.permissionsSearchedPage = pageNum;
                    this.executeDB({
                        query: `
                            {
                                permissions_paginated(
                                    search_field: "${this.permissionsSearchField}",
                                    search_term: "${this.permissionSearch}",
                                    page: ${this.permissionsSearchedPage},
                                    per_page: ${this.permissionsSearchedPerPage},
                                    doesnt_have_relationship: "roles",
                                    relationshipIdOrSlug: "${this.selectedRole.slug}",
                                ) { ${this.relationshipQueryFields} }
                            }
                        `
                    }).then(response => {
                        const data = response.data.data.permissions_paginated;

                        if (data) {
                            this.permissionsSearched = data.data;
                            this.permissionsSearchedPageCount = data.last_page;
                            this.permissionsSearchedPerPage = data.per_page;
                            this.permissionsSearchedPage = data.current_page;
                            this.hasPermissionsSearched = data.has_more_pages || this.permissionsSearchedPage > 1;
                        } else if (response?.data?.errors?.length > 0) {
                            SwalError.fire({
                                title: `Falha ao consultar usuários!`,
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
                                    doesnt_have_relationship: "roles",
                                    relationshipIdOrSlug: "${this.selectedRole.slug}",
                                ) { ${this.relationshipQueryFields} }
                            }
                        `
                    }).then(response => {
                        const data = response.data.data.users_paginated;

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
            setRolesData(data) {
                if (data) {
                    this.roles = data.data;
                    this.rolesPageCount = data.last_page;
                    this.rolesPerPage = data.per_page;
                    this.rolesPage = data.current_page;
                    this.hasRoles = data.has_more_pages || this.rolesPage > 1;
                }
            },
            storeRole() {
                this.executeDB({
                    query: `
                        mutation storeRole($name: String!) {
                            create_role(name: $name) {
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
                    if (response?.data?.data?.create_role) {
                        this.resetForm();
                        this.getRoles();
                        $('#modalRole').modal('hide');
                        Toast.fire({ icon: 'success', title: `Papel incluído com sucesso!` });
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao incluir o papel!`,
                            footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                        });
                    }
                }).catch(err => {
                    Toast.fire({ icon: 'error', title: `Falha ao incluir papel!` });
                });
            },
            sortRoles() {
                this.roles = this.roles.sort(function(a, b) {
                    if (a.createdAt < b.createdAt) return 1;
                    if (a.createdAt > b.createdAt) return -1;
                    return 0;
                });
            },
            updateRole() {
                const query = {
                    query: `
                        mutation updateRoles($idOrSlug: String!, $name: String!) {
                            update_role(idOrSlug: $idOrSlug, name: $name) {
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
                            title: `Falha ao atualizar papel!`,
                            footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                        });
                    } else {
                        const role = response?.data?.data?.update_role;

                        this.roles.map(item => {
                            if (item.slug === role?.slug) {
                                item.name = role?.name;
                                item.updatedAt = role?.updatedAt;
                            };
                        });
                        this.sortRoles();
                        this.resetForm();
                        $('#modalRole').modal('hide');
                        Toast.fire({ icon: 'success', title: `Papel atualizado com sucesso!` });
                    }
                }).catch(err => {
                    Toast.fire({ icon: 'error', title: `Falha ao atualizar papel!` });
                });
            },
            usersRole(role) {
                this.resetModal();
                this.selectedRole = role;
                this.getUsersRole();
                $('#modalRoleUsers').modal({backdrop: false});
            },
        }
    }
</script>
