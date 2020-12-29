<?php

namespace CodeMaster\CodeAclWeb;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class CodeAclWebServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->register();
        $this->registerCommands();
        $this->registerPublishing();
        $this->registerRoutes();
        $this->registerViews();
    }

    /**
     * Register the package.
     *
     * @return void
     */
    public function register()
    {
        $this->mergeConfigFrom(__DIR__.'/../config/code-acl-web.php', 'code-acl-web');
    }

    /**
     * Register the package's commands.
     *
     * @return void
     */
    private function registerCommands()
    {
        $this->commands([
            // Commands\Install::class,
            // Commands\Update::class,
        ]);
    }

    /**
     * Register the package routes.
     *
     * @return void
     */
    private function registerRoutes()
    {
        Route::group($this->routeConfiguration(), function () {
            $this->loadRoutesFrom(__DIR__.'/Http/routes.php');
        });
    }

    /**
     * Get the Telescope route group configuration array.
     *
     * @return array
     */
    private function routeConfiguration()
    {
        return [
            'domain' => config('code-acl-web.domain', null),
            'namespace' => 'CodeMaster\CodeAclWeb\Http\Controllers',
            'prefix' => config('code-acl-web.route_prefix'),
            'middleware' => config('code-acl-web.middleware', 'web'),
        ];
    }

    /**
     * Register the package's publishable resources.
     *
     * @return void
     */
    private function registerPublishing()
    {
        if ($this->app->runningInConsole()) {
            if (function_exists('config_path')) { // function not available and 'publish' not relevant in Lumen
                $this->publishes([
                    __DIR__.'/../config/code-acl-web.php' => config_path('code-acl-web.php'),
                ], 'codeaclweb-config');
            }

            if (function_exists('public_path')) {
                $this->publishes([
                    __DIR__.'/../dist' => public_path('vendor/code-acl-web'),
                ], 'codeaclweb-assets');
            }
        }
    }

    /**
     * Register the package's views.
     *
     * @return void
     */
    protected function registerViews()
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'code-acl-web');
    }
}
