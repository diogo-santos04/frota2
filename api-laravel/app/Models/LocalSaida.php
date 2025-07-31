<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocalSaida extends Model
{
    protected $fillable = [
        "viagem_id",
        "cep",
        "numero",
        "bairro",
        "rua"
    ];

    public function viagem()
    {
        return $this->belongsTo(Viagem::class);
    }
}
