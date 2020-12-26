<template>
    <div class="container">
        <div class="row justify-content-between">
            <div class="col-sm-6 col-md-2">
                <router-link :to="getUrl('modules')">
                    <div class="card text-white bg-info" title="Clique para acessar os detahles dos módulos">
                        <div class="card-body">
                            <div class="text-muted text-right mb-2">
                                <svg class="c-icon c-icon-3xl">
                                    <use
                                        xlink:href="/vendor/code-acl-web/icons/sprites/free.svg#cil-view-module"
                                    ></use>
                                </svg>
                            </div>
                            <div class="text-value-xl">{{ summary.modules }}</div>
                            <small class="text-muted text-uppercase font-weight-bold">
                                Módulos
                            </small>
                        </div>
                    </div>
                </router-link>
            </div>
            <div class="col-sm-6 col-md-2">
                <router-link :to="getUrl('roles')">
                    <div class="card text-white bg-primary">
                        <div class="card-body">
                            <div class="text-muted text-right mb-2">
                                <svg class="c-icon c-icon-3xl">
                                    <use
                                        xlink:href="/vendor/code-acl-web/icons/sprites/free.svg#cil-notes"
                                    ></use>
                                </svg>
                            </div>
                            <div class="text-value-xl">{{ summary.roles }}</div>
                            <small class="text-muted text-uppercase font-weight-bold">
                                Papéis
                            </small>
                        </div>
                    </div>
                </router-link>
            </div>
            <div class="col-sm-6 col-md-2">
                <router-link :to="getUrl('permissions')">
                    <div class="card text-white bg-success">
                        <div class="card-body">
                            <div class="text-muted text-right mb-2">
                                <svg class="c-icon c-icon-3xl">
                                    <use
                                        xlink:href="/vendor/code-acl-web/icons/sprites/free.svg#cil-fingerprint"
                                    ></use>
                                </svg>
                            </div>
                            <div class="text-value-xl">{{ summary.permissions }}</div>
                            <small class="text-muted text-uppercase font-weight-bold">
                                Permissões
                            </small>
                        </div>
                    </div>
                </router-link>
            </div>
            <div class="col-sm-6 col-md-2">
                <router-link :to="getUrl('systems')">
                    <div class="card text-white bg-danger">
                        <div class="card-body">
                            <div class="text-muted text-right mb-2">
                                <svg class="c-icon c-icon-3xl">
                                    <use
                                        xlink:href="/vendor/code-acl-web/icons/sprites/free.svg#cil-memory"
                                    ></use>
                                </svg>
                            </div>
                            <div class="text-value-xl">{{ summary.systems }}</div>
                            <small class="text-muted text-uppercase font-weight-bold">
                                Sistemas
                            </small>
                        </div>
                    </div>
                </router-link>
            </div>
            <div class="col-sm-6 col-md-2">
                <router-link :to="getUrl('users')">
                    <div class="card text-white bg-warning">
                        <div class="card-body">
                            <div class="text-muted text-right mb-2">
                                <svg class="c-icon c-icon-3xl">
                                    <use
                                        xlink:href="/vendor/code-acl-web/icons/sprites/free.svg#cil-people"
                                    ></use>
                                </svg>
                            </div>
                            <div class="text-value-xl">{{ summary.users }}</div>
                            <small class="text-muted text-uppercase font-weight-bold">
                                Usuários
                            </small>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
    a {
        text-decoration: none;
    }
</style>

<script>
    export default {
        name: 'home',
        data() {
            return {
                summary: {
                    modules: 0,
                    permissions: 0,
                    roles: 0,
                    systems: 0,
                    users: 0,
                }
            }
        },
        created() {
            this.getSummary();
        },
        methods: {
            executeDB(queryData) {
                return window.api.post(window.urls.graphqlApi, queryData).catch((err) => {
                    if (err.response.status === 401) {
                        window.location = `${window.urls.baseURL}${window.urls.login}`;
                    }
                });;
            },
            getSummary() {
                const query = {
                    query: `
                        {
                            modules_paginated(per_page: 1, page: 1) { data { createdAt }, total },
                            permissions_paginated(per_page: 1, page: 1) { data { createdAt }, total },
                            roles_paginated(per_page: 1, page: 1) { data { createdAt }, total },
                            systems_paginated(per_page: 1, page: 1) { data { createdAt }, total },
                            users_paginated(per_page: 1, page: 1) { data { createdAt }, total },
                        }
                    `
                };

                this.executeDB(query).then(response => {
                    this.summary.modules = response?.data?.data?.modules_paginated?.total || 0;
                    this.summary.permissions = response?.data?.data?.permissions_paginated?.total || 0;
                    this.summary.roles = response?.data?.data?.roles_paginated?.total || 0;
                    this.summary.systems = response?.data?.data?.systems_paginated?.total || 0;
                    this.summary.users = response?.data?.data?.users_paginated?.total || 0;
                });
            },
            getUrl(path) {
                return `${window.urls.pathUrl}/${path}`
            }
        }
    }
</script>
