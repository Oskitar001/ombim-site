export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`
        px-4 py-2.5 rounded-xl font-medium
        bg-brand text-white
        hover:bg-brand-dark
        shadow-soft hover:shadow-soft-hover
        transition-all
        ${className}
      `}
    >
      {children}
    </button>
  );
}
