<?php

class LicenciaTipo extends \Illuminate\Database\Eloquent\Model
{
    protected $table = 'licencia_tipos';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'nombre',
        'descripcion',
        'created_at'
    ];

    public $timestamps = false;

    public function licencias()
    {
        return $this->hasMany(Licencia::class, 'tipo_id');
    }
}
