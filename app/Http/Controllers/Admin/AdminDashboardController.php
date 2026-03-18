<?php

namespace app\Http\Controllers\Admin;

use app\Http\Controllers\Controller;
use app\Models\Licencia;
use app\Models\LicenciaActivacion;
use app\Models\Log;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Seguridad por proxy
        if (!request()->headers->has('x-origin')) {
            abort(403, 'Acceso no permitido');
        }

        return view('admin.dashboard', [
            'total_licencias' => Licencia::count(),
            'licencias_activas' => Licencia::where('estado', 'activa')->count(),
            'licencias_trial' => Licencia::where('estado', 'trial')->count(),
            'activaciones_totales' => LicenciaActivacion::count(),
            'ultimos_logs' => Log::orderBy('created_at', 'desc')->limit(20)->get()
        ]);
    }
}
