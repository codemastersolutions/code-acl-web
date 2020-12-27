<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta Information -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <meta name="description" content="CodeACL - Controle de Acesso de Usuários">
    <meta name="author" content="Gilson Gabriel - codemastersolucoes.com">
    <meta name="keyword" content="Laravel,ACL,CodeMaster,Solucoes,CodeACL,CoreUI">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="robots" content="noindex, nofollow">

    <link rel="shortcut icon" href="{{ asset('/vendor/cms-acl-web/img/favicon.ico') }}">

    <title>CodeACL{{ config('app.name') ? ' - ' . config('app.name') : '' }}</title>

    <!-- Style sheets-->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="{{ asset('/vendor/code-acl-web/css/free.min.css') }}" rel="stylesheet">
    {{-- <link href="{{ asset('/vendor/code-acl-web/css/flag.min.css') }}" rel="stylesheet"> --}}
    <link href="{{ asset('/vendor/code-acl-web/css/style.css') }}" rel="stylesheet">
    <link href="{{ asset('/vendor/code-acl-web/css/anime.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/vendor/code-acl-web/css/custom.min.css') }}" rel="stylesheet">
</head>
<body>
    <div class="c-app" id="code-acl-web">
        <sidebar-component></sidebar-component>
        <div class="c-wrapper">
            <header-component></header-component>

            <div class="c-body">
                <main class="c-main">
                    <router-view></router-view>
                    <vue-progress-bar></vue-progress-bar>
                </main>
                <footer-component></footer-component>
            </div>
        </div>
    </div>

    <script src="{{ asset('/vendor/code-acl-web/js/manifest.js') }}"></script>
    <script src="{{ asset('/vendor/code-acl-web/js/vendor.js') }}"></script>
    <script src="{{ asset('/vendor/code-acl-web/js/bootstrap.min.js') }}"></script>
    <script src="{{ asset('/vendor/code-acl-web/js/coreui.bundle.min.js') }}"></script>
    <script src="{{ asset('/vendor/code-acl-web/js/coreui-utils.js') }}"></script>
    <script src="{{ asset('/vendor/code-acl-web/js/app.min.js') }}"></script>
</body>
</html>
