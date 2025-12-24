<?php
use Illuminate\Support\Facades\URL;
namespace App\Providers;

use Illuminate\Support\ServiceProvider;

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
    public function boot(): void
{
    // បង្ខំឱ្យប្រើ HTTPS ពេលនៅលើ Production (Vercel)
    if (env('APP_ENV') !== 'local') {
        URL::forceScheme('https');
    }
}
}
