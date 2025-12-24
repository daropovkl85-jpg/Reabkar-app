<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
{
    // បន្ថែមបន្ទាត់នេះ ដើម្បីដោះស្រាយបញ្ហាលើ Vercel
    if (env('VIEW_COMPILED_PATH')) {
        \Config::set('view.compiled', env('VIEW_COMPILED_PATH'));
    }
}
}
