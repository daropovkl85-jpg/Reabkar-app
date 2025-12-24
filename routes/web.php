<?php

use Illuminate\Support\Facades\Route; // កុំភ្លេចហៅ Route
use App\Http\Controllers\RiebkearController;
use App\Http\Controllers\PaymentController;

// Route សម្រាប់ទំព័រដើម
Route::get('/', [RiebkearController::class, 'index'])->name('home');

// Route សម្រាប់ Shop Demo
Route::get('/shop', [PaymentController::class, 'index'])->name('shop');
