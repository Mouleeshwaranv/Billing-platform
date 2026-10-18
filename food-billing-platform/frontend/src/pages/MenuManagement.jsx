import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  RotateCcw,
  UtensilsCrossed,
  Image as ImageIcon
} from 'lucide-react';
import Modal from '../components/Modal';
import { FOOD_CATEGORIES, INITIAL_FOOD_ITEMS } from '../data/foodItems';
import {
  getStoredFoodItems,
  saveStoredFoodItems,
  formatCurrency
} from '../utils/billingUtils';

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Form input state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tiffin',
    price: '',
    description: '',
    image: '',
    isAvailable: true
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setItems(getStoredFoodItems());
  }, []);

  const persistItems = (newItems) => {
    setItems(newItems);
    saveStoredFoodItems(newItems);
  };

  // Open modal to add new item
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: selectedCategory === 'All' ? 'Tiffin' : selectedCategory,
      price: '',
      description: '',
      image: '',
      isAvailable: true
    });
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Open modal to edit existing item
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description || '',
      image: item.image || '',
      isAvailable: item.isAvailable !== false
    });
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Open delete confirmation modal
  const handleOpenDelete = (item) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  // Save form (Add or Edit)
  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Please enter a food item name.');
      return;
    }
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setFormError('Please enter a valid non-negative price.');
      return;
    }

    if (editingItem) {
      // Update
      const updated = items.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: formData.name.trim(),
              category: formData.category,
              price: priceNum,
              description: formData.description.trim(),
              image: formData.image.trim(),
              isAvailable: formData.isAvailable
            }
          : item
      );
      persistItems(updated);
    } else {
      // Create new
      const newItem = {
        id: `food-${Date.now()}`,
        name: formData.name.trim(),
        category: formData.category,
        price: priceNum,
        description: formData.description.trim(),
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80',
        isAvailable: formData.isAvailable
      };
      persistItems([newItem, ...items]);
    }

    setIsFormModalOpen(false);
  };

  // Delete item
  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    const updated = items.filter((item) => item.id !== deletingItem.id);
    persistItems(updated);
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
  };

  // Toggle availability inline
  const handleToggleAvailability = (itemId) => {
    const updated = items.map((item) =>
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    );
    persistItems(updated);
  };

  // Reset to default sample menu
  const handleResetDefaults = () => {
    if (window.confirm('Reset menu items back to default sample items? Any custom items will be overwritten.')) {
      persistItems(INITIAL_FOOD_ITEMS);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Menu Management</span>
          </h1>
          <p className="page-subtitle">
            Create, update, toggle availability, and configure restaurant dishes
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="btn btn-secondary"
            title="Restore default sample menu"
          >
            <RotateCcw size={15} />
            <span>Restore Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn btn-primary"
            style={{ fontWeight: 700, boxShadow: '0 4px 12px var(--primary-glow)' }}
          >
            <Plus size={16} />
            <span>Add Food Item</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {FOOD_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ width: '280px' }} className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search dish or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ height: '36px' }}
            />
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
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
                <th style={{ padding: '12px 18px' }}>Dish / Item</th>
                <th style={{ padding: '12px 18px' }}>Category</th>
                <th style={{ padding: '12px 18px' }}>Price</th>
                <th style={{ padding: '12px 18px' }}>Availability</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No food items match your search.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.1s'
                    }}
                    className="table-row-hover"
                  >
                    {/* Item Name & Thumb */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-muted)',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => (e.target.style.display = 'none')}
                            />
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-muted)'
                              }}
                            >
                              <UtensilsCrossed size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            {item.name}
                          </div>
                          {item.description && (
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                maxWidth: '320px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px 18px' }}>
                      <span className="badge badge-neutral">{item.category}</span>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary)' }}>
                      {formatCurrency(item.price)}
                    </td>

                    {/* Availability Switch */}
                    <td style={{ padding: '14px 18px' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`badge ${item.isAvailable !== false ? 'badge-success' : 'badge-danger'}`}
                        style={{ cursor: 'pointer', border: 'none', padding: '5px 10px' }}
                        title="Click to toggle availability"
                      >
                        {item.isAvailable !== false ? '● In Stock' : '○ Sold Out'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="btn btn-secondary btn-icon"
                          title="Edit item"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(item)}
                          className="btn btn-danger-outline btn-icon"
                          title="Delete item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: ADD / EDIT FOOD ITEM ================= */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingItem ? 'Edit Food Item' : 'Add New Food Item'}
        maxWidth="500px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveItem}
              className="btn btn-primary"
              style={{ fontWeight: 700 }}
            >
              {editingItem ? 'Save Changes' : 'Create Item'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {formError && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger)',
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Food Item Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Masala Dosa, Chicken Biryani"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-control"
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-control"
              >
                {FOOD_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Price in ₹ *</label>
              <input
                type="number"
                required
                min="0"
                step="any"
                placeholder="e.g. 75"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Description / Ingredients</label>
            <textarea
              rows={2}
              placeholder="Brief description, serving details, condiments..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="form-control"
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Leave empty for default food illustration
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
            <input
              type="checkbox"
              id="isAvailableCheckbox"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="isAvailableCheckbox" style={{ fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
              Available in Kitchen for Ordering
            </label>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Food Item?"
        maxWidth="420px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="btn btn-danger"
            >
              Delete Item
            </button>
          </>
        }
      >
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
          Are you sure you want to remove <strong>"{deletingItem?.name}"</strong> from your restaurant menu?
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
          This will delete the item from localStorage. Past bills will retain their original item details.
        </p>
      </Modal>
    </div>
  );
};

export default MenuManagement;
