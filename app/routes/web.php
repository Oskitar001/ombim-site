use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminLicenciasController;
use App\Http\Controllers\Admin\AdminActivacionesController;
use App\Http\Controllers\Admin\AdminLogsController;

Route::prefix('admin')->group(function () {

    Route::get('/dashboard', [AdminDashboardController::class, 'index']);

    Route::get('/licencias', [AdminLicenciasController::class, 'index']);
    Route::get('/licencias/{id}', [AdminLicenciasController::class, 'show']);
    Route::post('/licencias', [AdminLicenciasController::class, 'store']);
    Route::put('/licencias/{id}', [AdminLicenciasController::class, 'update']);
    Route::delete('/licencias/{id}', [AdminLicenciasController::class, 'destroy']);

    Route::get('/licencias/{id}/activaciones', [AdminActivacionesController::class, 'index']);

    Route::get('/logs', [AdminLogsController::class, 'index']);
});
