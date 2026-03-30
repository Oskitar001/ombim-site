export default function UserCard({ title, value, icon }) {
  return (
    <div className="
      bg-gray-100 dark:bg-gray-800 
      border border-gray-300 dark:border-gray-700
      rounded-xl shadow p-5
      flex flex-col gap-2
    ">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}