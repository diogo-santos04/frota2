<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profissional extends Model
{
    protected $fillable = [
        "user_id",
        "nome",
        "cpf",
        "matricula",
        "celular",
        "codigo",
    ];


    public function user()
    {
        return $this->belongsTo(User::class, 'id', 'user_id');
    }
}
