// /app/api/facturacion/pdf/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { pdf } from "@/lib/pdf"; // ahora SÍ existe

export const runtime = "nodejs";

export async function POST(req) {
  const supabase = await supabaseServer();
  const body = await req.json();

  const pagoId = body.pagoId;
  if (!pagoId) {
    return NextResponse.json({ error: "pagoId_missing" }, { status: 400 });
  }

  // 1. Datos del pago
  const { data: pago } = await supabase
    .from("pagos")
    .select("*")
    .eq("id", pagoId)
    .single();

  if (!pago) {
    return NextResponse.json(
      { error: "pago_no_encontrado" },
      { status: 404 }
    );
  }

  const userId = pago.user_id;

  // 2. Datos de facturación
  const { data: fact } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const f = fact ?? {};

  // 3. Datos del usuario
  const { data: u } = await supabase.auth.admin.getUserById(userId);
  const user = u?.user;

  const nombreUsuario = user?.user_metadata?.nombre ?? "";
  const empresaUsuario = user?.user_metadata?.empresa ?? "";
  const telefonoUsuario = user?.user_metadata?.telefono ?? "";
  const paisUsuario = user?.user_metadata?.pais ?? "";

  // 4. FALLBACKS
  const razonSocial =
    f.nombre?.trim()
      ? f.nombre
      : empresaUsuario?.trim()
      ? empresaUsuario
      : nombreUsuario;

  const niffinal = f.nif ?? "";
  const direccion = f.direccion ?? "";
  const ciudad = f.ciudad ?? "";
  const cp = f.cp ?? "";
  const pais = f.pais ?? paisUsuario;
  const telefono = f.telefono ?? telefonoUsuario;
  const email = user?.email ?? "";

  // 5. PLANTILLA HTML correcta (sin entidades escapadas)
  const html = `
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      color: #333;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #0A84FF;
      padding-bottom: 20px;
    }
    .logo {
      font-size: 26px;
      font-weight: bold;
      color: #0A84FF;
    }
    .company-info {
      text-align: right;
      font-size: 14px;
      color: #555;
    }
    h1 {
      text-align: center;
      margin-top: 40px;
      font-size: 28px;
      color: #0A84FF;
    }
    .section-title {
      font-weight: bold;
      font-size: 18px;
      margin-top: 35px;
      color: #0A84FF;
    }
    table {
      width: 100%;
      margin-top: 10px;
      border-collapse: collapse;
    }
    td {
      padding: 6px 0;
    }
    .factura-table {
      margin-top: 20px;
      border: 1px solid #ddd;
    }
    .factura-table th {
      background: #0A84FF;
      color: white;
      padding: 12px;
      text-align: left;
      font-size: 14px;
    }
    .factura-table td {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .total {
      font-size: 20px;
      font-weight: bold;
      margin-top: 25px;
      text-align: right;
    }
    .footer {
      margin-top: 40px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
  </style>
</head>

<body>

  <div class="header">
    <div class="logo">OMBIM</div>
    <div class="company-info">
      OMBIM<br>
      info@ombim.com<br>
      https://ombim.com<br>
    </div>
  </div>

  <h1>Factura</h1>

  <div class="section-title">Datos de facturación</div>
  <table>
    <tr><td><b>Razón social:</b></td><td>${razonSocial}</td></tr>
    <tr><td><b>NIF / CIF:</b></td><td>${niffinal}</td></tr>
    <tr><td><b>Dirección:</b></td><td>${direccion}</td></tr>
    <tr><td><b>Ciudad:</b></td><td>${ciudad}</td></tr>
    <tr><td><b>CP:</b></td><td>${cp}</td></tr>
    <tr><td><b>País:</b></td><td>${pais}</td></tr>
    <tr><td><b>Teléfono:</b></td><td>${telefono}</td></tr>
    <tr><td><b>Email:</b></td><td>${email}</td></tr>
  </table>

  <div class="section-title">Detalles de la factura</div>

  <table class="factura-table">
    <tr>
      <th>Concepto</th>
      <th>Precio</th>
    </tr>
    <tr>
      <td>${pago.producto}</td>
      <td>${pago.precio} €</td>
    </tr>
  </table>

  <div class="total">
    Total: ${pago.precio} €
  </div>

  <div class="footer">
    Esta factura ha sido generada automáticamente.<br>
    Para cualquier duda contacte con soporte: info@ombim.com
  </div>

</body>
</html>
`;

  // 6. GENERAR PDF
  const pdfBuffer = await pdf(html);

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="factura-${pago.id}.pdf"`,
    },
  });
}