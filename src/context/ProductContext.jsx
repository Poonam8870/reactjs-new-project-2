import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_PRODUCTS, mergeImageCatalog } from '../data/initialProducts';

const ProductContext = createContext();
const legacyProductNames = new Set(['Fempro Letrozole 2.5mg Tablets', 'Hydrobact Hydroquinone 4% Cream']);
const legacyProductIds = new Set(['med-7', 'med-8']);

const sanitizeProducts = (products) => {
  if (!Array.isArray(products)) return [];
  return products.filter(product => !legacyProductIds.has(product.id) && !legacyProductNames.has(product.name));
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('sigmamedex_products');
      const parsed = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
      return sanitizeProducts(mergeImageCatalog(parsed));
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterRxOnly, setFilterRxOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Load from SQLite on mount
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setProducts(mergeImageCatalog(sanitizeProducts(data)));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('sigmamedex_products', JSON.stringify(products));
  }, [products]);

  // CRUD Operations with SQLite backend
  const addProduct = (newProduct) => {
    const item = {
      id: 'med-' + Date.now(),
      name: newProduct.name,
      genericName: newProduct.genericName || newProduct.name,
      category: newProduct.category || 'Tablets',
      price: Number(newProduct.price) || 0,
      wholesalePrice: Number(newProduct.wholesalePrice) || Math.round(Number(newProduct.price) * 0.7),
      moq: Number(newProduct.moq) || 1,
      packSize: newProduct.packSize || 'Box / Strip',
      manufacturer: newProduct.manufacturer || 'Vital Medex Partner',
      prescriptionRequired: Boolean(newProduct.prescriptionRequired),
      stock: Number(newProduct.stock) || 100,
      rating: 4.8,
      reviewsCount: 12,
      isFeatured: Boolean(newProduct.isFeatured),
      isBestSeller: false,
      image: newProduct.image?.trim() || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      description: newProduct.description || 'Quality pharmaceutical formulation supplied under strict GMP standards.',
      composition: newProduct.composition || 'Active Pharmaceutical Ingredient',
      storage: newProduct.storage || 'Store below 25°C in a cool, dry place.',
      dosage: newProduct.dosage || 'As directed by Physician.',
    };

    setProducts(prev => [item, ...prev]);

    // Send to SQLite
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }).catch(() => {});

    return item;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updatedFields,
          price: updatedFields.price !== undefined ? Number(updatedFields.price) : p.price,
          wholesalePrice: updatedFields.wholesalePrice !== undefined ? Number(updatedFields.wholesalePrice) : p.wholesalePrice,
          stock: updatedFields.stock !== undefined ? Number(updatedFields.stock) : p.stock,
          moq: updatedFields.moq !== undefined ? Number(updatedFields.moq) : p.moq,
        };
      }
      return p;
    }));

    fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    }).catch(() => {});
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    fetch(`/api/products/${id}`, {
      method: 'DELETE'
    }).catch(() => {});
  };

  const resetToDefaults = () => {
    const safeDefaults = sanitizeProducts(INITIAL_PRODUCTS);
    setProducts(safeDefaults);
    localStorage.removeItem('sigmamedex_products');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (filterRxOnly && !item.prescriptionRequired) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesGeneric = item.genericName?.toLowerCase().includes(q);
        const matchesCategory = item.category?.toLowerCase().includes(q);
        const matchesMfr = item.manufacturer?.toLowerCase().includes(q);
        if (!matchesName && !matchesGeneric && !matchesCategory && !matchesMfr) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [products, selectedCategory, filterRxOnly, searchQuery, sortBy]);

  return (
    <ProductContext.Provider value={{
      products,
      filteredProducts,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      filterRxOnly,
      setFilterRxOnly,
      sortBy,
      setSortBy,
      addProduct,
      updateProduct,
      deleteProduct,
      resetToDefaults,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}
