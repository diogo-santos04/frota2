<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Vistoria;

class VistoriaController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(Vistoria::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'motorista_id' => 'required',
            'veiculo_id' => 'required',
            'data_vistoria' => 'required',
            'km_vistoria' => 'required',
            'km_troca_oleo' => 'required',
            'data_troca_oleo' => 'required',
            'documento' => 'required',
            'cartao_abastecimento' => 'nullable',
            'combustivel' => 'required',
            'pneu_dianteiro' => 'required',
            'pneu_traseiro' => 'required',
            'pneu_estepe' => 'required',
            'nota' => 'nullable',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Dados incorretos',
                'details' => $validator->errors()
            ], 400);
        }

        $vistoria = Vistoria::create([
            'motorista_id' => $request->input('motorista_id'),
            'veiculo_id' => $request->input('veiculo_id'),
            'data_vistoria' => $request->input('data_vistoria'),
            'km_vistoria' => $request->input('km_vistoria'),
            'km_troca_oleo' => $request->input('km_troca_oleo'),
            'data_troca_oleo' => $request->input('data_troca_oleo'),
            'documento' => $request->input('documento'),
            'cartao_abastecimento' => $request->input('cartao_abastecimento'),
            'combustivel' => $request->input('combustivel'),
            'pneu_dianteiro' => $request->input('pneu_dianteiro'),
            'pneu_traseiro' => $request->input('pneu_traseiro'),
            'pneu_estepe' => $request->input('pneu_estepe'),
            'nota' => $request->input('nota'),
            'status' => $request->input('status'),
        ]);

        return response()->json($vistoria, 201);
    }
}
