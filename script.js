const brand = 'Direct Line'; //Set this value in main, once we get there.

var index = new Map([
  ['Created At',-1],
  ['Completed At',-1],
  ['Issue Type',-1],
  ['All Brands',-1],
  ['Complaint Reason',-1],
  ['Outcome',-1],
  ['Complaint Date',-1],
  ['Finalised Date',-1],
  ['Complaint Reopened',-1]
])

//Change to an enum, ASAP
var dates = {
  END: new Date(),
  SIX: new Date(),
  TWELVE: new Date()
}

function getData() {
  var source = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Live source data');
  var range = source.getDataRange();
  var data = range.getValues();
  var destination = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('AppScript');
  destination.getRange(1,1,range.getLastRow(),range.getLastColumn()).setValues(data);
}

function setDates() {
  var playdate = new Date();
  dates.END.setMonth(dates.END.getMonth()-1);
  dates.END.setDate(1);
  dates.END.setHours(0);

  dates.SIX.setMonth(dates.SIX.getMonth()-7);
  dates.SIX.setDate(1);
  dates.SIX.setHours(0);

  dates.TWELVE.setMonth(dates.TWELVE.getMonth()-13);
  dates.TWELVE.setDate(1);
  dates.TWELVE.setHours(0);

  Logger.log(dates.get('end'));
}

function setIndex() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('AppScript');
  var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  for(let i=0; i<headers.length; i++) {
    index.forEach(function(value, key){
      if(headers[i] == key) {
        index.set(key, i+1);
      }
    })
  }
  
  index.forEach(function(value, key){
    if(headers[value]<0) {
      if(sheet.getLastColumn() == sheet.getMaxColumns()) {
        sheet.insertColumnsAfter(sheet.getLastColumn());
      }
      sheet.getRange(1,sheet.getLastColumn()+1).setValue(key);
      index.set(key, sheet.getLastColumn())
    }
  })

  /*index.forEach(function(value, key) {
    Logger.log(key+' + '+value)
    Logger.log(key + ' : ' + sheet.getRange(1,value).getA1Notation());
  })*/
}

function clearBrands() {
  setIndex();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('AppScript');
  var range = sheet.getRange(1,1,sheet.getLastRow(),sheet.getLastColumn());
  var filter = sheet.getFilter();
  if(filter) {
    filter.remove();
  }
  range.createFilter();
  sheet.sort(index.get('All Brands'),true);
  sheet.getFilter().remove();
  var startingFrom = -1;
  var upUntil = -1;
  var cellValue = '';

  for(var i=2; i<sheet.getLastRow(); i++) {
    cellValue = sheet.getRange(i,index.get('All Brands')).getValue();
    if(cellValue == brand) {
      startingFrom = i;
      Logger.log(startingFrom);
      break;
    }
  }

  for(var i=startingFrom; i<sheet.getLastRow(); i++) {
    cellValue = sheet.getRange(i,index.get('All Brands')).getValue();
    if(cellValue != brand) {
      upUntil = i;
      Logger.log(upUntil);
      break;
    }
  }
  
  //sheet.deleteRows(startingFrom,upUntil-startingFrom);
  //The range, starting -> from up until must be retained. Thus, if
  /*if(startingFrom<=1) {
    sheet.getRange(1,startingFrom,startingFrom-2).clearContent();
  } else {
    sheet
  }*/
}

function binarySearch() {
  setIndex();
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('AppScript');
  var first_element = 1;
  var last_element = sheet.getLastRow();
  var range = last_element - first_element;
  var current_element = -1;
  var first_appearance = -1;
  var last_appearance = -1;

  while(first_appearance<0 && last_appearance<0) {

  }

  current_element = sheet.getRange(range/2, index.get('All Brands')).getValue();
  if(current_element == 'Direct Line') {
    if(sheet.getRange(range/2-1, index.get('All Brands')) == 'Direct Line') {
      last_element = sheet.getRange(range/2-1, index.get('All Brands')).getRow();
      range = last_element - first_element;
    } else {
      first_appearance = sheet.getRange(range/2, index.get('All Brands'));
    }
  } else {
    //This element was not DL. Check whether we have under or over shot.
    if(current_element.localeCompare('Direct Line')) {
      //True if current_element(z) vs 'DL'
      if(sheet.getRange(range/2-1, index.get('All Brands')) == 'Direct Line') {
        last_appearance = sheet.getRange(range/2-1,index.get('All Brands')).getRow(); //Verify this row
      } else {
        last_element = sheet.getRange(range/2-1,index.get('All Brands')).getRow();
        range = last_element - first_element;
      }
    } else {
      //False if current_element(a) vs 'DL'
      //Then continue here
    }
  }

}

/**
 * clearBrands : removes non-DL / non-CHC brands (Blanks?)
 * clearGrumbles : removes all grumbles (Blanks?)
 * clearOldComplaints : removes all complaints that are not within the current reporting period
 * assumeComplaintType : based on complaint timeline, assign a complaint type
 * 
 * allComplaints : # raised over past 12 months
 * complaintsReopened : # closed within the last 12 months & reopened (rely on 'complaint finalised' date)
 * deadlineMissed : # not resolved within regulatory timescales (all complaints)
 * avgResolutionTime : AVG number of day to resolve (all complaints)
 * awaitingDecision : # not resolved (absolute, beginning June 2022)
 * dismissed : # dismissed (absolute, beginning June 2022)
 * upheld : # upheld absolute, (beginning June 2022)
 * fosComplaints : # of FOS complaints / number of complaints eligible for FOS over the past 6 month rolling
 * fosDeciding : % of complaints raised with FOS over the past 6 months pending outcome (task completion status)
 * fosDismissed : % of complaints raised with FOS over the past 6 months that were dismissed
 * fosUpheld : % of complaints raised with FOS over the past 6 months that were upheld
 */

function main() {
  
}
