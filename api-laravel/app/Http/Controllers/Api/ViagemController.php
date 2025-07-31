<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LocalSaida;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Viagem;

class ViagemController extends Controller
{
    // GET /item
    public function index()
    {
        $viagens = Viagem::with('veiculo', 'motorista.profissional')
            ->where("status", "Aberto")
            ->get();

        return response()->json($viagens, 200);
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'veiculo_id' => 'required',
            'motorista_id' => 'required',
            'km_inicial' => 'required',
            'local_saida' => 'required',
            'destino' => 'required',
            'objetivo_viagem' => 'required',
            'nivel_combustivel' => 'required',
            'nota' => 'nullable',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados incorretos'], 400);
        }

        $viagem = Viagem::create([
            'veiculo_id' => $request->input('veiculo_id'),
            'motorista_id' => $request->input('motorista_id'),
            'km_inicial' => $request->input('km_inicial'),
            'local_saida' => $request->input('local_saida'),
            'destino' => $request->input('destino'),
            'objetivo_viagem' => $request->input('objetivo_viagem'),
            'nivel_combustivel' => $request->input('nivel_combustivel'),
            'nota' => $request->input('nota'),
            'status' => $request->input('status'),
        ]);

        return response()->json($viagem, 201);
    }

    public function viagemDetalhes(Request $request)
    {
        $viagem_id = $request->input("viagem_id");
        $viagem = Viagem::where("id", $viagem_id)->first();

        return response()->json($viagem, 200);
    }

    public function viagemSaida(Request $request){
        $validator = Validator::make($request->all(), [
            'viagem_id' => 'required',
            'cep' => 'required',
            'numero' => 'required',
            'bairro' => 'required',
            'rua' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Dados incorretos'], 400);
        }

        $saida = LocalSaida::create([
            'viagem_id' => $request->input('viagem_id'),
            'cep' => $request->input('cep'),
            'numero' => $request->input('numero'),
            'bairro' => $request->input('bairro'),
            'rua' => $request->input('rua'),
        ]);

        return response()->json($saida, 201);
    }
}
