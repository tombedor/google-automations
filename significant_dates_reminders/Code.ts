
/**
 * Function to get configured calendar names from script properties.
 * Falls back to default values if not set.
 *
 * @return Array of calendar names
 */
function getCalendarNames(): string[] {
  const properties = PropertiesService.getScriptProperties();
  const calendarNamesJson = properties.getProperty('CALENDAR_NAMES');

  if (calendarNamesJson) {
    try {
      return JSON.parse(calendarNamesJson);
    } catch (e) {
      Logger.log(`Error parsing calendar names: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // Default calendar names if none are configured
  return [
    'Holidays in United States'      // US Holidays
  ];
}

/**
 * Function to validate calendars and throw descriptive errors if they're null
 *
 * @param calendars - Array of calendar objects
 * @param calendarNames - Array of calendar names that were used
 */
function validateCalendars(calendars: GoogleAppsScript.Calendar.Calendar[], calendarNames: string[]): void {
  const errors: string[] = [];

  for (let i = 0; i < calendars.length; i++) {
    if (!calendars[i]) {
      errors.push(`Calendar not found with name: '${calendarNames[i]}'`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Calendar validation failed:\n- ${errors.join("\n- ")}`);
  }
}

/**
 * Main function to check events and send reminders
 */
function checkEvents(): void {
  const today = new Date();
  const user = Session.getActiveUser().getEmail();

  // Get configured calendar names
  const calendarNames = getCalendarNames();

  // Get calendar objects by name
  const calendars: GoogleAppsScript.Calendar.Calendar[] = [];
  for (let i = 0; i < calendarNames.length; i++) {
    const calendarsByName = CalendarApp.getCalendarsByName(calendarNames[i]);
    if (calendarsByName.length > 0) {
      calendars.push(calendarsByName[0]); // Use the first calendar with this name
    } else {
      calendars.push(null as any); // Will be caught by validation
    }
  }

  // Validate calendars - will throw descriptive errors if any calendar is null
  validateCalendars(calendars, calendarNames);

  // Initialize event arrays
  let todayEvents: GoogleAppsScript.Calendar.CalendarEvent[] = [];
  let futureEvents: GoogleAppsScript.Calendar.CalendarEvent[] = [];

  // Get today's events from all calendars
  for (let i = 0; i < calendars.length; i++) {
    todayEvents = todayEvents.concat(getEventsForDate(calendars[i], today));
  }

  // Get future events if today is Thursday (day 4)
  if (today.getDay() === 4) {
    for (let i = 0; i < calendars.length; i++) {
      futureEvents = futureEvents.concat(getEventsInRange(calendars[i], today, 28));
    }
  } else {
    Logger.log(`weekday is ${today.getDay().toString()}. Not notifying on new events`);
  }

  const reminderEvents = todayEvents.concat(futureEvents);

  if (reminderEvents.length === 0) {
    Logger.log("no birthdays or significant events to remind");
    return;
  } else {
    Logger.log(`found ${reminderEvents.length.toString()} events to remind`);
  }

  // put together subject. max recommended email subject is 78 chars.
  const subject = "Reminder: " + reminderEvents.map((x) => {
    let entry = x.getTitle();
    if (x.getStartTime().getDate() === today.getDate()) {
      entry += " (TODAY)";
    }
    return entry;
  }).join(", ").substring(0, 77);

  let body = "";

  if (todayEvents.length > 0) {
    body += "Today's birthdays and significant dates:\n\n";
    for (let i = 0; i < todayEvents.length; i++) {
      body += `${todayEvents[i].getTitle()} on ${todayEvents[i].getStartTime().toLocaleDateString()}\n`;
    }
  }

  if (futureEvents.length > 0) {
    body += "\nThis month's birthdays and significant dates:\n\n";
    for (let i = 0; i < futureEvents.length; i++) {
      body += `${futureEvents[i].getTitle()} on ${futureEvents[i].getStartTime().toLocaleDateString()}\n`;
    }
  }

  GmailApp.sendEmail(user, subject, body);
}

/**
 * Helper function to get events for a specific date
 *
 * @param calendar - The calendar to get events from
 * @param date - The date to get events for
 * @return Array of calendar events
 */
function getEventsForDate(calendar: GoogleAppsScript.Calendar.Calendar, date: Date): GoogleAppsScript.Calendar.CalendarEvent[] {
  return calendar.getEventsForDay(date);
}

/**
 * Helper function to get events in a date range
 *
 * @param calendar - The calendar to get events from
 * @param startDate - The start date of the range
 * @param days - Number of days to include in the range
 * @return Array of calendar events
 */
function getEventsInRange(calendar: GoogleAppsScript.Calendar.Calendar, startDate: Date, days: number): GoogleAppsScript.Calendar.CalendarEvent[] {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + days);
  return calendar.getEvents(startDate, endDate);
}
