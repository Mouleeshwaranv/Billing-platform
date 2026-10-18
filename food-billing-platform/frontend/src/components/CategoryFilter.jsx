import React from 'react';
import { Utensils, Coffee, Flame, Soup, Layers, Sparkles } from 'lucide-react';

const CATEGORY_ICONS = {
  All: Sparkles,
  Tiffin: Layers,
  'Rice and Meals': Soup,
  'Fast Food': Flame,
  Biryani: Utensils,
  Drinks: Coffee
};

const CategoryFilter = ({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
  categoryCounts = {}
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
      className="category-scroll-container"
    >
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        const Icon = CATEGORY_ICONS[cat] || Utensils;
        const count = categoryCounts[cat];

        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-full)',
              border: isSelected
                ? '1px solid var(--primary)'
                : '1px solid var(--border-subtle)',
              backgroundColor: isSelected
                ? 'var(--primary)'
                : 'var(--bg-surface)',
              color: isSelected ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: isSelected ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              boxShadow: isSelected ? '0 2px 6px var(--primary-glow)' : 'var(--shadow-xs)'
            }}
          >
            <Icon size={16} strokeWidth={isSelected ? 2.5 : 2} />
            <span>{cat}</span>
            {count !== undefined && (
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isSelected
                    ? 'rgba(255, 255, 255, 0.25)'
                    : 'var(--bg-surface-subtle)',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: 600
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
