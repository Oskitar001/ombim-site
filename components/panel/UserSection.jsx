export default function UserSection({ title, children }) {
  return (
    <div className="
      bg-white dark:bg-gray-900 
      border border-gray-300 dark:border-gray-700
      rounded-xl shadow p-6 space-y-4
    ">
      {title && (
        <h2 className="text-xl font-bold border-b border-gray-300 dark:border-gray-700 pb-2">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}