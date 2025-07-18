<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vistoria extends Model
{
    protected $fillable = [
        "motorista_id",
        "veiculo_id",
        "data_vistoria",
        "pneu",
        "estepe"
    ];

    public function motorista(){
        return $this->belongsTo(Motorista::class);
    }

    
    public function veiculo(){
        return $this->belongsTo(Veiculo::class);
    }
}

