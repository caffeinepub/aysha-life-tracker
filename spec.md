# Aysha Life Tracker

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- **Spiritual section (Riyalah)**: Daily checklist — Tahajjud, Fajr Adhkar, Qur'an, Istighfar, Swalath, Kitab Reading — with progress bar
- **Academics section**: MA Books progress tracker (10 books), Certificates tracker (4 items), NET Preparation tracker (5 items) — all with progress bars and checkboxes
- **Career section**: Students Goal tracker (5 students), Tuition Income Tracker with ₹ input and display
- **Daily Planner**: Add/check off tasks for the day
- **Pomodoro Study Timer**: 25-minute countdown with start/pause/reset
- Tabbed or sectioned navigation: Spiritual | Academics | Career | Daily
- Persistent state via backend (ICP canister)
- Beautiful, polished UI with themed sections for each life domain

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: store tracker state (checked items per section, income, daily tasks, timer state) per user in Motoko
2. Frontend: tabbed layout with 4 tabs — Spiritual, Academics, Career, Daily Planner
   - Spiritual tab: Riyalah checklist with progress
   - Academics tab: MA Books, Certificates, NET Prep sections with progress bars
   - Career tab: Students Goal, Income Tracker
   - Daily tab: Task planner + Pomodoro timer
3. Apply rich aesthetics: calming color palette, section-specific iconography, smooth transitions
