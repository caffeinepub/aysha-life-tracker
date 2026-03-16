# Aysha Life Tracker

## Current State
A personal productivity app tracking MA studies, spiritual practices (Riyalah), career goals, students, income, daily planner, and Pomodoro timer. The app has editable section names, progress bars, streak trackers, and income management.

## Requested Changes (Diff)

### Add
- **MA Exam Countdown** at the very top: shows "Next exam in X days" with editable exam date
- **Stats Summary Bar**: small boxes for Study Hours This Week, Books Completed, Tasks Completed
- **Today's Reminder**: motivational quote card (editable, with a few rotating defaults)
- **Dark Mode Toggle**: toggle in the header to switch between light and dark themes
- **Today's Focus**: editable list of focus items for the day (Study, Riyalah, Career, Tuition entries)
- **MA Books Progress**: progress bars per book with percentage display
- **Riyalah Streak**: current streak and longest streak tracker with fire emoji
- **Study Hours This Week**: daily breakdown (Mon-Sun) with ability to add minutes
- **Active Students / Target**: show count of active students vs target
- **Monthly Income summary**: ₹earned / ₹goal display
- **Today's 3 Wins**: 3 checkbox items (Study MA, Complete Riyalah, Work on certificate) — editable labels

### Modify
- Header: add dark mode toggle button
- Overall layout: support dark mode via CSS class on root

### Remove
- Nothing removed

## Implementation Plan
1. Add dark mode state + toggle in header, apply `dark` class to root div
2. Add MA Exam Countdown component at top with editable exam date stored in state
3. Add Stats Summary row: Study Hours This Week (total), Books Completed count, Tasks Completed count
4. Add Today's Reminder card with rotating quotes + editable quote
5. Add Today's Focus section with editable focus items
6. Enhance MA Books section with per-book progress bars
7. Add Riyalah Streak card with current/longest streak display and increment buttons
8. Add Study Hours This Week breakdown (Mon-Sun) with add-minutes functionality
9. Ensure Active Students count and target are visible in Students section
10. Add Monthly Income summary display
11. Add Today's 3 Wins card with 3 editable checkboxes
12. Apply Tailwind dark: variants throughout for dark mode support
