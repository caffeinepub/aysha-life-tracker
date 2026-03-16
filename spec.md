# Aysha Life Tracker

## Current State
A personal productivity app with: MA Exam Countdown, MA Books progress bar, Riyalah streak tracker, Study Hours This Week, Today's Reminder (rotating quotes), Today's Focus checklist, per-student session/notes tracking, Daily Goals card, monthly income tracker, Pomodoro timer, dark mode toggle, Today's 3 Wins.

## Requested Changes (Diff)

### Add
1. **Weekly Reflection** - Three text areas: "What went well?", "What should improve?", "Key lesson learned". Saved in state.
2. **Quote of the Day** - Rotating daily inspirational quotes panel.
3. **Life Balance Wheel** - SVG radar/spider chart showing scores (1-10) for Spiritual, Study, Career, Health, Teaching. User can adjust each slider.
4. **Exam Preparation Meter** - MA Exam Readiness % calculated from: Books Completed (x/10), Revision (x/3), Practice Answers (x/10). Editable counts.
5. **Habit Heatmap** - Calendar grid (last 30 days) where user can mark each day as productive (green) or not (empty).
6. **Smart Weekly Review** - Card showing week summary: Study Hours, Riyalah Completion %, Certificates lessons finished, Income earned.
7. **Achievement Badges** - Milestone badges auto-unlocked: 7-Day Riyalah Streak, First MA Book, First Certificate, 5 Students Reached, etc.
8. **Morning/Night Mode greeting** - Dynamic greeting based on time of day: "Good morning Aysha" (6am-12pm), "Good afternoon" (12-6pm), "Good evening" (6pm+). Shows contextual prompt.
9. **Prayer Time Reminder** - Daily Salah checklist: Fajr, Dhuhr, Asr, Maghrib, Isha. Each toggleable with checkmark.
10. **Personal Reading Tracker** - List of leisure books with checkboxes. Can add new books, edit names, remove.
11. **Energy/Mood Tracker** - Single daily selection: Focused / Average / Tired with emoji icons.
12. **Monthly Wins** - Auto-populated box showing month's achievements (books completed, streak record, certificates, student count milestones).
13. **Vision Section** - "Why I'm Doing This" - editable list of personal goals/motivations.
14. **Emergency Reset Button** - Mini checklist: Pray, Read Qur'an, Study 20 minutes, Clean workspace.
15. **Weekly Planning Board** - Kanban-style 4-column board: Study, Career, Teaching, Spiritual. Each column has addable text tasks.
16. **Life Progress Bar** - Top of page combined daily progress meter (%) derived from Spiritual, Study, Career, Teaching sub-scores.
17. **Life Timeline** - Future milestones by year (2026, 2027). Editable list.
18. **Focus Mode Button** - Toggle that hides all sections except Today's Focus checklist + Pomodoro timer.
19. **Future Aysha Message** - Static motivational quote box.
20. **Monthly Report Generator** - End-of-month summary: Study Hours, Books Completed, Certificates, Income, Riyalah %.
21. **Achievement Timeline** - Chronological list of milestones reached (manually add or auto-triggered).

### Modify
- Header greeting to use time-based Morning/Night mode.
- Life Progress Bar replaces or augments the existing top summary area.

### Remove
- Nothing removed.

## Implementation Plan
1. Split App.tsx into logical section components to manage complexity.
2. Add all new state variables for each feature.
3. Implement SVG Life Balance Wheel with sliders.
4. Implement Habit Heatmap grid (last 35 days).
5. Implement Achievement Badges with unlock conditions.
6. Implement Focus Mode that conditionally renders only focus + timer.
7. Implement Weekly Planning Board (4 columns, addable tasks).
8. Wire all new sections into the main layout in a logical order.
9. Ensure dark mode classes propagate to all new components.
