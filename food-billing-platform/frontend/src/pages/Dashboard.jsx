import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IndianRupee,
  Receipt,
  UtensilsCrossed,
  TrendingUp,
  PlusCircle,
  MenuSquare,
  Eye,
  Calendar,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import DashboardCard from '../components/DashboardCard';
import Modal from '../components/Modal';
import ReceiptComponent from '../components/Receipt';
import {
  getStoredBills,
  getStoredFoodItems,
  getStoredSettings,
  formatCurrency,
  formatDateTime
} from '../utils/billingUtils';

const Dashboard = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [settings, setSettings] = useState(null);
  const [selectedReceiptBill, setSelectedReceiptBill] = useState(null);

  useEffect(() => {
    setBills(getStoredBills());
    setFoodItems(getStoredFoodItems());
    setSettings(getStoredSettings());
  }, []);

  // Filter today's bills
  const today = new Date().toDateString();
  const todayBills = bills.filter((b) => {
    const billDate = new Date(b.createdAt).toDateString();
    return billDate === today;
  });

  const todaySales = todayBills.reduce((acc, b) => acc + (b.finalAmount || 0), 0);
  const todayCount = todayBills.length;
  const availableItemsCount = foodItems.filter((i) => i.isAvailable !== false).length;
  const avgBillValue = todayCount > 0 ? todaySales / todayCount : 0;

  // Hourly distribution for Today's Sales chart
  const hoursMap = {};
  for (let h = 8; h <= 22; h += 2) {
    const label = `${h > 12 ? h - 12 : h} ${h >= 12 ? 'PM' : 'AM'}`;
    hoursMap[label] = 0;
  }

  todayBills.forEach((b) => {
    const hour = new Date(b.createdAt).getHours();
    // Bucket to nearest even hour
    const bucketHour = Math.min(22, Math.max(8, Math.round(hour / 2) * 2));
    const label = `${bucketHour > 12 ? bucketHour - 12 : bucketHour} ${bucketHour >= 12 ? 'PM' : 'AM'}`;
    if (hoursMap[label] !== undefined) {
      hoursMap[label] += b.finalAmount || 0;
    }
  });

  const chartData = Object.keys(hoursMap).map((time) => ({
    time,
    sales: Number(hoursMap[time].toFixed(2))
  }));

  // Calculate Most Frequently Sold Food Items across stored bills
  const itemSalesMap = {};
  bills.forEach((b) => {
    (b.items || []).forEach((item) => {
      if (!itemSalesMap[item.name]) {
        itemSalesMap[item.name] = {
          name: item.name,
          category: item.category || 'Food',
          quantity: 0,
          revenue: 0
        };
      }
      itemSalesMap[item.name].quantity += item.quantity || 0;
      itemSalesMap[item.name].revenue += (item.quantity || 0) * (item.price || 0);
    });
  });

  const topSoldItems = Object.values(itemSalesMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Recent transactions (latest 6 bills)
  const recentBills = bills.slice(0, 6);

  return (
    <div className="page-container">
      {/* Top Header & Quick Actions */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Restaurant Dashboard</span>
          </h1>
          <p className="page-subtitle">
            Real-time business performance overview & counter activity
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="btn btn-secondary"
          >
            <MenuSquare size={16} />
            <span>Manage Menu</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/billing')}
            className="btn btn-primary"
            style={{ fontWeight: 700, boxShadow: '0 4px 12px var(--primary-glow)' }}
          >
            <PlusCircle size={16} />
            <span>Create New Bill</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}
      >
        <DashboardCard
          title="Today's Sales"
          value={formatCurrency(todaySales)}
          subtitle="Live gross total today"
          icon={IndianRupee}
          colorScheme="orange"
          trend={{ text: '+12%', isPositive: true }}
        />
        <DashboardCard
          title="Bills Generated Today"
          value={todayCount}
          subtitle="Customer receipts issued"
          icon={Receipt}
          colorScheme="blue"
          trend={{ text: `${todayCount} orders`, isPositive: true }}
        />
        <DashboardCard
          title="Food Items Available"
          value={`${availableItemsCount} / ${foodItems.length}`}
          subtitle="Active items on menu"
          icon={UtensilsCrossed}
          colorScheme="green"
        />
        <DashboardCard
          title="Average Bill Value"
          value={formatCurrency(avgBillValue)}
          subtitle="Per customer average"
          icon={TrendingUp}
          colorScheme="amber"
        />
      </div>

      {/* Grid: Sales Chart + Top Items */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.2fr',
          gap: '24px',
          marginBottom: '28px'
        }}
        className="dashboard-charts-grid"
      >
        {/* Sales Chart Card */}
        <div className="card" style={{ padding: '22px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Today's Sales Activity</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Hourly breakdown of revenue generated today
              </p>
            </div>
            <span className="badge badge-primary">Hourly Trend</span>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis
                  dataKey="time"
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-medium)',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-md)',
                            fontSize: '0.82rem'
                          }}
                        >
                          <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{label}</div>
                          <div style={{ fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                            Sales: {formatCurrency(payload[0].value)}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Food Items */}
        <div className="card" style={{ padding: '22px', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Popular Items</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Most frequently ordered dishes
              </p>
            </div>
            <span className="badge badge-success">Top Sold</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {topSoldItems.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto 0' }}>
                No sales recorded yet.
              </div>
            ) : (
              topSoldItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: idx === 0 ? 'var(--primary)' : 'var(--bg-muted)',
                        color: idx === 0 ? '#ffffff' : 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {item.quantity} sold
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {formatCurrency(item.revenue)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="card" style={{ padding: '22px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Transactions</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Latest customer bills generated at the billing counter
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/history')}
            className="btn btn-secondary btn-sm"
          >
            <span>View All History</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {recentBills.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
            No bills created yet. Create a bill from the POS screen!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.86rem',
                textAlign: 'left'
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--border-medium)',
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  <th style={{ padding: '10px 14px' }}>Bill #</th>
                  <th style={{ padding: '10px 14px' }}>Date & Time</th>
                  <th style={{ padding: '10px 14px' }}>Items</th>
                  <th style={{ padding: '10px 14px' }}>Method</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBills.map((bill) => (
                  <tr
                    key={bill.id || bill.billNumber}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.1s'
                    }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {bill.billNumber}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                      {formatDateTime(bill.createdAt)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-neutral">
                        {bill.itemCount || (bill.items ? bill.items.length : 0)} items
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
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
                    <td
                      style={{
                        padding: '12px 14px',
                        textAlign: 'right',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        fontSize: '0.92rem'
                      }}
                    >
                      {formatCurrency(bill.finalAmount)}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedReceiptBill(bill)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        title="View & Print Receipt"
                      >
                        <Eye size={13} />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Receipt Preview Modal */}
      <Modal
        isOpen={!!selectedReceiptBill}
        onClose={() => setSelectedReceiptBill(null)}
        title={`Receipt Preview — ${selectedReceiptBill?.billNumber || ''}`}
        maxWidth="440px"
      >
        {selectedReceiptBill && (
          <ReceiptComponent
            bill={selectedReceiptBill}
            settings={settings}
            onClose={() => setSelectedReceiptBill(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
