<template>
    <div class="c-sidebar c-sidebar-dark c-sidebar-fixed c-sidebar-lg-show" id="sidebar">
        <div class="c-sidebar-brand">
            <img class="c-sidebar-brand-full" src="vendor/code-acl-web//img/logo_h_cms.png" alt="CodeACL Logo"/>
            <img class="c-sidebar-brand-minimized" src="vendor/code-acl-web//img/logo64.png" alt="CodeACL Logo"/>
        </div>
        <ul class="c-sidebar-nav">
            <li class="c-sidebar-nav-item">
                <a class="c-sidebar-nav-link" href="">
                    <svg class="c-sidebar-nav-icon">
                        <use xlink:href="vendor/code-acl-web//icons/sprites/free.svg#cil-speedometer"></use>
                    </svg>
                    Dashboard
                </a>
            </li>
            <li class="c-sidebar-nav-title">Cadastros</li>
            <li class="c-sidebar-nav-item">
                <router-link to="/permissions" class="c-sidebar-nav-link">
                    <svg class="c-sidebar-nav-icon">
                        <use xlink:href="vendor/code-acl-web//icons/sprites/free.svg#cil-fingerprint"></use>
                    </svg>
                    Permissões
                </router-link>
            </li>
        </ul>
        <a href="https://codemastersolucoes.com" class="logo-footer" target="_blank">
            <img src="vendor/code-acl-web//img/logo_h_cms.png" alt="CMS Logo" />
        </a>
        <button class="c-sidebar-minimizer c-class-toggler" type="button" data-target="_parent" data-class="c-sidebar-minimized">
        </button>
    </div>
</template>

<style scoped>
    .logo-footer {
        margin-bottom: -3rem;
        margin-left: 0.8rem;
    }

    .logo-footer img, .c-sidebar-brand-full, .c-sidebar-brand-minimized {
        height: 3rem;
    }
</style>
