import { NextRequest, NextResponse } from 'next/server';
import { MOCK_INVOICES, formatCurrency, formatDate } from '@/lib/mockData';

/**
 * GET /api/invoices/[id]/pdf
 *
 * Generates a PDF for the given invoice.
 * Uses @react-pdf/renderer when available; falls back to plain text.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const invoice = MOCK_INVOICES.find((i) => i.id === params.id);

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  try {
    // Try to use @react-pdf/renderer for real PDF generation
    const { Document, Page, Text, View, StyleSheet, renderToBuffer, Font } =
      await import('@react-pdf/renderer');
    const React = await import('react');

    const styles = StyleSheet.create({
      page:    { padding: 48, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
      header:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
      title:   { fontSize: 28, fontWeight: 'bold', color: '#1E3A5F' },
      label:   { fontSize: 9, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
      value:   { fontSize: 12, color: '#1E293B', fontWeight: 'bold' },
      divider: { borderBottom: 1, borderBottomColor: '#E2E8F0', marginVertical: 16 },
      row:     { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
      total:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, backgroundColor: '#F1F5F9', padding: 12, borderRadius: 6 },
      badge:   { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, fontSize: 10, fontWeight: 'bold' },
      footer:  { position: 'absolute', bottom: 32, left: 48, right: 48, textAlign: 'center', fontSize: 9, color: '#94A3B8' },
    });

    const statusColors: Record<string, string> = {
      Paid:    '#10B981',
      Pending: '#F59E0B',
      Overdue: '#EF4444',
    };

    const InvoiceDoc = React.createElement(
      Document,
      null,
      React.createElement(
        Page,
        { size: 'A4', style: styles.page },
        // Header
        React.createElement(
          View,
          { style: styles.header },
          React.createElement(
            View,
            null,
            React.createElement(Text, { style: styles.title }, 'VaultPay'),
            React.createElement(Text, { style: { fontSize: 10, color: '#64748B', marginTop: 2 } }, 'Financial Core'),
          ),
          React.createElement(
            View,
            { style: { alignItems: 'flex-end' } },
            React.createElement(Text, { style: { fontSize: 20, fontWeight: 'bold', color: '#1E3A5F' } }, 'INVOICE'),
            React.createElement(Text, { style: { fontSize: 12, color: '#2563EB', marginTop: 4, fontWeight: 'bold' } }, invoice.invoiceNumber),
          ),
        ),
        // Status
        React.createElement(
          View,
          { style: { backgroundColor: statusColors[invoice.status] + '20', padding: 8, borderRadius: 6, marginBottom: 24, borderLeft: `3px solid ${statusColors[invoice.status]}` } },
          React.createElement(Text, { style: { fontSize: 11, color: statusColors[invoice.status], fontWeight: 'bold' } }, `STATUS: ${invoice.status.toUpperCase()}`),
        ),
        // Bill to
        React.createElement(View, { style: styles.divider }),
        React.createElement(Text, { style: styles.label }, 'BILL TO'),
        React.createElement(Text, { style: { ...styles.value, marginBottom: 2 } }, invoice.clientName),
        React.createElement(Text, { style: { fontSize: 11, color: '#64748B', marginBottom: 16 } }, invoice.clientEmail),
        // Dates
        React.createElement(
          View,
          { style: { flexDirection: 'row', gap: 32, marginBottom: 24 } },
          React.createElement(
            View,
            null,
            React.createElement(Text, { style: styles.label }, 'INVOICE DATE'),
            React.createElement(Text, { style: styles.value }, formatDate(invoice.createdAt)),
          ),
          React.createElement(
            View,
            null,
            React.createElement(Text, { style: styles.label }, 'DUE DATE'),
            React.createElement(Text, { style: { ...styles.value, color: invoice.status === 'Overdue' ? '#EF4444' : '#1E293B' } }, formatDate(invoice.dueDate)),
          ),
        ),
        // Line items
        React.createElement(View, { style: styles.divider }),
        React.createElement(Text, { style: { ...styles.label, marginBottom: 8 } }, 'SERVICES'),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, { style: { fontSize: 11, color: '#1E293B', flex: 1 } }, invoice.description ?? 'Professional Services'),
          React.createElement(Text, { style: { fontSize: 11, fontWeight: 'bold', color: '#1E293B' } }, formatCurrency(invoice.amount)),
        ),
        React.createElement(View, { style: styles.divider }),
        // Total
        React.createElement(
          View,
          { style: styles.total },
          React.createElement(Text, { style: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' } }, 'TOTAL DUE'),
          React.createElement(Text, { style: { fontSize: 18, fontWeight: 'bold', color: '#2563EB' } }, formatCurrency(invoice.amount)),
        ),
        // Footer
        React.createElement(
          View,
          { style: styles.footer },
          React.createElement(Text, null, 'VaultPay Financial Core · Secured by 256-bit TLS · PCI DSS Compliant'),
          React.createElement(Text, { style: { marginTop: 4 } }, `Generated on ${new Date().toLocaleDateString()}`),
        ),
      )
    );

    const buffer = await renderToBuffer(InvoiceDoc as any);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
        'Content-Length':      String(buffer.length),
        'Cache-Control':       'no-store',
      },
    });
  } catch (err) {
    // Fallback: plain text invoice
    const text = `
VAULTPAY FINANCIAL CORE
======================

Invoice Number: ${invoice.invoiceNumber}
Status:         ${invoice.status}
Date Issued:    ${formatDate(invoice.createdAt)}
Due Date:       ${formatDate(invoice.dueDate)}

BILL TO:
${invoice.clientName}
${invoice.clientEmail}

DESCRIPTION:
${invoice.description ?? 'Professional Services'}

AMOUNT DUE: ${formatCurrency(invoice.amount)}

---
VaultPay Financial Core · Secured by 256-bit TLS
PCI DSS Compliant · Generated ${new Date().toISOString()}
    `.trim();

    return new NextResponse(text, {
      status: 200,
      headers: {
        'Content-Type':        'text/plain',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.txt"`,
      },
    });
  }
}
