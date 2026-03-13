export default function SuccessPage() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4 text-green-600">
        ¡Pago completado!
      </h1>

      <p className="text-lg mb-6">
        Tu licencia ha sido creada correctamente.  
        Revisa tu correo electrónico para ver tus credenciales de acceso.
      </p>

      <a
        href="/cliente"
        className="px-6 py-3 bg-blue-600 text-black rounded text-lg"
      >
        Ir al Panel del Cliente
      </a>
    </div>
  );
}
