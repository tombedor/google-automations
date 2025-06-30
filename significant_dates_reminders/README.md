# Significant Dates Reminders

This Google Apps Script project sends reminders for birthdays and other significant dates from your Google Calendars. Written in TypeScript for better type safety and code quality.

## Setup

1. Clone this repository
1. `cd ./significant_dates_reminders`
2. Install the [clasp CLI](https://github.com/google/clasp) if you haven't already:
   ```
   npm install -g @google/clasp
   ```
3. Install TypeScript and type definitions for Google Apps Script:
   ```
   npm install -D typescript @types/google-apps-script
   ```
4. Login to clasp:
   ```
   clasp login
   ```
5. Create a new Apps Script project:
   ```
   clasp create --title "Significant Dates Reminders" --rootDir .
   ```
6. Enable TypeScript in your `.clasp.json` file (it should include):
   ```json
   {
     "scriptId": "your-script-id",
     "rootDir": "./significant_dates_reminders",
     "fileExtension": "ts"
   }
   ```
7. Push the code to your Apps Script project:
   ```
   clasp push
   ```
6. Configure your calendars by running:
   ```
   clasp run setCalendars -p '[{"calendar_ids": ["addressbook#contacts@group.v.calendar.google.com", "en.usa#holiday@group.v.calendar.google.com", "your_calendar_id_here"]}]'
   ```
   Replace the calendar IDs with your own. You can find a calendar's ID in its settings in Google Calendar.

7. Set up a trigger to run the script daily:
   ```
   clasp open
   ```
   Then in the Apps Script editor, click on "Triggers" in the sidebar, and set up a time-driven trigger to run the `checkEvents` function daily.

## Usage

The script will check your configured calendars for events and send you an email reminder:
- Every day for events occurring that day
- Every Thursday for events occurring in the next 28 days

## Configuration

You can update your calendar configuration at any time by running:
```
clasp run setCalendars -p '[{"calendar_ids": ["your_updated_list_of_calendar_ids"]}]'
```

## Note

The `.clasp.json` file contains your script ID and should not be committed to version control. It's already added to `.gitignore`.
