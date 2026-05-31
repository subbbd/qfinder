# Qfinder — Full Project Document
**Last Updated:** 2026-05-31
**Status:** Planning Phase — Skills Defined

---

## 1. Project Overview

### What is Qfinder?
Qfinder is a web-based application that helps everyday people check how busy a nearby place is and whether items are in stock — before they leave home. Think of it like checking traffic before driving, but for stores and pharmacies.

### The Problem It Solves
- You drive to a pharmacy and find a 30-minute queue
- You go to a grocery store and your item is out of stock
- You waste time, fuel, and energy on trips that could have been avoided

### The Solution
Qfinder shows you:
- **Live crowd levels** at nearby places (low / moderate / busy)
- **Item availability** reported by the community or pulled from store data
- **Best time to visit** based on historical patterns
- **Nearby alternatives** if your first choice is too busy

---

## 2. Target Users

| User Type | How They Use Qfinder |
|-----------|----------------------|
| General Public | Check crowd levels before heading out |
| Elderly / Mobility-limited | Plan visits to avoid peak hours |
| Parents | Find the quickest option for essentials |
| Healthcare workers | Check pharmacy stock quickly |
| Store Managers | (Future) See how their store is perceived |

---

## 3. Core Features

### Phase 1 — Must Have (Launch)
- [ ] User registration and login
- [ ] Map view showing nearby places (pharmacies, grocery stores, etc.)
- [ ] List view alternative to map
- [ ] Crowd level indicator per place (Low / Moderate / Busy)
- [ ] Community crowd reporting (users submit reports)
- [ ] Item availability reporting (users flag if item is in/out of stock)
- [ ] Place search by name or category
- [ ] Basic place detail page (address, hours, crowd history)
- [ ] Mobile-friendly design (works on phones via browser)

### Phase 2 — Nice to Have (Post Launch)
- [ ] Push notifications (e.g. "Pharmacy near you is now quiet")
- [ ] Favourite places list
- [ ] Report history per user
- [ ] Crowd trend graph (busiest times of the day/week)
- [ ] Store-specific item search
- [ ] Ratings and comments on places

### Phase 3 — Future / Advanced
- [ ] Store partnerships (direct inventory feed from stores)
- [ ] Native mobile app (iOS / Android)
- [ ] AI assistant integration ("Hey Qfinder, is the pharmacy busy?")
- [ ] MCP plugin for Claude and other AI tools
- [ ] Multi-language support

---

## 4. Data Sources

### Primary Sources (Free)
| Source | What It Provides | Cost |
|--------|-----------------|------|
| Google Places API (free tier) | Busy hours, place info, ratings | Free up to monthly limit |
| Community Reports | Real-time crowd and stock updates from users | Free |
| OpenStreetMap | Map tiles and place locations | Always free |

### Fallback Plan
- If Google Places free tier runs out: switch fully to OpenStreetMap + community data
- Community reports become the primary source of truth over time as user base grows

### Data Freshness Rules
- Community reports expire after 2 hours (marked as "old" after that)
- Google busy-hours data refreshes daily
- Place info (address, hours) refreshes weekly

---

## 5. Tech Stack

### Overview Table
| Layer | Technology | Purpose | Cost |
|-------|-----------|---------|------|
| Backend (Server) | Python + FastAPI | Handles all app logic and data | Free |
| Frontend (App) | React + Tailwind CSS | What users see and interact with | Free |
| Database | PostgreSQL (local machine) | Stores all user and place data | Free |
| Maps | OpenStreetMap + Leaflet.js | Shows map with store pins | Free |
| Authentication | JWT Tokens | Handles login/logout securely | Free |
| Agent / AI Layer | LangChain (lightweight) | Makes app work with AI tools and MCP | Free |
| Dev Tools | Git, VS Code | Code management and editing | Free |

### Why These Choices
- **FastAPI** — fast to build, easy to maintain, works well with AI layers
- **React + Tailwind** — lets us build a clean minimalist design quickly; works on phones without a separate mobile app
- **PostgreSQL** — runs on your machine at zero cost; handles lots of data well
- **LangChain** — lightweight wrapper that makes Qfinder talk to AI assistants and external tools
- **OpenStreetMap** — completely free maps, no API key needed

---

## 6. Agentic / MCP Design

Qfinder is built to be more than just a website — it's designed so other tools and AI systems can talk to it.

### What This Means (Simply)
- Claude (or any AI assistant) can ask Qfinder: *"Is the CVS on Oak Street busy right now?"*
- A chatbot on another website can embed Qfinder's data
- Businesses can connect their own tools to pull crowd data

### How It Works
Qfinder exposes a simple API (a set of doors other tools can knock on) that follows the MCP standard. No special setup needed for the user — it just works in the background.

### MCP Endpoints Planned
| Endpoint | What It Does |
|----------|-------------|
| `GET /places/nearby` | Returns list of places near a location |
| `GET /places/{id}/crowd` | Returns current crowd level for a place |
| `GET /places/{id}/inventory` | Returns reported item availability |
| `POST /reports/crowd` | Submit a new crowd report |
| `POST /reports/inventory` | Submit a new inventory report |
| `GET /places/search` | Search places by name or category |

---

## 7. Design Guidelines

### Style
- **Minimalistic** — only show what's needed, nothing extra
- **Clean** — lots of white space, simple typography
- **Mobile-first** — designed for phone screens, works on desktop too
- **No clutter** — no ads, no pop-ups, no unnecessary buttons

### Color Palette (Proposed)
| Color | Use |
|-------|-----|
| White `#FFFFFF` | Background |
| Light Gray `#F5F5F5` | Cards and panels |
| Dark Gray `#333333` | Text |
| Green `#4CAF50` | Low crowd / In stock |
| Amber `#FFC107` | Moderate crowd |
| Red `#F44336` | Busy / Out of stock |
| Blue `#2196F3` | Buttons and links |

### Key Screens
1. **Home / Map View** — Map with pins showing nearby places and their crowd status
2. **List View** — Same places shown as a scrollable list (for slower phones)
3. **Place Detail** — Name, address, hours, crowd level, item reports, submit a report
4. **Submit Report** — Simple form: How busy is it? Is [item] in stock?
5. **Login / Register** — Simple form, no social login needed
6. **Profile** — View your past reports, saved places

---

## 8. User Accounts

- **Login required** to submit reports (keeps data quality high)
- **Browsing is open** — anyone can view crowd levels without logging in
- Registration needs: email + password only (keep it simple)
- No personal data stored beyond what's needed

---

## 9. Database Structure (PostgreSQL)

### Tables
| Table | What It Stores |
|-------|---------------|
| `users` | Account info (email, password hash, created date) |
| `places` | Store info (name, address, location, type, hours) |
| `crowd_reports` | User-submitted crowd levels with timestamp and user ID |
| `inventory_reports` | User-submitted item availability with timestamp |
| `place_hours` | Opening and closing times per day |
| `categories` | Types of places (pharmacy, grocery, etc.) |

---

## 10. Folder Structure

```
claude-workshop/
└── queue-finder/
    ├── backend/                  # Python FastAPI server
    │   ├── main.py               # App entry point
    │   ├── routes/               # API endpoints
    │   ├── models/               # Database table definitions
    │   ├── services/             # Business logic
    │   ├── agent/                # LangChain / MCP integration
    │   └── requirements.txt      # Python dependencies
    ├── frontend/                 # React app
    │   ├── src/
    │   │   ├── pages/            # Each screen of the app
    │   │   ├── components/       # Reusable UI pieces
    │   │   ├── api/              # Calls to the backend
    │   │   └── styles/           # Tailwind config and global styles
    │   └── package.json          # Frontend dependencies
    ├── database/
    │   ├── schema.sql            # Table creation scripts
    │   └── seed.sql              # Sample data for testing
    ├── data/                     # Test datasets and fixtures
    ├── docs/                     # Extra notes, diagrams, guides
    ├── Qfinder MD.md             # This file
    └── README.md                 # Quick start guide
```

---

## 11. Commands

| Command | What Happens |
|---------|-------------|
| `start QF` | Runs all checks, then launches both frontend and backend |

### What "start QF" Does Behind the Scenes
1. Checks PostgreSQL is running and connected
2. Runs any pending database updates
3. Verifies all backend routes are responding
4. Checks frontend builds without errors
5. Confirms Google Places API key is valid (if set)
6. Launches backend server
7. Launches frontend app
8. Opens the app in your browser

---

## 12. Pre-Launch Testing Checklist

Every time before the app is started, these are verified automatically:

### Backend
- [ ] Database connection is healthy
- [ ] All API endpoints return correct responses
- [ ] User login and registration works
- [ ] Crowd report submission works
- [ ] Inventory report submission works
- [ ] Place search returns results
- [ ] Nearby places returns correct map data

### Frontend
- [ ] App loads without errors
- [ ] Map displays correctly
- [ ] List view loads places
- [ ] Place detail page shows all info
- [ ] Submit report form works
- [ ] Login and register screens work
- [ ] Mobile layout looks correct

### Data
- [ ] Place data is current (last refreshed within 7 days)
- [ ] Old crowd reports (2+ hours) are marked as stale
- [ ] No duplicate places in the database

---

## 13. Budget Summary

| Item | Cost |
|------|------|
| Backend (FastAPI) | Free |
| Frontend (React) | Free |
| Database (PostgreSQL on your machine) | Free |
| Maps (OpenStreetMap + Leaflet) | Free |
| Google Places API (free tier) | Free |
| Hosting (local machine while building) | Free |
| **Total** | **$0** |

---

## 14. Risks and Mitigation

| Risk | How We Handle It |
|------|-----------------|
| Google Places API hits free limit | Fall back to OpenStreetMap + community data only |
| Fake or spam crowd reports | Login required to report; flag repeated bad reports |
| App runs slow on phone | Optimized React components; lazy loading |
| Database gets too big | Archive old reports after 30 days |
| Data goes stale | Auto-expire crowd reports after 2 hours |

---

## 15. Open Questions (To Be Decided)

- [ ] What city or area will we use for first testing?
- [ ] Should the first screen be the map or a list? (map is more visual, list is faster)
- [ ] Do we need an admin panel to manage places and users?
- [ ] Email verification on signup — yes or no?

---

## 16. Skill Documents

Detailed breakdowns for each core skill live in the `skills/` folder:

| Skill | File | What It Covers |
|-------|------|---------------|
| Inventory Management | [skills/Inventory.md](skills/Inventory.md) | Stock reporting, item requests, item search |
| Customer Info | [skills/CustomerInfo.md](skills/CustomerInfo.md) | Accounts, profiles, points, badges, leaderboard |
| Crowd Sourcing | [skills/CrowdSourcing.md](skills/CrowdSourcing.md) | Crowd reports, map pins, trends, guest reporting |

---

## 17. Change Log

| Date | Change | Who |
|------|--------|-----|
| 2026-05-31 | Initial document created | Planning session |
| 2026-05-31 | Three skill documents created (Inventory, CustomerInfo, CrowdSourcing) | Planning session |

---

*This document is a living record of the Qfinder project. It will be updated every time a decision is made, a feature is added, or the project direction changes.*
