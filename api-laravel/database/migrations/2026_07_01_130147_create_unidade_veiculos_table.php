<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('unidade_veiculos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('unidade_id')->nullable();
            $table->foreign('unidade_id')->references('id')->on('unidades')->onUpdate('cascade')->onDelete('cascade');
            
            $table->unsignedBigInteger('veiculo_id')->nullable();
            $table->foreign('veiculo_id')->references('id')->on('veiculos')->onUpdate('cascade')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unidade_veiculos');
    }
};
