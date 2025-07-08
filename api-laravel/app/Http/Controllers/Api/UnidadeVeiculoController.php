<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\UnidadeVeiculo;

class UnidadeVeiculoController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(UnidadeVeiculo::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'unidade_id' => 'required',
            'veiculo_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados incorretos'], 400);
        }

        $unidadeVeiculo = UnidadeVeiculo::create([
            'unidade_id' => $request->input('unidade_id'),
            'veiculo_id' => $request->input('veiculo_id'),
        ]);

        return response()->json($unidadeVeiculo, 201);
    }
}
