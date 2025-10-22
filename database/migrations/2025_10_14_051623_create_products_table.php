<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->text('category_ids')->nullable();
            $table->unsignedBigInteger('attribute_id')->nullable();
            $table->string('status')->default('INACTIVE');
            $table->string('sale')->default('INACTIVE');
            $table->string('index')->nullable();

            $table->string('featured')->default('INACTIVE');
            $table->text('model')->nullable();
            $table->longText('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->integer('views_count')->nullable();
            $table->integer('reviews_count')->nullable();
            $table->integer('rating')->nullable();
            $table->longtext('specification_title')->nullable();
            $table->string('sku')->nullable();
            $table->string('hsn')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('attribute_id')->references('id')->on('attributes')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
