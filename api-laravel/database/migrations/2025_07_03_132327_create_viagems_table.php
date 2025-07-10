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
        Schema::create('viagems', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('motorista_id')->nullable();
            $table->foreign('motorista_id')->references('id')->on('motoristas')->onUpdate('cascade')->onDelete('cascade');
            
            $table->unsignedBigInteger('veiculo_id')->nullable();
            $table->foreign('veiculo_id')->references('id')->on('veiculos')->onUpdate('cascade')->onDelete('cascade');  
            
            $table->dateTime("data_viagem")->useCurrent();
            $table->string("nivel_combustivel");
            $table->string("km_inicial");
            $table->string("local_saida");
            $table->string("destino");
            $table->string("objetivo_viagem");
            $table->string("status");
            $table->string("nota")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('viagems');
    }
};
