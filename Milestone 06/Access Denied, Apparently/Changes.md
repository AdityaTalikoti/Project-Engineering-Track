# Event Manager – Access Control Fix Log

Documenting the vulnerabilities found and the fixes applied to resolve them.

---

## 🛠️ Your Fixes

### 1. Unauthorized Event Discovery
- **The Problem**: The `GET /api/events` endpoint returned all events stored in memory, allowing users to see events they did not create and were not invited to.
- **The Discovery**: Audited `server/routes/events.js` and saw `res.json(events)` returned unfiltered data.
- **The Fix**: Filtered the events list before returning, ensuring users only see events where they are either the creator or their email is in the `invitedEmails` array.

### 2. Private Detail Disclosure
- **The Problem**: The `GET /api/events/:id` endpoint returned full details of any event if the ID was known, even if the requesting user was not invited.
- **The Discovery**: Audited `server/routes/events.js` and observed no authorization checks on event detail lookup.
- **The Fix**: Added a check to verify that the requesting user is either the event creator or included in the `invitedEmails` list. If not, the API returns a `403 Forbidden` status.

### 3. RSVP Gatekeeping Bypass
- **The Problem**: The `POST /api/events/:id/rsvp` endpoint allowed any authenticated user to RSVP to any event, even if not invited, and did not prevent duplicate RSVPs.
- **The Discovery**: Audited the RSVP route in `server/routes/events.js` where `event.rsvps.push(req.user.id)` was called without checks.
- **The Fix**: Added verification that the user's email is present in `invitedEmails` (returning `403 Forbidden` if not) and that the user hasn't already RSVPed (returning `400 Bad Request` if they have).

### 4. Unauthorized Data Deletion
- **The Problem**: The `DELETE /api/events/:id` endpoint permitted any logged-in user to delete any event.
- **The Discovery**: Audited `server/routes/events.js` and confirmed there was no creator validation before splice/deletion.
- **The Fix**: Added ownership check `req.user.id === event.creatorId`, returning `403 Forbidden` if the user is not the event creator.

### 5. Misleading UI (Frontend Logic)
- **The Problem**: The RSVP and Delete buttons in `client/src/pages/EventDetail.jsx` were shown to all users regardless of their actual permissions.
- **The Discovery**: Audited the JSX in `client/src/pages/EventDetail.jsx` and found buttons were rendered unconditionally in the action footer.
- **The Fix**: Updated the UI rendering to show the RSVP button only if `event.isInvited` is true and the user has not RSVPed yet, and show the Delete button only if `event.isCreator` is true.
