/**
 * Function to set calendar IDs in script properties.
 * This can be called via clasp CLI:
 * clasp run setCalendars -p '[{"calendar_ids": ["id1", "id2", "id3"]}]'
 *
 * @param {Object} params - Parameters object with calendar_ids array
 * @return {Object} Result of the operation
 */
function setCalendars(params) {
  if (!params || !params.calendar_ids || !Array.isArray(params.calendar_ids)) {
    return {
      success: false,
      error: "Invalid parameters. Expected: {calendar_ids: [id1, id2, ...]}"
    };
  }

  var properties = PropertiesService.getScriptProperties();
  properties.setProperty('CALENDAR_IDS', JSON.stringify(params.calendar_ids));

  return {
    success: true,
    message: "Successfully set " + params.calendar_ids.length + " calendar IDs",
    calendar_ids: params.calendar_ids
  };
}

/**
 * Function to get configured calendar IDs from script properties.
 * Falls back to default values if not set.
 *
 * @return {Array} Array of calendar IDs
 */
function getCalendarIds() {
  var properties = PropertiesService.getScriptProperties();
  var calendarIdsJson = properties.getProperty('CALENDAR_IDS');

  if (calendarIdsJson) {
    try {
      return JSON.parse(calendarIdsJson);
    } catch (e) {
      Logger.log('Error parsing calendar IDs: ' + e.toString());
    }
  }

  // Default calendar IDs if none are configured
  return [
    'addressbook#contacts@group.v.calendar.google.com',  // Contacts/Birthdays
    'en.usa#holiday@group.v.calendar.google.com'         // US Holidays
  ];
}

/**
 * Function to validate calendars and throw descriptive errors if they're null
 *
 * @param {Array} calendars - Array of calendar objects
 * @param {Array} calendarIds - Array of calendar IDs that were used
 */
function validateCalendars(calendars, calendarIds) {
  var errors = [];

  for (var i = 0; i < calendars.length; i++) {
    if (!calendars[i]) {
      errors.push("Calendar not found. Check the calendar ID: '" + calendarIds[i] + "'");
    }
  }

  if (errors.length > 0) {
    throw new Error("Calendar validation failed:\n- " + errors.join("\n- "));
  }
}

/**
 * Main function to check events and send reminders
 */
function checkEvents() {
  var today = new Date();
  var user = Session.getActiveUser().getEmail();

  // Get configured calendar IDs
  var calendarIds = getCalendarIds();

  // Get calendar objects
  var calendars = [];
  for (var i = 0; i < calendarIds.length; i++) {
    calendars.push(CalendarApp.getCalendarById(calendarIds[i]));
  }

  // Validate calendars - will throw descriptive errors if any calendar is null
  validateCalendars(calendars, calendarIds);

  // Initialize event arrays
  var todayEvents = [];
  var futureEvents = [];

  // Get today's events from all calendars
  for (var i = 0; i < calendars.length; i++) {
    todayEvents = todayEvents.concat(getEventsForDate(calendars[i], today));
  }

  // Get future events if today is Thursday (day 4)
  if (today.getDay() == 4) {
    for (var i = 0; i < calendars.length; i++) {
      futureEvents = futureEvents.concat(getEventsInRange(calendars[i], today, 28));
    }
  } else {
    Logger.log("weekday is " + today.getDay().toString() + ". Not notifying on new events");
  }

  var reminderEvents = todayEvents.concat(futureEvents);

  if (reminderEvents.length == 0) {
    Logger.log("no birthdays or significant events to remind");
    return;
  } else {
    Logger.log("found " + reminderEvents.length.toString() + " events to remind");
  }

  // put together subject. max recommended email subject is 78 chars.
  var subject = "Reminder: " + reminderEvents.map((x) => {
    var entry = x.getTitle();
    if (x.getStartTime().getDate() == today.getDate()) {
      entry += " (TODAY)";
    }
    return entry;
  }).join(", ").substring(0,77);
  var body = "";

  if (todayEvents.length > 0) {
    body += "Today's birthdays and significant dates:\n\n";
    for (var i = 0; i < todayEvents.length; i++) {
      body += todayEvents[i].getTitle() + " on " + todayEvents[i].getStartTime().toLocaleDateString() + "\n";
    }
  }

  if (futureEvents.length > 0) {
    body += "\nThis month's birthdays and significant dates:\n\n";
    for (var i = 0; i < futureEvents.length; i++) {
      body += futureEvents[i].getTitle() + " on " + futureEvents[i].getStartTime().toLocaleDateString() + "\n";
    }
  }

  GmailApp.sendEmail(user, subject, body);
}

/**
 * Helper function to get events for a specific date
 */
function getEventsForDate(calendar, date) {
  return calendar.getEventsForDay(date);
}

/**
 * Helper function to get events in a date range
 */
function getEventsInRange(calendar, startDate, days) {
  var endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + days);
  var events = calendar.getEvents(startDate, endDate);
  return events;
}
