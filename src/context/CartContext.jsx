import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const INITIAL_INQUIRIES = [
  {
    id: 'inq-101',
    productName: 'A RET TRETIGEL 0.1% 20 MG GEL',
    buyerName: 'Dr. Vivek Mehra',
    email: 'vivek@delhiclinic.com',
    phone: '+91 9811223344',
    city: 'New Delhi',
    country: 'India',
    quantity: '50 Strips',
    message: 'Looking for regular monthly clinic supply with cold-chain shipping.',
    date: '2026-09-28',
    status: 'In Progress'
  },
  {
    id: 'inq-102',
    productName: 'Semaglutide Tablets',
    buyerName: 'Metro Hospital Procurement',
    email: 'procure@metrohospitals.in',
    phone: '+91 9922334455',
    city: 'Mumbai',
    country: 'India',
    quantity: '200 Ampoules',
    message: 'Please send formal GST quote and WHO-GMP batch test certificates.',
    date: '2026-09-30',
    status: 'New'
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-8821',
    customerName: 'Dr. Rajesh Sharma',
    email: 'rajesh@apollohealth.com',
    phone: '+91 9876543210',
    shippingAddress: 'Flat 402, Green Avenue, Ramdaspeth, Nagpur, Maharashtra - 440010',
    gstin: '27AAAAA0000A1Z5',
    date: '2026-09-29',
    total: 3960,
    paymentMethod: 'UPI / Online Banking',
    paymentStatus: 'Paid',
    orderStatus: 'Dispatched',
    items: [
      { id: 'med-1', name: 'Zopiclone Tablet 10mg', quantity: 6, price: 420 }
    ],
    hasPrescription: true,
    prescriptionFile: 'Dr_Prescription_Sharma.pdf'
  },
  {
    id: 'ORD-8822',
    customerName: 'Sanjay Deshmukh',
    email: 'sanjay@citymed.in',
    phone: '+91 9822334455',
    shippingAddress: 'Plot 12, Medical Square, Nagpur - 440009',
    gstin: '27AEPFS7579K1ZW',
    date: '2026-10-01',
    total: 480,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending (COD)',
    orderStatus: 'Confirmed',
    items: [
      { id: 'med-2', name: 'Pregabalin 150mg', quantity: 1, price: 480 }
    ],
    hasPrescription: false,
    prescriptionFile: null
  }
];

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sigmamedex_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('sigmamedex_inquiries');
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    } catch (e) {
      return INITIAL_INQUIRIES;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('sigmamedex_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  });

  const [prescriptions, setPrescriptions] = useState(() => {
    try {
      const saved = localStorage.getItem('sigmamedex_prescriptions');
      return saved ? JSON.parse(saved) : [
        {
          id: 'rx-1',
          fileName: 'Hospital_Prescription_DrMehra.pdf',
          patientName: 'Kavita Deshmukh',
          doctorName: 'Dr. A. K. Joshi (MD)',
          date: '2026-09-25',
          status: 'Verified',
          linkedMedicines: 'Semaglutide 3mg, Isotretinoin 20mg'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // UI state drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);
  const [b2bTargetProduct, setB2bTargetProduct] = useState(null);
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Sync with SQLite backend on initial load
  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setOrders(data);
        }
      })
      .catch(() => {});

    fetch('/api/inquiries')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setInquiries(data);
        }
      })
      .catch(() => {});

    fetch('/api/prescriptions')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setPrescriptions(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('sigmamedex_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('sigmamedex_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('sigmamedex_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sigmamedex_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cartItems.reduce((acc, item) => {
    const isWholesaleTier = item.quantity >= (item.product.moq || 5);
    const unitPrice = isWholesaleTier ? item.product.wholesalePrice : item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const cartHasRx = cartItems.some(item => item.product.prescriptionRequired);

  // Inquiries - Writes to SQLite backend
  const addInquiry = (inquiryData) => {
    const newInquiry = {
      id: 'inq-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'New',
      ...inquiryData
    };

    setInquiries(prev => [newInquiry, ...prev]);

    // Send to SQLite
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInquiry)
    }).catch(() => {});

    return newInquiry;
  };

  const updateInquiryStatus = (id, newStatus) => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    fetch(`/api/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});
  };

  // Prescriptions - Writes to SQLite backend
  const addPrescription = (rxData) => {
    const newRx = {
      id: 'rx-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Verification',
      ...rxData
    };

    setPrescriptions(prev => [newRx, ...prev]);

    fetch('/api/prescriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRx)
    }).catch(() => {});

    return newRx;
  };

  const updatePrescriptionStatus = (id, status) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    fetch(`/api/prescriptions/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(() => {});
  };

  // Orders - Writes directly to SQLite backend!
  const placeOrder = (orderData) => {
    const newOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split('T')[0],
      orderStatus: 'Confirmed',
      paymentStatus: orderData.paymentMethod === 'Cash on Delivery' ? 'Pending (COD)' : 'Paid',
      ...orderData
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Send to SQLite database
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch((err) => {
      console.warn('SQLite order sync note:', err);
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartSubtotal,
      cartHasRx,
      // Modals
      isCartOpen,
      setIsCartOpen,
      isPrescriptionModalOpen,
      setIsPrescriptionModalOpen,
      isB2BModalOpen,
      setIsB2BModalOpen,
      b2bTargetProduct,
      setB2bTargetProduct,
      activeProductModal,
      setActiveProductModal,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isOrdersModalOpen,
      setIsOrdersModalOpen,
      isLoginModalOpen,
      setIsLoginModalOpen,
      isRegisterModalOpen,
      setIsRegisterModalOpen,
      // Inquiries
      inquiries,
      addInquiry,
      updateInquiryStatus,
      // Prescriptions
      prescriptions,
      addPrescription,
      updatePrescriptionStatus,
      // Orders
      orders,
      placeOrder,
      updateOrderStatus,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
