# Skill: Crowd Sourcing
**Project:** Qfinder
**Last Updated:** 2026-05-31
**Status:** Defined — Not Yet Built

---

## Purpose
Collects and displays real-time crowd levels at nearby places, powered by what people report. Anyone — even without an account — can submit a crowd report. Logged-in users earn points for their contributions.

---

## What This Skill Covers

### 1. Submit a Crowd Report (Guests and Logged-In Users)
- Anyone can report how busy a place is right now
- Three levels only — keeps it simple:
  - **Quiet** — few or no people, no wait
  - **Moderate** — some people, short wait
  - **Busy** — crowded, long wait
- Guest reports are accepted but earn no points
- Logged-in user reports earn 5 points each
- Report takes less than 10 seconds to submit

### 2. View Crowd Level at a Place
- Shown on the map as a colour-coded pin:
  - Green = Quiet
  - Amber = Moderate
  - Red = Busy
  - Grey = No recent data
- Shown on the place detail page with:
  - Current level (based on last 3 reports averaged)
  - Time of the most recent report
  - How many reports in the last 2 hours
  - Freshness indicator (Fresh / Getting Old / Stale)

### 3. Crowd Level Calculation
How the app decides the current crowd level:

| Reports in Last 2 Hours | How Level is Calculated |
|------------------------|------------------------|
| 1 report | Show that report's level (marked as low confidence) |
| 2 reports | Average of both |
| 3+ reports | Average of the most recent 3 |
| 0 reports | Show "No recent data" in grey |

- If 2 out of 3 recent reports say Busy, the place shows as Busy
- Equal split defaults to the middle level (Moderate)

### 4. Report Expiry
| Time Since Report | Status |
|-------------------|--------|
| 0–2 hours | Fresh — shown and counted |
| 2–4 hours | Stale — shown but marked as outdated |
| 4+ hours | Hidden — not shown unless user requests old data |

### 5. Crowd History / Trends
- Each place builds up a history of crowd reports over time
- App shows a simple chart: typical crowd level by hour of day and day of week
- Example: "Usually Busy on Saturday mornings between 10am–12pm"
- History is calculated from the last 90 days of reports
- Requires at least 10 historical reports to show a trend (otherwise shows "Not enough data yet")

### 6. Flagging Bad Reports
- Any logged-in user can flag a crowd report as inaccurate
- If a report gets 3 flags, it is removed and not counted
- The original reporter loses 5 points if the report is removed this way
- Repeat offenders (3+ removed reports) are reviewed and may be restricted

### 7. Map View Behaviour
- Map shows crowd pins for all places within the visible area
- As user zooms or pans, pins update automatically
- Tapping a pin opens a mini summary (place name, crowd level, last report time)
- Tapping "See More" opens the full place detail page

---

## Report Rules Summary
| Rule | Detail |
|------|--------|
| Who can report | Everyone — guests and logged-in users |
| Points for reporting | Logged-in users only (5 points per report) |
| Report options | Quiet / Moderate / Busy (3 choices only) |
| Report expiry | Stale after 2 hours, hidden after 4 hours |
| Duplicate limit | Same user cannot report same place more than once per 30 minutes |
| Spam detection | More than 5 reports in 5 minutes from same IP triggers a review |
| Guest reports | Count toward crowd level but do not earn points and are slightly lower weighted |

---

## Weighting System (Hidden from Users)
Not all reports carry equal weight. This runs silently in the background:

| Reporter Type | Weight |
|--------------|--------|
| Guest | 0.7 (slightly less trusted) |
| Logged-in user (new account) | 1.0 |
| Logged-in user with 50+ accurate reports | 1.3 |
| Logged-in user with Trusted Reporter badge | 1.5 |
| Report that has been flagged before | 0.5 |

This means a Trusted Reporter saying "Busy" has more impact on the displayed level than a guest saying "Quiet."

---

## Data Sources Combined
Crowd level shown to the user is a blend of:

1. **Community reports** (primary — what users actually see right now)
2. **Google Places busy hours** (secondary — historical patterns for typical times)

If no community reports exist in the last 2 hours, the app shows Google's historical "usually busy at this time" data, clearly labelled as **"Typical — no live reports yet."**

---

## MCP / Agent Integration
This skill exposes the following endpoints for AI tools and external apps:

| Endpoint | Method | What It Does |
|----------|--------|-------------|
| `/crowd/report` | POST | Submit a crowd level report (guest or logged in) |
| `/crowd/place/{id}` | GET | Get current crowd level for a specific place |
| `/crowd/nearby` | GET | Get crowd levels for all places near a location |
| `/crowd/place/{id}/history` | GET | Get crowd trends for a place (by hour/day) |
| `/crowd/place/{id}/reports` | GET | Get raw recent reports for a place |
| `/crowd/flag/{report_id}` | POST | Flag a report as inaccurate (requires login) |

### Example AI Interaction
> **User to Claude:** "Is the pharmacy on Oak Street busy right now?"
> **Claude asks Qfinder:** `GET /crowd/place/1042`
> **Qfinder responds:** "Moderate — 2 reports in the last hour. Last reported 23 minutes ago."

> **User to Claude:** "When is the best time to go to that pharmacy?"
> **Claude asks Qfinder:** `GET /crowd/place/1042/history`
> **Qfinder responds:** "Usually quietest on weekday mornings between 9am–11am. Typically busiest Saturday afternoons."

---

## Database Tables Used
| Table | Purpose |
|-------|---------|
| `crowd_reports` | Each submitted crowd report (level, place, time, reporter) |
| `crowd_flags` | Flags raised on bad reports |
| `places` | Links reports to physical locations |
| `users` | Links reports to accounts (null for guests) |
| `crowd_history` | Aggregated historical crowd data per place per hour |

---

## UI Screens
| Screen | Description |
|--------|-------------|
| Map View | Colour-coded pins showing crowd level per place |
| Place Detail → Crowd Tab | Current level, recent reports, crowd trend chart |
| Submit Report (quick) | 3-button selector: Quiet / Moderate / Busy — done in one tap |
| Flag Report | Simple "This seems wrong" button on each report |
| Place Detail → History | Chart showing typical busy times by hour and day |

---

## Guest Reporting Flow (Simplified)
To keep it as fast as possible for guests:

1. User opens Qfinder (no login)
2. Finds the place on the map
3. Taps "Report Crowd"
4. Taps one of three buttons: Quiet / Moderate / Busy
5. Done — report submitted in under 10 seconds
6. Optional prompt shown after: "Sign up to earn points for your report"

---

## Open Items
- [ ] Should there be an optional free-text comment on a crowd report? ("Queue is outside the door" etc.) — adds value but adds complexity
- [ ] Should guests be prompted to sign up after submitting, or keep it completely silent?
- [ ] Do we show how many total reports a place has ever received (builds trust in the data)?

---

## Change Log
| Date | Change |
|------|--------|
| 2026-05-31 | Skill document created |
