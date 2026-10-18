import React from 'react';
import { RotateCcw, CheckCircle2, ReceiptText, Percent, IndianRupee } from 'lucide-react';
import {
  formatCurrency,
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
  calculateFinalTotal,
  calculateCashChange
} from '../utils/billingUtils';

const BillSummary = ({
  cartItems = [],
  discountType = 'fixed',
  discountValue = 0,
  taxPercent = 0,
  onDiscountTypeChange,
  onDiscountValueChange,
  onTaxPercentChange,
  onClearBill,
  onCheckout,
  isProcessing = false
}) => {
  const subtotal = calculateSubtotal(cartItems);
  const discountAmount = calculateDiscount(subtotal, discountType, discountValue);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = calculateTax(taxableAmount, taxPercent);
  const finalTotal = calculateFinalTotal(subtotal, discountAmount, taxAmount);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

  const hasItems = cartItems.length > 0;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Subtotal Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}
      >
        <span>Subtotal ({totalItemsCount} items)</span>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
          {formatCurrency(subtotal)}
        </span>
      </div>

      {/* Discount Row */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '10px 12px',
          backgroundColor: 'var(--bg-surface-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>Discount:</span>
            <div style={{ display: 'inline-flex', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-medium)' }}>
              <button
                type="button"
                onClick={() => onDiscountTypeChange('fixed')}
                style={{
                  border: 'none',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: discountType === 'fixed' ? 'var(--primary)' : 'var(--bg-surface)',
                  color: discountType === 'fixed' ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                ₹ Fixed
              </button>
              <button
                type="button"
                onClick={() => onDiscountTypeChange('percent')}
                style={{
                  border: 'none',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: discountType === 'percent' ? 'var(--primary)' : 'var(--bg-surface)',
                  color: discountType === 'percent' ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                % Percent
              </button>
            </div>
          </div>

          <span style={{ fontWeight: 700, color: discountAmount > 0 ? 'var(--secondary)' : 'var(--text-muted)', fontSize: '0.9rem' }}>
            {discountAmount > 0 ? `- ${formatCurrency(discountAmount)}` : '₹0.00'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number"
            min="0"
            max={discountType === 'percent' ? 100 : subtotal}
            step="any"
            placeholder={discountType === 'percent' ? 'e.g. 5%' : 'e.g. 20'}
            value={discountValue === 0 ? '' : discountValue}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              onDiscountValueChange(Math.max(0, val));
            }}
            className="form-control"
            style={{ padding: '6px 10px', fontSize: '0.82rem', height: '32px' }}
            disabled={!hasItems}
          />
        </div>
      </div>

      {/* Tax Configuration Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px',
          backgroundColor: 'var(--bg-surface-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Tax Rate (%):
          </span>
          <input
            type="number"
            min="0"
            max="100"
            step="any"
            value={taxPercent === 0 ? '' : taxPercent}
            placeholder="0"
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              onTaxPercentChange(Math.max(0, val));
            }}
            className="form-control"
            style={{ width: '70px', padding: '4px 8px', fontSize: '0.82rem', height: '30px' }}
            disabled={!hasItems}
          />
        </div>

        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
          {formatCurrency(taxAmount)}
        </span>
      </div>

      {/* Final Total Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 16px',
          backgroundColor: 'var(--primary-light)',
          border: '1px solid var(--primary-border)',
          borderRadius: 'var(--radius-lg)',
          marginTop: '4px'
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--primary-active)'
            }}
          >
            Final Payable Total
          </span>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Includes applicable discount & tax
          </div>
        </div>

        <div
          style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: 'var(--primary)',
            letterSpacing: '-0.02em'
          }}
        >
          {formatCurrency(finalTotal)}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
        <button
          type="button"
          onClick={onClearBill}
          disabled={!hasItems || isProcessing}
          className="btn btn-secondary"
          style={{
            flex: '0 0 auto',
            borderColor: 'var(--border-medium)',
            color: 'var(--danger)'
          }}
          title="Clear current bill"
        >
          <RotateCcw size={16} />
          <span>Clear</span>
        </button>

        <button
          type="button"
          onClick={() => onCheckout({ subtotal, discountAmount, taxAmount, finalTotal })}
          disabled={!hasItems || isProcessing}
          className="btn btn-primary btn-lg"
          style={{
            flex: 1,
            fontWeight: 700,
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{isProcessing ? 'Saving...' : 'Proceed to Pay & Bill'}</span>
        </button>
      </div>
    </div>
  );
};

export default BillSummary;
