<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Veiculo;

class VeiculoController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(Veiculo::all());
    }

    public function getVeiculoByPlaca(Request $request){
        $placa = $request->input("placa");
        $veiculo = Veiculo::where('placa', $placa)->first();
        if($veiculo){
            return response()->json($veiculo, 200);    
        } else {
            return response()->json(["error" => "Algo deu errado"], 400);
        }
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required',
            'marca' => 'required',
            'placa' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados incorretos'], 400);
        }

        $veiculo = Veiculo::create([
            'nome' => $request->input('nome'),
            'marca' => $request->input('marca'),
            'placa' => $request->input('placa'),
        ]);

        return response()->json($veiculo, 201);
    }
}
