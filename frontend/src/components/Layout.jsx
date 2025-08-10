import React from 'react';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1>🚗 Car Management Dashboard</h1>
      </header>

      <main className="layout-content">{children}</main>

      <footer className="layout-footer">
        <small>© {new Date().getFullYear()} Simple Car Management Demo</small>
      </footer>
    </div>
  );
}
