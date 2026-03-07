# Event Registration Endpoint Fix

## Issue
The "Reserve Spot" button for free events was showing "endpoint not found" error because the registration endpoint was missing from the backend.

## Root Cause
The frontend was calling `POST /events/:id/register` but this endpoint didn't exist in `backend/routes/events.js`.

## Solution
Added two new endpoints to `backend/routes/events.js`:

### 1. POST /events/:id/register
**Purpose**: Register for an event (RSVP for free events, pending for paid events)

**Features**:
- Checks if event exists and is approved
- Prevents duplicate registrations
- Validates event capacity
- Sets status to 'RSVPed' for free events, 'Pending' for paid events
- Logs registration activity

**Request**: 
```
POST /events/:id/register
Headers: Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "message": "Successfully registered for event"
}
```

**Error Cases**:
- 404: Event not found or not approved
- 400: Already registered
- 400: Event at full capacity
- 500: Server error

### 2. DELETE /events/:id/register
**Purpose**: Cancel registration for an event

**Features**:
- Checks if registration exists
- Deletes registration (cascades to tickets)
- Logs cancellation activity

**Request**:
```
DELETE /events/:id/register
Headers: Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "message": "Registration cancelled successfully"
}
```

**Error Cases**:
- 404: Registration not found
- 500: Server error

## Files Modified
- `backend/routes/events.js` - Added registration endpoints

## Database Tables Used
- `events` - Check event exists and get details
- `registrations` - Create/delete registration records
- `activity_logs` - Log registration activities

## Testing

### Test 1: Register for Free Event
1. Navigate to any free event detail page
2. Click "Reserve Spot" button
3. **Expected**: Success message, button changes state
4. **Database**: Check `registrations` table for new record with status='RSVPed'

### Test 2: Register for Paid Event
1. Navigate to any paid event detail page
2. Click "Buy Tickets" button
3. **Expected**: Opens checkout modal (different flow)

### Test 3: Duplicate Registration
1. Register for an event
2. Try to register again
3. **Expected**: Error message "You are already registered for this event"

### Test 4: Full Capacity Event
1. Create event with capacity=1
2. Register as user 1
3. Try to register as user 2
4. **Expected**: Error message "Event is at full capacity"

### Test 5: Cancel Registration
1. Register for an event
2. Navigate to "My Events" page
3. Click cancel/unregister
4. **Expected**: Registration removed, can register again

## API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /events/:id/register | Required | Register for event |
| DELETE | /events/:id/register | Required | Cancel registration |

## Next Steps
1. **Restart backend server** to apply changes
2. Test registration flow on frontend
3. Verify database records are created correctly
4. Check activity logs for registration events

## Restart Backend
```bash
cd backend
npm start
# or
node server.js
```

## Verification
After restarting backend, check:
- ✅ Backend starts without errors
- ✅ Can register for free events
- ✅ Can cancel registrations
- ✅ Duplicate registration prevention works
- ✅ Capacity limits are enforced
- ✅ Activity logs are created
