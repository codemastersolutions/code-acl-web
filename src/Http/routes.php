<?php

use Illuminate\Support\Facades\Route;

Route::get('/{path?}/{path2?}/{path3?}/{path4?}/{path5?}', function() {
    return view('code-acl-web::layout');
});
