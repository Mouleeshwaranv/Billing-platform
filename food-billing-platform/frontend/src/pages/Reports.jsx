import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  CreditCard,
  PieChart as PieIcon,
  BarChart2,
  Calendar,
  IndianRupee,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import {
  getStoredBills,
  formatCurrency,
  formatDate
} from '../utils/billingUtils';

const COLORS = ['#f97316', '#059669', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

const Reports = () => {
  const [bills, setBills] = useState([]);
  const [timeRange, setTimeRange] = useState('7days'); // 'today' | '7days' | '30days' | 'all'

  useEffect(() => {
    setBills(getStoredBills());
  }, []);

  // Filter bills based on timeframe
  const now = new Date();
  const filteredBills = bills.filter((b) => {
    if (!b.createdAt) return false;
    const bDate = new Date(b.createdAt);
    const diffDays = (now - bDate) / (1000 * 60 * 60 * 24);

    if (timeRange === 'today') {
      return bDate.toDateString() === now.toDateString();
    }
    if (timeRange === '7days') {
      return diffDays <= 7;
    }
    if (timeRange === '30days') {
      return diffDays <= 30;
    }
    return true; // 'all'
  });

  // Calculate metrics
  const totalSales = filteredBills.reduce((acc, b) => acc + (b.finalAmount || 0), 0);
  const totalBillsCount = filteredBills.length;
  const avgBillValue = totalBillsCount > 0 ? totalSales / totalBillsCount : 0;
  const totalItemsSold = filteredBills.reduce((acc, b) => acc + (b.itemCount || 0), 0);

  // 1. Sales Trend Over Time Data
  const salesByDateMap = {};
  filteredBills.forEach((b) => {
    const dStr = formatDate(b.createdAt);
    salesByDateMap[dStr] = (salesByDateMap[dStr] || 0) + (b.finalAmount || 0);
  });

  const salesTrendData = Object.keys(salesByDateMap).map((date) => ({
    date,
    amount: Number(salesByDateMap[date].toFixed(2))
  }));

  // 2. Sales by Category
  const categorySalesMap = {};
  filteredBills.forEach((b) => {
    (b.items || []).forEach((item) => {
      const cat = item.category || 'Other';
      const itemRev = (item.quantity || 1) * (item.price || 0);
      categorySalesMap[cat] = (categorySalesMap[cat] || 0) + itemRev;
    });
  });

  const categoryData = Object.keys(categorySalesMap).map((cat) => ({
    name: cat,
    value: Number(categorySalesMap[cat].toFixed(2))
  }));

  // 3. Payment Method Distribution
  const paymentMethodMap = { Cash: 0, UPI: 0, Card: 0, Other: 0 };
  filteredBills.forEach((b) => {
    const method = b.paymentMethod || 'Cash';
    paymentMethodMap[method] = (paymentMethodMap[method] || 0) + (b.finalAmount || 0);
  });

  const paymentData = Object.keys(paymentMethodMap).map((method) => ({
    method,
    amount: Number(paymentMethodMap[method].toFixed(2))
  }));

  // 4. Best Selling Items Ranking
  const itemsMap = {};
  filteredBills.forEach((b) => {
    (b.items || []).forEach((item) => {
      if (!itemsMap[item.name]) {
        itemsMap[item.name] = {
          name: item.name,
          category: item.category || 'Dish',
          quantity: 0,
          revenue: 0
        };
      }
      itemsMap[item.name].quantity += item.quantity || 0;
      itemsMap[item.name].revenue += (item.quantity || 0) * (item.price || 0);
    });
  });

  const topItems = Object.values(itemsMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 6);

  // CSV Export utility
  const exportCSV = () => {
    if (filteredBills.length === 0) return;
    const headers = ['Bill Number,Date,Items Count,Subtotal,Discount,Tax,Final Amount,Payment Method'];
    const rows = filteredBills.map((b) =>
      `"${b.billNumber}","${b.createdAt}","${b.itemCount}","${b.subtotal}","${b.discountAmount}","${b.taxAmount}","${b.finalAmount}","${b.paymentMethod}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `food_sales_report_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Sales & Revenue Analytics</span>
          </h1>
          <p className="page-subtitle">
            Historical sales breakdown, category revenue & payment distribution
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={exportCSV}
            disabled={filteredBills.length === 0}
            className="btn btn-secondary btn-sm"
          >
            <FileSpreadsheet size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div
        className="card"
        style={{
          padding: '12px 18px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="var(--primary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Timeframe Filter:</span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'today', label: 'Today' },
            { id: '7days', label: 'Last 7 Days' },
            { id: '30days', label: 'Last 30 Days' },
            { id: 'all', label: 'All Time' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTimeRange(tab.id)}
              className={`btn btn-sm ${timeRange === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredBills.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}
        >
          <BarChart2 size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            No sales data for this timeframe
          </h3>
          <p style={{ fontSize: '0.85rem' }}>
            Generate new customer bills in the POS section to view reports and charts.
          </p>
        </div>
      ) : (
        <>
          {/* 4 Summary Stats Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '18px',
              marginBottom: '26px'
            }}
          >
            <div className="card" style={{ padding: '18px 22px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Total Revenue
              </span>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                {formatCurrency(totalSales)}
              </div>
            </div>

            <div className="card" style={{ padding: '18px 22px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Total Invoices
              </span>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {totalBillsCount} bills
              </div>
            </div>

            <div className="card" style={{ padding: '18px 22px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Average Bill Value
              </span>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '4px' }}>
                {formatCurrency(avgBillValue)}
              </div>
            </div>

            <div className="card" style={{ padding: '18px 22px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Total Dishes Sold
              </span>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#3b82f6', marginTop: '4px' }}>
                {totalItemsSold} items
              </div>
            </div>
          </div>

          {/* Row 1: Sales Trend Chart */}
          <div className="card" style={{ padding: '22px', marginBottom: '24px' }}>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Sales Over Time</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Revenue progression for selected period
              </p>
            </div>

            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Sales']}
                    contentStyle={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--primary)', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Category Pie + Payment Method Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '24px',
              marginBottom: '24px'
            }}
          >
            {/* Sales by Category */}
            <div className="card" style={{ padding: '22px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Sales by Category</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Revenue share across menu categories
                </p>
              </div>

              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Method Distribution */}
            <div className="card" style={{ padding: '22px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Payment Method Breakdown</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Revenue collected by payment mode
                </p>
              </div>

              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                    <XAxis dataKey="method" stroke="var(--text-muted)" fontSize={11} />
                    <YAxis
                      stroke="var(--text-muted)"
                      fontSize={11}
                      tickFormatter={(val) => `₹${val}`}
                    />
                    <Tooltip formatter={(value) => [formatCurrency(value), 'Collected']} />
                    <Bar dataKey="amount" fill="var(--secondary)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 3: Top Selling Items Table */}
          <div className="card" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
              Top Selling Food Items in Period
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    <th style={{ padding: '8px 12px' }}>Rank</th>
                    <th style={{ padding: '8px 12px' }}>Item Name</th>
                    <th style={{ padding: '8px 12px' }}>Category</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Units Sold</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Gross Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700 }}>#{idx + 1}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.name}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className="badge badge-neutral">{item.category}</span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>
                        {formatCurrency(item.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
