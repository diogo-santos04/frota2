<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\SolicitarManutencao;

class SolicitarManutencaoController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(SolicitarManutencao::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'motorista_id' => 'required',
            'veiculo_id' => 'required',
            'tipo_manutencao_id' => 'required',
            'data_solicitacao' => 'required',
            'nota' => 'nullable',
            'status' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Dados incorretos',
                'details' => $validator->errors()
            ], 400);
        }

        $manutencao = SolicitarManutencao::create([
            'motorista_id' => $request->input('motorista_id'),
            'veiculo_id' => $request->input('veiculo_id'),
            'tipo_manutencao_id' => $request->input('tipo_manutencao_id'),
            'data_solicitacao' => $request->input('data_solicitacao'),
            'nota' => $request->input('nota'),
            'status' => $request->input('status'),
        ]);

        return response()->json($manutencao, 201);
    }
}
