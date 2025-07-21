<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vistoria extends Model
{
    protected $fillable = [
        "motorista_id",
        "veiculo_id",
        "data_vistoria",
        "km_vistoria",
        "km_troca_oleo",
        "data_troca_oleo",
        "documento",
        "cartao_abastecimento",
        "combustivel",
        "pneu_dianteiro",
        "pneu_traseiro",
        "pneu_estepe",
        "nota",
        "status"
    ];

    public function motorista(){
        return $this->belongsTo(Motorista::class);
    }

    
    public function veiculo(){
        return $this->belongsTo(Veiculo::class);
    }
}

