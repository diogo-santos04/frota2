<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Unidade;

class UnidadeController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(Unidade::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados incorretos'], 400);
        }

        $unidade = Unidade::create([
            'nome' => $request->input('nome'),
        ]);

        return response()->json($unidade, 201);
    }
}
