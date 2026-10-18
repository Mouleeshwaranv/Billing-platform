import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  UtensilsCrossed,
  History,
  BarChart3,
  Settings,
  X,
  ChefHat,
  Database
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/billing', label: 'New Bill (POS)', icon: ReceiptText, badge: 'Active' },
  { path: '/menu', label: 'Menu Management', icon: UtensilsCrossed },
  { path: '/history', label: 'Bill History', icon: History },
  { path: '/reports', label: 'Sales Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings }
];

const Sidebar = ({ isOpen, onClose, shopName = 'Food POS' }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            zIndex: 1040,
            display: 'block'
          }}
          className="mobile-sidebar-backdrop no-print"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`sidebar no-print ${isOpen ? 'sidebar-open' : ''}`}
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--sidebar-bg)',
          color: 'var(--sidebar-text)',
          borderRight: '1px solid var(--sidebar-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 1045,
          transition: 'transform 0.25s ease',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Top Brand Header */}
        <div
          style={{
            height: 'var(--navbar-height)',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--sidebar-border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px var(--primary-glow)'
              }}
            >
              <ChefHat size={20} />
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '140px'
                }}
                title={shopName}
              >
                {shopName}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--sidebar-muted)', fontWeight: 500 }}>
                Smart Food Billing
              </div>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-icon mobile-close-btn"
            style={{
              padding: '6px',
              backgroundColor: 'var(--sidebar-surface)',
              border: 'none',
              color: 'var(--sidebar-muted)'
            }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav
          style={{
            flex: 1,
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            overflowY: 'auto'
          }}
        >
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--sidebar-muted)',
              padding: '6px 12px 4px'
            }}
          >
            Navigation
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 992) onClose();
                }}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#ffffff' : 'var(--sidebar-text)',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  boxShadow: isActive ? '0 2px 8px var(--primary-glow)' : 'none',
                  transition: 'all 0.15s ease'
                })}
                className="sidebar-nav-link"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={19} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#ffffff'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Local Demo Mode Indicator Card */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid var(--sidebar-border)',
            backgroundColor: 'var(--sidebar-surface)'
          }}
        >
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(249, 115, 22, 0.08)',
              border: '1px solid rgba(249, 115, 22, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 700 }}>
              <Database size={14} />
              <span>Local Demo Mode</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--sidebar-muted)', lineHeight: 1.35 }}>
              Data persists in your browser localStorage. No server required.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
