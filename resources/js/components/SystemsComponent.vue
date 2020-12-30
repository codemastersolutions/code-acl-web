<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="card">
                    <div class="card-header pt-1 pb-1">
                        <div class="row align-items-center">
                            <div class="col-sm-12 col-md-5 col-lg-4">
                                <h5>Sistemas</h5>
                            </div>
                            <div class="col-sm-12 col-md-3 col-lg-3">
                                <button class="btn btn-sm btn-square btn-primary" type="button" @click="newSystem()">
                                    Novo sistema
                                </button>
                                <button class="btn btn-square btn-success" type="button" @click="getSystems()"
                                    title="Atualizar lista de sistemas">
                                    <i class="cil-reload"></i>
                                </button>
                            </div>
                            <div class="col-sm-12 col-md-4 col-lg-5">
                                <div class="input-group mb-0">
                                    <div class="input-group-prepend pointer">
                                        <select class="form-control flat" id="selectSystemSearchField" name="selectSystemSearchField"
                                            v-model="systemSearchField" @change="filterSystems()">
                                            <option value="name">Nome</option>
                                        </select>
                                    </div>
                                    <input type="text" class="form-control flat" v-model="systemSearch"
                                        @keyup="filterSystems()" :placeholder="systemSearchFieldPlaceholder">
                                    <div class="input-group-prepend pointer" title="Pesquisar usuário">
                                        <div class="input-group-text flat" v-on:click.stop="filterSystems()">
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
                            <tr v-for="system in systems" :key="system.slug">
                                <td>{{system.name}}</td>
                                <td class="text-center">{{system.createdAt | pt_br}}</td>
                                <td class="text-center">{{system.updatedAt | pt_br}}</td>
                                <td class="text-center">
                                    <span class="pointer" @click="editSystem(system)" title="Editar este sistema">
                                        <i class="c-icon cil-pencil text-primary"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="deleteSystem(system)" title="Exluir este sistema">
                                        <i class="c-icon cil-trash text-danger"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="usersSystem(system)" title="Usuários que possuem este sistema">
                                        <i class="c-icon cil-people text-info"></i>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                        </table>

                        <paginate
                            v-if="hasSystems"
                            :pageCount="systemsPageCount"
                            :pageRange="3"
                            :clickHandler="getSystems"
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

        <form id="form" @submit.prevent="editMode ? updateSystem() : storeSystem()">
            <div class="modal fade" id="modalSystem" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display: none;" aria-hidden="true">
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
                                <label for="name">Nome do sistema</label>
                                <input class="form-control flat" name="name" id="name" type="text" placeholder="Informe um nome para o sistema"
                                v-model="form.name"/>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button v-show="editMode" class="btn btn-block btn-square" type="submit"
                                :class="{ 'btn-primary': editMode }">
                                Atualizar
                            </button>
                            <button v-show="!editMode" class="btn btn-success btn-block btn-square" type="submit"
                                :class="{ 'btn-success': !editMode }">
                                Salvar
                            </button>
                            <button class="btn btn-secondary btn-block btn-square" type="button" data-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <div class="modal fade" id="modalsystemUsers" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display: none;" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content flat" v-if="selectedSystem">
                    <div class="modal-header pt-1 pb-1">
                        <h4 class="modal-title">Usuários vinculados ao sistema: <strong>{{selectedSystem.name}}</strong></h4>
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
                                                <select class="form-control flat" id="selectsystemUserSearchField" name="selectsystemUserSearchField"
                                                    v-model="systemUserSearchField" @change="getUsersSystem()">
                                                    <option value="email">E-mail</option>
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" v-model="systemUserSearch"
                                                @keyup="getUsersSystem()" :placeholder="systemUserSearchFieldPlaceholder">
                                            <div class="input-group-prepend pointer" title="Pesquisar usuário">
                                                <div class="input-group-text flat" v-on:click.stop="getUsersSystem()">
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
                                                        <span class="badge badge-primary pointer flat" @click="addUserSystem(user)">
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
                                    <tr v-for="user in systemUsers" :key="user.id">
                                        <td>{{user.name}}</td>
                                        <td class="text-center">
                                            <span class="pointer" data-id="user.id" @click="removeUserSystem(user)" title="Desvincular usuário">
                                                <i class="cc-icon cil-trash text-danger"></i>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            <div class="card-footer m-0 p-1">
                                <paginate
                                    v-if="hassystemUsers"
                                    :pageCount="systemUsersPageCount"
                                    :pageRange="3"
                                    :clickHandler="getUsersSystem"
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
                        <button class="btn btn-success btn-square" @click.stop="refreshUsersSystem()">
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
        name: 'systems',
        props: {
        },
        data() {
            return {
                editMode: false,
                modalTitle: '',
                form: new Form({ name: '', slug: '' }),
                formLogin: new Form({ email: '', password: '' }),
                systems: [],
                systemUsers: [],
                usersSearched: [],
                userSearch: '',
                systemSearch: '',
                systemUserSearch: '',
                hasSystems: false,
                hassystemUsers: false,
                systemsPageCount: 0,
                systemsPerPage: 15,
                systemsPage: 1,
                systemUsersPageCount: 0,
                systemUsersPerPage: 5,
                systemUsersPage: 1,
                systemUsersSearchTerm: '*',
                systemSearchField: 'name',
                usersSearchField: 'name',
                systemUserSearchField: 'name',
                hasUsersSearched: false,
                usersSearchedPageCount: 0,
                usersSearchedPerPage: 5,
                usersSearchedPage: 1,
                selectedSystem: null,
                systemsQueryFields: `data { name, slug, createdAt, updatedAt }, total, current_page, last_page, has_more_pages, per_page`,
                systemsOrderFields: `"created_at desc"`,
                relationshipQueryFields: `data { id, name }, total, current_page, last_page, has_more_pages, per_page`,
            }
        },
        computed: {
            systemUserSearchFieldPlaceholder() {
                return this.getPlaceholder(this.systemUserSearchField);
            },
            usersSearchFieldPlaceholder() {
                return this.getPlaceholder(this.usersSearchField);
            },
            systemSearchFieldPlaceholder() {
                return this.getPlaceholder(this.systemSearchField);
            },
        },
        async created() {
            this.resetModal();
            await window.api.get(window.urls.sanctumCsrf);
            this.getSystems();
        },
        methods: {
            addUserSystem(user) {
                this.executeDB({
                    query: `
                        mutation attachUser($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                            give_system_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                        }
                    `,
                    variables: {
                        modelIdOrSlug: user.id,
                        relationIdOrSlug: this.selectedSystem.slug,
                    }
                }).then(response => {
                    const data = response?.data?.data?.give_system_to_user;

                    if (data) {
                        this.getUsersSystem();
                        this.searchUsers();
                        Toast.fire({ icon: 'success', title: `Usuário vinculado com sucesso!` });
                    } else if (response?.data?.errors?.length > 0) {
                        throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                    }
                }).catch(err => {
                    SwalError.fire({
                        title: `Falha ao vincular o usuário!`,
                        footer: `<strong>Erro:</strong>&nbsp; ${err}`
                    });
                });
            },
            clearUsersSearched() {
                this.usersSearched = [];
                this.usersSearchedPage = 1;
                this.usersSearchedPageCount = 0;
            },
            deleteSystem(system) {
                SwalQuestion.fire({
                    title: `Confirma a exclusão do sistema ${system.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.executeDB({
                            query: `
                                mutation deleteSystem($idOrSlug: String!) {
                                    delete_system(idOrSlug: $idOrSlug)
                                }
                            `,
                            variables: {
                                idOrSlug: system.slug
                            }
                        }).then(response => {
                            if (response?.data?.data?.delete_system) {
                                this.getSystems();
                                $('#modalSystem').modal('hide');
                                Toast.fire({ icon: 'success', title: `Sistema incluído com sucesso!` });
                            } else if (response?.data?.errors?.length > 0) {
                                throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                            }
                        }).catch(err => {
                            SwalError.fire({
                                title: `Falha ao excluir a sistema!`,
                                footer: `<strong>Erro:</strong>&nbsp; ${err}`
                            });
                        });
                    }
                });
            },
            editSystem(system) {
                this.resetForm();
                this.modalTitle = 'Editar sistema';
                this.form.fill(system);
                this.editMode = true;
                $('#modalSystem').modal({backdrop: false});
            },
            executeDB(queryData) {
                return window.api.post(window.urls.graphqlApi, queryData).catch((err) => {
                    if (err.response.status === 401) {
                        window.location = `${window.urls.baseURL}${window.urls.login}`;
                    }
                });;
            },
            filterSystems() {
                this.systemsPage = 1;

                if (this.systemSearch.length === 0) {
                    this.systemsOrderFields = `"created_at desc"`;
                    this.getSystems();
                } else {
                    const query = {
                        query: `
                            {
                                systems_paginated(per_page: ${this.systemsPerPage},
                                    page: ${this.systemsPage},
                                    search_term: "${this.systemSearch}",
                                    search_field: "${this.systemSearchField}",
                                    order_by: "${this.systemSearchField}") {
                                        ${this.systemsQueryFields}
                                }
                            }
                        `
                    };

                    this.executeDB(query).then(response => {
                        const data = response?.data?.data?.systems_paginated;
                        if (data) {
                            this.setSystemsData(data);
                        } else if (response?.data?.errors?.length > 0) {
                            SwalError.fire({
                                title: `Falha ao consultar sistemas!`,
                                footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                            });
                        }
                    });
                }
            },
            getSystems(pageNum = 1) {
                this.systemsPage = pageNum;
                const query = {
                    query: `
                        {
                            systems_paginated(per_page: ${this.systemsPerPage},
                                page: ${this.systemsPage},
                                order_by: ${this.systemsOrderFields}) {
                                    ${this.systemsQueryFields}
                            }
                        }
                    `
                };

                this.executeDB(query).then(response => {
                    const data = response?.data?.data?.systems_paginated;
                    if (data) {
                        this.setSystemsData(data);
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao consultar sistemas!`,
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
            getUsersSystem(pageNum = 1) {
                this.systemUsersPage = pageNum;
                this.systemUsersSearchTerm = '*';

                if (this.systemUserSearch.length > 0) {
                    this.systemUsersSearchTerm = this.systemUserSearch;
                }

                this.executeDB({
                    query: `
                        {
                            users_paginated(
                                search_field: "${this.systemUserSearchField}",
                                search_term: "${this.systemUsersSearchTerm}",
                                page: ${this.systemUsersPage},
                                per_page: ${this.systemUsersPerPage},
                                have_relationship: "systems",
                                relationshipIdOrSlug: "${this.selectedSystem.slug}",
                            ) { ${this.relationshipQueryFields} }
                        }
                    `
                }).then(response => {
                    const data = response.data.data.users_paginated;

                    if (data) {
                        this.systemUsers = data.data;
                        this.systemUsersPageCount = data.last_page;
                        this.systemUsersPerPage = data.per_page;
                        this.systemUsersPage = data.current_page;
                        this.hassystemUsers = data.has_more_pages || this.systemUsersPage > 1;
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao consultar usuários vinculados ao sistema!`,
                            footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                        });
                    }
                });
            },
            newSystem() {
                this.resetForm();
                this.modalTitle = 'Incluir novo sistema';
                this.editMode = false;
                $('#modalSystem').modal({backdrop: false});
            },
            refreshUsersSystem() {
                this.userSearch = this.systemUserSearch = '';
                this.usersSearched = [];
                this.getUsersSystem();
            },
            removeUserSystem(user) {
                SwalQuestion.fire({
                    title: `Confirma a desvinculação do usuário ${user.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.executeDB({
                            query: `
                                mutation detachUser($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                                    detach_system_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                                }
                            `,
                            variables: {
                                modelIdOrSlug: user.id,
                                relationIdOrSlug: this.selectedSystem.slug,
                            }
                        }).then(response => {
                            if (response?.data?.data?.detach_system_to_user) {
                                this.getUsersSystem();
                                $('#modalSystem').modal('hide');
                                Toast.fire({ icon: 'success', title: `Usuário desvinculado com sucesso!` });
                            } else if (response?.data?.errors?.length > 0) {
                                throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                            }
                        }).catch(err => {
                            SwalError.fire({
                                title: `Falha ao desvincular o usuário!`,
                                footer: `<strong>Erro:</strong>&nbsp; ${err}`
                            });
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
                this.systemUsers = [],
                this.usersSearched = [],
                this.userSearch = '',
                this.systemUserSearch = '',
                this.hasSystems = false,
                this.hassystemUsers = false,
                this.systemsPageCount = 0,
                this.systemsPerPage = 15,
                this.systemsPage = 1,
                this.systemUsersPageCount = 0,
                this.systemUsersPerPage = 5,
                this.systemUsersPage = 1,
                this.systemUsersSearchTerm = '*',
                this.usersSearchField = 'name',
                this.systemUserSearchField = 'name',
                this.hasUsersSearched = false,
                this.usersSearchedPageCount = 0,
                this.usersSearchedPerPage = 5,
                this.usersSearchedPage = 1,
                this.selectedSystem = null
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
                                    doesnt_have_relationship: "systems",
                                    relationshipIdOrSlug: "${this.selectedSystem.slug}",
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
            setSystemsData(data) {
                if (data) {
                    this.systems = data.data;
                    this.systemsPageCount = data.last_page;
                    this.systemsPerPage = data.per_page;
                    this.systemsPage = data.current_page;
                    this.hasSystems = data.has_more_pages || this.systemsPage > 1;
                }
            },
            storeSystem() {
                this.executeDB({
                    query: `
                        mutation storeSystem($name: String!) {
                            create_system(name: $name) {
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
                    if (response?.data?.data?.create_system) {
                        this.resetForm();
                        this.getSystems();
                        $('#modalSystem').modal('hide');
                        Toast.fire({ icon: 'success', title: `Sistema incluído com sucesso!` });
                    } else if (response?.data?.errors?.length > 0) {
                        throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                    }
                }).catch(err => {
                    SwalError.fire({
                        title: `Falha ao incluir sistema!`,
                        footer: `<strong>Erro:</strong>&nbsp; ${err}`
                    });
                });
            },
            sortSystems() {
                this.systems = this.systems.sort(function(a, b) {
                    if (a.createdAt < b.createdAt) return 1;
                    if (a.createdAt > b.createdAt) return -1;
                    return 0;
                });
            },
            updateSystem() {
                const query = {
                    query: `
                        mutation updateSystems($idOrSlug: String!, $name: String!) {
                            update_system(idOrSlug: $idOrSlug, name: $name) {
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
                        throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                    } else {
                        const system = response?.data?.data?.update_system;

                        this.systems.map(item => {
                            if (item.slug === system?.slug) {
                                item.name = system?.name;
                                item.updatedAt = system?.updatedAt;
                            };
                        });
                        this.sortSystems();
                        this.resetForm();
                        $('#modalSystem').modal('hide');
                        Toast.fire({ icon: 'success', title: `Sistema atualizado com sucesso!` });
                    }
                }).catch(err => {
                    SwalError.fire({
                        title: `Falha ao atualizar sistema!`,
                        footer: `<strong>Erro:</strong>&nbsp; ${err}`
                    });
                });
            },
            usersSystem(system) {
                this.resetModal();
                this.selectedSystem = system;
                this.getUsersSystem();
                $('#modalsystemUsers').modal({backdrop: false});
            },
        }
    }
</script>
