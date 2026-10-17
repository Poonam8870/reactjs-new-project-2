import React from 'react';

const storeStats = [
  { value: '125+', label: 'Unique Products' },
  { value: '10k+', label: 'Happy Customers' },
  { value: '40+', label: 'Brands' },
  { value: '70+', label: 'Countries' },
];

export default function AboutStore() {
  return (
    <section id="about-store" className="bg-[#f4f4f4] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
        <div>
          <span className="inline-flex border border-teal-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-800">
            Who We Are
          </span>
          <h2 className="mt-3 text-3xl font-black uppercase text-slate-900 sm:text-4xl">
            About Store
          </h2>
          <div className="mt-4 max-w-xl space-y-4 text-xs leading-6 text-slate-700 sm:text-sm">
            <p>
              We offer a wide range of pharmaceutical tablets, capsules, creams, and injections. With modern sourcing and formulation partners, we work to provide suitable medicines for our customers.
            </p>
            <p>
              Our wholesale team supports pharmacies, hospitals, and distributors with dependable product access and international supply services.
            </p>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-4 sm:mt-8 sm:gap-5">
            {storeStats.map((stat) => (
              <div key={stat.label} className="flex min-h-20 flex-col items-center justify-center bg-white px-3 py-4 text-center">
                <dt className="text-2xl font-extrabold leading-none text-teal-600">{stat.value}</dt>
                <dd className="mt-1.5 text-[10px] font-bold uppercase text-slate-800">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto w-full max-w-lg border-[7px] border-white bg-white shadow-sm lg:max-w-none">
          <img
            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=85"
            alt="Assorted pharmaceutical tablets and capsules"
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}