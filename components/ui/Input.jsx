export default function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`
        w-full px-3 py-2 rounded-lg
        bg-white dark:bg-dark-bgSoft
        text-gray-900 dark:text-dark-text
        border border-light-border dark:border-dark-border
        focus:outline-none focus:ring-2 focus:ring-brand
        transition
        ${className}
      `}
    />
  );
}
