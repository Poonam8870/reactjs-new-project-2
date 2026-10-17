import React, { useState, useEffect } from 'react';
import { X, FileSpreadsheet, Download, CheckCircle2, ExternalLink, Copy, Check, RefreshCw, Save } from 'lucide-react';

export default function GoogleSheetSyncModal({ isOpen, onClose }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'setup'

  const fetchEnquiries = () => {
    setLoading(true);
    fetch('/api/enquiries')
      .then(res => res.json())
      .then(data => {
        setEnquiries(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchConfig = () => {
    fetch('/api/enquiries/config')
      .then(res => res.json())
      .then(data => {
        if (data && data.webhookUrl) {
          setWebhookUrl(data.webhookUrl);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (isOpen) {
      fetchEnquiries();
      fetchConfig();
    }
  }, [isOpen]);

  const handleSaveWebhook = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/enquiries/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl, recipientEmail: 'sales@vitalmedex.com' })
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert('Failed to save: ' + (errData.error || `Server error ${res.status}`));
      }
    } catch (e) {
      alert('Cannot connect to server. Make sure the backend is running (npm run dev).');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyScript = () => {
    const script = `function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Enquiry ID", "Name", "Contact", "Email", "Country", "Enquiry For", "Recipient Email"]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#0d9488").setFontColor("#ffffff");
    }
    var p = e.parameter;
    sheet.appendRow([
      p.timestamp || new Date().toLocaleString(),
      p.id || "ENQ-" + new Date().getTime(),
      p.name || "",
      p.contact || "",
      p.email || "",
      p.country || "",
      p.enquiryFor || "",
      p.recipientEmail || "sales@vitalmedex.com"
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Enquiry ID", "Name", "Contact", "Email", "Country", "Enquiry For", "Recipient Email"]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#0d9488").setFontColor("#ffffff");
    }
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.id || "ENQ-" + new Date().getTime(),
      data.name || "",
      data.contact || "",
      data.email || "",
      data.country || "",
      data.enquiryFor || "",
      data.recipientEmail || "sales@vitalmedex.com"
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}`;
    navigator.clipboard.writeText(script);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Vital Medex — Enquiries & Google Sheets
              </h3>
              <p className="text-xs text-slate-400">
                Data destination: <strong className="text-teal-300">sales@vitalmedex.com</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="/api/enquiries/export"
              download="AllTimeMedex_Enquiries.csv"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Excel (.CSV)</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'list'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Enquiries Received ({enquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'setup'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Google Sheets Webhook Setup
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'list' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Showing latest form submissions saved one by one.
                </span>
                <button
                  onClick={fetchEnquiries}
                  className="text-xs text-teal-600 hover:text-teal-800 flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {enquiries.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No enquiries recorded yet. Click "Enquiry Now" on any card on the website to submit one!
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-3">Date & Time</th>
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Contact</th>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Country</th>
                        <th className="py-2.5 px-3">Enquiry For</th>
                        <th className="py-2.5 px-3">Google Sheet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {enquiries.map((item) => (
                        <tr key={item.id} className="hover:bg-teal-50/40 transition">
                          <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">{item.timestamp || item.date}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{item.name}</td>
                          <td className="py-2.5 px-3 text-teal-700 font-medium">{item.contact}</td>
                          <td className="py-2.5 px-3">{item.email}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 font-medium text-[11px]">
                              {item.country}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 max-w-[180px] truncate font-medium text-slate-800">
                            {item.enquiryFor}
                          </td>
                          <td className="py-2.5 px-3">
                            {item.syncedToGoogleSheet ? (
                              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Synced
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-slate-400">
                                Recorded
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 max-w-2xl mx-auto text-xs">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl">
                <h4 className="font-bold text-teal-900 text-sm mb-1">
                  How Google Sheet Sync Works for sales@vitalmedex.com
                </h4>
                <p className="text-teal-800 leading-relaxed">
                  When a customer fills the "Enquiry Now" form on any card, the data is automatically saved here in the database, can be downloaded directly as an Excel file, and will automatically append a new row into your Google Sheet via Google Apps Script.
                </p>
              </div>

              {/* Webhook input */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800">
                  Google Apps Script Web App URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                  <button
                    onClick={handleSaveWebhook}
                    disabled={isSaving}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving...' : 'Save URL'}</span>
                  </button>
                </div>
                {saveSuccess && (
                  <p className="text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> URL saved successfully! Every new enquiry will post to your sheet.
                  </p>
                )}
              </div>

              {/* Step by step */}
              <div className="space-y-3 pt-2">
                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Quick 1-Minute Setup Instructions:
                </h5>
                <ol className="list-decimal list-inside space-y-2 text-slate-600">
                  <li>Open <strong>Google Sheets</strong> using <strong>sales@vitalmedex.com</strong>.</li>
                  <li>Click <strong>Extensions &gt; Apps Script</strong>.</li>
                  <li>
                    Copy the script below and paste it:
                    <button
                      onClick={handleCopyScript}
                      className="ml-2 inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold border border-slate-300"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? 'Copied!' : 'Copy Script Code'}</span>
                    </button>
                  </li>
                  <li>Click <strong>Deploy &gt; New deployment</strong> &gt; Select type: <strong>Web app</strong>.</li>
                  <li>Set <em>"Who has access"</em> to <strong>Anyone</strong>, click Deploy, and paste the URL above.</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
