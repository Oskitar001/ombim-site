export default function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`
        w-full px-3 py-2 rounded-lg
        bg-[#f3f4f6]Soft dark:bg-[#242424]Soft
        text-[#1f2937] dark:text-[#e6e6e6]
        border border-[#d1d5db] dark:border-[#3a3a3a]
        focus:outline-none focus:ring-2 focus:ring-brand
        transition
        ${className}
      `}
    />
  );
}
