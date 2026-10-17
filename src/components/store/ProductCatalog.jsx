import React, { useEffect, useMemo, useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from './ProductCard';

export default function ProductCatalog({ onEnquire, onViewDetail }) {
  const { filteredProducts } = useProducts();
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const maxIndex = Math.max(0, filteredProducts.length - visibleCount);
  const safeIndex = Math.min(activeIndex, maxIndex);
  const visibleProducts = useMemo(
    () => filteredProducts.slice(safeIndex, safeIndex + visibleCount),
    [filteredProducts, safeIndex, visibleCount]
  );

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      setVisibleCount(width >= 1280 ? 5 : width >= 1024 ? 4 : width >= 768 ? 3 : width >= 640 ? 2 : 1);
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  useEffect(() => {
    if (maxIndex === 0) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index >= maxIndex ? 0 : index + 1));
    }, 2600);

    return () => window.clearInterval(timer);
  }, [maxIndex]);

  return (
    <section className="bg-[#f7f7f7] py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-3 sm:px-4">
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,204px),204px))] justify-center gap-5 sm:gap-6">
              {visibleProducts.map((product) => (
                <div key={product.id} className="animate-[fadeIn_0.5s_ease]">
                  <ProductCard
                    product={product}
                    onEnquire={onEnquire}
                    onViewDetail={onViewDetail}
                  />
                </div>
              ))}
            </div>

            {maxIndex > 0 && (
              <div className="mt-5 flex items-center justify-center gap-2">
                {Array.from({ length: maxIndex + 1 }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`View product slide ${index + 1}`}
                    aria-current={safeIndex === index ? 'true' : undefined}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      safeIndex === index
                        ? 'w-8 bg-teal-600'
                        : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-700">No products found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
