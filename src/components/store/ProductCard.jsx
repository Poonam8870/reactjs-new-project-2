import React from 'react';

export default function ProductCard({ product, onEnquire, onViewDetail, compact = false }) {
  const cardClasses = compact
    ? 'flex h-full flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.05)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-md'
    : 'flex h-full flex-col overflow-hidden rounded-[16px] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-md';

  const imageWrapperClasses = compact
    ? 'bg-[#f2f2f2] p-2 sm:p-2.5'
    : 'bg-[#f3f3f3] p-2 sm:p-2.5';

  const imageClasses = compact
    ? 'flex h-[155px] items-center justify-center overflow-hidden rounded-[8px] bg-[#f2f2f2] sm:h-[165px] md:h-[175px] lg:h-[160px] xl:h-[170px]'
    : 'flex h-[215px] items-center justify-center overflow-hidden rounded-[8px] bg-[#f3f3f3] sm:h-[225px] md:h-[235px] lg:h-[215px] xl:h-[225px]';

  const titleClasses = compact
    ? 'mb-2 min-h-[38px] text-center text-[14px] font-semibold leading-tight text-[#0b7fa7] sm:text-[16px] md:min-h-[42px]'
    : 'mb-2 min-h-[44px] text-center text-[16px] font-semibold leading-tight text-[#0b7fa7] sm:text-[17px] md:min-h-[48px]';

  const buttonClasses = compact
    ? 'w-full max-w-[132px] rounded-full bg-[#0e5a8a] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0b4b76]'
    : 'w-full max-w-[160px] rounded-full bg-[#0e5a8a] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b4b76]';

  return (
    <div className="w-full">
      <div className={cardClasses}>
        <div className={imageWrapperClasses}>
          <div className={imageClasses}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="text-slate-300">No Image</div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-between px-2.5 pb-3 pt-2.5 text-center sm:px-3 sm:pb-4 sm:pt-3">
          <h3 className={titleClasses}>
            {product.name}
          </h3>

          <button
            type="button"
            onClick={() => onViewDetail(product)}
            className={buttonClasses}
          >
            Read more
          </button>
        </div>
      </div>
    </div>
  );
}
