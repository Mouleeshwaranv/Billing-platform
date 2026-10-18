import React, { useState } from 'react';
import { Printer, Check, Copy } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/billingUtils';

const Receipt = ({ bill, settings, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [paperWidth, setPaperWidth] = useState(settings?.paperWidth || '80mm');

  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyBill = () => {
    const text = `
========================================
       ${settings?.shopName || 'Food Court'}
${settings?.shopAddress || ''}
Phone: ${settings?.shopPhone || ''}
GST: ${settings?.gstNumber || 'N/A'}
========================================
Bill No: ${bill.billNumber}
Date: ${formatDateTime(bill.createdAt)}
Payment: ${bill.paymentMethod}
----------------------------------------
ITEM                 QTY  PRICE   TOTAL
----------------------------------------
${(bill.items || [])
  .map(
    (i) =>
      `${i.name.slice(0, 18).padEnd(18)} ${String(i.quantity).padStart(2)} ${String(i.price).padStart(5)} ${String(i.quantity * i.price).padStart(7)}`
  )
  .join('\n')}
----------------------------------------
Subtotal:            ${formatCurrency(bill.subtotal)}
Discount:            ${formatCurrency(bill.discountAmount || 0)}
Tax (${bill.taxPercent || 0}%):          ${formatCurrency(bill.taxAmount || 0)}
========================================
GRAND TOTAL:         ${formatCurrency(bill.finalAmount)}
========================================
${bill.paymentMethod === 'Cash' ? `Cash Received:       ${formatCurrency(bill.amountReceived || bill.finalAmount)}\nChange Returned:     ${formatCurrency(bill.changeDue || 0)}\n` : ''}
${settings?.receiptFooter || 'Thank you! Visit again.'}
========================================
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Controls Toolbar (Hidden in Print) */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '10px 14px',
          backgroundColor: 'var(--bg-surface-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Format:</span>
          <button
            type="button"
            onClick={() => setPaperWidth('80mm')}
            className={`btn btn-sm ${paperWidth === '80mm' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
          >
            80mm Standard
          </button>
          <button
            type="button"
            onClick={() => setPaperWidth('58mm')}
            className={`btn btn-sm ${paperWidth === '58mm' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
          >
            58mm Compact
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleCopyBill}
            className="btn btn-secondary btn-sm"
            title="Copy formatted text to clipboard"
          >
            {copied ? <Check size={14} color="var(--secondary)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: 700 }}
          >
            <Printer size={15} />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Printable Receipt Paper Container */}
      <div className="receipt-printable-area" style={{ overflowX: 'auto', padding: '10px 0' }}>
        <div className={`receipt-paper width-${paperWidth}`}>
          {/* Header */}
          <div className="receipt-header">
            <h3>{settings?.shopName || 'Annapoorna Grand Food Court'}</h3>
            <p>{settings?.shopAddress || '42, Temple Road, Madurai'}</p>
            <p>Phone: {settings?.shopPhone || '+91 98765 43210'}</p>
            {settings?.gstNumber && <p>GSTIN: {settings.gstNumber}</p>}
            <p style={{ marginTop: '4px', fontWeight: 600 }}>TAX INVOICE / CASH BILL</p>
          </div>

          {/* Meta Info */}
          <div className="receipt-meta">
            <div className="receipt-meta-row">
              <span>Bill No: <strong>{bill.billNumber}</strong></span>
              <span>{bill.paymentMethod}</span>
            </div>
            <div className="receipt-meta-row" style={{ marginTop: '2px' }}>
              <span>Date: {formatDateTime(bill.createdAt)}</span>
              <span>Counter: {bill.cashier || 'Counter 1'}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="receipt-items-table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Item</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Qty</th>
                <th style={{ width: '20%' }} className="text-right">Price</th>
                <th style={{ width: '20%' }} className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {(bill.items || []).map((item, index) => {
                const total = item.quantity * item.price;
                return (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td className="text-right">{formatCurrency(item.price)}</td>
                    <td className="text-right">{formatCurrency(total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals Section */}
          <div className="receipt-totals">
            <div className="receipt-totals-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(bill.subtotal)}</span>
            </div>

            {bill.discountAmount > 0 && (
              <div className="receipt-totals-row" style={{ color: '#047857' }}>
                <span>Discount ({bill.discountType === 'percent' ? `${bill.discountValue}%` : 'Fixed'}):</span>
                <span>-{formatCurrency(bill.discountAmount)}</span>
              </div>
            )}

            {bill.taxAmount > 0 && (
              <div className="receipt-totals-row">
                <span>Tax ({bill.taxPercent}%):</span>
                <span>+{formatCurrency(bill.taxAmount)}</span>
              </div>
            )}

            <div className="receipt-totals-row grand-total">
              <span>GRAND TOTAL:</span>
              <span>{formatCurrency(bill.finalAmount)}</span>
            </div>

            {bill.paymentMethod === 'Cash' && (
              <>
                <div className="receipt-totals-row">
                  <span>Cash Tendered:</span>
                  <span>{formatCurrency(bill.amountReceived || bill.finalAmount)}</span>
                </div>
                <div className="receipt-totals-row">
                  <span>Change Returned:</span>
                  <span>{formatCurrency(bill.changeDue || 0)}</span>
                </div>
              </>
            )}

            {bill.paymentMethod !== 'Cash' && (
              <div className="receipt-totals-row" style={{ fontSize: '10px', fontStyle: 'italic', marginTop: '2px' }}>
                <span>Payment Status:</span>
                <span>Authorized ({bill.paymentMethod})</span>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="receipt-footer">
            <p style={{ fontWeight: 600 }}>{settings?.receiptFooter || 'Thank you for your visit!'}</p>
            <p style={{ fontSize: '10px', marginTop: '3px', color: '#6b7280' }}>
              *** Demo Receipt - Software POS ***
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
