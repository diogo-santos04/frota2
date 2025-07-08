<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Motorista;

class MotoristaController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(Motorista::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'profissional_id' => 'required',
            'nome' => 'required',
            'cnh' => 'required',
            'validade' => 'required',
            'categoria' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados incorretos'], 400);
        }

        $motorista = Motorista::create([
            'user_id' => $request->input('user_id'),
            'profissional_id' => $request->input('profissional_id'),
            'nome' => $request->input('nome'),
            'cnh' => $request->input('cnh'),
            'validade' => $request->input('validade'),
            'categoria' => $request->input('categoria'),
        ]);

        return response()->json($motorista, 201);
    }

    public function getMotorista(Request $request){
        $user_id = $request->input("user_id");
        $motorista = Motorista::where('user_id', $user_id)->first();
        if($motorista){
            return response()->json($motorista, 200);    
        } else {
            return response()->json(["error" => "Algo deu errado"], 400);
        }
    }
}
