# Fix User Profile Document ID Mismatch

## Problem
The User UID from Firebase Authentication (`YlrmM4wZdwYVSUvw3O7YktPMEX52`) doesn't match the Document ID in Firestore (`Q7dJtG8kcDhV149qHe00`).

## Solution
You need to create a new document in Firestore with the correct User UID as the document ID.

## Steps to Fix:

1. **Go to Firestore Database** in Firebase Console
2. **Navigate to the cms_users collection**
3. **Delete the existing document** with ID `Q7dJtG8kcDhV149qHe00`
4. **Create a new document** with these exact details:
   - **Document ID**: `YlrmM4wZdwYVSUvw3O7YktPMEX52` (use the User UID from Authentication)
   - **Fields**:
     - `name` (string): `"vijay"`
     - `email` (string): `"vijay@edstellar.com"`
     - `role` (string): `"administrator"`
     - `status` (string): `"active"`
     - `created_at` (timestamp): Current timestamp
     - `updated_at` (timestamp): Current timestamp
     - `last_login` (timestamp): Leave empty/null

5. **Save the document**

## Important Notes:
- The Document ID in Firestore MUST exactly match the User UID from Firebase Authentication
- This is how the application links the authenticated user to their profile data
- After fixing this, the login should work with `vijay@edstellar.com` / `pass123`

## Verification:
After creating the new document, try logging in again. The error should be resolved.