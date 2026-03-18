<?php

namespace app\Http\Controllers\Admin;

use app\Http\Controllers\Controller;
use app\Models\Log;

class AdminLogsController extends Controller
{
    public function index()
    {
        // Seguridad por proxy
        if (!request()->headers->has('x-origin')) {
            abort(403, 'Acceso no permitido');
        }

        // Construimos la query
        $query = Log::orderBy('created_at', 'desc');

        // Filtro opcional por email Tekla
        if (request()->has('email') && request('email') !== '') {
            $query->where('email_tekla', request('email'));
        }

        // Obtenemos los logs
        $logs = $query->limit(200)->get();

        // Devolvemos la vista con los datos
        return view('admin.logs.index', [
            'logs' => $logs
        ]);
    }
}
