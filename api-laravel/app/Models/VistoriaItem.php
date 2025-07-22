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

    public function vistoria(){
        return $this->belongsTo(Vistoria::class);
    }

    public function item(){
        return $this->belongsTo(Item::class);
    }
}
