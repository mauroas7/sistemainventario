<?php

namespace App\Providers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Vite;
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
        Vite::prefetch(concurrency: 3);

        // En producción la base no se reconstruye, se migra: sin esto,
        // `migrate:fresh`, `db:wipe` o un rollback borran los movimientos reales.
        DB::prohibitDestructiveCommands($this->app->isProduction());
    }
}
