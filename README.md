# Significant Dates Reminders

A Google Apps Script project that automatically sends email reminders for birthdays and other significant dates from your Google Calendars. Written in TypeScript for better type safety and code quality.

## Features

- **Daily reminders**: Get notified of events happening today
- **Weekly summaries**: Every Thursday, receive a summary of upcoming events for the next 28 days
- **Configurable calendars**: Choose which calendars to monitor
- **Automated scheduling**: Set up once and receive reminders automatically at 6 AM daily

## Quick Start

1. Navigate to the project directory:
   ```bash
   cd significant_dates_reminders
   ```

2. Follow the setup instructions in the [significant_dates_reminders/README.md](significant_dates_reminders/README.md)

3. Run the `setup` function once to create the daily trigger

4. Test by running the `main` function once

## How It Works

The script checks your configured Google Calendars and sends email reminders:
- **Every day**: Events occurring today
- **Every Thursday**: Events occurring in the next 28 days

Perfect for staying on top of birthdays, anniversaries, and other important dates!

## Configuration

You can customize which calendars to monitor by setting the `CALENDAR_NAMES` script property in Google Apps Script. See the detailed setup guide for instructions.
