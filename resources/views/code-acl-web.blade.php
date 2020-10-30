<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta Information -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="shortcut icon" href="{{ asset('/vendor/cms-acl-web/favicon.ico') }}">

    <meta name="robots" content="noindex, nofollow">

    <title>CodeACL{{ config('app.name') ? ' - ' . config('app.name') : '' }}</title>

    <!-- Style sheets-->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="{{ asset(mix('style.css', 'vendor/code-acl-web/css')) }}" rel="stylesheet" type="text/css">
</head>
<body>
<div id="code-acl-web" v-cloak>

</div>

<script src="{{asset(mix('app.min.js', 'vendor/code-acl-web/js'))}}"></script>
</body>
</html>
