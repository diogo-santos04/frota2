<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('local_saidas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('viagem_id')->nullable();
            $table->foreign('viagem_id')->references('id')->on('viagems')->onUpdate('cascade')->onDelete('cascade');
            $table->string("cep")->nullable();
            $table->string("numero")->nullable();
            $table->string("bairro")->nullable();
            $table->string("rua")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('local_saidas');
    }
};
