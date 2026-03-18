<!DOCTYPE html>
<html>
<head>
    <title>Panel Admin - Dashboard</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
</head>
<body class="p-4">

    <h1 class="mb-4">Dashboard</h1>

    <div class="row">

        <div class="col-md-3">
            <div class="card text-bg-primary mb-3">
                <div class="card-body">
                    <h5 class="card-title">Licencias totales</h5>
                    <p class="card-text fs-3">{{ $total_licencias }}</p>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card text-bg-success mb-3">
                <div class="card-body">
                    <h5 class="card-title">Licencias activas</h5>
                    <p class="card-text fs-3">{{ $licencias_activas }}</p>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card text-bg-warning mb-3">
                <div class="card-body">
                    <h5 class="card-title">Trials</h5>
                    <p class="card-text fs-3">{{ $licencias_trial }}</p>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card text-bg-dark mb-3">
                <div class="card-body">
                    <h5 class="card-title">Activaciones totales</h5>
                    <p class="card-text fs-3">{{ $activaciones_totales }}</p>
                </div>
            </div>
        </div>

    </div>

    <h3 class="mt-5">Últimos logs</h3>

    <table class="table table-striped mt-3">
        <thead>
            <tr>
                <th>Email Tekla</th>
                <th>Acción</th>
                <th>Hardware ID</th>
                <th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($ultimos_logs as $log)
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
