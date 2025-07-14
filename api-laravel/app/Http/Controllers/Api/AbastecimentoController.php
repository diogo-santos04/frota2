<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Abastecimento;

class AbastecimentoController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(Abastecimento::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'veiculo_id' => 'required',
            'motorista_id' => 'required',
            'data_abastecimento' => 'required',
            'km' => 'required',
            'litros' => 'required',
            'tipo' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados incorretos'], 400);
        }

        $abastecimento = Abastecimento::create([
            'veiculo_id' => $request->input('veiculo_id'),
            'motorista_id' => $request->input('motorista_id'),
            'data_abastecimento' => $request->input('data_abastecimento'),
            'km' => $request->input('km'),
            'litros' => $request->input('litros'),
            'tipos' => $request->input('tipos'),
        ]);

        return response()->json($abastecimento, 201);
    }
}
