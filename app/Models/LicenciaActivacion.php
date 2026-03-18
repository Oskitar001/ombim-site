<?php

class LicenciaActivacion extends \Illuminate\Database\Eloquent\Model
{
    protected $table = 'licencia_activaciones';
    public $incrementing = false; // UUID
    protected $keyType = 'string';

    protected $fillable = [
        'licencia_id',
        'hardware_id',
        'fecha_activacion'
    ];

    public $timestamps = false;

    public function licencia()
    {
        return $this->belongsTo(Licencia::class, 'licencia_id');
    }
}
