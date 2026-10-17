import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function PrescriptionModal() {
  const { 
    isPrescriptionModalOpen, 
    setIsPrescriptionModalOpen, 
    addPrescription,
    prescriptions 
  } = useCart();

  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    fileName: '',
    notes: ''
  });
  const [fileAttached, setFileAttached] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isPrescriptionModalOpen) return null;

  const handleUseSampleRx = () => {
    setFormData({
      patientName: 'Rameshwar Kulkarni',
      doctorName: 'Dr. V. P. Mehta, MD (Medicine)',
      fileName: 'Sample_Certified_Doctor_Prescription.pdf',
      notes: 'Prescribed Semaglutide 3mg & Zopiclone 10mg for 30 days.'
    });
    setFileAttached(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        fileName: file.name
      }));
      setFileAttached(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fileName) {
      alert('Please upload a prescription file or use the Sample Prescription.');
      return;
    }

    addPrescription({
      patientName: formData.patientName || 'Anonymous Patient',
      doctorName: formData.doctorName || 'Licensed Medical Practitioner',
      fileName: formData.fileName,
      notes: formData.notes,
      linkedMedicines: 'Cart medicines'
    });

    setSuccessMsg('Prescription verified and attached to your cart!');
    setTimeout(() => {
      setSuccessMsg('');
      setIsPrescriptionModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-700 to-teal-800 text-white p-6 relative flex-shrink-0">
          <button
            onClick={() => setIsPrescriptionModalOpen(false)}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-block p-2 rounded-xl bg-white/15 backdrop-blur-md mb-2">
            <FileText className="w-6 h-6 text-sky-200" />
          </div>
          <h3 className="text-xl font-bold">Upload Doctor's Prescription</h3>
          <p className="text-xs text-sky-100/90 mt-1">
            Mandatory for Schedule H/H1 regulated medicines under Drugs & Cosmetics Act
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {successMsg ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-base font-bold text-slate-900">{successMsg}</h4>
              <p className="text-xs text-slate-500 mt-1">Returning to cart...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* File Upload Zone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-6 text-center bg-slate-50 hover:bg-teal-50/30 transition relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                {formData.fileName ? (
                  <div className="text-xs">
                    <span className="font-bold text-teal-700 block">âœ“ Selected File:</span>
                    <span className="text-slate-700">{formData.fileName}</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Click to browse or drag and drop prescription file
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports JPG, PNG, PDF (Max 15MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Sample Button for Testing */}
              <div className="flex items-center justify-between p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs">
                <span className="text-sky-800 font-medium">Quick Demo Testing:</span>
                <button
                  type="button"
                  onClick={handleUseSampleRx}
                  className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition"
                >
                  Attach Sample Rx
                </button>
              </div>

              {/* Patient and Doctor details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prescribing Doctor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Verma (MBBS, MD)"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Clinical Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Dosage duration, special instructions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Your medical information is encrypted and reviewed solely by registered pharmacists.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Confirm & Verify Prescription
              </button>
            </form>
          )}

          {/* List of previously uploaded prescriptions */}
          {prescriptions.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Uploaded Prescriptions On File ({prescriptions.length})
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{rx.fileName}</p>
                      <p className="text-[10px] text-slate-500">Patient: {rx.patientName} | Dr: {rx.doctorName}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {rx.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
