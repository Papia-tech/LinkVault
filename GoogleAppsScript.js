function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var bookmarks = [];
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][1]) { // filter blank entries cleanly
      bookmarks.push({
        name: data[i][0],
        url: data[i][1]
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify(bookmarks))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var postData = JSON.parse(e.postData.contents);
    
    if (postData.action === "add") {
      // Incremental add
      sheet.appendRow([postData.name, postData.url]);
    } 
    else if (postData.action === "sync") {
      // Clean everything below headers and rebuild structure (handles sorting + deletions)
      if (sheet.getLastRow() > 1) {
        sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).clearContent();
      }
      
      var rows = postData.fullData;
      if (rows && rows.length > 0) {
        var outputMatrix = rows.map(function(item) {
          return [item.name, item.url];
        });
        sheet.getRange(2, 1, outputMatrix.length, 2).setValues(outputMatrix);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
