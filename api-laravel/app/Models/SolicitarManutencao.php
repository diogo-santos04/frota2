<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SolicitarManutencao extends Model
{
    protected $fillable = [
        "veiculo_id",
        "motorista_id",
        "tipo_manutencao_id",
        "data_solicitacao",
        "nota",
        "foto",
        "status"
    ];

    public function tipo_manutencao(){
        return $this->belongsTo(TipoManutencao::class);
    }
    
    public function veiculo(){
        return $this->belongsTo(Veiculo::class);
    }

    public function motorista(){
        return $this->belongsTo(Motorista::class);
    }
}
