<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Profissional;

class ProfissionalController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(Profissional::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'nome' => 'required',
            'cpf' => 'required',
            'matricula' => 'required',
            'celular' => 'required',
            'codigo' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados incorretos'], 400);
        }

        $profissional = Profissional::create([
            'user_id' => $request->input('user_id'),
            'nome' => $request->input('nome'),
            'cpf' => $request->input('cpf'),
            'matricula' => $request->input('matricula'),
            'celular' => $request->input('celular'),
            'codigo' => $request->input('codigo'),
        ]);

        return response()->json($profissional, 201);
    }
}
