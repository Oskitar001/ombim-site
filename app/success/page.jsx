export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-4xl font-bold text-green-700 mb-4">¡Pago completado!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Tu compra se ha procesado correctamente. En unos minutos recibirás un email con tus datos de acceso.
      </p>

      <a
        href="/"
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Volver al inicio
      </a>
    </div>
  );
}
