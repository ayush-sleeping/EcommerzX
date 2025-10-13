<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Creates the customers table with all necessary columns, indexes, and constraints.
     * Columns:
     *   - id: Primary key
     *   - user_id: Foreign key to users table (nullable for future flexibility)
     *   - customer_id: Customer identification number (unique)
     *   - personal_email: Personal email address
     *   - type: Customer type/category
     *   - created_by, updated_by: User IDs for auditing
     *
     * Indexes:
     *   - user_id, customer_id, type, created_by, updated_by for fast lookups
     *
     * Constraints:
     *   - Foreign keys with cascade on update/delete
     *   - Unique customer_id for customer identification
     */
    public function up(): void
    {
        if (! Schema::hasTable('customers')) {
            Schema::create('customers', function (Blueprint $table) {
                $table->id()->comment('Primary key: Customer ID');
                $table->unsignedBigInteger('user_id')->nullable()->comment('Foreign key to users table');
                $table->string('customer_id', 50)->unique()->comment('Customer identification number');
                $table->string('personal_email', 255)->nullable()->comment('Personal email address');
                $table->string('type', 125)->comment('Customer type/category');
                $table->unsignedBigInteger('created_by')->nullable()->comment('User who created the customer record');
                $table->unsignedBigInteger('updated_by')->nullable()->comment('User who last updated the customer record');
                $table->timestamps();

                // Foreign key constraints with cascade
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
                $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
                $table->foreign('updated_by')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');

                // Indexes for performance
                $table->index('user_id');
                $table->index('customer_id');
                $table->index('type');
                $table->index('created_by');
                $table->index('updated_by');
                $table->index('personal_email');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
