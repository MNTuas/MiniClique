#                                                        MINICLIQUE
---

# 1. SYSTEM ARCHITECTURE

##  Overview

This project is built using a **Client–Server architecture**:

| Layer | Technology |
|-------|------------|
| Frontend | ReactJS |
| Backend | ASP.NET Core Web API |
| Database | MongoDB |
| Deployment | Vercel (FE) + Azure server (BE) |

---

## 📂 Backend Structure (3-layers)
/Models
├── Entities ( models, request, response )

/Repository
├── Helper ( databaseSettings )
├── Interface
├── Repositories class file

/Service
├── Shared ( results )
├── Interface
├── Services class file

/API
├── Controllers

---

# 3. DATA STORAGE

The system stores data using:

- ✅ MongoDB (Main Database) - LocalStorage ( Save information user after login )


### Main Collections ( Database table )

| Collection | Purpose |
|------------|----------|
| Users | Store user information |
| UserLikes | Store like actions |
| UserMatches | Store mutual matches |
| Availabilities | Store available time slots |
| MatchesScheduler | Store available matches |

---

# 4. MATCH LOGIC

## When is a match created?

A match is created only when:
User A likes User B
AND
User B likes User A


## Flow Logic:

1. Check that both users exist
2. Check if the user has already liked the other (prevent duplicate/spam likes)
3. Create the like record
4. Check if a reverse like exists
5. If yes → create a match (if it does not already exist)

(You can find this code in MiniClique/MiniClique_Service/UserMatchesService.cs - CreateAsync)

# 5. OVERLAPPING SLOT LOGIC

1. Check whether both users in the match have submitted availability
2. If both submitted → find the first overlapping time slot
3. If an overlapping slot exists:
4. Check if a schedule already exists (prevent duplicate schedule creation)
5. If not → create a new match schedule

(You can find this code in MiniClique/MiniClique_Service/AvailabilitiesService.cs - CreateAsync)

# 6. FUTURE IMPROVEMENTS

If I had more time, I would:

- Implement password hashing (BCrypt, JWT)
- Spend more time to config database collection
- Real-time match notification and Chat 

---

# 7. PROPOSED NEW FEATURES

| Feature | Reason |
|----------|--------|
| Chat between matched users | Increase engagement |
| Recommendation system | Improve matching rate |
| Direct calendar booking | Real-world usability |


---

# 👨‍💻 AUTHOR

Developed by: **MNTuas**
