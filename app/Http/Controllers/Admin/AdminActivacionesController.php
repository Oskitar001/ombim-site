<?php

namespace app\Http\Controllers\Admin;

use app\Http\Controllers\Controller;
use app\Models\Licencia;
use app\Models\LicenciaActivacion;

class AdminActivacionesController extends Controller
{
    public function index($id)
    {
        if (!request()->headers->has('x-origin')) {
            abort(403, 'Acceso no permitido');
        }

        $licencia = Licencia::findOrFail($id);
        $activaciones = LicenciaActivacion::where('licencia_id', $id)->get();

        return view('admin.licencias.activaciones', [
            'licencia' => $licencia,
            'activaciones' => $activaciones
        ]);
    }
}
