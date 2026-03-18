# OMBIM – Landing (Next.js 14 + Tailwind) [FINAL]

Este proyecto incluye:
- Next.js app Router
- Tailwind + PostCSS configurados
- Componentes: Navbar, Hero, Services, Projects, Contact, Footer
- API `/api/contact` con Nodemailer (SMTP)

## Desarrollo
```bash
npm install
npm run dev
# http://localhost:3000
```

## Build
```bash
npm run build && npm start
```

## Variables de entorno (Vercel → Project → Settings → Environment Variables)
- SMTP_HOST (p.ej., smtp.office365.com)
- SMTP_PORT (p.ej., 587)
- SMTP_SECURE ("false" para STARTTLS en 587)
- SMTP_USER (cuenta remitente)
- SMTP_PASS (contraseña/app password)
- MAIL_FROM (p.ej., "OMBIM <o.martinez@ombim.com>")
- MAIL_TO (destinatario final)
