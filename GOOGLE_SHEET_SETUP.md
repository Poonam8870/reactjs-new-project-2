# Google Sheet Setup for salesvitalmedex@gmail.com

Follow these 4 simple steps to save website enquiries row-by-row into your Google Sheet:

### Step 1: Open Google Sheets
1. Sign in to Google Sheets using **salesvitalmedex@gmail.com** (or any company Google account).
2. Create a new Google Spreadsheet and name it: **All Time Medex - Website Enquiries**

### Step 2: Open Apps Script Editor
1. In the top menu of your Google Sheet, click **Extensions** > **Apps Script**.
2. Delete any default code in `Code.gs`.
3. Open `server/google_apps_script.js` from this project, copy all the code, and paste it into `Code.gs`.
4. Click the **Save** icon (disk).

### Step 3: Deploy as Web App
1. Click the blue **Deploy** button (top right) > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the settings:
   - **Description**: `All Time Medex Form Sync`
   - **Execute as**: `Me (salesvitalmedex@gmail.com)`
   - **Who has access**: `Anyone` *(Important: Select 'Anyone' so the website can post data)*
4. Click **Deploy**.
5. Grant permissions if prompted (Click "Advanced" > "Go to Untitled project (unsafe)" > "Allow").
6. **Copy the Web App URL** (it looks like: `https://script.google.com/macros/s/AKfycb.../exec`).

### Step 4: Connect to Website
- Click **"Google Sheet Sync"** on the website navbar or admin panel, paste your Web App URL, and click **Save**.
- Or edit `server/googleSheetConfig.json` directly and put the URL in `"webhookUrl"`.

Every enquiry submitted will now automatically add a new row in your Google Sheet in real time!
