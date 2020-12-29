<?php

use Illuminate\Support\Facades\Route;

$view = 'code-acl-web::layout';

Route::get('/code-acl-web/modules', function() use ($view) {
    return view($view);
});

Route::get('/code-acl-web/permissions', function() use ($view) {
    return view($view);
});

Route::get('/code-acl-web/roles', function() use ($view) {
    return view($view);
});

Route::get('/code-acl-web/systems', function() use ($view) {
    return view($view);
});

Route::get('/code-acl-web/users', function() use ($view) {
    return view($view);
});
