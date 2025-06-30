function checkEvents() {
  var BIRTHDAYS = CalendarApp.getCalendarById('addressbook#contacts@group.v.calendar.google.com');
  var SIGNIFICANT_DATES = CalendarApp.getCalendarsByName("Significant Dates")[0];
  var HOLIDAY_DATES = CalendarApp.getCalendarsByName("Holidays in United States")[0];
  var today = new Date();
  var user = Session.getActiveUser().getEmail();

  var todayEvents = []
  var futureEvents = []
  
  // Define the date ranges for events
  var todayEvents = getEventsForDate(BIRTHDAYS, today)
    .concat(getEventsForDate(SIGNIFICANT_DATES, today))
    .concat(getEventsForDate(HOLIDAY_DATES, today));

  if (today.getDay() == 4) {
    var futureEvents = getEventsInRange(BIRTHDAYS, today, 28)
      .concat(getEventsInRange(SIGNIFICANT_DATES, today, 28))
      .concat(getEventsInRange(HOLIDAY_DATES, today, 28))
  } else {
    Logger.log("weekday is " + today.getDay().toString() + ". Not notifying on new events")
  }
  
  var reminderEvents = todayEvents.concat(futureEvents);
  
  if (reminderEvents.length == 0) {
    Logger.log("no birthdays or significant events to remind")
    return
  } else {
    Logger.log("found " + reminderEvents.length.toString() + " events to remind")
  }

  // put together subject. max recommended email subject is 78 chars.

  subject = "Reminder: " + reminderEvents.map((x) => {
    var entry = x.getTitle();
    if (x.getStartTime().getDate() == today.getDate()) {
      entry += " (TODAY)"
    }
    return entry;
  }).join(", ").substring(0,77);
  var body = ""
  
  if (todayEvents.length > 0) {
    body += "Todays birthdays and significant dates:\n\n"
    for (var i = 0; i < todayEvents.length; i++) {
      body += todayEvents[i].getTitle() + " on " + todayEvents[i].getStartTime().toLocaleDateString() + "\n";
    }
  }

  if (futureEvents.length > 0) {
    body += "\nThis month's birthdays and significant dates:\n\n"
    for (var i = 0; i < futureEvents.length; i++) {
      body += futureEvents[i].getTitle() + " on " + futureEvents[i].getStartTime().toLocaleDateString() + "\n";
    }
  }

  GmailApp.sendEmail(user, subject, body);
}

function getEventsForDate(calendar, date) {
  return calendar.getEventsForDay(date);
}

function getEventsInRange(calendar, startDate, days) {
  var endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + days);
  var events = calendar.getEvents(startDate, endDate);
  return events;
}
