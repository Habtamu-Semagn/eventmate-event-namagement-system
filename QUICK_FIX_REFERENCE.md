# Quick Fix Reference Card

## 🚨 CRITICAL: Restart Backend Server

```bash
cd backend
npm start
```

**Why?** New registration endpoints were added and require server restart.

---

## ✅ What Was Fixed

### 1. Event Registration (Reserve Spot)
- **Issue**: "Endpoint not found" error
- **Fix**: Added `POST /events/:id/register` endpoint
- **Status**: ✅ Fixed (requires backend restart)

### 2. Location Picker in Edit Dialog
- **Issue**: Couldn't update event location when editing
- **Fix**: Added LocationPicker component to edit dialog
- **Status**: ✅ Fixed (no restart needed)

### 3. Map Display on User Side
- **Issue**: Map not displaying correctly
- **Fix**: Enhanced LocationMap with better error handling
- **Status**: ✅ Fixed (no restart needed)

---

## 🧪 Quick Test

### Test Registration (After Backend Restart)
1. Go to: `http://localhost:3000/events/[any-event-id]`
2. Click "Reserve Spot" button
3. ✅ Should see success message
4. ❌ If still "endpoint not found" → backend not restarted

### Test Location Picker
1. Go to: `http://localhost:3000/organiser/events`
2. Click Edit (pencil icon) on any event
3. Scroll down to "Event Location"
4. ✅ Should see interactive map
5. Click map to update location

### Test Location Display
1. Go to: `http://localhost:3000/events/[any-event-id]`
2. Scroll to "Event Location" section
3. ✅ Should see map with marker
4. ❌ If no map → event has no coordinates

---

## 📊 Database Queries

### Check Registration
```sql
SELECT * FROM registrations 
WHERE user_id = [your_user_id] 
ORDER BY timestamp DESC;
```

### Check Event Coordinates
```sql
SELECT id, title, location_latitude, location_longitude 
FROM events 
WHERE id = [event_id];
```

### Check Activity Logs
```sql
SELECT * FROM activity_logs 
WHERE action LIKE '%register%' 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## 🐛 Troubleshooting

### "Endpoint not found" still appears
→ Backend server not restarted
→ Check backend is running on port 3001

### Map not displaying
→ Check browser console for errors
→ Verify event has coordinates in database
→ Check internet connection (for map tiles)

### "Locate Me" not working
→ Grant browser location permission
→ Use HTTPS or localhost
→ Check browser console for geolocation errors

### Coordinates not saving
→ Check Network tab for failed requests
→ Verify backend is running
→ Check backend console for errors

---

## 📝 Files Modified

```
backend/routes/events.js          ← Registration endpoints added
frontend/app/organiser/events/page.tsx  ← LocationPicker added
frontend/components/LocationMap.tsx     ← Debug logging added
frontend/app/events/[id]/page.tsx       ← Debug logging added
```

---

## 🎯 Success Indicators

✅ Backend starts without errors
✅ Can register for free events
✅ Can edit event location
✅ Maps display with tiles
✅ No console errors

---

## 📚 Full Documentation

- `SESSION_SUMMARY.md` - Complete overview
- `REGISTRATION_ENDPOINT_FIX.md` - Registration details
- `LEAFLET_MAP_FIX_SUMMARY.md` - Location features
- `TESTING_GUIDE.md` - Comprehensive testing

---

**Remember**: Restart backend server first! 🔄
