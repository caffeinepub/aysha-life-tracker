# Aysha Life Tracker

## Current State
App has a wrapper constrained to 412px wide / 915px tall on desktop (Samsung Galaxy A16 phone frame). Period calendar shows days with color coding but dates are not clickable — cannot mark period start/end by tapping a date.

## Requested Changes (Diff)

### Add
- Calendar dates in CycleScreen are now clickable: tapping a date opens a small flow picker (Spotting / Light / Medium / Heavy) and marks it as a period day, saving to periodLogs and periodEvents.
- If the date already has a period event, clicking it removes it (toggle off).
- Show a small indicator (dot or ring) on dates that have been manually marked.

### Modify
- Remove phone-frame sizing constraints: change wrapper from `md:max-w-[412px] md:max-h-[915px] md:overflow-y-auto md:rounded-[40px] md:shadow-2xl md:my-4` to a normal responsive layout (`max-w-2xl mx-auto` or similar) so the app fills the screen naturally like before the Galaxy A16 optimization.

### Remove
- Phone-frame CSS constraints (412px width cap, 915px height cap, rounded-[40px], overflow-y-auto on the wrapper).

## Implementation Plan
1. Update the main wrapper div classes to remove Galaxy A16 phone-frame constraints; use a normal full-width responsive layout.
2. In CycleScreen calendar, make each day cell a `<button>` with onClick.
3. On click: if date is already a period day, remove it from periodLogs/periodEvents. If not, show an inline flow picker (small pill buttons) for that date, then on flow selection, add to periodLogs and periodEvents as a start event.
4. Persist changes to localStorage.
5. Show a small dot on marked period dates in the calendar.
