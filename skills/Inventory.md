# Skill: Inventory Management
**Project:** Qfinder
**Last Updated:** 2026-05-31
**Status:** Defined — Not Yet Built

---

## Purpose
Lets users find out if a specific item is available at nearby stores — and lets them request help from the community if they can't find it.

---

## What This Skill Covers

### 1. Report Stock (Anyone Logged In)
- A logged-in user visits a store and checks if an item is available
- They open Qfinder, find the store, and tap "Report Item"
- They enter the item name and select: **In Stock** or **Out of Stock**
- Report is saved with: item name, store, timestamp, user ID, and status

### 2. Request an Item (Anyone Logged In)
- A user is looking for a specific item and doesn't know where to find it
- They tap "I'm Looking For..." and enter the item name + their general area
- The request is visible to nearby logged-in users
- If someone finds it, they can respond with the store location
- Requests expire after 24 hours automatically

### 3. View Item Availability (Anyone, No Login Needed)
- From any store's detail page, users can see recently reported items
- Shows: item name, status (in/out of stock), time reported, how old the report is
- Reports older than 2 hours are marked as **Stale** (may be outdated)
- Reports older than 6 hours are hidden by default (can be shown if user wants)

### 4. Search for an Item Across Nearby Stores
- User types an item name in the search bar
- App shows all nearby stores where that item was reported as In Stock (within last 2 hours)
- Sorted by: most recent report first, then by distance
- Out-of-stock reports shown below, clearly marked

### 5. Item Report History Per Store
- Each store's page shows a history of item reports
- Grouped by item name
- Shows trend: was it in stock more often than not?

---

## Report Rules
| Rule | Detail |
|------|--------|
| Who can report stock | Logged-in users only |
| Who can request items | Logged-in users only |
| Who can view availability | Everyone (no login needed) |
| Report expiry | Marked stale after 2 hours |
| Report hidden | After 6 hours (unless user requests to see old reports) |
| Duplicate reports | If same user reports same item at same store within 30 min, only latest is kept |
| Spam protection | More than 10 reports in 10 minutes from one account triggers a review flag |

---

## Points System Integration
| Action | Points Earned |
|--------|--------------|
| Report item as In Stock (verified later) | 10 points |
| Report item as Out of Stock (verified later) | 10 points |
| Fulfil a community item request | 20 points |
| Submit item request that gets answered | 5 points |
| Report marked as inaccurate by others | -5 points |

---

## MCP / Agent Integration
This skill exposes the following API endpoints for use by AI tools and external apps:

| Endpoint | Method | What It Does |
|----------|--------|-------------|
| `/inventory/search` | GET | Search for an item across nearby stores |
| `/inventory/store/{id}` | GET | Get all reported items for a specific store |
| `/inventory/report` | POST | Submit a new stock report (requires login token) |
| `/inventory/request` | POST | Submit an item request (requires login token) |
| `/inventory/requests/nearby` | GET | Get open item requests near a location |
| `/inventory/requests/{id}/respond` | POST | Respond to an item request with a store location |

### Example AI Interaction
> **User to Claude:** "Where can I find baby formula near me?"
> **Claude asks Qfinder:** `GET /inventory/search?item=baby+formula&lat=xx&lon=xx`
> **Qfinder responds:** "CVS on Oak St reported In Stock 45 min ago. Walgreens on 5th Ave reported Out of Stock 1 hr ago."

---

## Database Tables Used
| Table | Purpose |
|-------|---------|
| `inventory_reports` | Stores each stock report |
| `item_requests` | Stores community item requests |
| `request_responses` | Links a response (store found) to a request |
| `users` | For linking reports to accounts |
| `places` | For linking reports to stores |

---

## UI Screens
| Screen | Description |
|--------|-------------|
| Store Detail → Inventory Tab | Shows reported items for that store |
| Report Item Form | Item name + In Stock / Out of Stock toggle |
| Item Request Form | What you're looking for + your area |
| Search Results | List of stores with a specific item in stock |
| My Requests | User's open and closed item requests |

---

## Open Items
- [ ] Should item names be free text or from a preset list? (Free text is flexible, preset list avoids duplicates like "baby formula" vs "infant formula")
- [ ] Should users get notified when their item request is answered?
- [ ] Do we show brand names or just generic item names?

---

## Change Log
| Date | Change |
|------|--------|
| 2026-05-31 | Skill document created |
