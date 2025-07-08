<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Viagem extends Model
{
     protected $fillable = [
        "motorista_id",
        "veiculo_id",
        "km_inicial",
        "local_saida",
        "destino",
        "objetivo_viagem",
        "data_viagem",
        "nivel_combustivel",
        "nota",
        "status",
    ];

    public function veiculo()
    {
        return $this->belongsTo(Veiculo::class);
    }

    public function motorista()
    {
        return $this->belongsTo(Motorista::class);
    }
}
