/**
 * =========================================================================
 * BITS TECHSPIRIT 2026 — Google Sheets Database Connector Webhook
 * =========================================================================
 * How to deploy this script:
 * 1. Create a new Google Spreadsheet at https://sheets.new (e.g., "BITS TECHSPIRIT 2026 Database")
 * 2. In Google Sheets menu, click: Extensions -> Apps Script
 * 3. Delete any default code and paste this entire file.
 * 4. (Optional) Run the function 'setupAllTabs' once to auto-create and format all 11 tabs.
 * 5. Click "Deploy" (top right) -> "New deployment"
 * 6. Select type: "Web app"
 *    - Description: BITS TECHSPIRIT Database API
 *    - Execute as: Me (your Google account)
 *    - Who has access: Anyone
 * 7. Click Deploy, Authorize access, and copy the Web App URL (starts with https://script.google.com/macros/s/...)
 * 8. Paste this URL into your backend/.env as GOOGLE_APPS_SCRIPT_URL=https://script.google.com/...
 * =========================================================================
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "status";
  
  if (action === "status") {
    return ContentService.createTextOutput(JSON.stringify({
      status: "online",
      project: "BITS TECHSPIRIT 2026",
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  var sheetName = e.parameter.sheet || "Teams";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet " + sheetName + " not found" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var data = sheet.getDataRange().getValues();
  return ContentService.createTextOutput(JSON.stringify({ sheet: sheetName, rows: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action || "APPEND_ROW";

    // 1. FULL DATABASE SYNC
    if (action === "SYNC_FULL_DATABASE") {
      var tables = payload.tables || {};
      var summary = {};

      for (var tabName in tables) {
        var rows = tables[tabName];
        if (!rows || rows.length === 0) continue;

        var sheet = ss.getSheetByName(tabName);
        if (!sheet) {
          sheet = ss.insertSheet(tabName);
        }

        sheet.clear();
        var numRows = rows.length;
        var numCols = rows[0].length;

        // Write all rows in a single batch
        var range = sheet.getRange(1, 1, numRows, numCols);
        range.setValues(rows);

        // Format header row
        var headerRange = sheet.getRange(1, 1, 1, numCols);
        headerRange.setBackground("#0F172A");
        headerRange.setFontColor("#00FFAA");
        headerRange.setFontWeight("bold");
        sheet.setFrozenRows(1);

        summary[tabName] = numRows - 1; // count minus header
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Full database synchronized successfully!",
        synced_tabs: summary,
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. SINGLE ROW APPEND (For live streaming new registrations)
    if (action === "APPEND_ROW") {
      var targetSheetName = payload.sheet || "Teams";
      var rowValues = payload.rowValues || [];
      var sheet = ss.getSheetByName(targetSheetName);
      if (!sheet) {
        sheet = ss.insertSheet(targetSheetName);
      }
      sheet.appendRow(rowValues);

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Row appended to " + targetSheetName
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Unknown action"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Run this function once from the script editor to auto-create all standard tabs and headers.
 */
function setupAllTabs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var schemas = {
    "Events": ["event_id", "name", "slug", "tagline", "start_date", "end_date", "venue", "prize_pool", "status"],
    "Event_Settings": ["event_id", "online_fee", "spot_fee", "team_min", "team_max", "deadline", "registration_open"],
    "Users": ["user_id", "email", "name", "role", "created_at"],
    "Form_Fields": ["field_id", "label", "field_type", "required", "options", "order"],
    "Teams": ["team_id", "registration_id", "event_id", "team_name", "domain", "leader_name", "leader_email", "leader_phone", "college", "team_size", "registration_status", "payment_status", "amount", "checked_in", "created_at"],
    "Participants": ["participant_id", "team_id", "registration_id", "team_name", "name", "email", "phone", "college", "department", "year", "is_leader"],
    "Payments": ["payment_id", "team_id", "registration_id", "amount", "gateway_order_id", "transaction_id", "status", "payment_method", "created_at"],
    "Submissions": ["submission_id", "team_id", "registration_id", "team_name", "domain", "project_title", "project_description", "github_url", "ppt_url", "demo_video_url", "tech_stack", "submitted_at"],
    "Scores": ["score_id", "submission_id", "judge_id", "judge_name", "innovation", "implementation", "impact", "design_ux", "presentation", "total", "feedback", "scored_at"],
    "Checkins": ["checkin_id", "team_id", "registration_id", "team_name", "scanned_by", "timestamp", "entry_status"],
    "Audit_Logs": ["log_id", "actor", "action", "details", "timestamp"]
  };

  for (var tab in schemas) {
    var sheet = ss.getSheetByName(tab);
    if (!sheet) {
      sheet = ss.insertSheet(tab);
    }
    sheet.clear();
    var headers = schemas[tab];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0F172A");
    headerRange.setFontColor("#00FFAA");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  Logger.log("All 11 Hackathon Google Sheets tabs initialized successfully!");
}
