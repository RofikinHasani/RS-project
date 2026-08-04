<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Ember & Vine API',
        'status' => 'ok',
        'docs' => 'See README.md — all endpoints are under /api',
    ]);
});
