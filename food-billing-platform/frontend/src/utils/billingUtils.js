import { INITIAL_FOOD_ITEMS } from '../data/foodItems';

export const STORAGE_KEYS = {
  FOOD_ITEMS: 'sfb_food_items_v2',
  BILLS: 'sfb_bills_v1',
  SETTINGS: 'sfb_settings_v1',
  BILL_COUNTER: 'sfb_bill_counter_v1'
};

export const DEFAULT_SETTINGS = {
  shopName: 'Annapoorna Grand Food Court',
  shopAddress: '42, Temple Road, Opp. Central Bus Stand, Madurai - 625001',
  shopPhone: '+91 98765 43210',
  currencySymbol: '₹',
  taxPercent: 0, // Default 0% as per requirements
  defaultDiscount: 0,
  receiptFooter: 'Thank you for dining with us! Please visit again.',
  paperWidth: '80mm', // '80mm' or '58mm'
  theme: 'light',
  gstNumber: '33ABCDE1234F1Z5'
};

/**
 * Format monetary amount with Indian Rupee formatting
 */
export const formatCurrency = (amount, symbol = '₹') => {
  const num = Number(amount) || 0;
  return `${symbol}${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Calculate Line Total = Unit Price * Quantity
 */
export const calculateLineTotal = (unitPrice, quantity) => {
  const price = Number(unitPrice) || 0;
  const qty = Number(quantity) || 0;
  return Number((price * qty).toFixed(2));
};

/**
 * Subtotal = Sum of all line totals
 */
export const calculateSubtotal = (items = []) => {
  const subtotal = items.reduce((acc, item) => {
    return acc + calculateLineTotal(item.price, item.quantity);
  }, 0);
  return Number(subtotal.toFixed(2));
};

/**
 * Calculate Discount amount
 */
export const calculateDiscount = (subtotal, discountType, discountValue) => {
  const sub = Number(subtotal) || 0;
  const val = Number(discountValue) || 0;
  if (val <= 0 || sub <= 0) return 0;

  if (discountType === 'percent') {
    const clampedPercent = Math.min(Math.max(val, 0), 100);
    return Number(((sub * clampedPercent) / 100).toFixed(2));
  }
  // fixed amount
  return Number(Math.min(val, sub).toFixed(2));
};

/**
 * Calculate Tax amount
 */
export const calculateTax = (taxableAmount, taxPercent) => {
  const base = Number(taxableAmount) || 0;
  const pct = Number(taxPercent) || 0;
  if (base <= 0 || pct <= 0) return 0;
  return Number(((base * pct) / 100).toFixed(2));
};

/**
 * Final Total = Subtotal - Discount + Tax
 */
export const calculateFinalTotal = (subtotal, discountAmount, taxAmount) => {
  const sub = Number(subtotal) || 0;
  const disc = Number(discountAmount) || 0;
  const tax = Number(taxAmount) || 0;
  const total = Math.max(0, sub - disc + tax);
  return Number(total.toFixed(2));
};

/**
 * Calculate cash return change
 */
export const calculateCashChange = (finalTotal, amountReceived) => {
  const tot = Number(finalTotal) || 0;
  const rec = Number(amountReceived) || 0;
  if (rec <= 0 || rec < tot) return 0;
  return Number((rec - tot).toFixed(2));
};

/**
 * Generate sequential unique bill number e.g. BILL-20261018-1001
 */
export const generateBillNumber = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const datePrefix = `${yyyy}${mm}${dd}`;

  let counter = 1001;
  try {
    const storedCounter = localStorage.getItem(STORAGE_KEYS.BILL_COUNTER);
    if (storedCounter) {
      counter = parseInt(storedCounter, 10) + 1;
    }
  } catch (e) {
    console.error('Error reading bill counter:', e);
  }
  try {
    localStorage.setItem(STORAGE_KEYS.BILL_COUNTER, counter.toString());
  } catch (e) {
    console.error('Error saving bill counter:', e);
  }

  return `BILL-${datePrefix}-${counter}`;
};

/**
 * Date and time formatters
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatTime = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Storage helper functions with safety
export const getStoredFoodItems = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(INITIAL_FOOD_ITEMS));
      return INITIAL_FOOD_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure all initial items have valid local image paths
      const updated = parsed.map(item => {
        const found = INITIAL_FOOD_ITEMS.find(i => i.id === item.id);
        if (found && (!item.image || item.image.startsWith('http'))) {
          return { ...item, image: found.image };
        }
        return item;
      });
      return updated;
    }
    return INITIAL_FOOD_ITEMS;
  } catch (e) {
    console.error('Error getting stored food items:', e);
    return INITIAL_FOOD_ITEMS;
  }
};

export const saveStoredFoodItems = (items) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(items));
    return true;
  } catch (e) {
    console.error('Error saving food items:', e);
    return false;
  }
};

export const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error getting settings:', e);
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Error saving settings:', e);
    return false;
  }
};

// Initial realistic sample bills so dashboard & reports are alive on first launch
const createInitialSampleBills = () => {
  const now = new Date();
  
  const createPastDate = (daysAgo, hours, minutes) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  return [
    {
      id: 'demo-bill-1',
      billNumber: 'BILL-TODAY-1001',
      createdAt: createPastDate(0, 9, 15),
      items: [
        { id: 'food-1', name: 'Idli (2 Pcs)', price: 40, quantity: 2, category: 'Tiffin' },
        { id: 'food-27', name: 'South Indian Filter Coffee', price: 25, quantity: 2, category: 'Drinks' },
        { id: 'food-9', name: 'Medu Vada (1 Pc)', price: 30, quantity: 2, category: 'Tiffin' }
      ],
      itemCount: 6,
      subtotal: 190.00,
      discountType: 'fixed',
      discountValue: 0,
      discountAmount: 0.00,
      taxPercent: 0,
      taxAmount: 0.00,
      finalAmount: 190.00,
      paymentMethod: 'Cash',
      amountReceived: 200.00,
      changeDue: 10.00,
      cashier: 'Counter 1'
    },
    {
      id: 'demo-bill-2',
      billNumber: 'BILL-TODAY-1002',
      createdAt: createPastDate(0, 10, 30),
      items: [
        { id: 'food-4', name: 'Masala Dosa', price: 80, quantity: 2, category: 'Tiffin' },
        { id: 'food-28', name: 'Masala Tea', price: 20, quantity: 2, category: 'Drinks' }
      ],
      itemCount: 4,
      subtotal: 200.00,
      discountType: 'fixed',
      discountValue: 10,
      discountAmount: 10.00,
      taxPercent: 0,
      taxAmount: 0.00,
      finalAmount: 190.00,
      paymentMethod: 'UPI',
      amountReceived: 190.00,
      changeDue: 0.00,
      cashier: 'Counter 1'
    },
    {
      id: 'demo-bill-3',
      billNumber: 'BILL-TODAY-1003',
      createdAt: createPastDate(0, 13, 10),
      items: [
        { id: 'food-23', name: 'Chicken Biryani', price: 180, quantity: 2, category: 'Biryani' },
        { id: 'food-30', name: 'Fresh Lime Juice', price: 35, quantity: 2, category: 'Drinks' },
        { id: 'food-31', name: 'Packaged Mineral Water (1L)', price: 20, quantity: 1, category: 'Drinks' }
      ],
      itemCount: 5,
      subtotal: 450.00,
      discountType: 'percent',
      discountValue: 5,
      discountAmount: 22.50,
      taxPercent: 5,
      taxAmount: 21.38,
      finalAmount: 448.88,
      paymentMethod: 'Card',
      amountReceived: 448.88,
      changeDue: 0.00,
      cashier: 'Counter 1'
    },
    {
      id: 'demo-bill-4',
      billNumber: 'BILL-TODAY-1004',
      createdAt: createPastDate(0, 14, 0),
      items: [
        { id: 'food-11', name: 'South Indian Veg Meals', price: 120, quantity: 3, category: 'Rice and Meals' },
        { id: 'food-27', name: 'South Indian Filter Coffee', price: 25, quantity: 3, category: 'Drinks' }
      ],
      itemCount: 6,
      subtotal: 435.00,
      discountType: 'fixed',
      discountValue: 0,
      discountAmount: 0.00,
      taxPercent: 0,
      taxAmount: 0.00,
      finalAmount: 435.00,
      paymentMethod: 'UPI',
      amountReceived: 435.00,
      changeDue: 0.00,
      cashier: 'Counter 1'
    },
    {
      id: 'demo-bill-5',
      billNumber: 'BILL-YEST-1005',
      createdAt: createPastDate(1, 19, 45),
      items: [
        { id: 'food-20', name: 'Chicken Fried Rice', price: 140, quantity: 2, category: 'Fast Food' },
        { id: 'food-22', name: 'Chicken Noodles', price: 150, quantity: 1, category: 'Fast Food' },
        { id: 'food-30', name: 'Fresh Lime Juice', price: 35, quantity: 2, category: 'Drinks' }
      ],
      itemCount: 5,
      subtotal: 500.00,
      discountType: 'fixed',
      discountValue: 20,
      discountAmount: 20.00,
      taxPercent: 0,
      taxAmount: 0.00,
      finalAmount: 480.00,
      paymentMethod: 'Cash',
      amountReceived: 500.00,
      changeDue: 20.00,
      cashier: 'Counter 1'
    },
    {
      id: 'demo-bill-6',
      billNumber: 'BILL-YEST-1006',
      createdAt: createPastDate(2, 13, 30),
      items: [
        { id: 'food-24', name: 'Mutton Biryani', price: 240, quantity: 2, category: 'Biryani' },
        { id: 'food-23', name: 'Chicken Biryani', price: 180, quantity: 1, category: 'Biryani' }
      ],
      itemCount: 3,
      subtotal: 660.00,
      discountType: 'fixed',
      discountValue: 0,
      discountAmount: 0.00,
      taxPercent: 0,
      taxAmount: 0.00,
      finalAmount: 660.00,
      paymentMethod: 'UPI',
      amountReceived: 660.00,
      changeDue: 0.00,
      cashier: 'Counter 1'
    }
  ];
};

export const getStoredBills = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BILLS);
    if (!raw) {
      const initialBills = createInitialSampleBills();
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(initialBills));
      return initialBills;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error getting stored bills:', e);
    return [];
  }
};

export const saveStoredBills = (bills) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
    return true;
  } catch (e) {
    console.error('Error saving bills:', e);
    return false;
  }
};

export const addStoredBill = (newBill) => {
  try {
    const currentBills = getStoredBills();
    // Prepend new bill so it appears first
    const updated = [newBill, ...currentBills];
    saveStoredBills(updated);
    return updated;
  } catch (e) {
    console.error('Error adding bill:', e);
    return [];
  }
};
