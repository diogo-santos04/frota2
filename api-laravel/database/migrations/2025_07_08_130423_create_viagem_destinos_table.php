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
        Schema::create('viagem_destinos', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('viagem_id')->nullable();
            $table->foreign('viagem_id')->references('id')->on('viagems')->onUpdate('cascade')->onDelete('cascade');

            $table->dateTime("data_saida");
            $table->dateTime("data_chegada")->useCurrent();
            $table->integer("km_saida");
            $table->integer("km_chegada");
            $table->integer("km_total");
            $table->string("local_saida");
            $table->string("local_destino");
            $table->text("nota")->nullable();
            $table->string("status");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('viagem_destinos');
    }
};
