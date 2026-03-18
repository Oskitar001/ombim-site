export default function AdminHome() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bienvenido al panel admin</h2>

      <ul className="list-disc ml-6">
        <li><a className="text-blue-600" href="/admin/licencias">Licencias</a></li>
      </ul>
    </div>
  );
}
