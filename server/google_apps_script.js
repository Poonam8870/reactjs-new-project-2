/**
 * ALL TIME MEDEX - GOOGLE SHEETS LIVE SYNC SCRIPT
 * 
 * Account / Recipient: salesvitalmedex@gmail.com
 * 
 * Instructions to set up:
 * 1. Open Google Sheets (https://sheets.google.com) with salesvitalmedex@gmail.com
 * 2. Create a new Sheet, e.g. "All Time Medex - Website Enquiries"
 * 3. Go to Extensions > Apps Script
 * 4. Delete any code in the editor, and paste THIS entire code.
 * 5. Click "Save" (disk icon), then click "Deploy" > "New deployment"
 * 6. Select type: "Web app"
 *    - Description: "All Time Medex Enquiries"
 *    - Execute as: "Me" (salesvitalmedex@gmail.com)
 *    - Who has access: "Anyone"
 * 7. Click "Deploy", authorize permissions, and COPY the Web App URL.
 * 8. Paste that Web App URL in your website's Google Sheets Sync setting (or in server/googleSheetConfig.json).
 * 
 * Done! Every enquiry submitted from cards will immediately append row-by-row into this Google Sheet!
 */

function processRequest(e, isPost) {
  try {
    var SECRET_TOKEN = "ATMSecure2026";
    
    // Extract data depending on request type
    var data = {};
    if (isPost && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }

    // Verify Secret Token
    if (data.secretToken !== SECRET_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "Unauthorized: Invalid or missing Secret Token" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Enquiry ID",
        "Customer / Buyer Name",
        "Contact / Phone",
        "Email",
        "Country",
        "Enquiry For (Product)",
        "Recipient Email"
      ]);
      sheet.getRange(1, 1, 1, 8)
        .setFontWeight("bold")
        .setBackground("#0d9488")
        .setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
    
    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "GMT+5:30", "yyyy-MM-dd HH:mm:ss");
    var id = data.id || "ENQ-" + new Date().getTime();
    var name = data.name || "";
    var contact = data.contact || "";
    var email = data.email || "";
    var country = data.country || "";
    var enquiryFor = data.enquiryFor || "";
    var recipientEmail = data.recipientEmail || "salesvitalmedex@gmail.com";
    
    sheet.appendRow([
      timestamp,
      id,
      name,
      contact,
      email,
      country,
      enquiryFor,
      recipientEmail
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Enquiry saved securely to Google Sheet",
      id: id
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  return processRequest(e, true);
}

function doGet(e) {
  if (e.parameter && Object.keys(e.parameter).length > 0) {
    return processRequest(e, false);
  }
  return ContentService.createTextOutput("All Time Medex Google Sheet Webhook is Live and Secure!");
}
