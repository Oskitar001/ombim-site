<!DOCTYPE html>
<html>
<head>
    <title>Licencias</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
</head>
<body class="p-4">

    <h1 class="mb-4">Licencias</h1>

    <table class="table table-bordered table-striped">
        <thead>
            <tr>
                <th>Email Tekla</th>
                <th>Plugin</th>
                <th>Estado</th>
                <th>Expira</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($licencias as $lic)
            <tr>
                <td>{{ $lic->email_tekla }}</td>
                <td>{{ $lic->plugin_id }}</td>
                <td>{{ $lic->estado }}</td>
                <td>{{ $lic->fecha_expiracion }}</td>
                <td>
                    <a href="/admin/licencias/{{ $lic->id }}" class="btn btn-sm btn-primary">Ver</a>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
