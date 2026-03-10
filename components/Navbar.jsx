"use client";
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navItems = [
    { href: '#servicios', label: 'Servicios' },
    { href: '#proyectos', label: 'Proyectos' },
    { href: '#contacto',  label: 'Contacto'  },
  ]
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
          <Image src="/logo-ombim.png" alt="Logo OMBIM" width={80} height={80} priority className="h-10 w-auto" />
          <span className="select-none">OMBIM</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navItems.map(i => (
            <a key={i.href} href={i.href} className="hover:text-brand-600">{i.label}</a>
          ))}
          <a href="#contacto" className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">Solicitar presupuesto</a>
        </nav>
        <button onClick={() => setOpen(v=>!v)} aria-label="Abrir menú" className="inline-flex items-center justify-center rounded-md p-2 md:hidden">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            {open ? (<path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />) : (<path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />)}
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t bg-white md:hidden">
          <nav className="container mx-auto flex flex-col gap-2 px-6 py-4">
            {navItems.map(i => (
              <a key={i.href} href={i.href} className="rounded-lg px-3 py-2 hover:bg-gray-100" onClick={()=>setOpen(false)}>{i.label}</a>
            ))}
            <a href="#contacto" className="rounded-lg bg-brand-600 px-3 py-2 text-white hover:bg-brand-700" onClick={()=>setOpen(false)}>Solicitar presupuesto</a>
          </nav>
        </div>
      )}
    </header>
  )
}
