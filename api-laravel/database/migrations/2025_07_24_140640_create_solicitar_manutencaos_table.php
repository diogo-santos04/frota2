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
        Schema::create('solicitar_manutencaos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('veiculo_id')->nullable();
            $table->foreign('veiculo_id')->references('id')->on('veiculos')->onUpdate('cascade')->onDelete('cascade');

            $table->unsignedBigInteger('motorista_id')->nullable();
            $table->foreign('motorista_id')->references('id')->on('motoristas')->onUpdate('cascade')->onDelete('cascade');

            $table->unsignedBigInteger('tipo_manutencao_id')->nullable();
            $table->foreign('tipo_manutencao_id')->references('id')->on('tipo_manutencaos')->onUpdate('cascade')->onDelete('cascade');

            $table->date("data_solicitacao");
            $table->string("nota")->nullable();
            $table->string("status")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitar_manutencaos');
    }
};
