import React, { useEffect, useMemo, useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from './ProductCard';

export default function FeaturedProductsSection({ onEnquire, onViewDetail }) {
  const { products } = useProducts();
  const featuredProducts = useMemo(
    () => products.filter((product) => product.isFeatured).slice(0, 8),
    [products]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (featuredProducts.length <= 4) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % (featuredProducts.length - 3));
    }, 2400);

    return () => window.clearInterval(timer);
  }, [featuredProducts.length]);

  const visibleProducts = useMemo(() => {
    if (featuredProducts.length <= 4) {
      return featuredProducts.slice(0, 4);
    }

    return Array.from({ length: 4 }, (_, index) => {
      const productIndex = (activeIndex + index) % featuredProducts.length;
      return featuredProducts[productIndex];
    });
  }, [activeIndex, featuredProducts]);

  if (!featuredProducts.length) {
    return null;
  }

  return (
    <section className="bg-[#f3f3f3] py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Feature Products
        </h2>

        <div className="relative mt-8 overflow-hidden">
          <div className="grid grid-cols-1 gap-5 transition-all duration-500 ease-in-out sm:grid-cols-2 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <div key={`${product.id}-${product.name}`} className="transition-all duration-500 ease-in-out animate-[fadeIn_0.5s_ease]">
                <ProductCard
                  product={product}
                  onEnquire={onEnquire}
                  onViewDetail={onViewDetail}
                  compact={true}
                />
              </div>
            ))}
          </div>
        </div>

        {featuredProducts.length > 4 && (
          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: featuredProducts.length - 3 }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`View product slide ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'w-8 bg-teal-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
