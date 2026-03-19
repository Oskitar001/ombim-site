export default function Select({ children, className = "", ...props }) {
  return (
    <select
      {...props}
      className={`
        w-full px-4 py-2.5 rounded-xl
        bg-light-bgSoft dark:bg-dark-bgSoft
        text-light-text dark:text-dark-text
        border border-light-border dark:border-dark-border
        shadow-sm
        hover:border-brand
        focus:outline-none focus:ring-2 focus:ring-brand
        transition-all
        ${className}
      `}
    >
      {children}
    </select>
  );
}
