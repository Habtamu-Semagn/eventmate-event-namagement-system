# Authentication Persistence Fix

## Issue
Users were being logged out and redirected to the login page whenever they refreshed the page, even though their session should still be valid.

## Root Cause
The API error handling was too aggressive with 401 (Unauthorized) responses. It was automatically removing the auth token and redirecting to login for ANY 401 error, including:
- Permission denied errors (user doesn't have access to a resource)
- Role-based access control failures
- Other authorization issues that don't mean the token is invalid

This meant that if any API call returned a 401 for any reason, the user would be logged out immediately.

## Solution
Modified the 401 error handling to be more selective. Now it only removes the token and redirects to login if the error is specifically related to token authentication:

### Token-Related Errors (triggers logout):
- `"Token expired"` - JWT token has expired
- `"Invalid token"` - JWT token is malformed or invalid
- `"No token provided"` - No authentication token was sent

### Other 401 Errors (does NOT trigger logout):
- Permission denied
- Insufficient privileges
- Resource access denied
- Any other authorization failure

## Files Modified

### `frontend/lib/api.ts`

#### Before:
```typescript
// Handle 401 - Unauthorized
if (response.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
}
```

#### After:
```typescript
// Handle 401 - Unauthorized
if (response.status === 401) {
    const data = await response.json().catch(() => ({ message: 'Unauthorized' }));
    
    // Only remove token and redirect if it's a token-related issue
    if (data.message === 'Token expired' || 
        data.message === 'Invalid token' || 
        data.message === 'No token provided') {
        removeToken();
        removeUser();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }
    
    const error: any = new Error(data.message || 'Unauthorized');
    error.errors = data.errors;
    throw error;
}
```

## How It Works Now

### Scenario 1: Valid Token, Page Refresh
1. User is logged in with valid token
2. User refreshes page
3. AuthContext loads token from localStorage
4. Calls `/auth/me` to get current user
5. Token is valid → User stays logged in ✅

### Scenario 2: Expired Token
1. User's token expires (after 24 hours)
2. Any API call returns 401 with message "Token expired"
3. Token is removed from localStorage
4. User is redirected to login page ✅

### Scenario 3: Invalid Token
1. Token is corrupted or tampered with
2. API call returns 401 with message "Invalid token"
3. Token is removed from localStorage
4. User is redirected to login page ✅

### Scenario 4: Permission Denied (NEW BEHAVIOR)
1. User tries to access admin-only resource
2. API returns 401 with message "Insufficient privileges"
3. Token is NOT removed (it's still valid)
4. User sees error message but stays logged in ✅

## Token Expiration
- Default: 24 hours
- Configurable via `JWT_EXPIRES_IN` environment variable
- Format: `'24h'`, `'7d'`, `'30m'`, etc.

## Authentication Flow

### Login
1. User enters credentials
2. Backend validates and generates JWT token
3. Token stored in localStorage as `eventmate_token`
4. User info stored in localStorage as `eventmate_user`
5. AuthContext updates state

### Page Load/Refresh
1. AuthContext checks localStorage for token
2. If token exists, calls `/auth/me` endpoint
3. Backend validates token
4. If valid, returns user info
5. AuthContext updates state with user
6. User remains logged in

### Logout
1. User clicks logout
2. Token removed from localStorage
3. User info removed from localStorage
4. AuthContext clears state
5. Redirect to home/login

## Testing

### Test 1: Page Refresh with Valid Token
1. Log in to the application
2. Navigate to any page
3. Refresh the page (F5 or Ctrl+R)
4. **Expected**: User stays logged in, page loads normally

### Test 2: Token Expiration
1. Log in to the application
2. Wait 24 hours (or modify JWT_EXPIRES_IN to '1m' for testing)
3. Try to access any protected resource
4. **Expected**: Redirected to login page with "Token expired" message

### Test 3: Invalid Token
1. Log in to the application
2. Open browser DevTools → Application → Local Storage
3. Modify the `eventmate_token` value to something invalid
4. Refresh the page
5. **Expected**: Redirected to login page

### Test 4: Permission Denied
1. Log in as regular user
2. Try to access admin-only endpoint
3. **Expected**: Error message shown, but user stays logged in

## Browser Storage

### localStorage Keys
- `eventmate_token` - JWT authentication token
- `eventmate_user` - User information (JSON string)

### Data Persistence
- Survives page refreshes
- Survives browser restarts
- Cleared on logout
- Cleared on token expiration
- Cleared on invalid token

## Security Considerations

### Token Storage
- Stored in localStorage (accessible to JavaScript)
- Alternative: httpOnly cookies (more secure but requires backend changes)
- XSS protection: Sanitize all user inputs
- CSRF protection: Use CSRF tokens for state-changing operations

### Token Validation
- Backend validates token on every request
- Checks signature, expiration, and user existence
- Returns specific error messages for debugging

### Best Practices
- Use HTTPS in production
- Set reasonable token expiration (24h is good)
- Implement refresh tokens for longer sessions
- Log security events (failed logins, token tampering)

## Future Enhancements

### 1. Refresh Tokens
- Issue long-lived refresh token
- Use short-lived access tokens (15 minutes)
- Automatically refresh access token before expiration
- Better security and user experience

### 2. Remember Me
- Optional longer expiration (7 days, 30 days)
- Checkbox on login form
- Store preference in localStorage

### 3. Session Management
- Track active sessions
- Allow users to view/revoke sessions
- Logout from all devices

### 4. Token Refresh Before Expiration
- Check token expiration on app load
- Refresh token if expiring soon (< 1 hour)
- Seamless user experience

## Troubleshooting

### Issue: Still getting logged out on refresh
**Solution**: 
- Clear browser cache and localStorage
- Check browser console for errors
- Verify backend is running
- Check JWT_SECRET is set in backend .env

### Issue: Token expired too quickly
**Solution**:
- Check JWT_EXPIRES_IN in backend .env
- Default is 24h, increase if needed
- Consider implementing refresh tokens

### Issue: "Invalid token" error
**Solution**:
- Token might be corrupted
- Clear localStorage and login again
- Check JWT_SECRET matches between login and validation

## Summary

✅ Fixed automatic logout on page refresh
✅ Token persists across page reloads
✅ Only logs out on actual token issues
✅ Better error handling for 401 responses
✅ Improved user experience

The authentication system now correctly distinguishes between token authentication failures (which require re-login) and other authorization failures (which don't).
