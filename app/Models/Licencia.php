<?php

class Licencia extends \Illuminate\Database\Eloquent\Model
{
    protected $table = 'licencias';
    public $incrementing = false; // porque usas UUID
    protected $keyType = 'string';

    protected $fillable = [
        'email_tekla',
        'plugin_id',
        'tipo_id',
        'estado',
        'max_activaciones',
        'activaciones_usadas',
        'fecha_expiracion',
        'notas'
    ];

    public $timestamps = false; // tu tabla usa fecha_creacion, no created_at

    // Relación con tipo de licencia
    public function tipo()
    {
        return $this->belongsTo(LicenciaTipo::class, 'tipo_id');
    }

    // Relación con activaciones
    public function activaciones()
    {
        return $this->hasMany(LicenciaActivacion::class, 'licencia_id');
    }
}
