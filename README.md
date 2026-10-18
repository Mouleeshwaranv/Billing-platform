# 🍽️ Smart Food Billing Platform — Restaurant POS & Thermal Receipts

A modern, fast, and fully responsive **Food Billing Platform** built with **React**, **Vite**, **Vanilla CSS**, **Lucide Icons**, and **Recharts**.

Designed specifically for restaurants, cafes, hotels, messes, and fast-food counters to punch customer orders rapidly, automatically calculate bills with discounts and taxes, and generate professional **58mm / 80mm thermal receipts** ready for instant printing.

---

## 🚀 Key Features

- **⚡ Fast POS Billing Terminal**:
  - Live food menu search by name or category.
  - Interactive dish cards with real-time stock indicators.
  - Quick quantity stepper (`+` / `-`), line total calculations, and item removals.
  - Subtotal, flexible discounts (₹ Fixed or % Percentage), and configurable tax rate.
  - Payment modes: **Cash** (with cash-tendered & return change calculator), **UPI QR simulation**, **Card**, and **Other**.
- **🧾 Thermal Receipt Printing**:
  - Pixel-perfect 58mm compact and 80mm standard receipt layouts.
  - Clean `@media print` CSS rules: only prints the receipt, cleanly hiding navigation, sidebars, and buttons.
- **📊 Business Dashboard & Analytics**:
  - Live sales counter, bills generated, active menu dishes, and average ticket size.
  - Recharts hourly sales area chart and top 5 frequently ordered dishes.
  - Recent transactions table with one-click receipt reprinting.
- **🍛 Rich Menu Management**:
  - 31 built-in Indian cuisine dishes across **Tiffin, Rice and Meals, Fast Food, Biryani, and Drinks**.
  - All dishes feature high-resolution imagery stored locally in `public/images/`.
  - Full CRUD: Add, edit, delete dishes, update prices, and toggle in-stock / sold-out status.
- **📜 Bill & Transaction History**:
  - Search invoices by bill number, date range, or payment method.
  - Reprint receipts at any time.
- **📈 Comprehensive Sales Reports**:
  - Filter by Today, Last 7 Days, Last 30 Days, or All Time.
  - Interactive Sales Trend line chart, Category Share pie chart, and Payment Method bar chart.
  - One-click **Export to CSV** functionality.
- **⚙️ Custom Settings**:
  - Configure restaurant name, address, phone, GSTIN, default tax %, paper width, and footer message.
  - Theme switcher: Light (Warm White) & Dark (Charcoal) modes.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, JavaScript ES6+
- **Bundler & Dev Server**: Vite
- **Styling**: Vanilla CSS (Custom Design System with CSS variables and thermal print styles)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Charts & Data Visualization**: Recharts
- **Data Persistence**: Browser `localStorage` (Isolated demo storage with zero server setup)

---

## 📁 Project Structure

```
Billing-platform/
├── food-billing-platform/
│   └── frontend/
│       ├── public/
│       │   └── images/              # 31 local high-res food dish images
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   │   ├── Navbar.jsx       # Top navigation with live clock & theme toggle
│       │   │   ├── Sidebar.jsx      # Navigation sidebar with responsive drawer
│       │   │   ├── FoodCard.jsx     # Dish card with image & add-to-bill controls
│       │   │   ├── CategoryFilter.jsx # Category pill filters with item counts
│       │   │   ├── Cart.jsx         # Current order stepper & line totals
│       │   │   ├── BillSummary.jsx  # Calculation engine (Subtotal, Discount, Tax, Total)
│       │   │   ├── Receipt.jsx      # Thermal-printer receipt (58mm / 80mm)
│       │   │   ├── DashboardCard.jsx# Key metric cards
│       │   │   └── Modal.jsx        # Reusable modal dialog
│       │   ├── pages/
│       │   │   ├── Dashboard.jsx    # Overview dashboard & sales trend
│       │   │   ├── Billing.jsx      # POS billing screen & checkout modal
│       │   │   ├── MenuManagement.jsx # Food item CRUD & availability switch
│       │   │   ├── BillHistory.jsx  # Invoices search & receipt reprints
│       │   │   ├── Reports.jsx      # Analytics & CSV export
│       │   │   └── Settings.jsx     # Shop profile, tax & receipt preferences
│       │   ├── data/
│       │   │   └── foodItems.js     # 31 default restaurant menu items
│       │   ├── utils/
│       │   │   └── billingUtils.js  # Math formulas, currency formatting & storage
│       │   ├── App.jsx              # Routing & theme state
│       │   ├── main.jsx             # React entry point
│       │   └── index.css            # Complete design system & print styles
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
├── .gitignore
└── README.md
```

---

## ⚡ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Mouleeshwaranv/Billing-platform.git
cd Billing-platform
```

### 2. Navigate to frontend & install dependencies
```bash
cd food-billing-platform/frontend
npm install
```

### 3. Start the Vite development server
```bash
npm run dev
```

Open your browser at `http://localhost:5173/` to view the platform.

### 4. Build for Production
```bash
npm run build
```

---

## 🧮 Billing Formulas

$$\text{Line Total} = \text{Unit Price} \times \text{Quantity}$$
$$\text{Subtotal} = \sum \text{Line Totals}$$
$$\text{Final Total} = \text{Subtotal} - \text{Discount} + \text{Tax}$$
$$\text{Change Due} = \text{Amount Received} - \text{Final Total}$$

---

## 📄 License

This project is licensed under the MIT License.
