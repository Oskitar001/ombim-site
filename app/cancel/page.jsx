export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-4xl font-bold text-red-700 mb-4">Pago cancelado</h1>
      <p className="text-lg text-gray-700 mb-6">
        Parece que cancelaste el proceso de pago. Puedes intentarlo de nuevo cuando quieras.
      </p>

      <a
        href="/"
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Volver al inicio
      </a>
    </div>
  );
}
