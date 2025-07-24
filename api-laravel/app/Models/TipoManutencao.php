<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoManutencao extends Model
{
    protected $fillable = [
        "nome",
        "status"
    ];
}
