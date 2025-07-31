<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocalChegada extends Model
{
    protected $fillable = [
        "viagem_destino_id",
        "cep",
        "numero",
        "bairro",
        "rua"
    ];

    public function viagemDestino(){
        return $this->belongsTo(ViagemDestino::class);
    }
}
