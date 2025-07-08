<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnidadeVeiculo extends Model
{
    protected $fillable = [
        "unidade_id",
        "veiculo_id",
    ];

    public function unidade()
    {
        return $this->belongsTo(Unidade::class, 'id', 'unidade_id');
    }

    public function veiculo()
    {
        return $this->belongsTo(Veiculo::class, 'id', 'veiculo_id');
    }
}
