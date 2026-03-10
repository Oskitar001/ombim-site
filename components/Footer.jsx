export default function Footer() {
  return (
    <footer className="border-t py-10 text-sm bg-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6">
        <p>© {new Date().getFullYear()} OMBIM. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <a href="mailto:contacto@ombim.com" className="hover:text-brand-700">contacto@ombim.com</a>
          <a href="#" className="hover:text-brand-700">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
