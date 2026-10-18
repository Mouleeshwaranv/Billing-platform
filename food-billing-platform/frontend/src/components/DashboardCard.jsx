import React from 'react';

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'orange'
}) => {
  const schemeStyles = {
    orange: {
      bg: 'var(--primary-light)',
      text: 'var(--primary)',
      border: 'var(--primary-border)'
    },
    green: {
      bg: 'var(--secondary-light)',
      text: 'var(--secondary)',
      border: '#a7f3d0'
    },
    amber: {
      bg: 'var(--accent-amber-light)',
      text: '#b45309',
      border: '#fde68a'
    },
    blue: {
      bg: 'var(--info-light)',
      text: '#2563eb',
      border: '#bfdbfe'
    }
  }[colorScheme] || {
    bg: 'var(--primary-light)',
    text: 'var(--primary)',
    border: 'var(--primary-border)'
  };

  return (
    <div
      className="card"
      style={{
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div>
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text-muted)'
            }}
          >
            {title}
          </span>
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: '4px',
              letterSpacing: '-0.02em'
            }}
          >
            {value}
          </div>
        </div>

        {Icon && (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: schemeStyles.bg,
              color: schemeStyles.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Icon size={22} strokeWidth={2.2} />
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '12px'
        }}
      >
        {trend && (
          <span
            style={{
              fontWeight: 700,
              color: trend.isPositive ? 'var(--secondary)' : 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            {trend.text}
          </span>
        )}
        <span>{subtitle}</span>
      </div>
    </div>
  );
};

export default DashboardCard;
