import React, { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  Eye,
  Printer,
  ReceiptText,
  Trash2,
  AlertTriangle,
  RotateCcw,
  IndianRupee,
  Layers
} from 'lucide-react';
import Modal from '../components/Modal';
import ReceiptComponent from '../components/Receipt';
import {
  getStoredBills,
  saveStoredBills,
  getStoredSettings,
  formatCurrency,
  formatDateTime,
  formatDate
} from '../utils/billingUtils';

const BillHistory = () => {
  const [bills, setBills] = useState([]);
  const [settings, setSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterPayment, setFilterPayment] = useState('All');

  // Modal receipt
  const [activeReceiptBill, setActiveReceiptBill] = useState(null);
  const [isClearHistoryOpen, setIsClearHistoryOpen] = useState(false);

  useEffect(() => {
    setBills(getStoredBills());
    setSettings(getStoredSettings());
  }, []);

  // Filter bills
  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      b.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.paymentMethod && b.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDate =
      filterDate === '' ||
      (b.createdAt && b.createdAt.startsWith(filterDate));

    const matchesPayment =
      filterPayment === 'All' || b.paymentMethod === filterPayment;

    return matchesSearch && matchesDate && matchesPayment;
  });

  const totalFilteredSales = filteredBills.reduce((acc, b) => acc + (b.finalAmount || 0), 0);
  const totalFilteredBills = filteredBills.length;

  const handleClearHistory = () => {
    setBills([]);
    saveStoredBills([]);
    setIsClearHistoryOpen(false);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Bill & Transaction History</span>
          </h1>
          <p className="page-subtitle">
            Search, review, and reprint previously issued customer receipts
          </p>
        </div>

        {bills.length > 0 && (
          <button
            type="button"
            onClick={() => setIsClearHistoryOpen(true)}
            className="btn btn-danger-outline btn-sm"
          >
            <Trash2 size={15} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Demo Notice Banner */}
      <div
        style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(249, 115, 22, 0.08)',
          border: '1px solid rgba(249, 115, 22, 0.25)',
          marginBottom: '20px',
          fontSize: '0.84rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', flexShrink: 0 }} />
        <span>
          <strong>Browser Demo Storage:</strong> Bills shown here are persisted locally in your browser’s localStorage for testing and evaluation purposes.
        </span>
      </div>

      {/* Summary Cards for Filtered Range */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <div className="card" style={{ padding: '16px 20px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Total Invoices Found
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {totalFilteredBills} bills
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Cumulative Revenue
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
            {formatCurrency(totalFilteredSales)}
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Average Ticket Size
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '4px' }}>
            {formatCurrency(totalFilteredBills > 0 ? totalFilteredSales / totalFilteredBills : 0)}
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', flex: 1 }}>
          {/* Bill number search */}
          <div style={{ width: '260px' }} className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search bill number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ height: '36px' }}
            />
          </div>

          {/* Date Picker Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} color="var(--text-muted)" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="form-control"
              style={{ height: '36px', width: '150px', fontSize: '0.84rem' }}
            />
          </div>

          {/* Payment filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="form-control"
              style={{ height: '36px', width: '130px', fontSize: '0.84rem' }}
            >
              <option value="All">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {(searchQuery || filterDate || filterPayment !== 'All') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilterDate('');
              setFilterPayment('All');
            }}
            className="btn btn-secondary btn-sm"
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Bills Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.88rem',
              textAlign: 'left'
            }}
          >
            <thead style={{ backgroundColor: 'var(--bg-surface-subtle)' }}>
              <tr
                style={{
                  borderBottom: '1px solid var(--border-medium)',
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                <th style={{ padding: '12px 18px' }}>Bill #</th>
                <th style={{ padding: '12px 18px' }}>Date & Time</th>
                <th style={{ padding: '12px 18px' }}>Items</th>
                <th style={{ padding: '12px 18px' }}>Subtotal</th>
                <th style={{ padding: '12px 18px' }}>Discount</th>
                <th style={{ padding: '12px 18px' }}>Tax</th>
                <th style={{ padding: '12px 18px' }}>Total Amount</th>
                <th style={{ padding: '12px 18px' }}>Payment</th>
                <th style={{ padding: '12px 18px', textAlign: 'center' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <ReceiptText size={40} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                    <p style={{ fontWeight: 600 }}>No bills match your search criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr
                    key={bill.id || bill.billNumber}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.1s'
                    }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {bill.billNumber}
                    </td>

                    <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {formatDateTime(bill.createdAt)}
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <span className="badge badge-neutral">
                        {bill.itemCount || (bill.items ? bill.items.length : 0)} items
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      {formatCurrency(bill.subtotal)}
                    </td>

                    <td style={{ padding: '14px 18px', color: bill.discountAmount > 0 ? 'var(--secondary)' : 'var(--text-muted)' }}>
                      {bill.discountAmount > 0 ? `-${formatCurrency(bill.discountAmount)}` : '—'}
                    </td>

                    <td style={{ padding: '14px 18px', color: bill.taxAmount > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {bill.taxAmount > 0 ? `+${formatCurrency(bill.taxAmount)}` : '0%'}
                    </td>

                    <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary)' }}>
                      {formatCurrency(bill.finalAmount)}
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <span
                        className={`badge ${
                          bill.paymentMethod === 'Cash'
                            ? 'badge-success'
                            : bill.paymentMethod === 'UPI'
                            ? 'badge-primary'
                            : 'badge-warning'
                        }`}
                      >
                        {bill.paymentMethod}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setActiveReceiptBill(bill)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                        title="View and Print Receipt"
                      >
                        <Printer size={13} />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: RECEIPT PREVIEW & PRINT ================= */}
      <Modal
        isOpen={!!activeReceiptBill}
        onClose={() => setActiveReceiptBill(null)}
        title={`Receipt — ${activeReceiptBill?.billNumber || ''}`}
        maxWidth="460px"
      >
        {activeReceiptBill && (
          <ReceiptComponent
            bill={activeReceiptBill}
            settings={settings}
            onClose={() => setActiveReceiptBill(null)}
          />
        )}
      </Modal>

      {/* ================= MODAL: CLEAR HISTORY CONFIRMATION ================= */}
      <Modal
        isOpen={isClearHistoryOpen}
        onClose={() => setIsClearHistoryOpen(false)}
        title="Clear Bill History?"
        maxWidth="420px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsClearHistoryOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleClearHistory}
              className="btn btn-danger"
            >
              Yes, Clear All
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              Delete all saved demo bills?
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              This will erase all demo transaction records from your browser's localStorage.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BillHistory;
