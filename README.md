# Personal Automation Scripts

A collection of Google Apps Script automations to streamline daily tasks and keep you organized. All scripts are written in TypeScript for better type safety and code quality.

## Current Automations

### 📅 Significant Dates Reminders
Automatically sends email reminders for birthdays and other significant dates from your Google Calendars.

**Features:**
- **Daily reminders**: Get notified of events happening today
- **Weekly summaries**: Every Thursday, receive a summary of upcoming events for the next 28 days
- **Configurable calendars**: Choose which calendars to monitor
- **Automated scheduling**: Set up once and receive reminders automatically at 6 AM daily

**Quick Start:**
1. Navigate to the project directory: `cd significant_dates_reminders`
2. Follow the setup instructions in [significant_dates_reminders/README.md](significant_dates_reminders/README.md)
3. Run the `setup` function once to create the daily trigger
4. Test by running the `main` function once

## Future Automations

More automation scripts will be added to this repository over time to help with various productivity and organizational tasks.

## General Setup Requirements

All automations in this repository require:
- Google Apps Script access
- [clasp CLI](https://github.com/google/clasp) for deployment
- TypeScript for development

Each automation has its own setup guide in its respective directory.
