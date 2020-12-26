<template>
    <div class="c-sidebar c-sidebar-dark c-sidebar-fixed c-sidebar-lg-show" id="sidebar">
        <div class="c-sidebar-brand">
            <img class="c-sidebar-brand-full" src="/vendor/code-acl-web/img/logo_h_cms.png" alt="CodeACL Logo"/>
            <img class="c-sidebar-brand-minimized" src="/vendor/code-acl-web/img/logo64.png" alt="CodeACL Logo"/>
        </div>
        <ul class="c-sidebar-nav">
            <li class="c-sidebar-nav-item">
                <router-link :to="getUrl('')" class="c-sidebar-nav-link">
                    <svg class="c-sidebar-nav-icon">
                        <use xlink:href="/vendor/code-acl-web/icons/sprites/free.svg#cil-speedometer"></use>
                    </svg>
                    Dashboard
                </router-link>
            </li>
            <li class="c-sidebar-nav-title">Cadastros</li>
            <li class="c-sidebar-nav-item">
                <router-link :to="getUrl('modules')" class="c-sidebar-nav-link">
                    <svg class="c-sidebar-nav-icon">
                        <use xlink:href="/vendor/code-acl-web/icons/sprites/free.svg#cil-view-module"></use>
                    </svg>
                    Módulos
                </router-link>
            </li>
            <li class="c-sidebar-nav-item">
                <router-link :to="getUrl('roles')" class="c-sidebar-nav-link">
                    <svg class="c-sidebar-nav-icon">
                        <use xlink:href="/vendor/code-acl-web/icons/sprites/free.svg#cil-notes"></use>
                    </svg>
                    Papéis
                </router-link>
            </li>
            <li class="c-sidebar-nav-item">
                <router-link :to="getUrl('permissions')" class="c-sidebar-nav-link">
                    <svg class="c-sidebar-nav-icon">
                        <use xlink:href="/vendor/code-acl-web/icons/sprites/free.svg#cil-fingerprint"></use>
                    </svg>
                    Permissões
                </router-link>
            </li>
            <li class="c-sidebar-nav-item">
                <router-link :to="getUrl('systems')" class="c-sidebar-nav-link">
                    <svg class="c-sidebar-nav-icon">
                        <use xlink:href="/vendor/code-acl-web/icons/sprites/free.svg#cil-memory"></use>
                    </svg>
                    Sistemas
                </router-link>
            </li>
            <li class="c-sidebar-nav-item">
                <router-link :to="getUrl('users')" class="c-sidebar-nav-link">
                    <svg class="c-sidebar-nav-icon">
                        <use xlink:href="/vendor/code-acl-web/icons/sprites/free.svg#cil-people"></use>
                    </svg>
                    Usuários
                </router-link>
            </li>
        </ul>
        <div class="c-sidebar-brand c-sidebar-brand-full">
            <a href="https://github.com/codemastersolutions/code-acl-web" target="_blank" class="text-white">
                <svg class="c-icon c-icon-xl mr-2">
                    <use xlink:href="/vendor/code-acl-web/icons/sprites/brand.svg#cib-github"></use>
                </svg>
                CodeACL Web
            </a>
        </div>
        <a href="https://codemastersolucoes.com" class="logo-footer" target="_blank">
            <img src="/vendor/code-acl-web/img/logo_h_cms.png" alt="CMS Logo" />
        </a>
        <button class="c-sidebar-minimizer c-class-toggler" type="button" data-target="_parent" data-class="c-sidebar-minimized">
        </button>
    </div>
</template>

<style scoped>
    a {
        text-decoration: none;
    }
    .logo-footer {
        margin-bottom: -3rem;
        margin-left: 0.8rem;
    }
    .logo-footer img, .c-sidebar-brand-full, .c-sidebar-brand-minimized {
        height: 3rem;
    }
    .logo-footer img, .c-sidebar-brand-full {
        height: 3rem;
    }
</style>

<script>
    export default {
        name: 'home',
        methods: {
            getUrl(path) {
                return `${window.urls.pathUrl}/${path}`
            }
        }
    }
</script>
