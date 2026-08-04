<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category'); // breakfast | lunch | dinner | dessert | drink
            $table->decimal('price', 8, 2);
            $table->text('description')->nullable();
            $table->string('photo_url')->nullable();
            $table->boolean('featured')->default(false);
            $table->timestamps();

            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
