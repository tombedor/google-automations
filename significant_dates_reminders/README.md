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
6. (Optional) Configure custom calendar names:
   - Run `clasp open` to open the Apps Script editor
   - Click on Project Settings (gear icon in the sidebar)
   - In the "Script Properties" section, click "Add script property"
   - Set Property: `CALENDAR_NAMES`
   - Set Value: `["Calendar Name 1", "Calendar Name 2"]` (JSON array format)
   - Use the exact names as they appear in your Google Calendar
   - If not configured, defaults to "Contacts" and "Holidays"

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

To configure custom calendar names:

1. Open the Apps Script editor: `clasp open`
2. Go to Project Settings (gear icon)
3. In Script Properties, add or update:
   - **Property**: `CALENDAR_NAMES`
   - **Value**: `["Calendar Name 1", "Calendar Name 2", "Calendar Name 3"]`

The script uses these default calendar names if no custom configuration is set:
- `Contacts` (Birthdays from contacts)
- `Holidays` (US Holidays)

**Note**: Use the exact calendar names as they appear in your Google Calendar sidebar.

## Note

The `.clasp.json` file contains your script ID and should not be committed to version control. It's already added to `.gitignore`.
