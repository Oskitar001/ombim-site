<?php

class Log extends \Illuminate\Database\Eloquent\Model
{
    protected $table = 'logs';
    public $incrementing = false; // UUID
    protected $keyType = 'string';

    protected $fillable = [
        'email_tekla',
        'plugin_id',
        'accion',
        'hardware_id',
        'created_at'
    ];

    public $timestamps = false;
}
