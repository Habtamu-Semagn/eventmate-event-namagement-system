# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Image URL Persistence
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases - event creation requests with image_url field
  - Test that POST /events with image_url in request body persists image_url to database
  - The test assertions should verify: dbRecord.image_url == request.body.image_url AND response.data.event.image_url == request.body.image_url
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found (e.g., "POST /events with image_url='/uploads/test.jpg' stores NULL in database instead of '/uploads/test.jpg'")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Existing Event Creation Behavior
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for event creation without image_url
  - Write property-based tests capturing observed behavior patterns:
    - All existing fields (title, description, category, date, time, location_venue, location_latitude, location_longitude, organizer_id, capacity, is_paid) persist correctly
    - Status is always 'Pending'
    - Response format is unchanged (201 status, success/message/data structure)
    - Validation rules continue to work (required fields, data types)
    - Default values still apply (capacity=0, is_paid=false)
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 3. Fix for image_url persistence in POST /events endpoint

  - [x] 3.1 Implement the fix in backend/routes/events.js
    - Add `image_url` to destructuring from req.body (lines 626-637)
    - Add `image_url` to INSERT column list after `is_paid` (line 643-646)
    - Add `$12` parameter to VALUES clause after `$11` (line 647)
    - Add `image_url || null` to query parameter array as last element (line 648-659)
    - _Bug_Condition: isBugCondition(input) where input.method == 'POST' AND input.path == '/events' AND input.body.image_url IS NOT NULL AND input.body.image_url != ''_
    - _Expected_Behavior: For any event creation request where image_url is provided, the endpoint SHALL persist the image_url value to the database and return it in the created event object_
    - _Preservation: All existing event creation behavior (validation, status assignment, logging, response format) must remain unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4_

  - [x] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Image URL Persistence
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Existing Event Creation Behavior
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
