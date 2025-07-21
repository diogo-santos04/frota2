<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VistoriaItem extends Model
{
    protected $fillable = [
        "vistoria_id",
        "item_id",
        "nota",
        "status"
    ];
}
