<?php

use App\Http\Controllers\Api\AbastecimentoController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\MotoristaController;
use App\Http\Controllers\Api\ProfissionalController;
use App\Http\Controllers\Api\SolicitarManutencaoController;
use App\Http\Controllers\Api\TipoManutencaoController;
use App\Http\Controllers\Api\UnidadeController;
use App\Http\Controllers\Api\UnidadeVeiculoController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VeiculoController;
use App\Http\Controllers\Api\ViagemController;
use App\Http\Controllers\Api\ViagemDestinoController;
use App\Http\Controllers\Api\VistoriaController;
use App\Http\Controllers\Api\VistoriaItemController;
use App\Models\SolicitarManutencao;
use App\Models\TipoManutencao;
use Illuminate\Support\Facades\Route;

Route::post("/auth/login", [AuthController::class, 'login']);
Route::post("/auth/logout", [AuthController::class, 'logout']);
Route::post("/auth/refresh", [AuthController::class, 'refresh']);
Route::post("/user", [AuthController::class, 'create']);
Route::get("/user", [UserController::class, 'read']);
//motorista
Route::resource('/motorista', MotoristaController::class);
Route::post('/motorista/dados', [MotoristaController::class, "getMotorista"]);
//profissional
Route::resource('/profissional', ProfissionalController::class);
Route::post('/profissional/detalhes', [ProfissionalController::class, "profissionalDetalhes"]);
//unidade
Route::resource('/unidade', UnidadeController::class);
Route::resource('/unidade_veiculo', UnidadeVeiculoController::class);
//veiculo
Route::resource('/veiculo', VeiculoController::class);
Route::post('/veiculo/placa', [VeiculoController::class, 'getVeiculoByPlaca']);
//viagem
Route::resource('/viagem', ViagemController::class);
Route::post('/viagem/detalhes', [ViagemController::class, "viagemDetalhes"]);
Route::post('/viagem/local_saida', [ViagemController::class, "viagemSaida"]);
Route::post('/viagem/cancelar', [ViagemController::class, "cancelarViagem"]);
Route::get('/viagem/local_saida/detalhes', [ViagemController::class, "getViagemSaida"]);
//viagem destino
Route::resource('/viagem_destino', controller: ViagemDestinoController::class);
Route::post('/viagem_destino/local_chegada', [ViagemController::class, "viagemDestinoChegada"]);
//abastecimento
Route::resource('/abastecimento', controller: AbastecimentoController::class);
//vistoria
Route::resource('/vistoria', controller: VistoriaController::class);
Route::post('/vistoria/veiculo', [VistoriaController::class, "getVistoriaVeiculo"]);
Route::resource('/vistoria_item', controller: VistoriaItemController::class);
Route::resource('/item', controller: ItemController::class);
//manutencao
Route::resource('/solicitar_manutencao', controller: SolicitarManutencaoController::class);
Route::resource('/tipo_manutencao', controller: TipoManutencaoController::class);
