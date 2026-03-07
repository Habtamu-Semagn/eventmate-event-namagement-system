# Bugfix Requirements Document

## Introduction

This bugfix addresses the issue where images uploaded during event creation on the organizer dashboard are not appearing on the /events route. The root cause is that the POST /events endpoint ignores the image_url field from the request body and does not persist it to the database, despite the events table having an image_url column available. This results in event cards displaying without images even though the images were successfully uploaded to the server.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN an organizer uploads an image during event creation AND submits the event form with the returned image_url THEN the system does not save the image_url to the database

1.2 WHEN the POST /events endpoint receives an event creation request containing an image_url field THEN the system ignores this field and only persists title, description, category, date, time, location_venue, location_latitude, location_longitude, organizer_id, capacity, and is_paid fields

1.3 WHEN the /events page retrieves events from the database THEN the system returns null or empty image_url values causing event cards to display without images

### Expected Behavior (Correct)

2.1 WHEN an organizer uploads an image during event creation AND submits the event form with the returned image_url THEN the system SHALL save the image_url to the database in the events table

2.2 WHEN the POST /events endpoint receives an event creation request containing an image_url field THEN the system SHALL persist the image_url value to the database along with other event fields

2.3 WHEN the /events page retrieves events from the database THEN the system SHALL return the stored image_url values allowing event cards to display the uploaded images

### Unchanged Behavior (Regression Prevention)

3.1 WHEN an organizer creates an event without uploading an image THEN the system SHALL CONTINUE TO create the event successfully with a null or empty image_url

3.2 WHEN the POST /events endpoint receives an event creation request THEN the system SHALL CONTINUE TO validate and persist all existing fields (title, description, category, date, time, location_venue, location_latitude, location_longitude, organizer_id, capacity, is_paid) correctly

3.3 WHEN the /events/upload endpoint receives an image upload THEN the system SHALL CONTINUE TO save the image to /backend/uploads/ and return the correct image URL

3.4 WHEN the /events page retrieves and displays events THEN the system SHALL CONTINUE TO render all other event information (title, description, date, location, etc.) correctly
