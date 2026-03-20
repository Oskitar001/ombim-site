export default function Select({ children, className = "", ...props }) {
  return (
    <select
      {...props}
      className={`
        w-full px-4 py-2.5 rounded-xl
        bg-[#f3f4f6]Soft dark:bg-[#242424]Soft
        text-[#1f2937] dark:text-[#e6e6e6]
        border border-[#d1d5db] dark:border-[#3a3a3a]
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
