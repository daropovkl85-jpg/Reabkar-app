<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('payments', function (Blueprint $table) {
        $table->id();
        $table->string('md5')->unique(); // លេខកូដសម្គាល់ការទូទាត់ (សំខាន់)
        $table->decimal('amount', 10, 2);
        $table->string('currency', 3); // KHR ឬ USD
        $table->string('status')->default('pending'); // pending, success, failed
        $table->string('payer_account')->nullable(); // លេខគណនីអ្នកបង់ (បើមាន)
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
