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
        "status"
    ];

    public function tipoManutencao(){
        return $this->belongsTo(TipoManutencao::class);
    }
}
