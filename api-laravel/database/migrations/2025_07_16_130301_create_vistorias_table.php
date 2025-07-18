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
        Schema::create('vistorias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('veiculo_id')->nullable();
            $table->foreign('veiculo_id')->references('id')->on('veiculos')->onUpdate('cascade')->onDelete('cascade');

            $table->unsignedBigInteger('motorista_id')->nullable();
            $table->foreign('motorista_id')->references('id')->on('motoristas')->onUpdate('cascade')->onDelete('cascade');

            $table->date("data_vistoria");
            $table->boolean("pneu");
            $table->boolean("estepe");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vistorias');
    }
};
