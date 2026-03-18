<?php

namespace app\Http\Controllers\Admin;

use app\Http\Controllers\Controller;
use app\Models\Licencia;
use Illuminate\Http\Request;

class AdminLicenciasController extends Controller
{
    public function index()
    {
        if (!request()->headers->has('x-origin')) {
            abort(403, 'Acceso no permitido');
        }

        $licencias = Licencia::orderBy('fecha_creacion', 'desc')->get();

        return view('admin.licencias.index', compact('licencias'));
    }

    public function show($id)
    {
        if (!request()->headers->has('x-origin')) {
            abort(403, 'Acceso no permitido');
        }

        $licencia = Licencia::with('activaciones', 'tipo')->findOrFail($id);

        return view('admin.licencias.show', compact('licencia'));
    }

    public function store(Request $request)
    {
        if (!request()->headers->has('x-origin')) {
            abort(403, 'Acceso no permitido');
        }

        $lic = Licencia::create($request->all());

        return redirect('/admin/licencias/' . $lic->id);
    }

    public function update(Request $request, $id)
    {
        if (!request()->headers->has('x-origin')) {
            abort(403, 'Acceso no permitido');
        }

        $lic = Licencia::findOrFail($id);
        $lic->update($request->all());

        return redirect('/admin/licencias/' . $lic->id);
    }

    public function destroy($id)
    {
        if (!request()->headers->has('x-origin')) {
            abort(403, 'Acceso no permitido');
        }

        Licencia::findOrFail($id)->delete();

        return redirect('/admin/licencias');
    }
}
