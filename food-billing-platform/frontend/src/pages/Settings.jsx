import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  CheckCircle,
  Building,
  Printer,
  Receipt,
  Palette,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import {
  getStoredSettings,
  saveStoredSettings,
  DEFAULT_SETTINGS
} from '../utils/billingUtils';

const Settings = ({ onThemeChange }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
    setSavedSuccess(false);
    setErrorMessage('');
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Validation
    if (!settings.shopName.trim()) {
      setErrorMessage('Shop name cannot be blank.');
      return;
    }

    const taxNum = Number(settings.taxPercent);
    if (isNaN(taxNum) || taxNum < 0 || taxNum > 100) {
      setErrorMessage('Tax percentage must be between 0% and 100%.');
      return;
    }

    const discNum = Number(settings.defaultDiscount);
    if (isNaN(discNum) || discNum < 0) {
      setErrorMessage('Default discount cannot be negative.');
      return;
    }

    const sanitized = {
      ...settings,
      taxPercent: taxNum,
      defaultDiscount: discNum
    };

    saveStoredSettings(sanitized);
    setSettings(sanitized);

    if (onThemeChange) {
      onThemeChange(sanitized.theme);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all settings to default configuration?')) {
      saveStoredSettings(DEFAULT_SETTINGS);
      setSettings(DEFAULT_SETTINGS);
      if (onThemeChange) {
        onThemeChange(DEFAULT_SETTINGS.theme);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Platform & Receipt Settings</span>
          </h1>
          <p className="page-subtitle">
            Configure restaurant identity, billing tax rates, and thermal printer presets
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="btn btn-secondary"
          >
            <RotateCcw size={15} />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: 'var(--success-light)',
            color: '#065f46',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #a7f3d0',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 600,
            fontSize: '0.88rem'
          }}
        >
          <CheckCircle size={18} />
          <span>Settings saved successfully in browser localStorage!</span>
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 600,
            fontSize: '0.88rem'
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Section 1: Shop & Restaurant Profile */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Building size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Restaurant Profile</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Restaurant / Shop Name *</label>
              <input
                type="text"
                required
                value={settings.shopName}
                onChange={(e) => handleChange('shopName', e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Address (Printed on receipts)</label>
              <textarea
                rows={2}
                value={settings.shopAddress}
                onChange={(e) => handleChange('shopAddress', e.target.value)}
                className="form-control"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Contact Phone Number</label>
                <input
                  type="text"
                  value={settings.shopPhone}
                  onChange={(e) => handleChange('shopPhone', e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">GSTIN / Food License No.</label>
                <input
                  type="text"
                  value={settings.gstNumber || ''}
                  onChange={(e) => handleChange('gstNumber', e.target.value)}
                  className="form-control"
                  placeholder="e.g. 33ABCDE1234F1Z5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Billing & Tax Preferences */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Receipt size={20} color="var(--secondary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Billing & Tax Configuration</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Currency Symbol</label>
              <input
                type="text"
                value={settings.currencySymbol}
                onChange={(e) => handleChange('currencySymbol', e.target.value)}
                className="form-control"
                style={{ width: '80px' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Default: Indian Rupee (₹)</span>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="any"
                value={settings.taxPercent}
                onChange={(e) => handleChange('taxPercent', e.target.value)}
                className="form-control"
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Defaults to 0% until configured</span>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Default Bill Discount (₹)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={settings.defaultDiscount}
                onChange={(e) => handleChange('defaultDiscount', e.target.value)}
                className="form-control"
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Applied by default to new bills</span>
            </div>
          </div>
        </div>

        {/* Section 3: Receipt & Printer Options */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Printer size={20} color="var(--accent-amber)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Receipt & Thermal Printer Presets</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Thermal Paper Width</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { id: '80mm', label: '80mm (Standard POS Printer)' },
                  { id: '58mm', label: '58mm (Compact Mobile Printer)' }
                ].map((pw) => (
                  <label
                    key={pw.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: settings.paperWidth === pw.id
                        ? '2px solid var(--primary)'
                        : '1px solid var(--border-subtle)',
                      backgroundColor: settings.paperWidth === pw.id
                        ? 'var(--primary-light)'
                        : 'var(--bg-surface)',
                      cursor: 'pointer',
                      fontWeight: settings.paperWidth === pw.id ? 700 : 500,
                      fontSize: '0.85rem'
                    }}
                  >
                    <input
                      type="radio"
                      name="paperWidth"
                      checked={settings.paperWidth === pw.id}
                      onChange={() => handleChange('paperWidth', pw.id)}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span>{pw.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Receipt Footer Message</label>
              <input
                type="text"
                value={settings.receiptFooter}
                onChange={(e) => handleChange('receiptFooter', e.target.value)}
                className="form-control"
                placeholder="Thank you for dining with us! Please visit again."
              />
            </div>
          </div>
        </div>

        {/* Section 4: Interface Theme */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Palette size={20} color="#8b5cf6" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Appearance & Theme</h3>
          </div>

          <div style={{ display: 'flex', gap: '14px' }}>
            {[
              { id: 'light', label: 'Light Theme (Warm White)', desc: 'Clean high contrast for bright counters' },
              { id: 'dark', label: 'Dark Theme (Sleek Charcoal)', desc: 'Eye-friendly for evening operations' }
            ].map((th) => (
              <label
                key={th.id}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-lg)',
                  border: settings.theme === th.id
                    ? '2px solid var(--primary)'
                    : '1px solid var(--border-subtle)',
                  backgroundColor: settings.theme === th.id
                    ? 'var(--primary-light)'
                    : 'var(--bg-surface)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="radio"
                    name="themeSelect"
                    checked={settings.theme === th.id}
                    onChange={() => handleChange('theme', th.id)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{th.label}</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: '24px' }}>
                  {th.desc}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ fontWeight: 700, boxShadow: '0 4px 14px var(--primary-glow)' }}
          >
            <Save size={18} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
