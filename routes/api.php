<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

// Route សម្រាប់បង្កើត QR
Route::post('/generate-qr', [PaymentController::class, 'apiGenerateQr']);

// Route សម្រាប់ផ្ទៀងផ្ទាត់
Route::post('/verify-payment', [PaymentController::class, 'verifyTransaction']);