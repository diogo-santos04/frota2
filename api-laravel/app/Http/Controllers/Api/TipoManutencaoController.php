<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\TipoManutencao;

class TipoManutencaoController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(TipoManutencao::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required',
            'status' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Dados incorretos',
                'details' => $validator->errors()
            ], 400);
        }
        $tipo_manutencao = TipoManutencao::create([
            'nome' => $request->input('nome'),
            'status' => $request->input('status'),
        ]);

        return response()->json($tipo_manutencao, 201);
    }
}
