import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import MenuManagement from './pages/MenuManagement';
import BillHistory from './pages/BillHistory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { getStoredSettings, saveStoredSettings } from './utils/billingUtils';

function App() {
  const [settings, setSettings] = useState(() => getStoredSettings());
  const [theme, setTheme] = useState(() => settings?.theme || 'light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Apply theme attribute to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync settings changes
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    const updated = { ...settings, theme: newTheme };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    handleThemeChange(nextTheme);
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        shopName={settings?.shopName}
      />

      {/* Main App Content Area */}
      <div className="main-content-wrapper">
        <Navbar
          settings={settings}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          currentCashier="Counter 1"
        />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/menu" element={<MenuManagement />} />
            <Route path="/history" element={<BillHistory />} />
            <Route path="/reports" element={<Reports />} />
            <Route
              path="/settings"
              element={<Settings onThemeChange={handleThemeChange} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
