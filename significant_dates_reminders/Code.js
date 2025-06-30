// Function to initialize or update script properties with calendar IDs
function setupCalendarConfig() {
  var properties = PropertiesService.getScriptProperties();

  // Set default values if they don't exist
  if (!properties.getProperty('BIRTHDAYS_CALENDAR_ID')) {
    properties.setProperty('BIRTHDAYS_CALENDAR_ID', 'addressbook#contacts@group.v.calendar.google.com');
  }

  if (!properties.getProperty('SIGNIFICANT_DATES_CALENDAR_NAME')) {
    properties.setProperty('SIGNIFICANT_DATES_CALENDAR_NAME', 'Significant Dates');
  }

  if (!properties.getProperty('HOLIDAY_DATES_CALENDAR_NAME')) {
    properties.setProperty('HOLIDAY_DATES_CALENDAR_NAME', 'Holidays in United States');
  }

  // Return the current configuration
  return {
    birthdaysCalendarId: properties.getProperty('BIRTHDAYS_CALENDAR_ID'),
    significantDatesCalendarName: properties.getProperty('SIGNIFICANT_DATES_CALENDAR_NAME'),
    holidayDatesCalendarName: properties.getProperty('HOLIDAY_DATES_CALENDAR_NAME')
  };
}

// Function to get calendar configuration
function getCalendarConfig() {
  var properties = PropertiesService.getScriptProperties();
  return {
    birthdaysCalendarId: properties.getProperty('BIRTHDAYS_CALENDAR_ID'),
    significantDatesCalendarName: properties.getProperty('SIGNIFICANT_DATES_CALENDAR_NAME'),
    holidayDatesCalendarName: properties.getProperty('HOLIDAY_DATES_CALENDAR_NAME')
  };
}

// Function to update calendar configuration
function updateCalendarConfig(birthdaysCalendarId, significantDatesCalendarName, holidayDatesCalendarName) {
  var properties = PropertiesService.getScriptProperties();

  if (birthdaysCalendarId) {
    properties.setProperty('BIRTHDAYS_CALENDAR_ID', birthdaysCalendarId);
  }

  if (significantDatesCalendarName) {
    properties.setProperty('SIGNIFICANT_DATES_CALENDAR_NAME', significantDatesCalendarName);
  }

  if (holidayDatesCalendarName) {
    properties.setProperty('HOLIDAY_DATES_CALENDAR_NAME', holidayDatesCalendarName);
  }

  return getCalendarConfig();
}

function checkEvents() {
  // Initialize configuration if needed
  setupCalendarConfig();

  // Get calendar configuration
  var config = getCalendarConfig();

  // Get calendar objects using the configuration
  var BIRTHDAYS = CalendarApp.getCalendarById(config.birthdaysCalendarId);
  var SIGNIFICANT_DATES = CalendarApp.getCalendarsByName(config.significantDatesCalendarName)[0];
  var HOLIDAY_DATES = CalendarApp.getCalendarsByName(config.holidayDatesCalendarName)[0];
  var today = new Date();
  var user = Session.getActiveUser().getEmail();

  // Initialize event arrays
  var todayEvents = [];
  var futureEvents = [];

  // Define the date ranges for events

  // Add events from each calendar only if the calendar exists
  if (BIRTHDAYS) todayEvents = todayEvents.concat(getEventsForDate(BIRTHDAYS, today));
  if (SIGNIFICANT_DATES) todayEvents = todayEvents.concat(getEventsForDate(SIGNIFICANT_DATES, today));
  if (HOLIDAY_DATES) todayEvents = todayEvents.concat(getEventsForDate(HOLIDAY_DATES, today));

  if (today.getDay() == 4) {
    var futureEvents = [];
    if (BIRTHDAYS) futureEvents = futureEvents.concat(getEventsInRange(BIRTHDAYS, today, 28));
    if (SIGNIFICANT_DATES) futureEvents = futureEvents.concat(getEventsInRange(SIGNIFICANT_DATES, today, 28));
    if (HOLIDAY_DATES) futureEvents = futureEvents.concat(getEventsInRange(HOLIDAY_DATES, today, 28));
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
  if (!calendar) return [];
  return calendar.getEventsForDay(date);
}

function getEventsInRange(calendar, startDate, days) {
  if (!calendar) return [];
  var endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + days);
  var events = calendar.getEvents(startDate, endDate);
  return events;
}
