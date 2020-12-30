<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="card">
                    <div class="card-header pt-1 pb-1">
                        <div class="row align-items-center">
                            <div class="col-sm-12 col-md-5 col-lg-4">
                                <h5>Módulos</h5>
                            </div>
                            <div class="col-sm-12 col-md-3 col-lg-3">
                                <button class="btn btn-sm btn-square btn-primary" type="button" @click="newModule()">
                                    Novo módulo
                                </button>
                                <button class="btn btn-square btn-success" type="button" @click="getModules()"
                                    title="Atualizar lista de módulos">
                                    <i class="cil-reload"></i>
                                </button>
                            </div>
                            <div class="col-sm-12 col-md-4 col-lg-5">
                                <div class="input-group mb-0">
                                    <div class="input-group-prepend pointer">
                                        <select class="form-control flat" id="selectModuleSearchField" name="selectModuleSearchField"
                                            v-model="moduleSearchField" @change="filterModules()">
                                            <option value="name">Nome</option>
                                        </select>
                                    </div>
                                    <input type="text" class="form-control flat" v-model="moduleSearch"
                                        @keyup.stop="filterModules()" :placeholder="moduleSearchFieldPlaceholder">
                                    <div class="input-group-prepend pointer" title="Pesquisar módulo">
                                        <div class="input-group-text flat" v-on:click.stop="filterModules()">
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
                            <tr v-for="module in modules" :key="module.slug">
                                <td>{{module.name}}</td>
                                <td class="text-center">{{module.createdAt | pt_br}}</td>
                                <td class="text-center">{{module.updatedAt | pt_br}}</td>
                                <td class="text-center">
                                    <span class="pointer" @click="editModule(module)" title="Editar este módulo">
                                        <i class="c-icon cil-pencil text-primary"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="deleteModule(module)" title="Exluir este módulo">
                                        <i class="c-icon cil-trash text-danger"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="usersModule(module)" title="Usuários que possuem este módulo">
                                        <i class="c-icon cil-people text-info"></i>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                        </table>

                        <paginate
                            v-if="hasModules"
                            :pageCount="modulesPageCount"
                            :pageRange="3"
                            :clickHandler="getModules"
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

        <form id="form" @submit.prevent="editMode ? updateModule() : storeModule()">
            <div class="modal fade" id="modalModule" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display: none;" aria-hidden="true">
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
                                <label for="name">Nome do Módulo</label>
                                <input class="form-control flat" name="name" id="name" type="text" placeholder="Informe um nome para o módulo"
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

        <div class="modal fade" id="modalModuleUsers" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display: none;" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content flat" v-if="selectedModule">
                    <div class="modal-header pt-1 pb-1">
                        <h4 class="modal-title">Usuários vinculados ao módulo: <strong>{{selectedModule.name}}</strong></h4>
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
                                                <select class="form-control flat" id="selectModuleUserSearchField" name="selectModuleUserSearchField"
                                                    v-model="moduleUserSearchField" @change="getUsersModule()">
                                                    <option value="email">E-mail</option>
                                                    <option value="name">Nome</option>
                                                </select>
                                            </div>
                                            <input type="text" class="form-control flat" v-model="moduleUserSearch"
                                                @keyup.stop="getUsersModule()" :placeholder="moduleUserSearchFieldPlaceholder">
                                            <div class="input-group-prepend pointer" title="Pesquisar usuário">
                                                <div class="input-group-text flat" v-on:click.stop="getUsersModule()">
                                                    <i class="cil-search"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="card card-accent-success mb-2">
                                    <div class="card-header p-1">Vincular usuário</div>
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
                                                v-model="userSearch" @keyup.stop="searchUsers()">
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
                                                        <span class="badge badge-primary pointer flat" @click="addUserModule(user)">
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
                                    <tr v-for="user in moduleUsers" :key="user.id">
                                        <td>{{user.name}}</td>
                                        <td class="text-center">
                                            <span class="pointer" data-id="user.id" @click="removeUserModule(user)" title="Desvincular usuário">
                                                <i class="cc-icon cil-trash text-danger"></i>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            <div class="card-footer m-0 p-1">
                                <paginate
                                    v-if="hasModuleUsers"
                                    :pageCount="moduleUsersPageCount"
                                    :pageRange="3"
                                    :clickHandler="getUsersModule"
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
                        <button class="btn btn-success btn-square" @click.stop="refreshUsersModule()">
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
        name: 'modules',
        props: {
        },
        data() {
            return {
                editMode: false,
                modalTitle: '',
                form: new Form({
                    name: '',
                    slug: ''
                }),
                formLogin: new Form({
                    email: '',
                    password: ''
                }),
                modules: [],
                moduleUsers: [],
                usersSearched: [],
                userSearch: '',
                moduleSearch: '',
                moduleUserSearch: '',
                hasModules: false,
                hasModuleUsers: false,
                modulesPageCount: 0,
                modulesPerPage: 15,
                modulesPage: 1,
                moduleUsersPageCount: 0,
                moduleUsersPerPage: 5,
                moduleUsersPage: 1,
                moduleUsersSearchTerm: '*',
                usersSearchField: 'name',
                moduleSearchField: 'name',
                moduleUserSearchField: 'name',
                hasUsersSearched: false,
                usersSearchedPageCount: 0,
                usersSearchedPerPage: 5,
                usersSearchedPage: 1,
                selectedModule: null,
                modulesQueryFields: `data { name, slug, createdAt, updatedAt }, total, current_page, last_page, has_more_pages, per_page`,
                modulesOrderFields: `"created_at desc"`,
                relationshipQueryFields: `data { name, id }, total, current_page, last_page, has_more_pages, per_page`,
            }
        },
        computed: {
            moduleUserSearchFieldPlaceholder() {
                return this.getPlaceholder(this.moduleUserSearchField);
            },
            usersSearchFieldPlaceholder() {
                return this.getPlaceholder(this.usersSearchField);
            },
            moduleSearchFieldPlaceholder() {
                return this.getPlaceholder(this.moduleSearchField);
            },
        },
        async created() {
            this.resetModal();
            await window.api.get(window.urls.sanctumCsrf);
            this.getModules();
        },
        methods: {
            addUserModule(user) {
                this.executeDB({
                    query: `
                        mutation addUserModule($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                            give_module_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                        }
                    `,
                    variables: {
                        modelIdOrSlug: user.id,
                        relationIdOrSlug: this.selectedModule.slug,
                    }
                }).then(response => {
                    const data = response?.data?.data?.give_module_to_user;

                    if (data) {
                        this.getUsersModule();
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
            deleteModule(module) {
                SwalQuestion.fire({
                    title: `Confirma a exclusão do módulo ${module.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.executeDB({
                            query: `
                                mutation deleteModule($idOrSlug: String!) {
                                    delete_module(idOrSlug: $idOrSlug)
                                }
                            `,
                            variables: {
                                idOrSlug: module.slug
                            }
                        }).then(response => {
                            if (response?.data?.data?.delete_module) {
                                this.getModules();
                                $('#modalModule').modal('hide');
                                Toast.fire({ icon: 'success', title: `Módulo excluído com sucesso!` });
                            } else if (response?.data?.errors?.length > 0) {
                                throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                            }
                        }).catch(err => {
                            SwalError.fire({
                                title: `Falha ao excluir a módulo!`,
                                footer: `<strong>Erro:</strong>&nbsp; ${err}`
                            });
                        });
                    }
                });
            },
            editModule(module) {
                this.resetForm();
                this.modalTitle = 'Editar módulo';
                this.form.fill(module);
                this.editMode = true;
                $('#modalModule').modal({backdrop: false});
            },
            executeDB(queryData) {
                return window.api.post(window.urls.graphqlApi, queryData).catch((err) => {
                    if (err?.response?.status === 401) {
                        window.location = `${window.urls.baseURL}${window.urls.login}`;
                    }
                });;
            },
            filterModules() {
                this.modulesPage = 1;

                if (this.moduleSearch.length === 0) {
                    this.modulesOrderFields = `"created_at desc"`;
                    this.getModules();
                } else {
                    const query = {
                        query: `
                            {
                                modules_paginated(per_page: ${this.modulesPerPage},
                                    page: ${this.modulesPage},
                                    search_term: "${this.moduleSearch}",
                                    search_field: "${this.moduleSearchField}",
                                    order_by: "${this.moduleSearchField}") {
                                        ${this.modulesQueryFields}
                                }
                            }
                        `
                    };

                    this.executeDB(query).then(response => {
                        const data = response?.data?.data?.modules_paginated;
                        if (data) {
                            this.setModulesData(data);
                        } else if (response?.data?.errors?.length > 0) {
                            SwalError.fire({
                                title: `Falha ao consultar módulos!`,
                                footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                            });
                        }
                    });
                }
            },
            getModules(pageNum = 1) {
                const query = {
                    query: `
                        {
                            modules_paginated(per_page: ${this.modulesPerPage},
                                page: ${this.modulesPage},
                                order_by: ${this.modulesOrderFields}) {
                                    ${this.modulesQueryFields}
                            }
                        }
                    `
                };

                this.executeDB(query).then(response => {
                    const data = response.data.data.modules_paginated;
                    if (data) {
                        this.setModulesData(data);
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao consultar módulos!`,
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
            getUsersModule(pageNum = 1) {
                this.moduleUsersPage = pageNum;
                this.moduleUsersSearchTerm = '*';

                if (this.moduleUserSearch.length > 0) {
                    this.moduleUsersSearchTerm = this.moduleUserSearch;
                }

                this.executeDB({
                    query: `
                        {
                            users_paginated(
                                search_field: "${this.moduleUserSearchField}",
                                search_term: "${this.moduleUsersSearchTerm}",
                                page: ${this.moduleUsersPage},
                                per_page: ${this.moduleUsersPerPage},
                                have_relationship: "modules",
                                relationshipIdOrSlug: "${this.selectedModule.slug}",
                            ) { ${this.relationshipQueryFields} }
                        }
                    `
                }).then(response => {
                    const data = response.data.data.users_paginated;

                    if (data) {
                        this.moduleUsers = data.data;
                        this.moduleUsersPageCount = data.last_page;
                        this.moduleUsersPerPage = data.per_page;
                        this.moduleUsersPage = data.current_page;
                        this.hasModuleUsers = data.has_more_pages || this.moduleUsersPage > 1;
                    } else if (response?.data?.errors?.length > 0) {
                        SwalError.fire({
                            title: `Falha ao consultar usuários vinculados ao módulo!`,
                            footer: `Detalhe do Erro: ${response?.data?.errors[0]?.debugMessage}`
                        });
                    }
                });
            },
            newModule() {
                this.resetForm();
                this.modalTitle = 'Incluir novo módulo';
                this.editMode = false;
                $('#modalModule').modal({backdrop: false});
            },
            refreshUsersModule() {
                this.userSearch = this.moduleUserSearch = '';
                this.usersSearched = [];
                this.getUsersModule();
            },
            removeUserModule(user) {
                SwalQuestion.fire({
                    title: `Confirma a desvinculação do usuário ${user.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.executeDB({
                            query: `
                                mutation removeUserModule($modelIdOrSlug: String!, $relationIdOrSlug: String!) {
                                    detach_module_to_user(modelIdOrSlug: $modelIdOrSlug, relationIdOrSlug: $relationIdOrSlug,)
                                }
                            `,
                            variables: {
                                modelIdOrSlug: user.id,
                                relationIdOrSlug: this.selectedModule.slug,
                            }
                        }).then(response => {
                            if (response?.data?.data?.detach_module_to_user) {
                                this.getUsersModule();
                                $('#modalModule').modal('hide');
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
                this.moduleUsers = [],
                this.usersSearched = [],
                this.userSearch = '',
                this.moduleUserSearch = '',
                this.hasModules = false,
                this.hasModuleUsers = false,
                this.modulesPageCount = 0,
                this.modulesPerPage = 15,
                this.modulesPage = 1,
                this.moduleUsersPageCount = 0,
                this.moduleUsersPerPage = 5,
                this.moduleUsersPage = 1,
                this.moduleUsersSearchTerm = '*',
                this.usersSearchField = 'name',
                this.moduleUserSearchField = 'name',
                this.hasUsersSearched = false,
                this.usersSearchedPageCount = 0,
                this.usersSearchedPerPage = 5,
                this.usersSearchedPage = 1,
                this.selectedModule = null
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
                                    doesnt_have_relationship: "modules",
                                    relationshipIdOrSlug: "${this.selectedModule.slug}",
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
            setModulesData(data) {
                if (data) {
                    this.modules = data.data;
                    this.modulesPageCount = data.last_page;
                    this.modulesPerPage = data.per_page;
                    this.modulesPage = data.current_page;
                    this.hasModules = data.has_more_pages || this.modulesPage > 1;
                }
            },
            storeModule() {
                this.executeDB({
                    query: `
                        mutation storeModule($name: String!) {
                            create_module(name: $name) {
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
                    if (response?.data?.data?.create_module) {
                        this.resetForm();
                        this.getModules();
                        $('#modalModule').modal('hide');
                        Toast.fire({ icon: 'success', title: `Módulo incluído com sucesso!` });
                    } else if (response?.data?.errors?.length > 0) {
                        throw response?.data?.errors[0]?.message || response?.data?.errors[0]?.debugMessage;
                    }
                }).catch(err => {
                    SwalError.fire({
                        title: `Falha ao incluir módulo!`,
                        footer: `<strong>Erro:</strong>&nbsp; ${err}`
                    });
                });
            },
            sortModules() {
                this.modules = this.modules.sort(function(a, b) {
                    if (a.createdAt < b.createdAt) return 1;
                    if (a.createdAt > b.createdAt) return -1;
                    return 0;
                });
            },
            updateModule() {
                const query = {
                    query: `
                        mutation updateModule($idOrSlug: String!, $name: String!) {
                            update_module(idOrSlug: $idOrSlug, name: $name) {
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
                        const module = response?.data?.data?.update_module;

                        this.modules.map(item => {
                            if (item.slug === module?.slug) {
                                item.name = module?.name;
                                item.updatedAt = module?.updatedAt;
                            };
                        });
                        this.sortModules();
                        this.resetForm();
                        $('#modalModule').modal('hide');
                        Toast.fire({ icon: 'success', title: `Módulo atualizado com sucesso!` });
                    }
                }).catch(err => {
                    SwalError.fire({
                        title: `Falha ao atualizar módulo!`,
                        footer: `<strong>Erro:</strong>&nbsp; ${err}`
                    });
                });
            },
            usersModule(module) {
                this.resetModal();
                this.selectedModule = module;
                this.getUsersModule();
                $('#modalModuleUsers').modal({backdrop: false});
            },
        }
    }
</script>
