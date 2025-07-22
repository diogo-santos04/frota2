<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\VistoriaItem;

class VistoriaItemController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(VistoriaItem::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vistoria_id' => 'required',
            'item_id' => 'required',
            'nota' => 'required',
            'km_vistoria' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Dados incorretos',
                'details' => $validator->errors()
            ], 400);
        }

        $vistoriaItem = VistoriaItem::create([
            'vistoria_id' => $request->input('vistoria_id'),
            'item_id' => $request->input('item_id'),
            'nota' => $request->input('nota'),
            'status' => $request->input('status'),
        ]);

        return response()->json($vistoriaItem, 201);
    }
}
