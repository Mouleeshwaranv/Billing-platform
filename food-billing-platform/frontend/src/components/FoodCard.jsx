import React, { useState } from 'react';
import { Plus, Check, UtensilsCrossed, Clock } from 'lucide-react';
import { formatCurrency } from '../utils/billingUtils';

const FoodCard = ({ item, onAddToCart, cartQuantity = 0 }) => {
  const [imageError, setImageError] = useState(false);

  const isAvailable = item.isAvailable !== false;

  return (
    <div
      className="card food-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: 'var(--bg-surface)',
        border: cartQuantity > 0
          ? '2px solid var(--primary)'
          : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'all 0.18s ease-in-out',
        cursor: isAvailable ? 'pointer' : 'not-allowed',
        opacity: isAvailable ? 1 : 0.65
      }}
      onClick={() => {
        if (isAvailable && onAddToCart) {
          onAddToCart(item);
        }
      }}
    >
      {/* Food Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '60%', // 16:9ish aspect ratio
          backgroundColor: 'var(--bg-muted)',
          overflow: 'hidden'
        }}
      >
        {!imageError && item.image ? (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImageError(true)}
            loading="lazy"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            className="food-card-img"
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              gap: '6px'
            }}
          >
            <UtensilsCrossed size={32} opacity={0.6} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.category}</span>
          </div>
        )}

        {/* Category Pill Over Image */}
        <span
          className="badge"
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            color: '#ffffff',
            backdropFilter: 'blur(4px)',
            fontSize: '0.7rem'
          }}
        >
          {item.category}
        </span>

        {/* Availability Badge */}
        <span
          className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            fontSize: '0.7rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}
        >
          {isAvailable ? 'In Stock' : 'Sold Out'}
        </span>

        {/* Current Cart Quantity Pill if in cart */}
        {cartQuantity > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              border: '2px solid #ffffff'
            }}
            title={`${cartQuantity} in bill`}
          >
            {cartQuantity}
          </div>
        )}
      </div>

      {/* Card Details */}
      <div
        style={{
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          gap: '10px'
        }}
      >
        <div>
          <h4
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '4px',
              lineHeight: 1.3
            }}
          >
            {item.name}
          </h4>
          {item.description && (
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.35,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
              title={item.description}
            >
              {item.description}
            </p>
          )}
        </div>

        {/* Price & Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '4px',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: 'var(--primary)',
                letterSpacing: '-0.01em'
              }}
            >
              {formatCurrency(item.price)}
            </span>
          </div>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              if (isAvailable && onAddToCart) onAddToCart(item);
            }}
            className={`btn btn-sm ${cartQuantity > 0 ? 'btn-primary' : 'btn-outline-primary'}`}
            style={{
              borderRadius: 'var(--radius-full)',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 700
            }}
            aria-label={`Add ${item.name} to bill`}
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
