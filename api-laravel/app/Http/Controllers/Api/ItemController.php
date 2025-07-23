<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Item;

class ItemController extends Controller
{
    // GET /item
    public function index()
    {
        return response()->json(Item::all());
    }

    // POST /item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required',
            'descricao' => 'required',
            'ordem' => 'nullable',
            'status' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Dados incorretos',
                'details' => $validator->errors()
            ], 400);
        }

        $item = Item::create([
            'nome' => $request->input('nome'),
            'descricao' => $request->input('descricao'),
            'ordem' => $request->input('ordem'),
            'status' => $request->input('status'),
        ]);

        return response()->json($item, 201);
    }
}
