// Generador de nota de venta según estándares mexicanos
// No es CFDI — es una nota de venta informativa

import { IVA_RATE } from "@/lib/constants";

interface TicketItem {
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface TicketData {
  folio: string;
  fecha: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_tel?: string;
  items: TicketItem[];
  subtotal: number;
  iva: number;
  total: number;
  nota?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function calcularTotales(items: TicketItem[]) {
  // El precio ya incluye IVA — calcular hacia atrás
  const total = items.reduce((sum, i) => sum + i.subtotal, 0);
  const subtotal = Math.round((total / (1 + IVA_RATE)) * 100) / 100;
  const iva = Math.round((total - subtotal) * 100) / 100;
  return { subtotal, iva, total };
}

export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(precio);
}

export function generarNotaDeVenta(data: TicketData): string {
  const itemsHtml = data.items
    .map(
      (item, i) => `
    <tr>
      <td style="padding: 10px 8px; border-bottom: 1px solid #EDE6D6; font-size: 13px; color: #2A2118;">${i + 1}</td>
      <td style="padding: 10px 8px; border-bottom: 1px solid #EDE6D6; font-size: 13px; color: #2A2118;">${escapeHtml(item.nombre)}</td>
      <td style="padding: 10px 8px; border-bottom: 1px solid #EDE6D6; font-size: 13px; color: #2A2118; text-align: center;">${item.cantidad}</td>
      <td style="padding: 10px 8px; border-bottom: 1px solid #EDE6D6; font-size: 13px; color: #2A2118; text-align: right;">${formatearPrecio(item.precio_unitario)}</td>
      <td style="padding: 10px 8px; border-bottom: 1px solid #EDE6D6; font-size: 13px; color: #2A2118; text-align: right; font-weight: 500;">${formatearPrecio(item.subtotal)}</td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nota de Venta ${data.folio} — LOMEI HOME</title>
  <style>
    @media print {
      @page {
        size: A4 portrait;
        margin: 15mm;
      }
      body {
        background-color: #fff !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .ticket-container {
        max-width: 100% !important;
        border: none !important;
      }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F0E8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <div class="ticket-container" style="max-width: 600px; margin: 0 auto; background-color: #FAFAF7; border: 1px solid #EDE6D6;">

    <!-- Header -->
    <div style="background-color: #2A2118; padding: 30px 32px; text-align: center;">
      <h1 style="margin: 0; font-size: 20px; letter-spacing: 0.15em; color: #FAFAF7; font-weight: 300;">
        LOMEI HOME
      </h1>
      <p class="ticket-header-sub" style="margin: 4px 0 0; font-size: 9px; letter-spacing: 0.25em; color: #B5A898; text-transform: uppercase;">
        Arquitectura e Interiorismo
      </p>
    </div>

    <!-- Nota de venta header -->
    <div style="padding: 24px 32px; border-bottom: 1px solid #EDE6D6;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <h2 style="margin: 0; font-size: 16px; letter-spacing: 0.1em; color: #2A2118; font-weight: 400; text-transform: uppercase;">
              Nota de Venta
            </h2>
          </td>
          <td style="text-align: right;">
            <p class="ticket-folio" style="margin: 0; font-size: 12px; color: #A0845C; font-weight: 500;">
              Folio: ${data.folio}
            </p>
          </td>
        </tr>
      </table>
    </div>

    <!-- Datos del emisor y receptor -->
    <div style="padding: 20px 32px; border-bottom: 1px solid #EDE6D6;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="vertical-align: top; width: 50%;">
            <p class="ticket-section-label" style="margin: 0 0 2px; font-size: 9px; letter-spacing: 0.2em; color: #B5A898; text-transform: uppercase;">Emisor</p>
            <p class="ticket-emisor-name" style="margin: 0; font-size: 12px; color: #2A2118; font-weight: 500;">LOMEI HOME</p>
            <p class="ticket-emisor-detail" style="margin: 2px 0 0; font-size: 11px; color: #B5A898;">Querétaro, Qro., México</p>
            <p class="ticket-emisor-detail" style="margin: 2px 0 0; font-size: 11px; color: #B5A898;">Tel: 442 487 4466</p>
            <p class="ticket-emisor-detail" style="margin: 2px 0 0; font-size: 11px; color: #B5A898;">contacto@lomeihome.com</p>
          </td>
          <td style="vertical-align: top; width: 50%; text-align: right;">
            <p class="ticket-section-label" style="margin: 0 0 2px; font-size: 9px; letter-spacing: 0.2em; color: #B5A898; text-transform: uppercase;">Cliente</p>
            <p class="ticket-cliente-name" style="margin: 0; font-size: 12px; color: #2A2118; font-weight: 500;">${escapeHtml(data.cliente_nombre)}</p>
            <p class="ticket-cliente-detail" style="margin: 2px 0 0; font-size: 11px; color: #B5A898;">${escapeHtml(data.cliente_email || "")}</p>
            ${data.cliente_tel ? `<p class="ticket-cliente-detail" style="margin: 2px 0 0; font-size: 11px; color: #B5A898;">Tel: ${escapeHtml(data.cliente_tel)}</p>` : ""}
            <p class="ticket-cliente-detail" style="margin: 6px 0 0; font-size: 11px; color: #B5A898;">Fecha: ${data.fecha}</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- Tabla de productos -->
    <div style="padding: 20px 32px;">
      <table class="ticket-table" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #D4C4A0;">
            <th style="padding: 8px; font-size: 9px; letter-spacing: 0.15em; color: #B5A898; text-transform: uppercase; font-weight: 400; text-align: left;">#</th>
            <th style="padding: 8px; font-size: 9px; letter-spacing: 0.15em; color: #B5A898; text-transform: uppercase; font-weight: 400; text-align: left;">Producto</th>
            <th style="padding: 8px; font-size: 9px; letter-spacing: 0.15em; color: #B5A898; text-transform: uppercase; font-weight: 400; text-align: center;">Cant.</th>
            <th style="padding: 8px; font-size: 9px; letter-spacing: 0.15em; color: #B5A898; text-transform: uppercase; font-weight: 400; text-align: right;">P. Unit.</th>
            <th style="padding: 8px; font-size: 9px; letter-spacing: 0.15em; color: #B5A898; text-transform: uppercase; font-weight: 400; text-align: right;">Importe</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </div>

    <!-- Totales -->
    <div style="padding: 0 32px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width: 60%;"></td>
          <td style="width: 40%;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="ticket-totals-label" style="padding: 6px 0; font-size: 12px; color: #B5A898;">Subtotal</td>
                <td class="ticket-totals-value" style="padding: 6px 0; font-size: 12px; color: #2A2118; text-align: right;">${formatearPrecio(data.subtotal)}</td>
              </tr>
              <tr>
                <td class="ticket-totals-label" style="padding: 6px 0; font-size: 12px; color: #B5A898;">IVA (16%)</td>
                <td class="ticket-totals-value" style="padding: 6px 0; font-size: 12px; color: #2A2118; text-align: right;">${formatearPrecio(data.iva)}</td>
              </tr>
              <tr style="border-top: 2px solid #D4C4A0;">
                <td class="ticket-total-final-label" style="padding: 10px 0; font-size: 14px; color: #2A2118; font-weight: 500;">Total MXN</td>
                <td class="ticket-total-final-value" style="padding: 10px 0; font-size: 16px; color: #A0845C; text-align: right; font-weight: 500;">${formatearPrecio(data.total)}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>

    ${data.nota ? `
    <!-- Notas -->
    <div style="padding: 0 32px 20px;">
      <p class="ticket-nota-label" style="margin: 0 0 4px; font-size: 9px; letter-spacing: 0.2em; color: #B5A898; text-transform: uppercase;">Notas</p>
      <p class="ticket-nota-text" style="margin: 0; font-size: 12px; color: #2A2118;">${escapeHtml(data.nota || "")}</p>
    </div>
    ` : ""}

    <!-- Aviso fiscal -->
    <div style="padding: 16px 32px; background-color: #EDE6D6; border-top: 1px solid #D4C4A0;">
      <p class="ticket-aviso" style="margin: 0; font-size: 10px; color: #B5A898; text-align: center; line-height: 1.5;">
        Este documento es una nota de venta informativa y <strong>no es un Comprobante Fiscal Digital por Internet (CFDI)</strong>.<br>
        Si requiere factura, solicítela a contacto@lomeihome.com dentro de los 30 días posteriores a la compra.
      </p>
    </div>

    <!-- Footer -->
    <div class="ticket-footer" style="padding: 20px 32px; text-align: center;">
      <p style="margin: 0; font-size: 10px; letter-spacing: 0.15em; color: #B5A898;">
        LOMEI HOME — Arquitectura e Interiorismo
      </p>
      <p style="margin: 4px 0 0; font-size: 10px; color: #D4C4A0;">
        Querétaro, Qro., México · @lomeihome
      </p>
    </div>

  </div>
</body>
</html>`;
}
