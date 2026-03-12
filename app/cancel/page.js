export default function CancelPage() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4 text-red-600">
        Pago cancelado
      </h1>

      <p className="text-lg mb-6">
        No se ha realizado ningún cargo.  
        Puedes volver a intentarlo cuando quieras.
      </p>

      <a
        href="/comprar"
        className="px-6 py-3 bg-blue-600 text-white rounded text-lg"
      >
        Volver a intentar
      </a>
    </div>
  );
}
