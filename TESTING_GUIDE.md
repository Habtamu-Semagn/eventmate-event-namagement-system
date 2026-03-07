# Leaflet Map Integration - Testing Guide

## Prerequisites
1. Backend server running on `http://localhost:3001`
2. Frontend server running on `http://localhost:3000`
3. Logged in as an Organizer or Administrator

## Test 1: Create New Event with Location

### Steps:
1. Navigate to `/organiser/create`
2. Fill in Step 1 (Basic Info):
   - Title: "Test Event with Map"
   - Description: "Testing location picker"
   - Category: Select any
3. Click "Next" to Step 2 (Date & Location)
4. Fill in date, time, and venue name
5. **Test LocationPicker**:
   - Observe: Map should load with tiles visible
   - Click "Locate Me" button
   - Observe: Map should center on your current location
   - Click anywhere on the map
   - Observe: Marker should appear at clicked location
   - Observe: Latitude/Longitude fields should update
6. Complete remaining steps and create event
7. Navigate to `/organiser/events`
8. Find your created event and note the ID

### Expected Results:
- ✅ Map displays with full tiles (not just marker icon)
- ✅ "Locate Me" button centers map on user location
- ✅ Clicking map places marker at exact click location
- ✅ Coordinate fields update automatically
- ✅ Event is created successfully

## Test 2: Edit Event Location

### Steps:
1. Navigate to `/organiser/events`
2. Click the Edit icon (pencil) on any event
3. Scroll down in the edit dialog to "Event Location" section
4. **Test LocationPicker in Edit Mode**:
   - Observe: Map should show current event location
   - Click a different location on the map
   - Observe: Marker moves to new location
   - Observe: Coordinate fields update
5. Click "Save Changes"
6. Refresh the page
7. Click Edit again on the same event
8. Verify the location was saved

### Expected Results:
- ✅ Edit dialog opens with scrollable content
- ✅ LocationPicker displays current event location
- ✅ Can update location by clicking map
- ✅ Changes are saved successfully
- ✅ Location persists after page refresh

## Test 3: View Event Location (User Side)

### Steps:
1. Navigate to `/events`
2. Click "BOOK NOW" on any event (or click the event card)
3. Scroll down to "Event Location" section
4. **Test LocationMap Display**:
   - Observe: Map should display with full tiles
   - Observe: Marker should be at correct location
   - Try zooming in/out
   - Try panning the map
   - Click the marker to see popup with venue name

### Expected Results:
- ✅ Map displays correctly with tiles loaded
- ✅ Marker appears at event location
- ✅ Map is interactive (zoom, pan work)
- ✅ Popup shows venue name when marker is clicked
- ✅ No console errors

## Test 4: Debug Console Logs

### Steps:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to any event detail page (`/events/[id]`)
4. Look for console logs

### Expected Console Output:
```
Event data received: {id: 668, title: "...", location_latitude: "...", ...}
Location coordinates: {latitude: "9.0320", longitude: "38.7469", venue: "..."}
LocationMap props: {latitude: 9.032, longitude: 38.7469, lat: 9.032, lng: 38.7469, locationName: "..."}
```

### Expected Results:
- ✅ Event data shows location_latitude and location_longitude
- ✅ Coordinates are valid numbers (not null/undefined)
- ✅ LocationMap receives correct props
- ✅ No Leaflet errors in console

## Test 5: Edge Cases

### Test 5a: Event Without Location
1. Create/edit an event
2. Leave location coordinates empty
3. View event detail page
4. **Expected**: No map section should appear

### Test 5b: Invalid Coordinates
1. Edit an event
2. Manually enter invalid coordinates (e.g., latitude: 999)
3. Save changes
4. View event detail page
5. **Expected**: "Location not available" message

### Test 5c: Geolocation Denied
1. Block geolocation permission in browser
2. Create new event
3. Click "Locate Me" button
4. **Expected**: Alert message about location services
5. **Expected**: Map defaults to Addis Ababa

## Troubleshooting

### Issue: Map shows only marker icon, no tiles
**Solution**: 
- Check internet connection
- Check browser console for tile loading errors
- Verify Leaflet CSS is loaded (check Network tab)

### Issue: "Locate Me" doesn't work
**Solution**:
- Check browser geolocation permission
- Try on HTTPS (geolocation requires secure context)
- Check console for geolocation errors

### Issue: Coordinates not saving
**Solution**:
- Check browser console for API errors
- Verify backend is running
- Check Network tab for failed PUT/POST requests
- Verify location_latitude and location_longitude are in request payload

### Issue: Map not displaying in edit dialog
**Solution**:
- Check if dialog has overflow-y-auto class
- Scroll down in the dialog
- Check console for component errors

## Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Maps display with full tiles
- ✅ Markers appear at correct locations
- ✅ Coordinates save and persist
- ✅ User experience is smooth and intuitive

## Browser Compatibility

Tested on:
- Chrome/Edge (Chromium)
- Firefox
- Safari

Note: Geolocation may behave differently on different browsers.
