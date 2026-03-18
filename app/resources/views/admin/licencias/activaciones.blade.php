<!DOCTYPE html>
<html>
<head>
    <title>Activaciones de Licencia</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
</head>
<body class="p-4">

    <h1 class="mb-4">Activaciones de {{ $licencia->email_tekla }}</h1>

    <div class="card mb-4">
        <div class="card-body">
            <p><strong>Plugin:</strong> {{ $licencia->plugin_id }}</p>
            <p><strong>Estado:</strong> {{ $licencia->estado }}</p>
            <p><strong>Tipo:</strong> {{ $licencia->tipo->nombre ?? 'N/A' }}</p>
            <p><strong>Expira:</strong> {{ $licencia->fecha_expiracion }}</p>
        </div>
    </div>

    <h3>Lista de activaciones</h3>

    <table class="table table-striped">
        <thead>
            <tr>
                <th>Hardware ID</th>
                <th>Fecha de activación</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($activaciones as $act)
            <tr>
                <td>{{ $act->hardware_id }}</td>
                <td>{{ $act->fecha_activacion }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <a href="/admin/licencias/{{ $licencia->id }}" class="btn btn-secondary mt-3">Volver</a>

</body>
</html>
