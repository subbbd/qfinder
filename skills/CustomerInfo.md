# Skill: Customer Info
**Project:** Qfinder
**Last Updated:** 2026-05-31
**Status:** Defined — Not Yet Built

---

## Purpose
Manages everything about the people who use Qfinder — their accounts, activity, saved places, and recognition for contributing to the community.

---

## What This Skill Covers

### 1. Registration
- User signs up with: email address + password only
- No phone number, no social login, no personal details required
- Email is verified with a simple confirmation link
- Password must be at least 8 characters (no complex rules to keep it easy)
- After registration, user lands on the home map view

### 2. Login / Logout
- Login with email + password
- Session stays active for 7 days (no need to log in again for a week)
- Logout button always visible in the menu
- Forgot password flow: enter email → receive reset link → set new password

### 3. User Profile
What a user can see on their own profile page:
- Email address (and option to change it)
- Date joined
- Total reports submitted (crowd + inventory)
- Points balance
- Leaderboard rank
- Badges earned
- Saved places list
- Recent report history (last 20 reports)
- Option to delete account

### 4. Saved Places
- Any logged-in user can save a place to their favourites
- Saved places appear at the top of the list view for quick access
- Users can remove a place from saved at any time
- Max 20 saved places per user (keeps it manageable)

### 5. Report History
- Users can see all reports they've submitted
- Each entry shows: place, type of report (crowd/inventory), what was reported, time, and current status (fresh/stale)
- Helps users track their contributions

### 6. Account Settings
- Change email
- Change password
- Notification preferences (future — for when notifications are built)
- Delete account (with confirmation step)
- All data deleted within 24 hours of account deletion

---

## Points System

Users earn points by contributing accurate and useful reports. Points are displayed on their profile and count toward the leaderboard.

### How Points Are Earned
| Action | Points |
|--------|--------|
| Submit a crowd report (guest or logged in) | 5 points (logged-in only) |
| Submit an inventory report (in stock / out of stock) | 10 points |
| Fulfil a community item request | 20 points |
| First report of the day at any store | Bonus +5 points |
| Report later confirmed as accurate by others | +5 bonus |
| Report flagged as inaccurate | -5 points |
| Complete your profile (email verified) | One-time +10 points |

### Point Rules
- Points cannot be bought or transferred
- Points do not expire
- Negative points cannot go below 0 (floor is zero)
- Fake or spam reports result in account review and possible ban

---

## Leaderboard

### What It Shows
- Top 10 contributors this week (by points earned in the last 7 days)
- Top 10 contributors all time
- Your own rank (even if not in top 10)

### Where It Appears
- Dedicated leaderboard page accessible from the main menu
- Small "Top Reporter" badge on profile for users in the top 10 this week

### Leaderboard Rules
- Only logged-in users appear on the leaderboard
- Guest crowd reports do not earn points and do not count toward the leaderboard
- Rankings update every hour

---

## Badges
Simple recognition for milestones:

| Badge | How to Earn |
|-------|------------|
| First Step | Submit your first report |
| Regular | Submit 10 reports |
| Trusted Reporter | Submit 50 reports with no inaccuracy flags |
| Item Hunter | Answer 5 community item requests |
| Crowd Watcher | Submit 25 crowd reports |
| Top of the Week | Finish in the top 10 leaderboard for the week |
| Veteran | Account is 6+ months old with 100+ reports |

---

## Privacy Rules
| Data | Stored? | Visible to Others? |
|------|---------|-------------------|
| Email address | Yes | No |
| Password | Yes (encrypted) | No |
| Reports submitted | Yes | Only report content, not who submitted it |
| Points and rank | Yes | Yes (on leaderboard, first name or username only) |
| Saved places | Yes | No |
| Location | No | No (we only use location temporarily, never store it) |

---

## MCP / Agent Integration
This skill exposes the following endpoints for AI tools and external apps:

| Endpoint | Method | What It Does |
|----------|--------|-------------|
| `/users/register` | POST | Create a new account |
| `/users/login` | POST | Log in and receive a session token |
| `/users/profile` | GET | Get the logged-in user's profile info |
| `/users/reports` | GET | Get the logged-in user's report history |
| `/users/saved-places` | GET | Get the user's saved places |
| `/users/saved-places/{id}` | POST/DELETE | Add or remove a saved place |
| `/leaderboard/weekly` | GET | Get the weekly top 10 |
| `/leaderboard/alltime` | GET | Get the all-time top 10 |

### Example AI Interaction
> **User to Claude:** "What are my saved places on Qfinder?"
> **Claude asks Qfinder:** `GET /users/saved-places` (with user token)
> **Qfinder responds:** "You have 4 saved places: CVS Oak St, Whole Foods Downtown, Walgreens 5th Ave, Target Main St."

---

## Database Tables Used
| Table | Purpose |
|-------|---------|
| `users` | Core account info (email, password hash, join date) |
| `user_points` | Points balance and history |
| `user_badges` | Which badges each user has earned |
| `saved_places` | Each user's favourite places list |
| `sessions` | Login session tokens |

---

## UI Screens
| Screen | Description |
|--------|-------------|
| Register | Email + password form |
| Login | Email + password form + forgot password link |
| Profile | Points, badges, rank, report history, saved places |
| Leaderboard | Weekly and all-time top contributors |
| Account Settings | Change email/password, delete account |
| My Reports | History of all reports submitted |

---

## Open Items
- [ ] Should users pick a display name/username on signup, or use email prefix by default?
- [ ] Should there be email notifications when someone answers your item request?
- [ ] Do we want a profile picture option, or keep it text-only?

---

## Change Log
| Date | Change |
|------|--------|
| 2026-05-31 | Skill document created |
