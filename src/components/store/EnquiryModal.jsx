import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Building2, Globe2, Phone, Mail, FileText, Sparkles } from 'lucide-react';

const COUNTRY_OPTIONS = [
  ['AF', 'Afghanistan', '+93'], ['AL', 'Albania', '+355'], ['DZ', 'Algeria', '+213'], ['AD', 'Andorra', '+376'],
  ['AO', 'Angola', '+244'], ['AG', 'Antigua and Barbuda', '+1'], ['AR', 'Argentina', '+54'], ['AM', 'Armenia', '+374'],
  ['AU', 'Australia', '+61'], ['AT', 'Austria', '+43'], ['AZ', 'Azerbaijan', '+994'], ['BS', 'Bahamas', '+1'],
  ['BH', 'Bahrain', '+973'], ['BD', 'Bangladesh', '+880'], ['BB', 'Barbados', '+1'], ['BY', 'Belarus', '+375'],
  ['BE', 'Belgium', '+32'], ['BZ', 'Belize', '+501'], ['BJ', 'Benin', '+229'], ['BT', 'Bhutan', '+975'],
  ['BO', 'Bolivia', '+591'], ['BA', 'Bosnia and Herzegovina', '+387'], ['BW', 'Botswana', '+267'], ['BR', 'Brazil', '+55'],
  ['BN', 'Brunei', '+673'], ['BG', 'Bulgaria', '+359'], ['BF', 'Burkina Faso', '+226'], ['BI', 'Burundi', '+257'],
  ['CV', 'Cabo Verde', '+238'], ['KH', 'Cambodia', '+855'], ['CM', 'Cameroon', '+237'], ['CA', 'Canada', '+1'],
  ['CF', 'Central African Republic', '+236'], ['TD', 'Chad', '+235'], ['CL', 'Chile', '+56'], ['CN', 'China', '+86'],
  ['CO', 'Colombia', '+57'], ['KM', 'Comoros', '+269'], ['CG', 'Congo', '+242'], ['CR', 'Costa Rica', '+506'],
  ['HR', 'Croatia', '+385'], ['CU', 'Cuba', '+53'], ['CY', 'Cyprus', '+357'], ['CZ', 'Czech Republic', '+420'],
  ['DK', 'Denmark', '+45'], ['DJ', 'Djibouti', '+253'], ['DM', 'Dominica', '+1'], ['DO', 'Dominican Republic', '+1'],
  ['EC', 'Ecuador', '+593'], ['EG', 'Egypt', '+20'], ['SV', 'El Salvador', '+503'], ['GQ', 'Equatorial Guinea', '+240'],
  ['ER', 'Eritrea', '+291'], ['EE', 'Estonia', '+372'], ['SZ', 'Eswatini', '+268'], ['ET', 'Ethiopia', '+251'],
  ['FJ', 'Fiji', '+679'], ['FI', 'Finland', '+358'], ['FR', 'France', '+33'], ['GA', 'Gabon', '+241'],
  ['GM', 'Gambia', '+220'], ['GE', 'Georgia', '+995'], ['DE', 'Germany', '+49'], ['GH', 'Ghana', '+233'],
  ['GR', 'Greece', '+30'], ['GD', 'Grenada', '+1'], ['GT', 'Guatemala', '+502'], ['GN', 'Guinea', '+224'],
  ['GW', 'Guinea-Bissau', '+245'], ['GY', 'Guyana', '+592'], ['HT', 'Haiti', '+509'], ['HN', 'Honduras', '+504'],
  ['HU', 'Hungary', '+36'], ['IS', 'Iceland', '+354'], ['IN', 'India', '+91'], ['ID', 'Indonesia', '+62'],
  ['IR', 'Iran', '+98'], ['IQ', 'Iraq', '+964'], ['IE', 'Ireland', '+353'], ['IL', 'Israel', '+972'],
  ['IT', 'Italy', '+39'], ['JM', 'Jamaica', '+1'], ['JP', 'Japan', '+81'], ['JO', 'Jordan', '+962'],
  ['KZ', 'Kazakhstan', '+7'], ['KE', 'Kenya', '+254'], ['KI', 'Kiribati', '+686'], ['KW', 'Kuwait', '+965'],
  ['KG', 'Kyrgyzstan', '+996'], ['LA', 'Laos', '+856'], ['LV', 'Latvia', '+371'], ['LB', 'Lebanon', '+961'],
  ['LS', 'Lesotho', '+266'], ['LR', 'Liberia', '+231'], ['LY', 'Libya', '+218'], ['LI', 'Liechtenstein', '+423'],
  ['LT', 'Lithuania', '+370'], ['LU', 'Luxembourg', '+352'], ['MG', 'Madagascar', '+261'], ['MW', 'Malawi', '+265'],
  ['MY', 'Malaysia', '+60'], ['MV', 'Maldives', '+960'], ['ML', 'Mali', '+223'], ['MT', 'Malta', '+356'],
  ['MH', 'Marshall Islands', '+692'], ['MR', 'Mauritania', '+222'], ['MU', 'Mauritius', '+230'], ['MX', 'Mexico', '+52'],
  ['FM', 'Micronesia', '+691'], ['MD', 'Moldova', '+373'], ['MC', 'Monaco', '+377'], ['MN', 'Mongolia', '+976'],
  ['ME', 'Montenegro', '+382'], ['MA', 'Morocco', '+212'], ['MZ', 'Mozambique', '+258'], ['MM', 'Myanmar', '+95'],
  ['NA', 'Namibia', '+264'], ['NR', 'Nauru', '+674'], ['NP', 'Nepal', '+977'], ['NL', 'Netherlands', '+31'],
  ['NZ', 'New Zealand', '+64'], ['NI', 'Nicaragua', '+505'], ['NE', 'Niger', '+227'], ['NG', 'Nigeria', '+234'],
  ['KP', 'North Korea', '+850'], ['MK', 'North Macedonia', '+389'], ['NO', 'Norway', '+47'], ['OM', 'Oman', '+968'],
  ['PK', 'Pakistan', '+92'], ['PW', 'Palau', '+680'], ['PS', 'Palestine', '+970'], ['PA', 'Panama', '+507'],
  ['PG', 'Papua New Guinea', '+675'], ['PY', 'Paraguay', '+595'], ['PE', 'Peru', '+51'], ['PH', 'Philippines', '+63'],
  ['PL', 'Poland', '+48'], ['PT', 'Portugal', '+351'], ['QA', 'Qatar', '+974'], ['RO', 'Romania', '+40'],
  ['RU', 'Russia', '+7'], ['RW', 'Rwanda', '+250'], ['KN', 'Saint Kitts and Nevis', '+1'], ['LC', 'Saint Lucia', '+1'],
  ['VC', 'Saint Vincent and the Grenadines', '+1'], ['WS', 'Samoa', '+685'], ['SM', 'San Marino', '+378'],
  ['ST', 'Sao Tome and Principe', '+239'], ['SA', 'Saudi Arabia', '+966'], ['SN', 'Senegal', '+221'], ['RS', 'Serbia', '+381'],
  ['SC', 'Seychelles', '+248'], ['SL', 'Sierra Leone', '+232'], ['SG', 'Singapore', '+65'], ['SK', 'Slovakia', '+421'],
  ['SI', 'Slovenia', '+386'], ['SB', 'Solomon Islands', '+677'], ['SO', 'Somalia', '+252'], ['ZA', 'South Africa', '+27'],
  ['KR', 'South Korea', '+82'], ['SS', 'South Sudan', '+211'], ['ES', 'Spain', '+34'], ['LK', 'Sri Lanka', '+94'],
  ['SD', 'Sudan', '+249'], ['SR', 'Suriname', '+597'], ['SE', 'Sweden', '+46'], ['CH', 'Switzerland', '+41'],
  ['SY', 'Syria', '+963'], ['TW', 'Taiwan', '+886'], ['TJ', 'Tajikistan', '+992'], ['TZ', 'Tanzania', '+255'],
  ['TH', 'Thailand', '+66'], ['TL', 'Timor-Leste', '+670'], ['TG', 'Togo', '+228'], ['TO', 'Tonga', '+676'],
  ['TT', 'Trinidad and Tobago', '+1'], ['TN', 'Tunisia', '+216'], ['TR', 'Turkey', '+90'], ['TM', 'Turkmenistan', '+993'],
  ['TV', 'Tuvalu', '+688'], ['UG', 'Uganda', '+256'], ['UA', 'Ukraine', '+380'], ['AE', 'United Arab Emirates', '+971'],
  ['GB', 'United Kingdom', '+44'], ['US', 'United States', '+1'], ['UY', 'Uruguay', '+598'], ['UZ', 'Uzbekistan', '+998'],
  ['VU', 'Vanuatu', '+678'], ['VA', 'Vatican City', '+39'], ['VE', 'Venezuela', '+58'], ['VN', 'Vietnam', '+84'],
  ['YE', 'Yemen', '+967'], ['ZM', 'Zambia', '+260'], ['ZW', 'Zimbabwe', '+263']
].map(([code, name, dialCode]) => ({
  code,
  name,
  dialCode,
  flag: String.fromCodePoint(...code.split('').map(char => 127397 + char.charCodeAt(0)))
}));

const OTHER_COUNTRY = { code: '', name: 'Other', dialCode: '', flag: '🌐' };
const getCountry = (name) => COUNTRY_OPTIONS.find(country => country.name === name) || OTHER_COUNTRY;
const DEFAULT_COUNTRY = getCountry('India');
const DEFAULT_CONTACT = `${DEFAULT_COUNTRY.dialCode} `;

export default function EnquiryModal({ isOpen, onClose, initialProduct = null }) {
  const [formData, setFormData] = useState({
    name: '',
    contact: DEFAULT_CONTACT,
    email: '',
    country: DEFAULT_COUNTRY.name,
    enquiryFor: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update enquiryFor when initialProduct changes
  useEffect(() => {
    if (initialProduct) {
      const prodText = typeof initialProduct === 'string' 
        ? initialProduct 
        : `${initialProduct.name} (${initialProduct.genericName || ''})`.trim();
      setFormData(prev => ({ ...prev, enquiryFor: prodText }));
    } else {
      setFormData(prev => ({ ...prev, enquiryFor: prev.enquiryFor || 'General Medicine Enquiry' }));
    }
    setErrorMessage('');
    setIsSuccess(false);
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'country') {
      const previousDialCode = getCountry(formData.country).dialCode;
      const nextCountry = getCountry(value);
      const currentContact = formData.contact.trim();
      const nationalNumber = previousDialCode && currentContact.startsWith(previousDialCode)
        ? currentContact.slice(previousDialCode.length).trim()
        : currentContact;
      setFormData(prev => ({
        ...prev,
        country: nextCountry.name,
        contact: nextCountry.dialCode
          ? `${nextCountry.dialCode}${nationalNumber ? ` ${nationalNumber}` : ' '}`
          : nationalNumber
      }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          contact: formData.contact.trim(),
          email: formData.email.trim(),
          country: formData.country,
          enquiryFor: formData.enquiryFor.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit enquiry. Please try again.');
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({
          name: '',
          email: '',
          contact: DEFAULT_CONTACT,
          country: DEFAULT_COUNTRY.name,
          enquiryFor: ''
        });
      }, 2500);

    } catch (err) {
      setErrorMessage(err.message || 'Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white p-5 sm:p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold backdrop-blur-md mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Direct to sales@vitalmedex.com</span>
          </div>

          <h3 className="text-xl font-black tracking-tight text-white">
            Enquire Now
          </h3>
          <p className="text-xs text-teal-100/90 mt-1">
            Fill in your details below. Our sales team will get back to you promptly.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Enquiry Submitted Successfully!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Your enquiry for <span className="font-semibold text-teal-700">"{formData.enquiryFor}"</span> has been sent to <strong>sales@vitalmedex.com</strong> and recorded in our live Google Sheet.
              </p>
              <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-800">
                ✓ Saved to Google Excel Sheet
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Field 1: Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name / Contact Person *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your name or business name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Field 2 & 3: Contact/Country & Email */}
              <div className="grid grid-cols-1 gap-3">
                {/* Combined Country & Contact */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Country & Contact Number *
                  </label>
                  <div className="flex bg-slate-50 border border-slate-300 rounded-xl overflow-hidden focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-600 focus-within:border-transparent transition">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-1/2 min-w-[150px] max-w-[210px] px-3 py-2.5 bg-transparent border-r border-slate-300 text-xs sm:text-sm text-slate-800 outline-none cursor-pointer font-medium"
                    >
                      {COUNTRY_OPTIONS.map(country => (
                        <option key={country.code} value={country.name}>
                          {country.name} ({country.dialCode}) {country.flag}
                        </option>
                      ))}
                      <option value={OTHER_COUNTRY.name}>Other {OTHER_COUNTRY.flag}</option>
                    </select>
                    <input
                      type="tel"
                      name="contact"
                      required
                      placeholder={`${getCountry(formData.country).dialCode} 9876543210`}
                      value={formData.contact}
                      onChange={handleChange}
                      className="flex-1 min-w-0 px-3.5 py-2.5 bg-transparent text-xs sm:text-sm text-slate-800 outline-none"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="yourname@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Field 5: Enquiry For (Text box as requested) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enquiry For *
                </label>
                <textarea
                  name="enquiryFor"
                  required
                  rows="3"
                  placeholder="Enter the medicine name, quantity required, or your inquiry details..."
                  value={formData.enquiryFor}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              {/* Destination info badge */}
              <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl flex items-center justify-between text-[11px] text-teal-800">
                <span className="flex items-center gap-1.5 font-medium">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  Sent to: <strong>sales@vitalmedex.com</strong>
                </span>
                <span className="text-[10px] bg-teal-200/70 px-2 py-0.5 rounded-full font-bold">
                  Google Sheet Sync
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition"
                >
                  {isSubmitting ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
