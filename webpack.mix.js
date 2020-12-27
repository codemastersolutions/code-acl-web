const mix = require('laravel-mix');
const fs = require('fs');

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

fs.rmdir('./public/vendor', { recursive: true }, (err) => {});
fs.rmdir('./dist', { recursive: true }, (err) => {});

let productionSourceMaps = true;

if (mix.inProduction()) {
    productionSourceMaps = false;
}

mix
    .sass('./resources/sass/custom.scss', './public/vendor/code-acl-web/css/custom.min.css')
    .copy('./resources/coreui-free/css', './public/vendor/code-acl-web/css')
    .copy('./node_modules/anime.css/anime.min.css', './public/vendor/code-acl-web/css')
    .copy('./resources/img', './public/vendor/code-acl-web/img')
    .copy('./resources/coreui-free/fonts', './public/vendor/code-acl-web/fonts')
    .copy('./resources/coreui-free/icons/sprites/avatar.svg', './public/vendor/code-acl-web/icons')
    .copy('./resources/coreui-free/icons/sprites/free.svg', './public/vendor/code-acl-web/icons')
    .copy('./resources/coreui-free/js', './public/vendor/code-acl-web/js')
    .js('./resources/js/bootstrap.js', './public/vendor/code-acl-web/js/bootstrap.min.js')
    .js('./resources/js/app.js', './public/vendor/code-acl-web/js/app.min.js')
    .setPublicPath('./public/vendor/code-acl-web')
    .extract(['vue', 'jquery'])
    .sourceMaps(productionSourceMaps, 'source-map')

if (process.env.MIX_COPY_ASSETS == 'true') {
    mix.copy('./public/vendor', './../../../public/vendor');
}

if (mix.inProduction()) {
    mix.version();
    mix.copy('./public/vendor/code-acl-web', './dist');
}
