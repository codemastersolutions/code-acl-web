<template>
    <header class="c-header c-header-light c-header-fixed c-header-with-subheader">
        <button class="c-header-toggler c-class-toggler d-lg-none mr-auto" type="button" data-target="#sidebar" data-class="c-sidebar-show">
            <span class="c-header-toggler-icon"></span>
        </button>
        <router-link class="c-header-brand d-sm-none" to="/cms/code-acl-web">
            <img class="c-header-brand" src="/vendor/code-acl-web/img/logo_h_cms.png" alt="CodeACL Logo"/>
        </router-link>
        <button class="c-header-toggler c-class-toggler ml-3 d-md-down-none" type="button" data-target="#sidebar" data-class="c-sidebar-lg-show" responsive="true">
            <span class="c-header-toggler-icon"></span>
        </button>
        <ul class="c-header-nav ml-auto mr-4">
            <li class="c-header-nav-item dropdown">
                <a class="c-header-nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                    <div class="c-avatar">
                        <img class="c-avatar-img" src="/vendor/code-acl-web/icons/sprites/avatar.svg" alt="user"/>
                    </div>
                </a>
                <div class="dropdown-menu dropdown-menu-right pt-0">
                    <div class="dropdown-header bg-light py-2"><strong>Configurações</strong></div>
                    <a class="dropdown-item" href="javascript:void(0)">
                        <svg class="c-icon mr-2">
                            <use xlink:href="/vendor/code-acl-web/icons/sprites/free.svg#cil-settings"></use>
                        </svg>
                        Configurações
                    </a>
                    <div class="dropdown-divider"></div>
                    <!-- <a class="dropdown-item" href="#">
                        <svg class="c-icon mr-2">
                            <use xlink:href="/vendor/code-acl-web/icons/sprites/free.svg#cil-lock-locked"></use>
                        </svg>
                        Lock Account
                    </a> -->
                    <a class="dropdown-item" :href="urlLogout"
                        onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                        <svg class="c-icon mr-2">
                            <use xlink:href="/vendor/code-acl-web/icons/sprites/free.svg#cil-account-logout"></use>
                        </svg>
                        Logout
                    </a>
                </div>
            </li>
    </ul>
    <div class="c-subheader px-3">
        <ol class="breadcrumb border-0 m-0">
            <li class="breadcrumb-item"><router-link to="/cms/code-acl-web">Dashboard</router-link></li>
        </ol>
    </div>
    <form id="logout-form" :action="urlLogout" method="POST"></form>
</header>
</template>

<style scoped>
    a {
        text-decoration: none;
    }

    .c-header-brand {
        height: 1rem;
    }
</style>

<script>
    export default {
        name: 'home',
        props: {},
        data() {
            return {
                urlLogout: `${window.urls.baseURL}logout`,
            }
        },
    }
</script>

