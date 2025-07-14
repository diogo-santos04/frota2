<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Abastecimento extends Model
{
    protected $fillable = [
        "veiculo_id",
        "motorista_id",
        "data_abastecimento",
        "km",
        "litros",
        "tipo"
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
