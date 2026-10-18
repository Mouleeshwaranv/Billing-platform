import React, { useState, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  ReceiptText,
  CreditCard,
  QrCode,
  Banknote,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Printer,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import FoodCard from '../components/FoodCard';
import CategoryFilter from '../components/CategoryFilter';
import Cart from '../components/Cart';
import BillSummary from '../components/BillSummary';
import Modal from '../components/Modal';
import ReceiptComponent from '../components/Receipt';
import { FOOD_CATEGORIES } from '../data/foodItems';
import {
  getStoredFoodItems,
  getStoredSettings,
  addStoredBill,
  generateBillNumber,
  formatCurrency,
  calculateCashChange
} from '../utils/billingUtils';

const Billing = () => {
  // Data State
  const [foodItems, setFoodItems] = useState([]);
  const [settings, setSettings] = useState(null);

  // POS State
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Discount & Tax
  const [discountType, setDiscountType] = useState('fixed'); // 'fixed' | 'percent'
  const [discountValue, setDiscountValue] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);

  // Modals & Flows
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [cashReceived, setCashReceived] = useState('');
  const [paymentPendingBill, setPaymentPendingBill] = useState(null);
  const [completedBill, setCompletedBill] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initial load
  useEffect(() => {
    const loadedItems = getStoredFoodItems();
    const loadedSettings = getStoredSettings();
    setFoodItems(loadedItems);
    setSettings(loadedSettings);
    // Initialize tax from settings
    if (loadedSettings?.taxPercent !== undefined) {
      setTaxPercent(Number(loadedSettings.taxPercent) || 0);
    }
    if (loadedSettings?.defaultDiscount !== undefined) {
      setDiscountValue(Number(loadedSettings.defaultDiscount) || 0);
    }
  }, []);

  // Filter food items
  const filteredItems = foodItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate category counts
  const categoryCounts = foodItems.reduce(
    (acc, item) => {
      acc['All'] = (acc['All'] || 0) + 1;
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {}
  );

  // Cart actions
  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          category: item.category,
          quantity: 1
        }
      ];
    });
  };

  const handleUpdateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleConfirmClear = () => {
    setCartItems([]);
    setDiscountValue(0);
    setIsClearModalOpen(false);
  };

  // Checkout flow: Opens payment modal
  const handleOpenCheckout = (billSummaryData) => {
    setPaymentPendingBill(billSummaryData);
    setCashReceived(billSummaryData.finalTotal.toString());
    setIsPaymentModalOpen(true);
  };

  // Save bill with payment info
  const handleFinalizeBill = () => {
    if (isSaving || !paymentPendingBill) return;
    setIsSaving(true);

    const billNumber = generateBillNumber();
    const finalAmount = paymentPendingBill.finalTotal;
    const received = paymentMethod === 'Cash' ? (Number(cashReceived) || finalAmount) : finalAmount;
    const changeDue = calculateCashChange(finalAmount, received);

    const newBill = {
      id: `bill-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      billNumber,
      createdAt: new Date().toISOString(),
      items: cartItems,
      itemCount: cartItems.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: paymentPendingBill.subtotal,
      discountType,
      discountValue,
      discountAmount: paymentPendingBill.discountAmount,
      taxPercent,
      taxAmount: paymentPendingBill.taxAmount,
      finalAmount,
      paymentMethod,
      amountReceived: received,
      changeDue,
      cashier: 'Counter 1'
    };

    // Save to storage
    addStoredBill(newBill);

    // Set completed bill to display receipt immediately
    setCompletedBill(newBill);
    setIsPaymentModalOpen(false);
    setIsSaving(false);

    // Reset current cart for next customer
    setCartItems([]);
    setDiscountValue(settings?.defaultDiscount || 0);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="page-container" style={{ maxWidth: '100%' }}>
      {/* Page Title & Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <div>
          <h1 className="page-title">
            <span>Billing POS Terminal</span>
          </h1>
          <p className="page-subtitle">
            Fast food order punch & instant thermal receipt generation
          </p>
        </div>

        {/* Menu Search Box */}
        <div style={{ width: '100%', maxWidth: '380px' }} className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search dish (e.g. Idli, Dosa, Biryani)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            id="food-search-input"
          />
        </div>
      </div>

      {/* POS Two-Column Split Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(360px, 1.1fr)',
          gap: '24px',
          alignItems: 'start'
        }}
        className="pos-billing-grid"
      >
        {/* ================= LEFT COLUMN: FOOD MENU ================= */}
        <div className="billing-left-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Category Filter Pills */}
          <CategoryFilter
            categories={FOOD_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
          />

          {/* Menu Items Grid */}
          {filteredItems.length === 0 ? (
            <div
              className="card"
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}
            >
              <ShoppingBag size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                No dishes found
              </h3>
              <p style={{ fontSize: '0.85rem' }}>
                Try adjusting your search query or selecting another category.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px'
              }}
              className="food-cards-grid"
            >
              {filteredItems.map((item) => {
                const inCart = cartItems.find((ci) => ci.id === item.id);
                return (
                  <FoodCard
                    key={item.id}
                    item={item}
                    cartQuantity={inCart ? inCart.quantity : 0}
                    onAddToCart={handleAddToCart}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* ================= RIGHT COLUMN: CURRENT BILL ================= */}
        <div
          className="billing-right-section"
          style={{
            position: 'sticky',
            top: '80px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          {/* Cart Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 18px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ReceiptText size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Current Bill</h3>
            </div>
            <span className="badge badge-primary">
              {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Cart Items Stepper List */}
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />

          {/* Bill Calculations & Summary */}
          <BillSummary
            cartItems={cartItems}
            discountType={discountType}
            discountValue={discountValue}
            taxPercent={taxPercent}
            onDiscountTypeChange={setDiscountType}
            onDiscountValueChange={setDiscountValue}
            onTaxPercentChange={setTaxPercent}
            onClearBill={() => setIsClearModalOpen(true)}
            onCheckout={handleOpenCheckout}
            isProcessing={isSaving}
          />
        </div>
      </div>

      {/* ================= MODAL 1: CLEAR BILL CONFIRMATION ================= */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear Current Bill?"
        maxWidth="420px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsClearModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmClear}
              className="btn btn-danger"
            >
              Yes, Clear All Items
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
              Are you sure you want to discard this bill?
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              All {totalCartCount} items currently added to the bill will be removed.
            </p>
          </div>
        </div>
      </Modal>

      {/* ================= MODAL 2: PAYMENT & COMPLETION ================= */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => !isSaving && setIsPaymentModalOpen(false)}
        title="Complete Customer Payment"
        maxWidth="500px"
        footer={
          <>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsPaymentModalOpen(false)}
              className="btn btn-secondary"
            >
              Back to POS
            </button>
            <button
              type="button"
              disabled={
                isSaving ||
                (paymentMethod === 'Cash' &&
                  Number(cashReceived) < (paymentPendingBill?.finalTotal || 0))
              }
              onClick={handleFinalizeBill}
              className="btn btn-primary"
              style={{ fontWeight: 700 }}
            >
              <CheckCircle size={17} />
              <span>{isSaving ? 'Processing...' : 'Confirm Payment & Print Receipt'}</span>
            </button>
          </>
        }
      >
        {paymentPendingBill && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Amount Banner */}
            <div
              style={{
                backgroundColor: 'var(--primary-light)',
                border: '1px solid var(--primary-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--primary-active)', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Payable Amount
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                {formatCurrency(paymentPendingBill.finalTotal)}
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div>
              <label className="form-label">Select Payment Method</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  marginTop: '6px'
                }}
              >
                {[
                  { id: 'Cash', label: 'Cash', icon: Banknote },
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                  { id: 'Card', label: 'Card', icon: CreditCard },
                  { id: 'Other', label: 'Other', icon: MoreHorizontal }
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      style={{
                        padding: '12px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected
                          ? '2px solid var(--primary)'
                          : '1px solid var(--border-subtle)',
                        backgroundColor: isSelected
                          ? 'var(--primary-light)'
                          : 'var(--bg-surface)',
                        color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon size={20} />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Method Details: CASH */}
            {paymentMethod === 'Cash' && (
              <div
                style={{
                  padding: '14px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Cash Received From Customer (₹)</label>
                  <input
                    type="number"
                    step="any"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    className="form-control"
                    placeholder="Enter cash amount"
                    autoFocus
                  />
                </div>

                {/* Quick denomination buttons */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Exact', value: paymentPendingBill.finalTotal },
                    { label: '₹100', value: 100 },
                    { label: '₹200', value: 200 },
                    { label: '₹500', value: 500 },
                    { label: '₹2000', value: 2000 }
                  ]
                    .filter((item) => item.value >= paymentPendingBill.finalTotal || item.label === 'Exact')
                    .map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCashReceived(item.value.toString())}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        {item.label}
                      </button>
                    ))}
                </div>

                {/* Return Change Indicator */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-medium)'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Change to Return:</span>
                  <span
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: Number(cashReceived) >= paymentPendingBill.finalTotal
                        ? 'var(--secondary)'
                        : 'var(--danger)'
                    }}
                  >
                    {formatCurrency(calculateCashChange(paymentPendingBill.finalTotal, cashReceived))}
                  </span>
                </div>
              </div>
            )}

            {/* Method Details: UPI */}
            {paymentMethod === 'UPI' && (
              <div
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    width: '130px',
                    height: '130px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    margin: '0 auto 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px'
                  }}
                >
                  <QrCode size={110} color="#0f172a" />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Scan to Pay via UPI App
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  GPay • PhonePe • Paytm • BHIM
                </div>
                <span className="badge badge-warning" style={{ marginTop: '10px' }}>
                  Demo Mode: Simulating instant authorization
                </span>
              </div>
            )}

            {/* Method Details: CARD */}
            {paymentMethod === 'Card' && (
              <div
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <CreditCard size={44} color="var(--primary)" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                  Insert / Tap Credit or Debit Card
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Swipe or insert card on POS EDC machine terminal.
                </p>
                <span className="badge badge-warning" style={{ marginTop: '10px' }}>
                  Demo Mode: Card terminal authorized
                </span>
              </div>
            )}

            {/* Method Details: OTHER */}
            {paymentMethod === 'Other' && (
              <div
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Record payment as credit, complimentary dining, food voucher, or aggregator settlement.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ================= MODAL 3: INSTANT RECEIPT GENERATED ================= */}
      <Modal
        isOpen={!!completedBill}
        onClose={() => setCompletedBill(null)}
        title={`Customer Receipt Generated — ${completedBill?.billNumber || ''}`}
        maxWidth="460px"
        footer={
          <button
            type="button"
            onClick={() => setCompletedBill(null)}
            className="btn btn-primary"
            style={{ fontWeight: 700 }}
          >
            Start Next Bill
          </button>
        }
      >
        {completedBill && (
          <ReceiptComponent
            bill={completedBill}
            settings={settings}
            onClose={() => setCompletedBill(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Billing;
