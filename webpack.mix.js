const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
    .sass('./resources/sass/custom.scss', './public/vendor/code-acl-web/css/custom.min.css')
    .copy('./resources/coreui-free/css', './public/vendor/code-acl-web/css')
    .copy('./node_modules/anime.css/anime.min.css', './public/vendor/code-acl-web/css')
    .copy('./resources/img', './public/vendor/code-acl-web/img')
    .copy('./resources/coreui-free/fonts', './public/vendor/code-acl-web/fonts')
    .copy('./resources/coreui-free/icons', './public/vendor/code-acl-web/icons')
    .copy('./resources/coreui-free/js', './public/vendor/code-acl-web/js')
    .copy('./resources/coreui-free/svg', './public/vendor/code-acl-web/svg')
    .js('./resources/js/bootstrap.js', './public/vendor/code-acl-web/js/bootstrap.min.js')
    .js('./resources/js/app.js', './public/vendor/code-acl-web/js/app.min.js')
    .setPublicPath('./public/vendor/code-acl-web')
    .extract(['vue', 'jquery']);

if (mix.inProduction()) {
    mix.version();
}
