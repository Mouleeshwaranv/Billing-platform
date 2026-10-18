import React, { useState, useEffect } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Clock,
  User,
  PlusCircle,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({
  settings,
  theme,
  onToggleTheme,
  onToggleSidebar,
  currentCashier = 'Counter 1'
}) => {
  const navigate = useNavigate();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
      setDateStr(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="navbar no-print"
      style={{
        height: 'var(--navbar-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      {/* Left: Hamburger & Brand Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="btn btn-secondary btn-icon mobile-menu-btn"
          aria-label="Toggle navigation menu"
          style={{ padding: '8px' }}
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px var(--primary-glow)'
            }}
          >
            <UtensilsCrossed size={20} />
          </div>

          <div>
            <h2
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                lineHeight: 1.2
              }}
            >
              {settings?.shopName || 'Food Billing POS'}
            </h2>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--secondary)',
                  display: 'inline-block'
                }}
              />
              POS System Ready
            </div>
          </div>
        </div>
      </div>

      {/* Center: Live Date & Clock */}
      <div
        className="navbar-clock-pill"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 14px',
          backgroundColor: 'var(--bg-surface-subtle)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)'
        }}
      >
        <Clock size={15} color="var(--primary)" />
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{timeStr}</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span>{dateStr}</span>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          type="button"
          onClick={() => navigate('/billing')}
          className="btn btn-primary btn-sm quick-new-bill-btn"
          style={{ fontWeight: 700 }}
        >
          <PlusCircle size={15} />
          <span>New Bill</span>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="btn btn-secondary btn-icon"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? (
            <Sun size={18} color="var(--accent-amber)" />
          ) : (
            <Moon size={18} color="var(--text-secondary)" />
          )}
        </button>

        {/* Cashier Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 10px',
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-secondary)'
          }}
          title="Current Cashier Session"
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <User size={13} />
          </div>
          <span className="cashier-label">{currentCashier}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
