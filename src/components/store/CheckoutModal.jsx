import React, { useState } from 'react';
import { 
  X, CheckCircle, ShieldCheck, MapPin, Phone, CreditCard, 
  Building2, FileText, ArrowRight, Printer, AlertTriangle 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CheckoutModal() {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cartItems, 
    cartSubtotal, 
    cartHasRx, 
    placeOrder,
    prescriptions,
    setIsPrescriptionModalOpen
  } = useCart();
  const { currentUser } = useAuth();

  const [shippingData, setShippingData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: 'Shop No 14, Main Medical Complex, Civil Lines',
    city: 'Nagpur',
    state: 'Maharashtra',
    pincode: '440001',
    company: currentUser?.company || '',
    gstin: currentUser?.gstin || '',
    requireGstBill: !!currentUser?.gstin,
    paymentMethod: 'UPI / Online Banking'
  });

  const [orderComplete, setOrderComplete] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isCheckoutOpen) return null;

  const gstAmount = Math.round(cartSubtotal * 0.12);
  const totalAmount = cartSubtotal + gstAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const order = placeOrder({
        customerName: shippingData.name,
        email: shippingData.email,
        phone: shippingData.phone,
        shippingAddress: `${shippingData.address}, ${shippingData.city}, ${shippingData.state} - ${shippingData.pincode}`,
        gstin: shippingData.requireGstBill ? shippingData.gstin : null,
        company: shippingData.company,
        paymentMethod: shippingData.paymentMethod,
        total: totalAmount,
        items: cartItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.quantity >= (item.product.moq || 1) ? item.product.wholesalePrice : item.product.price
        })),
        hasPrescription: cartHasRx,
        prescriptionFile: prescriptions[0]?.fileName || (cartHasRx ? 'Doctor_Rx_Verified.pdf' : null)
      });

      setLoading(false);
      setOrderComplete(order);
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold">
              {orderComplete ? 'Order Receipt & Confirmation' : 'Complete Pharmaceutical Order'}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setOrderComplete(null);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {orderComplete ? (
            /* Order Success View */
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full">
                  Order Successfully Placed
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  Invoice #{orderComplete.id}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Thank you! Your medicine order has been logged into Vital Medex dispatch warehouse.
                </p>
              </div>

              {/* Order Invoice Details Slip */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-3">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Buyer Name:</span>
                  <span className="font-bold text-slate-800">{orderComplete.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Contact / WhatsApp:</span>
                  <span className="font-bold text-slate-800">{orderComplete.phone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Delivery Address:</span>
                  <span className="font-bold text-slate-800 text-right max-w-xs">{orderComplete.shippingAddress}</span>
                </div>
                {orderComplete.gstin && (
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Buyer GSTIN:</span>
                    <span className="font-bold text-teal-700">{orderComplete.gstin}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-bold text-slate-800">{orderComplete.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Rx Verification:</span>
                  <span className="font-bold text-emerald-600">Attached & Verified</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-1">
                  <span className="text-slate-900">Total Invoiced (Inc. 12% GST):</span>
                  <span className="text-teal-700">₹{orderComplete.total}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Tax Invoice</span>
                </button>

                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setOrderComplete(null);
                  }}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Rx Warning */}
              {cartHasRx && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-center justify-between text-amber-900">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>This order includes Schedule H/Prescription drugs.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPrescriptionModalOpen(true)}
                    className="font-bold text-amber-800 underline hover:text-amber-950"
                  >
                    {prescriptions.length > 0 ? 'Change Rx' : 'Attach Rx'}
                  </button>
                </div>
              )}

              {/* Buyer Information */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  1. Buyer & Shipping Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Full Name / Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingData.name}
                      onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Street Address / Pharmacy Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingData.state}
                      onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingData.pincode}
                      onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* B2B Tax Invoicing */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    2. GST Invoicing (B2B Tax Credit)
                  </h4>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-teal-700">
                    <input
                      type="checkbox"
                      checked={shippingData.requireGstBill}
                      onChange={(e) => setShippingData({ ...shippingData, requireGstBill: e.target.checked })}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Add GST Number</span>
                  </label>
                </div>

                {shippingData.requireGstBill && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-teal-50/60 rounded-xl border border-teal-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Pharmacy / Clinic Name
                      </label>
                      <input
                        type="text"
                        placeholder="Apollo Chemist"
                        value={shippingData.company}
                        onChange={(e) => setShippingData({ ...shippingData, company: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        GSTIN Number
                      </label>
                      <input
                        type="text"
                        placeholder="27AAAAA0000A1Z5"
                        value={shippingData.gstin}
                        onChange={(e) => setShippingData({ ...shippingData, gstin: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Mode */}
              <div className="pt-3 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  3. Select Payment Method
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {['UPI / Online Banking', 'Cash on Delivery', 'Wholesale Wire (RTGS)'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setShippingData({ ...shippingData, paymentMethod: method })}
                      className={`p-3 rounded-xl border text-left font-semibold transition ${
                        shippingData.paymentMethod === method
                          ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Bar */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Total Payable</span>
                  <span className="text-lg font-black text-slate-900">₹{totalAmount}</span>
                  <span className="text-[10px] text-slate-500 block">Includes ₹{gstAmount} GST</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="py-3 px-6 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 flex items-center gap-2 transition"
                >
                  {loading ? 'Processing Order...' : 'Place Confirmed Order'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
