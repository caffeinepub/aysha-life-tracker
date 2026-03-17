# Aysha Life Tracker

## Current State
A comprehensive personal productivity app with sections for MA Books, Riyalah streak, Study Hours, Daily Goals, Pomodoro Timer, Students, Habit Heatmap, Achievement Badges, Weekly Reflection, Focus Mode, and many more. All state is in localStorage via React useState/useEffect. Students section has a fixed list; achievements have default completed statuses; heatmap shows generic squares; Focus Mode partially hides sections; no view modes; no collapsible sections; no quick actions panel.

## Requested Changes (Diff)

### Add
- **Restart Week button**: clears weekly study hours + weekly goals, keeps long-term progress, shows toast "New week. Start fresh."
- **Reset Weekly Data button** (Study Hours section): resets study hours to 0, weekly summary, today's tasks/goals — with confirmation dialog "Are you sure you want to reset this week?"
- **Full Reset button** (settings/top): clears all trackers (study, riyalah, goals, planner, income, achievements), keeps structure — with warning dialog "This will clear all your progress. This cannot be undone."
- **Dynamic Students section**: Add Student button with form (Name, Subject, Notes, Class Frequency); each student card has Edit, Delete, session counter (+), active/inactive toggle, Next Class field; remove fixed students list
- **Improved Habit Heatmap**: show actual date numbers on boxes, highlight today, show month name, prev/next month navigation, click a date to show that day's details (study hours, riyalah completion, tasks)
- **Quick Actions panel**: floating or top panel with buttons: + Add Task, + Add Study Time, + Add Student, + Mark Riyalah Done
- **View Mode toggles**: Dashboard, Focus, Deep Work (study+timer only), Review (weekly summary+reflection) — buttons at top
- **Collapsible sections**: all sections can expand/collapse; default only main sections open
- **Motivational message** in achievements: "Missed a day? Missed a week? Start again. That's the system."

### Modify
- **Achievements**: remove default completed status (start empty); add Edit/Delete per achievement; add custom achievement creation; mark complete/incomplete; auto-unlock: 1 MA book → "First MA Book", 5 students → "5 Students Reached", 7-day riyalah → streak badge
- **Focus Mode**: when ON show ONLY Today's Focus, Today's 3 Wins, Pomodoro Timer; hide ALL other sections; centered clean layout; message "Focus Mode — Do only what matters."
- **Mobile layout**: stack vertically, reduce spacing, bigger tap targets, reduce card sizes/padding, consistent colors, fewer gradients

### Remove
- Fixed/hardcoded students list
- Default completed status on achievements

## Implementation Plan
1. Add view mode state (dashboard/focus/deepwork/review) with toggle buttons at top
2. Make all sections collapsible with expand/collapse state (localStorage persisted)
3. Rewrite Students section as fully dynamic (add/edit/delete with form, class frequency, next class, active toggle)
4. Rewrite Achievements section (no default completed, add/edit/delete, custom, auto-unlock logic)
5. Add Restart Week button with toast
6. Add Reset Weekly Data button with confirmation dialog in Study Hours section
7. Add Full Reset button with warning dialog in header/settings area
8. Improve Habit Heatmap (dates, today highlight, month nav, click to view day details)
9. Add Quick Actions panel
10. Improve Focus Mode (show only 3 sections, center layout, message)
11. Mobile layout improvements (responsive, compact, bigger buttons)
