<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ViagemDestino;
use App\Models\Viagem;

class ViagemDestinoController extends Controller
{
    // GET /item
    public function index()
    {
        $viagemDestinos = ViagemDestino::with([
            'viagem',
            'viagem.veiculo',
            'viagem.motorista.profissional'
        ])->get();

        return response()->json($viagemDestinos);
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'viagem_id' => 'required',
            'data_saida' => 'required',
            'km_saida' => 'required',
            'km_chegada' => 'required',
            'km_total' => 'required',
            'local_saida' => 'required',
            'local_destino' => 'required',
            'nota' => 'nullable',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Dados incorretos',
                'details' => $validator->errors()
            ], 400);
        }

        $viagem_destino = ViagemDestino::create([
            'viagem_id' => $request->input('viagem_id'),
            'data_saida' => $request->input('data_saida'),
            'km_saida' => $request->input('km_saida'),
            'km_chegada' => $request->input('km_chegada'),
            'km_total' => $request->input('km_total'),
            'local_saida' => $request->input('local_saida'),
            'local_destino' => $request->input('local_destino'),
            'nota' => $request->input('nota'),
            'status' => $request->input('status'),

        ]);

        $viagem = Viagem::find($request->input('viagem_id'));
        if ($viagem) {
            $viagem->status = "Finalizado";
            $viagem->save();
        } else {
            return response()->json([
                "error" => "erro ao atuallizar status da viagem",
            ], 404);
        }

        return response()->json($viagem_destino, 201);
    }
}
