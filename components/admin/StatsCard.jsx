export default function StatsCard({ title, value }) {
  return (
    <div className="bg-[#f3f4f6]Soft shadow rounded p-4">
      <h4 className="text-[#1f2937] text-sm">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
