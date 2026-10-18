import React from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { formatCurrency, calculateLineTotal } from '../utils/billingUtils';

const Cart = ({
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem
}) => {
  const totalItemCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

  if (cartItems.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-medium)',
          minHeight: '260px'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}
        >
          <ShoppingBag size={28} />
        </div>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          No items in bill yet
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '240px' }}>
          Select food items from the menu to add them to the customer's bill.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxHeight: '360px',
        overflowY: 'auto',
        paddingRight: '4px'
      }}
      className="cart-items-scroll"
    >
      {cartItems.map((item) => {
        const lineTotal = calculateLineTotal(item.price, item.quantity);

        return (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              gap: '12px'
            }}
          >
            {/* Item Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={item.name}
              >
                {item.name}
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '2px'
                }}
              >
                <span>{formatCurrency(item.price)} each</span>
                <span>•</span>
                <span className="badge badge-neutral" style={{ padding: '1px 6px', fontSize: '0.68rem' }}>
                  {item.category}
                </span>
              </div>
            </div>

            {/* Stepper (+ / -) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden'
              }}
            >
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                style={{
                  width: '28px',
                  height: '28px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>

              <span
                style={{
                  minWidth: '28px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)'
                }}
              >
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                style={{
                  width: '28px',
                  height: '28px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Line Total & Remove */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'right'
              }}
            >
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  minWidth: '65px'
                }}
              >
                {formatCurrency(lineTotal)}
              </div>

              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                className="btn btn-danger-outline btn-icon"
                style={{
                  padding: '5px',
                  borderRadius: 'var(--radius-sm)'
                }}
                aria-label={`Remove ${item.name}`}
                title="Remove item"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cart;
