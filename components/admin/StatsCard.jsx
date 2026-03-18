export default function StatsCard({ title, value }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h4 className="text-gray-600 text-sm">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
