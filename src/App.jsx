import React, { useState } from 'react';
import { ProductProvider } from './context/ProductContext';
import { CartProvider, useCart } from './context/CartContext';

// Common components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';

// Storefront components
import HeroBanner from './components/store/HeroBanner';
import ProductCatalog from './components/store/ProductCatalog';
import AboutStore from './components/store/AboutStore';
import FeaturedProductsSection from './components/store/FeaturedProductsSection';
import EnquiryModal from './components/store/EnquiryModal';
import ProductDetailModal from './components/store/ProductDetailModal';

function AppContent() {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryTargetProduct, setEnquiryTargetProduct] = useState(null);
  const { setActiveProductModal } = useCart();

  const handleOpenEnquiry = (product = null) => {
    setEnquiryTargetProduct(product);
    setIsEnquiryModalOpen(true);
  };

  const handleOpenProductDetails = (product = null) => {
    setActiveProductModal(product);
  };

  const handleScrollToCatalog = () => {
    const catalogElement = document.getElementById('product-catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Vital Medex Navbar */}
      <Navbar 
        onOpenEnquiry={handleOpenEnquiry}
      />

      {/* Main Content */}
      <main className="flex-1">
        <HeroBanner 
          onBrowseClick={handleScrollToCatalog}
          onOpenEnquiry={handleOpenEnquiry}
        />
        <div id="product-catalog">
          <ProductCatalog 
            onEnquire={handleOpenEnquiry}
            onViewDetail={handleOpenProductDetails}
          />
        </div>
        <AboutStore />
        <FeaturedProductsSection 
          onEnquire={handleOpenEnquiry}
          onViewDetail={handleOpenProductDetails}
        />
      </main>

      {/* Enquiry Form Modal (Saves to sales@vitalmedex.com & Google Sheet) */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => {
          setIsEnquiryModalOpen(false);
          if (enquiryTargetProduct) {
            setActiveProductModal(enquiryTargetProduct);
          }
          setEnquiryTargetProduct(null);
        }}
        initialProduct={enquiryTargetProduct}
      />

      <ProductDetailModal
        onGetBestPrice={(product) => {
          setActiveProductModal(null);
          setEnquiryTargetProduct(product);
          setIsEnquiryModalOpen(true);
        }}
      />

      {/* Floating 1-Click WhatsApp Quick Desk */}
      <WhatsAppButton />

      {/* Clean Footer */}
      <Footer 
        onOpenEnquiry={handleOpenEnquiry}
      />
    </div>
  );
}

export default function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ProductProvider>
  );
}
