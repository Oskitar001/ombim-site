<!DOCTYPE html>
<html>
<head>
    <title>Logs</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
</head>
<body class="p-4">

    <h1 class="mb-4">Logs del sistema</h1>

    <form method="GET" class="mb-4">
        <div class="input-group">
            <input type="text" name="email" class="form-control" placeholder="Filtrar por email Tekla">
            <button class="btn btn-primary">Filtrar</button>
        </div>
    </form>

    <table class="table table-striped">
        <thead>
            <tr>
                <th>Email Tekla</th>
                <th>Acción</th>
                <th>Hardware ID</th>
                <th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($logs as $log)
            <tr>
                <td>{{ $log->email_tekla }}</td>
                <td>{{ $log->accion }}</td>
                <td>{{ $log->hardware_id }}</td>
                <td>{{ $log->created_at }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
