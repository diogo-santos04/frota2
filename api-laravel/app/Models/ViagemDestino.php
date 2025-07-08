<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ViagemDestino extends Model
{
    protected $fillable = [
        "viagem_id",
        "data_saida",
        "data_chegada",
        "km_saida",
        "km_chegada",
        "km_total",
        "local_saida",
        "local_destino",
        "nota",
        "status",
    ];

    public function viagem()
    {
        return $this->belongsTo(Viagem::class);
    }
}
