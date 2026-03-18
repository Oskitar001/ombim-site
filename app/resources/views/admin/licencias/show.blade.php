<!DOCTYPE html>
<html>
<head>
    <title>Detalle Licencia</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
</head>
<body class="p-4">

    <h1 class="mb-4">Licencia de {{ $licencia->email_tekla }}</h1>

    <div class="card mb-4">
        <div class="card-body">
            <p><strong>Plugin:</strong> {{ $licencia->plugin_id }}</p>
            <p><strong>Estado:</strong> {{ $licencia->estado }}</p>
            <p><strong>Tipo:</strong> {{ $licencia->tipo->nombre ?? 'N/A' }}</p>
            <p><strong>Expira:</strong> {{ $licencia->fecha_expiracion }}</p>
            <p><strong>Notas:</strong> {{ $licencia->notas }}</p>
        </div>
    </div>

    <h3>Activaciones</h3>

    <table class="table table-striped">
        <thead>
            <tr>
                <th>Hardware ID</th>
                <th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($licencia->activaciones as $act)
            <tr>
                <td>{{ $act->hardware_id }}</td>
                <td>{{ $act->fecha_activacion }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
